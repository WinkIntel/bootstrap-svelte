// Read-only verification: this helper has no npm-publish or GitHub-write operation.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, lstatSync, rmSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
    repository,
    packageName,
    verifyRun,
    releaseIdentity,
    verifyPublication,
    changelogNotes,
    retryRegistry,
    validateReport
} from './release-page.mjs';
import { verifySourceHistory } from './release-policy.mjs';

const fail = (message) => {
    throw new Error(message);
};
const gh = (path) =>
    JSON.parse(
        execFileSync('gh', ['api', `repos/${repository}${path}`], {
            encoding: 'utf8',
            maxBuffer: 16 * 1024 * 1024,
            stdio: ['ignore', 'pipe', 'pipe']
        })
    );
function allPages(path, key) {
    const values = [];
    for (let page = 1; page <= 100; page++) {
        const data = gh(`${path}?per_page=100&page=${page}`)[key];
        if (!Array.isArray(data)) fail('Unexpected GitHub response');
        values.push(...data);
        if (data.length < 100) return values;
    }
    fail('Too many GitHub records');
}
export function selectArtifact(artifacts, run) {
    const matches = artifacts.filter((item) => item.name === `npm-release-${run.id}-${run.run_attempt}`);
    if (matches.length !== 1) fail('Expected one original publish artifact; do not rebuild or republish');
    const artifact = matches[0];
    if (
        artifact.expired ||
        !Number.isSafeInteger(artifact.id) ||
        artifact.size_in_bytes > 64 * 1024 * 1024 ||
        artifact.workflow_run?.id !== run.id ||
        artifact.workflow_run.head_sha !== run.head_sha ||
        artifact.workflow_run.repository_id !== 1263210535 ||
        artifact.workflow_run.head_repository_id !== 1263210535
    )
        fail('Original publish artifact is expired or has conflicting identity; manual provenance review is required, never republish');
    return artifact;
}
export async function registryJSON(path) {
    const response = await fetch(`https://registry.npmjs.org/${path}`, { redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (response.status === 404) return null;
    if (!response.ok) fail(`Registry HTTP ${response.status}`);
    return response.json();
}
async function publishedTarball(url) {
    const parsed = new URL(url);
    if (parsed.origin !== 'https://registry.npmjs.org' || parsed.username || parsed.password) fail('Unexpected package registry host');
    const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000) });
    if (response.status === 404) return null;
    if (!response.ok) fail(`Registry tarball HTTP ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
}
function sourceFile(path, sha) {
    const data = gh(`/contents/${path}?ref=${sha}`);
    if (data.encoding !== 'base64' || data.type !== 'file') fail('Unexpected source file');
    return Buffer.from(data.content, 'base64').toString('utf8');
}
export async function verifyPublishedRun(runId, attempt) {
    if (!/^[1-9][0-9]{0,19}$/.test(runId ?? '') || !/^[1-9][0-9]{0,19}$/.test(attempt ?? ''))
        fail('Provide the original numeric publish run ID and attempt');
    const run = gh(`/actions/runs/${runId}/attempts/${attempt}`);
    const identity = verifyRun(run, allPages(`/actions/runs/${runId}/attempts/${attempt}/jobs`, 'jobs'), runId, attempt);
    const manifest = JSON.parse(sourceFile('package.json', identity.sha));
    if (manifest.name !== packageName) fail('Unexpected source package');
    const release = releaseIdentity({ ...identity, version: manifest.version });
    verifySourceHistory(release);
    const artifact = selectArtifact(allPages(`/actions/runs/${runId}/artifacts`, 'artifacts'), run);
    const temporary = mkdtempSync(join(tmpdir(), 'release-page-verify-'));
    try {
        const directory = join(temporary, 'artifact');
        execFileSync('gh', ['run', 'download', runId, '--repo', repository, '--name', artifact.name, '--dir', directory], {
            stdio: ['ignore', 'pipe', 'pipe']
        });
        const files = readdirSync(directory);
        const path = join(directory, 'release.tgz');
        if (files.length !== 1 || files[0] !== 'release.tgz' || !lstatSync(path).isFile()) fail('Expected one regular original tarball');
        const tarball = readFileSync(path);
        const entries = execFileSync('tar', ['-tzf', path], { encoding: 'utf8' }).trim().split('\n');
        if (entries.filter((entry) => entry === 'package/package.json').length !== 1) fail('Expected one package manifest in original artifact');
        const pkg = JSON.parse(execFileSync('tar', ['-xOzf', path, 'package/package.json'], { encoding: 'utf8' }));
        if (pkg.name !== release.name || pkg.version !== release.version) fail('Original artifact package mismatch');
        const encoded = encodeURIComponent(packageName);
        const metadata = await retryRegistry(async () => {
            const data = await registryJSON(`${encoded}/${encodeURIComponent(release.version)}`);
            return data?.dist?.attestations?.url ? data : null;
        });
        const published = await retryRegistry(() => publishedTarball(metadata.dist.tarball));
        if (!tarball.equals(published)) fail('Published bytes differ from the original approved artifact');
        // Install only to let npm verify signatures/provenance. No lifecycle scripts, source build, OIDC or App credentials.
        const cleanEnv = Object.fromEntries(
            Object.entries(process.env).filter(
                ([key]) => !/^npm_/i.test(key) && !['NODE_AUTH_TOKEN', 'NPM_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN', 'NODE_OPTIONS'].includes(key)
            )
        );
        const emptyConfig = join(temporary, 'empty.npmrc');
        writeFileSync(emptyConfig, '');
        const env = {
            ...cleanEnv,
            NPM_CONFIG_USERCONFIG: emptyConfig,
            NPM_CONFIG_GLOBALCONFIG: join(temporary, 'global.npmrc'),
            NPM_CONFIG_CACHE: join(temporary, 'cache'),
            NPM_CONFIG_REGISTRY: 'https://registry.npmjs.org',
            NPM_CONFIG_IGNORE_SCRIPTS: 'true'
        };
        writeFileSync(env.NPM_CONFIG_GLOBALCONFIG, '');
        writeFileSync(join(temporary, 'package.json'), JSON.stringify({ name: 'release-page-verification', version: '0.0.0', private: true }));
        const npmVersion = execFileSync('npm', ['--version'], { env, encoding: 'utf8' }).trim().split('.').map(Number);
        if (!(npmVersion[0] > 11 || (npmVersion[0] === 11 && (npmVersion[1] > 5 || (npmVersion[1] === 5 && npmVersion[2] >= 1)))))
            fail('npm >= 11.5.1 required for provenance verification');
        execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--save-exact', `${packageName}@${release.version}`], {
            cwd: temporary,
            env,
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 180000
        });
        const audit = JSON.parse(
            execFileSync('npm', ['audit', 'signatures', '--json', '--include-attestations'], {
                cwd: temporary,
                env,
                encoding: 'utf8',
                maxBuffer: 16 * 1024 * 1024,
                timeout: 180000
            })
        );
        const hashes = verifyPublication({ release, tarball, metadata, audit, runId, attempt });
        const publishedAt = await retryRegistry(async () => (await registryJSON(encoded))?.time?.[release.version] ?? null);
        const notes = changelogNotes(sourceFile('CHANGELOG.md', release.sha), release, publishedAt, runId, attempt);
        return validateReport({ schema: 1, ...release, ...hashes, runId, attempt, publishedAt, notes });
    } finally {
        rmSync(temporary, { recursive: true, force: true });
    }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const report = await verifyPublishedRun(process.env.PUBLISH_RUN_ID, process.env.PUBLISH_RUN_ATTEMPT);
        if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `report=${JSON.stringify(report)}\n`);
        console.log(JSON.stringify(report));
    } catch (error) {
        console.error(
            `Release-page verification failed: ${error.message}. Do not rerun npm publication; use release-page recovery for the original run/attempt.`
        );
        process.exitCode = 1;
    }
}

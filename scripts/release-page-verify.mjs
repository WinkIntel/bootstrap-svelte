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
    verifyBuildRun,
    positiveId,
    releaseIdentity,
    verifyPublication,
    verifyArtifactMetadata,
    changelogNotes,
    registryRead,
    registryURL,
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
// The registry's version, tarball, packument and attestation views can become visible separately.
// This budget is shared by every registry read and npm command, within the 15-minute job.
function registryReadiness(target) {
    const started = Date.now(),
        deadline = started + 600000;
    const exhausted = (stage) =>
        fail(`Registry readiness timeout after 600000ms for ${target}; stage=${stage}; use release-page recovery, never npm publish`);
    const remaining = (stage, cap) => {
        const budget = deadline - Date.now();
        if (budget <= 0) exhausted(stage);
        return Math.min(budget, cap);
    };
    const read = (stage, url, kind = 'json') =>
        registryRead(url, kind, fetch, { timeout: remaining(stage, kind === 'bytes' ? 30000 : 15000), fresh: true });
    const wait = async (stage, operation) => {
        for (let attempt = 1; ; attempt++) {
            remaining(stage, Infinity);
            let result;
            try {
                result = await operation();
            } catch (error) {
                throw new Error(`Registry verification failed for ${target}; stage=${stage}: ${error.message}`, { cause: error });
            }
            if (result !== null) return result;
            const budget = remaining(stage, Infinity);
            console.info(
                `Registry readiness: ${target}; stage=${stage}; attempt=${attempt}; elapsed=${Date.now() - started}ms; remaining=${budget}ms`
            );
            await new Promise((resolve) => setTimeout(resolve, Math.min(15000, budget)));
        }
    };
    return { read, wait, remaining };
}
// Only npm's structured errors for this exact release are visibility failures.
// Auth, dependency resolution, signatures, integrity and malformed output are never retried.
function npmVisibilityFailure(error, target, urls) {
    let data;
    try {
        data = JSON.parse(String(error.stdout)).error;
    } catch {
        return false;
    }
    if (data?.code === 'ETARGET') return data.summary?.trim() === `No matching version found for ${target}.`;
    if (data?.code !== 'E404' || typeof data.summary !== 'string') return false;
    const match = /^(?:404 )?Not Found - GET (https:\/\/\S+?)(?: - [^\n]*)?$/.exec(data.summary.trim());
    if (!match) return false;
    const normalized = (value) => {
        const url = registryURL(value);
        return `${url.origin}${decodeURIComponent(url.pathname)}${url.search}`;
    };
    try {
        return urls.some((url) => normalized(url) === normalized(match[1]));
    } catch {
        return false;
    }
}
function npmProvenanceAbsent(audit, name) {
    const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
    const text = (value) => typeof value === 'string' && value.trim().length > 0;
    // Only check generic statement structure here; unrelated dependencies need not use our source or predicate.
    const proof = (entry, attestations) => {
        if (
            !text(entry?.predicateType) ||
            !text(entry.bundle?.dsseEnvelope?.payload) ||
            !Object.values(attestations).some((item) => object(item) && item.predicateType === entry.predicateType)
        )
            return false;
        let statement;
        try {
            statement = JSON.parse(Buffer.from(entry.bundle.dsseEnvelope.payload, 'base64').toString('utf8'));
        } catch {
            return false;
        }
        return (
            object(statement) &&
            text(statement._type) &&
            statement.predicateType === entry.predicateType &&
            object(statement.predicate) &&
            Array.isArray(statement.subject) &&
            statement.subject.length > 0 &&
            statement.subject.every(
                (item) =>
                    object(item) &&
                    text(item.name) &&
                    object(item.digest) &&
                    Object.keys(item.digest).length > 0 &&
                    Object.values(item.digest).every(text)
            )
        );
    };
    return (
        object(audit) &&
        Array.isArray(audit.invalid) &&
        !audit.invalid.length &&
        Array.isArray(audit.missing) &&
        !audit.missing.length &&
        Array.isArray(audit.verified) &&
        audit.verified.every(
            (item) =>
                object(item) &&
                typeof item.name === 'string' &&
                item.name.length > 0 &&
                item.name !== name &&
                typeof item.version === 'string' &&
                item.version.length > 0 &&
                ['https://registry.npmjs.org/', 'https://registry.npmjs.org'].includes(item.registry) &&
                object(item.attestations) &&
                Array.isArray(item.attestationBundles) &&
                item.attestationBundles.length > 0 &&
                item.attestationBundles.every((entry) => proof(entry, item.attestations))
        )
    );
}
function sourceFile(path, sha) {
    const data = gh(`/contents/${path}?ref=${sha}`);
    if (data.encoding !== 'base64' || data.type !== 'file') fail('Unexpected source file');
    return Buffer.from(data.content, 'base64').toString('utf8');
}
export async function verifyPublishedRun(runId, attempt, buildAttempt) {
    if (!positiveId(runId) || !positiveId(attempt) || !positiveId(buildAttempt) || BigInt(buildAttempt) > BigInt(attempt))
        fail('Provide the original numeric run ID, successful publish attempt and artifact build attempt');
    const run = gh(`/actions/runs/${runId}/attempts/${attempt}`);
    const identity = verifyRun(run, allPages(`/actions/runs/${runId}/attempts/${attempt}/jobs`, 'jobs'), runId, attempt);
    const buildRun = gh(`/actions/runs/${runId}/attempts/${buildAttempt}`);
    const buildIdentity = verifyBuildRun(buildRun, allPages(`/actions/runs/${runId}/attempts/${buildAttempt}/jobs`, 'jobs'), runId, buildAttempt);
    if (buildIdentity.sha !== identity.sha || buildIdentity.ref !== identity.ref) fail('Build/publish source mismatch');
    const manifest = JSON.parse(sourceFile('package.json', identity.sha));
    if (manifest.name !== packageName) fail('Unexpected source package');
    const release = releaseIdentity({ ...identity, version: manifest.version });
    verifySourceHistory(release);
    const artifact = selectArtifact(allPages(`/actions/runs/${runId}/artifacts`, 'artifacts'), buildRun);
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
        const changelog = sourceFile('CHANGELOG.md', release.sha);
        const encoded = encodeURIComponent(packageName);
        const target = `${packageName}@${release.version}`;
        const ready = registryReadiness(target);
        const versionURL = `https://registry.npmjs.org/${encoded}/${encodeURIComponent(release.version)}`;
        const packumentURL = `https://registry.npmjs.org/${encoded}`;
        const readMetadata = async (stage) => {
            const data = await ready.read(stage, versionURL);
            if (data === null) return null;
            verifyArtifactMetadata({ release, tarball, metadata: data });
            registryURL(data.dist.tarball);
            const pointer = data.dist.attestations;
            if (pointer === undefined) return null;
            if (!pointer || typeof pointer !== 'object' || Array.isArray(pointer)) fail('Malformed registry attestations pointer');
            registryURL(pointer.url);
            return data;
        };
        const metadata = await ready.wait('version-metadata', () => readMetadata('version-metadata'));
        const published = await ready.wait('tarball', () => ready.read('tarball', metadata.dist.tarball, 'bytes'));
        if (!tarball.equals(published)) fail('Published bytes differ from the original approved artifact');
        const readPackument = async (stage) => {
            const data = await ready.read(stage, packumentURL);
            if (data === null) return null;
            if (
                data.name !== packageName ||
                !data.versions ||
                typeof data.versions !== 'object' ||
                Array.isArray(data.versions) ||
                !data.time ||
                typeof data.time !== 'object' ||
                Array.isArray(data.time)
            )
                fail('Malformed registry packument');
            if (!Object.hasOwn(data.versions, release.version) || !Object.hasOwn(data.time, release.version)) return null;
            verifyArtifactMetadata({ release, tarball, metadata: data.versions[release.version] });
            const publishedAt = data.time[release.version];
            const notes = changelogNotes(changelog, release, publishedAt, runId, attempt);
            // npm/pacote reads this manifest independently and skips attestations when its pointer is absent.
            const pointer = data.versions[release.version].dist.attestations;
            if (pointer === undefined) return null;
            if (!pointer || typeof pointer !== 'object' || Array.isArray(pointer)) fail('Malformed registry attestations pointer');
            registryURL(pointer.url);
            return { publishedAt, notes };
        };
        const { publishedAt, notes } = await ready.wait('packument', () => readPackument('packument'));
        await ready.wait('attestations', async () => {
            const data = await ready.read('attestations', metadata.dist.attestations.url);
            if (data === null) return null;
            if (
                !Array.isArray(data.attestations) ||
                !data.attestations.length ||
                data.attestations.some((item) => !item?.predicateType || !item.bundle)
            )
                fail('Malformed registry attestations');
            return data;
        });
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
            NPM_CONFIG_CACHE: join(temporary, 'cache-version'),
            NPM_CONFIG_REGISTRY: 'https://registry.npmjs.org',
            NPM_CONFIG_IGNORE_SCRIPTS: 'true'
        };
        writeFileSync(env.NPM_CONFIG_GLOBALCONFIG, '');
        writeFileSync(join(temporary, 'package.json'), JSON.stringify({ name: 'release-page-verification', version: '0.0.0', private: true }));
        const npmVersion = execFileSync('npm', ['--version'], {
            env,
            encoding: 'utf8',
            timeout: ready.remaining('npm-version', 15000),
            killSignal: 'SIGKILL'
        })
            .trim()
            .split('.')
            .map(Number);
        if (!(npmVersion[0] > 11 || (npmVersion[0] === 11 && (npmVersion[1] > 5 || (npmVersion[1] === 5 && npmVersion[2] >= 1)))))
            fail('npm >= 11.5.1 required for provenance verification');
        let installAttempt = 0;
        const urls = [versionURL, packumentURL, metadata.dist.tarball, metadata.dist.attestations.url];
        const refresh = async (stage) => (await readMetadata(stage)) !== null && (await readPackument(stage)) !== null;
        await ready.wait('npm-resolution', async () => {
            if (!(await refresh('npm-resolution'))) return null;
            // A failed install may leave a lockfile or negative cache entry. Resolve afresh on each attempt.
            rmSync(join(temporary, 'node_modules'), { recursive: true, force: true });
            rmSync(join(temporary, 'package-lock.json'), { force: true });
            env.NPM_CONFIG_CACHE = join(temporary, `cache-${++installAttempt}`);
            try {
                execFileSync(
                    'npm',
                    [
                        'install',
                        '--ignore-scripts',
                        '--omit=peer',
                        '--no-audit',
                        '--no-fund',
                        '--save-exact',
                        target,
                        '--json',
                        '--prefer-online',
                        '--fetch-retries=0'
                    ],
                    {
                        cwd: temporary,
                        env,
                        encoding: 'utf8',
                        maxBuffer: 16 * 1024 * 1024,
                        stdio: ['ignore', 'pipe', 'pipe'],
                        timeout: ready.remaining('npm-resolution', 180000),
                        killSignal: 'SIGKILL'
                    }
                );
                return true;
            } catch (error) {
                if (npmVisibilityFailure(error, target, urls)) return null;
                throw error;
            }
        });
        let auditAttempt = 0;
        const hashes = await ready.wait('npm-provenance', async () => {
            if (!(await refresh('npm-provenance'))) return null;
            env.NPM_CONFIG_CACHE = join(temporary, `cache-audit-${++auditAttempt}`);
            let audit;
            try {
                audit = JSON.parse(
                    execFileSync('npm', ['audit', 'signatures', '--json', '--include-attestations', '--prefer-online', '--fetch-retries=0'], {
                        cwd: temporary,
                        env,
                        encoding: 'utf8',
                        maxBuffer: 16 * 1024 * 1024,
                        timeout: ready.remaining('npm-provenance', 180000),
                        killSignal: 'SIGKILL'
                    })
                );
            } catch (error) {
                if (npmVisibilityFailure(error, target, urls)) return null;
                throw error;
            }
            // npm omits the target from verified when its independently fetched manifest has no pointer.
            // Wait only for that absence; any claimed target or invalid/malformed evidence fails closed.
            if (npmProvenanceAbsent(audit, release.name)) return null;
            return verifyPublication({ release, tarball, metadata, audit, runId, attempt });
        });
        return validateReport({ schema: 1, ...release, ...hashes, runId, attempt, buildAttempt, publishedAt, notes });
    } finally {
        rmSync(temporary, { recursive: true, force: true });
    }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const report = await verifyPublishedRun(process.env.PUBLISH_RUN_ID, process.env.PUBLISH_RUN_ATTEMPT, process.env.BUILD_RUN_ATTEMPT);
        if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `report=${JSON.stringify(report)}\n`);
        console.log(JSON.stringify(report));
    } catch (error) {
        console.error(
            `Release-page verification failed: ${error.message}. Do not rerun npm publication; use release-page recovery for the original run/attempt.`
        );
        process.exitCode = 1;
    }
}

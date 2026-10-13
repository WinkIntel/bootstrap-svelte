import { createHash } from 'node:crypto';
import { releasePolicy, changelogSection } from './release-policy.mjs';

export const repository = 'WinkIntel/bootstrap-svelte';
export const packageName = '@winkintel/bootstrap-svelte';
const fail = (message) => {
    throw new Error(message);
};
export const positiveId = (value) => typeof value === 'string' && /^[1-9][0-9]{0,19}$/.test(value);
const digest = (bytes, algorithm, encoding = 'hex') => createHash(algorithm).update(bytes).digest(encoding);
export function releaseIdentity({ version, sha, ref }) {
    const channel = version?.startsWith('1.') ? 'maintenance' : version?.includes('-') ? 'next' : 'latest';
    return { ...releasePolicy({ name: packageName, version, channel, sha, ref }), ref };
}
function verifyJobRun(run, jobs, runId, attempt, jobName) {
    if (
        !positiveId(runId) ||
        !positiveId(attempt) ||
        String(run.id) !== runId ||
        String(run.run_attempt) !== attempt ||
        run.repository?.full_name !== repository ||
        run.event !== 'workflow_dispatch' ||
        run.path !== '.github/workflows/publish.yml' ||
        !/^[a-f0-9]{40}$/.test(run.head_sha ?? '')
    )
        fail('Unexpected publish run identity');
    if (!['main', 'codex/maintenance-1.x'].includes(run.head_branch) && !/^v[12]\./.test(run.head_branch ?? '')) fail('Unapproved publish run ref');
    const published = jobs.filter(
        (job) => job.name === jobName && job.status === 'completed' && job.conclusion === 'success' && job.head_sha === run.head_sha
    );
    if (published.length !== 1) fail(`A successful ${jobName} job is required; dry runs cannot create releases`);
    return { sha: run.head_sha, ref: run.head_branch.startsWith('v') ? `refs/tags/${run.head_branch}` : `refs/heads/${run.head_branch}` };
}
export function verifyRun(run, jobs, runId, attempt) {
    return verifyJobRun(run, jobs, runId, attempt, 'Publish approved tarball');
}
export function verifyBuildRun(run, jobs, runId, attempt) {
    return verifyJobRun(run, jobs, runId, attempt, 'Build release artifact');
}
function validDate(value) {
    return (
        typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
        Number.isFinite(Date.parse(value)) &&
        new Date(value).toISOString() === value
    );
}
export function changelogNotes(text, release, publishedAt, runId, attempt) {
    if (!validDate(publishedAt) || !positiveId(runId) || !positiveId(attempt)) fail('Invalid publication date/run');
    const body = changelogSection(text, release.version);
    return `${body}\n\nPublished to npm: ${publishedAt} (UTC). [${packageName}@${release.version}](https://www.npmjs.com/package/${packageName}/v/${release.version}).\n\nSource: [${release.sha}](https://github.com/${repository}/commit/${release.sha}). [Publish run ${runId}, attempt ${attempt}](https://github.com/${repository}/actions/runs/${runId}/attempts/${attempt}).\n`;
}
export function verifyPublication({ release, tarball, metadata, audit, runId, attempt }) {
    if (!positiveId(runId) || !positiveId(attempt)) fail('Invalid publish run identity');
    const sha512 = digest(tarball, 'sha512');
    if (
        metadata.name !== release.name ||
        metadata.version !== release.version ||
        metadata.dist?.integrity !== `sha512-${digest(tarball, 'sha512', 'base64')}`
    )
        fail('Published artifact identity/integrity mismatch');
    if (!Array.isArray(audit.invalid) || !Array.isArray(audit.missing) || audit.invalid.length || audit.missing.length)
        fail('npm signature/provenance verification failed');
    const entries = audit.verified?.filter(
        (item) =>
            item.name === release.name &&
            item.version === release.version &&
            ['https://registry.npmjs.org/', 'https://registry.npmjs.org'].includes(item.registry)
    );
    if (entries?.length !== 1 || entries[0].attestations?.provenance?.predicateType !== 'https://slsa.dev/provenance/v1')
        fail('Expected package is not explicitly provenance-verified by npm');
    const bundles = entries[0].attestationBundles?.filter((item) => item.predicateType === 'https://slsa.dev/provenance/v1');
    if (bundles?.length !== 1) fail('Expected one verified provenance bundle');
    const statement = JSON.parse(Buffer.from(bundles[0].bundle.dsseEnvelope.payload, 'base64').toString('utf8'));
    const definition = statement.predicate?.buildDefinition,
        workflow = definition?.externalParameters?.workflow;
    if (
        definition?.buildType !== 'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1' ||
        workflow?.repository !== `https://github.com/${repository}` ||
        workflow.path !== '.github/workflows/publish.yml' ||
        workflow.ref !== release.ref
    )
        fail('Published provenance workflow/ref mismatch');
    const deps = definition.resolvedDependencies;
    if (deps?.length !== 1 || deps[0].uri !== `git+https://github.com/${repository}@${release.ref}` || deps[0].digest?.gitCommit !== release.sha)
        fail('Published provenance source mismatch');
    if (statement.predicate?.runDetails?.metadata?.invocationId !== `https://github.com/${repository}/actions/runs/${runId}/attempts/${attempt}`)
        fail('Published provenance run/attempt mismatch');
    if (
        statement.subject?.length !== 1 ||
        statement.subject[0].name !== `pkg:npm/%40winkintel/bootstrap-svelte@${release.version}` ||
        statement.subject[0].digest?.sha512 !== sha512
    )
        fail('Published provenance subject mismatch');
    return { sha256: digest(tarball, 'sha256'), sha512 };
}
export function validateReport(report) {
    if (!report || typeof report !== 'object') fail('Missing verified release report');
    const release = releaseIdentity(report);
    if (
        report.schema !== 1 ||
        report.name !== release.name ||
        report.channel !== release.channel ||
        report.branch !== release.branch ||
        !positiveId(report.runId) ||
        !positiveId(report.attempt) ||
        !positiveId(report.buildAttempt) ||
        BigInt(report.buildAttempt) > BigInt(report.attempt) ||
        !/^[a-f0-9]{64}$/.test(report.sha256 ?? '') ||
        !/^[a-f0-9]{128}$/.test(report.sha512 ?? '') ||
        !validDate(report.publishedAt) ||
        typeof report.notes !== 'string' ||
        !report.notes.trim() ||
        report.notes.length > 32000
    )
        fail('Invalid verified release report');
    return report;
}
export async function retryRegistry(read, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)), attempts = 12) {
    for (let index = 0; index < attempts; index++) {
        const value = await read();
        if (value !== null) return value;
        if (index + 1 < attempts) await sleep(15000);
    }
    fail('Registry propagation timeout; retry release-page recovery, never npm publish');
}
export async function registryRead(url, kind = 'json', fetcher = fetch) {
    const parsed = new URL(url);
    if (parsed.origin !== 'https://registry.npmjs.org' || parsed.username || parsed.password) fail('Unexpected package registry host');
    let response;
    try {
        response = await fetcher(url, { redirect: 'error', signal: AbortSignal.timeout(kind === 'bytes' ? 30000 : 15000) });
        if (response.status === 404 || response.status === 429 || (response.status >= 500 && response.status <= 599)) return null;
        if (!response.ok) fail(`Registry HTTP ${response.status}`);
        return kind === 'bytes' ? Buffer.from(await response.arrayBuffer()) : await response.json();
    } catch (error) {
        if (error.name === 'TimeoutError' || ['ETIMEDOUT', 'ECONNRESET', 'EAI_AGAIN'].includes(error.cause?.code)) return null;
        throw error;
    }
}
async function tagCommit(api, tag) {
    let value = await api(`/git/ref/tags/${encodeURIComponent(tag)}`);
    for (let depth = 0; value?.object?.type === 'tag' && depth < 5; depth++) value = await api(`/git/tags/${encodeURIComponent(value.object.sha)}`);
    if (value && value.object?.type !== 'commit') fail('Tag target conflict: unsupported tag object');
    return value?.object?.sha ?? null;
}
function stableVersion(tag) {
    const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(tag ?? '');
    return match?.slice(1).map(BigInt);
}
function notOlder(version, latest) {
    if (!latest) return true;
    const a = stableVersion(version),
        b = stableVersion(latest.tag_name);
    if (!a || !b) return false;
    for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
    return true;
}
export async function readyNpmLatest(report, read, sleep) {
    return retryRegistry(async () => {
        const latest = await read();
        if (report.channel !== 'latest') return latest ?? '';
        if (!latest) return null;
        if (!stableVersion(latest)) fail('Invalid npm latest dist-tag');
        return notOlder(latest, { tag_name: report.version }) ? latest : null;
    }, sleep);
}
function checkLatest(report, latest, expectedLatest) {
    const isLatest = latest?.tag_name === `v${report.version}`;
    if ((expectedLatest && !isLatest) || (report.channel !== 'latest' && isLatest))
        fail('GitHub latest status conflict; preserve existing releases for owner review');
}
function normalizedBody(body) {
    return typeof body === 'string' ? body.replace(/\r\n/g, '\n').replace(/\n+$/, '') : body;
}
function matchingRelease(existing, expected) {
    if (!existing) fail('GitHub release record missing after creation');
    if (
        existing.tag_name !== expected.tag_name ||
        existing.name !== expected.name ||
        normalizedBody(existing.body) !== normalizedBody(expected.body) ||
        existing.draft !== false ||
        existing.prerelease !== expected.prerelease
    )
        fail('Existing release conflict; preserve it for owner review');
    return existing;
}
export async function ensureRelease(report, api, npmLatest, { sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) } = {}) {
    validateReport(report);
    const tag = `v${report.version}`,
        expected = {
            tag_name: tag,
            target_commitish: report.sha,
            name: `Bootstrap Svelte ${report.version}`,
            body: report.notes,
            draft: false,
            prerelease: report.channel === 'next'
        };
    let target = await tagCommit(api, tag);
    if (target && target !== report.sha) fail('Existing tag source conflict; never move/delete a version tag');
    const latest = await api('/releases/latest');
    expected.make_latest = report.channel === 'latest' && npmLatest === report.version && notOlder(report.version, latest) ? 'true' : 'false';
    const existing = await api(`/releases/tags/${encodeURIComponent(tag)}`);
    if (existing) {
        if (target !== report.sha) fail('Existing release tag conflict');
        matchingRelease(existing, expected);
        checkLatest(report, latest, expected.make_latest === 'true');
        return existing;
    }
    if (!target) {
        try {
            await api('/git/refs', { method: 'POST', body: { ref: `refs/tags/${tag}`, sha: report.sha } });
        } catch (error) {
            if ((await tagCommit(api, tag)) !== report.sha) throw error;
        }
        target = await tagCommit(api, tag);
        if (target !== report.sha) fail('Tag creation conflict');
    }
    try {
        await api('/releases', { method: 'POST', body: expected });
    } catch (error) {
        const after = await api(`/releases/tags/${encodeURIComponent(tag)}`);
        if (!after) throw error;
        matchingRelease(after, expected);
    }
    if ((await tagCommit(api, tag)) !== report.sha) fail('Release tag source conflict');
    const result = matchingRelease(await api(`/releases/tags/${encodeURIComponent(tag)}`), expected);
    for (let index = 0; index < 5; index++) {
        const current = await api('/releases/latest');
        try {
            checkLatest(report, current, expected.make_latest === 'true');
            return result;
        } catch (error) {
            if (index === 4) throw error;
            await sleep(2000);
        }
    }
}

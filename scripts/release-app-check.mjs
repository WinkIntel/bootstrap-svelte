// Authentication diagnostics only. The token action owns minting and post-job revocation.
// This helper never reads a private key, executes a process or issues a write request.
import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Keep diagnostic pins independent of the write-capable release helper dependency graph.
const repository = 'WinkIntel/bootstrap-svelte';
const clientId = 'Iv23liEMzHfBJoQL5i2e';
const appId = 5307158;
const repositoryId = 1263210535;
const expectedInstallationId = '171145974';
const fail = (message) => {
    throw new Error(message);
};
export function checkContext(context) {
    if (
        context.GITHUB_ACTIONS !== 'true' ||
        context.GITHUB_REPOSITORY !== repository ||
        context.GITHUB_REF !== 'refs/heads/main' ||
        context.GITHUB_EVENT_NAME !== 'workflow_dispatch' ||
        !/^[a-f0-9]{40}$/.test(context.GITHUB_SHA ?? '')
    )
        fail('Run this check through the reviewed main workflow in the expected repository');
    if (context.RELEASE_APP_CLIENT_ID !== clientId) fail('Expected release App client ID is not configured');
}
export function checkConfiguration(context) {
    checkContext(context);
    if (context.RELEASE_APP_KEY_PRESENT !== 'true') fail('Release App private-key secret is not configured');
}
export async function checkApp({ context, installationId, appSlug, token }, fetcher = fetch) {
    checkContext(context);
    if (installationId !== expectedInstallationId) fail('Unexpected release App installation');
    if (!/^[a-z0-9-]{1,100}$/.test(appSlug ?? '')) fail('Unexpected App slug');
    if (typeof token !== 'string' || !token.trim()) fail('App installation token is missing; no fallback is allowed');
    const get = async (path) => {
        let response;
        try {
            response = await fetcher(`https://api.github.com${path}`, {
                method: 'GET',
                redirect: 'error',
                signal: AbortSignal.timeout(15000),
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10' }
            });
        } catch {
            fail('GitHub read failed (network, timeout or redirect); no response details logged');
        }
        if (!response.ok) fail(`GitHub read failed: HTTP ${response.status}`);
        try {
            return await response.json();
        } catch {
            fail('GitHub read returned invalid JSON; no response details logged');
        }
    };
    const app = await get(`/apps/${appSlug}`);
    if (app?.id !== appId || app.client_id !== clientId) fail('Unexpected App identity');
    if (
        app.permissions?.contents !== 'write' ||
        app.permissions?.workflows !== 'write' ||
        app.permissions?.metadata !== 'read' ||
        Object.keys(app.permissions).sort().join(',') !== 'contents,metadata,workflows'
    )
        fail('App must declare exactly Contents write, Workflows write and Metadata read');
    const scope = await get('/installation/repositories?per_page=100');
    if (
        scope?.total_count !== 1 ||
        !Array.isArray(scope.repositories) ||
        scope.repositories.length !== 1 ||
        scope.repositories[0]?.id !== repositoryId ||
        scope.repositories[0]?.full_name !== repository
    )
        fail('Installation token must access exactly the expected repository');
    const file = await get(`/repos/${repository}/contents/.github/workflows/publish.yml?ref=${context.GITHUB_SHA}`);
    if (
        file?.type !== 'file' ||
        file.path !== '.github/workflows/publish.yml' ||
        file.encoding !== 'base64' ||
        typeof file.content !== 'string' ||
        !file.content.trim()
    )
        fail('Cannot verify access to the source-pinned Publish workflow');
    return (
        `Release App ${appId}, installation ${expectedInstallationId}: identity, single-repository token scope and workflow read passed at ${context.GITHUB_SHA}.\n` +
        'Token creation requested Contents write and Workflows write; GET checks do not prove tag ruleset bypass or release writes. No repository or npm mutation was attempted.\n' +
        'Confirm Token revoked in the App action post-job log before accepting this check.\n'
    );
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        if (process.argv[2] === 'preflight') {
            checkConfiguration(process.env);
            console.log('Expected release App configuration is present; authentication has not yet been tested.');
        } else if (process.argv[2] === 'verify') {
            const summary = await checkApp({
                context: process.env,
                installationId: process.env.RELEASE_APP_INSTALLATION_ID,
                appSlug: process.env.RELEASE_APP_SLUG,
                token: process.env.RELEASE_APP_CHECK_TOKEN
            });
            console.log(summary);
            if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
        } else fail('Expected preflight or verify');
    } catch (error) {
        console.error(`Release App check failed: ${error.message}`);
        process.exitCode = 1;
    }
}

import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const source = new URL('../release-app-check.mjs', import.meta.url);
const sha = 'a'.repeat(40);
const context = {
    GITHUB_ACTIONS: 'true',
    GITHUB_REPOSITORY: 'WinkIntel/bootstrap-svelte',
    GITHUB_REF: 'refs/heads/main',
    GITHUB_EVENT_NAME: 'workflow_dispatch',
    GITHUB_SHA: sha,
    RELEASE_APP_CLIENT_ID: 'Iv23liEMzHfBJoQL5i2e'
};
const input = { context, installationId: '171145974', appSlug: 'wink-release', token: 'fake-secret-for-test' };
function fixture(patch = {}) {
    const calls = [];
    const responses = [
        { id: 5307158, client_id: context.RELEASE_APP_CLIENT_ID, permissions: { contents: 'write', workflows: 'write', metadata: 'read' } },
        { total_count: 1, repositories: [{ id: 1263210535, full_name: 'WinkIntel/bootstrap-svelte' }] },
        { type: 'file', path: '.github/workflows/publish.yml', encoding: 'base64', content: 'bmFtZTogUHVibGlzaAo=' }
    ];
    Object.assign(responses, patch);
    const fetcher = async (url, options) => {
        calls.push({ url, options });
        return new Response(JSON.stringify(responses[calls.length - 1]), { status: 200 });
    };
    return { calls, fetcher };
}
test('CLI refuses local execution before any App access and never echoes credential inputs', () => {
    for (const mode of ['preflight', 'verify']) {
        const result = spawnSync(process.execPath, [fileURLToPath(source), mode], {
            env: { GITHUB_ACTIONS: 'false', RELEASE_APP_CHECK_TOKEN: 'fixture-token', RELEASE_APP_PRIVATE_KEY: 'fixture-key' },
            encoding: 'utf8'
        });
        assert.equal(result.status, 1);
        assert.equal(result.stdout, '');
        assert.match(result.stderr, /Run this check through the reviewed main workflow/);
        assert.doesNotMatch(result.stderr, /fixture-token|fixture-key/);
    }
});
test('preflight rejects wrong context, App identity or absent key without authentication', async () => {
    const { checkContext, checkConfiguration } = await import(source);
    assert.doesNotThrow(() => checkConfiguration({ ...context, RELEASE_APP_KEY_PRESENT: 'true' }));
    for (const patch of [
        { GITHUB_ACTIONS: 'false' },
        { GITHUB_REPOSITORY: 'other/repo' },
        { GITHUB_REF: 'refs/heads/feature' },
        { GITHUB_EVENT_NAME: 'push' },
        { GITHUB_SHA: 'main' },
        { RELEASE_APP_CLIENT_ID: 'other-app' }
    ])
        assert.throws(() => checkContext({ ...context, ...patch }));
    assert.throws(() => checkConfiguration({ ...context, RELEASE_APP_KEY_PRESENT: 'false' }));
});
test('checks only fixed GET endpoints and returns no credential or arbitrary response data', async () => {
    const { checkApp } = await import(source);
    const f = fixture();
    const result = await checkApp(input, f.fetcher);
    assert.equal(f.calls.length, 3);
    assert.deepEqual(
        f.calls.map((c) => c.url),
        [
            'https://api.github.com/apps/wink-release',
            'https://api.github.com/installation/repositories?per_page=100',
            `https://api.github.com/repos/WinkIntel/bootstrap-svelte/contents/.github/workflows/publish.yml?ref=${sha}`
        ]
    );
    for (const c of f.calls) {
        assert.equal(c.options.method, 'GET');
        assert.equal(c.options.redirect, 'error');
        assert.equal(c.options.headers.Authorization, `Bearer ${input.token}`);
        assert.equal(c.options.body, undefined);
    }
    assert.match(result, /5307158/);
    assert.doesNotMatch(result, /fake-secret/);
});
test('rejects wrong installation, insufficient grants, broader token scope and unexpected content', async () => {
    const { checkApp } = await import(source);
    for (const patch of [{ installationId: '171145975' }, { appSlug: '../repos/other' }, { token: '' }]) {
        const f = fixture();
        await assert.rejects(checkApp({ ...input, ...patch }, f.fetcher));
        assert.equal(f.calls.length, 0);
    }
    for (const patch of [
        { 0: { id: 1, client_id: context.RELEASE_APP_CLIENT_ID } },
        { 0: { id: 5307158, client_id: 'other' } },
        { 0: { id: 5307158, client_id: context.RELEASE_APP_CLIENT_ID, permissions: { contents: 'read', workflows: 'write', metadata: 'read' } } },
        { 1: { total_count: 2, repositories: [{ id: 1263210535, full_name: 'WinkIntel/bootstrap-svelte' }] } },
        { 1: { total_count: 1, repositories: [{ id: 2, full_name: 'other/repo' }] } },
        { 2: { type: 'dir', path: '.github/workflows/publish.yml' } }
    ])
        await assert.rejects(checkApp(input, fixture(patch).fetcher));
});
test('API failures do not echo headers, token, response body or transport error details', async () => {
    const { checkApp } = await import(source);
    for (const fetcher of [
        async () => new Response(input.token, { status: 403 }),
        async () => {
            throw new Error(input.token);
        },
        async () => new Response(input.token, { status: 200 })
    ])
        await assert.rejects(checkApp(input, fetcher), (error) => !error.message.includes(input.token));
});
test('workflow is manual, main-only, approval-protected, scoped and keeps post-job token revocation', () => {
    const workflow = new URL('../../.github/workflows/release-app-check.yml', import.meta.url);
    assert.ok(existsSync(workflow));
    const yaml = readFileSync(workflow, 'utf8');
    assert.match(yaml, /workflow_dispatch:/);
    assert.doesNotMatch(yaml, /pull_request:|push:|workflow_call:|schedule:/);
    assert.match(yaml, /github.ref == 'refs\/heads\/main'/);
    assert.match(yaml, /environment: npm-publish/);
    assert.match(yaml, /repositories: bootstrap-svelte/);
    assert.match(yaml, /owner: WinkIntel/);
    assert.match(yaml, /permission-contents: write/);
    assert.match(yaml, /permission-workflows: write/);
    assert.match(yaml, /skip-token-revoke: false/);
    assert.match(yaml, /persist-credentials: false/);
    assert.doesNotMatch(yaml, /id-token:|permission-(actions|administration):|npm publish|release-page-write|pnpm|npm install/);
    assert.ok([...yaml.matchAll(/uses: (\S+)/g)].every((m) => /^[\w-]+\/[\w-]+@[a-f0-9]{40}$/.test(m[1])));
});

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { releasePolicy } from '../release-policy.mjs';
import { policyInput, policyCases } from './release-policy-cases.mjs';

// Execute the actual inline code used by both protected jobs; never a copied verifier.
function workflowScript() {
    const yaml = readFileSync(new URL('../../.github/workflows/publish.yml', import.meta.url), 'utf8');
    const match = yaml.match(/node --input-type=module <<'NODE'\n([\s\S]*?)\n\s+NODE/);
    assert.ok(match, 'workflow must verify the artifact in the protected job');
    const indent = match[1].match(/^ */)[0].length;
    return match[1]
        .split('\n')
        .map((line) => line.slice(indent))
        .join('\n');
}

function fixture(t, { packagePatch = {}, contents = 'library', extraFile = false } = {}) {
    const cwd = mkdtempSync(join(tmpdir(), 'release-artifact-'));
    t.after(() => rmSync(cwd, { recursive: true, force: true }));
    mkdirSync(join(cwd, 'source/package'), { recursive: true });
    mkdirSync(join(cwd, 'artifact'));
    mkdirSync(join(cwd, 'bin'));
    const pkg = {
        name: '@winkintel/bootstrap-svelte',
        version: '2.1.1',
        repository: { type: 'git', url: 'git+https://github.com/WinkIntel/bootstrap-svelte.git' },
        ...packagePatch
    };
    writeFileSync(join(cwd, 'source/package/package.json'), JSON.stringify(pkg));
    writeFileSync(join(cwd, 'source/package/index.js'), contents);
    execFileSync('tar', ['-czf', join(cwd, 'artifact/release.tgz'), '-C', join(cwd, 'source'), 'package']);
    const sha256 = createHash('sha256')
        .update(readFileSync(join(cwd, 'artifact/release.tgz')))
        .digest('hex');
    if (extraFile) writeFileSync(join(cwd, 'artifact/unexpected.js'), '');
    // Stub only the registry response and npm process; tar/hash/metadata/policy execute for real.
    writeFileSync(
        join(cwd, 'bin/npm'),
        `#!/bin/sh\nif [ "$1" = "--version" ]; then echo 11.5.2; else printf '%s\\n' "$@" > "$PWD/npm-arguments"; fi\n`,
        { mode: 0o755 }
    );
    const env = {
        ...process.env,
        PATH: `${join(cwd, 'bin')}:${process.env.PATH}`,
        RELEASE_MODE: 'dry-run',
        RELEASE_VERSION: '2.1.1',
        RELEASE_CHANNEL: 'latest',
        RELEASE_SHA256: sha256,
        GITHUB_REF: 'refs/heads/main',
        GITHUB_SHA: 'a'.repeat(40),
        GITHUB_REPOSITORY: 'WinkIntel/bootstrap-svelte',
        NODE_AUTH_TOKEN: '',
        NPM_TOKEN: ''
    };
    return { cwd, env };
}

function run(f, { env = {}, response = { status: 404 }, networkError = false } = {}) {
    const prelude = networkError
        ? `globalThis.fetch = async () => { throw new Error('network unavailable'); };\n`
        : `globalThis.fetch = async () => ({ status: ${response.status}, json: async () => (${JSON.stringify(response.body ?? {})}) });\n`;
    return spawnSync(process.execPath, ['--input-type=module'], {
        cwd: f.cwd,
        env: { ...f.env, ...env },
        input: prelude + workflowScript(),
        encoding: 'utf8'
    });
}

test('existing-version rehearsal validates the artifact without invoking npm publish', (t) => {
    const f = fixture(t);
    const result = run(f, { response: { status: 200, body: { name: '@winkintel/bootstrap-svelte', version: '2.1.1' } } });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(join(f.cwd, 'npm-arguments')), false);
    assert.match(result.stdout, /::warning title=Already published::/);
    assert.match(result.stdout, /Current-run artifact validation passed; published tarball equality was not checked/);
    assert.match(result.stdout, /Live publishing this version will fail; select a new version before a live release/);
});

test('unpublished-version rehearsal invokes npm with dry-run and ignore-scripts', (t) => {
    const f = fixture(t);
    const result = run(f);
    assert.equal(result.status, 0, result.stderr);
    const args = readFileSync(join(f.cwd, 'npm-arguments'), 'utf8').split('\n');
    assert.ok(args.includes('--dry-run'));
    assert.ok(args.includes('--ignore-scripts'));
    assert.ok(args.includes('./artifact/release.tgz'));
    assert.ok(args.includes('--registry=https://registry.npmjs.org'));
});

test('live path passes only the verified tarball and explicit channel to npm', (t) => {
    const f = fixture(t);
    const result = run(f, { env: { RELEASE_MODE: 'publish' } });
    assert.equal(result.status, 0, result.stderr);
    const args = readFileSync(join(f.cwd, 'npm-arguments'), 'utf8');
    assert.match(args, /--ignore-scripts/);
    assert.doesNotMatch(args, /--dry-run/);
    assert.match(args, /--tag=latest/);
});

for (const [description, options, patch] of [
    ['bad digest', {}, { RELEASE_SHA256: '0'.repeat(64) }],
    ['wrong package', { packagePatch: { name: 'other' } }, {}],
    ['changed version', { packagePatch: { version: '2.1.2' } }, {}],
    ['extra artifact', { extraFile: true }, {}],
    ['channel mismatch', {}, { RELEASE_CHANNEL: 'maintenance' }],
    ['feature ref', {}, { GITHUB_REF: 'refs/heads/feature' }],
    ['tag mismatch', {}, { GITHUB_REF: 'refs/tags/v2.1.2' }],
    ['wrong repository', {}, { GITHUB_REPOSITORY: 'other/bootstrap-svelte' }],
    ['bad mode', {}, { RELEASE_MODE: 'false' }],
    ['bad source SHA', {}, { GITHUB_SHA: 'not-a-sha' }],
    ['token fallback', {}, { NODE_AUTH_TOKEN: 'test-value-not-a-credential' }],
    ['registry override', { packagePatch: { publishConfig: { registry: 'https://example.invalid' } } }, {}]
]) {
    test(`rejects ${description} before npm publish`, (t) => {
        const f = fixture(t, options);
        assert.notEqual(run(f, { env: patch }).status, 0);
        assert.equal(existsSync(join(f.cwd, 'npm-arguments')), false);
    });
}
for (const status of [401, 403, 429, 500]) {
    test(`fails closed on registry HTTP ${status}`, (t) => {
        const f = fixture(t);
        assert.notEqual(run(f, { response: { status } }).status, 0);
        assert.equal(existsSync(join(f.cwd, 'npm-arguments')), false);
    });
}
test('fails closed on registry network failure', (t) => {
    const f = fixture(t);
    assert.notEqual(run(f, { networkError: true }).status, 0);
    assert.equal(existsSync(join(f.cwd, 'npm-arguments')), false);
});
test('refuses to publish an existing version', (t) => {
    const f = fixture(t);
    assert.notEqual(
        run(f, { env: { RELEASE_MODE: 'publish' }, response: { status: 200, body: { name: '@winkintel/bootstrap-svelte', version: '2.1.1' } } })
            .status,
        0
    );
    assert.equal(existsSync(join(f.cwd, 'npm-arguments')), false);
});
test('real npm dry-run cannot execute package lifecycle scripts', (t) => {
    const scripts = Object.fromEntries(
        ['prepublishOnly', 'prepack', 'prepare', 'postpack', 'publish', 'postpublish'].map((key) => [
            key,
            "node -e \"require('fs').writeFileSync('LIFECYCLE_EXECUTED','bad')\""
        ])
    );
    const f = fixture(t, { packagePatch: { scripts } });
    writeFileSync(join(f.cwd, 'empty-user.npmrc'), '');
    writeFileSync(join(f.cwd, 'empty-global.npmrc'), '');
    const result = run(f, {
        env: {
            PATH: process.env.PATH,
            npm_config_cache: join(f.cwd, 'cache'),
            npm_config_userconfig: join(f.cwd, 'empty-user.npmrc'),
            npm_config_globalconfig: join(f.cwd, 'empty-global.npmrc'),
            npm_config_offline: 'true'
        }
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(join(f.cwd, 'LIFECYCLE_EXECUTED')), false);
});

test('rejects corrupt registry success metadata', (t) => {
    const f = fixture(t);
    assert.notEqual(run(f, { response: { status: 200, body: { name: 'other', version: '2.1.1' } } }).status, 0);
    assert.equal(existsSync(join(f.cwd, 'npm-arguments')), false);
});

// The protected job intentionally does not import repository code. Run each policy
// case through both real implementations so edits to only one copy fail CI.
for (const [description, patch, accepted, buildError, workflowError] of policyCases) {
    test(`release policy parity: ${description}`, (t) => {
        const input = { ...policyInput, ...patch };
        if (accepted) assert.doesNotThrow(() => releasePolicy(input));
        else assert.throws(() => releasePolicy(input), buildError);
        const f = fixture(t, { packagePatch: { name: input.name, version: input.version } });
        const result = run(f, {
            env: { RELEASE_VERSION: input.version, RELEASE_CHANNEL: input.channel, GITHUB_REF: input.ref, GITHUB_SHA: input.sha }
        });
        assert.equal(result.status === 0, accepted, result.stderr);
        if (!accepted) assert.match(result.stderr, workflowError);
        assert.equal(existsSync(join(f.cwd, 'npm-arguments')), accepted);
    });
}

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { releasePolicy } from '../release-policy.mjs';

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
    assert.match(result.stdout, /already published; artifact checks passed; skipping npm publish --dry-run/);
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

for (const [version, channel, ref] of [
    ['1.1.1', 'maintenance', 'refs/heads/codex/maintenance-1.x'],
    ['1.1.1', 'maintenance', 'refs/tags/v1.1.1'],
    ['2.1.1', 'latest', 'refs/tags/v2.1.1'],
    ['2.2.0-rc.1', 'next', 'refs/heads/main'],
    ['2.2.0-rc.1', 'next', 'refs/tags/v2.2.0-rc.1']
]) {
    test(`protected verifier accepts ${channel} from ${ref}`, (t) => {
        const f = fixture(t, { packagePatch: { version } });
        const result = run(f, { env: { RELEASE_VERSION: version, RELEASE_CHANNEL: channel, GITHUB_REF: ref } });
        assert.equal(result.status, 0, result.stderr);
    });
}
test('rejects corrupt registry success metadata', (t) => {
    const f = fixture(t);
    assert.notEqual(run(f, { response: { status: 200, body: { name: 'other', version: '2.1.1' } } }).status, 0);
    assert.equal(existsSync(join(f.cwd, 'npm-arguments')), false);
});

// The protected job intentionally does not import repository code. Run each policy
// case through both real implementations so edits to only one copy fail CI.
const policyInput = { name: '@winkintel/bootstrap-svelte', version: '2.1.1', channel: 'latest', ref: 'refs/heads/main', sha: 'a'.repeat(40) };
const policyCases = [
    ['2.x branch', {}, true],
    ['2.x tag', { ref: 'refs/tags/v2.1.1' }, true],
    ['1.x branch', { version: '1.1.1', channel: 'maintenance', ref: 'refs/heads/codex/maintenance-1.x' }, true],
    ['1.x tag', { version: '1.1.1', channel: 'maintenance', ref: 'refs/tags/v1.1.1' }, true],
    ['prerelease branch', { version: '2.2.0-rc.1', channel: 'next' }, true],
    ['prerelease tag', { version: '2.2.0-rc.1', channel: 'next', ref: 'refs/tags/v2.2.0-rc.1' }, true],
    ['wrong name', { name: 'other' }, false],
    ['1.x on latest', { version: '1.1.1' }, false],
    ['2.x on maintenance', { channel: 'maintenance' }, false],
    ['stable on next', { channel: 'next' }, false],
    ['prerelease on latest', { version: '2.2.0-rc.1' }, false],
    ['1.x prerelease', { version: '1.2.0-rc.1', channel: 'next', ref: 'refs/heads/codex/maintenance-1.x' }, false],
    ['unknown major', { version: '3.0.0' }, false],
    ['unknown channel', { channel: 'beta' }, false],
    ['feature branch', { ref: 'refs/heads/feature' }, false],
    ['wrong branch', { ref: 'refs/heads/codex/maintenance-1.x' }, false],
    ['tag mismatch', { ref: 'refs/tags/v2.1.2' }, false],
    ['pull request ref', { ref: 'refs/pull/1/merge' }, false],
    ['leading zero', { version: '2.01.1' }, false],
    ['missing patch', { version: '2.1' }, false],
    ['leading zero prerelease', { version: '2.1.1-01', channel: 'next' }, false],
    ['build metadata', { version: '2.1.1+build' }, false],
    ['overlong version', { version: '2.1.1-' + 'a'.repeat(123), channel: 'next' }, false],
    ['non-string version', { version: 2 }, false],
    ['invalid SHA', { sha: 'HEAD' }, false],
    ['missing SHA', { sha: undefined }, false]
];
for (const [description, patch, accepted] of policyCases) {
    test(`release policy parity: ${description}`, (t) => {
        const input = { ...policyInput, ...patch };
        let buildAccepted = false;
        try {
            releasePolicy(input);
            buildAccepted = true;
        } catch {
            // A rejected policy case must also be rejected by the protected job.
        }
        const f = fixture(t, { packagePatch: { name: input.name, version: input.version } });
        const result = run(f, {
            env: { RELEASE_VERSION: input.version, RELEASE_CHANNEL: input.channel, GITHUB_REF: input.ref, GITHUB_SHA: input.sha }
        });
        assert.equal(buildAccepted, accepted, 'build policy result');
        assert.equal(result.status === 0, buildAccepted, result.stderr);
        assert.equal(existsSync(join(f.cwd, 'npm-arguments')), accepted);
    });
}

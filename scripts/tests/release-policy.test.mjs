import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import { releasePolicy, verifySourceHistory } from '../release-policy.mjs';

const name = '@winkintel/bootstrap-svelte';
const sha = 'a'.repeat(40);
const valid = { name, version: '2.1.1', channel: 'latest', ref: 'refs/heads/main', sha };
for (const [version, channel, branch] of [
    ['2.1.1', 'latest', 'main'],
    ['1.1.1', 'maintenance', 'codex/maintenance-1.x'],
    ['2.2.0-rc.1', 'next', 'main']
]) {
    for (const ref of [`refs/heads/${branch}`, `refs/tags/v${version}`]) {
        test(`allows ${version} on ${channel} from ${ref}`, () => {
            assert.deepEqual(releasePolicy({ name, version, channel, ref, sha }), { branch, name, version, channel, sha });
        });
    }
}
for (const [description, patch] of [
    ['wrong package', { name: 'other' }],
    ['1.x on latest', { version: '1.1.1' }],
    ['2.x on maintenance', { channel: 'maintenance' }],
    ['stable on next', { channel: 'next' }],
    ['prerelease on latest', { version: '2.2.0-rc.1' }],
    ['1.x prerelease', { version: '1.2.0-rc.1', channel: 'next' }],
    ['unknown major', { version: '3.0.0' }],
    ['unknown channel', { channel: 'beta' }],
    ['feature branch', { ref: 'refs/heads/feature' }],
    ['wrong release branch', { ref: 'refs/heads/codex/maintenance-1.x' }],
    ['tag mismatch', { ref: 'refs/tags/v2.1.2' }],
    ['pull request', { ref: 'refs/pull/1/merge' }],
    ['leading zero', { version: '2.01.1' }],
    ['missing patch', { version: '2.1' }],
    ['prerelease leading zero', { version: '2.1.1-01', channel: 'next' }],
    ['build metadata', { version: '2.1.1+build' }],
    ['shell input', { version: '2.1.1;touch /tmp/not-allowed' }],
    ['newline channel', { channel: 'latest\nother=value' }],
    ['invalid SHA', { sha: 'HEAD' }],
    ['missing SHA', { sha: undefined }]
]) {
    test(`rejects ${description}`, () => assert.throws(() => releasePolicy({ ...valid, ...patch })));
}

test('requires the release commit to contain the policy introduction and belong to the approved branch', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'release-history-'));
    const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    try {
        git('init', '-b', 'main');
        git('config', 'user.name', 'Release test');
        git('config', 'user.email', 'release-test@example.invalid');
        git('commit', '--allow-empty', '-m', 'before policy');
        const old = git('rev-parse', 'HEAD');
        mkdirSync(join(cwd, 'scripts'));
        writeFileSync(join(cwd, 'scripts/release-policy.mjs'), '// policy introduction\n');
        git('add', 'scripts/release-policy.mjs');
        git('commit', '-m', 'introduce policy');
        const approved = git('rev-parse', 'HEAD');
        git('update-ref', 'refs/remotes/origin/main', approved);
        assert.doesNotThrow(() => verifySourceHistory({ sha: approved, branch: 'main' }, cwd));
        assert.throws(() => verifySourceHistory({ sha: old, branch: 'main' }, cwd), /predates/);
        git('checkout', '-b', 'feature');
        git('commit', '--allow-empty', '-m', 'not reviewed');
        assert.throws(() => verifySourceHistory({ sha: git('rev-parse', 'HEAD'), branch: 'main' }, cwd), /approved branch/);
        git('update-ref', 'refs/remotes/origin/main', old);
        assert.throws(() => verifySourceHistory({ sha: old, branch: 'main' }, cwd), /not installed/);
        assert.throws(() => verifySourceHistory({ sha: approved, branch: 'missing' }, cwd));
    } finally {
        rmSync(cwd, { recursive: true, force: true });
    }
});

import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import { releasePolicy, verifySourceHistory } from '../release-policy.mjs';
import { policyInput, policyCases } from './release-policy-cases.mjs';

for (const [description, patch, accepted, buildError] of policyCases) {
    test(`build release policy: ${description}`, () => {
        const input = { ...policyInput, ...patch };
        if (accepted) {
            const branch = input.version.startsWith('1.') ? 'codex/maintenance-1.x' : 'main';
            assert.deepEqual(releasePolicy(input), { branch, name: input.name, version: input.version, channel: input.channel, sha: input.sha });
        } else {
            assert.throws(() => releasePolicy(input), buildError);
        }
    });
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

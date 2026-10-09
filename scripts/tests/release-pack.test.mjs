import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

function fixture(t) {
    const cwd = mkdtempSync(join(tmpdir(), 'release-pack-'));
    t.after(() => rmSync(cwd, { recursive: true, force: true }));
    mkdirSync(join(cwd, 'scripts'));
    copyFileSync(new URL('../release-policy.mjs', import.meta.url), join(cwd, 'scripts/release-policy.mjs'));
    writeFileSync(join(cwd, 'index.js'), 'export const built = true;\n');
    writeFileSync(
        join(cwd, 'package.json'),
        JSON.stringify({
            name: '@winkintel/bootstrap-svelte',
            version: '2.1.1',
            files: ['index.js'],
            scripts: { prepack: "node -e \"require('fs').writeFileSync('LIFECYCLE_EXECUTED','bad');process.exit(1)\"" }
        })
    );
    const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    git('init', '-b', 'main');
    git('config', 'user.name', 'Release test');
    git('config', 'user.email', 'release-test@example.invalid');
    git('add', '.');
    git('commit', '-m', 'release policy');
    const sha = git('rev-parse', 'HEAD');
    git('update-ref', 'refs/remotes/origin/main', sha);
    writeFileSync(join(cwd, 'empty-user.npmrc'), '');
    writeFileSync(join(cwd, 'empty-global.npmrc'), '');
    const env = {
        ...process.env,
        GITHUB_SHA: sha,
        GITHUB_REF: 'refs/heads/main',
        RELEASE_CHANNEL: 'latest',
        GITHUB_OUTPUT: join(cwd, 'output'),
        RELEASE_DIR: join(cwd, 'artifact'),
        npm_config_cache: join(cwd, 'cache'),
        npm_config_userconfig: join(cwd, 'empty-user.npmrc'),
        npm_config_globalconfig: join(cwd, 'empty-global.npmrc'),
        npm_config_offline: 'true'
    };
    const run = (command, patch = {}) =>
        spawnSync(process.execPath, ['scripts/release-policy.mjs', command], { cwd, env: { ...env, ...patch }, encoding: 'utf8' });
    return { cwd, run, git, sha };
}
test('guard and pack produce the version and digest of one real tarball without running prepack', (t) => {
    const f = fixture(t);
    assert.equal(f.run('guard').status, 0);
    const result = f.run('pack');
    assert.equal(result.status, 0, result.stderr);
    const tarball = readFileSync(join(f.cwd, 'artifact/release.tgz'));
    const digest = createHash('sha256').update(tarball).digest('hex');
    assert.equal(readFileSync(join(f.cwd, 'output'), 'utf8'), `version=2.1.1\nsha256=${digest}\n`);
    assert.equal(existsSync(join(f.cwd, 'LIFECYCLE_EXECUTED')), false);
    assert.notEqual(f.run('pack').status, 0, 'refuse to overwrite a nonempty artifact directory');
});
test('guard rejects a checkout that differs from the selected source SHA', (t) => {
    const f = fixture(t);
    f.git('commit', '--allow-empty', '-m', 'different checkout');
    f.git('update-ref', 'refs/remotes/origin/main', f.git('rev-parse', 'HEAD'));
    assert.notEqual(f.run('guard').status, 0);
});

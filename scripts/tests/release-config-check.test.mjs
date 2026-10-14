import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
const read = (name) => readFileSync(new URL('../../.github/workflows/' + name, import.meta.url), 'utf8');
const publish = read('publish.yml');
const page = read('release-page.yml');
function job(yaml, name) {
    const value = yaml.match(new RegExp(`^    ${name}:\\n([\\s\\S]*?)(?=^    [a-z]+:|$(?![\\s\\S]))`, 'm'))?.[1];
    assert.ok(value, `Missing ${name} job`);
    return value;
}
// Evaluate only this workflow's small boolean vocabulary, not the Actions expression language.
// Exact YAML syntax and expression validity are separately checked by actionlint.
function allows(block, context) {
    const expression = block.match(/^ +if: \$\{\{ (.+) \}\}$/m)?.[1];
    assert.ok(expression, 'Every tested boundary needs an explicit condition');
    const source = expression
        .replace(/!cancelled\(\)/g, String(!context.cancelled))
        .replace(/inputs\.(?:configuration-check|dry-run)|needs\.(?:publish|verify|configuration)\.result|github\.(?:repository|ref)/g, (key) =>
            JSON.stringify(context[key] ?? '')
        )
        // Actions string equality is case-insensitive; this harness uses only ASCII operands.
        .replace(/(['"])(.*?)\1/g, (_, quote, value) => JSON.stringify(value.toLowerCase()));
    assert.match(source, /^[\w\s.'"/!&|()=:-]+$/);
    return Function(`"use strict"; return (${source});`)();
}
const base = {
    'inputs.configuration-check': false,
    'inputs.dry-run': true,
    'needs.publish.result': 'skipped',
    'needs.verify.result': 'skipped',
    'needs.configuration.result': 'skipped',
    'github.repository': 'WinkIntel/bootstrap-svelte',
    'github.ref': 'refs/heads/main',
    cancelled: false
};
test('configuration check defaults off and follows the existing named-secret caller into the protected job', () => {
    assert.match(publish, /configuration-check:\n(?: {16}.*\n)*? {16}type: boolean\n(?: {16}.*\n)*? {16}default: false/);
    const contract = page.split('    workflow_call:')[1].split('    workflow_dispatch:')[0];
    assert.match(contract, /configuration-check:\n +type: boolean\n +default: false/);
    assert.doesNotMatch(page.split('    workflow_dispatch:')[1].split('\npermissions:')[0], /configuration-check/);
    const caller = job(publish, 'releasepage');
    assert.match(caller, /configuration-check: \$\{\{ inputs.configuration-check \}\}/);
    assert.match(caller, /RELEASE_APP_PRIVATE_KEY: \$\{\{ secrets.RELEASE_APP_PRIVATE_KEY \}\}/);
    assert.match(job(page, 'write'), /environment: npm-publish\n +permissions:\n +contents: read/);
    assert.doesNotMatch(caller + job(page, 'write'), /(?:^|\n)\s+(?:id-token: write|contents: write)|secrets: inherit/);
});
test('configuration mode suppresses build, rehearsal, publish and verification even with live inputs', () => {
    for (const ref of ['refs/heads/main', 'refs/heads/codex/maintenance-1.x']) {
        for (const dryRun of [false, true]) {
            const ctx = {
                ...base,
                'github.ref': ref,
                'inputs.configuration-check': true,
                'inputs.dry-run': dryRun,
                'needs.configuration.result': 'success'
            };
            for (const name of ['build', 'rehearsal', 'publish']) assert.equal(allows(job(publish, name), ctx), false, name);
            assert.equal(allows(job(page, 'verify'), ctx), false);
            assert.equal(allows(job(publish, 'releasepage'), ctx), true, 'Skipped dependencies must not skip diagnostic caller');
            assert.equal(allows(job(page, 'write'), ctx), true, 'Skipped verifier must not skip protected preflight');
        }
    }
    const steps = job(page, 'write')
        .split(/^ {12}- name: /m)
        .slice(1);
    assert.equal(steps.length, 5, 'Review any new writer steps for diagnostic safety');
    assert.match(steps[0], /^Check release-page App configuration/);
    for (const step of steps.slice(1)) {
        assert.equal(allows(step, { ...base, 'inputs.configuration-check': true }), false, step.split('\n')[0]);
        assert.equal(allows(step, base), true, 'Ordinary writer steps stay enabled');
    }
});
test('ordinary dry-run, publish and recovery retain their gates; failed or cancelled verification never writes', () => {
    assert.equal(allows(job(publish, 'build'), base), true);
    assert.equal(allows(job(publish, 'rehearsal'), base), true);
    assert.equal(allows(job(publish, 'publish'), base), false);
    assert.equal(allows(job(publish, 'releasepage'), base), false);
    const live = { ...base, 'inputs.dry-run': false, 'needs.publish.result': 'success' };
    assert.equal(allows(job(publish, 'publish'), live), true);
    assert.equal(allows(job(publish, 'rehearsal'), live), false);
    assert.equal(allows(job(publish, 'releasepage'), live), true);
    assert.equal(allows(job(page, 'verify'), live), true);
    assert.equal(allows(job(page, 'write'), { ...live, 'needs.verify.result': 'success' }), true);
    for (const result of ['failure', 'skipped', 'cancelled']) {
        assert.equal(allows(job(publish, 'releasepage'), { ...live, 'needs.publish.result': result }), false);
        assert.equal(allows(job(page, 'write'), { ...live, 'needs.verify.result': result }), false);
    }
    for (const config of [false, true]) {
        const ctx = { ...live, 'inputs.configuration-check': config, 'needs.verify.result': 'success', cancelled: true };
        assert.equal(allows(job(publish, 'releasepage'), ctx), false);
        assert.equal(allows(job(page, 'write'), ctx), false);
    }
    for (const result of ['failure', 'skipped', 'cancelled']) {
        assert.equal(allows(job(page, 'write'), { ...base, 'inputs.configuration-check': true, 'needs.configuration.result': result }), false);
    }
    // workflow_dispatch recovery has no diagnostic input; it must still verify before writing.
    const recovery = { ...base, 'inputs.configuration-check': '', 'needs.verify.result': 'success' };
    assert.equal(allows(job(page, 'verify'), recovery), true);
    assert.equal(allows(job(page, 'write'), recovery), true);
});
test('protected preflight receives only presence booleans and reports fixed pass/fail without values', () => {
    const preflight = job(page, 'write').split('            - name: ')[1];
    assert.match(preflight, /RELEASE_APP_CLIENT_ID_PRESENT: \$\{\{ vars.RELEASE_APP_CLIENT_ID != '' \}\}/);
    assert.match(preflight, /RELEASE_APP_KEY_PRESENT: \$\{\{ secrets.RELEASE_APP_PRIVATE_KEY != '' \}\}/);
    assert.doesNotMatch(preflight, /RELEASE_APP_CLIENT_ID:|RELEASE_APP_PRIVATE_KEY:/);
    const shell = preflight
        .split('              run: |\n')[1]
        .split('\n')
        .map((line) => line.replace(/^ {18}/, ''))
        .join('\n');
    assert.match(preflight, /CONFIGURATION_CHECK: \$\{\{ inputs.configuration-check \}\}/);
    for (const mode of ['false', 'true', ''])
        for (const client of ['false', 'true'])
            for (const key of ['false', 'true']) {
                const result = spawnSync('bash', ['-c', shell], {
                    env: { CONFIGURATION_CHECK: mode, RELEASE_APP_CLIENT_ID_PRESENT: client, RELEASE_APP_KEY_PRESENT: key },
                    encoding: 'utf8'
                });
                const pass = client === 'true' && key === 'true';
                assert.equal(result.status, pass ? 0 : 1);
                assert.equal(result.stderr, '');
                const expected = pass
                    ? 'Release App configuration is present.\n'
                    : mode === 'true'
                      ? '::error::Release App configuration is missing. See RELEASE.md.\n'
                      : '::error::Release App configuration is missing. See RELEASE.md. Use release-page recovery; do not repeat npm publication.\n';
                assert.equal(result.stdout, expected);
                assert.doesNotMatch(result.stdout, /true|false|Iv23|PRIVATE KEY/);
            }
});
function shell(block) {
    return block
        .split('              run: |\n')[1]
        .split('\n')
        .map((line) => line.replace(/^ {18}/, ''))
        .join('\n');
}
test('unsupported configuration refs fail before environment approval with exact-case context checks', () => {
    const guard = job(page, 'configuration');
    assert.match(guard, /permissions: \{\}/);
    assert.doesNotMatch(guard, /environment:|secrets\.|uses:|checkout|npm |pnpm /);
    assert.match(job(page, 'write'), /needs: \[verify, configuration\]/);
    assert.equal(allows(guard, { ...base, 'inputs.configuration-check': true }), true);
    assert.equal(allows(guard, base), false);
    for (const [repo, ref, pass] of [
        ['WinkIntel/bootstrap-svelte', 'refs/heads/main', true],
        ['WinkIntel/bootstrap-svelte', 'refs/heads/codex/maintenance-1.x', true],
        ['WinkIntel/bootstrap-svelte', 'refs/heads/MAIN', false],
        ['WinkIntel/bootstrap-svelte', 'refs/heads/Codex/Maintenance-1.x', false],
        ['WinkIntel/bootstrap-svelte', 'refs/heads/feature', false],
        ['WinkIntel/bootstrap-svelte', 'refs/tags/v2.1.2', false],
        ['other/repo', 'refs/heads/main', false],
        ['winkintel/bootstrap-svelte', 'refs/heads/main', false]
    ]) {
        // Every diagnostic request reaches the guard, rather than silently skipping all jobs.
        assert.equal(
            allows(job(publish, 'releasepage'), { ...base, 'inputs.configuration-check': true, 'github.ref': ref, 'github.repository': repo }),
            true
        );
        const result = spawnSync('bash', ['-c', shell(guard)], { env: { GITHUB_REPOSITORY: repo, GITHUB_REF: ref }, encoding: 'utf8' });
        assert.equal(result.status, pass ? 0 : 1, repo + ':' + ref);
        assert.equal(result.stderr, '');
        assert.equal(result.stdout, pass ? '' : '::error::Configuration check requires the expected repository and an approved release branch.\n');
    }
});
test('condition evaluator models Actions case-insensitive string comparison', () => {
    assert.equal(allows(job(page, 'verify'), { ...base, 'github.repository': 'WINKINTEL/BOOTSTRAP-SVELTE' }), true);
    assert.equal(allows(job(page, 'write'), { ...base, 'needs.verify.result': 'SUCCESS' }), true);
});
test('diagnostic concurrency is separate from publication and recovery at both levels', () => {
    const group = (yaml, config) => {
        const expression = yaml.match(/^    group: \$\{\{ (.+) \}\}$/m)?.[1];
        assert.ok(expression);
        return allows('        if: ${{ ' + expression + ' }}', { ...base, 'inputs.configuration-check': config });
    };
    assert.equal(group(publish, false), 'npm-publish-bootstrap-svelte');
    assert.equal(group(page, false), 'github-release-page-bootstrap-svelte');
    assert.equal(group(publish, true), 'release-config-publish-bootstrap-svelte');
    assert.equal(group(page, true), 'release-config-page-bootstrap-svelte');
    assert.notEqual(group(publish, true), group(page, true), 'Nested workflows cannot hold the same concurrency group');
    for (const yaml of [publish, page]) assert.match(yaml, /cancel-in-progress: false/);
});
test('publish preflight also receives only presence booleans', () => {
    const preflight = job(publish, 'publish').split('            - *release-node')[0];
    assert.match(preflight, /RELEASE_APP_CLIENT_ID_PRESENT: \$\{\{ vars.RELEASE_APP_CLIENT_ID != '' \}\}/);
    assert.doesNotMatch(preflight, /RELEASE_APP_CLIENT_ID:|RELEASE_APP_PRIVATE_KEY:/);
    for (const client of ['false', 'true'])
        for (const key of ['false', 'true']) {
            const result = spawnSync('bash', ['-c', shell(preflight)], {
                env: { RELEASE_APP_CLIENT_ID_PRESENT: client, RELEASE_APP_KEY_PRESENT: key },
                encoding: 'utf8'
            });
            assert.equal(result.status, client === 'true' && key === 'true' ? 0 : 1);
            assert.doesNotMatch(result.stdout + result.stderr, /true|false|Iv23|PRIVATE KEY/);
        }
});

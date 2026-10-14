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
        .replace(/inputs\.(?:configuration-check|dry-run)|needs\.(?:publish|verify)\.result|github\.(?:repository|ref)/g, (key) =>
            JSON.stringify(context[key] ?? '')
        );
    assert.match(source, /^[\w\s.'"/!&|()=:-]+$/);
    return Function(`"use strict"; return (${source});`)();
}
const base = {
    'inputs.configuration-check': false,
    'inputs.dry-run': true,
    'needs.publish.result': 'skipped',
    'needs.verify.result': 'skipped',
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
            const ctx = { ...base, 'github.ref': ref, 'inputs.configuration-check': true, 'inputs.dry-run': dryRun };
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
    assert.equal(allows(job(page, 'write'), { ...base, 'inputs.configuration-check': true, 'github.repository': 'other/repo' }), false);
    assert.equal(allows(job(page, 'write'), { ...base, 'inputs.configuration-check': true, 'github.ref': 'refs/heads/feature' }), false);
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
    for (const client of ['false', 'true'])
        for (const key of ['false', 'true']) {
            const result = spawnSync('bash', ['-c', shell], {
                env: { RELEASE_APP_CLIENT_ID_PRESENT: client, RELEASE_APP_KEY_PRESENT: key },
                encoding: 'utf8'
            });
            const pass = client === 'true' && key === 'true';
            assert.equal(result.status, pass ? 0 : 1);
            assert.equal(result.stderr, '');
            assert.match(result.stdout, pass ? /^Release App configuration is present\.\n$/ : /^::error::Release App configuration is missing\./);
            assert.doesNotMatch(result.stdout, /true|false|Iv23|PRIVATE KEY/);
        }
});

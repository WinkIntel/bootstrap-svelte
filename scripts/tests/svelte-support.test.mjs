import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { svelteMinimum } from '../svelte-minimum.mjs';

const workflow = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');

test('the minimum parser returns the exact approved caret floor', () => {
    assert.equal(svelteMinimum('^5.55.7'), '5.55.7');
});

test('unsupported range formats fail before dependency installation', () => {
    for (const range of [undefined, '', '5.55.7', '>=5.55.7 <6', '^5.55.7 || ^6', '^6.0.0', '^5.55.7-beta.1', '^5.055.7', '^5.55.07']) {
        assert.throws(() => svelteMinimum(range), /stable Svelte 5 caret/);
    }
});

test('the required build check fails closed for either failed, skipped or cancelled validation job', () => {
    const gate = workflow.match(/^    build:\n([\s\S]*?)(?=^    [\w-]+:|$(?![\s\S]))/m)?.[1];
    assert.ok(gate, 'required build job must exist');
    assert.match(gate, /needs: \[development, svelte-minimum\]/);
    assert.match(gate, /if: \$\{\{ always\(\) \}\}/);
    const script = gate.match(/run: \|\n((?: {18}[^\n]*(?:\n|$))+)/)?.[1].replace(/^ {18}/gm, '');
    assert.ok(script, 'required build job must evaluate both results');
    for (const development of ['success', 'failure', 'cancelled', 'skipped']) {
        for (const minimum of ['success', 'failure', 'cancelled', 'skipped']) {
            const result = spawnSync('bash', ['-e', '-c', script], {
                env: { ...process.env, DEVELOPMENT_RESULT: development, MINIMUM_RESULT: minimum }
            });
            assert.equal(result.status === 0, development === 'success' && minimum === 'success', `${development}/${minimum}`);
        }
    }
});

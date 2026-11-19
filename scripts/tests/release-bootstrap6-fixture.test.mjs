import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// Verification only: this file is picked up by existing common CI's test glob.
// It has no fixture dependency, release implementation change or publishing path.
const workflow = readFileSync(new URL('../../.github/workflows/bootstrap6-alpha.yml', import.meta.url), 'utf8');
const ci = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');
function assertFixtureWorkflow(source) {
    // Ignore prose/comments; validate the small workflow's executable structure.
    const yaml = source
        .split('\n')
        .filter((line) => !/^\s*#/.test(line))
        .map((line) => line.replace(/\s+#.*$/, ''))
        .join('\n');
    const triggers = yaml.match(/^on:\n([\s\S]*?)(?=^\S)/m)?.[1];
    assert.equal(
        triggers?.replace(/\s/g, ''),
        'push:branches:[3.x-alpha]pull_request:branches:[3.x-alpha]',
        'fixture triggers must stay scoped to 3.x-alpha'
    );
    assert.equal((yaml.match(/^\s*permissions:/gm) ?? []).length, 1, 'fixture permissions must have one read-only declaration');
    assert.match(yaml, /^permissions:\n    contents: read\n(?:\n|\S)/m, 'fixture permissions must remain contents: read only');
    assert.doesNotMatch(yaml, /^\s*environment:/m, 'fixture cannot require a protected environment');
    assert.doesNotMatch(yaml, /\$\{\{[^}]*secrets\./, 'fixture cannot reference secrets');
    const uses = [...yaml.matchAll(/^\s+uses: (\S+)/gm)].map((match) => match[1]);
    assert.equal(uses.length, 2, 'fixture action count');
    for (const reference of uses) assert.match(reference, /^[\w-]+\/[\w-]+@[a-f0-9]{40}$/, 'fixture action must use a full pinned reference');
    assert.deepEqual(
        uses.map((reference) => reference.split('@')[0]),
        ['actions/checkout', 'actions/setup-node'],
        'fixture action allowlist'
    );
    assert.match(yaml, /persist-credentials: false/, 'fixture checkout credentials must not persist');
    assert.match(yaml, /working-directory: tests\/bootstrap6-alpha/);
    assert.deepEqual(
        [...yaml.matchAll(/^\s+run: (.+)$/gm)].map((match) => match[1]),
        ['npm ci --ignore-scripts --no-audit --no-fund', 'npm test'],
        'fixture commands must remain install and verification only'
    );
    assert.deepEqual(
        [...yaml.matchAll(/^    ([\w-]+):$/gm)].map((match) => match[1]),
        ['push', 'pull_request', 'static-compatibility'],
        'fixture may only contain its two triggers and one static job'
    );
}

test('alpha fixture workflow stays verification-only, independently of its own npm test', () => {
    assert.match(ci, /node --test scripts\/tests\/release-\*\.test\.mjs/);
    assertFixtureWorkflow(workflow);
    assertFixtureWorkflow(
        workflow.replace('Test integrity guards', 'Write JSON report and test integrity guards') +
            '\n# Deployment and Vercel are outside this fixture.\n'
    );
});

for (const [name, change, diagnostic] of [
    ['permissions', (s) => s.replace('contents: read', 'contents: write'), /permissions/],
    [
        'job permissions',
        (s) => s.replace('runs-on: ubuntu-latest', 'permissions:\n            contents: write\n        runs-on: ubuntu-latest'),
        /permissions/
    ],
    ['trigger', (s) => s.replace('    pull_request:', '    workflow_dispatch:\n    pull_request:'), /triggers/],
    ['target branch', (s) => s.replaceAll('[3.x-alpha]', '[main]'), /triggers/],
    ['action pin', (s) => s.replace('actions/checkout@', 'bad/path/actions/checkout@'), /action/],
    ['checkout credentials', (s) => s.replace('persist-credentials: false', 'persist-credentials: true'), /credentials/],
    ['test removal', (s) => s.replace('run: npm test', 'run: echo skipped'), /commands/],
    ['publishing command', (s) => s.replace('run: npm test', 'run: npm publish'), /commands/],
    ['protected environment', (s) => s.replace('runs-on: ubuntu-latest', 'environment: production\n        runs-on: ubuntu-latest'), /environment/]
])
    test(`independent workflow guard rejects changed ${name}`, () => assert.throws(() => assertFixtureWorkflow(change(workflow)), diagnostic));

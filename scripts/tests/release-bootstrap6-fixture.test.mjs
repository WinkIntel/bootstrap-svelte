import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// Verification only: this file is picked up by existing common CI's test glob.
// It has no fixture dependency, release implementation change or publishing path.
const workflow = readFileSync(new URL('../../.github/workflows/bootstrap6-alpha.yml', import.meta.url), 'utf8');
const ci = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');

function readFixtureSteps(yaml) {
    const body = yaml.match(/^        steps:\n([\s\S]*)$/m)?.[1];
    assert.ok(body, 'fixture block steps must be present');
    const steps = [];
    const assign = (mapping, key, value) => {
        assert.ok(!Object.hasOwn(mapping, key), 'fixture step keys must be unique');
        // Deliberately support this fixture's plain scalar block mappings only.
        // Reject aliases, flow collections, quoted keys and multiline scalars
        // rather than silently overlooking an unsupported YAML representation.
        assert.match(value, /^[\w./:@ -]+$/, 'unsupported fixture step scalar');
        mapping[key] = value;
    };
    for (const line of body.split('\n')) {
        if (!line.trim()) continue;
        const start = line.match(/^ {12}- ([\w-]+):(?: (.*))?$/);
        const field = start ?? line.match(/^ {14}([\w-]+):(?: (.*))?$/);
        if (field) {
            if (start) steps.push({});
            const step = steps.at(-1);
            assert.ok(step, 'fixture step field needs a block step');
            const [, key, value = ''] = field;
            assert.ok(['name', 'uses', 'run', 'with'].includes(key), 'unsupported fixture step key');
            if (key === 'with') {
                assert.equal(value, '', 'fixture action inputs must be a block mapping');
                assert.ok(!Object.hasOwn(step, key), 'fixture step keys must be unique');
                step.with = {};
            } else assign(step, key, value);
            continue;
        }
        const input = line.match(/^ {18}([\w-]+): (.+)$/);
        assert.ok(input && steps.at(-1)?.with, 'unsupported fixture step structure');
        assign(steps.at(-1).with, input[1], input[2]);
    }
    for (const step of steps) assert.equal(Number(!!step.uses) + Number(!!step.run), 1, 'fixture step needs exactly one action or command');
    return steps;
}

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
    const steps = readFixtureSteps(yaml);
    const uses = steps.filter((step) => step.uses).map((step) => step.uses);
    assert.equal(uses.length, 2, 'fixture action count');
    for (const reference of uses) assert.match(reference, /^[\w-]+\/[\w-]+@[a-f0-9]{40}$/, 'fixture action must use a full pinned reference');
    assert.deepEqual(
        uses.map((reference) => reference.split('@')[0]),
        ['actions/checkout', 'actions/setup-node'],
        'fixture action allowlist'
    );
    assert.deepEqual(
        steps.filter((step) => step.uses).map((step) => step.with),
        [{ 'persist-credentials': 'false' }, { 'node-version': '26', 'package-manager-cache': 'false' }],
        'fixture checkout credentials and setup inputs must remain unchanged'
    );
    assert.match(yaml, /working-directory: tests\/bootstrap6-alpha/);
    assert.deepEqual(
        steps.filter((step) => step.run).map((step) => step.run),
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

test('fixture guard accepts equivalent action-first and command-first block steps', () => {
    assertFixtureWorkflow(workflow.replace(/^            - name: [^\n]+\n              (uses|run): /gm, '            - $1: '));
});

// Inert text samples only: the guard reads strings and never runs these steps.
for (const [name, step] of [
    ['action-first step', '            - uses: example/fixture-action@' + '0'.repeat(40)],
    ['command-first step', '            - run: echo fixture-sample'],
    ['flow step', '            - {run: echo fixture-sample}'],
    ['quoted key', '            - "run": echo fixture-sample'],
    ['anchored step', '            - &fixture-sample\n              run: echo fixture-sample'],
    ['block command', '            - run: |\n                echo fixture-sample']
])
    test(`fixture guard rejects an extra or unsupported ${name}`, () => {
        assert.throws(() => assertFixtureWorkflow(workflow.replace('            - name: Install', step + '\n            - name: Install')));
    });

test('fixture guard rejects duplicate step keys', () => {
    assert.throws(() =>
        assertFixtureWorkflow(workflow.replace('              run: npm test', '              run: echo fixture-sample\n              run: npm test'))
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
    ['unexpected command', (s) => s.replace('run: npm test', 'run: echo fixture-sample'), /commands/],
    ['protected environment', (s) => s.replace('runs-on: ubuntu-latest', 'environment: production\n        runs-on: ubuntu-latest'), /environment/]
])
    test(`independent workflow guard rejects changed ${name}`, () => assert.throws(() => assertFixtureWorkflow(change(workflow)), diagnostic));

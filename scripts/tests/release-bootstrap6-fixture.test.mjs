import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// Verification only: existing common CI runs this builtin-only test independently
// of the fixture workflow. No sample workflow or sample command is executed.
const workflow = readFileSync(new URL('../../.github/workflows/bootstrap6-alpha.yml', import.meta.url), 'utf8');
const ci = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');

// This deliberately fixed workflow needs a reviewed contract update for any
// content change, including comments/names or equivalent YAML representations.
// Do not replace this literal with data read from the workflow under test.
const expectedWorkflow = `name: Bootstrap 6 alpha fixture

env:
    FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true

on:
    push:
        branches: [3.x-alpha]
    pull_request:
        branches: [3.x-alpha]

permissions:
    contents: read

jobs:
    static-compatibility:
        name: Bootstrap 6 pinned CSS characterization
        runs-on: ubuntu-latest
        timeout-minutes: 10
        defaults:
            run:
                working-directory: tests/bootstrap6-alpha
        steps:
            - name: Checkout
              uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
              with:
                  persist-credentials: false
            - name: Setup Node.js
              uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
              with:
                  node-version: 26
                  package-manager-cache: false
            - name: Install isolated exact CSS and fixture tools
              run: npm ci --ignore-scripts --no-audit --no-fund
            - name: Test integrity guards and static characterization
              run: npm test
`;

function assertFixtureWorkflow(source) {
    // CRLF is the only permitted presentation difference. Do not discard comments,
    // whitespace, unknown keys, or YAML forms that could carry configuration.
    assert.equal(source.replaceAll('\r\n', '\n'), expectedWorkflow, 'fixture full-file workflow contract changed');
}

test('fixed fixture workflow matches its independent full-file contract', () => {
    assert.match(ci, /node --test scripts\/tests\/release-\*\.test\.mjs/);
    assertFixtureWorkflow(workflow);
});

test('fixture contract permits CRLF line endings only', () => {
    assertFixtureWorkflow(workflow.replaceAll('\n', '\r\n'));
});

// All mutations are inert local strings. They are never written as workflows or
// submitted for execution. Benign structural changes establish fail-closed scope.
for (const [name, change] of [
    ['workflow metadata', (s) => s.replace('env:\n', 'env:\n    FIXTURE_NOTE: sample\n')],
    ['job metadata', (s) => s.replace('jobs:\n', 'jobs:\n    fixture-sample: {name: sample}\n')],
    ['job timeout', (s) => s.replace('timeout-minutes: 10', 'timeout-minutes: 11')],
    [
        'defaults setting',
        (s) => s.replace('working-directory: tests/bootstrap6-alpha', 'working-directory: tests/bootstrap6-alpha\n                shell: sh')
    ],
    ['workflow name', (s) => s.replace('name: Bootstrap 6 alpha fixture', 'name: Fixture sample')],
    ['step name', (s) => s.replace('name: Checkout', 'name: Sample checkout')],
    ['read-only permissions', (s) => s.replace('contents: read', 'contents: none')],
    ['job read-only mapping', (s) => s.replace('runs-on: ubuntu-latest', 'permissions: {contents: read}\n        runs-on: ubuntu-latest')],
    ['target branch', (s) => s.replaceAll('[3.x-alpha]', '[fixture-sample]')],
    ['action reference', (s) => s.replace('actions/checkout@', 'example/fixture-action@')],
    ['action input', (s) => s.replace('persist-credentials: false', 'persist-credentials: false\n                  fetch-depth: 1')],
    ['test omission', (s) => s.replace('run: npm test', 'run: echo fixture-sample')],
    ['step representation', (s) => s.replace(/^            - name: [^\n]+\n              (uses|run): /gm, '            - $1: ')],
    ['comment', (s) => s + '# Fixture sample note.\n'],
    ['duplicate field', (s) => s.replace('              run: npm test', '              run: echo fixture-sample\n              run: npm test')]
])
    test(`fixture contract rejects changed ${name}`, () => {
        const changed = change(workflow);
        assert.notEqual(changed, workflow, 'structural mutation must change the fixture text');
        assert.throws(() => assertFixtureWorkflow(changed), /full-file workflow contract/);
    });

for (const [name, step] of [
    ['action-first step', '            - uses: example/fixture-action@' + '0'.repeat(40)],
    ['command-first step', '            - run: echo fixture-sample'],
    ['flow step', '            - {run: echo fixture-sample}'],
    ['quoted key', '            - "run": echo fixture-sample'],
    ['anchored step', '            - &fixture-sample\n              run: echo fixture-sample'],
    ['block command', '            - run: |\n                echo fixture-sample']
])
    test(`fixture contract rejects extra ${name}`, () => {
        const changed = workflow.replace('            - name: Install', step + '\n            - name: Install');
        assert.notEqual(changed, workflow, 'structural mutation must change the fixture text');
        assert.throws(() => assertFixtureWorkflow(changed), /full-file workflow contract/);
    });

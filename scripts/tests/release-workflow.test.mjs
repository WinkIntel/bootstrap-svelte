import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const publish = readFileSync(new URL('../../.github/workflows/publish.yml', import.meta.url), 'utf8');
const ci = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');
// These checks pin privilege boundaries; actionlint separately validates YAML/expressions.
const job = (name) => {
    const match = publish.match(new RegExp(`^    ${name}:\\n([\\s\\S]*?)(?=^    [a-z]+:|$(?![\\s\\S]))`, 'm'));
    assert.ok(match, `missing ${name} job`);
    return match[1];
};
test('only the live protected job can request OIDC', () => {
    assert.equal((publish.match(/id-token:/g) ?? []).length, 1);
    assert.match(job('publish'), /permissions:\n +contents: read\n +id-token: write/);
    assert.match(publish.split('jobs:')[0], /permissions:\n +contents: read/);
    for (const name of ['rehearsal', 'publish']) {
        assert.match(job(name), /environment: npm-publish/);
        assert.match(job(name), /needs: build/);
        assert.doesNotMatch(job(name), /actions\/checkout|pnpm\/action-setup|pnpm (install|build|test)|run:.*scripts\//);
    }
    assert.match(job('rehearsal'), /if: \$\{\{ inputs.dry-run \}\}/);
    assert.match(job('publish'), /if: \$\{\{ !inputs.dry-run \}\}/);
});
test('both protected modes use the same verification and same-run artifact download', () => {
    for (const anchor of ['release-node', 'release-download', 'release-execute']) {
        assert.ok(job('rehearsal').includes(`&${anchor}`));
        assert.ok(job('publish').includes(`*${anchor}`));
    }
    assert.match(job('rehearsal'), /artifact-ids: \$\{\{ needs.build.outputs.artifact-id \}\}/);
    assert.doesNotMatch(job('rehearsal'), /github-token:|run-id:|repository:/);
    assert.match(publish, /group: npm-publish-bootstrap-svelte\n +cancel-in-progress: false/);
    assert.match(publish, /default: true/);
});
test('both workflows pin actions, avoid stored checkout credentials, and retain build CI on both branches', () => {
    for (const workflow of [ci, publish]) {
        const uses = [...workflow.matchAll(/uses: (\S+)/g)].map((m) => m[1]);
        assert.ok(uses.length > 0);
        assert.ok(uses.every((value) => /^[\w-]+\/[\w-]+@[a-f0-9]{40}$/.test(value)));
        assert.match(workflow, /persist-credentials: false/);
        assert.doesNotMatch(workflow, /corepack (enable|prepare)/);
        assert.match(workflow, /node --test scripts\/tests\/release-\*\.test\.mjs/);
    }
    assert.match(ci, /permissions:\n +contents: read/);
    assert.match(ci, /branches: \[main, codex\/maintenance-1.x\]/);
    assert.match(ci, /^ +build:/m);
});

test('maintenance dispatch defaults to the maintenance channel and remains a rehearsal', () => {
    assert.match(publish, /tag:\n[\s\S]*?default: maintenance\n/);
    assert.match(publish, /dry-run:\n[\s\S]*?default: true\n/);
});

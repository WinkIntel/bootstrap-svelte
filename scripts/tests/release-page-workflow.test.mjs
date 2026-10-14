import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
const read = (path) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
test('live-only caller preserves npm privilege boundary and checks configuration before publishing', () => {
    const yaml = read('.github/workflows/publish.yml');
    assert.match(yaml, /releasepage:\n +needs: \[build, publish\]/);
    assert.match(yaml, /!inputs.configuration-check && !inputs.dry-run && needs.publish.result == 'success'/);
    assert.match(yaml, /uses: \.\/\.github\/workflows\/release-page.yml/);
    assert.match(yaml, /build-run-attempt: \$\{\{ needs.build.outputs.run-attempt \}\}/);
    assert.match(yaml, /publish-run-attempt: \$\{\{ needs.publish.outputs.run-attempt \}\}/);
    assert.equal((yaml.match(/id-token: write/g) ?? []).length, 1);
    const live = yaml.slice(yaml.indexOf('\n    publish:'));
    assert.ok(live.indexOf('Check release-page configuration') < live.indexOf('*release-execute'));
    assert.match(live, /RELEASE_APP_KEY_PRESENT: \$\{\{ secrets.RELEASE_APP_PRIVATE_KEY != '' \}\}/);
    assert.doesNotMatch(yaml, /contents: write|npm (publish|dist-tag).*--force/);
    assert.ok(live.indexOf('Record successful publication attempt') > live.indexOf('*release-execute'));
    assert.match(live, /steps.publication.outputs.run-attempt/);
    assert.match(read('scripts/release-policy.mjs'), /changelogSection\(readFileSync\('CHANGELOG.md', 'utf8'\), release.version\)/);
});
test('recovery is run-and-attempt based, has no npm publication or OIDC, and uses protected narrow App token', () => {
    const yaml = read('.github/workflows/release-page.yml');
    assert.match(yaml, /workflow_call:/);
    assert.match(yaml, /workflow_dispatch:/);
    assert.match(yaml, /publish-run-id:/);
    assert.match(yaml, /publish-run-attempt:/);
    assert.match(yaml, /build-run-attempt:/);
    assert.match(yaml, /environment: npm-publish/);
    assert.match(yaml, /needs: \[verify, configuration\]/);
    assert.doesNotMatch(yaml, /(?:^|\n)\s+(?:id-token:|contents: write)|run:.*npm publish|secrets: inherit/m);
    assert.match(yaml, /repositories: bootstrap-svelte/);
    assert.match(yaml, /owner: WinkIntel/);
    assert.match(yaml, /permission-contents: write/);
    assert.match(yaml, /permission-workflows: write/);
    assert.doesNotMatch(yaml, /permission-(administration|actions|pull-requests): write|skip-token-revoke: true/);
    const uses = [...yaml.matchAll(/uses: (\S+)/g)].map((x) => x[1]);
    assert.ok(uses.every((value) => /^[\w-]+\/[\w-]+@[a-f0-9]{40}$/.test(value)));
    assert.equal((yaml.match(/persist-credentials: false/g) ?? []).length, 2);
    const writer = yaml.slice(yaml.indexOf('\n    write:'));
    assert.doesNotMatch(writer, /npm install|pnpm|audit signatures|id-token/);
});
test('privileged writer has no process execution or publication fallback', () => {
    const source = read('scripts/release-page-write.mjs');
    assert.doesNotMatch(source, /child_process|execFile|spawnSync|NODE_AUTH_TOKEN|NPM_TOKEN/);
    assert.match(source, /RELEASE_PAGE_TOKEN/);
    assert.match(source, /No fallback token/);
    const verifier = read('scripts/release-page-verify.mjs');
    assert.match(verifier, /'audit',\s*'signatures',\s*'--json',\s*'--include-attestations'/);
    assert.match(verifier, /'install',\s*'--ignore-scripts'/);
    assert.match(verifier, /'--omit=peer'/);
    assert.doesNotMatch(verifier, /'publish'\s*[,\]]/);
});

test('automatic release-page call forwards only the required environment App key by name', () => {
    const caller = read('.github/workflows/publish.yml').split('\n    releasepage:')[1];
    assert.ok(caller, 'Expected the automatic release-page caller');
    const mapping = caller.match(/\n        secrets:\n((?: {12}[^\n]+\n?)+)/)?.[1];
    assert.equal(mapping?.trim(), 'RELEASE_APP_PRIVATE_KEY: ${{ secrets.RELEASE_APP_PRIVATE_KEY }}');
    assert.doesNotMatch(caller, /secrets: inherit|environment:/);
    const callee = read('.github/workflows/release-page.yml');
    const contract = callee.split('    workflow_call:')[1]?.split('    workflow_dispatch:')[0];
    assert.ok(contract, 'Expected reusable workflow contract');
    assert.match(contract, /\n        secrets:\n            RELEASE_APP_PRIVATE_KEY:\n                required: true(?:\n|$)/);
});
test('environment App key stays behind the writer approval and is never passed through inputs or outputs', () => {
    const yaml = read('.github/workflows/release-page.yml');
    const verifier = yaml.split('\n    verify:')[1]?.split('\n    write:')[0];
    const writer = yaml.split('\n    write:')[1];
    assert.ok(verifier && writer);
    assert.doesNotMatch(verifier, /RELEASE_APP_PRIVATE_KEY|environment: npm-publish/);
    assert.match(writer, /environment: npm-publish/);
    assert.match(writer, /RELEASE_APP_KEY_PRESENT: \$\{\{ secrets.RELEASE_APP_PRIVATE_KEY != '' \}\}/);
    assert.match(writer, /private-key: \$\{\{ secrets.RELEASE_APP_PRIVATE_KEY \}\}/);
    assert.ok(writer.indexOf('Check release-page App configuration') < writer.indexOf('Mint short-lived repository-scoped release token'));
    for (const source of [yaml, read('.github/workflows/publish.yml')]) {
        assert.doesNotMatch(source, /inputs\.RELEASE_APP_PRIVATE_KEY|outputs\.RELEASE_APP_PRIVATE_KEY|secrets: inherit/);
    }
});

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import {
    releaseIdentity,
    changelogNotes,
    verifyPublication,
    validateReport,
    ensureRelease,
    verifyRun,
    retryRegistry,
    readyNpmLatest
} from '../release-page.mjs';

const sha = 'a'.repeat(40);
const release = releaseIdentity({ version: '2.1.2', sha, ref: 'refs/heads/main' });
const tarball = Buffer.from('reviewed artifact');
const sha512 = createHash('sha512').update(tarball).digest('hex');
function evidence() {
    const statement = {
        subject: [{ name: 'pkg:npm/%40winkintel/bootstrap-svelte@2.1.2', digest: { sha512 } }],
        predicate: {
            buildDefinition: {
                buildType: 'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1',
                externalParameters: {
                    workflow: { repository: 'https://github.com/WinkIntel/bootstrap-svelte', path: '.github/workflows/publish.yml', ref: release.ref }
                },
                resolvedDependencies: [{ uri: 'git+https://github.com/WinkIntel/bootstrap-svelte@' + release.ref, digest: { gitCommit: sha } }]
            },
            runDetails: { metadata: { invocationId: 'https://github.com/WinkIntel/bootstrap-svelte/actions/runs/123/attempts/1' } }
        }
    };
    const item = {
        name: release.name,
        version: release.version,
        registry: 'https://registry.npmjs.org/',
        attestations: { provenance: { predicateType: 'https://slsa.dev/provenance/v1' } },
        attestationBundles: [
            {
                predicateType: 'https://slsa.dev/provenance/v1',
                bundle: { dsseEnvelope: { payload: Buffer.from(JSON.stringify(statement)).toString('base64') } }
            }
        ]
    };
    return {
        release,
        tarball,
        metadata: { name: release.name, version: release.version, dist: { integrity: 'sha512-' + Buffer.from(sha512, 'hex').toString('base64') } },
        audit: { invalid: [], missing: [], verified: [item] },
        runId: '123',
        attempt: '1'
    };
}
function report() {
    return {
        schema: 1,
        ...release,
        runId: '123',
        attempt: '1',
        sha256: 'b'.repeat(64),
        sha512,
        publishedAt: '2026-10-13T13:00:00.000Z',
        notes: 'Reviewed consumer notes.'
    };
}
const run = {
    id: 123,
    run_attempt: 1,
    event: 'workflow_dispatch',
    path: '.github/workflows/publish.yml',
    head_sha: sha,
    head_branch: 'main',
    repository: { full_name: 'WinkIntel/bootstrap-svelte' }
};
const jobs = [{ name: 'Publish approved tarball', conclusion: 'success', status: 'completed', head_sha: sha }];

test('channels and source refs match existing publication policy', () => {
    assert.equal(release.channel, 'latest');
    assert.equal(releaseIdentity({ version: '1.1.2', sha, ref: 'refs/heads/codex/maintenance-1.x' }).channel, 'maintenance');
    assert.equal(releaseIdentity({ version: '2.2.0-rc.1', sha, ref: 'refs/tags/v2.2.0-rc.1' }).channel, 'next');
    for (const version of ['1.2.0-rc.1', '3.0.0', '2.1.2+build', '2.01.2', '../../main'])
        assert.throws(() => releaseIdentity({ version, sha, ref: release.ref }));
    assert.throws(() => releaseIdentity({ version: '2.1.2', sha, ref: 'refs/heads/feature' }));
});
test('only original successful live publish jobs authorize page creation', () => {
    assert.equal(verifyRun(run, jobs, '123', '1').sha, sha);
    for (const patch of [
        { event: 'push' },
        { head_branch: 'feature' },
        { path: '.github/workflows/ci.yml' },
        { repository: { full_name: 'elsewhere/repo' } },
        { run_attempt: 2 }
    ])
        assert.throws(() => verifyRun({ ...run, ...patch }, jobs, '123', '1'));
    for (const list of [
        [],
        [{ ...jobs[0], name: 'Rehearse protected release' }],
        [{ ...jobs[0], conclusion: 'failure' }],
        [{ ...jobs[0], head_sha: 'c'.repeat(40) }],
        [...jobs, ...jobs]
    ])
        assert.throws(() => verifyRun(run, list, '123', '1'));
});
test('notes use only one dated exact-version section', () => {
    const notes = changelogNotes(
        '# Changelog\n\n## 2.1.2 — 2026-10-13\n\n- Fixed panel.\n\n## 2.1.1 — 2026-10-12\nOld note',
        release,
        '2026-10-13T13:00:00.000Z',
        '123',
        '1'
    );
    assert.match(notes, /Fixed panel/);
    assert.doesNotMatch(notes, /Old note/);
    assert.match(notes, /2026-10-13/);
    assert.match(notes, /953c293|aaaaaaaa/);
    for (const text of [
        '## Unreleased\nnew',
        '## 2.1.20 — 2026-10-13\nwrong',
        '## 2.1.2 — 2026-99-99\nwrong',
        '## 2.1.2 — 2026-10-13\na\n## 2.1.2 — 2026-10-13\nb'
    ])
        assert.throws(() => changelogNotes(text, release, '2026-10-13T13:00:00.000Z', '123', '1'));
});
test('verified npm attestation binds artifact, source, workflow and original run attempt', () => {
    assert.equal(verifyPublication(evidence()).sha512, sha512);
    for (const field of ['tarball', 'metadata', 'audit', 'runId', 'attempt']) {
        const e = evidence();
        e[field] = {
            tarball: Buffer.from('other'),
            metadata: { name: release.name, version: '2.1.1' },
            audit: { invalid: [], missing: [], verified: [] },
            runId: '124',
            attempt: '2'
        }[field];
        assert.throws(() => verifyPublication(e), field);
    }
    for (const mutation of [
        (s) => (s.predicate.buildDefinition.resolvedDependencies[0].digest.gitCommit = 'c'.repeat(40)),
        (s) => (s.predicate.buildDefinition.externalParameters.workflow.path = '.github/workflows/other.yml'),
        (s) => (s.predicate.buildDefinition.externalParameters.workflow.repository = 'https://github.com/other/repo'),
        (s) => (s.subject[0].digest.sha512 = 'd'.repeat(128))
    ]) {
        const e = evidence(),
            envelope = e.audit.verified[0].attestationBundles[0].bundle.dsseEnvelope,
            s = JSON.parse(Buffer.from(envelope.payload, 'base64'));
        mutation(s);
        envelope.payload = Buffer.from(JSON.stringify(s)).toString('base64');
        assert.throws(() => verifyPublication(e));
    }
    const e = evidence();
    e.audit.invalid.push({ name: release.name });
    assert.throws(() => verifyPublication(e));
});
test('untrusted report identity and lengths fail closed', () => {
    assert.equal(validateReport(report()).version, '2.1.2');
    for (const patch of [
        { sha: 'main' },
        { channel: 'maintenance' },
        { runId: '1\nhello' },
        { attempt: '0' },
        { schema: 2 },
        { notes: 'a'.repeat(40000) },
        { publishedAt: 'yesterday' },
        { sha256: 'wrong' }
    ])
        assert.throws(() => validateReport({ ...report(), ...patch }));
});
test('registry propagation is bounded and does not retry authorization failures', async () => {
    let calls = 0;
    assert.equal(
        await retryRegistry(
            async () => {
                calls++;
                return calls < 3 ? null : 'visible';
            },
            async () => {},
            3
        ),
        'visible'
    );
    assert.equal(calls, 3);
    await assert.rejects(
        retryRegistry(
            async () => null,
            async () => {},
            2
        ),
        /registry|propagat/i
    );
    calls = 0;
    await assert.rejects(
        retryRegistry(
            async () => {
                calls++;
                throw new Error('403');
            },
            async () => {},
            3
        ),
        /403/
    );
    assert.equal(calls, 1);
});
function github({ tag = null, existing = null, latest = null, failRelease = false } = {}) {
    const writes = [];
    let tagValue = tag,
        record = existing,
        fail = failRelease;
    const api = async (path, options = {}) => {
        if (options.method === 'POST') {
            writes.push({ path, ...options });
            if (path === '/git/refs') {
                tagValue = { object: { type: 'commit', sha: options.body.sha } };
                return tagValue;
            }
            if (path === '/releases') {
                if (fail) {
                    fail = false;
                    throw new Error('temporary release failure');
                }
                record = { ...options.body, id: 1, html_url: 'https://github.com/WinkIntel/bootstrap-svelte/releases/tag/v2.1.2' };
                if (options.body.make_latest === 'true') latest = record;
                return record;
            }
            throw new Error('Unexpected write');
        }
        if (path.startsWith('/git/ref/')) return tagValue;
        if (path === '/git/tags/annotated') return { object: { type: 'commit', sha } };
        if (path === '/releases/latest') return latest;
        if (path.startsWith('/releases/tags/')) return record;
        throw new Error('Unexpected read ' + path);
    };
    return { api, writes };
}
test('creates exact tag and stable latest release; rerun makes no writes', async () => {
    const g = github();
    await ensureRelease(report(), g.api, '2.1.2');
    assert.equal(g.writes.length, 2);
    assert.deepEqual(g.writes[0].body, { ref: 'refs/tags/v2.1.2', sha });
    assert.equal(g.writes[1].body.make_latest, 'true');
    assert.equal(g.writes[1].body.prerelease, false);
    await ensureRelease(report(), g.api, '2.1.2');
    assert.equal(g.writes.length, 2);
});
test('tag/release conflicts fail without overwriting existing state', async () => {
    for (const config of [
        { tag: { object: { type: 'commit', sha: 'c'.repeat(40) } } },
        { existing: { body: 'human notes', draft: false, prerelease: false, tag_name: 'v2.1.2' } }
    ]) {
        const g = github(config);
        await assert.rejects(ensureRelease(report(), g.api, '2.1.2'), /conflict/i);
        assert.equal(g.writes.length, 0);
    }
});
test('annotated tags resolve to exact source and are not recreated', async () => {
    const g = github({ tag: { object: { type: 'tag', sha: 'annotated' } } });
    await ensureRelease(report(), g.api, '2.1.2');
    assert.equal(g.writes.length, 1);
    assert.equal(g.writes[0].path, '/releases');
});
test('release-only retry recovers after tag creation without republishing', async () => {
    const g = github({ failRelease: true });
    await assert.rejects(ensureRelease(report(), g.api, '2.1.2'));
    await ensureRelease(report(), g.api, '2.1.2');
    assert.equal(g.writes.filter((x) => x.path === '/git/refs').length, 1);
    assert.equal(g.writes.filter((x) => x.path === '/releases').length, 2);
});
test('maintenance and prerelease never become latest; old repairs never demote latest', async () => {
    for (const [version, ref, expected] of [
        ['1.1.2', 'refs/heads/codex/maintenance-1.x', false],
        ['2.2.0-rc.1', 'refs/heads/main', true]
    ]) {
        const r = { ...report(), ...releaseIdentity({ version, sha, ref }) },
            g = github();
        await ensureRelease(r, g.api, '2.1.2');
        const body = g.writes[1].body;
        assert.equal(body.make_latest, 'false');
        assert.equal(body.prerelease, expected);
    }
    for (const [npmLatest, latest] of [
        ['2.1.3', null],
        ['2.1.2', { tag_name: 'v2.1.3' }]
    ]) {
        const g = github({ latest });
        await ensureRelease(report(), g.api, npmLatest);
        assert.equal(g.writes[1].body.make_latest, 'false');
    }
});

test('recovery requires one unexpired source-matching original artifact', async () => {
    const { selectArtifact } = await import('../release-page-verify.mjs');
    const item = {
        id: 42,
        name: 'npm-release-123-1',
        expired: false,
        size_in_bytes: 100,
        workflow_run: { id: 123, head_sha: sha, repository_id: 1263210535, head_repository_id: 1263210535 }
    };
    assert.equal(selectArtifact([item], run).id, 42);
    for (const list of [
        [],
        [item, item],
        [{ ...item, expired: true }],
        [{ ...item, workflow_run: { ...item.workflow_run, head_sha: 'c'.repeat(40) } }],
        [{ ...item, size_in_bytes: 100000000 }]
    ])
        assert.throws(() => selectArtifact(list, run));
});

test('stable dist-tag propagation waits before release writes and historical repair stays allowed', async () => {
    const values = ['2.1.1', '2.1.2'];
    assert.equal(
        await readyNpmLatest(
            report(),
            async () => values.shift(),
            async () => {}
        ),
        '2.1.2'
    );
    assert.equal(
        await readyNpmLatest(
            report(),
            async () => '2.1.3',
            async () => {}
        ),
        '2.1.3'
    );
    await assert.rejects(
        readyNpmLatest(
            report(),
            async () => 'invalid',
            async () => {}
        ),
        /dist-tag/
    );
});
test('existing releases with conflicting latest state fail without writes', async () => {
    const existing = { tag_name: 'v2.1.2', name: 'Bootstrap Svelte 2.1.2', body: report().notes, draft: false, prerelease: false };
    const g = github({ tag: { object: { type: 'commit', sha } }, existing, latest: { tag_name: 'v2.1.1' } });
    await assert.rejects(ensureRelease(report(), g.api, '2.1.2'), /latest.*conflict/i);
    assert.equal(g.writes.length, 0);
});
test('npm verified registry identity accepts the canonical URL with or without trailing slash', () => {
    const value = evidence();
    value.audit.verified[0].registry = 'https://registry.npmjs.org';
    assert.ok(verifyPublication(value).sha512);
    value.audit.verified[0].registry += '.evil';
    assert.throws(() => verifyPublication(value));
});

test('existing maintenance release incorrectly marked latest requires owner review', async () => {
    const r = { ...report(), ...releaseIdentity({ version: '1.1.2', sha, ref: 'refs/heads/codex/maintenance-1.x' }) };
    const existing = { tag_name: 'v1.1.2', name: 'Bootstrap Svelte 1.1.2', body: r.notes, draft: false, prerelease: false };
    const g = github({ tag: { object: { type: 'commit', sha } }, existing, latest: existing });
    await assert.rejects(ensureRelease(r, g.api, '2.1.2'), /latest.*conflict/i);
    assert.equal(g.writes.length, 0);
});

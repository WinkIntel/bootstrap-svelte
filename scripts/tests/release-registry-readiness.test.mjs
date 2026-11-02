import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import { createRequire, syncBuiltinESMExports } from 'node:module';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { verifyPublishedRun } from '../release-page-verify.mjs';

const childProcess = createRequire(import.meta.url)('node:child_process');
const name = '@winkintel/bootstrap-svelte',
    version = '2.2.1',
    sha = 'a'.repeat(40);
const target = `${name}@${version}`;
const base = 'https://registry.npmjs.org';
const versionURL = `${base}/${encodeURIComponent(name)}/${version}`;
const packumentURL = `${base}/${encodeURIComponent(name)}`;
const tarballURL = `${base}/@winkintel/bootstrap-svelte/-/bootstrap-svelte-${version}.tgz`;
const attestationURL = `${base}/-/npm/v1/attestations/${name}@${version}`;
const tarball = Buffer.from('original approved artifact');
const sha512 = createHash('sha512').update(tarball).digest('hex');
const metadata = () => ({
    name,
    version,
    dist: { tarball: tarballURL, integrity: `sha512-${Buffer.from(sha512, 'hex').toString('base64')}`, attestations: { url: attestationURL } }
});
function audit() {
    const statement = {
        subject: [{ name: `pkg:npm/%40winkintel/bootstrap-svelte@${version}`, digest: { sha512 } }],
        predicate: {
            buildDefinition: {
                buildType: 'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1',
                externalParameters: {
                    workflow: {
                        repository: 'https://github.com/WinkIntel/bootstrap-svelte',
                        path: '.github/workflows/publish.yml',
                        ref: 'refs/heads/main'
                    }
                },
                resolvedDependencies: [{ uri: 'git+https://github.com/WinkIntel/bootstrap-svelte@refs/heads/main', digest: { gitCommit: sha } }]
            },
            runDetails: { metadata: { invocationId: 'https://github.com/WinkIntel/bootstrap-svelte/actions/runs/123/attempts/1' } }
        }
    };
    return {
        invalid: [],
        missing: [],
        verified: [
            {
                name,
                version,
                registry: `${base}/`,
                attestations: { provenance: { predicateType: 'https://slsa.dev/provenance/v1' } },
                attestationBundles: [
                    {
                        predicateType: 'https://slsa.dev/provenance/v1',
                        bundle: { dsseEnvelope: { payload: Buffer.from(JSON.stringify(statement)).toString('base64') } }
                    }
                ]
            }
        ]
    };
}
function npmFailure(code, summary, detail = '') {
    return Object.assign(new Error(`Command failed: npm install ${target}\nnpm ${code}: ${summary}`), {
        status: 1,
        stdout: JSON.stringify({ error: { code, summary, detail } }),
        stderr: `npm error code ${code}\nnpm error ${summary}`
    });
}
function fixture(t, scenario = {}) {
    let elapsed = 0,
        installs = 0,
        audits = 0;
    const requests = [],
        commands = [],
        messages = [],
        timeouts = [];
    const nativeTimeout = AbortSignal.timeout;
    t.mock.method(AbortSignal, 'timeout', (ms) => {
        timeouts.push({ ms, elapsed });
        return nativeTimeout(ms);
    });
    t.mock.method(Date, 'now', () => elapsed);
    t.mock.method(globalThis, 'setTimeout', (callback, ms) => {
        elapsed += ms;
        queueMicrotask(callback);
        return 0;
    });
    t.mock.method(console, 'info', (message) => messages.push(message));
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        url = String(url);
        requests.push({ url, options, elapsed });
        const custom = scenario.read?.(url, elapsed, options);
        if (custom !== undefined) return custom;
        if (url === versionURL) return Response.json(metadata());
        if (url === packumentURL)
            return Response.json({ name, versions: { [version]: metadata() }, time: { [version]: '2026-11-02T13:47:49.494Z' } });
        if (url === tarballURL) return new Response(tarball);
        if (url === attestationURL)
            return Response.json({
                attestations: [
                    { predicateType: 'https://slsa.dev/provenance/v1', bundle: { dsseEnvelope: { payload: 'opaque; npm verifies cryptography' } } }
                ]
            });
        throw new Error(`Unexpected registry request ${url}`);
    });
    const run = {
        id: 123,
        run_attempt: 1,
        event: 'workflow_dispatch',
        path: '.github/workflows/publish.yml',
        head_sha: sha,
        head_branch: 'main',
        repository: { full_name: 'WinkIntel/bootstrap-svelte' }
    };
    t.mock.method(childProcess, 'execFileSync', (file, args, options = {}) => {
        commands.push({ file, args, options: { ...options, ...(options.env ? { env: { ...options.env } } : {}) }, elapsed });
        if (file === 'git') return args[0] === 'log' ? 'b'.repeat(40) : '';
        if (file === 'gh') {
            if (args[0] === 'run') {
                const directory = args.at(-1);
                mkdirSync(directory);
                writeFileSync(join(directory, 'release.tgz'), tarball);
                return '';
            }
            const path = args[1];
            if (path.includes('/contents/')) {
                const source = path.includes('package.json')
                    ? JSON.stringify({ name, version })
                    : `# Changelog\n\n## ${version} — 2026-11-02\n\n- Approved fix.\n`;
                return JSON.stringify({ type: 'file', encoding: 'base64', content: Buffer.from(source).toString('base64') });
            }
            if (path.includes('/jobs?'))
                return JSON.stringify({
                    jobs: ['Build release artifact', 'Publish approved tarball'].map((name) => ({
                        name,
                        status: 'completed',
                        conclusion: 'success',
                        head_sha: sha
                    }))
                });
            if (path.includes('/artifacts?'))
                return JSON.stringify({
                    artifacts: [
                        {
                            id: 42,
                            name: 'npm-release-123-1',
                            expired: false,
                            size_in_bytes: 100,
                            workflow_run: { id: 123, head_sha: sha, repository_id: 1263210535, head_repository_id: 1263210535 }
                        }
                    ]
                });
            if (path.endsWith('/attempts/1')) return JSON.stringify(run);
        }
        if (file === 'tar') return args[0] === '-tzf' ? 'package/package.json\n' : JSON.stringify({ name, version });
        if (file === 'npm') {
            if (args[0] === '--version') return '11.20.0';
            if (args[0] === 'install') {
                installs++;
                scenario.install?.({
                    installs,
                    elapsed,
                    options,
                    advance: (ms) => {
                        elapsed += ms;
                    }
                });
                return '{}';
            }
            if (args[0] === 'audit') {
                audits++;
                const result = audit();
                const output = scenario.audit?.({ audits, elapsed, result });
                return output ?? JSON.stringify(result);
            }
        }
        throw new Error(`Unexpected command ${file} ${args.join(' ')}`);
    });
    syncBuiltinESMExports();
    t.after(() => {
        t.mock.restoreAll();
        syncBuiltinESMExports();
    });
    return {
        verify: () => verifyPublishedRun('123', '1', '1'),
        requests,
        commands,
        messages,
        timeouts,
        elapsed: () => elapsed,
        installs: () => installs,
        audits: () => audits
    };
}

test('full verification waits for canonical tarball beyond the old 165 second window', async (t) => {
    const f = fixture(t, { read: (url, elapsed) => (url === tarballURL && elapsed < 210000 ? new Response('', { status: 404 }) : undefined) });
    const result = await f.verify();
    assert.equal(result.version, '2.2.1');
    assert.equal(result.sha512, sha512);
    assert.equal(f.elapsed(), 210000);
    assert.equal(f.installs(), 1);
    assert.equal(f.audits(), 1);
    assert.ok(f.messages.some((line) => line.includes('tarball') && line.includes(target)));
    assert.ok(f.commands.every(({ args }) => !args.includes('publish')));
});

test('exact target npm ETARGET retries with fresh registry queries and a clean cache', async (t) => {
    const caches = [];
    const f = fixture(t, {
        install: ({ installs, options }) => {
            caches.push(options.env.NPM_CONFIG_CACHE);
            if (installs === 1) {
                writeFileSync(join(options.cwd, 'package-lock.json'), 'partial failed install');
                throw npmFailure('ETARGET', `No matching version found for ${target}.`);
            }
            assert.equal(existsSync(join(options.cwd, 'package-lock.json')), false);
        }
    });
    assert.equal((await f.verify()).version, version);
    assert.equal(f.installs(), 2);
    assert.equal(new Set(caches).size, 2);
    assert.ok(f.requests.filter(({ url }) => url === versionURL).length >= 2);
    for (const { args, options } of f.commands.filter(({ file, args }) => file === 'npm' && args[0] !== '--version')) {
        assert.ok(args.includes('--prefer-online'));
        assert.ok(args.includes('--fetch-retries=0'));
        assert.ok(options.timeout > 0 && options.timeout <= 600000);
    }
});

test('full packument and attestation visibility can lag independently', async (t) => {
    const f = fixture(t, {
        read: (url, elapsed) => {
            if (url === packumentURL && elapsed < 45000) return Response.json({ name, versions: {}, time: {} });
            if (url === attestationURL && elapsed < 90000) return new Response('', { status: 404 });
        },
        audit: ({ elapsed }) => assert.ok(elapsed >= 90000)
    });
    assert.equal((await f.verify()).version, version);
    assert.equal(f.elapsed(), 90000);
    assert.ok(f.requests.some(({ url }) => url === attestationURL));
});

test('exact attestation 404 from npm audit retries without accepting an unsigned result', async (t) => {
    const f = fixture(t, {
        audit: ({ audits }) => {
            if (audits === 1) throw npmFailure('E404', `404 Not Found - GET ${attestationURL} - Not found`);
        }
    });
    assert.equal((await f.verify()).sha512, sha512);
    assert.equal(f.audits(), 2);
});

test('one deadline covers all stages and names the exhausted target and stage', async (t) => {
    const f = fixture(t, {
        read: (url, elapsed) => {
            if (url === tarballURL && elapsed < 570000) return new Response('', { status: 404 });
            if (url === attestationURL) return new Response('', { status: 404 });
        }
    });
    await assert.rejects(
        f.verify(),
        (error) =>
            /attestation/i.test(error.message) &&
            error.message.includes(target) &&
            /600000|600s|10 minute/.test(error.message) &&
            /release-page recovery/.test(error.message)
    );
    assert.equal(f.elapsed(), 600000);
    assert.equal(f.installs(), 0);
});

test('remaining deadline bounds child processes and network requests', async (t) => {
    const f = fixture(t, { read: (url, elapsed) => (url === tarballURL && elapsed < 570000 ? new Response('', { status: 404 }) : undefined) });
    assert.equal((await f.verify()).version, version);
    for (const { file, args, options, elapsed } of f.commands) {
        if (file === 'npm') assert.ok(options.timeout > 0 && options.timeout <= 600000 - elapsed, args.join(' '));
    }
    for (const { ms, elapsed } of f.timeouts) assert.ok(ms > 0 && ms <= 600000 - elapsed);
    for (const { options } of f.requests) {
        assert.equal(options.cache, 'no-store');
        assert.equal(options.headers['Cache-Control'], 'no-cache');
        assert.ok(options.signal instanceof AbortSignal);
    }
});

for (const [label, scenario, expected] of [
    ['401', { read: (url) => (url === versionURL ? new Response('', { status: 401 }) : undefined) }, /401/],
    ['403', { read: (url) => (url === versionURL ? new Response('', { status: 403 }) : undefined) }, /403/],
    ['null metadata', { read: (url) => (url === versionURL ? Response.json(null) : undefined) }, /Malformed registry JSON/],
    ['malformed metadata', { read: (url) => (url === versionURL ? Response.json({}) : undefined) }, /metadata|identity/],
    [
        'integrity mismatch',
        {
            read: (url) =>
                url === versionURL ? Response.json({ ...metadata(), dist: { ...metadata().dist, integrity: 'sha512-wrong' } }) : undefined
        },
        /integrity/
    ],
    [
        'unrelated ETARGET',
        {
            install: () => {
                throw npmFailure('ETARGET', 'No matching version found for other-package@9.0.0.');
            }
        },
        /ETARGET/
    ],
    [
        'mixed npm auth error',
        {
            install: () => {
                throw npmFailure('E403', `No matching version found for ${target}.`);
            }
        },
        /E403/
    ],
    [
        'unrelated 404',
        {
            audit: () => {
                throw npmFailure('E404', '404 Not Found - GET https://registry.npmjs.org/other - Not found');
            }
        },
        /E404/
    ],
    ['malformed npm output', { audit: () => 'invalid json' }, /JSON/],
    [
        'array packument versions',
        { read: (url) => (url === packumentURL ? Response.json({ name, versions: [], time: {} }) : undefined) },
        /packument/
    ],
    [
        'invalid publication timestamp',
        {
            read: (url) =>
                url === packumentURL ? Response.json({ name, versions: { [version]: metadata() }, time: { [version]: null } }) : undefined
        },
        /publication date/
    ],
    ['malformed packument', { read: (url) => (url === packumentURL ? Response.json({}) : undefined) }, /packument/],
    ['malformed attestations', { read: (url) => (url === attestationURL ? Response.json({ attestations: [] }) : undefined) }, /attestations/],
    [
        'unsupported attestation host',
        {
            read: (url) =>
                url === versionURL
                    ? Response.json({ ...metadata(), dist: { ...metadata().dist, attestations: { url: 'https://evil.invalid/attestations' } } })
                    : undefined
        },
        /host/
    ],
    ['published bytes differ', { read: (url) => (url === tarballURL ? new Response('other bytes') : undefined) }, /bytes differ/],
    [
        'invalid signature',
        {
            audit: ({ result }) => {
                result.invalid.push({ name });
            }
        },
        /signature/
    ],
    [
        'wrong source',
        {
            audit: ({ result }) => {
                const envelope = result.verified[0].attestationBundles[0].bundle.dsseEnvelope;
                const statement = JSON.parse(Buffer.from(envelope.payload, 'base64'));
                statement.predicate.buildDefinition.resolvedDependencies[0].digest.gitCommit = 'c'.repeat(40);
                envelope.payload = Buffer.from(JSON.stringify(statement)).toString('base64');
            }
        },
        /source/
    ]
])
    test(`${label} fails immediately without a readiness retry`, async (t) => {
        const f = fixture(t, scenario);
        await assert.rejects(f.verify(), expected);
        assert.equal(f.elapsed(), 0);
        assert.ok(f.installs() <= 1);
        assert.ok(f.audits() <= 1);
    });

test('an npm command stopped at the remaining deadline reports its stage without retrying', async (t) => {
    const f = fixture(t, {
        read: (url, elapsed) => (url === tarballURL && elapsed < 570000 ? new Response('', { status: 404 }) : undefined),
        install: ({ options, advance }) => {
            advance(options.timeout);
            throw Object.assign(new Error('npm timed out'), { code: 'ETIMEDOUT' });
        }
    });
    await assert.rejects(f.verify(), /readiness timeout.*npm-resolution/);
    assert.equal(f.elapsed(), 600000);
    assert.equal(f.installs(), 1);
});

test('npm audit ETARGET and install target 404 retry only the exact expected resource', async (t) => {
    const f = fixture(t, {
        install: ({ installs }) => {
            if (installs === 1) throw npmFailure('E404', `Not Found - GET https://registry.npmjs.org/@winkintel%2fbootstrap-svelte - Not found`);
        },
        audit: ({ audits }) => {
            if (audits === 1) throw npmFailure('ETARGET', `No matching version found for ${target}.`);
        }
    });
    assert.equal((await f.verify()).version, version);
    assert.equal(f.installs(), 2);
    assert.equal(f.audits(), 2);
    const auditCaches = f.commands.filter(({ args }) => args[0] === 'audit').map(({ options }) => options.env.NPM_CONFIG_CACHE);
    assert.equal(new Set(auditCaches).size, 2);
});

test('full packument waits for its own attestation pointer before npm verifies provenance', async (t) => {
    const f = fixture(t, {
        read: (url, elapsed) => {
            if (url !== packumentURL || elapsed >= 15000) return;
            const manifest = metadata();
            delete manifest.dist.attestations;
            return Response.json({ name, versions: { [version]: manifest }, time: { [version]: '2026-11-02T13:47:49.494Z' } });
        },
        audit: ({ elapsed, result }) => {
            // pacote cannot verify attestations if its full-packument manifest omits the pointer.
            if (elapsed < 15000) {
                delete result.verified[0].attestations;
                delete result.verified[0].attestationBundles;
            }
        }
    });
    assert.equal((await f.verify()).sha512, sha512);
    assert.equal(f.elapsed(), 15000);
    assert.equal(f.installs(), 1);
    assert.equal(f.audits(), 1);
    assert.ok(f.commands.filter(({ file, args }) => file === 'npm' && args[0] !== '--version').every(({ elapsed }) => elapsed >= 15000));
    assert.ok(f.messages.some((line) => line.includes('stage=packument')));
});

test('a persistently absent packument attestation pointer exhausts the shared deadline before npm runs', async (t) => {
    const f = fixture(t, {
        read: (url) => {
            if (url !== packumentURL) return;
            const manifest = metadata();
            delete manifest.dist.attestations;
            return Response.json({ name, versions: { [version]: manifest }, time: { [version]: '2026-11-02T13:47:49.494Z' } });
        }
    });
    await assert.rejects(f.verify(), /readiness timeout.*stage=packument/);
    assert.equal(f.elapsed(), 600000);
    assert.equal(f.installs(), 0);
    assert.equal(f.audits(), 0);
});

for (const [label, pointer] of [
    ['null', null],
    ['missing URL', {}],
    ['invalid URL', { url: 'not-a-url' }],
    ['nonregistry URL', { url: 'https://evil.invalid/attestations' }]
])
    test(`a packument attestation pointer with ${label} fails immediately`, async (t) => {
        const f = fixture(t, {
            read: (url) => {
                if (url !== packumentURL) return;
                const manifest = metadata();
                manifest.dist.attestations = pointer;
                return Response.json({ name, versions: { [version]: manifest }, time: { [version]: '2026-11-02T13:47:49.494Z' } });
            }
        });
        await assert.rejects(f.verify(), /attestations|URL|host/);
        assert.equal(f.elapsed(), 0);
        assert.equal(f.installs(), 0);
        assert.equal(f.audits(), 0);
    });

test('an explicitly unsigned npm audit result still fails immediately after pointer readiness', async (t) => {
    const f = fixture(t, {
        audit: ({ result }) => {
            delete result.verified[0].attestations;
            delete result.verified[0].attestationBundles;
        }
    });
    await assert.rejects(f.verify(), /not explicitly provenance-verified/);
    assert.equal(f.elapsed(), 0);
    assert.equal(f.installs(), 1);
    assert.equal(f.audits(), 1);
});

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
        _type: 'https://in-toto.io/Statement/v1',
        predicateType: 'https://slsa.dev/provenance/v1',
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
                const output = scenario.audit?.({ audits, elapsed, result, advance: (ms) => (elapsed += ms) });
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

test('an npm command stopped at the remaining deadline preserves its cause and stage without retrying', async (t) => {
    const f = fixture(t, {
        read: (url, elapsed) => (url === tarballURL && elapsed < 570000 ? new Response('', { status: 404 }) : undefined),
        install: ({ options, advance }) => {
            advance(options.timeout);
            throw Object.assign(new Error('npm timed out'), { code: 'ETIMEDOUT' });
        }
    });
    await assert.rejects(f.verify(), (error) => /npm-resolution.*npm timed out/.test(error.message) && error.cause?.code === 'ETIMEDOUT');
    assert.equal(f.elapsed(), 600000);
    assert.equal(f.installs(), 1);
});

test('a non-transient npm failure after the deadline preserves the original error', async (t) => {
    const original = npmFailure('E403', 'Forbidden');
    const f = fixture(t, {
        install: ({ advance }) => {
            advance(600001);
            throw original;
        }
    });
    await assert.rejects(
        f.verify(),
        (error) => error.cause === original && /npm-resolution/.test(error.message) && error.message.includes(original.message)
    );
    assert.equal(f.installs(), 1);
    assert.equal(f.audits(), 0);
    assert.equal(f.messages.length, 0);
});

test('a fully verified npm audit result finishing at the deadline is accepted', async (t) => {
    const f = fixture(t, {
        audit: ({ advance }) => {
            advance(600001);
        }
    });
    assert.equal((await f.verify()).sha512, sha512);
    assert.equal(f.audits(), 1);
    assert.equal(f.messages.length, 0);
});

test('an install finishing at the deadline cannot start the following provenance stage', async (t) => {
    const f = fixture(t, { install: ({ advance }) => advance(600001) });
    await assert.rejects(f.verify(), /readiness timeout.*npm-provenance/);
    assert.equal(f.installs(), 1);
    assert.equal(f.audits(), 0);
    assert.equal(f.messages.length, 0);
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

for (const otherVerified of [false, true])
    test(`npm's independently stale manifest retries absent target provenance${otherVerified ? ' alongside verified dependencies' : ''}`, async (t) => {
        const f = fixture(t, {
            audit: ({ audits, result }) => {
                if (audits === 1) {
                    if (otherVerified) result.verified[0].name = 'verified-dependency';
                    else result.verified = [];
                }
            }
        });
        assert.equal((await f.verify()).sha512, sha512);
        assert.equal(f.audits(), 2);
        assert.equal(f.elapsed(), 15000);
        assert.ok(f.messages.some((line) => line.includes('stage=npm-provenance')));
    });

test('persistent absence of npm target provenance exhausts the budget without accepting an unsigned package', async (t) => {
    const f = fixture(t, {
        audit: ({ result }) => {
            result.verified = [];
        }
    });
    await assert.rejects(f.verify(), /readiness timeout.*stage=npm-provenance/);
    assert.equal(f.elapsed(), 600000);
    assert.equal(f.audits(), 40);
    assert.ok(f.commands.filter(({ args }) => args[0] === 'audit').every(({ elapsed }) => elapsed < 600000));
});

test('absent npm provenance at the deadline cannot sleep or start another audit', async (t) => {
    const f = fixture(t, {
        audit: ({ result, advance }) => {
            result.verified = [];
            advance(600001);
        }
    });
    await assert.rejects(f.verify(), /readiness timeout.*stage=npm-provenance/);
    assert.equal(f.audits(), 1);
    assert.equal(f.messages.length, 0);
});

test('provenance appearing after an absent result still undergoes full source verification', async (t) => {
    const f = fixture(t, {
        audit: ({ audits, result }) => {
            if (audits === 1) result.verified = [];
            else
                changeStatement(result, (statement) => {
                    statement.predicate.buildDefinition.resolvedDependencies[0].digest.gitCommit = 'b'.repeat(40);
                });
        }
    });
    await assert.rejects(f.verify(), /source mismatch/);
    assert.equal(f.elapsed(), 15000);
    assert.equal(f.audits(), 2);
});

function changeStatement(result, change) {
    const envelope = result.verified[0].attestationBundles[0].bundle.dsseEnvelope;
    const statement = JSON.parse(Buffer.from(envelope.payload, 'base64'));
    change(statement);
    envelope.payload = Buffer.from(JSON.stringify(statement)).toString('base64');
}

for (const [label, change] of [
    [
        'empty predicate type',
        (item) => {
            item.attestationBundles[0].predicateType = '';
        }
    ],
    [
        'blank predicate type',
        (item) => {
            item.attestationBundles[0].predicateType = ' ';
        }
    ],
    [
        'empty payload',
        (item) => {
            item.attestationBundles[0].bundle.dsseEnvelope.payload = '';
        }
    ],
    [
        'blank payload',
        (item) => {
            item.attestationBundles[0].bundle.dsseEnvelope.payload = ' ';
        }
    ],
    [
        'non-JSON payload',
        (item) => {
            item.attestationBundles[0].bundle.dsseEnvelope.payload = 'not-json';
        }
    ],
    [
        'encoded non-JSON payload',
        (item) => {
            item.attestationBundles[0].bundle.dsseEnvelope.payload = Buffer.from('not-json').toString('base64');
        }
    ],
    ...[null, [], {}, 'statement'].map((value) => [
        `non-statement ${JSON.stringify(value)}`,
        (item) => {
            item.attestationBundles[0].bundle.dsseEnvelope.payload = Buffer.from(JSON.stringify(value)).toString('base64');
        }
    ]),
    [
        'empty attestations descriptor',
        (item) => {
            item.attestations = {};
        }
    ],
    [
        'mismatched predicate type',
        (item) => {
            item.attestationBundles[0].predicateType = 'https://example.com/other';
        }
    ],
    [
        'missing predicate',
        (_item, result) =>
            changeStatement(result, (statement) => {
                delete statement.predicate;
            })
    ],
    [
        'missing subject',
        (_item, result) =>
            changeStatement(result, (statement) => {
                delete statement.subject;
            })
    ],
    [
        'malformed subject',
        (_item, result) =>
            changeStatement(result, (statement) => {
                statement.subject = [null];
            })
    ]
])
    test(`unrelated npm proof with ${label} fails before an absence retry`, async (t) => {
        const f = fixture(t, {
            audit: ({ audits, result }) => {
                if (audits !== 1) return;
                result.verified[0].name = 'verified-dependency';
                change(result.verified[0], result);
            }
        });
        await assert.rejects(f.verify());
        assert.equal(f.audits(), 1);
        assert.equal(f.elapsed(), 0);
        assert.equal(f.messages.length, 0);
    });

test('well-formed unrelated npm proof can use a different predicate and source', async (t) => {
    const f = fixture(t, {
        audit: ({ audits, result }) => {
            if (audits !== 1) return;
            const item = result.verified[0];
            item.name = 'verified-dependency';
            const predicateType = 'https://example.com/publish/v1';
            item.attestations = { publish: { predicateType } };
            item.attestationBundles[0].predicateType = predicateType;
            const statement = {
                _type: 'https://in-toto.io/Statement/v0.1',
                predicateType,
                subject: [{ name: 'unrelated-package', digest: { sha256: 'b'.repeat(64) } }],
                predicate: { unrelated: 'publish metadata' }
            };
            item.attestationBundles[0].bundle.dsseEnvelope.payload = Buffer.from(JSON.stringify(statement)).toString('base64');
        }
    });
    assert.equal((await f.verify()).sha512, sha512);
    assert.equal(f.audits(), 2);
    assert.equal(f.elapsed(), 15000);
});

for (const [label, change] of [
    [
        'missing signature',
        (result) => {
            result.missing.push({ name });
            result.verified = [];
        }
    ],
    [
        'invalid attestation',
        (result) => {
            result.invalid.push({ code: 'EATTESTATIONVERIFY', name });
            result.verified = [];
        }
    ],
    [
        'missing invalid array',
        (result) => {
            delete result.invalid;
            result.verified = [];
        }
    ],
    [
        'malformed missing array',
        (result) => {
            result.missing = {};
            result.verified = [];
        }
    ],
    [
        'missing verified array',
        (result) => {
            delete result.verified;
        }
    ],
    [
        'malformed verified array',
        (result) => {
            result.verified = {};
        }
    ],
    [
        'malformed other verified entry',
        (result) => {
            result.verified = [null];
        }
    ],
    [
        'unproven other verified entry',
        (result) => {
            result.verified = [{ name: 'other', version, registry: base }];
        }
    ],
    [
        'wrong target version',
        (result) => {
            result.verified[0].version = '9.9.9';
        }
    ],
    [
        'wrong target registry',
        (result) => {
            result.verified[0].registry = 'https://evil.invalid';
        }
    ],
    [
        'duplicate target',
        (result) => {
            result.verified.push(structuredClone(result.verified[0]));
        }
    ],
    [
        'missing target bundle',
        (result) => {
            delete result.verified[0].attestationBundles;
        }
    ],
    [
        'empty target bundles',
        (result) => {
            result.verified[0].attestationBundles = [];
        }
    ],
    [
        'malformed target bundle',
        (result) => {
            result.verified[0].attestationBundles[0].bundle = {};
        }
    ],
    [
        'wrong workflow ref',
        (result) =>
            changeStatement(result, (statement) => {
                statement.predicate.buildDefinition.externalParameters.workflow.ref = 'refs/heads/other';
            })
    ],
    [
        'wrong run',
        (result) =>
            changeStatement(result, (statement) => {
                statement.predicate.runDetails.metadata.invocationId += '0';
            })
    ],
    [
        'wrong subject digest',
        (result) =>
            changeStatement(result, (statement) => {
                statement.subject[0].digest.sha512 = '0'.repeat(128);
            })
    ]
])
    test(`${label} in npm audit remains an immediate hard failure`, async (t) => {
        const f = fixture(t, {
            audit: ({ result }) => {
                change(result);
            }
        });
        await assert.rejects(f.verify());
        assert.equal(f.elapsed(), 0);
        assert.equal(f.audits(), 1);
        assert.equal(f.messages.length, 0);
    });

test('npm audit authentication failure remains immediate', async (t) => {
    const f = fixture(t, {
        audit: () => {
            throw npmFailure('E401', 'Unauthorized');
        }
    });
    await assert.rejects(f.verify(), /E401/);
    assert.equal(f.elapsed(), 0);
    assert.equal(f.audits(), 1);
});

for (const pointer of [null, false, 12, 'invalid', []])
    test(`a malformed version attestations pointer ${JSON.stringify(pointer)} has an explicit diagnostic`, async (t) => {
        const f = fixture(t, {
            read: (url) => (url === versionURL ? Response.json({ ...metadata(), dist: { ...metadata().dist, attestations: pointer } }) : undefined)
        });
        await assert.rejects(f.verify(), /Malformed registry attestations pointer/);
        assert.equal(f.elapsed(), 0);
        assert.equal(f.installs(), 0);
        assert.equal(f.audits(), 0);
    });

test('an absent version attestations pointer remains pending until it appears', async (t) => {
    const f = fixture(t, {
        read: (url, elapsed) => {
            if (url !== versionURL || elapsed >= 15000) return;
            const manifest = metadata();
            delete manifest.dist.attestations;
            return Response.json(manifest);
        }
    });
    assert.equal((await f.verify()).sha512, sha512);
    assert.equal(f.elapsed(), 15000);
    assert.equal(f.audits(), 1);
});

test('the first audit refresh detects metadata changes after a long install', async (t) => {
    let installed = false;
    const f = fixture(t, {
        install: ({ advance }) => {
            advance(180000);
            installed = true;
        },
        read: (url) =>
            installed && url === versionURL
                ? Response.json({ ...metadata(), dist: { ...metadata().dist, integrity: 'sha512-conflicting' } })
                : undefined
    });
    await assert.rejects(f.verify(), /npm-provenance.*integrity mismatch/);
    assert.equal(f.elapsed(), 180000);
    assert.equal(f.installs(), 1);
    assert.equal(f.audits(), 0);
});

test('the shared registry URL guard preserves the allowed origin and rejects credentials', async () => {
    const { registryURL, registryRead } = await import('../release-page.mjs');
    assert.equal(registryURL(`${base}/package?view=full`).href, `${base}/package?view=full`);
    for (const url of [
        'https://evil.invalid/package',
        'http://registry.npmjs.org/package',
        'https://registry.npmjs.org:444/package',
        'https://user@registry.npmjs.org/package',
        'https://:password@registry.npmjs.org/package'
    ]) {
        assert.throws(() => registryURL(url), /Unexpected package registry host/);
        await assert.rejects(
            registryRead(url, 'json', () => assert.fail('Rejected registry must not be fetched')),
            /Unexpected package registry host/
        );
    }
});

for (const field of ['tarball', 'attestations'])
    for (const url of [
        'https://evil.invalid/package',
        'https://user@registry.npmjs.org/package',
        'https://:password@registry.npmjs.org/package',
        'https://registry.npmjs.org:444/package'
    ])
        test(`version metadata rejects ${field} URL ${url} before fetching it`, async (t) => {
            const f = fixture(t, {
                read: (value) => {
                    if (value !== versionURL) return;
                    const manifest = metadata();
                    manifest.dist[field] = field === 'attestations' ? { url } : url;
                    return Response.json(manifest);
                }
            });
            await assert.rejects(f.verify(), /Unexpected package registry host/);
            assert.equal(f.requests.length, 1);
            assert.equal(f.installs(), 0);
            assert.equal(f.elapsed(), 0);
        });

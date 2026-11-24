import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

// Generator/serialization checks and deterministic reporting-fault regressions.
// No real browser is launched, and VM fault fixtures are not browser evidence.
test('server-free CLI emits verified artifacts, actual SSR markup and a finite unrun measurement plan from any cwd', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'bootstrap-spike-generator-test-'));
    try {
        const output = join(directory, 'index.html');
        const stdout = execFileSync(process.execPath, [fileURLToPath(new URL('./browser-spike.mjs', import.meta.url)), '--output', output], {
            cwd: tmpdir(),
            encoding: 'utf8'
        });
        const summary = JSON.parse(stdout);
        assert.equal(summary.browserExecuted, false);
        assert.equal(summary.output, output);
        const html = await readFile(output, 'utf8');
        const payload = JSON.parse(html.match(/<script id="spike-input" type="application\/json">([\s\S]*?)<\/script>/)[1]);
        assert.deepEqual(Object.keys(payload.styles), ['baseline', 'alpha', 'alpha2']);
        assert.equal(payload.styles.alpha2.sha256, '4df5807d5807353e17dda52a7ee6c0acb9aabb1401553b026136a2b3e145b480');
        assert.match(payload.styles.alpha2.css, /gap: var\(--bs-gutter-y\) var\(--bs-gutter-x\)/);
        assert.equal(payload.modes.length, 5);
        assert.equal(payload.frames.length, 100);
        assert.equal(new Set(payload.frames.map(({ mode, width, direction }) => `${mode}:${width}:${direction}`)).size, 100);
        assert(payload.frames.some(({ direction, scope }) => direction === 'rtl' && scope === 'layout'));
        assert(payload.frames.some(({ width, scope }) => width === 1023 && scope === 'responsive'));
        assert(payload.frames.some(({ width, scope }) => width === 1024 && scope === 'responsive'));
        for (const key of [
            'equal',
            'numeric-wrap',
            'row-cols',
            'gutter-zero',
            'gutter-axes',
            'nested',
            'offset',
            'responsive',
            'cascade',
            'flex-break'
        ])
            assert.match(payload.layout.current, new RegExp(`data-spike="${key}"`));
        assert.match(payload.layout.current, /col-lg-6/);
        assert.match(payload.layout.mapped, /lg:col-6/);
        assert.match(payload.layout.mapped, /2xl:col-3/);
        assert.equal(payload.layout.current.replace(/class="[^"]*"/g, ''), payload.layout.mapped.replace(/class="[^"]*"/g, ''));
        assert.equal(payload.layout.cases, 10);
        assert.equal(payload.styles.baseline.rtlParity, false);
        assert.match(html, /__bootstrapGridSpike/);
        assert.match(html, /UNRUN/);
        assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+href=|<iframe[^>]+src=/);
        const script = html.match(/<script id="measurement-program">([\s\S]*?)<\/script>/)[1];
        assert.doesNotThrow(() => new Function(script)); // Parse only, no DOM execution.
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

// Run the actual generated program with deliberately small DOM fault fixtures.
// This validates reporting/error paths, not browser layout, rendering or support.
async function runMeasurement({ name = 'cascade', style = 'alpha', orders = ['3', '2'], childWidth = 1280, containerWidth = 1280, fault } = {}) {
    const { runInNewContext } = await import('node:vm');
    const directory = await mkdtemp(join(tmpdir(), 'bootstrap-measurement-fault-'));
    try {
        const output = join(directory, 'index.html');
        execFileSync(process.execPath, [fileURLToPath(new URL('./browser-spike.mjs', import.meta.url)), '--output', output]);
        const html = await readFile(output, 'utf8');
        const input = JSON.parse(html.match(/<script id="spike-input" type="application\/json">([\s\S]*?)<\/script>/)[1]);
        const script = html.match(/<script id="measurement-program">([\s\S]*?)<\/script>/)[1];
        const mode = input.modes.find((mode) => mode.style === style && mode.markup === 'current');
        input.frames = [{ mode: mode.name, width: 1280, direction: 'ltr', scope: name === 'responsive' ? 'responsive' : 'layout' }];
        if (fault === 'second-load') input.frames.push({ ...input.frames[0] });
        const result = { textContent: 'UNRUN' };
        const window = {};
        let removed = false;
        let removedFrames = 0;
        let appendedFrames = 0;
        let frame;
        const doc = {
            documentElement: { clientWidth: 1280 },
            fonts: { ready: fault === 'fonts' ? new Promise(() => {}) : Promise.resolve() },
            defaultView: { getComputedStyle: (node) => node.css },
            querySelector: () => section,
            querySelectorAll: () => [section]
        };
        function node({ width = 1280, order = '0' } = {}) {
            return {
                className: '',
                ownerDocument: doc,
                clientWidth: width,
                scrollWidth: width,
                getBoundingClientRect: () => ({ x: 0, y: 0, width, height: 24 }),
                css: {
                    paddingLeft: '0px',
                    paddingRight: '0px',
                    borderLeftWidth: '0px',
                    borderRightWidth: '0px',
                    columnGap: '0px',
                    rowGap: '0px',
                    marginInlineStart: '0px',
                    marginLeft: '0px',
                    marginRight: '0px',
                    order,
                    direction: 'ltr',
                    getPropertyValue: () => '0px'
                }
            };
        }
        const row = node();
        row.children = orders.map((order) => node({ width: childWidth, order }));
        const section = {
            dataset: { spike: name },
            firstElementChild: node({ width: containerWidth }),
            querySelector: (selector) => (selector === '.row' ? row : null)
        };
        const document = {
            getElementById: (id) =>
                id === 'results' ? (fault === 'missing-output' ? null : result) : { textContent: fault === 'json' ? '{' : JSON.stringify(input) },
            createElement: () =>
                (frame = {
                    style: {},
                    contentDocument: doc,
                    contentWindow: { innerWidth: 1280, navigator: { userAgent: 'DOM fault fixture' } },
                    remove: () => {
                        removed = true;
                        removedFrames++;
                    }
                }),
            body: {
                append: () => {
                    appendedFrames++;
                    if (fault !== 'load' && !(fault === 'second-load' && appendedFrames === 2)) queueMicrotask(() => frame.onload());
                }
            }
        };
        const completion = runInNewContext(script, {
            window,
            document,
            navigator: { userAgent: 'DOM fault fixture' },
            setTimeout: (callback, milliseconds) => setTimeout(callback, Math.min(milliseconds, 10)),
            clearTimeout,
            requestAnimationFrame: (callback) => {
                if (fault !== 'animation') queueMicrotask(callback);
                return 1;
            },
            cancelAnimationFrame: () => {}
        });
        let rejection;
        await Promise.race([
            completion.catch((error) => {
                rejection = error;
            }),
            new Promise((resolve) => setTimeout(resolve, 100))
        ]);
        return { state: window.__bootstrapGridSpike, removed, removedFrames, rejection, text: result.textContent };
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
}

for (const [style, orders] of [
    ['alpha', ['2', '2']],
    ['baseline', ['3', '2']],
    ['alpha', ['3', '3']]
])
    test(`serialized cascade reporting rejects wrong discrete order ${style} ${orders.join('/')}`, async () => {
        const { state } = await runMeasurement({ style, orders });
        assert.equal(state.status, 'complete');
        assert.equal(state.summary.mismatches, 1);
    });

for (const fault of ['load', 'fonts', 'animation'])
    test(`serialized measurement terminates a stalled ${fault} wait with error evidence and frame cleanup`, async () => {
        const { state, removed, rejection } = await runMeasurement({ fault });
        assert.equal(rejection, undefined);
        assert.equal(state.complete, true);
        assert.equal(state.status, 'error');
        assert.match(state.errors.join('\n'), new RegExp(`Timed out.*${fault}`));
        assert.equal(state.summary.measuredFrames, 0);
        assert.equal(removed, true);
    });

for (const fault of ['json', 'missing-output'])
    test(`serialized measurement retains terminal state for early ${fault} setup failure`, async () => {
        const { state, rejection } = await runMeasurement({ fault });
        assert.equal(rejection, undefined);
        assert.equal(state.complete, true);
        assert.equal(state.status, 'error');
        assert.equal(state.errors.length, 1);
        assert.equal(state.summary.measuredFrames, 0);
    });

test('serialized current-token reporting asserts full-row/full-viewport outcome instead of exempting arbitrary breakage', async () => {
    const { state } = await runMeasurement({ name: 'responsive', style: 'alpha2', childWidth: 0, containerWidth: 100 });
    assert.equal(state.summary.expectedCurrentTokenMismatches, 2);
    assert.equal(state.summary.mismatches, 2);
});

test('serialized current-token reporting flags unexpectedly matching legacy-responsive references', async () => {
    const { state } = await runMeasurement({ name: 'responsive', style: 'alpha2', childWidth: 1280 / 3, containerWidth: 1200 });
    assert.equal(state.summary.unexpectedCurrentTokenMatches, 2);
    assert.equal(state.summary.mismatches, 2);
});

test('serialized current-token reporting retains the concrete known outcome and expected mismatch category', async () => {
    const { state } = await runMeasurement({ name: 'responsive', style: 'alpha2' });
    assert.equal(state.summary.mismatches, 0);
    assert.equal(state.summary.expectedCurrentTokenMismatches, 2);
    assert.equal(state.summary.unexpectedCurrentTokenMatches, 0);
});

test('CLI executes through a symlinked entry path instead of silently returning success', async () => {
    const { symlink } = await import('node:fs/promises');
    const directory = await mkdtemp(join(tmpdir(), 'bootstrap-spike-symlink-'));
    try {
        const entry = join(directory, 'spike.mjs');
        const output = join(directory, 'index.html');
        await symlink(fileURLToPath(new URL('./browser-spike.mjs', import.meta.url)), entry);
        const stdout = execFileSync(process.execPath, [entry, '--output', output], { cwd: tmpdir(), encoding: 'utf8' });
        assert.equal(JSON.parse(stdout).output, output);
        assert.match(await readFile(output, 'utf8'), /id="measurement-program"/);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test('CLI rejects an explicit empty output instead of falling back to its default destination', async () => {
    const { spawnSync } = await import('node:child_process');
    const run = spawnSync(process.execPath, [fileURLToPath(new URL('./browser-spike.mjs', import.meta.url)), '--output', ''], {
        cwd: tmpdir(),
        encoding: 'utf8'
    });
    assert.notEqual(run.status, 0);
    assert.match(run.stderr, /output.*(?:empty|non-empty)/i);
});

test('serialized timeout preserves completed-frame evidence and cleans both frames', async () => {
    const { state, removedFrames, rejection } = await runMeasurement({ fault: 'second-load' });
    assert.equal(rejection, undefined);
    assert.equal(state.status, 'error');
    assert.equal(state.complete, true);
    assert.equal(state.plannedFrames, 2);
    assert.equal(state.summary.measuredFrames, 1);
    assert.equal(state.results[0].cases[0].checks.length, 2);
    assert.match(state.errors.join('\n'), /Timed out.*load/);
    assert.equal(removedFrames, 2);
});

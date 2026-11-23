import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

// These are generator/serialization checks only. They never launch a browser,
// execute the measurement script, or count generated frames as browser passes.
test('server-free CLI emits verified artifacts, actual SSR markup and a finite unrun measurement plan from any cwd', async () => {
    const directory = await mkdtemp(new URL('./.generated-browser-test-', import.meta.url));
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

import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const load = () => import('./fixture.mjs');

test('pins installed Bootstrap versions and exact distributed CSS bytes before parsing', async () => {
    const { loadStyles } = await load();
    const styles = await loadStyles();
    assert.equal(styles.baseline.version, '5.3.6');
    assert.equal(styles.alpha.version, '6.0.0-alpha.1');
    assert.equal(styles.alpha.sha256, 'ad0d5123040e043dad1451a6d4483dad4df4e2835e6687d6cf5af8a757283371');
});

test('rejects wrong versions, missing CSS and tampered/malformed CSS before parsing', async () => {
    const { readVerifiedStyle, pins } = await load();
    const directory = await mkdtemp(join(tmpdir(), 'bootstrap-alpha-negative-'));
    try {
        await writeFile(join(directory, 'package.json'), JSON.stringify({ version: '6.0.0-alpha.2' }));
        await assert.rejects(readVerifiedStyle(directory, pins.alpha), /version mismatch/);
        await writeFile(join(directory, 'package.json'), JSON.stringify({ version: pins.alpha.version }));
        await assert.rejects(readVerifiedStyle(directory, pins.alpha), /ENOENT/);
        const { mkdir } = await import('node:fs/promises');
        await mkdir(join(directory, 'dist/css'), { recursive: true });
        await writeFile(join(directory, 'dist/css/bootstrap.css'), '.broken {');
        await assert.rejects(readVerifiedStyle(directory, pins.alpha), /CSS integrity mismatch/);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test('compiles actual Container/Row/Col source for 36 SSR cases; maps fixture tokens only', async () => {
    const { renderLayout, classTokens } = await load();
    const { current, mapped, cases } = await renderLayout();
    assert.equal(cases, 36);
    assert.equal([...current.matchAll(/data-case=/g)].length, 36);
    assert.equal(classTokens(current).length, 49);
    assert.match(current, /class="container-lg"/);
    assert.match(current, /class="col-xxl-6 offset-xxl-2 order-xxl-2"/);
    assert.match(mapped, /class="2xl:col-6 2xl:offset-2 2xl:order-2"/);
    assert.match(mapped, /row-cols-1 sm:row-cols-2 md:row-cols-3 lg:row-cols-4 xl:row-cols-5 2xl:row-cols-6/);
    assert.equal(current.replace(/class="[^"]*"/g, ''), mapped.replace(/class="[^"]*"/g, ''));
});

test('characterizes selector coverage without claiming computed geometry', async () => {
    const { characterize } = await load();
    const result = await characterize();
    assert.deepEqual(
        result.coverage.map(({ matched, total }) => [matched, total]),
        [
            [49, 49],
            [10, 49],
            [49, 49]
        ]
    );
    assert.equal(result.coverage[1].missing.length, 39);
    assert.equal(result.browserExecuted, false);
    assert.equal(result.plannedBrowserCombinations, 54);
    assert.deepEqual(
        result.breakpoints.map(({ alphaMinimum, alphaContainerMax }) => [alphaMinimum, alphaContainerMax]),
        [
            [576, 540],
            [768, 720],
            [1024, 960],
            [1280, 1200],
            [1536, 1440]
        ]
    );
});

test('decodes escaped numeric CSS prefixes and retains exact min-width context', async () => {
    const { indexCss } = await load();
    const classes = indexCss('@media (min-width: 1536px) { .\\32 xl\\:col-6 { width: 50%; } }');
    assert.deepEqual(classes.get('2xl:col-6')[0].media, ['(min-width: 1536px)']);
    assert.deepEqual(classes.get('2xl:col-6')[0].declarations, { width: '50%' });
    assert.equal(classes.has('xl:col-6'), false);
});

test('rejects selector removal or threshold drift independently of asset integrity', async () => {
    const { loadStyles, renderLayout, assertCharacterization } = await load();
    const styles = await loadStyles();
    const layout = await renderLayout();
    assert.throws(
        () => assertCharacterization({ ...styles, alpha: { ...styles.alpha, css: styles.alpha.css.replaceAll('1024px', '1025px') } }, layout),
        /lg.*1024/
    );
    assert.throws(() => assertCharacterization({ ...styles, alpha: { ...styles.alpha, css: '' } }, layout), /selector coverage/);
});

test('CLI runs outside the checkout working directory and emits an honest static report', () => {
    const stdout = execFileSync(process.execPath, [fileURLToPath(new URL('./check.mjs', import.meta.url))], { cwd: tmpdir(), encoding: 'utf8' });
    const result = JSON.parse(stdout);
    assert.equal(result.browserExecuted, false);
    assert.equal(result.fixtureCases, 36);
    assert.equal(result.coverage[1].matched, 10);
});

test('dedicated CI is scoped to 3.x-alpha and runs only non-publishing fixture checks', async () => {
    const workflow = await readFile(new URL('../../.github/workflows/bootstrap6-alpha.yml', import.meta.url), 'utf8');
    assert.match(workflow, /push:\s+branches: \[3\.x-alpha\]/);
    assert.match(workflow, /pull_request:\s+branches: \[3\.x-alpha\]/);
    assert.match(workflow, /permissions:\s+contents: read/);
    assert.match(workflow, /persist-credentials: false/);
    assert.match(workflow, /working-directory: tests\/bootstrap6-alpha/);
    assert.match(workflow, /npm ci --ignore-scripts --no-audit --no-fund/);
    assert.match(workflow, /run: npm test/);
    assert.match(workflow, /run: npm run check/);
    assert.doesNotMatch(
        workflow,
        /workflow_dispatch:|workflow_run:|pull_request_target:|secrets\.|environment:|write|npm publish|gh release|git push|vercel|deploy/i
    );
    for (const [, reference] of workflow.matchAll(/uses: ([^\s]+)/g)) assert.match(reference, /@[a-f0-9]{40}$/);
});

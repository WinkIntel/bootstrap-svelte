import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertCharacterization, assertInputConsistency, loadStyles, renderLayout } from './fixture.mjs';
import { plannedViewportWidths } from './expectations.mjs';

const cell = (props = '', text = 'cell') => `<Col class="spike-cell" ${props}>${text}</Col>`;
const section = (name, contents) => `<section data-spike="${name}"><Container isFluid>${contents}</Container></section>`;
// These are component invocations, not a second implementation of grid classes.
const layoutCases = [
    section('equal', `<Row>${cell()}${cell()}${cell()}</Row>`),
    section('numeric-wrap', `<Row>${cell('sizing={6}')}${cell('sizing={6}')}${cell('sizing={6}')}</Row>`),
    section('row-cols', `<Row cols={3}>${cell()}${cell()}${cell()}${cell()}</Row>`),
    section('gutter-zero', `<Row class="gx-0 gy-0">${cell('sizing={6}')}${cell('sizing={6}')}</Row>`),
    section(
        'gutter-axes',
        `<Row style="--bs-gutter-x: 32px; --bs-gutter-y: 12px">${cell('sizing={6}')}${cell('sizing={6}')}${cell('sizing={6}')}</Row>`
    ),
    section(
        'nested',
        `<Row style="--bs-gutter-x: 32px; --bs-gutter-y: 12px"><Col sizing={6}><Row data-nested-row>${cell()}${cell()}</Row></Col>${cell('sizing={6}')}</Row>`
    ),
    section('offset', `<Row>${cell('sizing={4} offset={2}')}${cell('sizing={6}')}</Row>`),
    `<section data-spike="responsive"><Container breakpoint="lg"><Row cols={{ xs: 1, lg: 2, xl: 3, xxl: 4 }}>${Array.from({ length: 4 }, () => cell('sizing={{ xs: 12, lg: 6, xl: 4, xxl: 3 }}')).join('')}</Row></Container></section>`,
    `<section data-spike="cascade"><Container isFluid><Row><Col order={2} class="spike-cell spike-consumer">unlayered</Col><Col order={2} class="spike-cell spike-layered">layered</Col></Row></Container></section>`,
    section(
        'flex-break',
        `<div data-break-group><Row style="--bs-gutter-y: 12px">${cell('sizing={6}')}<Col sizing={12} class="spike-flex-break" aria-hidden="true" />${cell('sizing={6}')}</Row></div><div data-separate-group><Row style="--bs-gutter-y: 12px">${cell('sizing={6}')}</Row><Row style="--bs-gutter-y: 12px">${cell('sizing={6}')}</Row></div>`
    )
];

// Serialized into the HTML, parsed by generator tests but executed only in a
// separately permitted real browser. No browser launcher, server or remote asset.
async function measurePage() {
    const input = JSON.parse(document.getElementById('spike-input').textContent);
    const state = (window.__bootstrapGridSpike = {
        schemaVersion: 1,
        status: 'running',
        complete: false,
        userAgent: navigator.userAgent,
        artifacts: Object.fromEntries(Object.entries(input.styles).map(([key, { version, sha256 }]) => [key, { version, sha256 }])),
        plannedFrames: input.frames.length,
        results: [],
        errors: [],
        limitations: [
            'SSR CSS-only observations; no hydration or interaction.',
            'v5 RTL uses LTR CSS under dir=rtl; not v5 RTL parity.',
            'Current alpha responsive tokens are intentionally incompatible; mapped tokens are disposable references.'
        ]
    });
    const output = document.getElementById('results');
    const near = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1;
    const px = (value) => Number.parseFloat(value) || 0;
    function box(node) {
        const rect = node.getBoundingClientRect();
        const css = node.ownerDocument.defaultView.getComputedStyle(node);
        return {
            classes: node.className,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            clientWidth: node.clientWidth,
            scrollWidth: node.scrollWidth,
            contentWidth: rect.width - px(css.paddingLeft) - px(css.paddingRight) - px(css.borderLeftWidth) - px(css.borderRightWidth),
            columnGap: px(css.columnGap),
            rowGap: px(css.rowGap),
            paddingLeft: px(css.paddingLeft),
            paddingRight: px(css.paddingRight),
            marginInlineStart: px(css.marginInlineStart),
            marginLeft: px(css.marginLeft),
            marginRight: px(css.marginRight),
            gutterX: css.getPropertyValue('--bs-gutter-x').trim(),
            gutterY: css.getPropertyValue('--bs-gutter-y').trim(),
            order: css.order,
            direction: css.direction
        };
    }
    try {
        for (const plan of input.frames) {
            const mode = input.modes.find(({ name }) => name === plan.mode);
            const style = input.styles[mode.style];
            const frame = document.createElement('iframe');
            // A real frame viewport controls media queries; no scaled screenshot
            // or synthetic DOM substitute. Overflow is measured inside each case.
            frame.style.cssText = `position:absolute;left:0;top:0;width:${plan.width}px;height:2048px;border:0;visibility:hidden`;
            frame.title = `${plan.mode} ${plan.width}px ${plan.direction}`;
            const loaded = new Promise((resolve, reject) => {
                frame.onload = resolve;
                frame.onerror = reject;
            });
            const controls = '<style>@layer fixture-consumer { .spike-layered { order: 4; } }</style>';
            const instrument =
                '<style>html { overflow: hidden; } body { margin: 0; } section { margin-bottom: 12px; } .spike-cell { min-height: 24px; background: #ddd; } .spike-flex-break { min-height: 0; } .spike-consumer { order: 3; }</style>';
            frame.srcdoc = `<!doctype html><html dir="${plan.direction}"><head><meta charset="utf-8">${controls}<style>${style.css}</style>${instrument}</head><body>${input.layout[mode.markup]}</body></html>`;
            document.body.append(frame);
            try {
                await loaded;
                await frame.contentDocument.fonts.ready;
                await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                const doc = frame.contentDocument;
                const record = {
                    ...plan,
                    cssVersion: style.version,
                    cssSha256: style.sha256,
                    rtlParity: style.rtlParity,
                    actualViewportWidth: frame.contentWindow.innerWidth,
                    clientWidth: doc.documentElement.clientWidth,
                    userAgent: frame.contentWindow.navigator.userAgent,
                    cases: []
                };
                const selected =
                    plan.scope === 'responsive' ? [doc.querySelector('[data-spike="responsive"]')] : [...doc.querySelectorAll('[data-spike]')];
                for (const section of selected) {
                    const name = section.dataset.spike;
                    const row = section.querySelector('.row');
                    const rowBox = box(row);
                    const children = [...row.children].map(box);
                    const checks = [];
                    const check = (relationship, observed, expected, expectedIncompatibility = false) =>
                        checks.push({
                            relationship,
                            observed,
                            expected,
                            matches: typeof expected === 'number' ? near(observed, expected) : observed === expected,
                            interpretation: expectedIncompatibility ? 'expected-current-token-incompatibility' : 'shipped-declaration-relationship'
                        });
                    const nativeGap = mode.style === 'alpha2'; // Verified by static row gap oracle before generation.
                    const gap = nativeGap ? rowBox.columnGap : 0;
                    const width = rowBox.contentWidth;
                    if (['equal', 'row-cols', 'numeric-wrap', 'gutter-zero', 'gutter-axes'].includes(name)) {
                        const count = ['equal', 'row-cols'].includes(name) ? 3 : 2;
                        const expectedWidth = (width - (count - 1) * gap) / count;
                        children.forEach((child, index) => check(`child ${index} width including native gaps`, child.width, expectedWidth));
                        check('first two children share a flex line', near(children[0].y, children[1].y), true);
                        if (children.length > count) check('extra child wraps', children[count].y > children[0].y + 1, true);
                        if (name === 'gutter-zero') check('zero gutter has zero native gap', rowBox.columnGap, 0);
                        if (nativeGap && ['numeric-wrap', 'gutter-axes'].includes(name))
                            check('wrapped line has row gap', children[2].y - children[0].y - children[0].height, rowBox.rowGap);
                    }
                    if (name === 'offset') {
                        check('sized offset child width', children[0].width, (width + gap) / 3 - gap);
                        // Bootstrap 5's physical margin-left under RTL is recorded
                        // but cannot stand in for its separately shipped RTL CSS.
                        if (!(mode.style === 'baseline' && plan.direction === 'rtl')) {
                            const start =
                                plan.direction === 'rtl' ? rowBox.x + rowBox.width - children[0].x - children[0].width : children[0].x - rowBox.x;
                            check('logical start offset', start, (width + gap) / 6);
                        }
                    }
                    if (name === 'responsive') {
                        const alpha = mode.style !== 'baseline';
                        const thresholds = input.report.breakpoints;
                        const minima = ['lg', 'xl', 'xxl'].map(
                            (bp) => thresholds.find(({ publicKey }) => publicKey === bp)[alpha ? 'alphaMinimum' : 'baselineMinimum']
                        );
                        const count = 1 + minima.filter((minimum) => record.actualViewportWidth >= minimum).length;
                        const incompatible = alpha && mode.markup === 'current' && count > 1;
                        check(
                            'responsive width relative to intended CSS breakpoint',
                            children[0].width,
                            (width - (count - 1) * gap) / count,
                            incompatible
                        );
                        const active = thresholds
                            .filter(
                                (bp) =>
                                    ['lg', 'xl', 'xxl'].includes(bp.publicKey) &&
                                    record.actualViewportWidth >= bp[alpha ? 'alphaMinimum' : 'baselineMinimum']
                            )
                            .at(-1);
                        const cap = active?.[alpha ? 'alphaContainerMax' : 'baselineContainerMax'] ?? record.actualViewportWidth;
                        check(
                            'responsive container width relative to intended cap',
                            box(section.firstElementChild).width,
                            Math.min(record.actualViewportWidth, cap),
                            alpha && mode.markup === 'current' && !!active
                        );
                    }
                    if (name === 'cascade') {
                        const important = input.report.declarationComparisons.find(({ name }) => name === 'order-2')[mode.style].important;
                        check('unlayered consumer order vs pinned utility', Number(children[0].order), important ? 2 : 3);
                        check('earlier consumer layer vs pinned utility', Number(children[1].order), 2);
                    }
                    const entry = { name, container: box(section.firstElementChild), row: rowBox, children, checks };
                    const nested = section.querySelector('[data-nested-row]');
                    if (nested) {
                        entry.nested = { row: box(nested), children: [...nested.children].map(box) };
                        const nestedGap = nativeGap ? entry.nested.row.columnGap : 0;
                        entry.nested.children.forEach((child, index) =>
                            check(`nested equal child ${index} width`, child.width, (entry.nested.row.contentWidth - nestedGap) / 2)
                        );
                    }
                    if (name === 'flex-break') {
                        const separate = [...section.querySelectorAll('[data-separate-group] .spike-cell')].map(box);
                        entry.flexBreak = {
                            break: children[1],
                            separation: children[2].y - children[0].y - children[0].height,
                            separateRows: separate,
                            separateRowSeparation: separate[1].y - separate[0].y - separate[0].height
                        };
                        if (nativeGap)
                            check(
                                'full-width break occupies a line with two vertical gaps',
                                entry.flexBreak.separation,
                                2 * rowBox.rowGap + children[1].height
                            );
                    }
                    record.cases.push(entry);
                }
                state.results.push(record);
                output.textContent = `Measured ${state.results.length}/${state.plannedFrames} frames. Full evidence: window.__bootstrapGridSpike`;
            } finally {
                frame.remove();
            }
        }
        state.status = 'complete';
    } catch (error) {
        state.status = 'error';
        state.errors.push(String(error?.stack || error));
    } finally {
        state.complete = true;
        const checks = state.results.flatMap(({ cases }) => cases.flatMap(({ checks }) => checks));
        state.summary = {
            measuredFrames: state.results.length,
            relationships: checks.length,
            mismatches: checks.filter(({ matches, interpretation }) => !matches && interpretation !== 'expected-current-token-incompatibility')
                .length,
            expectedCurrentTokenMismatches: checks.filter(
                ({ matches, interpretation }) => !matches && interpretation === 'expected-current-token-incompatibility'
            ).length
        };
        output.textContent = `${state.status}: ${JSON.stringify(state.summary, null, 2)}\nFull raw evidence: window.__bootstrapGridSpike (copy as JSON).\nNo all-green Bootstrap 6 support claim.`;
    }
}

export async function generateBrowserSpike(output = fileURLToPath(new URL('./.generated-browser/index.html', import.meta.url))) {
    await assertInputConsistency();
    const styles = await loadStyles();
    const report = assertCharacterization(styles, await renderLayout());
    const layout = await renderLayout({ extraCases: layoutCases, includePublicCases: false });
    const modes = [
        { name: 'bootstrap5-current', style: 'baseline', markup: 'current' },
        { name: 'bootstrap6-current', style: 'alpha', markup: 'current' },
        { name: 'bootstrap6-mapped-reference', style: 'alpha', markup: 'mapped' },
        { name: 'bootstrap6-alpha2-current', style: 'alpha2', markup: 'current' },
        { name: 'bootstrap6-alpha2-mapped-reference', style: 'alpha2', markup: 'mapped' }
    ];
    const frames = modes.flatMap(({ name: mode }) =>
        plannedViewportWidths.flatMap((width) =>
            [375, 1600].includes(width)
                ? ['ltr', 'rtl'].map((direction) => ({ mode, width, direction, scope: 'layout' }))
                : [{ mode, width, direction: 'ltr', scope: 'responsive' }]
        )
    );
    const payload = {
        styles: Object.fromEntries(Object.entries(styles).map(([key, style]) => [key, { ...style, rtlParity: false }])),
        layout,
        modes,
        frames,
        report
    };
    const json = JSON.stringify(payload).replaceAll('<', '\\u003c');
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bootstrap grid characterization — UNRUN until measured</title><h1>Bootstrap grid characterization</h1><p>Generated plan: UNRUN. No remote assets, server, Bootstrap JavaScript or hydration. Sequential frame measurements begin only when this page is opened through a permitted browser path.</p><pre id="results">UNRUN</pre><script id="spike-input" type="application/json">${json}</script><script id="measurement-program">(${measurePage.toString()})();</script></html>`;
    assert(
        !/<\/style/i.test(
            Object.values(styles)
                .map(({ css }) => css)
                .join('')
        ),
        'CSS cannot close the inline stylesheet'
    );
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, html);
    return {
        output,
        sha256: createHash('sha256').update(html).digest('hex'),
        artifacts: report.assets,
        frames: frames.length,
        browserExecuted: false
    };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    assert(
        process.argv.length === 2 || (process.argv.length === 4 && process.argv[2] === '--output'),
        'usage: node browser-spike.mjs [--output path]'
    );
    console.log(JSON.stringify(await generateBrowserSpike(process.argv[3] ? resolve(process.argv[3]) : undefined), null, 2));
}

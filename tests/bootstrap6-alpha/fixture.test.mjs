import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { before, test } from 'node:test';
import postcss from 'postcss';
import { markdownReport } from './expectations.mjs';

const load = () => import('./fixture.mjs');
let fixture, styles, layout, report;
before(async () => {
    fixture = await load();
    await fixture.assertInputConsistency();
    styles = await fixture.loadStyles();
    layout = await fixture.renderLayout();
    report = fixture.assertCharacterization(styles, layout);
});

test('pins installed Bootstrap versions and exact distributed CSS bytes before parsing', async () => {
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

test('compiles actual Container/Row/Col source across public prop values; maps fixture tokens only', async () => {
    const { classTokens } = await load();
    const { current, mapped, cases } = layout;
    assert.equal([...current.matchAll(/data-case=/g)].length, cases);
    assert.match(current, /class="container-lg"/);
    assert.match(current, /class="col order-xxl-last"/);
    assert.match(mapped, /class="col 2xl:order-last"/);
    assert.match(mapped, /row-cols-1 sm:row-cols-2 md:row-cols-3 lg:row-cols-4 xl:row-cols-5 2xl:row-cols-6/);
    assert.equal(current.replace(/class="[^"]*"/g, ''), mapped.replace(/class="[^"]*"/g, ''));
});

test('selector occurrence does not imply unchanged declarations or browser geometry', () => {
    assert.deepEqual(report.coverage[0].missing, ['offset-0']);
    assert.deepEqual(report.coverage[2].missing, ['offset-0']);
    const order = report.declarationComparisons.find(({ name }) => name === 'order-2');
    assert.equal(order.baseline.important, true);
    assert.equal('declarationChanged' in order, false);
    assert.equal('contextChanged' in order, false);
    const width = report.declarationComparisons.find(({ name }) => name === 'col-6');
    assert.equal(width.baselineToAlpha1DeclarationChanged, false);
    assert.notEqual(width.alpha.value, width.alpha2.value);
    assert.equal(order.alpha.important, false);
    assert.deepEqual(order.alpha.layers, ['utilities']);
    const offset = report.declarationComparisons.find(({ name }) => name === 'offset-2');
    assert.equal(offset.baseline.property, 'margin-left');
    assert.equal(offset.alpha.property, 'margin-inline-start');
    assert.equal(offset.baselineToAlpha1DeclarationChanged, true);
    assert.equal(order.baselineToAlpha1ContextChanged, true);
    assert.equal(report.browserExecuted, false);
});

test('decodes escaped numeric CSS prefixes and retains exact min-width context', async () => {
    const { indexCss } = await load();
    const classes = indexCss('@media (min-width: 1536px) { .\\32 xl\\:col-6 { width: 50%; } }');
    assert.deepEqual(classes.get('2xl:col-6')[0].media, ['(min-width: 1536px)']);
    assert.deepEqual(classes.get('2xl:col-6')[0].declarations, { width: '50%' });
    assert.equal(classes.has('xl:col-6'), false);
});

test('CLI runs outside the checkout and agrees with this independent in-process run', () => {
    const stdout = execFileSync(process.execPath, [fileURLToPath(new URL('./check.mjs', import.meta.url))], { cwd: tmpdir(), encoding: 'utf8' });
    assert.deepEqual(JSON.parse(stdout), report);
});

// Independent edge and context regressions supplement the API-derived oracle.
test('exercises every public grid token, including edge values', async () => {
    const { classTokens } = await load();
    const tokens = classTokens(layout.current);
    assert.equal(tokens.length, 254);
    for (const token of ['offset-0', 'order-first', 'order-last', 'row-cols-auto', 'order-xxl-last', 'row-cols-sm-auto'])
        assert(tokens.includes(token), token);
});

test('retains importance, layers, containers, and class subject role', async () => {
    const { indexCss } = await load();
    const rules = indexCss('@layer utilities { @container card (width > 1px) { .navbar > .probe, .probe > * { order: 2 !important; } } }').get(
        'probe'
    );
    assert.deepEqual(rules[0].contexts, [
        { name: 'layer', params: 'utilities' },
        { name: 'container', params: 'card (width > 1px)' }
    ]);
    assert.equal(rules[0].importance.order, true);
    assert.equal(rules[0].subject, true);
    assert.equal(rules[1].subject, false);
});

test('rejects a lower minimum even when the expected media block still exists', async () => {
    const { assertCharacterization } = await load();
    const alpha = { ...styles.alpha, css: styles.alpha.css + '\n@media (width >= 1000px) { .lg\\:container { max-width: 960px; } }' };
    assert.throws(() => assertCharacterization({ ...styles, alpha }, layout), /lg:container.*minimum/);
});

test('rejects fixture/root toolchain drift and mismatched showcase baseline', async () => {
    const { characterize } = await load();
    const rootPackage = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
    await assert.rejects(
        characterize({ rootPackage: { ...rootPackage, devDependencies: { ...rootPackage.devDependencies, svelte: '~5.58.0' } } }),
        /svelte.*root/
    );
    await assert.rejects(
        characterize({ rootPackage: { ...rootPackage, dependencies: { ...rootPackage.dependencies, 'bezier-easing': '~4.0.0' } } }),
        /bezier-easing.*root/
    );
    await assert.rejects(
        characterize({ appHtml: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">' }),
        /showcase.*baseline/
    );
});

test('loads bounded static alias and relative TS runtime imports with runes and cleans generated modules', async () => {
    const { renderLayout } = await load();
    const { mkdir, cp, readdir } = await import('node:fs/promises');
    const directory = await mkdtemp(new URL('./.loader-test-', import.meta.url));
    const generated = () => readdir(new URL('./', import.meta.url)).then((names) => names.filter((name) => name.startsWith('.generated-')));
    const before = await generated();
    try {
        await cp(new URL('../../src/lib', import.meta.url), join(directory, 'src/lib'), { recursive: true });
        await mkdir(join(directory, 'src/lib/probe'), { recursive: true });
        await writeFile(join(directory, 'src/lib/probe/value.ts'), 'export const marker: string = "runtime-helper";');
        await writeFile(join(directory, 'src/lib/probe/alias.ts'), 'export { marker } from "./value.js";');
        const filename = join(directory, 'src/lib/Container/container.svelte');
        await writeFile(
            filename,
            (await readFile(filename, 'utf8'))
                .replace('<script lang="ts">', '<script lang="ts">import { marker } from "$lib/probe/alias.js";')
                .replace('class={classes}', 'data-loader={marker} class={classes}')
        );
        const layout = await renderLayout({ sourceRoot: directory, extraCases: ['<p data-extra="1">extra</p>'] });
        assert.match(layout.current, /data-loader="runtime-helper"/);
        assert.match(layout.current, /data-extra="1"/);
        assert.deepEqual(await generated(), before);
        await assert.rejects(import('$lib/probe/alias.js'), { code: 'ERR_MODULE_NOT_FOUND' });
        const broken = join(directory, 'broken');
        await cp(join(directory, 'src'), join(broken, 'src'), { recursive: true });
        const brokenFile = join(broken, 'src/lib/Container/container.svelte');
        await writeFile(brokenFile, (await readFile(brokenFile, 'utf8')).replace('$lib/probe/alias.js', '$lib/probe/missing.js'));
        await assert.rejects(renderLayout({ sourceRoot: broken }), /missing/);
        assert.deepEqual(await generated(), before);
        await assert.rejects(import('$lib/probe/value.js'), { code: 'ERR_MODULE_NOT_FOUND' });
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test('token set matches an independent enumeration of the public API', async () => {
    // The oracle comes from public type ranges and breakpoint map keys, not
    // renderer totals or exported case-generator expectations.
    const common = await readFile(new URL('../../src/lib/common/types.ts', import.meta.url), 'utf8');
    const values = (name) =>
        common
            .match(new RegExp(`export type ${name} = ([^;]+);`))[1]
            .split('|')
            .map((value) => Number(value.trim()));
    const rowTypes = await readFile(new URL('../../src/lib/Row/types.ts', import.meta.url), 'utf8');
    const colTypes = await readFile(new URL('../../src/lib/Col/types.ts', import.meta.url), 'utf8');
    const keys = (source, name) =>
        [...source.match(new RegExp(`export type ${name} = \\{([^}]+)\\};`))[1].matchAll(/(\w+)\?:/g)].map((match) => match[1]);
    const bps = keys(colTypes, 'ColSizingMap');
    assert.deepEqual(keys(colTypes, 'ColOffsetMap'), bps);
    assert.deepEqual(keys(colTypes, 'ColOrderMap'), bps);
    assert.deepEqual(keys(rowTypes, 'RowColsMap'), bps);
    const expected = new Set(['container', 'container-fluid', 'row']);
    for (const bp of bps) {
        const suffix = bp === 'xs' ? '' : `-${bp}`;
        if (suffix) expected.add(`container${suffix}`);
        for (const value of [...values('OneToSix'), 'auto']) expected.add(`row-cols${suffix}-${value}`);
        for (const value of [...values('OneToTwelve'), 'auto', '*']) expected.add(value === '*' ? `col${suffix}` : `col${suffix}-${value}`);
        for (const value of values('ZeroToEleven')) expected.add(`offset${suffix}-${value}`);
        for (const value of [...values('ZeroToFive'), 'first', 'last']) expected.add(`order${suffix}-${value}`);
    }
    assert.deepEqual(fixture.classTokens(layout.current), [...expected].sort());
});

// Each negative changes one family while preserving unrelated coverage/media.
function mutatedStyle(key, change) {
    const root = postcss.parse(styles[key].css);
    change(root);
    return { ...styles, [key]: { ...styles[key], css: root.toString() } };
}
function directRule(root, name, property) {
    let found;
    root.walkRules((rule) => {
        let inMedia = false;
        for (let p = rule.parent; p; p = p.parent) if (p.type === 'atrule' && p.name === 'media') inMedia = true;
        const selectors = rule.selector.split(',').map((value) => value.trim());
        if (
            !found &&
            !inMedia &&
            (selectors.includes(`.${name}`) || selectors.includes(`.${name} > *`)) &&
            rule.nodes.some((node) => node.prop === property)
        )
            found = rule;
    });
    assert(found, `mutation target ${name}.${property}`);
    return found;
}
// Independent mutation targets deliberately do not consume the guard's exported
// expectation list: deleting a guard must not delete the test exercising it.
for (const [bp, oldWidth, newWidth] of [
    ['sm', 576, 576],
    ['md', 768, 768],
    ['lg', 992, 1024],
    ['xl', 1200, 1280],
    ['xxl', 1400, 1536]
])
    for (const [key, width] of [
        ['baseline', oldWidth],
        ['alpha', newWidth],
        ['alpha2', newWidth]
    ]) {
        test(`rejects ${key} ${bp} threshold drift`, () => {
            const changed = mutatedStyle(key, (root) =>
                root.walkAtRules('media', (rule) => {
                    rule.params = rule.params.replace(`${width}px`, `${width + 1}px`);
                })
            );
            assert.throws(
                () => fixture.assertCharacterization(changed, layout),
                new RegExp(`${key}.*${bp === 'xxl' && key !== 'baseline' ? '2xl' : bp}.*minimum`)
            );
        });
        test(`rejects ${key} ${bp} container cap drift`, () => {
            const changed = mutatedStyle(key, (root) =>
                root.walkAtRules('media', (media) => {
                    if (media.params.includes(`${width}px`))
                        media.walkRules((rule) => {
                            if (rule.selector.split(',').some((value) => value.trim() === '.container'))
                                rule.walkDecls('max-width', (decl) => {
                                    decl.value = '1px';
                                });
                        });
                })
            );
            assert.throws(() => fixture.assertCharacterization(changed, layout), new RegExp(`${bp}: ${key} container cap`));
        });
    }
for (const [name, baselineProperty, alphaProperty] of [
    ['row', 'display', 'display'],
    ['row', 'flex-wrap', 'flex-wrap'],
    ['col', 'flex', 'flex'],
    ['col-6', 'width', 'width'],
    ['row-cols-3', 'width', 'width'],
    ['col-auto', 'width', 'width'],
    ['offset-2', 'margin-left', 'margin-inline-start'],
    ['order-2', 'order', 'order'],
    ['container', 'padding-left', 'padding-inline']
])
    for (const [key, property] of [
        ['baseline', baselineProperty],
        ['alpha', alphaProperty],
        ['alpha2', alphaProperty]
    ]) {
        test(`rejects ${key} ${name} ${property} declaration drift`, () => {
            const changed = mutatedStyle(key, (root) =>
                directRule(root, name, property).walkDecls(property, (decl) => {
                    decl.value = 'changed';
                })
            );
            assert.throws(() => fixture.assertCharacterization(changed, layout), new RegExp(`${key} ${name}: expected`));
        });
    }

for (const key of ['alpha', 'alpha2'])
    test(`rejects one removed ${key} selector independently of asset integrity`, () => {
        const changed = mutatedStyle(key, (root) => {
            directRule(root, 'order-first', 'order').remove();
        });
        assert.throws(() => fixture.assertCharacterization(changed, layout), /selector coverage/);
    });

for (const key of ['alpha', 'alpha2'])
    test(`rejects a legacy ${key} selector independently of occurrence counts`, () => {
        const changed = mutatedStyle(key, (root) => {
            root.append('.col-lg-auto { width: auto; }');
        });
        // Suppress this token in the artificial coverage-only input to exercise the
        // explicit no-legacy guard rather than the earlier missing-set assertion.
        const reduced = { ...layout, current: layout.current.replaceAll('col-lg-auto', '') };
        assert.throws(() => fixture.assertCharacterization(changed, reduced), new RegExp(`col-lg-auto: unexpected legacy ${key} selector`));
    });

test('rejects changed declaration importance and layers', () => {
    for (const key of ['baseline', 'alpha', 'alpha2']) {
        const changed = mutatedStyle(key, (root) =>
            directRule(root, 'order-2', 'order').walkDecls('order', (decl) => {
                decl.important = !decl.important;
            })
        );
        assert.throws(() => fixture.assertCharacterization(changed, layout), new RegExp(`${key} order-2: expected`));
    }
    const changed = mutatedStyle('alpha', (root) => {
        directRule(root, 'col-6', 'width').parent.params = 'changed-layer';
    });
    assert.throws(() => fixture.assertCharacterization(changed, layout), /alpha .*expected.*layout/);
});

test('ignores contextual and unconditional mentions when finding first conditional grid rule', () => {
    for (const selector of ['.navbar > .lg\\:container', '.lg\\:container.active', '.lg\\:container > .nested']) {
        const changed = {
            ...styles,
            alpha: { ...styles.alpha, css: styles.alpha.css + `\n@media (width >= 1000px) { ${selector} { max-width: 1px; } }` }
        };
        fixture.assertCharacterization(changed, layout);
    }
    const changed = mutatedStyle('alpha', (root) => {
        root.walkAtRules('media', (media) => {
            if (media.params === '(width >= 1024px)')
                media.walkRules((rule) => {
                    rule.selector = rule.selector
                        .split(',')
                        .filter((selector) => selector.trim() !== '.lg\\:container')
                        .join(',');
                });
        });
    });
    assert.throws(() => fixture.assertCharacterization(changed, layout), /lg:container.*minimum/);
});

test('README characterization matches this run and logs its report once', async () => {
    const readme = await readFile(new URL('./README.md', import.meta.url), 'utf8');
    assert.equal(readme.match(/<!-- fixture-report:start -->[\s\S]*?<!-- fixture-report:end -->/)?.[0], markdownReport(report));
    console.log(`${report.kind}\n${markdownReport(report)}\nNo browser executed; viewport matrix remains unrun.`);
});

for (const [name, declaration] of [
    ['container', 'max-width: 960px'],
    ['col-6', 'width: 50%']
]) {
    test(`child rules for ${name} cannot define the class-bearing element minimum`, () => {
        const changed = {
            ...styles,
            alpha: { ...styles.alpha, css: styles.alpha.css + `\n@media (width >= 1000px) { .lg\\:${name} > * { ${declaration}; } }` }
        };
        assert.doesNotThrow(() => fixture.assertCharacterization(changed, layout));
    });
}

test('row-cols direct-child rules retain their legitimate minimum role in legacy and mapped CSS', () => {
    for (const [key, name, media] of [
        ['baseline', 'row-cols-lg-3', '(min-width: 980px)'],
        ['alpha', 'lg\\:row-cols-3', '(width >= 1000px)']
    ]) {
        const changed = {
            ...styles,
            [key]: { ...styles[key], css: styles[key].css + `\n@media ${media} { .${name} > * { width: 33.3333333333%; } }` }
        };
        assert.throws(() => fixture.assertCharacterization(changed, layout), new RegExp(`${key} .*row-cols.*minimum`));
    }
});

test('loads alpha.2 independently without replacing alpha.1 or v5 controls', () => {
    assert.equal(styles.alpha2?.version, '6.0.0-alpha.2');
    assert.equal(styles.alpha2.sha256, '4df5807d5807353e17dda52a7ee6c0acb9aabb1401553b026136a2b3e145b480');
    assert.deepEqual(
        report.coverage.slice(3).map(({ mode, matched, total, missing }) => ({ mode, matched, total, missing: missing.length })),
        [
            { mode: 'bootstrap6-alpha2-current', matched: 43, total: 254, missing: 211 },
            { mode: 'bootstrap6-alpha2-mapped-reference', matched: 253, total: 254, missing: 1 }
        ]
    );
    assert.equal(report.declarationComparisons.find(({ name }) => name === 'col-6').alpha2.value, 'calc((100% + 0px) * 0.5 - 0px)');
    const rowWidth = report.alpha2GridRules.find(({ selector, property }) => selector === ':where(.row) > .col-6' && property === 'width');
    assert.equal(rowWidth.value, 'calc((100% + var(--bs-gutter-x, 0px)) * 0.5 - var(--bs-gutter-x, 0px))');
});

test('alpha.2 cannot be interpreted as unchanged alpha.1 width arithmetic at the checker entry point', () => {
    assert.throws(() => fixture.assertCharacterization({ ...styles, alpha: styles.alpha2 }, layout), /alpha col-6: expected width: 50%/);
});

test('alpha.2 raw asset guard rejects wrong version and corrupt CSS independently', async () => {
    const { mkdir } = await import('node:fs/promises');
    const directory = await mkdtemp(join(tmpdir(), 'bootstrap-alpha2-negative-'));
    try {
        await writeFile(join(directory, 'package.json'), JSON.stringify({ version: '6.0.0-alpha.1' }));
        await assert.rejects(fixture.readVerifiedStyle(directory, fixture.pins.alpha2), /version mismatch/);
        await writeFile(join(directory, 'package.json'), JSON.stringify({ version: '6.0.0-alpha.2' }));
        await mkdir(join(directory, 'dist/css'), { recursive: true });
        await writeFile(join(directory, 'dist/css/bootstrap.css'), styles.alpha2.css.replace('gap:', 'changed-gap:'));
        await assert.rejects(fixture.readVerifiedStyle(directory, fixture.pins.alpha2), /CSS integrity mismatch/);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

for (const [selector, property] of [
    ['.row', 'gap'],
    ['.row > *', 'box-sizing'],
    ['.row > *', 'flex-shrink'],
    [':where(.row) > .col-6', 'width'],
    [':where(.row) > .offset-2', 'margin-inline-start']
])
    test(`rejects alpha.2 ${selector} ${property} semantic drift with unchanged selector coverage`, () => {
        const changed = mutatedStyle('alpha2', (root) =>
            root.walkRules((rule) => {
                if (rule.selector === selector)
                    rule.walkDecls(property, (decl) => {
                        decl.value = 'changed';
                    });
            })
        );
        assert.throws(
            () => fixture.assertCharacterization(changed, layout),
            new RegExp(`alpha2 ${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}: expected ${property}:`)
        );
    });

for (const [selector, declaration] of [
    ['.row', 'margin-inline: -12px'],
    ['.row > *', 'padding-inline: 12px'],
    ['.row > *', 'margin-top: 12px']
])
    test(`rejects reintroduced alpha.1 ${selector} ${declaration} alongside alpha.2 gaps`, () => {
        const changed = mutatedStyle('alpha2', (root) => root.append(`@layer layout { ${selector} { ${declaration}; } }`));
        assert.throws(() => fixture.assertCharacterization(changed, layout), /alpha2 .*unexpected legacy/);
    });

test('alpha.2 row-context semantics require their actual selector, layer and importance', () => {
    for (const change of [
        (rule) => {
            rule.selector = ':where(.other) > .col-6';
        },
        (rule) => {
            const isolatedLayer = postcss.atRule({ name: 'layer', params: 'changed' });
            isolatedLayer.append(rule.clone());
            rule.root().append(isolatedLayer);
            rule.remove();
        },
        (rule) =>
            rule.walkDecls('width', (decl) => {
                decl.important = true;
            })
    ]) {
        const changed = mutatedStyle('alpha2', (root) => {
            let target;
            root.walkRules((rule) => {
                if (rule.selector === ':where(.row) > .col-6') target ??= rule;
            });
            assert(target);
            change(target);
        });
        assert.throws(() => fixture.assertCharacterization(changed, layout), /alpha2 :where\(\.row\) > \.col-6: expected width:/);
    }
});

for (const [selector, declaration, context] of [
    ['.row > *', 'padding-inline-start: 12px', ''],
    ['.row > *', 'padding-inline-end: 12px', ''],
    ['.row > *', 'margin-block-start: var(--bs-gutter-y)', ''],
    [':where(.row) > *', 'padding-inline: 12px', ''],
    ['.row', 'margin-inline: -12px', '@media (width >= 768px)'],
    [':where(.row)', 'margin-block-start: -12px', '@media (width >= 768px)'],
    ['.row > .probe-child', 'padding-block: 2px', ''],
    ['.shell .row', 'margin-inline: -1px', '']
])
    test(`rejects legacy gutter ${selector} ${declaration} ${context}`, () => {
        const rule = `${selector} { ${declaration}; }`;
        const changed = mutatedStyle('alpha2', (root) => root.append(context ? `${context} { ${rule} }` : rule));
        assert.throws(() => fixture.assertCharacterization(changed, layout), /alpha2 .*unexpected legacy (?:margin|padding)/);
    });

test('gutter absence check does not treat unrelated descendant or negative-pseudo rules as row gutters', () => {
    const changed = mutatedStyle('alpha2', (root) =>
        root.append(
            '.row .probe { padding: 2px; } :not(.row) { margin: 1px; } :where(.row .probe) { padding: 2px; } :is(.row .probe) { padding: 2px; }'
        )
    );
    assert.doesNotThrow(() => fixture.assertCharacterization(changed, layout));
});

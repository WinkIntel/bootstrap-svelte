import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repository = new URL('../../', import.meta.url);

export const pins = {
    baseline: { package: 'bootstrap5', version: '5.3.6', sha256: '1da4b921953cee097fefd2507bf1c77467041d9db28d4003bfc81eca1369a1cf' },
    alpha: { package: 'bootstrap6', version: '6.0.0-alpha.1', sha256: 'ad0d5123040e043dad1451a6d4483dad4df4e2835e6687d6cf5af8a757283371' }
};

// Verify the installed package and raw distributed bytes before any CSS parsing.
// npm ci separately verifies each tarball against package-lock.json's integrity.
export async function readVerifiedStyle(directory, pin) {
    const metadata = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
    assert.equal(metadata.version, pin.version, `${pin.package} version mismatch`);
    const bytes = await readFile(join(directory, 'dist/css/bootstrap.css'));
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    assert.equal(sha256, pin.sha256, `${pin.package} CSS integrity mismatch`);
    return { version: metadata.version, sha256, css: bytes.toString('utf8') };
}

export async function loadStyles() {
    const styles = {};
    for (const [key, pin] of Object.entries(pins)) {
        // Alpha exports CSS but deliberately does not export package.json.
        const directory = join(dirname(require.resolve(`${pin.package}/dist/css/bootstrap.css`)), '../..');
        styles[key] = await readVerifiedStyle(directory, pin);
    }
    return styles;
}

const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const cases = [
    '<Container data-case="container-base">base</Container>',
    '<Container isFluid data-case="container-fluid">fluid</Container>',
    ...breakpoints.map((bp) => `<Container breakpoint="${bp}" data-case="container-${bp}">${bp}</Container>`),
    '<Container isFluid><Row data-case="row-base"><Col>one</Col><Col>two</Col></Row></Container>',
    '<Container isFluid><Row cols={3} data-case="row-static"><Col>one</Col><Col>two</Col><Col>three</Col></Row></Container>',
    ...breakpoints.map((bp) => `<Container isFluid><Row cols={{ ${bp}: 3 }} data-case="row-${bp}"><Col>one</Col><Col>two</Col></Row></Container>`),
    '<Container isFluid><Row data-case="col-static"><Col sizing={6} offset={2} order={2}>one</Col><Col>two</Col></Row></Container>',
    ...breakpoints.map(
        (bp) =>
            `<Container isFluid><Row data-case="col-${bp}"><Col sizing={{ ${bp}: 6 }} offset={{ ${bp}: 2 }} order={{ ${bp}: 2 }}>one</Col><Col>two</Col></Row></Container>`
    ),
    ...breakpoints.map(
        (bp) => `<Container isFluid><Row data-case="star-${bp}"><Col sizing={{ ${bp}: '*' }}>one</Col><Col>two</Col></Row></Container>`
    ),
    ...breakpoints.map(
        (bp) => `<Container isFluid><Row data-case="auto-${bp}"><Col sizing={{ ${bp}: 'auto' }}>one</Col><Col>two</Col></Row></Container>`
    ),
    '<Container isFluid><Row cols={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }} data-case="row-map"><Col>one</Col><Col>two</Col></Row></Container>'
];

// This changes rendered fixture tokens, never production code or the public xxl API.
function mapToken(token) {
    let match = token.match(/^container-(sm|md|lg|xl|xxl)$/);
    if (match) return `${match[1] === 'xxl' ? '2xl' : match[1]}:container`;
    match = token.match(/^(row-cols|col|offset|order)-(sm|md|lg|xl|xxl)(.*)$/);
    return match ? `${match[2] === 'xxl' ? '2xl' : match[2]}:${match[1]}${match[3]}` : token;
}

export async function renderLayout() {
    // Keep generated modules under the fixture so normal package resolution works
    // on any checkout. No absolute machine paths or private .pnpm paths are used.
    const generated = await mkdtemp(join(here, '.generated-'));
    try {
        for (const component of ['Container', 'Row', 'Col']) {
            const filename = fileURLToPath(new URL(`src/lib/${component}/${component.toLowerCase()}.svelte`, repository));
            const source = (await readFile(filename, 'utf8')).replaceAll('$lib/common/css.js', './css.mjs');
            await writeFile(join(generated, `${component}.mjs`), compile(source, { filename, generate: 'server' }).js.code);
        }
        const css = await readFile(new URL('src/lib/common/css.ts', repository), 'utf8');
        await writeFile(
            join(generated, 'css.mjs'),
            ts.transpileModule(css, {
                compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
            }).outputText
        );
        const fixture = `<script>import Container from './Container.mjs';import Row from './Row.mjs';import Col from './Col.mjs';</script>${cases.join('\n')}`;
        await writeFile(
            join(generated, 'Fixture.mjs'),
            compile(fixture, { filename: join(generated, 'Fixture.svelte'), generate: 'server' }).js.code
        );
        const { default: Fixture } = await import(pathToFileURL(join(generated, 'Fixture.mjs')));
        const current = render(Fixture).body;
        const mapped = current.replace(/class="([^"]*)"/g, (_, list) => `class="${list.split(/\s+/).map(mapToken).join(' ')}"`);
        return { current, mapped, cases: cases.length };
    } finally {
        await rm(generated, { recursive: true, force: true });
    }
}

export function classTokens(html) {
    return [...new Set([...html.matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/)))].filter(Boolean).sort();
}

export function indexCss(css) {
    const classes = new Map();
    postcss.parse(css).walkRules((rule) => {
        const media = [];
        for (let ancestor = rule.parent; ancestor; ancestor = ancestor.parent) {
            if (ancestor.type === 'atrule' && ancestor.name === 'media') media.push(ancestor.params);
        }
        selectorParser((selectors) =>
            selectors.walkClasses((node) => {
                const rules = classes.get(node.value) ?? [];
                rules.push({
                    selector: rule.selector,
                    media,
                    declarations: Object.fromEntries(rule.nodes.filter((node) => node.type === 'decl').map((node) => [node.prop, node.value]))
                });
                classes.set(node.value, rules);
            })
        ).processSync(rule.selector);
    });
    return classes;
}

export function assertCharacterization(styles, layout) {
    const baseline = indexCss(styles.baseline.css);
    const alpha = indexCss(styles.alpha.css);
    const modes = [
        ['bootstrap5-current', baseline, layout.current],
        ['bootstrap6-current', alpha, layout.current],
        ['bootstrap6-mapped-reference', alpha, layout.mapped]
    ];
    const coverage = modes.map(([mode, index, html]) => {
        const classes = classTokens(html);
        const missing = classes.filter((name) => !index.has(name));
        return { mode, total: classes.length, matched: classes.length - missing.length, missing };
    });
    assert.deepEqual(
        coverage.map(({ matched, total }) => [matched, total]),
        [
            [49, 49],
            [10, 49],
            [49, 49]
        ],
        'selector coverage changed; review the characterization rather than claiming layout support'
    );
    const thresholds = [
        ['sm', 576, 576, 540, 540],
        ['md', 768, 768, 720, 720],
        ['lg', 992, 1024, 960, 960],
        ['xl', 1200, 1280, 1140, 1200],
        ['xxl', 1400, 1536, 1320, 1440]
    ];
    const hasRule = (index, name, media, prop, value) =>
        index.get(name)?.some((rule) => rule.media.includes(media) && (!prop || rule.declarations[prop] === value));
    for (const [bp, oldWidth, newWidth, oldMax, newMax] of thresholds) {
        const target = bp === 'xxl' ? '2xl' : bp;
        const oldMedia = `(min-width: ${oldWidth}px)`;
        const newMedia = `(width >= ${newWidth}px)`;
        for (const [oldName, newName] of [
            [`container-${bp}`, `${target}:container`],
            [`row-cols-${bp}-3`, `${target}:row-cols-3`],
            [`col-${bp}-6`, `${target}:col-6`],
            [`offset-${bp}-2`, `${target}:offset-2`],
            [`order-${bp}-2`, `${target}:order-2`],
            [`col-${bp}`, `${target}:col`],
            [`col-${bp}-auto`, `${target}:col-auto`]
        ]) {
            assert(hasRule(baseline, oldName, oldMedia), `${oldName}: expected ${oldMedia}`);
            assert(!alpha.has(oldName), `${oldName}: unexpected legacy alpha selector`);
            assert(hasRule(alpha, newName, newMedia), `${newName}: expected ${newWidth}px media query`);
        }
        assert(hasRule(baseline, 'container', oldMedia, 'max-width', `${oldMax}px`), `${bp}: baseline container cap`);
        assert(hasRule(alpha, 'container', newMedia, 'max-width', `${newMax}px`), `${bp}: alpha container cap`);
    }
    const hasDeclaration = (name, prop, value) => alpha.get(name)?.some((rule) => rule.declarations[prop] === value);
    for (const [name, prop, value] of [
        ['row', 'display', 'flex'],
        ['row', 'flex-wrap', 'wrap'],
        ['col', 'flex', '1 0 0'],
        ['col-6', 'width', '50%'],
        ['row-cols-3', 'width', '33.3333333333%'],
        ['col-auto', 'width', 'auto'],
        ['offset-2', 'margin-inline-start', '16.6666666667%'],
        ['order-2', 'order', '2'],
        ['container', 'padding-inline', 'calc(var(--bs-gutter-x) * 0.5)']
    ])
        assert(hasDeclaration(name, prop, value), `${name}: expected ${prop}: ${value}`);
    return {
        kind: 'static SSR selector/media/declaration characterization; not computed browser layout',
        fixtureCases: layout.cases,
        svelte: require('svelte/package.json').version,
        assets: Object.fromEntries(Object.entries(styles).map(([key, { version, sha256 }]) => [key, { version, sha256 }])),
        coverage,
        breakpoints: thresholds.map(([publicKey, baselineMinimum, alphaMinimum, baselineContainerMax, alphaContainerMax]) => ({
            publicKey,
            baselineMinimum,
            alphaMinimum,
            baselineContainerMax,
            alphaContainerMax
        })),
        plannedViewportWidths: [375, 575, 576, 767, 768, 991, 992, 1023, 1024, 1199, 1200, 1279, 1280, 1399, 1400, 1535, 1536, 1600],
        plannedBrowserCombinations: 54,
        browserExecuted: false
    };
}

export async function characterize() {
    const styles = await loadStyles();
    return assertCharacterization(styles, await renderLayout());
}

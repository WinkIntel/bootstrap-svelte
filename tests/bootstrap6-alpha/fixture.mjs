import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire, findPackageJSON, registerHooks } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import semver from 'semver';
import {
    thresholds,
    declarationExpectations,
    alpha2DeclarationExpectations,
    alpha2GridExpectations,
    plannedViewportWidths
} from './expectations.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repository = new URL('../../', import.meta.url);

export const pins = {
    baseline: { package: 'bootstrap5', version: '5.3.6', sha256: '1da4b921953cee097fefd2507bf1c77467041d9db28d4003bfc81eca1369a1cf' },
    alpha: { package: 'bootstrap6', version: '6.0.0-alpha.1', sha256: 'ad0d5123040e043dad1451a6d4483dad4df4e2835e6687d6cf5af8a757283371' },
    alpha2: { package: 'bootstrap6alpha2', version: '6.0.0-alpha.2', sha256: '4df5807d5807353e17dda52a7ee6c0acb9aabb1401553b026136a2b3e145b480' }
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
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index);
const propCases = (component, prop, values) =>
    values.flatMap((value) => [
        `<${component} ${prop}={${JSON.stringify(value)}} data-case="${component}-${prop}-${value}">value</${component}>`,
        ...breakpoints.map(
            (bp) => `<${component} ${prop}={{ ${bp}: ${JSON.stringify(value)} }} data-case="${component}-${prop}-${bp}-${value}">value</${component}>`
        )
    ]);
const cases = [
    '<Container data-case="container-base">base</Container>',
    '<Container isFluid data-case="container-fluid">fluid</Container>',
    ...breakpoints.map((bp) => `<Container breakpoint="${bp}" data-case="container-${bp}">${bp}</Container>`),
    '<Row data-case="row-base"><Col>base</Col></Row>',
    ...propCases('Row', 'cols', [...range(1, 6), 'auto']),
    '<Col data-case="col-base">base</Col>',
    ...propCases('Col', 'sizing', [...range(1, 12), 'auto']),
    ...breakpoints.map((bp) => `<Col sizing={{ ${bp}: '*' }} data-case="col-star-${bp}">star</Col>`),
    ...propCases('Col', 'offset', range(0, 11)),
    ...propCases('Col', 'order', [...range(0, 5), 'first', 'last']),
    '<Row cols={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }} data-case="row-map"><Col>one</Col><Col>two</Col></Row>'
];

// This changes rendered fixture tokens, never production code or the public xxl API.
function mapToken(token) {
    let match = token.match(/^container-(sm|md|lg|xl|xxl)$/);
    if (match) return `${match[1] === 'xxl' ? '2xl' : match[1]}:container`;
    match = token.match(/^(row-cols|col|offset|order)-(sm|md|lg|xl|xxl)(.*)$/);
    return match ? `${match[2] === 'xxl' ? '2xl' : match[2]}:${match[1]}${match[3]}` : token;
}

export async function renderLayout({ sourceRoot = fileURLToPath(repository), extraCases = [], includePublicCases = true } = {}) {
    const generated = await mkdtemp(join(here, '.generated-'));
    const library = pathToFileURL(join(sourceRoot, 'src/lib/')).href;
    // A bounded SSR loader for local .svelte/.ts modules, not a Vite/SvelteKit
    // replacement: no preprocessing, dynamic aliases, CSS/assets or browser code.
    // Hooks are scoped to this synchronous import/render and deregistered on failure.
    const hooks = registerHooks({
        resolve(specifier, context, nextResolve) {
            const local = specifier.startsWith('$lib/')
                ? new URL(specifier.slice(5), library).href
                : specifier.startsWith('.') && context.parentURL?.startsWith(library)
                  ? new URL(specifier, context.parentURL).href
                  : null;
            if (local) {
                const source = local.endsWith('.js') && !existsSync(fileURLToPath(local)) ? local.slice(0, -3) + '.ts' : local;
                return nextResolve(source, context);
            }
            if (context.parentURL?.startsWith(library) && !specifier.startsWith('node:') && !specifier.startsWith('file:')) {
                // Use fixture-owned dependencies even without a root install.
                return nextResolve(specifier, { ...context, parentURL: import.meta.url });
            }
            return nextResolve(specifier, context);
        },
        load(url, context, nextLoad) {
            if (url.startsWith(library) && url.endsWith('.svelte'))
                return {
                    format: 'module',
                    shortCircuit: true,
                    source: compile(readFileSync(fileURLToPath(url), 'utf8'), { filename: fileURLToPath(url), generate: 'server', runes: true }).js
                        .code
                };
            // Node 26 strips erasable TS syntax natively, preserving runtime imports.
            return nextLoad(url, context);
        }
    });
    try {
        const imports = ['Container', 'Row', 'Col']
            .map((name) => `import ${name} from ${JSON.stringify(new URL(`${name}/${name.toLowerCase()}.svelte`, library).href)};`)
            .join('');
        const fixture = `<script>${imports}</script>${[...(includePublicCases ? cases : []), ...extraCases].join('\n')}`;
        await writeFile(
            join(generated, 'Fixture.mjs'),
            compile(fixture, { filename: join(generated, 'Fixture.svelte'), generate: 'server', runes: true }).js.code
        );
        const { default: Fixture } = await import(pathToFileURL(join(generated, 'Fixture.mjs')));
        const current = render(Fixture).body;
        const mapped = current.replace(/class="([^"]*)"/g, (_, list) => `class="${list.split(/\s+/).map(mapToken).join(' ')}"`);
        return { current, mapped, cases: (includePublicCases ? cases.length : 0) + extraCases.length };
    } finally {
        hooks.deregister();
        await rm(generated, { recursive: true, force: true });
    }
}

export function classTokens(html) {
    return [...new Set([...html.matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/)))].filter(Boolean).sort();
}

export function indexCss(css) {
    const classes = new Map();
    postcss.parse(css).walkRules((rule) => {
        const contexts = [];
        for (let ancestor = rule.parent; ancestor; ancestor = ancestor.parent) {
            if (ancestor.type === 'atrule') contexts.unshift({ name: ancestor.name, params: ancestor.params });
        }
        const declarations = Object.fromEntries(rule.nodes.filter((node) => node.type === 'decl').map((node) => [node.prop, node.value]));
        const importance = Object.fromEntries(rule.nodes.filter((node) => node.type === 'decl').map((node) => [node.prop, !!node.important]));
        selectorParser((selectors) =>
            selectors.each((selector) => {
                selector.walkClasses((node) => {
                    // Record occurrences independently from the role of the class.
                    // Only isolated classes and recognized row-cols child utilities
                    // are used as grid oracles;
                    // ancestor/compound/pseudo mentions are still visible in the index.
                    const subject =
                        node.parent === selector &&
                        !selector.nodes.slice(selector.nodes.indexOf(node) + 1).some((part) => part.type === 'combinator');
                    const isolated = selector.nodes.length === 1 && selector.first === node;
                    const directChildren =
                        selector.nodes.length === 3 &&
                        selector.first === node &&
                        selector.nodes[1].type === 'combinator' &&
                        selector.nodes[1].value === '>' &&
                        selector.last.type === 'universal';
                    // Follow :where/:is wrappers to the selector whose subject is
                    // the row or one of its direct children. Descendant-only
                    // mentions (and negative pseudos) do not target its gutters.
                    let part = node;
                    let sequence = node.parent;
                    const combinators = [];
                    while (true) {
                        if (sequence.type === 'selector')
                            combinators.push(...sequence.nodes.slice(sequence.nodes.indexOf(part) + 1).filter(({ type }) => type === 'combinator'));
                        if (sequence.parent?.type !== 'pseudo' || ![':where', ':is'].includes(sequence.parent.value)) break;
                        part = sequence.parent;
                        sequence = part.parent;
                    }
                    const rowGutterTarget =
                        node.value === 'row' &&
                        sequence.parent?.type !== 'pseudo' &&
                        (combinators.length === 0 || (combinators.length === 1 && combinators[0].value.trim() === '>'));
                    const rules = classes.get(node.value) ?? [];
                    rules.push({
                        selector: selector.toString().trim(),
                        contexts,
                        media: contexts.filter(({ name }) => name === 'media').map(({ params }) => params),
                        declarations,
                        importance,
                        subject,
                        isolated,
                        directChildren,
                        rowGutterTarget,
                        rowOffsetToken:
                            sequence.type === 'selector' &&
                            sequence.nodes.length === 3 &&
                            part.type === 'pseudo' &&
                            part.value === ':where' &&
                            part.toString() === ':where(.row)' &&
                            sequence.nodes[1].type === 'combinator' &&
                            sequence.nodes[1].value.trim() === '>' &&
                            sequence.last.type === 'class'
                                ? sequence.last.value
                                : null
                    });
                    classes.set(node.value, rules);
                });
            })
        ).processSync(rule.selector);
    });
    return classes;
}

// Reuse unchanged artifacts within one test process; a mutation is a new style
// object. Also compare css bytes so an accidentally reused mutable object is safe.
const indexes = new WeakMap();
function styleIndex(style) {
    const cached = indexes.get(style);
    if (cached?.css === style.css) return cached.index;
    const index = indexCss(style.css);
    indexes.set(style, { css: style.css, index });
    return index;
}
const gridRules = (index, name) => {
    // Only row-cols controls the children: other families act on the class-bearing
    // element. Recognize both public legacy and fixture-mapped responsive names.
    const isRowCols = /^(?:row-cols-(?:(?:sm|md|lg|xl|xxl)-)?|(?:sm|md|lg|xl|2xl):row-cols-)(?:[1-6]|auto)$/.test(name);
    return (index.get(name) ?? []).filter(
        ({ isolated, directChildren, contexts }) =>
            (isolated || (isRowCols && directChildren)) && contexts.every(({ name }) => name === 'media' || name === 'layer')
    );
};
const mediaMinimum = (rule) => {
    if (rule.media.length !== 1) return null;
    const match = rule.media[0].match(/^\((?:min-width: |width >= )(\d+)px\)$/);
    return match ? Number(match[1]) : null;
};

export function assertCharacterization(styles, layout) {
    const baseline = styleIndex(styles.baseline);
    const alpha = styleIndex(styles.alpha);
    const alpha2 = styleIndex(styles.alpha2);
    const modes = [
        ['bootstrap5-current', baseline, layout.current],
        ['bootstrap6-current', alpha, layout.current],
        ['bootstrap6-mapped-reference', alpha, layout.mapped],
        ['bootstrap6-alpha2-current', alpha2, layout.current],
        ['bootstrap6-alpha2-mapped-reference', alpha2, layout.mapped]
    ];
    const coverage = modes.map(([mode, index, html]) => {
        const classes = classTokens(html);
        const missing = classes.filter((name) => !index.has(name));
        const expectedMissing = classes.filter(
            (name) => name === 'offset-0' || ((mode === 'bootstrap6-current' || mode === 'bootstrap6-alpha2-current') && mapToken(name) !== name)
        );
        assert.deepEqual(
            missing,
            expectedMissing,
            `${mode}: selector coverage changed; review the characterization rather than claiming layout support`
        );
        return { mode, total: classes.length, matched: classes.length - missing.length, missing };
    });
    for (const [bp, oldWidth, newWidth, oldMax, newMax] of thresholds) {
        const target = bp === 'xxl' ? '2xl' : bp;
        for (const [oldName, newName] of [
            [`container-${bp}`, `${target}:container`],
            [`row-cols-${bp}-3`, `${target}:row-cols-3`],
            [`col-${bp}-6`, `${target}:col-6`],
            [`offset-${bp}-2`, `${target}:offset-2`],
            [`order-${bp}-2`, `${target}:order-2`],
            [`col-${bp}`, `${target}:col`],
            [`col-${bp}-auto`, `${target}:col-auto`]
        ]) {
            for (const [label, index, name, width] of [
                ['baseline', baseline, oldName, oldWidth],
                ['alpha', alpha, newName, newWidth],
                ['alpha2', alpha2, newName, newWidth]
            ]) {
                const minima = gridRules(index, name)
                    .filter((rule) => !name.includes('container') || rule.declarations['max-width'])
                    .map(mediaMinimum)
                    .filter((value) => value !== null);
                assert.equal(Math.min(...minima), width, `${label} ${name}: minimum conditional grid rule expected ${width}px`);
            }
            assert(!alpha.has(oldName), `${oldName}: unexpected legacy alpha selector`);
            assert(!alpha2.has(oldName), `${oldName}: unexpected legacy alpha2 selector`);
        }
        for (const [label, index, width, max] of [
            ['baseline', baseline, oldWidth, oldMax],
            ['alpha', alpha, newWidth, newMax],
            ['alpha2', alpha2, newWidth, newMax]
        ]) {
            assert(
                gridRules(index, 'container').some((rule) => mediaMinimum(rule) === width && rule.declarations['max-width'] === `${max}px`),
                `${bp}: ${label} container cap`
            );
        }
    }
    const declarationComparisons = declarationExpectations.map(([name, purpose, oldExpected, newExpected], position) => {
        const snapshots = [
            ['baseline', baseline, oldExpected],
            ['alpha', alpha, newExpected],
            ['alpha2', alpha2, alpha2DeclarationExpectations[position]]
        ].map(([label, index, [property, value, important, layer]]) => {
            const rule = gridRules(index, name).find(
                (rule) =>
                    rule.media.length === 0 &&
                    rule.declarations[property] === value &&
                    rule.importance[property] === important &&
                    rule.contexts
                        .filter(({ name }) => name === 'layer')
                        .map(({ params }) => params)
                        .join('.') === (layer ?? '')
            );
            assert(rule, `${label} ${name}: expected ${property}: ${value}${important ? ' !important' : ''} in ${layer ?? 'unlayered'} context`);
            return {
                selector: rule.selector,
                property,
                value,
                important,
                layers: rule.contexts.filter(({ name }) => name === 'layer').map(({ params }) => params),
                contexts: rule.contexts
            };
        });
        return {
            name,
            purpose,
            baseline: snapshots[0],
            alpha: snapshots[1],
            alpha2: snapshots[2],
            baselineToAlpha1DeclarationChanged: JSON.stringify(oldExpected.slice(0, 3)) !== JSON.stringify(newExpected.slice(0, 3)),
            baselineToAlpha1ContextChanged: JSON.stringify(snapshots[0].contexts) !== JSON.stringify(snapshots[1].contexts)
        };
    });
    const alpha2GridRules = alpha2GridExpectations.map(([name, selector, property, value]) => {
        const rule = (alpha2.get(name) ?? []).find(
            (rule) =>
                rule.selector === selector &&
                rule.media.length === 0 &&
                rule.contexts.length === 1 &&
                rule.contexts[0].name === 'layer' &&
                rule.contexts[0].params === 'layout' &&
                rule.declarations[property] === value &&
                rule.importance[property] === false
        );
        assert(rule, `alpha2 ${selector}: expected ${property}: ${value} in layout context`);
        return { selector, property, value, important: false, contexts: rule.contexts };
    });
    // Absence is meaningful here: alpha.2 removes the row's negative margins and
    // each child's gutter padding/margin rather than retaining both gap systems.
    for (const rule of alpha2.get('row') ?? []) {
        if (!rule.rowGutterTarget) continue;
        for (const [property, value] of Object.entries(rule.declarations)) {
            if (!/^(margin|padding)(-|$)/.test(property)) continue;
            // Exact shipped row-child offsets are positioning, not the removed
            // all-child gutter mechanism. No other margin/padding is allowed.
            const offset = rule.rowOffsetToken?.match(/^(?:(sm|md|lg|xl|2xl):)?offset-([0-9]|1[01])$/);
            const fractions = [
                '0',
                '0.0833333333',
                '0.1666666667',
                '0.25',
                '0.3333333333',
                '0.4166666667',
                '0.5',
                '0.5833333333',
                '0.6666666667',
                '0.75',
                '0.8333333333',
                '0.9166666667'
            ];
            const count = offset ? Number(offset[2]) : -1;
            const expected = count === 0 ? '0' : `calc((100% + var(--bs-gutter-x, 0px)) * ${fractions[count]})`;
            const minimum = offset?.[1] && thresholds.find(([bp]) => (bp === 'xxl' ? '2xl' : bp) === offset[1])?.[2];
            const expectedContexts = [
                { name: 'layer', params: 'layout' },
                ...(minimum ? [{ name: 'media', params: `(width >= ${minimum}px)` }] : [])
            ];
            const allowedOffset =
                offset &&
                (count > 0 || minimum) &&
                property === 'margin-inline-start' &&
                value === expected &&
                rule.importance[property] === false &&
                JSON.stringify(rule.contexts) === JSON.stringify(expectedContexts);
            assert(allowedOffset, `alpha2 ${rule.selector}: unexpected legacy ${property}`);
        }
    }
    return {
        alpha2GridRules,
        kind: 'static SSR selector occurrence/conditional grid rule/declaration characterization; not computed browser layout or cascade',
        fixtureCases: layout.cases,
        svelte: require('svelte/package.json').version,
        assets: Object.fromEntries(Object.entries(styles).map(([key, { version, sha256 }]) => [key, { version, sha256 }])),
        coverage,
        declarationComparisons,
        breakpoints: thresholds.map(([publicKey, baselineMinimum, alphaMinimum, baselineContainerMax, alphaContainerMax]) => ({
            publicKey,
            baselineMinimum,
            alphaMinimum,
            baselineContainerMax,
            alphaContainerMax
        })),
        plannedViewportWidths,
        plannedBrowserCombinations: modes.length * plannedViewportWidths.length,
        browserExecuted: false
    };
}

export async function assertInputConsistency({ rootPackage, appHtml } = {}) {
    rootPackage ??= JSON.parse(await readFile(new URL('package.json', repository), 'utf8'));
    appHtml ??= await readFile(new URL('src/app.html', repository), 'utf8');
    for (const name of ['svelte', 'bezier-easing']) {
        const { version } = JSON.parse(await readFile(findPackageJSON(name, import.meta.url), 'utf8'));
        const range = rootPackage.devDependencies?.[name] ?? rootPackage.dependencies?.[name];
        assert(semver.validRange(range) && semver.satisfies(version, range), `${name} ${version} does not satisfy root range ${range}`);
    }
    const version = appHtml.match(/https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@([^/]+)\/dist\/css\/bootstrap\.min\.css/)?.[1];
    assert.equal(
        version,
        pins.baseline.version,
        'showcase Bootstrap version differs from baseline pin (the fixture uses the unminified distribution of that version)'
    );
}

export async function characterize(options) {
    await assertInputConsistency(options);
    const styles = await loadStyles();
    return assertCharacterization(styles, await renderLayout());
}

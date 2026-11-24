// Expectations describe pinned CSS placement, not evaluated layout or cascade.
export const thresholds = [
    ['sm', 576, 576, 540, 540],
    ['md', 768, 768, 720, 720],
    ['lg', 992, 1024, 960, 960],
    ['xl', 1200, 1280, 1140, 1200],
    ['xxl', 1400, 1536, 1320, 1440]
];

// Both artifacts are checked independently, including importance and layer.
// Differences in property spelling/precision are intentional observations.
export const declarationExpectations = [
    ['row', 'display', ['display', 'flex', false, null], ['display', 'flex', false, 'layout']],
    ['row', 'wrap', ['flex-wrap', 'wrap', false, null], ['flex-wrap', 'wrap', false, 'layout']],
    ['col', 'flex', ['flex', '1 0 0', false, null], ['flex', '1 0 0', false, 'layout']],
    ['col-6', 'width', ['width', '50%', false, null], ['width', '50%', false, 'layout']],
    ['row-cols-3', 'width', ['width', '33.33333333%', false, null], ['width', '33.3333333333%', false, 'layout']],
    ['col-auto', 'width', ['width', 'auto', false, null], ['width', 'auto', false, 'layout']],
    ['offset-2', 'offset', ['margin-left', '16.66666667%', false, null], ['margin-inline-start', '16.6666666667%', false, 'layout']],
    ['order-2', 'order', ['order', '2', true, null], ['order', '2', false, 'utilities']],
    [
        'container',
        'gutter',
        ['padding-left', 'calc(var(--bs-gutter-x) * 0.5)', false, null],
        ['padding-inline', 'calc(var(--bs-gutter-x) * 0.5)', false, 'layout']
    ]
];

// Alpha.2 numeric standalone rules deliberately differ from row-child rules.
// These literal values were read from the exact shipped artifact, not evaluated
// from the alpha.1 expectations or inferred from selector occurrence counts.
export const alpha2DeclarationExpectations = [
    ['display', 'flex', false, 'layout'],
    ['flex-wrap', 'wrap', false, 'layout'],
    ['flex', '1 0 0', false, 'layout'],
    ['width', 'calc((100% + 0px) * 0.5 - 0px)', false, 'layout'],
    ['width', 'calc((100% + var(--bs-gutter-x, 0px)) / 3 - var(--bs-gutter-x, 0px))', false, 'layout'],
    ['width', 'auto', false, 'layout'],
    ['margin-inline-start', 'calc((100% + 0px) * 0.1666666667)', false, 'layout'],
    ['order', '2', false, 'utilities'],
    ['padding-inline', 'calc(var(--bs-gutter-x) * 0.5)', false, 'layout']
];

export const alpha2GridExpectations = [
    ['row', '.row', 'gap', 'var(--bs-gutter-y) var(--bs-gutter-x)'],
    ['row', '.row', '--bs-gutter-x', '1.5rem'],
    ['row', '.row', '--bs-gutter-y', '0'],
    ['row', '.row > *', 'box-sizing', 'border-box'],
    ['row', '.row > *', 'flex-shrink', '0'],
    ['row', '.row > *', 'width', '100%'],
    ['row', '.row > *', 'max-width', '100%'],
    ['col-6', ':where(.row) > .col-6', 'width', 'calc((100% + var(--bs-gutter-x, 0px)) * 0.5 - var(--bs-gutter-x, 0px))'],
    ['offset-2', ':where(.row) > .offset-2', 'margin-inline-start', 'calc((100% + var(--bs-gutter-x, 0px)) * 0.1666666667)'],
    ['gx-0', '.gx-0', '--bs-gutter-x', '0px'],
    ['gy-0', '.gy-0', '--bs-gutter-y', '0']
];

export const plannedViewportWidths = [375, 575, 576, 767, 768, 991, 992, 1023, 1024, 1199, 1200, 1279, 1280, 1399, 1400, 1535, 1536, 1600];

export function markdownReport(report) {
    const coverage = report.coverage.map(({ mode, matched, total, missing }) => `| ${mode} | ${matched}/${total} | ${missing.length} |`).join('\n');
    const breakpoints = report.breakpoints
        .map(
            ({ publicKey, baselineMinimum, alphaMinimum, baselineContainerMax, alphaContainerMax }) =>
                `| ${publicKey} | ${baselineMinimum} / ${baselineContainerMax}px | ${alphaMinimum} / ${alphaContainerMax}px |`
        )
        .join('\n');
    const declarations = report.declarationComparisons
        .map(({ name, purpose, baseline, alpha, alpha2 }) => {
            const describe = ({ property, value, important, layers }) =>
                `\`${property}: ${value}${important ? ' !important' : ''}\` (${layers.join('.') || 'unlayered'})`;
            return `| ${name} ${purpose} | ${describe(baseline)} | ${describe(alpha)} | ${describe(alpha2)} |`;
        })
        .join('\n');
    return `<!-- fixture-report:start -->\n${report.fixtureCases} generated SSR prop cases cover ${report.coverage[0].total} distinct public grid tokens.\n\n| Static selector occurrence | Found/total | Missing |\n| --- | ---: | ---: |\n${coverage}\n\n| Public key | v5 first conditional rule / container cap | Alpha first conditional rule / container cap |\n| --- | --- | --- |\n${breakpoints}\n\n| Representative declaration | Bootstrap 5 | Alpha 1 | Alpha 2 |\n| --- | --- | --- | --- |\n${declarations}\n\n| Alpha 2 scoped rule | Declaration (layout layer) |\n| --- | --- |\n${report.alpha2GridRules.map(({ selector, property, value }) => `| \`${selector}\` | \`${property}: ${value}\` |`).join('\n')}\n<!-- fixture-report:end -->`;
}

import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';
import { createPropsCatalog } from './props-types.js';
import { renderPageDom, renderPageMarkdown } from './markdown/render-page.js';
import { sitePages } from './site.js';
import { validatePropsTables } from './props-validation.js';

const catalog = createPropsCatalog();
const table = (name: string) =>
    `<h2>API Reference</h2><h3>Toast.Container Props</h3><table data-props-type="ToastContainerProps"><thead><tr><th>Name</th><th>Type</th></tr></thead><tbody><tr><td>${name}</td><td>string</td></tr></tbody></table>`;
const validate = (html: string) => {
    const dom = new JSDOM(html);
    try {
        return validatePropsTables(dom.window.document.body, '/components/toast', catalog.names);
    } finally {
        dom.window.close();
    }
};

describe('showcase props validation', () => {
    test('rejects historical Toast position drift and accepts placement and inherited HTML props', () => {
        expect(validate(table('position')).errors).toEqual(['/components/toast: position is absent from ToastContainerProps']);
        expect(validate(table('placement')).errors).toEqual([]);
        expect(validate(table('aria-label')).errors).toEqual([]);
    });
    test('fails missing bindings, unknown types, invalid columns and empty tables', () => {
        expect(validate(table('placement').replace(' data-props-type="ToastContainerProps"', '')).errors[0]).toContain('missing data-props-type');
        expect(validate(table('placement').replace('ToastContainerProps', 'UnknownProps')).errors[0]).toContain('unknown props type');
        expect(validate(table('placement').replace('<th>Type</th>', '<th>Typo</th>')).errors[0]).toContain('invalid columns');
        expect(validate(table('placement').replace(/<tbody>.*<\/tbody>/, '<tbody></tbody>')).errors[0]).toContain('empty props table');
    });
    test('uses explicit bindings independently of heading wording and ignores event/CSS tables', () => {
        const nested = table('isMultiple')
            .replace('ToastContainerProps', 'AccordionRootProps')
            .replace('<h3>Toast.Container Props</h3>', '<h3>Different wording</h3><h4>Props</h4>');
        expect(validate(nested)).toMatchObject({ tables: 1, rows: 1, errors: [] });
        expect(validate(nested.replace('isMultiple', 'madeUp')).errors[0]).toContain('madeUp is absent from AccordionRootProps');
        const unbound = table('madeUp').replace(' data-props-type="ToastContainerProps"', '');
        expect(validate(unbound.replace('<th>Name</th>', '<th>Event</th>')).tables).toBe(0);
        expect(validate(unbound.replace('<th>Name</th>', '<th>Class</th>')).tables).toBe(0);
    });
    test('retains member-only union props in names and manifest details', () => {
        const manifest = catalog.manifest(['FormCheckLabelProps', 'FormInputGroupTextProps']);
        for (const name of ['FormCheckLabelProps', 'FormInputGroupTextProps']) {
            expect(manifest[name]?.props.find((prop) => prop.name === 'for')).toMatchObject({ memberOnly: true, optional: true });
            expect(validate(table('for').replace('ToastContainerProps', name)).errors).toEqual([]);
            expect(manifest[name]?.props.find((prop) => prop.name === 'class')?.memberOnly).toBe(false);
        }
    });
    test('documents the actual Pagination.Root accessible-label default', async () => {
        const { markdown } = await renderPageMarkdown('/components/pagination');
        expect(markdown).toContain("| `aria-label` | `string` | `'Pagination navigation'` |");
    }, 60_000);
    test('keeps type optionality distinct from runtime defaults in the manifest experiment', () => {
        const manifest = catalog.manifest(['ToastContainerProps', 'ProgressProps']);
        expect(manifest.ToastContainerProps?.props.find((prop) => prop.name === 'placement')).toMatchObject({ optional: true, default: null });
        expect(manifest.ProgressProps?.props.find((prop) => prop.name === 'valueMax')).toMatchObject({
            description: expect.stringContaining('defaults to 100'),
            default: null
        });
        expect(catalog.names.FormRootProps).toBeDefined();
        expect(catalog.names.RowRootProps).toBeDefined();
        expect(catalog.names.ColRootProps).toBeDefined();
        expect(catalog.names.PortalRootProps).toBeDefined();
    });
    test('every rendered props/options row names a property in its component type', async () => {
        const errors: string[] = [];
        let tables = 0;
        let rows = 0;
        const covered: Record<string, { tables: number; rows: number }> = {};
        for (const { href } of sitePages()) {
            const dom = await renderPageDom(href);
            try {
                const result = validatePropsTables(dom.window.document.body, href, catalog.names);
                tables += result.tables;
                rows += result.rows;
                errors.push(...result.errors);
                if (result.tables) covered[href] = { tables: result.tables, rows: result.rows };
            } finally {
                dom.window.close();
            }
        }
        expect(errors).toEqual([]);
        expect(tables).toBe(84);
        expect(rows).toBe(434);
        expect(covered).toMatchInlineSnapshot(`
          {
            "/components/accordion": {
              "rows": 21,
              "tables": 6,
            },
            "/components/alert": {
              "rows": 5,
              "tables": 1,
            },
            "/components/badge": {
              "rows": 5,
              "tables": 1,
            },
            "/components/breadcrumb": {
              "rows": 10,
              "tables": 2,
            },
            "/components/button": {
              "rows": 9,
              "tables": 1,
            },
            "/components/button-group": {
              "rows": 20,
              "tables": 3,
            },
            "/components/card": {
              "rows": 39,
              "tables": 11,
            },
            "/components/carousel": {
              "rows": 22,
              "tables": 4,
            },
            "/components/close-button": {
              "rows": 4,
              "tables": 1,
            },
            "/components/collapse": {
              "rows": 4,
              "tables": 1,
            },
            "/components/dropdown": {
              "rows": 44,
              "tables": 7,
            },
            "/components/list-group": {
              "rows": 19,
              "tables": 3,
            },
            "/components/modal": {
              "rows": 34,
              "tables": 6,
            },
            "/components/nav": {
              "rows": 19,
              "tables": 3,
            },
            "/components/navbar": {
              "rows": 33,
              "tables": 7,
            },
            "/components/offcanvas": {
              "rows": 24,
              "tables": 4,
            },
            "/components/pagination": {
              "rows": 16,
              "tables": 3,
            },
            "/components/placeholder": {
              "rows": 7,
              "tables": 2,
            },
            "/components/popover": {
              "rows": 14,
              "tables": 2,
            },
            "/components/progress": {
              "rows": 15,
              "tables": 3,
            },
            "/components/scrollspy": {
              "rows": 3,
              "tables": 1,
            },
            "/components/spinner": {
              "rows": 6,
              "tables": 1,
            },
            "/components/tab": {
              "rows": 21,
              "tables": 4,
            },
            "/components/toast": {
              "rows": 23,
              "tables": 4,
            },
            "/components/tooltip": {
              "rows": 10,
              "tables": 1,
            },
            "/layout/breakpoint": {
              "rows": 3,
              "tables": 1,
            },
            "/layout/container": {
              "rows": 4,
              "tables": 1,
            },
          }
        `);
    }, 120_000);
});

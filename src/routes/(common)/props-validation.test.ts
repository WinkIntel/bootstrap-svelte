import { JSDOM } from 'jsdom';
import type { Component } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import { createPropsManifest } from '../../../scripts/docs/props-manifest.js';
import { validatePropsTables } from './props-validation.js';

const pages = import.meta.glob<{ default: Component }>('/src/routes/**/+page.svelte');
const manifest = createPropsManifest();
const table = (name: string) =>
    `<h2>API Reference</h2><h3>Toast.Container Props</h3><table><thead><tr><th>Name</th><th>Type</th></tr></thead><tbody><tr><td>${name}</td><td>string</td></tr></tbody></table>`;
const validate = (html: string) => {
    const dom = new JSDOM(html);
    try {
        return validatePropsTables(dom.window.document.body, '/components/toast', manifest);
    } finally {
        dom.window.close();
    }
};

describe('showcase props validation', () => {
    test('rejects historical Toast position drift and accepts placement and inherited HTML props', () => {
        expect(validate(table('position')).errors).toEqual(['/components/toast: Toast.Container.position is absent from ToastContainerProps']);
        expect(validate(table('placement')).errors).toEqual([]);
        expect(validate(table('aria-label')).errors).toEqual([]);
    });
    test('fails unmapped and empty API tables', () => {
        expect(validate(table('placement').replace('Toast.Container', 'Unknown.Root')).errors[0]).toContain('unmapped props table');
        expect(validate(table('placement').replace(/<tbody>.*<\/tbody>/, '<tbody></tbody>')).errors[0]).toContain('empty props table');
    });
    test('validates nested Accordion headings and ignores event and CSS tables', () => {
        const nested = table('isMultiple').replace('<h3>Toast.Container Props</h3>', '<h3>Accordion.Root</h3><h4>Props</h4>');
        expect(validate(nested)).toMatchObject({ tables: 1, rows: 1, errors: [] });
        expect(validate(nested.replace('isMultiple', 'madeUp')).errors[0]).toContain('Accordion.Root.madeUp');
        expect(validate(table('madeUp').replace('Toast.Container Props', 'Events')).tables).toBe(0);
        expect(validate(table('madeUp').replace('<th>Name</th>', '<th>Class</th>')).tables).toBe(0);
    });
    test('keeps type optionality distinct from runtime defaults in the manifest experiment', () => {
        expect(manifest.ToastContainerProps?.props.find((prop) => prop.name === 'placement')).toMatchObject({ optional: true, default: null });
        expect(manifest.ProgressProps?.props.find((prop) => prop.name === 'valueMax')).toMatchObject({
            description: expect.stringContaining('defaults to 100'),
            default: null
        });
        expect(manifest.FormRootProps).toBeDefined();
        expect(manifest.RowRootProps).toBeDefined();
        expect(manifest.ColRootProps).toBeDefined();
        expect(manifest.PortalRootProps).toBeDefined();
    });
    test('every rendered props/options row names a property in its component type', async () => {
        const errors: string[] = [];
        let tables = 0;
        let rows = 0;
        const covered: Record<string, number> = {};
        for (const [path, load] of Object.entries(pages).sort(([a], [b]) => a.localeCompare(b))) {
            const { default: component } = await load();
            const dom = new JSDOM(render(component).body);
            try {
                const result = validatePropsTables(dom.window.document.body, path.replace('/src/routes', '').replace('/+page.svelte', ''), manifest);
                tables += result.tables;
                rows += result.rows;
                errors.push(...result.errors);
                if (result.tables) covered[path.replace('/src/routes', '').replace('/+page.svelte', '')] = result.tables;
            } finally {
                dom.window.close();
            }
        }
        console.log(JSON.stringify({ tables, rows, pages: Object.keys(covered).length, types: Object.keys(manifest).length }));
        expect(errors).toEqual([]);
        expect(tables).toBeGreaterThan(80);
        expect(rows).toBeGreaterThan(400);
        expect(covered).toMatchInlineSnapshot(`
          {
            "/components/accordion": 6,
            "/components/alert": 1,
            "/components/badge": 1,
            "/components/breadcrumb": 2,
            "/components/button": 1,
            "/components/button-group": 3,
            "/components/card": 11,
            "/components/carousel": 4,
            "/components/close-button": 1,
            "/components/collapse": 1,
            "/components/dropdown": 7,
            "/components/list-group": 3,
            "/components/modal": 6,
            "/components/nav": 3,
            "/components/navbar": 7,
            "/components/offcanvas": 4,
            "/components/pagination": 3,
            "/components/placeholder": 2,
            "/components/popover": 2,
            "/components/progress": 3,
            "/components/scrollspy": 1,
            "/components/spinner": 1,
            "/components/tab": 4,
            "/components/toast": 4,
            "/components/tooltip": 1,
            "/layout/breakpoint": 1,
            "/layout/container": 1,
          }
        `);
    }, 120_000);
});

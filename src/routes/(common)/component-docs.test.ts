import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import ts from 'typescript';
import * as publicExports from '$lib/index.js';
import { createPropsCatalog, type PropsNames } from './props-types.js';

const root = resolve(import.meta.dirname, '../../..');
const catalog = createPropsCatalog(root);
const aliases = new Map<string, string>();
for (const entry of readdirSync(join(root, 'src/lib'), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const composition = join(root, 'src/lib', entry.name, 'composition.ts');
    if (!ts.sys.fileExists(composition)) continue;
    const source = ts.createSourceFile(composition, readFileSync(composition, 'utf8'), ts.ScriptTarget.Latest, true);
    for (const statement of source.statements) {
        if (!ts.isExportDeclaration(statement) || !statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue;
        for (const item of statement.exportClause.elements) {
            aliases.set(`${entry.name}.${item.name.text}`, (item.propertyName ?? item.name).text);
        }
    }
}

/** Check only top-level prop bullets, not nested option keys or sub-component lists. */
function validateHoverProps(source: string, names: PropsNames): string[] {
    const blocks = [...source.matchAll(/<!--[\s\S]*?-->/g)].map(([block]) => block).filter((block) => block.includes('@component'));
    const props = blocks.flatMap((block) =>
        [...block.matchAll(/^### Props\s*\n([\s\S]*?)(?=^#{1,3} |-->|$(?![\s\S]))/gm)].flatMap(([, section]) =>
            [...section!.matchAll(/^- `([^`]+)`/gm)].map(([, name]) => name!)
        )
    );
    if (!props.length) return [];
    // Resolve namespace aliases through composition.ts, including aliases whose names differ from their source type.
    const script = source.replace(/<!--[\s\S]*?-->/g, '').match(/<script\b[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';
    const annotation = script.match(/:\s*([\w.]+)\s*=\s*\$props\(\)/)?.[1];
    const type = annotation && (aliases.get(annotation) ?? annotation);
    const resolved = type && names[type];
    if (!resolved) return ['Documented props have no resolved $props() type'];
    return props.filter((prop) => !resolved.has(prop)).map((prop) => `${prop} is absent from ${type}`);
}

function components(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) return entry.name === 'tests' ? [] : components(path);
        return entry.name.endsWith('.svelte') ? [path] : [];
    });
}

describe('component hover documentation', () => {
    test('rejects obsolete props while accepting inherited HTML props', () => {
        const fixture = (name: string) =>
            `<!--\n@component\n### Props\n- \`${name}\`: Optional.\n-->\n<script lang="ts">let { ...props }: Pagination.RootProps = $props();</script>`;
        expect(validateHoverProps(fixture('ariaLabel'), catalog.names)).toEqual(['ariaLabel is absent from PaginationRootProps']);
        expect(validateHoverProps(fixture('disabled'), catalog.names)).toEqual(['disabled is absent from PaginationRootProps']);
        expect(validateHoverProps(fixture('aria-label'), catalog.names)).toEqual([]);
        expect(validateHoverProps(fixture('class'), catalog.names)).toEqual([]);
        expect(validateHoverProps(fixture('class').replace('Pagination.RootProps', 'UnknownProps'), catalog.names)).toEqual([
            'Documented props have no resolved $props() type'
        ]);
    });

    test('ignores nested option keys and non-prop lists', () => {
        const source =
            '<!--\n@component\n### Sub-components\n- `Table.Data`: cell\n### Props\n- `responsiveProps`: options\n  - `breakpoint`: width\n-->\n<script>let { ...props }: Table.RootProps = $props();</script>';
        expect(validateHoverProps(source, catalog.names)).toEqual([]);
    });

    test('README component names are real public exports', () => {
        const readme = readFileSync(join(root, 'README.md'), 'utf8');
        const section = readme.split('## Available components')[1]?.split('## Notes for SvelteKit')[0];
        expect(section).toBeDefined();
        const names = [...section!.matchAll(/^- `([^`]+)`/gm)].map(([, name]) => name!);
        expect(names).toEqual(
            expect.arrayContaining(['ProgressBar', 'ProgressStacked', 'scrollspy', 'collapseAria', 'ButtonToolbar', 'ButtonCheck'])
        );
        expect(names.filter((name) => !Object.hasOwn(publicExports, name))).toEqual([]);
    });

    test('every documented component prop exists in its resolved props type', () => {
        const errors = components(join(root, 'src/lib')).flatMap((file) =>
            validateHoverProps(readFileSync(file, 'utf8'), catalog.names).map((error) => `${relative(root, file)}: ${error}`)
        );
        expect(errors).toEqual([]);
    });
});

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import type { PropsNames } from './props-types.js';

/** Validate explicitly bound API tables; unknown/missing bindings fail instead of guessing from prose. */
export function validatePropsTables(root: Element, page: string, types: PropsNames): { tables: number; rows: number; errors: string[] } {
    const result = { tables: 0, rows: 0, errors: [] as string[] };
    for (const table of root.querySelectorAll('table')) {
        const columns = Array.from(table.querySelectorAll('thead th'), (cell) => cell.textContent?.trim());
        const isPropsTable = ['Name', 'Prop', 'Option'].includes(columns[0] ?? '') && columns[1] === 'Type';
        const name = table.getAttribute('data-props-type');
        if (name === null && !isPropsTable) continue;
        result.tables++;
        if (!name) {
            result.errors.push(`${page}: missing data-props-type on API table`);
            continue;
        }
        if (!isPropsTable) result.errors.push(`${page}: invalid columns for ${name}`);
        const names = types[name];
        if (!names) {
            result.errors.push(`${page}: unknown props type ${name}`);
            continue;
        }
        const rows = table.querySelectorAll('tbody tr');
        if (!rows.length) result.errors.push(`${page}: empty props table ${name}`);
        for (const row of rows) {
            const prop = row.querySelector('td')?.textContent?.trim() ?? '';
            result.rows++;
            if (!names.has(prop)) result.errors.push(`${page}: ${prop} is absent from ${name}`);
        }
    }
    return result;
}

/** Resolve namespace aliases without constructing another TypeScript program. */
export function createHoverPropsAliases(root: string): ReadonlyMap<string, string> {
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

    return aliases;
}

/** Validate top-level prop bullets; malformed or empty hover blocks fail closed. */
export function validateHoverProps(
    source: string,
    names: PropsNames,
    aliases: ReadonlyMap<string, string>
): { blocks: number; props: number; errors: string[] } {
    const blocks = [...source.matchAll(/<!--[\s\S]*?-->/g)].map(([block]) => block).filter((block) => block.includes('@component'));
    const result = { blocks: blocks.length, props: 0, errors: [] as string[] };
    const props: string[] = [];
    for (const block of blocks) {
        // Svelte ends the outer comment at the first --> too; do not silently validate a truncated example.
        if (block.slice(4).includes('<!--')) {
            result.errors.push('Nested HTML comment in @component block; escape example comment delimiters');
            continue;
        }
        const sections = [...block.matchAll(/^#{1,6}[ \t]+Props[ \t]*\r?\n([\s\S]*?)(?=^#{1,6}[ \t]+|-->|$(?![\s\S]))/gm)];
        if (!sections.length) result.errors.push('@component block has no Props section');
        for (const [, section] of sections) {
            const bullets = [...section!.matchAll(/^- `([^`]+)`/gm)].map(([, name]) => name!);
            if (!bullets.length) result.errors.push('Props section has no top-level prop bullets');
            props.push(...bullets);
        }
    }
    result.props = props.length;
    if (!props.length) return result;
    const script = source.replace(/<!--[\s\S]*?-->/g, '').match(/<script\b[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';
    const annotation = script.match(/:\s*([\w.]+)\s*=\s*\$props\(\)/)?.[1];
    const type = annotation && (aliases.get(annotation) ?? annotation);
    const resolved = type && names[type];
    if (!resolved) result.errors.push('Documented props have no resolved $props() type');
    else result.errors.push(...props.filter((prop) => !resolved.has(prop)).map((prop) => `${prop} is absent from ${type}`));
    return result;
}

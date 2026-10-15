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

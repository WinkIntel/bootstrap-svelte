import type { PropsManifest } from '../../../scripts/docs/props-manifest.js';

const aliases: Record<string, string> = {
    'Dropdown.ItemText': 'DropdownTextProps',
    'Carousel.ControlPrev/ControlNext': 'CarouselControlProps',
    ProgressBar: 'ProgressProps',
    'barProps Object': 'ProgressBarProps',
    ButtonGroup: 'ButtonGroupRootProps',
    ButtonCheck: 'ButtonCheckRootProps',
    ButtonToolbar: 'ButtonToolbarRootProps',
    'Scrollspy Attachment': 'ScrollspyOptions'
};

/** Validate rendered API tables, including dynamically generated rows; ignore examples and CSS/event tables. */
export function validatePropsTables(root: Element, page: string, manifest: PropsManifest): { tables: number; rows: number; errors: string[] } {
    const result = { tables: 0, rows: 0, errors: [] as string[] };
    const headings: string[] = [];
    for (const element of root.querySelectorAll('h1,h2,h3,h4,h5,h6,table')) {
        if (element.tagName !== 'TABLE') {
            const level = Number(element.tagName[1]);
            headings.length = level;
            headings[level - 1] = element.textContent?.trim() ?? '';
            continue;
        }
        const columns = Array.from(element.querySelectorAll('thead th'), (cell) => cell.textContent?.trim());
        if (!['Name', 'Prop', 'Option'].includes(columns[0] ?? '') || columns[1] !== 'Type') continue;
        if (headings.filter(Boolean).at(-1) === 'Events') continue;
        result.tables++;
        const context = headings.filter(Boolean);
        let label = context.at(-1) ?? '';
        if (label === 'Options' || (label === 'Props' && context.at(-2)?.startsWith('Accordion.'))) label = context.at(-2) ?? '';
        if (label === 'Props') {
            const slug = page.split('/').at(-1) ?? '';
            label =
                slug === 'breakpoint'
                    ? 'BreakpointListener'
                    : slug
                          .split('-')
                          .map((word) => word[0]?.toUpperCase() + word.slice(1))
                          .join('');
            label += '.Root';
        }
        label = label.replace(/ Props$/, '');
        const name = aliases[label] ?? `${label.replaceAll('.', '')}Props`;
        const entry = manifest[name];
        if (!entry) {
            result.errors.push(`${page}: unmapped props table "${label}" (${name})`);
            continue;
        }
        const names = new Set(entry.props.map((prop) => prop.name));
        const rows = element.querySelectorAll('tbody tr');
        if (!rows.length) result.errors.push(`${page}: empty props table "${label}"`);
        for (const row of rows) {
            const prop = row.querySelector('td')?.textContent?.trim() ?? '';
            result.rows++;
            if (!names.has(prop)) result.errors.push(`${page}: ${label}.${prop} is absent from ${name}`);
        }
    }
    return result;
}

/**
 * A small, dependency-free HTML → Markdown converter tailored to the showcase pages.
 * It works on any DOM implementation (jsdom at build time) and deliberately drops
 * interactive controls, hidden content, and anything matching the caller's skip selectors.
 */

export type HtmlToMarkdownOptions = {
    /** Absolute URL of the page being converted; relative links are resolved against it. */
    baseUrl: string;
    /** Additional CSS selectors whose elements (and descendants) are omitted from the output. */
    skip?: string[];
};

type Context = {
    baseUrl: string;
    skipSelector: string;
    codeBlocks: string[];
};

const DEFAULT_SKIP_SELECTORS = [
    'script',
    'style',
    'noscript',
    'template',
    'svg',
    'button',
    'input',
    'select',
    'textarea',
    'form',
    'label',
    '[aria-hidden="true"]',
    '[hidden]',
    '[data-markdown="skip"]',
    '.visually-hidden',
    '.modal',
    '.offcanvas',
    '.dropdown-menu',
    '.collapse:not(.show)'
];

const BLOCK_CONTAINERS = new Set([
    'ADDRESS',
    'ARTICLE',
    'ASIDE',
    'CAPTION',
    'DD',
    'DETAILS',
    'DIV',
    'DL',
    'DT',
    'FIELDSET',
    'FIGCAPTION',
    'FIGURE',
    'FOOTER',
    'HEADER',
    'LEGEND',
    'MAIN',
    'NAV',
    'SECTION',
    'SUMMARY'
]);

const BLOCK_ELEMENTS = new Set([...BLOCK_CONTAINERS, 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'PRE', 'TABLE', 'HR', 'BLOCKQUOTE']);

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

/** Code blocks are swapped for placeholders (delimited by a private-use code point) while whitespace is normalized, so their contents are never touched. */
const PLACEHOLDER_DELIMITER = '\uE000';
const CODE_PLACEHOLDER = new RegExp(`${PLACEHOLDER_DELIMITER}(\\d+)${PLACEHOLDER_DELIMITER}`, 'g');

export function htmlToMarkdown(root: Element, options: HtmlToMarkdownOptions): string {
    const context: Context = {
        baseUrl: options.baseUrl,
        skipSelector: [...DEFAULT_SKIP_SELECTORS, ...(options.skip ?? [])].join(','),
        codeBlocks: []
    };

    const raw = renderChildren(root, context);
    const normalized = raw
        .split('\n')
        .map((line) => line.replace(/[ \t]+$/, '').replace(/(\S)[ \t]{2,}(?=\S)/g, '$1 '))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    return normalized.replace(CODE_PLACEHOLDER, (_match, index: string) => context.codeBlocks[Number(index)] ?? '');
}

/** Returns the normalized text of the first `p.lead` paragraph, or an empty string. */
export function extractLead(root: Element): string {
    return collapseWhitespace(root.querySelector('p.lead')?.textContent ?? '').trim();
}

function collapseWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ');
}

function isElement(node: Node): node is Element {
    return node.nodeType === ELEMENT_NODE;
}

function isBlockElement(node: Node | null): boolean {
    return node !== null && isElement(node) && BLOCK_ELEMENTS.has(node.tagName);
}

function renderChildren(element: Element, context: Context): string {
    let out = '';

    for (const child of Array.from(element.childNodes)) {
        if (child.nodeType === TEXT_NODE) {
            let text = collapseWhitespace(child.textContent ?? '');
            if (text.trim() === '' && (isBlockElement(child.previousSibling) || isBlockElement(child.nextSibling))) continue;
            if (out === '' || out.endsWith('\n')) text = text.replace(/^\s+/, '');
            out += text;
            continue;
        }

        if (isElement(child)) out += renderElement(child, context);
    }

    return out;
}

function renderElement(element: Element, context: Context): string {
    if (element.matches(context.skipSelector)) return '';

    const tag = element.tagName;

    switch (tag) {
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6': {
            const text = renderChildren(element, context).trim();
            return text ? `\n\n${'#'.repeat(Number(tag[1]))} ${text}\n\n` : '';
        }
        case 'P': {
            const text = renderChildren(element, context).trim();
            return text ? `\n\n${text}\n\n` : '';
        }
        case 'UL':
        case 'OL':
            return `\n\n${renderList(element, context, 0)}\n\n`;
        case 'PRE':
            return renderCodeBlock(element, context);
        case 'CODE':
        case 'KBD':
            return renderInlineCode(element.textContent ?? '');
        case 'STRONG':
        case 'B':
            return wrapInline(renderChildren(element, context), '**');
        case 'EM':
        case 'I':
            return wrapInline(renderChildren(element, context), '*');
        case 'DEL':
        case 'S':
            return wrapInline(renderChildren(element, context), '~~');
        case 'A':
            return renderLink(element, context);
        case 'IMG':
            return renderImage(element, context);
        case 'BR':
            return '\n';
        case 'HR':
            return '\n\n---\n\n';
        case 'BLOCKQUOTE': {
            const inner = normalizeBlock(renderChildren(element, context));
            return inner ? `\n\n${inner.replace(/^/gm, '> ')}\n\n` : '';
        }
        case 'TABLE':
            return renderTable(element, context);
        default: {
            if (!BLOCK_CONTAINERS.has(tag)) return renderChildren(element, context);
            const links = renderLinkGroup(element, context);
            if (links) return `\n\n${links.map((link) => `- ${link}`).join('\n')}\n\n`;
            return `\n\n${renderChildren(element, context)}\n\n`;
        }
    }
}

/** A block whose only content is two or more links (a link grid or card index) reads best as a list. */
function renderLinkGroup(element: Element, context: Context): string[] | null {
    const children = Array.from(element.childNodes);
    const hasText = children.some((child) => child.nodeType === TEXT_NODE && (child.textContent ?? '').trim() !== '');
    const elements = children.filter(isElement);
    if (hasText || elements.length < 2 || !elements.every((child) => child.tagName === 'A')) return null;

    const links = elements.map((anchor) => renderElement(anchor, context)).filter((link) => link.length > 0);
    return links.length > 0 ? links : null;
}

function normalizeBlock(text: string): string {
    return text.replace(/\n{3,}/g, '\n\n').trim();
}

function wrapInline(text: string, marker: string): string {
    const trimmed = text.trim();
    return trimmed ? `${marker}${trimmed}${marker}` : '';
}

function renderInlineCode(code: string): string {
    const text = collapseWhitespace(code).trim();
    if (!text) return '';
    const fence = text.includes('`') ? '``' : '`';
    return `${fence}${text}${fence}`;
}

function renderList(list: Element, context: Context, depth: number): string {
    const ordered = list.tagName === 'OL';
    const indent = '  '.repeat(depth);
    const lines: string[] = [];
    let index = 0;

    for (const item of Array.from(list.children)) {
        if (item.tagName !== 'LI' || item.matches(context.skipSelector)) continue;

        index += 1;
        let inline = '';
        const nested: string[] = [];

        for (const child of Array.from(item.childNodes)) {
            if (isElement(child) && (child.tagName === 'UL' || child.tagName === 'OL')) {
                if (!child.matches(context.skipSelector)) nested.push(renderList(child, context, depth + 1));
            } else if (isElement(child)) {
                inline += renderElement(child, context);
            } else if (child.nodeType === TEXT_NODE) {
                inline += collapseWhitespace(child.textContent ?? '');
            }
        }

        const text = normalizeBlock(inline).replace(/\n{2,}/g, '\n');
        lines.push(`${indent}${ordered ? `${index}.` : '-'} ${text}`.replace(/\s+$/, ''));
        lines.push(...nested.filter((block) => block.length > 0));
    }

    return lines.join('\n');
}

function renderCodeBlock(pre: Element, context: Context): string {
    const code = pre.querySelector('code') ?? pre;
    const text = (code.textContent ?? '').replace(/^\n+|\n+$/g, '');
    if (!text.trim()) return '';

    const language = pre.getAttribute('data-language') ?? languageFromClass(pre) ?? languageFromClass(code) ?? '';
    const fence = text.includes('```') ? '````' : '```';
    const block = `${fence}${language}\n${text}\n${fence}`;

    context.codeBlocks.push(block);
    return `\n\n${PLACEHOLDER_DELIMITER}${context.codeBlocks.length - 1}${PLACEHOLDER_DELIMITER}\n\n`;
}

function languageFromClass(element: Element): string | undefined {
    for (const className of Array.from(element.classList)) {
        const match = /^(?:language|lang)-(.+)$/.exec(className);
        if (match?.[1]) return match[1];
    }
    return undefined;
}

function renderLink(anchor: Element, context: Context): string {
    const text = renderChildren(anchor, context).trim();
    const href = anchor.getAttribute('href')?.trim() ?? '';

    if (!text) return '';
    if (!href || href === '#' || href === '#!' || href.startsWith('javascript:')) return text;

    return `[${text}](${resolveUrl(href, context.baseUrl)})`;
}

function renderImage(image: Element, context: Context): string {
    const src = image.getAttribute('src')?.trim();
    const alt = collapseWhitespace(image.getAttribute('alt') ?? '').trim();
    if (!src) return alt;
    return `![${alt}](${resolveUrl(src, context.baseUrl)})`;
}

function resolveUrl(href: string, baseUrl: string): string {
    try {
        return new URL(href, baseUrl).href;
    } catch {
        return href;
    }
}

function renderTable(table: Element, context: Context): string {
    const rows = Array.from(table.querySelectorAll('tr')).filter((row) => row.closest('table') === table && !row.matches(context.skipSelector));
    const [headerRow, ...bodyRows] = rows;
    if (!headerRow) return '';

    const cells = (row: Element): string[] =>
        Array.from(row.children)
            .filter((cell) => cell.tagName === 'TH' || cell.tagName === 'TD')
            .map((cell) =>
                normalizeBlock(renderChildren(cell, context))
                    .replace(/\s*\n\s*/g, ' ')
                    .replace(/\|/g, '\\|')
            );

    const header = cells(headerRow);
    const columnCount = Math.max(header.length, ...bodyRows.map((row) => cells(row).length));
    if (columnCount === 0) return '';

    const pad = (values: string[]): string[] => [...values, ...Array.from({ length: columnCount - values.length }, () => '')];
    const line = (values: string[]): string => `| ${pad(values).join(' | ')} |`;

    const lines = [line(header), line(Array.from({ length: columnCount }, () => '---')), ...bodyRows.map((row) => line(cells(row)))];
    return `\n\n${lines.join('\n')}\n\n`;
}

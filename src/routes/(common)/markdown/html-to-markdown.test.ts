import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';
import { extractLead, htmlToMarkdown, type HtmlToMarkdownOptions } from './html-to-markdown.js';

const BASE_URL = 'https://example.test/docs/page';

function convert(html: string, options: Partial<HtmlToMarkdownOptions> = {}): string {
    const dom = new JSDOM(`<main>${html}</main>`);
    const root = dom.window.document.querySelector('main');
    if (!root) throw new Error('missing root');
    return htmlToMarkdown(root, { baseUrl: BASE_URL, ...options });
}

describe('htmlToMarkdown', () => {
    test('converts headings', () => {
        expect(convert('<h1>Title</h1><h2 class="wk-quick-link">Sub   heading</h2><h3>Third</h3>')).toBe('# Title\n\n## Sub heading\n\n### Third');
    });

    test('converts paragraphs with inline markup', () => {
        expect(convert('<p>Use the <code>size</code> prop for <strong>large</strong> or <em>small</em> buttons.</p>')).toBe(
            'Use the `size` prop for **large** or *small* buttons.'
        );
    });

    test('resolves links against the page URL', () => {
        expect(
            convert('<p><a href="/components/button">Button</a>, <a href="#api">API</a>, <a href="https://getbootstrap.com/">Bootstrap</a></p>')
        ).toBe('[Button](https://example.test/components/button), [API](https://example.test/docs/page#api), [Bootstrap](https://getbootstrap.com/)');
    });

    test('converts unordered and ordered lists, including nesting', () => {
        expect(convert('<ul><li>One</li><li>Two<ul><li>Nested</li></ul></li></ul><ol><li>First</li><li>Second</li></ol>')).toBe(
            '- One\n- Two\n  - Nested\n\n1. First\n2. Second'
        );
    });

    test('converts highlighted code blocks to fenced code with the declared language', () => {
        const html =
            '<pre data-language="html" class="vstack mb-0">\n    <code class="hljs"><span class="hljs-tag">&lt;<span class="hljs-name">Button</span>&gt;</span>Base\n  indented<span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span></code>\n</pre>';
        expect(convert(html)).toBe('```html\n<Button>Base\n  indented</Button>\n```');
    });

    test('converts tables to GFM tables and escapes pipes', () => {
        const html =
            '<table><thead><tr><th>Name</th><th>Type</th></tr></thead><tbody><tr><td><code>size</code></td><td>string | undefined</td></tr></tbody></table>';
        expect(convert(html)).toBe('| Name | Type |\n| --- | --- |\n| `size` | string \\| undefined |');
    });

    test('skips interactive controls and hidden content', () => {
        const html =
            '<p>Before</p><button type="button">Copy</button><form><select><option>a</option></select></form><span class="visually-hidden">hidden</span><i class="bi" aria-hidden="true"></i><p>After</p>';
        expect(convert(html)).toBe('Before\n\nAfter');
    });

    test('skips elements matching the configured selectors', () => {
        const html = '<section id="playground"><h2>Playground</h2><p>Experiment</p></section><section><h2>Basic</h2></section>';
        expect(convert(html, { skip: ['#playground'] })).toBe('## Basic');
    });

    test('converts horizontal rules, line breaks, blockquotes and images', () => {
        expect(convert('<p>a<br>b</p><hr><blockquote><p>quoted</p></blockquote><img src="/x.png" alt="An image">')).toBe(
            'a\nb\n\n---\n\n> quoted\n\n![An image](https://example.test/x.png)'
        );
    });

    test('renders a block made only of links as a list', () => {
        expect(convert('<div class="grid"><a href="/a"><span>A</span><i class="bi" aria-hidden="true"></i></a><a href="/b">B</a></div>')).toBe(
            '- [A](https://example.test/a)\n- [B](https://example.test/b)'
        );
    });

    test('skips elements opted out with data-markdown="skip"', () => {
        expect(convert('<p>Keep</p><div data-markdown="skip"><p>Drop</p></div>')).toBe('Keep');
    });

    test('collapses whitespace and never emits more than one blank line', () => {
        expect(convert('<div>\n  <p>  spaced   text </p>\n\n\n<div></div><p>next</p></div>')).toBe('spaced text\n\nnext');
    });
});

describe('extractLead', () => {
    test('returns the normalized text of the first lead paragraph', () => {
        const dom = new JSDOM('<main><h1>Button</h1><p class="lead">Bootstrap\'s\n   button.</p><p class="lead">Second</p></main>');
        expect(extractLead(dom.window.document.body)).toBe("Bootstrap's button.");
    });

    test('returns an empty string when there is no lead paragraph', () => {
        const dom = new JSDOM('<main><h1>Button</h1><p>Plain</p></main>');
        expect(extractLead(dom.window.document.body)).toBe('');
    });
});

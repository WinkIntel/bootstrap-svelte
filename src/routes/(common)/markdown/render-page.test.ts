import { describe, expect, test } from 'vitest';
import { renderPageMarkdown } from './render-page.js';

// Rendering a page compiles it and every library component through Vite the first time a worker touches it,
// which takes well over Vitest's 5 s default on CI runners.
const PAGE_RENDER_TIMEOUT = 60_000;

describe('renderPageMarkdown', { timeout: PAGE_RENDER_TIMEOUT }, () => {
    test('renders a component page as Markdown headed by the page title and lead', async () => {
        const page = await renderPageMarkdown('/components/button');
        expect(page.title).toBe('Button');
        expect(page.lead).toMatch(/^Bootstrap's button component built with Svelte 5\./);
        expect(page.markdown.startsWith("# Button\n\n> Bootstrap's button component built with Svelte 5.")).toBe(true);
    });

    test('keeps headings, code samples, and API tables', async () => {
        const page = await renderPageMarkdown('/components/button');
        expect(page.markdown).toContain('## Basic Example');
        expect(page.markdown).toContain('```html\n<Button>Base button</Button>\n```');
        expect(page.markdown).toContain('## API Reference');
        expect(page.markdown).toContain('| `colorVariant` |');
    });

    test('omits the interactive playground and code-copy controls', async () => {
        const page = await renderPageMarkdown('/components/button');
        expect(page.markdown).not.toContain('## Playground');
        expect(page.markdown).not.toContain('Experiment with the Button component');
        expect(page.markdown).not.toContain('Copy');
    });

    test('omits playground sections that are identified by their heading', async () => {
        const page = await renderPageMarkdown('/components/modal');
        expect(page.markdown).not.toContain('Interactive Playground');
        expect(page.markdown).not.toContain('Event Log');
        expect(page.markdown).toContain('```html');
    });

    test('omits live demo wrappers inside example cards but keeps their prose and code', async () => {
        const page = await renderPageMarkdown('/form/form-controls');
        expect(page.markdown).not.toMatch(/^Output:/m);
        expect(page.markdown).not.toContain('Bounded checked value\n');
        expect(page.markdown).toContain('## Checkbox Input');
        expect(page.markdown).toContain('<Form.CheckInput');
    });

    test('renders inline code inside the lead blockquote as Markdown', async () => {
        const page = await renderPageMarkdown('/form/form-controls');
        expect(page.markdown).toContain('> Give textual form controls like `<input>`s and `<textarea>`s');
    });

    test('links back to the canonical HTML page and the documentation index', async () => {
        const page = await renderPageMarkdown('/components/button');
        expect(page.markdown).toContain('https://bootstrap-svelte.vercel.app/components/button');
        expect(page.markdown).toContain('https://bootstrap-svelte.vercel.app/llms.txt');
    });

    test('renders the home page without a lead blockquote', async () => {
        const page = await renderPageMarkdown('/');
        expect(page.title).toBe('Bootstrap components, rebuilt for Svelte.');
        expect(page.lead).toBe('');
        expect(page.markdown).not.toContain('\n> ');
        expect(page.markdown).toContain('## Installation');
        expect(page.markdown).toContain('- [Button](https://bootstrap-svelte.vercel.app/components/button)');
        expect(page.markdown).not.toContain('+page.svelte');
        expect(page.markdown).not.toContain('documented routes');
    });

    test('rejects paths that are not site pages', async () => {
        await expect(renderPageMarkdown('/does-not-exist')).rejects.toThrow(/unknown page/i);
    });
});

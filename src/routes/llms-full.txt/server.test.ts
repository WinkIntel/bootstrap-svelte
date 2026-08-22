import { describe, expect, test } from 'vitest';
import { GET, prerender } from './+server.js';

// Rendering a page compiles it and every library component through Vite the first time a worker touches it,
// which takes well over Vitest's 5 s default on CI runners.
const PAGE_RENDER_TIMEOUT = 60_000;

describe('llms-full.txt endpoint', { timeout: PAGE_RENDER_TIMEOUT }, () => {
    test('is prerendered', () => {
        expect(prerender).toBe(true);
    });

    test('serves every page in one plain-text Markdown document', async () => {
        const response = await GET({} as unknown as Parameters<typeof GET>[0]);
        const text = await response.text();
        expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
        expect(text.startsWith('# Bootstrap Svelte — full documentation\n')).toBe(true);
        expect(text).toContain('\n# Button\n');
        expect(text).toContain('\n# Theming\n');
        expect(text).toContain('\n# About Bootstrap Svelte\n');
    });
});

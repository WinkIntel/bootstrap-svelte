import { describe, expect, test } from 'vitest';
import { GET, prerender } from './+server.js';

// Rendering a page compiles it and every library component through Vite the first time a worker touches it,
// which takes well over Vitest's 5 s default on CI runners.
const PAGE_RENDER_TIMEOUT = 60_000;

describe('llms.txt endpoint', { timeout: PAGE_RENDER_TIMEOUT }, () => {
    test('is prerendered', () => {
        expect(prerender).toBe(true);
    });

    test('serves the llms.txt index as plain text with real page leads', async () => {
        const response = await GET({} as unknown as Parameters<typeof GET>[0]);
        const text = await response.text();
        expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
        expect(text.startsWith('# Bootstrap Svelte\n')).toBe(true);
        expect(text).toContain(
            "- [Button](https://bootstrap-svelte.vercel.app/components/button.md): Bootstrap's button component built with Svelte 5."
        );
    });
});

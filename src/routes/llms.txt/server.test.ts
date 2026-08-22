import { describe, expect, test } from 'vitest';
import { GET, prerender } from './+server.js';

describe('llms.txt endpoint', () => {
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

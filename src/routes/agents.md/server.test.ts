import { describe, expect, test } from 'vitest';
import { GET, prerender } from './+server.js';

describe('agents.md endpoint', () => {
    test('is prerendered', () => {
        expect(prerender).toBe(true);
    });

    test('serves agent instructions as Markdown', async () => {
        const response = await GET({} as unknown as Parameters<typeof GET>[0]);
        expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
        expect((await response.text()).startsWith('# Bootstrap Svelte — agent instructions\n')).toBe(true);
    });
});

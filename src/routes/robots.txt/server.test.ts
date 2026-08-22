import { describe, expect, test } from 'vitest';
import { GET, prerender } from './+server.js';

describe('robots.txt endpoint', () => {
    test('is prerendered', () => {
        expect(prerender).toBe(true);
    });

    test('serves robots.txt as plain text with the sitemap location', async () => {
        const response = await GET({} as unknown as Parameters<typeof GET>[0]);
        expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
        expect(await response.text()).toContain('Sitemap: https://bootstrap-svelte.vercel.app/sitemap.xml');
    });
});

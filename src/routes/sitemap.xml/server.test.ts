import { describe, expect, test } from 'vitest';
import { absoluteUrl, sitePages } from '../(common)/site.js';
import { GET, prerender } from './+server.js';

describe('sitemap.xml endpoint', () => {
    test('is prerendered', () => {
        expect(prerender).toBe(true);
    });

    test('lists every indexable page with a lastmod date and excludes the 404 page', async () => {
        const response = await GET({} as unknown as Parameters<typeof GET>[0]);
        const xml = await response.text();
        expect(response.headers.get('content-type')).toBe('application/xml; charset=utf-8');
        for (const page of sitePages()) {
            expect(xml).toContain(`<loc>${absoluteUrl(page.href)}</loc>`);
        }
        expect(xml).not.toContain('/404</loc>');
        expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z<\/lastmod>/);
    });
});

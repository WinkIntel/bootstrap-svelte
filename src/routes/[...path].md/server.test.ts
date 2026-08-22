import { describe, expect, test } from 'vitest';
import { sitePages } from '../(common)/site.js';
import { entries, GET, prerender } from './+server.js';

// Rendering a page compiles it and every library component through Vite the first time a worker touches it,
// which takes well over Vitest's 5 s default on CI runners.
const PAGE_RENDER_TIMEOUT = 60_000;

function event(path: string): Parameters<typeof GET>[0] {
    return { params: { path } } as unknown as Parameters<typeof GET>[0];
}

describe('[...path].md endpoint', { timeout: PAGE_RENDER_TIMEOUT }, () => {
    test('is prerendered', () => {
        expect(prerender).toBe(true);
    });

    test('enumerates a Markdown sibling for every site page plus the 404 page', async () => {
        const paths = (await entries()).map((entry) => entry.path);
        expect(paths).toContain('index');
        for (const page of sitePages().filter((page) => page.href !== '/')) {
            expect(paths).toContain(page.href.slice(1));
        }
        expect(paths).toContain('404');
        expect(paths).not.toContain('');
    });

    test('serves a page as text/markdown', async () => {
        const response = await GET(event('components/button'));
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
        expect(await response.text()).toMatch(/^# Button\n/);
    });

    test('serves the home page from index', async () => {
        const response = await GET(event('index'));
        expect(await response.text()).toContain('Source: https://bootstrap-svelte.vercel.app/ ');
    });

    test('serves the 404 page body with a success status so it can be prerendered', async () => {
        const response = await GET(event('404'));
        expect(response.status).toBe(200);
        expect(await response.text()).toContain('llms.txt');
    });

    test('responds 404 for paths that are not pages', async () => {
        await expect(GET(event('does-not-exist'))).rejects.toMatchObject({ status: 404 });
    });
});

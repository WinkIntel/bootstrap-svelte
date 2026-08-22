import { describe, expect, test } from 'vitest';
import routeJson from './routes.json' with { type: 'json' };
import { absoluteUrl, getPageMeta, markdownPath, site, sitePages } from './site.js';
import type { RouteType } from './types.js';

const routes = routeJson as RouteType[];
const navHrefs = routes.flatMap((section) => section.items.map((item) => item.href));

describe('site metadata', () => {
    test('site.url is the canonical origin without a trailing slash', () => {
        expect(site.url).toBe('https://bootstrap-svelte.vercel.app');
    });

    test('absoluteUrl joins a path onto the canonical origin', () => {
        expect(absoluteUrl('/')).toBe('https://bootstrap-svelte.vercel.app/');
        expect(absoluteUrl('/components/button')).toBe('https://bootstrap-svelte.vercel.app/components/button');
    });

    test('markdownPath maps the home page to /index.md and other pages to a .md sibling', () => {
        expect(markdownPath('/')).toBe('/index.md');
        expect(markdownPath('/components/button')).toBe('/components/button.md');
    });
});

describe('sitePages', () => {
    test('starts with the home page and includes every navigation route', () => {
        const hrefs = sitePages().map((page) => page.href);
        expect(hrefs[0]).toBe('/');
        for (const href of navHrefs) {
            expect(hrefs).toContain(href);
        }
    });

    test('includes the trust pages and excludes the 404 page', () => {
        const hrefs = sitePages().map((page) => page.href);
        expect(hrefs).toEqual(expect.arrayContaining(['/about', '/contact', '/privacy']));
        expect(hrefs).not.toContain('/404');
    });

    test('has no duplicate hrefs', () => {
        const hrefs = sitePages().map((page) => page.href);
        expect(new Set(hrefs).size).toBe(hrefs.length);
    });

    test('gives every page a label and a section', () => {
        for (const page of sitePages()) {
            expect(page.label.length).toBeGreaterThan(0);
            expect(page.section.length).toBeGreaterThan(0);
        }
    });
});

describe('getPageMeta', () => {
    test('the home page title leads with the product name', () => {
        const meta = getPageMeta('/');
        expect(meta.title).toBe('Bootstrap Svelte | Bootstrap 5 components for Svelte 5');
        expect(meta.label).toBe('Overview');
        expect(meta.section).toBe('Home');
        expect(meta.description).toBe(site.description);
        expect(meta.noindex).toBe(false);
    });

    test('navigation pages keep the "<Label> | Bootstrap Svelte" title', () => {
        const meta = getPageMeta('/components/button');
        expect(meta.title).toBe('Button | Bootstrap Svelte');
        expect(meta.label).toBe('Button');
        expect(meta.section).toBe('Components');
    });

    test('trust pages carry their own description', () => {
        const meta = getPageMeta('/about');
        expect(meta.title).toBe('About | Bootstrap Svelte');
        expect(meta.section).toBe('Project');
        expect(meta.description).not.toBe(site.description);
        expect(meta.description.length).toBeGreaterThan(40);
    });

    test('the 404 page is titled and marked noindex', () => {
        const meta = getPageMeta('/404');
        expect(meta.title).toBe('Page not found | Bootstrap Svelte');
        expect(meta.noindex).toBe(true);
    });

    test('unknown paths fall back to the site name and a generic section', () => {
        const meta = getPageMeta('/does-not-exist');
        expect(meta.label).toBe('Bootstrap Svelte');
        expect(meta.section).toBe('Documentation');
        expect(meta.title).toBe('Bootstrap Svelte');
    });
});

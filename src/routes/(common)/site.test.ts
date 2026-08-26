import { describe, expect, test } from 'vitest';
import routeJson from './routes.json' with { type: 'json' };
import { absoluteUrl, getBreadcrumbs, getPageMeta, markdownPath, notFoundPage, site, sitePages } from './site.js';
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

    test('includes both high-intent guides as indexable pages', () => {
        expect(sitePages().map((page) => page.href)).toEqual(
            expect.arrayContaining(['/guides/sveltekit-bootstrap-5', '/guides/compare-sveltestrap'])
        );
        expect(getPageMeta('/guides/compare-sveltestrap').noindex).toBe(false);
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
        expect(meta.title).toBe('Bootstrap 5 components for Svelte 5 | Bootstrap Svelte');
        expect(meta.label).toBe('Overview');
        expect(meta.section).toBe('Home');
        expect(meta.description).toBe(site.description);
        expect(meta.noindex).toBe(false);
    });

    test('navigation pages use query-aligned titles', () => {
        const meta = getPageMeta('/components/button');
        expect(meta.title).toBe('Svelte 5 Button Component - Bootstrap 5 | Bootstrap Svelte');
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

    test('describes unknown paths as the 404 page so hydrated 404 responses keep their metadata', () => {
        const meta = getPageMeta('/does-not-exist');
        expect(meta.title).toBe('Page not found | Bootstrap Svelte');
        expect(meta.label).toBe('Page not found');
        expect(meta.section).toBe('Project');
        expect(meta.noindex).toBe(true);
    });

    test('ignores a trailing slash when resolving page metadata', () => {
        expect(getPageMeta('/about/').title).toBe('About | Bootstrap Svelte');
        expect(getPageMeta('/components/button/').label).toBe('Button');
    });
});

describe('page registry', () => {
    test('registers every +page.svelte under src/routes', () => {
        const registered = new Set([...sitePages(), notFoundPage].map((page) => page.href));
        for (const module of Object.keys(import.meta.glob('/src/routes/**/+page.svelte'))) {
            const href = module.replace('/src/routes', '').replace(/\/\+page\.svelte$/, '') || '/';
            expect(registered.has(href), `${href} is not registered in site.ts`).toBe(true);
        }
    });
});

describe('search metadata', () => {
    test('every indexable page has a unique title and meta description', () => {
        const titles = sitePages().map((page) => getPageMeta(page.href).title);
        const descriptions = sitePages().map((page) => getPageMeta(page.href).description);
        expect(new Set(titles).size).toBe(titles.length);
        expect(new Set(descriptions).size).toBe(descriptions.length);
    });

    test('non-home indexable pages expose home and current-page breadcrumbs', () => {
        expect(getBreadcrumbs('/')).toEqual([]);
        expect(getBreadcrumbs('/components/button')).toEqual([
            { label: 'Bootstrap Svelte', href: '/' },
            { label: 'Button', href: '/components/button' }
        ]);
    });
});

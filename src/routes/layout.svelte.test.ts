/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Layout from './+layout.svelte';

const state = vi.hoisted(() => ({ pathname: '/components/button' }));

vi.mock('$app/state', () => ({
    page: {
        get url() {
            return new URL(`https://bootstrap-svelte.vercel.app${state.pathname}`);
        }
    }
}));

function renderLayout(pathname: string) {
    state.pathname = pathname;
    const result = render(Layout, {
        props: { children: createRawSnippet(() => ({ render: () => '<p>Page content</p>' })) }
    });
    // The layout scans for headings on a short timer after navigation; run it now so nothing outlives the test.
    vi.runAllTimers();
    return result;
}

function headAttribute(selector: string, attribute: string): string | null {
    return document.head.querySelector(selector)?.getAttribute(attribute) ?? null;
}

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    // A timer that outlives the test would fire after the jsdom document is torn down and fail the run.
    const pendingTimers = vi.getTimerCount();
    vi.useRealTimers();
    document.head.innerHTML = '';
    expect(pendingTimers).toBe(0);
});

describe('+layout.svelte head metadata', () => {
    test('sets the page title, canonical URL, and Markdown alternate for a docs page', () => {
        renderLayout('/components/button');
        expect(document.title).toBe('Button | Bootstrap Svelte');
        expect(headAttribute('link[rel="canonical"]', 'href')).toBe('https://bootstrap-svelte.vercel.app/components/button');
        expect(headAttribute('link[rel="alternate"][type="text/markdown"]', 'href')).toBe('https://bootstrap-svelte.vercel.app/components/button.md');
    });

    test('emits Open Graph, Twitter, and JSON-LD metadata on the home page', () => {
        renderLayout('/');
        expect(document.title).toBe('Bootstrap Svelte | Bootstrap 5 components for Svelte 5');
        expect(headAttribute('meta[property="og:type"]', 'content')).toBe('website');
        expect(headAttribute('meta[property="og:image"]', 'content')).toBe('https://bootstrap-svelte.vercel.app/og-image.png');
        expect(headAttribute('meta[property="og:url"]', 'content')).toBe('https://bootstrap-svelte.vercel.app/');
        expect(headAttribute('meta[property="og:site_name"]', 'content')).toBe('Bootstrap Svelte');
        expect(headAttribute('meta[name="twitter:card"]', 'content')).toBe('summary_large_image');

        const script = document.head.querySelector('script[type="application/ld+json"]');
        const graph = JSON.parse(script?.textContent ?? '{}') as { '@graph': { '@type': string }[] };
        expect(graph['@graph'].map((node) => node['@type'])).toEqual(expect.arrayContaining(['WebSite', 'SoftwareApplication', 'Organization']));
    });

    test('marks the 404 page noindex', () => {
        renderLayout('/404');
        expect(document.title).toBe('Page not found | Bootstrap Svelte');
        expect(headAttribute('meta[name="robots"]', 'content')).toBe('noindex, nofollow');
        expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    });
});

describe('+layout.svelte chrome', () => {
    test('shows the section and label of project pages in the breadcrumbs', () => {
        const { container } = renderLayout('/about');
        expect(container.querySelector('.wk-eyebrow')).toHaveTextContent('Project');
        expect(container.querySelector('.wk-current-page')).toHaveTextContent('About');
    });

    test('renders a footer with trust, source, and machine-readable links', () => {
        const { container } = renderLayout('/');
        const footer = container.querySelector('footer');
        expect(footer).toBeInTheDocument();
        for (const href of ['/about', '/contact', '/privacy', '/llms.txt', '/sitemap.xml', 'https://github.com/WinkIntel/bootstrap-svelte']) {
            expect(footer?.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
        }
        expect(footer).toHaveTextContent('Wink, Inc.');
    });
});

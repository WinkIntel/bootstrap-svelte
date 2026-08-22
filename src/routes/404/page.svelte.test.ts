/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import routeJson from '../(common)/routes.json' with { type: 'json' };
import type { RouteType } from '../(common)/types.js';
import Page from './+page.svelte';

describe('/404/+page.svelte', () => {
    test('explains that the page does not exist', () => {
        const { container } = render(Page);
        expect(container.querySelector('h1')).toHaveTextContent('Page not found');
        expect(container.textContent).toContain('404');
    });

    test('points agents at the overview, the documentation index, and the sitemap', () => {
        const { container } = render(Page);
        expect(container.querySelector('a[href="/"]')).toBeInTheDocument();
        expect(container.querySelector('a[href="/llms.txt"]')).toBeInTheDocument();
        expect(container.querySelector('a[href="/llms-full.txt"]')).toBeInTheDocument();
        expect(container.querySelector('a[href="/sitemap.xml"]')).toBeInTheDocument();
    });

    test('links to every documentation route', () => {
        const { container } = render(Page);
        for (const section of routeJson as RouteType[]) {
            for (const item of section.items) {
                expect(container.querySelector(`a[href="${item.href}"]`)).toBeInTheDocument();
            }
        }
    });
});

/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import routeJson from './(common)/routes.json' with { type: 'json' };
import type { RouteType } from './(common)/types.js';
import Page from './+page.svelte';

const routes = routeJson as RouteType[];

describe('/+page.svelte', () => {
    test('links the primary component action to the first component alphabetically', () => {
        render(Page);

        const components = routes.find((section) => section.section === 'Components');
        const firstComponent = [...(components?.items ?? [])].sort((left, right) => left.label.localeCompare(right.label))[0];
        expect(firstComponent?.label).toBe('Accordion');
        expect(screen.getByRole('link', { name: /Browse components/ })).toHaveAttribute('href', firstComponent?.href);
    });

    test('reports the number of documented components', () => {
        render(Page);

        const components = routes.find((section) => section.section === 'Components');
        const label = screen.getByText('documented components');
        expect(components).toBeDefined();
        expect(label.previousElementSibling).toHaveTextContent(String(components?.items.length));
    });

    test('marks the install command as bash', () => {
        const { container } = render(Page);

        const installHeading = screen.getByRole('heading', { name: /^1 Install$/ });
        const installPanel = installHeading.parentElement;
        expect(installPanel?.querySelector('.wk-code-lang')).toHaveTextContent('bash');
        expect(installPanel?.querySelector('pre')).toHaveAttribute('data-language', 'bash');
        expect(container).toHaveTextContent('pnpm add @winkintel/bootstrap-svelte bootstrap');
    });
});

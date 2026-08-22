/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { site } from '../(common)/site.js';
import Page from './+page.svelte';

function text(container: HTMLElement): string {
    return (container.textContent ?? '').replace(/\s+/g, ' ').trim();
}

describe('/about/+page.svelte', () => {
    test('renders a heading and at least 500 characters of content', () => {
        const { container } = render(Page);
        expect(container.querySelector('h1')).toHaveTextContent('About Bootstrap Svelte');
        expect(text(container).length).toBeGreaterThanOrEqual(500);
    });

    test('names the maintainer, license, and current version', () => {
        const { container } = render(Page);
        expect(text(container)).toContain(site.organization.name);
        expect(text(container)).toContain('Apache License 2.0');
        expect(text(container)).toContain(site.version);
    });

    test('links to the repository, the npm package, and the machine-readable documentation', () => {
        const { container } = render(Page);
        expect(container.querySelector(`a[href="${site.repositoryUrl}"]`)).toBeInTheDocument();
        expect(container.querySelector(`a[href="${site.npmUrl}"]`)).toBeInTheDocument();
        expect(container.querySelector('a[href="/llms.txt"]')).toBeInTheDocument();
    });
});

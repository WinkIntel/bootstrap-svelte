/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { site } from '../(common)/site.js';
import Page from './+page.svelte';

function text(container: HTMLElement): string {
    return (container.textContent ?? '').replace(/\s+/g, ' ').trim();
}

describe('/contact/+page.svelte', () => {
    test('renders a heading and at least 500 characters of content', () => {
        const { container } = render(Page);
        expect(container.querySelector('h1')).toHaveTextContent('Contact');
        expect(text(container).length).toBeGreaterThanOrEqual(500);
    });

    test('links to the issue tracker and the security policy', () => {
        const { container } = render(Page);
        expect(container.querySelector(`a[href="${site.issuesUrl}"]`)).toBeInTheDocument();
        expect(container.querySelector(`a[href="${site.securityPolicyUrl}"]`)).toBeInTheDocument();
    });

    test('lists the organization with its website, phone number, and postal address', () => {
        const { container } = render(Page);
        expect(container.querySelector(`a[href="${site.organization.url}"]`)).toBeInTheDocument();
        expect(container.querySelector(`a[href="tel:${site.organization.telephone}"]`)).toBeInTheDocument();
        expect(text(container)).toContain(site.organization.address.streetAddress);
        expect(text(container)).toContain('Des Moines, IA 50312');
    });
});

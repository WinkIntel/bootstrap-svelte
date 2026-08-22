/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

function text(container: HTMLElement): string {
    return (container.textContent ?? '').replace(/\s+/g, ' ').trim();
}

describe('/privacy/+page.svelte', () => {
    test('renders a heading and at least 500 characters of content', () => {
        const { container } = render(Page);
        expect(container.querySelector('h1')).toHaveTextContent('Privacy');
        expect(text(container).length).toBeGreaterThanOrEqual(500);
    });

    test('discloses hosting, third-party resources, and local storage use', () => {
        const { container } = render(Page);
        expect(text(container)).toContain('Vercel');
        expect(text(container)).toContain('jsDelivr');
        expect(text(container)).toContain('Google Fonts');
        expect(text(container)).toContain('wk-color-mode');
        expect(text(container)).toMatch(/does not set cookies/i);
    });

    test('links to the hosting provider privacy policy', () => {
        const { container } = render(Page);
        expect(container.querySelector('a[href="https://vercel.com/legal/privacy-policy"]')).toBeInTheDocument();
    });
});

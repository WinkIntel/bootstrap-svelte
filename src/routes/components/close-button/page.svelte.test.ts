/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('/components/close-button/+page.svelte', () => {
    // Basic example tests
    test('should render base close button', () => {
        const { container } = render(Page);
        const closeButton = container.querySelector('#baseCloseButton');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveClass('btn-close');
        expect(closeButton).not.toHaveAttribute('disabled');
    });

    // Dark mode tests
    describe('Dark variant', () => {
        test('should render dark mode close button', () => {
            const { container } = render(Page);
            const closeButton = container.querySelector('#darkModeCloseButton');
            expect(closeButton).toBeInTheDocument();
            expect(closeButton).toHaveClass('btn-close');
        });

        test('should render dark mode disabled close button', () => {
            const { container } = render(Page);
            const closeButton = container.querySelector('#darkModeDisabledCloseButton');
            expect(closeButton).toBeInTheDocument();
            expect(closeButton).toHaveClass('btn-close');
            expect(closeButton).toHaveAttribute('disabled');
        });
    });

    // Disabled state tests
    describe('Disabled state', () => {
        test('should render disabled close button', () => {
            const { container } = render(Page);
            const closeButton = container.querySelector('#disabledCloseButton');
            expect(closeButton).toBeInTheDocument();
            expect(closeButton).toHaveClass('btn-close');
            expect(closeButton).toHaveAttribute('disabled');
        });
    });

    // Accessibility tests
    describe('Accessibility', () => {
        test('should render close button with custom aria-label', () => {
            const { container } = render(Page);
            const closeButton = container.querySelector('#ariaLabelCloseButton');
            expect(closeButton).toBeInTheDocument();
            expect(closeButton).toHaveClass('btn-close');
            expect(closeButton).toHaveAttribute('aria-label', 'Dismiss notification');
        });
    });

    // API Reference section should be present
    test('should render API reference section', () => {
        const { container } = render(Page);
        const apiSection = container.querySelector('#api');
        expect(apiSection).toBeInTheDocument();
    });
});

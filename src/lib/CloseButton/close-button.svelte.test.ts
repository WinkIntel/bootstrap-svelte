/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import CloseButton from './close-button.svelte';

describe('CloseButton.svelte', () => {
    test('should render', () => {
        const results = render(CloseButton);
        expect(() => results.getByRole('button')).not.toThrow();
    });

    test('renders a close button with default properties', () => {
        render(CloseButton);
        const button = screen.getByRole('button');

        // Check essential properties
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveAttribute('aria-label', 'Close');

        // Check it has the base class
        expect(button).toHaveClass('btn-close');

        // Check it's not disabled
        expect(button).not.toBeDisabled();

        // Check it doesn't have size or white classes
        expect(button).not.toHaveClass('btn-close-sm');
        expect(button).not.toHaveClass('btn-close-lg');
        expect(button).not.toHaveClass('btn-close-white');
    });

    // Test for disabled state
    test('renders in disabled state', () => {
        render(CloseButton, { props: { disabled: true } });

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    // Test for custom aria-label
    test('renders with custom aria-label', () => {
        render(CloseButton, { props: { ariaLabel: 'Dismiss notification' } });

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Dismiss notification');
    });

    // Test for custom class
    test('accepts and applies custom classes', () => {
        render(CloseButton, {
            props: {
                class: 'custom-class another-class'
            }
        });

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-close');
        expect(button).toHaveClass('custom-class');
        expect(button).toHaveClass('another-class');
    });

    // Test for multiple props combined
    test('combines multiple props correctly', () => {
        render(CloseButton, {
            props: {
                disabled: true,
                class: 'test-class',
                ariaLabel: 'Custom Close'
            }
        });

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-close');
        expect(button).toHaveClass('test-class');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-label', 'Custom Close');
    });
});

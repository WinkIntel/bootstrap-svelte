/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Spinner from './spinner.svelte';

describe('Spinner.svelte', () => {
    test('should render', () => {
        const results = render(Spinner);
        expect(() => results.getByRole('status')).not.toThrow();
    });

    test('renders a spinner with default properties', () => {
        render(Spinner);
        const spinner = screen.getByRole('status');

        // Check essential properties
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('spinner-border');

        // Check it doesn't have any variant classes
        const variantClasses = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
        variantClasses.forEach((variant) => {
            expect(spinner).not.toHaveClass(`text-${variant}`);
        });

        // Check size class isn't present
        expect(spinner).not.toHaveClass('spinner-border-sm');
    });

    // Test for different spinner type
    test('renders with grow type', () => {
        render(Spinner, { props: { type: 'grow' } });

        const spinner = screen.getByRole('status');
        expect(spinner).toHaveClass('spinner-grow');
        expect(spinner).not.toHaveClass('spinner-border');
    });

    // Test for variant
    test('renders with primary variant', () => {
        render(Spinner, { props: { colorVariant: 'primary' } });

        const spinner = screen.getByRole('status');
        expect(spinner).toHaveClass('spinner-border');
        expect(spinner).toHaveClass('text-primary');
    });

    // Test for size
    test('renders with small size', () => {
        render(Spinner, { props: { size: 'sm' } });

        const spinner = screen.getByRole('status');
        expect(spinner).toHaveClass('spinner-border');
        expect(spinner).toHaveClass('spinner-border-sm');
    });

    // Test for multiple props combined
    test('combines multiple props correctly', () => {
        render(Spinner, {
            props: {
                type: 'grow',
                colorVariant: 'success',
                size: 'sm',
                class: 'custom-class'
            }
        });

        const spinner = screen.getByRole('status');
        expect(spinner).toHaveClass('spinner-grow');
        expect(spinner).toHaveClass('spinner-grow-sm');
        expect(spinner).toHaveClass('text-success');
        expect(spinner).toHaveClass('custom-class');
    });

    // Test for custom ID
    test('renders with custom ID', () => {
        render(Spinner, { props: { id: 'custom-spinner' } });

        const spinner = screen.getByRole('status');
        expect(spinner).toHaveAttribute('id', 'custom-spinner');
    });

    // Test for custom class
    test('accepts and applies custom classes', () => {
        render(Spinner, {
            props: {
                class: 'custom-class another-class'
            }
        });

        const spinner = screen.getByRole('status');
        expect(spinner).toHaveClass('spinner-border');
        expect(spinner).toHaveClass('custom-class');
        expect(spinner).toHaveClass('another-class');
    });
});

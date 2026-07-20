/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import Button from './button.svelte';
import type { ButtonRootProps } from './types.js';

const renderButtonWithText = (text: string, props: ButtonRootProps = {}) => {
    return render(Button, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => text
            }))
        }
    });
};

describe('Button.svelte', () => {
    test('renders a button with default properties', () => {
        renderButtonWithText('Click me');
        const button = screen.getByRole('button');

        // Check essential properties
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Click me');
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveAttribute('tabindex', '0');

        // Check it has the base class
        expect(button).toHaveClass('btn');

        // Check it doesn't have any variant classes (using a more concise approach)
        const variantClasses = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'];

        // Check both regular and outline variants aren't present
        variantClasses.forEach((variant) => {
            expect(button).not.toHaveClass(`btn-${variant}`);
            expect(button).not.toHaveClass(`btn-outline-${variant}`);
        });

        // Check size classes aren't present
        ['sm', 'lg'].forEach((size) => {
            expect(button).not.toHaveClass(`btn-${size}`);
        });

        // Check it's not disabled
        expect(button).not.toBeDisabled();
    });

    // Test for specific variant
    test('renders with primary variant', () => {
        renderButtonWithText('Primary Button', { colorVariant: 'primary' });

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn');
        expect(button).toHaveClass('btn-primary');
        expect(button).toHaveTextContent('Primary Button');
    });

    // Test for outline variant
    test('renders with outline variant', () => {
        renderButtonWithText('Outline Button', { colorVariant: 'outline-secondary' });

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn');
        expect(button).toHaveClass('btn-outline-secondary');
        expect(button).toHaveTextContent('Outline Button');
    });

    // Test for size
    test('renders with different sizes', () => {
        renderButtonWithText('Small Button', { size: 'sm' });
        let button = screen.getByText('Small Button');
        expect(button).toHaveClass('btn-sm');

        // Rerender with large size
        renderButtonWithText('Large Button', { size: 'lg' });
        button = screen.getByText('Large Button');
        expect(button).toHaveClass('btn-lg');
    });

    // Test for disabled state
    test('renders in disabled state', () => {
        renderButtonWithText('Disabled Button', { disabled: true });

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent('Disabled Button');
    });

    // Test for anchor element
    test('renders as anchor element when href is provided', () => {
        const href = 'https://example.com';
        renderButtonWithText('Link Button', { href });

        const button = screen.getByRole('button');
        expect(button.tagName).toBe('A');
        expect(button).toHaveClass('btn');
        expect(button).toHaveAttribute('aria-disabled', 'false');
        expect(button).toHaveAttribute('href', href);
        expect(button).toHaveAttribute('role', 'button');
        expect(button).toHaveAttribute('tabindex', '0');
        expect(button).toHaveTextContent('Link Button');
    });

    // Test for disabled anchor
    test('renders as disabled anchor correctly', () => {
        renderButtonWithText('Disabled Link', {
            href: 'https://example.com',
            disabled: true
        });

        const button = screen.getByRole('button');
        expect(button.tagName).toBe('A');
        expect(button).not.toHaveAttribute('href');
        expect(button).toHaveClass('disabled');
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).toHaveAttribute('tabindex', '-1');
    });

    test('keeps disabled anchors inert without invoking their handlers', () => {
        const onclick = vi.fn();
        renderButtonWithText('Disabled Link', { href: '#disabled', disabled: true, onclick, 'aria-disabled': 'false', role: 'link', tabindex: 7 });

        const button = screen.getByRole('button');
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        button.dispatchEvent(event);

        expect(button).not.toHaveAttribute('href');
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).toHaveAttribute('role', 'button');
        expect(button).toHaveAttribute('tabindex', '-1');
        expect(event.defaultPrevented).toBe(true);
        expect(onclick).not.toHaveBeenCalled();
    });

    test('uses native disabled behavior for button actions and preserves enabled handlers', () => {
        const disabledOnclick = vi.fn();
        const enabledOnclick = vi.fn();
        const { unmount } = renderButtonWithText('Disabled Button', { disabled: true, onclick: disabledOnclick });

        const disabledButton = screen.getByRole('button');
        disabledButton.click();
        expect(disabledButton).toBeDisabled();
        expect(disabledOnclick).not.toHaveBeenCalled();

        unmount();
        renderButtonWithText('Enabled Button', { onclick: enabledOnclick });
        screen.getByRole('button').click();
        expect(enabledOnclick).toHaveBeenCalledTimes(1);
    });

    // Test for input element
    test('renders as input element when value is provided', () => {
        render(Button, {
            props: {
                value: 'Submit',
                type: 'submit',
                id: 'submit-input',
                'aria-disabled': 'true',
                role: 'menuitem'
            }
        });

        const input = screen.getByRole('menuitem');
        expect(input.tagName).toBe('INPUT');
        expect(input).toHaveClass('btn');
        expect(input).toHaveAttribute('type', 'submit');
        expect(input).toHaveAttribute('value', 'Submit');
        expect(input).toHaveAttribute('id', 'submit-input');
        expect(input).toHaveAttribute('aria-disabled', 'true');
        expect(input).toHaveAttribute('role', 'menuitem');
    });

    test('selects element type from prop presence and clears stale attributes on rerender', async () => {
        const children = createRawSnippet(() => ({ render: () => 'Polymorphic Button' }));
        const { container, rerender } = render(Button, { props: { children } });

        expect(container.querySelector('[data-testid="polymorphic-button"]')).toBeNull();
        expect(container.querySelector('button')).toHaveAttribute('type', 'button');

        await rerender({ children, href: '' });
        const anchor = container.querySelector('a');
        expect(anchor).toHaveAttribute('href', '');
        expect(anchor).not.toHaveAttribute('type');

        await rerender({ children, href: undefined, value: '' });
        const input = container.querySelector('input');
        expect(input).toHaveValue('');
        expect(input).toHaveAttribute('type', 'button');
        expect(input).not.toHaveAttribute('href');

        await rerender({ children, href: undefined, value: undefined });
        const button = container.querySelector('button');
        expect(button).toHaveAttribute('type', 'button');
        expect(button).not.toHaveAttribute('href');
        expect(button).not.toHaveAttribute('value');
    });

    // Test for custom class
    test('accepts and applies custom classes', () => {
        renderButtonWithText('Custom Button', {
            class: 'custom-class another-class',
            colorVariant: 'success'
        });

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn');
        expect(button).toHaveClass('btn-success');
        expect(button).toHaveClass('custom-class');
        expect(button).toHaveClass('another-class');
    });

    // Test for duplicate classes
    test('handles duplicate classes correctly', () => {
        renderButtonWithText('Duplicate Class Button', {
            class: 'btn btn-primary btn-primary'
        });
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn');
        expect(button).toHaveClass('btn-primary');
        expect(button).toHaveTextContent('Duplicate Class Button');
        expect(button.className.split(' ').length).toBe(2); // Only two unique classes
    });

    // Test for multiple props combined
    test('combines multiple props correctly', () => {
        renderButtonWithText('Complex Button', {
            colorVariant: 'danger',
            size: 'lg',
            disabled: true,
            class: 'test-class'
        });

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn');
        expect(button).toHaveClass('btn-danger');
        expect(button).toHaveClass('btn-lg');
        expect(button).toHaveClass('test-class');
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent('Complex Button');
    });
});

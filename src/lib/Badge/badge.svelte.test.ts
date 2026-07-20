/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import Badge from './badge.svelte';
import BadgeVariantStateTest from './tests/badge-variant-state-test.svelte';
import type { BadgeRootProps } from './types.js';

const renderBadgeWithText = (text: string, props: BadgeRootProps = {}) => {
    return render(Badge, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => text
            }))
        }
    });
};

describe('Badge.svelte', () => {
    test('renders a badge with default properties', () => {
        renderBadgeWithText('Default Badge');
        const badge = screen.getByText('Default Badge');

        // Check essential properties
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('text-bg-primary');
        expect(badge.tagName).toBe('SPAN');
    });

    test('applies explicit variants and caller classes without the default', () => {
        renderBadgeWithText('Explicit Badge', { colorVariant: 'text-bg-success', class: 'text-bg-secondary' });
        const badge = screen.getByText('Explicit Badge');

        expect(badge).toHaveClass('text-bg-success', 'text-bg-secondary');
        expect(badge).not.toHaveClass('text-bg-primary');
    });

    test('does not combine the default with an explicit color variant', () => {
        renderBadgeWithText('Success Badge', { colorVariant: 'text-bg-success' });
        const badge = screen.getByText('Success Badge');

        expect(badge).toHaveClass('text-bg-success');
        expect(badge).not.toHaveClass('text-bg-primary');
    });

    test.each([
        [undefined, undefined, true],
        [null, null, true],
        ['', '', true],
        ['text-bg-success', undefined, false],
        [undefined, 'text-bg-secondary', false]
    ])('normalizes colorVariant=%s and class=%s defaults', (colorVariant, classValue, hasDefault) => {
        renderBadgeWithText('Normalized Badge', {
            colorVariant: colorVariant as never,
            class: classValue as never
        });
        const badge = screen.getByText('Normalized Badge');

        expect(badge.classList.contains('text-bg-primary')).toBe(hasDefault);
    });

    test('reapplies the default only after class and color overrides are cleared', async () => {
        render(BadgeVariantStateTest);
        const badge = screen.getByTestId('stateful-badge');

        expect(badge).toHaveClass('text-bg-primary');
        await screen.getByTestId('set-badge-class').click();
        expect(badge).toHaveClass('text-bg-secondary');
        expect(badge).not.toHaveClass('text-bg-primary');
        await screen.getByTestId('set-badge-variant').click();
        expect(badge).toHaveClass('text-bg-success', 'text-bg-secondary');
        await screen.getByTestId('clear-badge-variant').click();
        expect(badge).not.toHaveClass('text-bg-success', 'text-bg-primary');
        await screen.getByTestId('clear-badge-class').click();
        expect(badge).toHaveClass('text-bg-primary');
    });

    test('ignores malformed positions instead of rendering an undefined class', () => {
        renderBadgeWithText('Malformed Badge', { position: 'unknown' as never });
        const badge = screen.getByText('Malformed Badge');

        expect(badge.className).not.toContain('undefined');
        expect(badge).not.toHaveClass('position-absolute', 'translate-middle');
    });

    // Test for pill style
    test('renders with pill style', () => {
        renderBadgeWithText('Pill Badge', { isPill: true });
        const badge = screen.getByText('Pill Badge');

        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('rounded-pill');
    });

    // Test for position
    test('renders with position', () => {
        renderBadgeWithText('Positioned Badge', { position: 'top-end' });
        const badge = screen.getByText('Positioned Badge');

        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('position-absolute top-0 start-100 translate-middle');
    });

    // Test for custom class
    test('accepts and applies custom classes', () => {
        renderBadgeWithText('Custom Badge', {
            class: 'custom-class another-class',
            colorVariant: 'text-bg-success'
        });

        const badge = screen.getByText('Custom Badge');
        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('text-bg-success');
        expect(badge).toHaveClass('custom-class');
        expect(badge).toHaveClass('another-class');
    });

    // Test for combined props
    test('combines multiple props correctly', () => {
        renderBadgeWithText('Complex Badge', {
            colorVariant: 'text-bg-danger',
            isPill: true,
            class: 'test-class'
        });

        const badge = screen.getByText('Complex Badge');
        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('text-bg-danger');
        expect(badge).toHaveClass('rounded-pill');
        expect(badge).toHaveClass('test-class');
    });
});

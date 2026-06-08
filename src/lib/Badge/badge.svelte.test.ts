/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import Badge from './badge.svelte';
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
    test('should render', () => {
        const results = renderBadgeWithText('Badge');
        const badge = results.getByText('Badge');
        expect(badge).toBeInTheDocument();
    });

    test('renders a badge with default properties', () => {
        renderBadgeWithText('Default Badge');
        const badge = screen.getByText('Default Badge');

        // Check essential properties
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('text-bg-primary');
        expect(badge.tagName).toBe('SPAN');
    });

    // Test for specific variant
    test('renders with primary variant', () => {
        renderBadgeWithText('Primary Badge', { colorVariant: 'text-bg-primary' });
        const badge = screen.getByText('Primary Badge');

        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('text-bg-primary');
    });

    // Test for subtle variants
    test('renders with subtle variant', () => {
        renderBadgeWithText('Subtle Badge', { colorVariant: 'bg-secondary-subtle' });
        const badge = screen.getByText('Subtle Badge');

        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('bg-secondary-subtle');
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

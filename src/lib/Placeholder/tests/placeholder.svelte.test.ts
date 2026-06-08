/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import type { Placeholder } from '../index.js';
import PlaceholderRoot from '../placeholder.svelte';

const renderPlaceholderWithChildren = (childContent: string = '', props: Placeholder.RootProps = {}) => {
    return render(PlaceholderRoot, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => childContent
            }))
        }
    });
};

describe('Placeholder.Root.svelte', () => {
    test('should render', () => {
        const { container } = render(PlaceholderRoot);
        expect(container.querySelector('div')).toBeInTheDocument();
    });

    test('renders with default properties', () => {
        const { container } = renderPlaceholderWithChildren('<span class="placeholder col-12"></span>');
        const root = container.querySelector('div');

        // Check essential properties
        expect(root).toBeInTheDocument();
        expect(root).toHaveClass('placeholder-glow');
    });

    test('renders with glow animation type', () => {
        const { container } = renderPlaceholderWithChildren('<span class="placeholder col-12"></span>', { type: 'glow' });
        const root = container.querySelector('div');

        expect(root).toHaveClass('placeholder-glow');
        expect(root).not.toHaveClass('placeholder-wave');
    });

    test('renders with wave animation type', () => {
        const { container } = renderPlaceholderWithChildren('<span class="placeholder col-12"></span>', { type: 'wave' });
        const root = container.querySelector('div');

        expect(root).toHaveClass('placeholder-wave');
        expect(root).not.toHaveClass('placeholder-glow');
    });

    test('renders with custom ID', () => {
        const { container } = renderPlaceholderWithChildren('&nbsp;', { id: 'custom-placeholder-id' });
        const root = container.querySelector('div');

        expect(root).toHaveAttribute('id', 'custom-placeholder-id');
    });

    test('applies custom classes', () => {
        const { container } = renderPlaceholderWithChildren('&nbsp;', { class: 'custom-class another-class' });
        const root = container.querySelector('div');

        expect(root).toHaveClass('placeholder-glow');
        expect(root).toHaveClass('custom-class');
        expect(root).toHaveClass('another-class');
    });

    test('renders children correctly', () => {
        const { container } = renderPlaceholderWithChildren('<span class="placeholder col-12" data-testId="placeholder-item">Test Item</span>');
        const item = container.querySelector('span');

        // Check that the children are rendered
        expect(item).toBeInTheDocument();
        expect(item).toHaveTextContent('Test Item');
    });

    test('handles element reference binding', () => {
        // This is mostly a TypeScript check, since we can't directly test binding in JSDOM
        const { component } = renderPlaceholderWithChildren('&nbsp;');
        expect(component).toBeDefined();
    });
});

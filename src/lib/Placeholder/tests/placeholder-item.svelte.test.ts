/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import PlaceholderItem from '../placeholder-item.svelte';

describe('Placeholder.Item.svelte', () => {
    test('should render', () => {
        const { container } = render(PlaceholderItem);
        const placeholderItem = container.querySelector('span');
        expect(placeholderItem).toBeInTheDocument();
        expect(placeholderItem).toHaveClass('placeholder');
    });

    test('renders with default properties', () => {
        const { container } = render(PlaceholderItem, {
            props: {
                children: createRawSnippet(() => ({
                    render: () => '&nbsp;'
                }))
            }
        });
        const placeholderItem = container.querySelector('span');

        // Check essential properties
        expect(placeholderItem).toBeInTheDocument();
        expect(placeholderItem).toHaveClass('placeholder');
        expect(placeholderItem).not.toHaveClass('disabled');
    });

    test('renders with custom ID', () => {
        const { container } = render(PlaceholderItem, {
            props: {
                id: 'custom-item-id'
            }
        });
        const placeholderItem = container.querySelector('span');
        expect(placeholderItem).toHaveAttribute('id', 'custom-item-id');
    });

    test('renders with width class', () => {
        const { container } = render(PlaceholderItem, {
            props: {
                class: 'col-6'
            }
        });
        const placeholderItem = container.querySelector('span');
        expect(placeholderItem).toHaveClass('placeholder');
        expect(placeholderItem).toHaveClass('col-6');
    });

    test('renders with size', () => {
        const { container } = render(PlaceholderItem, {
            props: {
                size: 'lg'
            }
        });
        const placeholderItem = container.querySelector('span');
        expect(placeholderItem).toHaveClass('placeholder');
        expect(placeholderItem).toHaveClass('placeholder-lg');
    });

    test('renders with variant', () => {
        const { container } = render(PlaceholderItem, {
            props: {
                colorVariant: 'primary'
            }
        });
        const placeholderItem = container.querySelector('span');
        expect(placeholderItem).toHaveClass('placeholder');
        expect(placeholderItem).toHaveClass('bg-primary');
    });

    test('applies custom classes', () => {
        const { container } = render(PlaceholderItem, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const placeholderItem = container.querySelector('span');
        expect(placeholderItem).toHaveClass('placeholder');
        expect(placeholderItem).toHaveClass('custom-class');
        expect(placeholderItem).toHaveClass('another-class');
    });

    test('combines multiple props correctly', () => {
        render(PlaceholderItem, {
            props: {
                class: 'col-4 test-class',
                size: 'sm',
                colorVariant: 'success',
                'data-testid': 'complex-item'
            }
        });
        const placeholderItem = screen.getByTestId('complex-item');
        expect(placeholderItem).toHaveClass('placeholder');
        expect(placeholderItem).toHaveClass('col-4');
        expect(placeholderItem).toHaveClass('placeholder-sm');
        expect(placeholderItem).toHaveClass('bg-success');
        expect(placeholderItem).toHaveClass('test-class');
    });

    test('handles element reference binding', () => {
        // This is mostly a TypeScript check, since we can't directly test binding in JSDOM
        const { component } = render(PlaceholderItem);
        expect(component).toBeDefined();
    });
});

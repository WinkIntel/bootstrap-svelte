/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import ButtonGroup from './button-group.svelte';
import ButtonGroupBindingTest from './tests/button-group-binding-test.svelte';
import type { ButtonGroupRootProps } from './types.js';

const renderButtonGroupWithChildContent = (childContent: string = '<button/>', props: ButtonGroupRootProps = {}) => {
    return render(ButtonGroup, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => childContent
            }))
        }
    });
};

describe('ButtonGroup.svelte', () => {
    test('renders with default properties', () => {
        renderButtonGroupWithChildContent('<button>Button 1</button><button>Button 2</button>');
        const buttonGroup = screen.getByRole('group');

        // Check essential properties
        expect(buttonGroup).toBeInTheDocument();
        expect(buttonGroup).toHaveClass('btn-group');
        expect(buttonGroup).not.toHaveClass('btn-group-vertical');
        expect(buttonGroup.tagName).toBe('DIV');
        expect(buttonGroup).toHaveAttribute('role', 'group');

        // Check it doesn't have any size classes
        ['sm', 'lg'].forEach((size) => {
            expect(buttonGroup).not.toHaveClass(`btn-group-${size}`);
        });
    });

    test('renders with custom ID', () => {
        renderButtonGroupWithChildContent(undefined, { id: 'custom-group-id' });
        const buttonGroup = screen.getByRole('group');
        expect(buttonGroup).toHaveAttribute('id', 'custom-group-id');
    });

    test('renders with custom aria label', () => {
        renderButtonGroupWithChildContent(undefined, { ariaLabel: 'Custom button group label' });
        const buttonGroup = screen.getByRole('group');
        expect(buttonGroup).toHaveAttribute('aria-label', 'Custom button group label');
    });

    test('renders vertically', () => {
        renderButtonGroupWithChildContent(undefined, { isVertical: true });
        const buttonGroup = screen.getByRole('group');
        expect(buttonGroup).toHaveClass('btn-group-vertical');
        expect(buttonGroup).not.toHaveClass('btn-group');
    });

    test('renders with different sizes', () => {
        // Small size
        renderButtonGroupWithChildContent(undefined, { size: 'sm', 'data-TestId': 'small-group' });
        let buttonGroup = screen.getByTestId('small-group');
        expect(buttonGroup).toHaveClass('btn-group-sm');

        // Re-render with large size
        renderButtonGroupWithChildContent(undefined, { size: 'lg', 'data-TestId': 'large-group' });
        buttonGroup = screen.getByTestId('large-group');
        expect(buttonGroup).toHaveClass('btn-group-lg');
    });

    test('applies custom classes', () => {
        renderButtonGroupWithChildContent(undefined, { class: 'custom-class another-class' });
        const buttonGroup = screen.getByRole('group');
        expect(buttonGroup).toHaveClass('btn-group');
        expect(buttonGroup).toHaveClass('custom-class');
        expect(buttonGroup).toHaveClass('another-class');
    });

    test('combines multiple props correctly', () => {
        renderButtonGroupWithChildContent(undefined, {
            isVertical: true,
            size: 'lg',
            class: 'test-class',
            ariaLabel: 'Complex button group'
        });

        const buttonGroup = screen.getByRole('group');
        expect(buttonGroup).toHaveClass('btn-group-vertical');
        expect(buttonGroup).toHaveClass('btn-group-lg');
        expect(buttonGroup).toHaveClass('test-class');
        expect(buttonGroup).not.toHaveClass('btn-group');
        expect(buttonGroup).toHaveAttribute('aria-label', 'Complex button group');
    });

    test('renders children correctly', () => {
        renderButtonGroupWithChildContent('<button data-test-id="btn1">Button 1</button>');

        // Check that the children are rendered
        expect(screen.getByText('Button 1')).toBeInTheDocument();
    });

    test('binds group and toolbar element references to their DOM elements', () => {
        const { getByTestId } = render(ButtonGroupBindingTest);
        expect(getByTestId('group-ref')).toBeInstanceOf(HTMLDivElement);
        expect(getByTestId('toolbar-ref')).toBeInstanceOf(HTMLDivElement);
        expect(getByTestId('button-group-binding-state')).toHaveTextContent('group-ref:toolbar-ref');
    });
});

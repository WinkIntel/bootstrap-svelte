/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import ButtonToolbar from './button-toolbar.svelte';
import type { ButtonToolbarRootProps } from './types.js';

const renderButtonToolbarWithChildContent = (childContent: string = '<div/>', props: ButtonToolbarRootProps = {}) => {
    return render(ButtonToolbar, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => childContent
            }))
        }
    });
};

describe('ButtonToolbar.svelte', () => {
    test('renders with default properties', () => {
        renderButtonToolbarWithChildContent('<button>Button 1</button><button>Button 2</button>');
        const buttonToolbar = screen.getByRole('toolbar');

        // Check essential properties
        expect(buttonToolbar).toBeInTheDocument();
        expect(buttonToolbar).toHaveClass('btn-toolbar');
        expect(buttonToolbar.tagName).toBe('DIV');
        expect(buttonToolbar).toHaveAttribute('role', 'toolbar');
        expect(buttonToolbar).toHaveAttribute('aria-label', expect.stringMatching(/^Button toolbar c\d+$/));
    });

    test('renders with custom ID', () => {
        renderButtonToolbarWithChildContent(undefined, { id: 'custom-toolbar-id' });
        const buttonToolbar = screen.getByRole('toolbar');
        expect(buttonToolbar).toHaveAttribute('id', 'custom-toolbar-id');
    });

    test('renders with custom aria label', () => {
        renderButtonToolbarWithChildContent(undefined, { ariaLabel: 'Custom toolbar label' });
        const buttonToolbar = screen.getByRole('toolbar');
        expect(buttonToolbar).toHaveAttribute('aria-label', 'Custom toolbar label');
    });

    test('applies custom classes', () => {
        renderButtonToolbarWithChildContent(undefined, { class: 'custom-class another-class' });
        const buttonToolbar = screen.getByRole('toolbar');
        expect(buttonToolbar).toHaveClass('btn-toolbar');
        expect(buttonToolbar).toHaveClass('custom-class');
        expect(buttonToolbar).toHaveClass('another-class');
    });

    test('renders children correctly', () => {
        renderButtonToolbarWithChildContent('<button data-test-id="btn1">Button 1</button>');

        // Check that the children are rendered
        expect(screen.getByText('Button 1')).toBeInTheDocument();
    });

    test('combines multiple props correctly', () => {
        renderButtonToolbarWithChildContent(undefined, {
            class: 'test-class',
            ariaLabel: 'Complex toolbar',
            id: 'complex-toolbar'
        });

        const buttonToolbar = screen.getByRole('toolbar');
        expect(buttonToolbar).toHaveClass('btn-toolbar');
        expect(buttonToolbar).toHaveClass('test-class');
        expect(buttonToolbar).toHaveAttribute('aria-label', 'Complex toolbar');
        expect(buttonToolbar).toHaveAttribute('id', 'complex-toolbar');
    });
});

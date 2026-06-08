/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import Collapse from './collapse.svelte';
import type { CollapseRootProps } from './types.js';

const renderCollapseWithContent = (content: string, props: CollapseRootProps = {}) => {
    return render(Collapse, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => content
            }))
        }
    });
};

describe('Collapse.svelte', () => {
    test('should render', () => {
        renderCollapseWithContent('Collapse content', { isExpanded: true });
        const collapse = screen.getByText('Collapse content');

        expect(collapse).toBeInTheDocument();
        expect(collapse).toHaveClass('collapse');
    });

    test('renders a collapse with default properties', () => {
        renderCollapseWithContent('Default Collapse', { isExpanded: true });
        const collapse = screen.getByText('Default Collapse');

        expect(collapse).toBeInTheDocument();
        expect(collapse).toHaveClass('collapse');
        expect(collapse).toHaveClass('show');
        expect(collapse).not.toHaveClass('collapse-horizontal');
        expect(collapse).not.toHaveAttribute('aria-expanded');
    });

    test('renders with isExpanded=true', () => {
        renderCollapseWithContent('Open Collapse', { isExpanded: true });
        const collapse = screen.getByText('Open Collapse');

        expect(collapse).toHaveClass('collapse');
        expect(collapse).toHaveClass('show');
    });

    test('renders with isHorizontal=true', () => {
        renderCollapseWithContent('Horizontal Collapse', { isExpanded: true, isHorizontal: true });
        const collapse = screen.getByText('Horizontal Collapse');

        expect(collapse).toHaveClass('collapse');
        expect(collapse).toHaveClass('collapse-horizontal');
    });

    test('accepts and applies custom classes', () => {
        renderCollapseWithContent('Custom Collapse', {
            isExpanded: true,
            class: 'custom-class another-class'
        });

        const collapse = screen.getByText('Custom Collapse');
        expect(collapse).toHaveClass('collapse');
        expect(collapse).toHaveClass('custom-class');
        expect(collapse).toHaveClass('another-class');
    });

    test('combines multiple props correctly', () => {
        renderCollapseWithContent('Complex Collapse', {
            isExpanded: true,
            isHorizontal: true,
            class: 'test-class'
        });

        const collapse = screen.getByText('Complex Collapse');
        expect(collapse).toHaveClass('collapse');
        expect(collapse).toHaveClass('collapse-horizontal');
        expect(collapse).toHaveClass('show');
        expect(collapse).toHaveClass('test-class');
        expect(collapse).not.toHaveAttribute('aria-expanded');
    });
});

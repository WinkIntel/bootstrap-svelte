/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Collapse from './collapse.svelte';
import CollapseReversalTest from './tests/collapse-reversal-test.svelte';
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
    afterEach(() => {
        vi.useRealTimers();
    });

    test('renders an expanded collapse with its default contract', () => {
        renderCollapseWithContent('Collapse content', { isExpanded: true });
        const collapse = screen.getByText('Collapse content');

        expect(collapse).toBeInTheDocument();
        expect(collapse).toHaveClass('collapse', 'show');
        expect(collapse).not.toHaveClass('collapse-horizontal');
        expect(collapse).not.toHaveAttribute('aria-expanded');
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

    test('restores consumer transition timing after a rapid expand-collapse-expand reversal', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CollapseReversalTest);
        const toggle = screen.getByTestId('toggle-collapse');

        await fireEvent.click(toggle);
        await vi.advanceTimersByTimeAsync(0);
        const collapse = screen.getByTestId('reversing-collapse');

        await fireEvent.click(toggle);
        await vi.advanceTimersByTimeAsync(0);
        await fireEvent.click(toggle);
        await vi.advanceTimersByTimeAsync(200);

        expect(screen.getByTestId('reversing-collapse')).toBe(collapse);
        expect(collapse.style.getPropertyValue('transition-duration')).toBe('2s');
        expect(collapse.style.getPropertyPriority('transition-duration')).toBe('important');
        expect(collapse.style.getPropertyValue('transition-delay')).toBe('40ms');
        expect(collapse.style.getPropertyPriority('transition-delay')).toBe('important');
    });
});

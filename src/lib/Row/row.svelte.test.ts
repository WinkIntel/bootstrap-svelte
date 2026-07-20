/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Row from './row.svelte';
import RowStateTest from './tests/row-state-test.svelte';

describe('Row.svelte', () => {
    test('renders a row with default properties', () => {
        const { container } = render(Row);
        const row = container.firstChild as HTMLElement;

        // Check essential properties
        expect(row).toBeInTheDocument();
        expect(row).toHaveClass('row');

        // Check it doesn't have any row-cols classes
        const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
        breakpoints.forEach((breakpoint) => {
            for (let i = 1; i <= 6; i++) {
                expect(row).not.toHaveClass(`row-cols-${breakpoint}-${i}`);
            }
        });
    });

    // Test for numeric cols value
    test('renders with numeric cols value', () => {
        const { container } = render(Row, { props: { cols: 3 } });

        const row = container.firstChild as HTMLElement;
        expect(row).toHaveClass('row');
        expect(row).toHaveClass('row-cols-3');
    });

    // Test for cols with 'auto' value
    test('renders with auto cols value', () => {
        const { container } = render(Row, { props: { cols: 'auto' } });

        const row = container.firstChild as HTMLElement;
        expect(row).toHaveClass('row');
        expect(row).toHaveClass('row-cols-auto');
    });

    // Test for cols with single breakpoint
    test('renders with single breakpoint cols', () => {
        const { container } = render(Row, { props: { cols: { sm: 4 } } });

        const row = container.firstChild as HTMLElement;
        expect(row).toHaveClass('row');
        expect(row).toHaveClass('row-cols-sm-4');
    });

    test.each([
        [1, 'row-cols-1'],
        [6, 'row-cols-6'],
        ['auto', 'row-cols-auto']
    ] as const)('uses Bootstrap xs classes for %s', (xs, expectedClass) => {
        const { container } = render(Row, {
            props: {
                cols: {
                    xs,
                    md: 3,
                    lg: 5
                }
            }
        });

        const row = container.firstChild as HTMLElement;
        expect(row).toHaveClass('row');
        expect(row).toHaveClass(expectedClass);
        expect(row).not.toHaveClass(`row-cols-xs-${xs}`);
        expect(row).toHaveClass('row-cols-md-3');
        expect(row).toHaveClass('row-cols-lg-5');
    });

    test('ignores out-of-range runtime xs values that are excluded by the public type', () => {
        const { container } = render(Row, { props: { cols: { xs: 0 } as never } });
        const row = container.firstChild as HTMLElement;

        expect(row).not.toHaveClass('row-cols-0');
        expect(row).not.toHaveClass('row-cols-xs-0');
    });

    test.each([2.5, Number.NaN, 0, 7])('rejects malformed scalar cols values (%s)', (cols) => {
        const { container } = render(Row, { props: { cols: cols as never } });
        const row = container.firstChild as HTMLElement;

        expect(row.className).toBe('row');
    });

    test.each([{ xs: 2.5 }, { xs: Number.NaN }, { xs: 7 }, { unknown: 2 }])('rejects malformed map values (%o)', (cols) => {
        const { container } = render(Row, { props: { cols: cols as never } });
        const row = container.firstChild as HTMLElement;

        expect(row.className).toBe('row');
    });

    test('updates between xs and responsive classes without retaining stale tokens', async () => {
        render(RowStateTest);
        const row = screen.getByTestId('responsive-row');

        expect(row).toHaveClass('row-cols-sm-2');
        await fireEvent.click(screen.getByTestId('toggle-row-cols'));
        expect(row).toHaveClass('row-cols-3');
        expect(row).not.toHaveClass('row-cols-sm-2', 'row-cols-xs-3');
        await fireEvent.click(screen.getByTestId('toggle-row-cols'));
        expect(row).toHaveClass('row-cols-sm-2');
        expect(row).not.toHaveClass('row-cols-3');
    });

    // Test for custom ID
    test('renders with custom ID', () => {
        const { container } = render(Row, { props: { id: 'custom-row' } });

        const row = container.firstChild as HTMLElement;
        expect(row).toHaveAttribute('id', 'custom-row');
    });

    // Test for custom class
    test('accepts and applies custom classes', () => {
        const { container } = render(Row, {
            props: {
                class: 'custom-class another-class'
            }
        });

        const row = container.firstChild as HTMLElement;
        expect(row).toHaveClass('row');
        expect(row).toHaveClass('custom-class');
        expect(row).toHaveClass('another-class');
    });
});

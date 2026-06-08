/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Row from './row.svelte';

describe('Row.svelte', () => {
    test('should render', () => {
        const { container } = render(Row);
        expect(container).toBeInTheDocument();
    });

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

    // Test for cols with multiple breakpoints
    test('renders with multiple breakpoint cols', () => {
        const { container } = render(Row, {
            props: {
                cols: {
                    xs: 1,
                    md: 3,
                    lg: 5
                }
            }
        });

        const row = container.firstChild as HTMLElement;
        expect(row).toHaveClass('row');
        expect(row).toHaveClass('row-col-1'); // Notice xs is handled differently
        expect(row).toHaveClass('row-cols-md-3');
        expect(row).toHaveClass('row-cols-lg-5');
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

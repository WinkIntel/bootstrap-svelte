/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Col from './col.svelte';

describe('Col.svelte', () => {
    test('should render', () => {
        const { container } = render(Col);
        expect(container).toBeInTheDocument();
    });

    test('renders a column with default properties', () => {
        const { container } = render(Col);
        const col = container.firstChild as HTMLElement;

        // Check essential properties
        expect(col).toBeInTheDocument();
        expect(col).toHaveClass('col');

        // Check it doesn't have any sizing classes
        const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
        breakpoints.forEach((breakpoint) => {
            for (let i = 1; i <= 12; i++) {
                expect(col).not.toHaveClass(`col-${breakpoint}-${i}`);
            }
        });
    });

    // Test for sizing with one breakpoint
    test('renders with single breakpoint sizing', () => {
        const { container } = render(Col, { props: { sizing: { sm: 6 } } });

        const col = container.firstChild as HTMLElement;
        expect(col).not.toHaveClass('col');
        expect(col).toHaveClass('col-sm-6');
    });

    // Test for sizing with multiple breakpoints
    test('renders with multiple breakpoint sizing', () => {
        const { container } = render(Col, {
            props: {
                sizing: {
                    xs: 12,
                    md: 8,
                    lg: 6
                }
            }
        });

        const col = container.firstChild as HTMLElement;
        expect(col).not.toHaveClass('col');
        expect(col).toHaveClass('col-12');
        expect(col).toHaveClass('col-md-8');
        expect(col).toHaveClass('col-lg-6');
    });

    // Test for sizing with a single number (OneToTwelve type)
    test('renders with single number sizing', () => {
        const { container } = render(Col, { props: { sizing: 6 } });

        const col = container.firstChild as HTMLElement;
        expect(col).not.toHaveClass('col');
        expect(col).toHaveClass('col-6');
    });

    // Test for custom ID
    test('renders with custom ID', () => {
        const { container } = render(Col, { props: { id: 'custom-col' } });

        const col = container.firstChild as HTMLElement;
        expect(col).toHaveAttribute('id', 'custom-col');
    });

    // Test for custom class
    test('accepts and applies custom classes', () => {
        const { container } = render(Col, {
            props: {
                class: 'custom-class another-class'
            }
        });

        const col = container.firstChild as HTMLElement;
        expect(col).toHaveClass('col');
        expect(col).toHaveClass('custom-class');
        expect(col).toHaveClass('another-class');
    });

    // Test for sizing with asterisk values
    test('renders with asterisk values for breakpoint-only classes', () => {
        const { container } = render(Col, {
            props: {
                sizing: {
                    sm: '*',
                    md: 6,
                    lg: '*'
                }
            }
        });

        const col = container.firstChild as HTMLElement;
        expect(col).not.toHaveClass('col');
        expect(col).toHaveClass('col-sm'); // Should be just 'col-sm' without a size
        expect(col).toHaveClass('col-md-6'); // Should be 'col-md-6' with size
        expect(col).toHaveClass('col-lg'); // Should be just 'col-lg' without a size
        expect(col).not.toHaveClass('col-sm-*'); // Should NOT have this class
        expect(col).not.toHaveClass('col-lg-*'); // Should NOT have this class
    });

    // Test for sizing with 'auto' value
    test('renders with auto sizing', () => {
        const { container } = render(Col, { props: { sizing: 'auto' } });

        const col = container.firstChild as HTMLElement;
        expect(col).not.toHaveClass('col');
        expect(col).toHaveClass('col-auto');
    });

    // Tests for offset prop
    test('renders with numeric offset', () => {
        const { container } = render(Col, { props: { offset: 2 } });

        const col = container.firstChild as HTMLElement;
        expect(col).toHaveClass('col');
        expect(col).toHaveClass('offset-2');
    });

    test('renders with responsive offset map', () => {
        const { container } = render(Col, {
            props: {
                offset: {
                    xs: 1,
                    md: 3,
                    lg: 5
                }
            }
        });

        const col = container.firstChild as HTMLElement;
        expect(col).toHaveClass('col');
        expect(col).toHaveClass('offset-xs-1');
        expect(col).toHaveClass('offset-md-3');
        expect(col).toHaveClass('offset-lg-5');
    });

    // Tests for order prop
    test('renders with numeric order', () => {
        const { container } = render(Col, { props: { order: 3 } });

        const col = container.firstChild as HTMLElement;
        expect(col).toHaveClass('col');
        expect(col).toHaveClass('order-3');
    });

    test('renders with first/last order', () => {
        const { container } = render(Col, { props: { order: 'first' } });
        const col = container.firstChild as HTMLElement;
        expect(col).toHaveClass('col');
        expect(col).toHaveClass('order-first');

        const { container: container2 } = render(Col, { props: { order: 'last' } });
        const col2 = container2.firstChild as HTMLElement;
        expect(col2).toHaveClass('col');
        expect(col2).toHaveClass('order-last');
    });

    test('renders with responsive order map', () => {
        const { container } = render(Col, {
            props: {
                order: {
                    xs: 'first',
                    sm: 0,
                    lg: 'last'
                }
            }
        });

        const col = container.firstChild as HTMLElement;
        expect(col).toHaveClass('col');
        expect(col).toHaveClass('order-xs-first');
        expect(col).toHaveClass('order-sm-0');
        expect(col).toHaveClass('order-lg-last');
    });

    // Test for combined props
    test('renders with combined sizing, offset, and order props', () => {
        const { container } = render(Col, {
            props: {
                sizing: { xs: 12, md: 6 },
                offset: { md: 1 },
                order: { lg: 'first' }
            }
        });

        const col = container.firstChild as HTMLElement;
        expect(col).not.toHaveClass('col');
        expect(col).toHaveClass('col-12');
        expect(col).toHaveClass('col-md-6');
        expect(col).toHaveClass('offset-md-1');
        expect(col).toHaveClass('order-lg-first');
    });
});

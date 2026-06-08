/// <reference types="@testing-library/jest-dom" />
/**
 * Comprehensive test suite for the Table component
 *
 * Coverage areas:
 * - Basic rendering and structure (container wrapper, table element, sub-components)
 * - Color variants (primary, secondary, success, danger, warning, info, light, dark)
 * - Striped tables (rows and columns)
 * - Hoverable state
 * - Bordered and borderless tables with border color variants
 * - Table size variants (sm)
 * - Vertical alignment (top, middle, bottom) on table, rows, and cells
 * - Active state on rows and cells
 * - Row and cell color variants
 * - Table head color schemes (dark, light)
 * - Table body and foot group dividers
 * - Table captions (top and bottom placement)
 * - Responsive tables (with and without breakpoints)
 * - Container and responsive wrapper props
 * - Custom classes and styles
 * - Element ref binding
 * - Combined properties and edge cases
 * - Accessibility (roles, scope attributes)
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import TableContainerFooterTest from './table-container-footer-test.svelte';
import TableTest from './table-test.svelte';

describe('Table.svelte', () => {
    describe('Basic Rendering and Structure', () => {
        test('should render a basic table with container wrapper', () => {
            render(TableTest);
            const table = screen.getByRole('table');

            expect(table).toBeInTheDocument();
            expect(table).toHaveClass('table');

            // Table is always wrapped in a container div
            const container = table.closest('.table-container');
            expect(container).toBeInTheDocument();
        });

        test('renders table with default properties', () => {
            render(TableTest);
            const table = screen.getByRole('table');

            // Check essential properties
            expect(table).toBeInTheDocument();
            expect(table).toHaveClass('table');

            // Check it doesn't have variant classes by default
            const variantClasses = [
                'table-primary',
                'table-secondary',
                'table-success',
                'table-danger',
                'table-warning',
                'table-info',
                'table-light',
                'table-dark'
            ];
            variantClasses.forEach((variant) => {
                expect(table).not.toHaveClass(variant);
            });

            // Check modifier classes aren't present
            expect(table).not.toHaveClass('table-striped');
            expect(table).not.toHaveClass('table-bordered');
            expect(table).not.toHaveClass('table-borderless');
            expect(table).not.toHaveClass('table-hover');
            expect(table).not.toHaveClass('table-sm');
        });

        test('binds elementRef correctly', () => {
            const { component } = render(TableTest);

            // The test component should expose the ref
            expect(component.getTableRef()).toBeInstanceOf(HTMLTableElement);
        });

        test('applies custom class to table', () => {
            render(TableTest, { props: { tableClass: 'custom-table-class' } });
            const table = screen.getByRole('table');

            expect(table).toHaveClass('table', 'custom-table-class');
        });

        test('applies custom id to table', () => {
            render(TableTest, { props: { tableId: 'my-custom-table' } });
            const table = screen.getByRole('table');

            expect(table).toHaveAttribute('id', 'my-custom-table');
        });

        test('applies custom containerProps classes', () => {
            render(TableTest, { props: { containerClass: 'my-custom-container' } });
            const table = screen.getByRole('table');
            const container = table.closest('.table-container');

            expect(container).toHaveClass('table-container', 'my-custom-container');
        });

        test('applies custom data attributes', () => {
            render(TableTest, { props: { dataTestId: 'my-table' } });
            const table = screen.getByRole('table');

            expect(table).toHaveAttribute('data-testid', 'my-table');
        });
    });

    describe('Table Structure and Sub-components', () => {
        test('renders table with thead, tbody structure', () => {
            render(TableTest);
            const table = screen.getByRole('table');

            const thead = table.querySelector('thead');
            const tbody = table.querySelector('tbody');

            expect(thead).toBeInTheDocument();
            expect(tbody).toBeInTheDocument();
        });

        test('renders table with tfoot when showFoot is true', () => {
            render(TableTest, { props: { showFoot: true } });
            const table = screen.getByRole('table');

            const tfoot = table.querySelector('tfoot');
            expect(tfoot).toBeInTheDocument();
        });

        test('header cells have correct scope attribute in thead', () => {
            render(TableTest);
            const headers = screen.getAllByRole('columnheader');

            headers.forEach((header) => {
                expect(header).toHaveAttribute('scope', 'col');
            });
        });

        test('header cells have correct scope attribute in tbody rows', () => {
            render(TableTest);
            const rowHeaders = screen.getAllByRole('rowheader');

            rowHeaders.forEach((header) => {
                expect(header).toHaveAttribute('scope', 'row');
            });
        });

        test('renders table cells correctly', () => {
            render(TableTest);
            const cells = screen.getAllByRole('cell');

            expect(cells.length).toBeGreaterThan(0);
        });
    });

    describe('Color Variants', () => {
        test('renders with primary variant', () => {
            render(TableTest, { props: { colorVariant: 'primary' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table', 'table-primary');
        });

        test('renders with secondary variant', () => {
            render(TableTest, { props: { colorVariant: 'secondary' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-secondary');
        });

        test('renders with success variant', () => {
            render(TableTest, { props: { colorVariant: 'success' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-success');
        });

        test('renders with danger variant', () => {
            render(TableTest, { props: { colorVariant: 'danger' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-danger');
        });

        test('renders with warning variant', () => {
            render(TableTest, { props: { colorVariant: 'warning' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-warning');
        });

        test('renders with info variant', () => {
            render(TableTest, { props: { colorVariant: 'info' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-info');
        });

        test('renders with light variant', () => {
            render(TableTest, { props: { colorVariant: 'light' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-light');
        });

        test('renders with dark variant', () => {
            render(TableTest, { props: { colorVariant: 'dark' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-dark');
        });
    });

    describe('Striped Tables', () => {
        test('renders with striped rows', () => {
            render(TableTest, { props: { isStriped: true } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-striped');
        });

        test('renders with striped columns', () => {
            render(TableTest, { props: { isStripedColumns: true } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-striped-columns');
        });

        test('renders with both striped rows and columns', () => {
            render(TableTest, { props: { isStriped: true, isStripedColumns: true } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-striped');
            expect(table).toHaveClass('table-striped-columns');
        });

        test('renders striped with dark variant', () => {
            render(TableTest, { props: { isStriped: true, colorVariant: 'dark' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-striped');
            expect(table).toHaveClass('table-dark');
        });

        test('renders striped columns with success variant', () => {
            render(TableTest, { props: { isStripedColumns: true, colorVariant: 'success' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-striped-columns');
            expect(table).toHaveClass('table-success');
        });
    });

    describe('Hoverable Tables', () => {
        test('renders with hoverable rows', () => {
            render(TableTest, { props: { isHoverable: true } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-hover');
        });

        test('renders hoverable with dark variant', () => {
            render(TableTest, { props: { isHoverable: true, colorVariant: 'dark' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-hover');
            expect(table).toHaveClass('table-dark');
        });

        test('renders hoverable with striped rows', () => {
            render(TableTest, { props: { isHoverable: true, isStriped: true } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-hover');
            expect(table).toHaveClass('table-striped');
        });
    });

    describe('Bordered Tables', () => {
        test('renders with borders', () => {
            render(TableTest, { props: { isBordered: true } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-bordered');
        });

        test('renders with border-primary color variant', () => {
            render(TableTest, { props: { isBordered: true, borderColorVariant: 'border-primary' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-bordered');
            expect(table).toHaveClass('border-primary');
        });

        test('renders with border-secondary color variant', () => {
            render(TableTest, { props: { isBordered: true, borderColorVariant: 'border-secondary' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-bordered');
            expect(table).toHaveClass('border-secondary');
        });

        test('renders with border-success color variant', () => {
            render(TableTest, { props: { isBordered: true, borderColorVariant: 'border-success' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-bordered');
            expect(table).toHaveClass('border-success');
        });

        test('renders with border-danger color variant', () => {
            render(TableTest, { props: { isBordered: true, borderColorVariant: 'border-danger' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-bordered');
            expect(table).toHaveClass('border-danger');
        });

        test('does not apply border color variant without isBordered', () => {
            render(TableTest, { props: { borderColorVariant: 'border-primary' } });
            const table = screen.getByRole('table');
            expect(table).not.toHaveClass('border-primary');
        });

        test('renders borderless table', () => {
            render(TableTest, { props: { isBorderless: true } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-borderless');
            expect(table).not.toHaveClass('table-bordered');
        });

        test('neither class is applied when both isBordered and isBorderless are true', () => {
            render(TableTest, { props: { isBordered: true, isBorderless: true } });
            const table = screen.getByRole('table');

            // When both are true, neither class is applied per the implementation logic
            expect(table).not.toHaveClass('table-bordered');
            expect(table).not.toHaveClass('table-borderless');
        });
    });

    describe('Table Size', () => {
        test('renders small table', () => {
            render(TableTest, { props: { size: 'sm' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-sm');
        });

        test('renders small dark table', () => {
            render(TableTest, { props: { size: 'sm', colorVariant: 'dark' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-sm');
            expect(table).toHaveClass('table-dark');
        });

        test('renders small bordered table', () => {
            render(TableTest, { props: { size: 'sm', isBordered: true } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('table-sm');
            expect(table).toHaveClass('table-bordered');
        });
    });

    describe('Vertical Alignment', () => {
        test('renders with top vertical alignment on table', () => {
            render(TableTest, { props: { verticalAlign: 'top' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('align-top');
        });

        test('renders with middle vertical alignment on table', () => {
            render(TableTest, { props: { verticalAlign: 'middle' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('align-middle');
        });

        test('renders with bottom vertical alignment on table', () => {
            render(TableTest, { props: { verticalAlign: 'bottom' } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('align-bottom');
        });

        test('renders with top vertical alignment on row', () => {
            render(TableTest, { props: { rowVerticalAlign: 'top' } });
            const rows = screen.getAllByRole('row');
            const firstBodyRow = rows[1]; // Skip header row
            expect(firstBodyRow).toHaveClass('align-top');
        });

        test('renders with middle vertical alignment on row', () => {
            render(TableTest, { props: { rowVerticalAlign: 'middle' } });
            const rows = screen.getAllByRole('row');
            const firstBodyRow = rows[1];
            expect(firstBodyRow).toHaveClass('align-middle');
        });

        test('renders with bottom vertical alignment on row', () => {
            render(TableTest, { props: { rowVerticalAlign: 'bottom' } });
            const rows = screen.getAllByRole('row');
            const firstBodyRow = rows[1];
            expect(firstBodyRow).toHaveClass('align-bottom');
        });

        test('renders with vertical alignment on cell', () => {
            render(TableTest, { props: { cellVerticalAlign: 'middle' } });
            const cells = screen.getAllByRole('cell');
            const lastCell = cells[cells.length - 1];
            expect(lastCell).toHaveClass('align-middle');
        });
    });

    describe('Active Rows and Cells', () => {
        test('renders active row', () => {
            render(TableTest, { props: { rowIsActive: true } });
            const rows = screen.getAllByRole('row');
            const firstBodyRow = rows[1];
            expect(firstBodyRow).toHaveClass('table-active');
        });

        test('renders active cell', () => {
            render(TableTest, { props: { cellIsActive: true } });
            const cells = screen.getAllByRole('cell');
            const lastCell = cells[cells.length - 1];
            expect(lastCell).toHaveClass('table-active');
        });

        test('renders active row with color variant', () => {
            render(TableTest, { props: { rowIsActive: true, rowColorVariant: 'primary' } });
            const rows = screen.getAllByRole('row');
            const firstBodyRow = rows[1];
            expect(firstBodyRow).toHaveClass('table-active');
            expect(firstBodyRow).toHaveClass('table-primary');
        });
    });

    describe('Row Color Variants', () => {
        test('renders row with primary variant', () => {
            render(TableTest, { props: { rowColorVariant: 'primary' } });
            const rows = screen.getAllByRole('row');
            const firstBodyRow = rows[1];
            expect(firstBodyRow).toHaveClass('table-primary');
        });

        test('renders row with success variant', () => {
            render(TableTest, { props: { rowColorVariant: 'success' } });
            const rows = screen.getAllByRole('row');
            const firstBodyRow = rows[1];
            expect(firstBodyRow).toHaveClass('table-success');
        });

        test('renders row with danger variant', () => {
            render(TableTest, { props: { rowColorVariant: 'danger' } });
            const rows = screen.getAllByRole('row');
            const firstBodyRow = rows[1];
            expect(firstBodyRow).toHaveClass('table-danger');
        });
    });

    describe('Cell Color Variants', () => {
        test('renders cell with primary variant', () => {
            render(TableTest, { props: { cellColorVariant: 'primary' } });
            const cells = screen.getAllByRole('cell');
            const lastCell = cells[cells.length - 1];
            expect(lastCell).toHaveClass('table-primary');
        });

        test('renders cell with success variant', () => {
            render(TableTest, { props: { cellColorVariant: 'success' } });
            const cells = screen.getAllByRole('cell');
            const lastCell = cells[cells.length - 1];
            expect(lastCell).toHaveClass('table-success');
        });

        test('renders cell with danger variant', () => {
            render(TableTest, { props: { cellColorVariant: 'danger' } });
            const cells = screen.getAllByRole('cell');
            const lastCell = cells[cells.length - 1];
            expect(lastCell).toHaveClass('table-danger');
        });
    });

    describe('Table Head Color Scheme', () => {
        test('renders table head with dark color scheme', () => {
            render(TableTest, { props: { headColorScheme: 'dark' } });
            const table = screen.getByRole('table');
            const thead = table.querySelector('thead');
            expect(thead).toHaveClass('table-dark');
        });

        test('renders table head with light color scheme', () => {
            render(TableTest, { props: { headColorScheme: 'light' } });
            const table = screen.getByRole('table');
            const thead = table.querySelector('thead');
            expect(thead).toHaveClass('table-light');
        });
    });

    describe('Table Body Group Divider', () => {
        test('renders table body with group divider', () => {
            render(TableTest, { props: { bodyHasGroupDivider: true } });
            const table = screen.getByRole('table');
            const tbody = table.querySelector('tbody');
            expect(tbody).toHaveClass('table-group-divider');
        });
    });

    describe('Table Footer', () => {
        test('renders table footer', () => {
            render(TableTest, { props: { showFoot: true } });
            const table = screen.getByRole('table');
            const tfoot = table.querySelector('tfoot');
            expect(tfoot).toBeInTheDocument();
        });

        test('renders table footer with group divider', () => {
            render(TableTest, { props: { showFoot: true, footHasGroupDivider: true } });
            const table = screen.getByRole('table');
            const tfoot = table.querySelector('tfoot');
            expect(tfoot).toHaveClass('table-group-divider');
        });
    });

    describe('Table Caption', () => {
        test('renders table caption', () => {
            render(TableTest, { props: { showCaption: true } });
            const table = screen.getByRole('table');
            const caption = table.querySelector('caption');
            expect(caption).toBeInTheDocument();
            expect(caption).toHaveTextContent('List of users');
        });

        test('renders custom caption text', () => {
            render(TableTest, { props: { showCaption: true, captionText: 'Custom Caption' } });
            const table = screen.getByRole('table');
            const caption = table.querySelector('caption');
            expect(caption).toHaveTextContent('Custom Caption');
        });

        test('renders caption at top when isCaptionTop is true', () => {
            render(TableTest, { props: { showCaption: true, isCaptionTop: true } });
            const table = screen.getByRole('table');
            expect(table).toHaveClass('caption-top');
        });

        test('caption is at bottom by default', () => {
            render(TableTest, { props: { showCaption: true } });
            const table = screen.getByRole('table');
            expect(table).not.toHaveClass('caption-top');
        });
    });

    describe('Responsive Tables', () => {
        test('renders responsive table without breakpoint', () => {
            render(TableTest, { props: { isResponsive: true } });
            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('.table-responsive');

            expect(responsiveWrapper).toBeInTheDocument();
            expect(responsiveWrapper).toHaveClass('table-responsive');
        });

        test('renders responsive table with sm breakpoint', () => {
            render(TableTest, { props: { isResponsive: true, responsiveBreakpoint: 'sm' } });
            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('.table-responsive-sm');

            expect(responsiveWrapper).toBeInTheDocument();
            expect(responsiveWrapper).toHaveClass('table-responsive-sm');
            expect(responsiveWrapper).not.toHaveClass('table-responsive');
        });

        test('renders responsive table with md breakpoint', () => {
            render(TableTest, { props: { isResponsive: true, responsiveBreakpoint: 'md' } });
            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('.table-responsive-md');

            expect(responsiveWrapper).toBeInTheDocument();
        });

        test('renders responsive table with lg breakpoint', () => {
            render(TableTest, { props: { isResponsive: true, responsiveBreakpoint: 'lg' } });
            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('.table-responsive-lg');

            expect(responsiveWrapper).toBeInTheDocument();
        });

        test('renders responsive table with xl breakpoint', () => {
            render(TableTest, { props: { isResponsive: true, responsiveBreakpoint: 'xl' } });
            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('.table-responsive-xl');

            expect(responsiveWrapper).toBeInTheDocument();
        });

        test('renders responsive table with xxl breakpoint', () => {
            render(TableTest, { props: { isResponsive: true, responsiveBreakpoint: 'xxl' } });
            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('.table-responsive-xxl');

            expect(responsiveWrapper).toBeInTheDocument();
        });

        test('does not render responsive wrapper when isResponsive is false', () => {
            render(TableTest, { props: { isResponsive: false } });
            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('[class*="table-responsive"]');

            expect(responsiveWrapper).toBeNull();
        });

        test('applies custom class to responsive wrapper', () => {
            render(TableTest, { props: { isResponsive: true, responsiveClass: 'custom-responsive' } });
            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('.table-responsive');

            expect(responsiveWrapper).toHaveClass('table-responsive', 'custom-responsive');
        });

        test('responsive wrapper is inside container', () => {
            render(TableTest, { props: { isResponsive: true } });
            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('.table-responsive');
            const container = responsiveWrapper?.parentElement;

            expect(container).toHaveClass('table-container');
        });
    });

    describe('Combined Properties', () => {
        test('renders dark bordered striped hoverable table', () => {
            render(TableTest, {
                props: {
                    colorVariant: 'dark',
                    isBordered: true,
                    isStriped: true,
                    isHoverable: true
                }
            });
            const table = screen.getByRole('table');

            expect(table).toHaveClass('table-dark');
            expect(table).toHaveClass('table-bordered');
            expect(table).toHaveClass('table-striped');
            expect(table).toHaveClass('table-hover');
        });

        test('renders small striped responsive table', () => {
            render(TableTest, {
                props: {
                    size: 'sm',
                    isStriped: true,
                    isResponsive: true,
                    responsiveBreakpoint: 'md'
                }
            });
            const table = screen.getByRole('table');

            expect(table).toHaveClass('table-sm');
            expect(table).toHaveClass('table-striped');

            const responsiveWrapper = table.closest('.table-responsive-md');
            expect(responsiveWrapper).toBeInTheDocument();
        });

        test('renders primary bordered table with caption on top', () => {
            render(TableTest, {
                props: {
                    colorVariant: 'primary',
                    isBordered: true,
                    isCaptionTop: true,
                    showCaption: true
                }
            });
            const table = screen.getByRole('table');

            expect(table).toHaveClass('table-primary');
            expect(table).toHaveClass('table-bordered');
            expect(table).toHaveClass('caption-top');

            const caption = table.querySelector('caption');
            expect(caption).toBeInTheDocument();
        });

        test('renders success striped columns table with dark head', () => {
            render(TableTest, {
                props: {
                    colorVariant: 'success',
                    isStripedColumns: true,
                    headColorScheme: 'dark'
                }
            });
            const table = screen.getByRole('table');

            expect(table).toHaveClass('table-success');
            expect(table).toHaveClass('table-striped-columns');

            const thead = table.querySelector('thead');
            expect(thead).toHaveClass('table-dark');
        });

        test('renders all styling options together', () => {
            render(TableTest, {
                props: {
                    colorVariant: 'dark',
                    isBordered: true,
                    borderColorVariant: 'border-primary',
                    isStriped: true,
                    isStripedColumns: true,
                    isHoverable: true,
                    size: 'sm',
                    verticalAlign: 'middle',
                    isResponsive: true,
                    responsiveBreakpoint: 'lg',
                    isCaptionTop: true,
                    showCaption: true
                }
            });
            const table = screen.getByRole('table');

            expect(table).toHaveClass('table');
            expect(table).toHaveClass('table-dark');
            expect(table).toHaveClass('table-bordered');
            expect(table).toHaveClass('border-primary');
            expect(table).toHaveClass('table-striped');
            expect(table).toHaveClass('table-striped-columns');
            expect(table).toHaveClass('table-hover');
            expect(table).toHaveClass('table-sm');
            expect(table).toHaveClass('align-middle');
            expect(table).toHaveClass('caption-top');

            const responsiveWrapper = table.closest('.table-responsive-lg');
            expect(responsiveWrapper).toBeInTheDocument();

            const caption = table.querySelector('caption');
            expect(caption).toBeInTheDocument();
        });
    });

    describe('Edge Cases and Special Scenarios', () => {
        test('handles empty table gracefully', () => {
            render(TableTest, { props: { isEmpty: true } });
            const table = screen.getByRole('table');

            expect(table).toBeInTheDocument();
            expect(table).toHaveClass('table');
        });

        test('borderless takes precedence when isBordered is false', () => {
            render(TableTest, { props: { isBordered: false, isBorderless: true } });
            const table = screen.getByRole('table');

            expect(table).toHaveClass('table-borderless');
            expect(table).not.toHaveClass('table-bordered');
        });

        test('renders with multiple custom classes', () => {
            render(TableTest, { props: { tableClass: 'class-1 class-2 class-3' } });
            const table = screen.getByRole('table');

            expect(table).toHaveClass('table', 'class-1', 'class-2', 'class-3');
        });

        test('container wrapper is always present', () => {
            render(TableTest);
            const table = screen.getByRole('table');
            const container = table.closest('.table-container');

            expect(container).toBeInTheDocument();
        });

        test('responsive wrapper with xs breakpoint is ignored', () => {
            render(TableTest, { props: { isResponsive: true, responsiveBreakpoint: 'xs' } });
            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('.table-responsive');

            // xs is treated as no breakpoint, so should render table-responsive
            expect(responsiveWrapper).toBeInTheDocument();
            expect(responsiveWrapper).toHaveClass('table-responsive');
            expect(responsiveWrapper).not.toHaveClass('table-responsive-xs');
        });

        test('passes through arbitrary HTML attributes', () => {
            render(TableTest, { props: { ariaLabel: 'User data table' } });
            const table = screen.getByRole('table');

            expect(table).toHaveAttribute('aria-label', 'User data table');
        });
    });

    describe('Table Container Footer', () => {
        test('renders tableContainerFooter snippet when provided', () => {
            render(TableContainerFooterTest);

            const footerContent = screen.getByTestId('footer-content');
            expect(footerContent).toBeInTheDocument();
            expect(footerContent).toHaveTextContent('Table footer content');

            // Footer should be outside the table element but inside the container
            const table = screen.getByRole('table');
            const tableContainer = table.closest('.table-container');
            expect(tableContainer).toContainElement(footerContent);
            expect(table).not.toContainElement(footerContent);
        });

        test('does not render footer content when tableContainerFooter is not provided', () => {
            const { container } = render(TableTest);

            const footerContent = container.querySelector('.table-footer-content');
            expect(footerContent).not.toBeInTheDocument();

            // Verify no extra markup is added
            const table = screen.getByRole('table');
            const tableContainer = table.closest('.table-container');
            expect(tableContainer?.children.length).toBe(1); // Only the table/responsive wrapper
        });

        test('tableContainerFooter appears after responsive wrapper when isResponsive is true', () => {
            render(TableContainerFooterTest, {
                props: {
                    isResponsive: true,
                    responsiveBreakpoint: 'md'
                }
            });

            const table = screen.getByRole('table');
            const responsiveWrapper = table.closest('.table-responsive-md') as HTMLElement;
            const footerContent = screen.getByTestId('footer-content');

            expect(responsiveWrapper).toBeInTheDocument();
            expect(footerContent).toBeInTheDocument();

            // Both should be inside the table container
            const tableContainer = table.closest('.table-container') as HTMLElement;
            expect(tableContainer).toContainElement(responsiveWrapper);
            expect(tableContainer).toContainElement(footerContent);

            // Footer should not be inside the responsive wrapper
            expect(responsiveWrapper).not.toContainElement(footerContent);
        });
    });
});

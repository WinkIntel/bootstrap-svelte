import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import BreadcrumbBasicTest from './breadcrumb-basic-test.svelte';

describe('Breadcrumb Component', () => {
    it('should render basic breadcrumb with all sub-components', async () => {
        render(BreadcrumbBasicTest);

        // Check if basic breadcrumb components are rendered
        const breadcrumb = screen.getByTestId('basic-breadcrumb');
        expect(breadcrumb).toHaveClass('breadcrumb');

        // Check for individual breadcrumb items
        const homeItem = screen.getByTestId('breadcrumb-item-home');
        expect(homeItem).toHaveClass('breadcrumb-item');
        expect(homeItem).not.toHaveClass('active');

        const libraryItem = screen.getByTestId('breadcrumb-item-library');
        expect(libraryItem).toHaveClass('breadcrumb-item');
        expect(libraryItem).not.toHaveClass('active');

        // Check for active item
        const dataItem = screen.getByTestId('breadcrumb-item-data');
        expect(dataItem).toHaveClass('breadcrumb-item');
        expect(dataItem).toHaveClass('active');
        expect(dataItem).toHaveAttribute('aria-current', 'page');
    });

    it('should render breadcrumb with custom dividers', () => {
        render(BreadcrumbBasicTest);

        // Test custom character divider
        const customDividerBreadcrumb = screen.getByTestId('breadcrumb-custom-divider');
        expect(customDividerBreadcrumb.parentElement).toHaveStyle("--bs-breadcrumb-divider: '>'");

        // Test SVG divider
        const svgDividerBreadcrumb = screen.getByTestId('breadcrumb-svg-divider');
        expect(svgDividerBreadcrumb.parentElement).toHaveStyle(
            "--bs-breadcrumb-divider: url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E)"
        );

        // Test empty divider
        const noDividerBreadcrumb = screen.getByTestId('breadcrumb-no-divider');
        expect(noDividerBreadcrumb.parentElement).toHaveStyle("--bs-breadcrumb-divider: ''");
    });
});

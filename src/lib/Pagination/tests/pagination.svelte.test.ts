import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PaginationBasicTest from './pagination-basic-test.svelte';

describe('Pagination Component', () => {
    it('should render basic pagination with all sub-components', async () => {
        render(PaginationBasicTest);

        // Check if basic pagination components are rendered
        const pagination = screen.getByTestId('basic-pagination');
        expect(pagination).toHaveClass('pagination');

        // Check for pagination item and link
        const paginationItem = screen.getByTestId('pagination-item-2');
        expect(paginationItem).toHaveClass('page-item');
        expect(paginationItem).toHaveClass('active');

        const paginationLink = screen.getByTestId('pagination-link-2');
        expect(paginationLink).toHaveClass('page-link');

        // Check for disabled state
        const disabledItem = screen.getByTestId('pagination-item-prev');
        expect(disabledItem).toHaveClass('disabled');
    });

    it('should render pagination with different sizes', () => {
        render(PaginationBasicTest);

        // Small pagination
        const smPagination = screen.getByTestId('pagination-sm');
        expect(smPagination).toHaveClass('pagination');
        expect(smPagination).toHaveClass('pagination-sm');

        // Default pagination (no specific size class)
        const defaultPagination = screen.getByTestId('pagination-default');
        expect(defaultPagination).toHaveClass('pagination');
        expect(defaultPagination).not.toHaveClass('pagination-sm');
        expect(defaultPagination).not.toHaveClass('pagination-lg');

        // Large pagination
        const lgPagination = screen.getByTestId('pagination-lg');
        expect(lgPagination).toHaveClass('pagination');
        expect(lgPagination).toHaveClass('pagination-lg');
    });

    it('should render pagination with different alignments', () => {
        render(PaginationBasicTest);

        // Default (start) alignment
        const startPagination = screen.getByTestId('pagination-start');
        expect(startPagination).toHaveClass('pagination');
        expect(startPagination).not.toHaveClass('justify-content-center');
        expect(startPagination).not.toHaveClass('justify-content-end');

        // Center alignment
        const centerPagination = screen.getByTestId('pagination-center');
        expect(centerPagination).toHaveClass('pagination');
        expect(centerPagination).toHaveClass('justify-content-center');

        // End alignment
        const endPagination = screen.getByTestId('pagination-end');
        expect(endPagination).toHaveClass('pagination');
        expect(endPagination).toHaveClass('justify-content-end');
    });
});

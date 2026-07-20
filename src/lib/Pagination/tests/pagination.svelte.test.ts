import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PaginationBasicTest from './pagination-basic-test.svelte';
import PaginationIdentityTest from './pagination-identity-test.svelte';
import PaginationInteractionTest from './pagination-interaction-test.svelte';

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

    it('keeps every disabled item inert while allowing enabled items to activate', async () => {
        render(PaginationInteractionTest);

        const reusedLink = screen.getByTestId('pagination-reused-link');
        const secondLink = screen.getByTestId('pagination-second-link');
        const linkDisabledLink = screen.getByTestId('pagination-link-disabled-link');
        const enabledLink = screen.getByTestId('pagination-enabled-link');

        for (const link of [reusedLink, secondLink, linkDisabledLink]) {
            expect(link).toHaveAttribute('aria-disabled', 'true');
            expect(link).toHaveAttribute('tabindex', '-1');
        }

        const disabledClick = new MouseEvent('click', { bubbles: true, cancelable: true });
        secondLink.dispatchEvent(disabledClick);
        expect(disabledClick.defaultPrevented).toBe(true);
        expect(screen.getByTestId('pagination-click-counts')).toHaveTextContent('0:0:0:0');
        expect(screen.getByTestId('pagination-second-item')).not.toHaveClass('active');

        const linkDisabledClick = new MouseEvent('click', { bubbles: true, cancelable: true });
        linkDisabledLink.dispatchEvent(linkDisabledClick);
        expect(linkDisabledClick.defaultPrevented).toBe(true);
        expect(screen.getByTestId('pagination-click-counts')).toHaveTextContent('0:0:0:0');

        await fireEvent.click(enabledLink);
        expect(screen.getByTestId('pagination-click-counts')).toHaveTextContent('0:0:0:1');
        const enabledItem = screen.getByTestId('pagination-enabled-item');
        expect(enabledItem).toHaveClass('active');
        expect(enabledItem).toHaveAttribute('aria-current', 'page');
    });

    it('removes disabled membership when an item changes, unmounts, and reuses its id', async () => {
        render(PaginationInteractionTest);

        await fireEvent.click(screen.getByTestId('pagination-enable-second'));
        expect(screen.getByTestId('pagination-second-link')).toHaveAttribute('aria-disabled', 'false');
        expect(screen.getByTestId('pagination-second-link')).toHaveAttribute('tabindex', '4');

        await fireEvent.click(screen.getByTestId('pagination-disable-second'));
        expect(screen.getByTestId('pagination-second-link')).toHaveAttribute('aria-disabled', 'true');

        await fireEvent.click(screen.getByTestId('pagination-unmount-reused'));
        expect(screen.queryByTestId('pagination-reused-link')).toBeNull();

        await fireEvent.click(screen.getByTestId('pagination-remount-reused-enabled'));
        const remountedLink = screen.getByTestId('pagination-reused-link');
        expect(remountedLink).not.toHaveAttribute('aria-disabled');
        expect(remountedLink).toHaveAttribute('tabindex', '0');
    });

    it('moves active and disabled registration with item identity and cleans it on unmount', async () => {
        render(PaginationIdentityTest);

        expect(screen.getByTestId('active-item')).toHaveClass('active');
        expect(screen.getByTestId('disabled-link')).toHaveAttribute('aria-disabled', 'true');

        await fireEvent.click(screen.getByTestId('change-identities'));

        expect(screen.getByTestId('active-item')).toHaveClass('active');
        expect(screen.getByTestId('disabled-link')).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByTestId('old-active-reuse')).not.toHaveClass('active');
        expect(screen.getByTestId('old-disabled-reuse-link')).not.toHaveAttribute('aria-disabled');

        await fireEvent.click(screen.getByTestId('replace-current-identities'));

        expect(screen.queryByTestId('active-item')).not.toBeInTheDocument();
        expect(screen.queryByTestId('disabled-item')).not.toBeInTheDocument();
        expect(screen.getByTestId('new-active-reuse')).not.toHaveClass('active');
        expect(screen.getByTestId('new-disabled-reuse-link')).not.toHaveAttribute('aria-disabled');
    });

    it('cleans click-activated state when a stateful item changes identity or unmounts', async () => {
        render(PaginationIdentityTest);

        await fireEvent.click(screen.getByTestId('stateful-link'));
        expect(screen.getByTestId('stateful-item')).toHaveClass('active');

        await fireEvent.click(screen.getByTestId('change-stateful-identity'));
        expect(screen.getByTestId('stateful-item')).not.toHaveClass('active');
        expect(screen.getByTestId('old-stateful-reuse')).not.toHaveClass('active');

        await fireEvent.click(screen.getByTestId('stateful-link'));
        expect(screen.getByTestId('stateful-item')).toHaveClass('active');

        await fireEvent.click(screen.getByTestId('replace-stateful-identity'));
        expect(screen.queryByTestId('stateful-item')).not.toBeInTheDocument();
        expect(screen.getByTestId('new-stateful-reuse')).not.toHaveClass('active');
    });
});

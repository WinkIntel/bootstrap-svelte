import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import BreadcrumbAnchorPropsTest from './breadcrumb-anchor-props-test.svelte';

describe('Breadcrumb.Item anchorProps', () => {
    it('forwards link attributes and events to the anchor, not its list item', async () => {
        const onclick = vi.fn((event: MouseEvent) => event.preventDefault());
        render(BreadcrumbAnchorPropsTest, {
            href: '/library',
            anchorProps: {
                class: 'link-secondary text-decoration-underline',
                target: '_blank',
                rel: 'noopener',
                'aria-label': 'Browse the library',
                'data-sveltekit-preload-data': 'hover',
                onclick
            }
        });

        const link = screen.getByRole('link', { name: 'Browse the library' });
        const item = screen.getByTestId('item');
        expect(link).toHaveAttribute('href', '/library');
        expect(link).toHaveClass('link-secondary', 'text-decoration-underline');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener');
        expect(link).toHaveAttribute('data-sveltekit-preload-data', 'hover');
        expect(item).toHaveClass('breadcrumb-item', 'item-class');
        expect(item).not.toHaveClass('link-secondary');
        expect(item).not.toHaveAttribute('target');
        expect(item).not.toHaveAttribute('aria-label');
        expect(item).not.toHaveAttribute('anchorProps');
        await fireEvent.click(link);
        expect(onclick).toHaveBeenCalledOnce();
    });

    it('uses the top-level href even when a JavaScript object supplies anchorProps.href', () => {
        render(BreadcrumbAnchorPropsTest, { href: '/library', anchorProps: { href: '/overridden' } });
        expect(screen.getByRole('link')).toHaveAttribute('href', '/library');
    });

    it('preserves the default href when anchorProps is omitted', () => {
        render(BreadcrumbAnchorPropsTest);
        expect(screen.getByRole('link')).toHaveAttribute('href', '#!');
    });

    it('ignores anchorProps for active items and applies updated props when rendered as a link', async () => {
        const onclick = vi.fn();
        const { rerender } = render(BreadcrumbAnchorPropsTest, {
            isActive: true,
            anchorProps: { class: 'link-danger', target: '_blank', onclick }
        });
        const item = screen.getByTestId('item');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(item).toHaveAttribute('aria-current', 'page');
        expect(item).not.toHaveAttribute('target');
        expect(item).not.toHaveClass('link-danger');
        await fireEvent.click(item);
        expect(onclick).not.toHaveBeenCalled();

        await rerender({ isActive: false, href: '/updated', anchorProps: { class: 'link-success' } });
        expect(screen.getByRole('link')).toHaveAttribute('href', '/updated');
        expect(screen.getByRole('link')).toHaveClass('link-success');
        expect(screen.getByRole('link')).not.toHaveAttribute('target');
    });
});

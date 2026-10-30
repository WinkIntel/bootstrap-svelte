import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { Nav } from '../index.js';
import NavBasicTest from './nav-basic-test.svelte';
import NavTabRoleTest from './nav-tab-role-test.svelte';

const styles = [undefined, 'tabs', 'pills', 'underline'] as const;
const elements = ['ul', 'ol', 'nav'] as const;

describe('Nav root semantics', () => {
    it.each(elements.flatMap((elementType) => styles.map((itemStyle) => ({ elementType, itemStyle }))))(
        'preserves native $elementType semantics for ordinary $itemStyle navigation',
        ({ elementType, itemStyle }) => {
            render(Nav.Root, { elementType, itemStyle, verticalBreakpoint: 'xs' });
            const nav = screen.getByRole(elementType === 'nav' ? 'navigation' : 'list');
            expect(nav.tagName.toLowerCase()).toBe(elementType);
            expect(nav).not.toHaveAttribute('role');
            expect(nav).not.toHaveAttribute('aria-orientation');
            expect(nav).toHaveClass('flex-column');
        }
    );

    it('keeps ordinary list items and links in their native roles', () => {
        render(NavBasicTest);
        const nav = screen.getByTestId('basic-nav');
        expect(nav).not.toHaveAttribute('role');
        expect(within(nav).getAllByRole('listitem')).toHaveLength(4);
        expect(within(nav).getAllByRole('link')).toHaveLength(4);
    });

    it('preserves an explicit role outside Tab context', () => {
        render(Nav.Root, { elementType: 'nav', role: 'navigation' });
        expect(screen.getByRole('navigation')).toHaveAttribute('role', 'navigation');
    });

    it.each(styles)('defaults %s Tab navigation to a tablist with tab children', (itemStyle) => {
        render(NavTabRoleTest, { itemStyle });
        const nav = screen.getByRole('tablist', { name: 'Example panes' });
        expect(nav).toHaveAttribute('role', 'tablist');
        expect(within(nav).getAllByRole('tab')).toHaveLength(2);
        expect(nav.querySelectorAll('li[role="presentation"]')).toHaveLength(2);
    });

    it('honors explicit roles and null opt-out through reactive updates', async () => {
        const { rerender } = render(NavTabRoleTest, { itemStyle: 'pills', verticalBreakpoint: 'xs' });
        const nav = screen.getByTestId('role-tab-nav');
        expect(nav).toHaveAttribute('role', 'tablist');
        expect(nav).toHaveAttribute('aria-orientation', 'vertical');

        await rerender({ role: null });
        expect(nav).not.toHaveAttribute('role');
        expect(nav).not.toHaveAttribute('aria-orientation');

        await rerender({ role: 'navigation' });
        expect(nav).toHaveAttribute('role', 'navigation');
        expect(nav).not.toHaveAttribute('aria-orientation');

        await rerender({ role: undefined, ariaOrientation: 'horizontal' });
        expect(nav).toHaveAttribute('role', 'tablist');
        expect(nav).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('preserves tab selection and context through repeated style changes', async () => {
        const { rerender } = render(NavTabRoleTest, { itemStyle: 'tabs' });
        const nav = screen.getByTestId('role-tab-nav');
        for (const itemStyle of ['pills', 'underline', 'tabs', 'pills'] as const) {
            await rerender({ itemStyle });
            expect(screen.getByRole('tablist')).toBe(nav);
            expect(nav).toHaveClass(`nav-${itemStyle}`);
            for (const name of ['Two', 'One', 'Two'] as const) {
                const tab = within(nav).getByRole('tab', { name });
                await fireEvent.click(tab);
                expect(tab).toHaveAttribute('aria-selected', 'true');
                expect(screen.getByRole('tabpanel')).toHaveTextContent(name === 'One' ? 'First pane' : 'Second pane');
            }
        }
    });

    it('does not leak tab context after unmount and recreates it on remount', async () => {
        const tabView = render(NavTabRoleTest, { itemStyle: 'underline' });
        expect(screen.getByRole('tablist')).toBeInTheDocument();
        await tabView.unmount();
        const ordinary = render(Nav.Root, { itemStyle: 'tabs' });
        expect(screen.getByRole('list')).not.toHaveAttribute('role');
        await ordinary.unmount();
        render(NavTabRoleTest, { itemStyle: 'pills' });
        expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
});

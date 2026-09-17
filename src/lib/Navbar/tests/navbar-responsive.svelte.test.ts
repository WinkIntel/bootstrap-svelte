import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import NavbarResponsiveTest from './navbar-responsive-test.svelte';

// Model the browser boundary, including obsolete-query events and subscription disposal.
function mockViewport(width: number) {
    const original = window.matchMedia;
    onTestFinished(() => {
        window.matchMedia = original;
    });
    const queries = new Map<string, { list: MediaQueryList; listeners: Set<EventListenerOrEventListenerObject> }>();
    window.matchMedia = vi.fn((query: string) => {
        let entry = queries.get(query);
        if (!entry) {
            const minimum = query.match(/min-width:\s*([\d.]+)px/);
            const maximum = query.match(/max-width:\s*([\d.]+)px/);
            const listeners = new Set<EventListenerOrEventListenerObject>();
            const list = Object.assign(new EventTarget(), {
                media: query,
                matches: (!minimum || width >= Number(minimum[1])) && (!maximum || width <= Number(maximum[1])),
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn()
            });
            const add = list.addEventListener.bind(list);
            const remove = list.removeEventListener.bind(list);
            list.addEventListener = (type, listener, options) => {
                if (type === 'change' && listener) listeners.add(listener);
                add(type, listener, options);
            };
            list.removeEventListener = (type, listener, options) => {
                if (type === 'change' && listener) listeners.delete(listener);
                remove(type, listener, options);
            };
            entry = { list, listeners };
            queries.set(query, entry);
        }
        return entry.list;
    });
    return {
        emit(query: string, matches: boolean) {
            const entry = queries.get(query);
            if (!entry) throw new Error(`Query was never created: ${query}`);
            Object.defineProperty(entry.list, 'matches', { value: matches, configurable: true });
            entry.list.dispatchEvent(new Event('change'));
        },
        listenerCount(query: string) {
            return queries.get(query)?.listeners.size ?? 0;
        },
        totalListeners() {
            return [...queries.values()].reduce((sum, entry) => sum + entry.listeners.size, 0);
        }
    };
}

function expectExpanded(expanded: boolean) {
    const toggler = screen.getByTestId('responsive-toggler');
    expect(toggler).toHaveAttribute('aria-expanded', String(expanded));
    if (expanded) {
        expect(toggler).not.toHaveClass('collapsed');
        expect(screen.getByTestId('responsive-collapse')).toHaveClass('show');
        expect(screen.getByTestId('responsive-offcanvas')).toHaveClass('show');
    } else {
        expect(toggler).toHaveClass('collapsed');
        expect(screen.queryByTestId('responsive-collapse')).not.toBeInTheDocument();
        expect(screen.queryByTestId('responsive-offcanvas')).not.toBeInTheDocument();
    }
}

function expectInline() {
    expectExpanded(true);
    expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
    expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    expect(document.body.style.overflow).toBe('');
}

const lg = '(min-width: 992px)';
const md = '(min-width: 768px)';

describe('Navbar responsive state', () => {
    it('updates lg → md → lg at 800px without remounting', async () => {
        mockViewport(800);
        const { rerender } = render(NavbarResponsiveTest, { expandOnBreakpoint: 'lg' });
        const navbar = screen.getByTestId('responsive-navbar');
        expectExpanded(false);
        await rerender({ expandOnBreakpoint: 'md' });
        await waitFor(expectInline);
        expect(navbar).toHaveClass('navbar-expand-md');
        expect(navbar).not.toHaveClass('navbar-expand-lg');
        await rerender({ expandOnBreakpoint: 'lg' });
        await waitFor(() => expectExpanded(false));
        expect(screen.getByTestId('responsive-navbar')).toBe(navbar);
        expect(navbar).toHaveClass('navbar-expand-lg');
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    });

    it('detaches obsolete queries, responds to the replacement and disposes all subscriptions', async () => {
        const viewport = mockViewport(800);
        const { rerender, unmount } = render(NavbarResponsiveTest, { expandOnBreakpoint: 'md' });
        await waitFor(expectInline);
        await rerender({ expandOnBreakpoint: 'lg' });
        await waitFor(() => expectExpanded(false));
        await waitFor(() => expect(viewport.listenerCount(md)).toBe(0));
        expect(viewport.listenerCount(lg)).toBeGreaterThan(0);
        viewport.emit(md, false);
        viewport.emit(md, true);
        await tick();
        expectExpanded(false);
        viewport.emit(lg, true);
        await waitFor(expectInline);
        viewport.emit(lg, false);
        await waitFor(() => expectExpanded(false));
        await rerender({ expandOnBreakpoint: 'xs' });
        await waitFor(expectInline);
        await waitFor(() => expect(viewport.listenerCount(lg)).toBe(0));
        viewport.emit(lg, true);
        viewport.emit(lg, false);
        await tick();
        expectInline();
        await rerender({ expandOnBreakpoint: 'md' });
        await waitFor(() => expect(viewport.listenerCount(md)).toBeGreaterThan(0));
        await unmount();
        await waitFor(() => expect(viewport.totalListeners()).toBe(0));
    });

    it.each([
        [undefined, 390],
        [undefined, 575.98],
        [undefined, 576],
        [undefined, 1280],
        ['xs', 390],
        ['xs', 575.98],
        ['xs', 576],
        ['xs', 1280]
    ] as const)('treats %s as inline navigation at %spx', async (expandOnBreakpoint, width) => {
        mockViewport(width);
        render(NavbarResponsiveTest, { expandOnBreakpoint });
        await waitFor(expectInline);
        expect(screen.getByTestId('responsive-navbar')).toHaveClass('navbar-expand');
        expect(screen.getByTestId('responsive-navbar')).not.toHaveClass('navbar-expand-xs');
        expect(screen.getByTestId('responsive-offcanvas')).toHaveClass('offcanvas');
    });

    it('updates a collapse-only Navbar independently of Offcanvas', async () => {
        mockViewport(800);
        const { rerender } = render(NavbarResponsiveTest, { expandOnBreakpoint: 'lg', withOffcanvas: false });
        expect(screen.getByTestId('responsive-toggler')).toHaveAttribute('aria-expanded', 'false');
        await rerender({ expandOnBreakpoint: undefined });
        expect(screen.getByTestId('responsive-navbar')).toHaveClass('navbar-expand');
        expect(screen.getByTestId('responsive-toggler')).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByTestId('responsive-collapse')).toHaveClass('show');
        await rerender({ expandOnBreakpoint: 'lg' });
        await waitFor(() => expect(screen.queryByTestId('responsive-collapse')).not.toBeInTheDocument());
        expect(screen.getByTestId('responsive-toggler')).toHaveAttribute('aria-expanded', 'false');
    });

    it('switches at the sm boundary and can close a phone overlay', async () => {
        const viewport = mockViewport(575.98);
        render(NavbarResponsiveTest, { expandOnBreakpoint: 'sm' });
        expectExpanded(false);
        await fireEvent.click(screen.getByTestId('responsive-toggler'));
        await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
        await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expectExpanded(false));
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        viewport.emit('(min-width: 576px)', true);
        await waitFor(expectInline);
    });

    it('releases a toggled overlay on entering inline mode and collapses on returning', async () => {
        mockViewport(800);
        const { rerender } = render(NavbarResponsiveTest, { expandOnBreakpoint: 'lg' });
        await fireEvent.click(screen.getByTestId('responsive-toggler'));
        await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
        expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
        await rerender({ expandOnBreakpoint: 'md' });
        await waitFor(expectInline);
        await rerender({ expandOnBreakpoint: 'lg' });
        await waitFor(() => expectExpanded(false));
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    });

    it.each([true, false])('preserves an explicit visibility update to %s during inline mode', async (isShown) => {
        mockViewport(800);
        const { rerender } = render(NavbarResponsiveTest, { expandOnBreakpoint: 'md', isShown: false });
        await waitFor(expectInline);
        await rerender({ isShown: true });
        if (!isShown) await rerender({ isShown: false });
        await rerender({ expandOnBreakpoint: 'lg' });
        await waitFor(() => expectExpanded(isShown));
        if (isShown) {
            await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
            expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
            await rerender({ expandOnBreakpoint: 'xs' });
            await waitFor(expectInline);
            await rerender({ expandOnBreakpoint: 'lg' });
            await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
        } else {
            expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        }
    });

    it('honors initially explicit visibility when leaving inline mode', async () => {
        mockViewport(800);
        const { rerender } = render(NavbarResponsiveTest, { expandOnBreakpoint: 'md', isShown: true });
        await waitFor(expectInline);
        await rerender({ expandOnBreakpoint: 'lg' });
        await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
        expectExpanded(true);
        await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expectExpanded(false));
    });
});

import { mockMatchMedia } from '$lib/common/tests/mock-match-media.js';
import { BreakpointMinimumMediaQuery } from '$lib/common/types.js';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import NavbarResponsiveTest from './navbar-responsive-test.svelte';
import { Navbar, Offcanvas } from '$lib/index.js';

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

const lg = BreakpointMinimumMediaQuery.lg!;
const md = BreakpointMinimumMediaQuery.md!;

describe('Navbar responsive state', () => {
    it('updates lg → md → lg at 800px without remounting', async () => {
        mockMatchMedia(800);
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
        const viewport = mockMatchMedia(800);
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
        mockMatchMedia(width);
        render(NavbarResponsiveTest, { expandOnBreakpoint });
        await waitFor(expectInline);
        expect(screen.getByTestId('responsive-navbar')).toHaveClass('navbar-expand');
        expect(screen.getByTestId('responsive-navbar')).not.toHaveClass('navbar-expand-xs');
        expect(screen.getByTestId('responsive-offcanvas')).toHaveClass('offcanvas');
    });

    it('updates a collapse-only Navbar independently of Offcanvas', async () => {
        mockMatchMedia(800);
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
        const viewport = mockMatchMedia(575.98);
        render(NavbarResponsiveTest, { expandOnBreakpoint: 'sm' });
        expectExpanded(false);
        await fireEvent.click(screen.getByTestId('responsive-toggler'));
        await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
        await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expectExpanded(false));
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        viewport.emit(BreakpointMinimumMediaQuery.sm!, true);
        await waitFor(expectInline);
    });

    it('releases a toggled overlay on entering inline mode and collapses on returning', async () => {
        mockMatchMedia(800);
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
        mockMatchMedia(800);
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
        mockMatchMedia(800);
        const { rerender } = render(NavbarResponsiveTest, { expandOnBreakpoint: 'md', isShown: true });
        await waitFor(expectInline);
        await rerender({ expandOnBreakpoint: 'lg' });
        await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
        expectExpanded(true);
        await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expectExpanded(false));
    });
});

describe('PR 32 review regressions', () => {
    it.each([
        ['md', 'lg', 800],
        [undefined, 'lg', 800],
        ['lg', 'xl', 1000]
    ] as const)('does not let Navbar %s force an unmatched Offcanvas %s open at %spx', async (expandOnBreakpoint, showOnBreakpoint, width) => {
        mockMatchMedia(width);
        const { rerender } = render(NavbarResponsiveTest, { expandOnBreakpoint, showOnBreakpoint });
        expect(screen.queryByTestId('responsive-offcanvas')).not.toBeInTheDocument();
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        await rerender({ isShown: true });
        await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
        await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(screen.queryByTestId('responsive-offcanvas')).not.toBeInTheDocument());
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        await rerender({ isShown: false });
        await rerender({ isShown: true });
        await waitFor(() => expect(screen.getByTestId('responsive-offcanvas')).toHaveClass('show'));
        await fireEvent.keyDown(document, { key: 'Escape' });
        await waitFor(() => expect(screen.queryByTestId('responsive-offcanvas')).not.toBeInTheDocument());
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    });

    it.each([390, 1280])('supports never-expanded navigation at %spx', async (width) => {
        mockMatchMedia(width);
        const { rerender } = render(NavbarResponsiveTest, { expandOnBreakpoint: false });
        expect(screen.getByTestId('responsive-navbar')).toHaveClass('navbar');
        expect(screen.getByTestId('responsive-navbar').className).not.toContain('navbar-expand');
        expectExpanded(false);
        await fireEvent.click(screen.getByTestId('responsive-toggler'));
        await waitFor(() => expectExpanded(true));
        await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expectExpanded(false));
        await rerender({ expandOnBreakpoint: 'xs' });
        await waitFor(expectInline);
        await rerender({ expandOnBreakpoint: false });
        await waitFor(() => expectExpanded(false));
    });

    it.each([null, '', 'xxxl', '__proto__'])('normalizes malformed Navbar breakpoint %s on mount and update', async (invalid) => {
        mockMatchMedia(800);
        const value = invalid as Navbar.RootProps['expandOnBreakpoint'];
        const { rerender } = render(NavbarResponsiveTest, { expandOnBreakpoint: value });
        await waitFor(expectInline);
        expect(screen.getByTestId('responsive-navbar')).toHaveClass('navbar-expand');
        expect(screen.getByTestId('responsive-navbar').className).not.toContain('navbar-expand-');
        await rerender({ expandOnBreakpoint: 'lg' });
        await waitFor(() => expectExpanded(false));
        await rerender({ expandOnBreakpoint: value });
        await waitFor(expectInline);
        expect(screen.getByTestId('responsive-navbar')).toHaveClass('navbar-expand');
    });

    it.each(['', 'xxxl', '__proto__'])('normalizes malformed Offcanvas breakpoint %s and resumes inheritance', async (invalid) => {
        mockMatchMedia(800);
        const value = invalid as Offcanvas.RootProps['showOnBreakpoint'];
        const { rerender, unmount } = render(NavbarResponsiveTest, { expandOnBreakpoint: 'md', showOnBreakpoint: value });
        await waitFor(expectInline);
        expect(screen.getByTestId('responsive-offcanvas')).toHaveClass('offcanvas');
        await rerender({ showOnBreakpoint: 'lg' });
        await waitFor(() => expect(screen.queryByTestId('responsive-offcanvas')).not.toBeInTheDocument());
        await rerender({ showOnBreakpoint: value });
        await waitFor(expectInline);
        await unmount();
        render(Offcanvas.Root, { isShown: true, showOnBreakpoint: value });
        expect(screen.getByRole('dialog')).toHaveClass('offcanvas');
        await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
    });

    it('never reacquires an overlay scroll lock on the downward cross of a toggler-opened menu', async () => {
        const viewport = mockMatchMedia(800);
        render(NavbarResponsiveTest, { expandOnBreakpoint: 'lg' });
        await fireEvent.click(screen.getByTestId('responsive-toggler'));
        await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
        viewport.emit(lg, true);
        await waitFor(expectInline);
        const setAttribute = vi.spyOn(document.body, 'setAttribute');
        onTestFinished(() => setAttribute.mockRestore());
        viewport.emit(lg, false);
        await tick();
        expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
        await waitFor(() => expectExpanded(false));
        expect(setAttribute.mock.calls.filter(([name]) => name === 'data-scrollbar-lock-count')).toEqual([]);
    });

    it('treats later user actions as replacing an earlier explicit visibility assignment', async () => {
        const viewport = mockMatchMedia(800);
        const { rerender } = render(NavbarResponsiveTest, { expandOnBreakpoint: 'lg', isShown: true });
        await waitFor(() => expectExpanded(true));
        await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expectExpanded(false));
        await rerender({ isShown: true });
        expectExpanded(false);
        await fireEvent.click(screen.getByTestId('responsive-toggler'));
        await waitFor(() => expectExpanded(true));
        viewport.emit(lg, true);
        await waitFor(expectInline);
        viewport.emit(lg, false);
        await waitFor(() => expectExpanded(false));
        await rerender({ isShown: false });
        await rerender({ isShown: true });
        await waitFor(() => expectExpanded(true));
    });
});

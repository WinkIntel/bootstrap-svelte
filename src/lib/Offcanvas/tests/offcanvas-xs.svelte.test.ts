import { mockMatchMedia } from '$lib/common/tests/mock-match-media.js';
import { BreakpointMinimumMediaQuery } from '$lib/common/types.js';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import type { OffcanvasBreakpoint } from '../types.js';
import NavbarResponsiveTest from '../../Navbar/tests/navbar-responsive-test.svelte';
import OffcanvasXsTest from './offcanvas-xs-test.svelte';

// Exercise legacy/untyped consumers after xs is removed from the public Offcanvas type.
const legacyXs = 'xs' as OffcanvasBreakpoint;

describe('legacy Offcanvas xs normalization', () => {
    it.each([390, 575.98, 576, 1280])('behaves as a dismissible standalone overlay at %spx', async (width) => {
        mockMatchMedia(width);
        const { rerender } = render(OffcanvasXsTest, { showOnBreakpoint: legacyXs });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        await rerender({ isShown: true });
        expect(screen.getByRole('dialog')).toHaveClass('offcanvas', 'show');
        expect(screen.getByRole('dialog')).not.toHaveClass('offcanvas-xs');
        expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
        await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
        await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    });

    it.each([
        [undefined, 390],
        [undefined, 576],
        [undefined, 1280],
        ['xs', 390],
        ['xs', 576],
        ['xs', 1280]
    ] as const)('inherits Navbar %s as reachable inline content at %spx', async (expandOnBreakpoint, width) => {
        mockMatchMedia(width);
        render(NavbarResponsiveTest, { expandOnBreakpoint, showOnBreakpoint: legacyXs });
        await waitFor(() => expect(screen.getByTestId('responsive-offcanvas')).toHaveClass('offcanvas', 'show'));
        expect(screen.getByTestId('responsive-offcanvas')).not.toHaveClass('offcanvas-xs');
        expect(screen.getByTestId('responsive-navbar')).toHaveClass('navbar-expand');
        expect(screen.getByTestId('responsive-toggler')).toHaveAttribute('aria-expanded', 'true');
        expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    });

    it.each([390, 1280])('inherits a never-inline Navbar and can open, close, and reopen at %spx', async (width) => {
        mockMatchMedia(width);
        render(NavbarResponsiveTest, { expandOnBreakpoint: false, showOnBreakpoint: legacyXs });
        expect(screen.queryByTestId('responsive-offcanvas')).not.toBeInTheDocument();
        const toggler = screen.getByTestId('responsive-toggler');
        expect(toggler).toHaveAttribute('aria-expanded', 'false');
        await fireEvent.click(toggler);
        await waitFor(() => expect(screen.getByTestId('responsive-offcanvas')).toHaveClass('offcanvas', 'show'));
        expect(screen.getByTestId('responsive-offcanvas')).not.toHaveClass('offcanvas-xs');
        expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
        expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');
        await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(screen.queryByTestId('responsive-offcanvas')).not.toBeInTheDocument());
        await waitFor(() => expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument());
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        await fireEvent.click(toggler);
        await waitFor(() => expect(screen.getByTestId('responsive-offcanvas')).toHaveClass('offcanvas', 'show'));
        expect(toggler).toHaveAttribute('aria-expanded', 'true');
    });

    it('inherits a responsive Navbar and remains dismissible below its breakpoint', async () => {
        const viewport = mockMatchMedia(800);
        render(NavbarResponsiveTest, { expandOnBreakpoint: 'lg', showOnBreakpoint: legacyXs });
        expect(screen.queryByTestId('responsive-offcanvas')).not.toBeInTheDocument();
        await fireEvent.click(screen.getByTestId('responsive-toggler'));
        await waitFor(() => expect(screen.getByTestId('responsive-offcanvas')).toHaveClass('offcanvas', 'show'));
        await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(screen.queryByTestId('responsive-offcanvas')).not.toBeInTheDocument());
        await waitFor(() => expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument());
        viewport.emit(BreakpointMinimumMediaQuery.lg!, true);
        await waitFor(() => expect(screen.getByTestId('responsive-offcanvas')).toHaveClass('show'));
        expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    });

    it('closes an implicitly inline panel when its breakpoint becomes legacy xs', async () => {
        const viewport = mockMatchMedia(1280);
        const { rerender } = render(OffcanvasXsTest, { showOnBreakpoint: 'lg' });
        expect(screen.getByRole('dialog')).toHaveClass('offcanvas-lg');
        await rerender({ showOnBreakpoint: legacyXs });
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        viewport.emit(BreakpointMinimumMediaQuery.lg!, false);
        viewport.emit(BreakpointMinimumMediaQuery.lg!, true);
        await tick();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        await rerender({ showOnBreakpoint: 'lg' });
        expect(screen.getByRole('dialog')).toHaveClass('offcanvas-lg');
    });

    it('clears the old query when lg changes to legacy xs and preserves explicit visibility', async () => {
        const viewport = mockMatchMedia(1280);
        const { rerender } = render(OffcanvasXsTest, { showOnBreakpoint: 'lg', isShown: true });
        expect(screen.getByRole('dialog')).toHaveClass('offcanvas-lg');
        expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
        await rerender({ showOnBreakpoint: legacyXs });
        expect(screen.getByRole('dialog')).toHaveClass('offcanvas');
        await waitFor(() => expect(viewport.listenerCount(BreakpointMinimumMediaQuery.lg!)).toBe(0));
        await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
        viewport.emit(BreakpointMinimumMediaQuery.lg!, false);
        viewport.emit(BreakpointMinimumMediaQuery.lg!, true);
        await tick();
        expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
        await rerender({ showOnBreakpoint: 'lg' });
        await waitFor(() => expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count'));
        expect(screen.getByRole('dialog')).toHaveClass('offcanvas-lg');
    });
});

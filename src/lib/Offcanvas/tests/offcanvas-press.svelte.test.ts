import { mockMatchMedia } from '$lib/common/tests/mock-match-media.js';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import OffcanvasPressTest from './offcanvas-press-test.svelte';
import OffcanvasRefTest from './offcanvas-ref-test.svelte';

describe('Offcanvas panel press containment', () => {
    it.each([
        { showOnBreakpoint: undefined, useBackdrop: true },
        { showOnBreakpoint: undefined, useBackdrop: 'static' },
        { showOnBreakpoint: 'lg', useBackdrop: true },
        { showOnBreakpoint: 'lg', useBackdrop: 'static' }
    ] as const)('keeps inside presses and clicks in the open panel: %j', async ({ showOnBreakpoint, useBackdrop }) => {
        mockMatchMedia(800);
        const onHide = vi.fn();
        const onHidePrevented = vi.fn();
        const onInsideClick = vi.fn();
        render(OffcanvasPressTest, { showOnBreakpoint, useBackdrop, onHide, onHidePrevented, onInsideClick });
        await tick();
        const panel = screen.getByTestId('press-panel');
        expect(panel).toHaveClass(showOnBreakpoint ? 'offcanvas-lg' : 'offcanvas');

        await fireEvent.mouseDown(panel);
        await fireEvent.mouseDown(screen.getByTestId('inside-press'));
        expect(panel).toBeInTheDocument();
        expect(panel).not.toHaveAttribute('inert');
        expect(onHide).not.toHaveBeenCalled();
        expect(onHidePrevented).not.toHaveBeenCalled();

        await userEvent.setup().click(screen.getByTestId('inside-press'));
        expect(onInsideClick).toHaveBeenCalledTimes(1);
        expect(panel).toBeInTheDocument();
        expect(panel).not.toHaveAttribute('inert');
        expect(onHide).not.toHaveBeenCalled();
        expect(onHidePrevented).not.toHaveBeenCalled();
    });

    it.each([true, 'static'] as const)('keeps containment when a one-way elementRef prop changes with backdrop %s', async (useBackdrop) => {
        mockMatchMedia(800);
        const onHide = vi.fn();
        const onHidePrevented = vi.fn();
        const onInsideClick = vi.fn();
        const { rerender } = render(OffcanvasPressTest, { showOnBreakpoint: 'lg', useBackdrop, onHide, onHidePrevented, onInsideClick });
        await tick();
        // A consumer-provided ref must not replace the panel's containment identity.
        await rerender({ elementRef: document.createElement('div') });
        await userEvent.setup().click(screen.getByTestId('inside-press'));
        expect(onInsideClick).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('press-panel')).not.toHaveAttribute('inert');
        expect(onHide).not.toHaveBeenCalled();
        expect(onHidePrevented).not.toHaveBeenCalled();
    });

    it('preserves bind:elementRef across panel mount, dismissal, reopening, and component removal', async () => {
        const onReference = vi.fn();
        const { rerender } = render(OffcanvasRefTest, { onReference });
        const originalPanel = screen.getByTestId('bound-panel');
        await waitFor(() => expect(onReference).toHaveBeenLastCalledWith(originalPanel));
        await rerender({ isShown: false });
        await waitFor(() => expect(screen.queryByTestId('bound-panel')).not.toBeInTheDocument());
        await waitFor(() => expect(onReference.mock.lastCall?.[0]).toBeFalsy());
        await rerender({ isShown: true });
        await waitFor(() => expect(screen.getByTestId('bound-panel')).toBeInTheDocument());
        const reopenedPanel = screen.getByTestId('bound-panel');
        expect(reopenedPanel).not.toBe(originalPanel);
        await waitFor(() => expect(onReference).toHaveBeenLastCalledWith(reopenedPanel));
        await rerender({ renderPanel: false });
        await waitFor(() => expect(onReference.mock.lastCall?.[0]).toBeFalsy());
    });

    // No-backdrop is an early-return baseline, not coverage of the containment guard.
    it.each([true, 'static', false] as const)('preserves outside-press behavior with responsive backdrop %s', async (useBackdrop) => {
        mockMatchMedia(800);
        const onHide = vi.fn();
        const onHidePrevented = vi.fn();
        render(OffcanvasPressTest, { showOnBreakpoint: 'lg', useBackdrop, onHide, onHidePrevented });
        await tick();
        await fireEvent.mouseDown(document.body);

        if (useBackdrop === true) {
            await waitFor(() => expect(screen.queryByTestId('press-panel')).not.toBeInTheDocument());
            expect(onHide).toHaveBeenCalledTimes(1);
        } else {
            expect(screen.getByTestId('press-panel')).toBeInTheDocument();
            expect(onHide).not.toHaveBeenCalled();
        }
        expect(onHidePrevented).toHaveBeenCalledTimes(useBackdrop === 'static' ? 1 : 0);
    });

    it.each([true, 'static'] as const)('recognizes composed presses from a shadow descendant with backdrop %s', async (useBackdrop) => {
        mockMatchMedia(800);
        const onHide = vi.fn();
        const onHidePrevented = vi.fn();
        render(OffcanvasPressTest, { showOnBreakpoint: 'lg', useBackdrop, onHide, onHidePrevented });
        await tick();
        const shadow = screen.getByTestId('shadow-host').attachShadow({ mode: 'open' });
        const button = document.createElement('button');
        shadow.append(button);
        await fireEvent(button, new MouseEvent('mousedown', { bubbles: true, composed: true, button: 0 }));
        // Allow any incorrectly started outro to become observable before checking containment.
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await tick();
        expect(screen.getByTestId('press-panel')).toBeInTheDocument();
        expect(screen.getByTestId('press-panel')).not.toHaveAttribute('inert');
        expect(onHide).not.toHaveBeenCalled();
        expect(onHidePrevented).not.toHaveBeenCalled();
    });
});

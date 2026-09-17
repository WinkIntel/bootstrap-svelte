import { fireEvent, render, waitFor, within } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import OffcanvasNavbarTest from './offcanvas-navbar-test.svelte';

describe('Navbar Offcanvas ownership', () => {
    it.each([true, false, 'static'] as const)('toggles once per full pointer click with backdrop %s', async (useBackdrop) => {
        const user = userEvent.setup();
        const onShown = vi.fn();
        const onHidden = vi.fn();
        const onHidePrevented = vi.fn();
        const { getByTestId, queryByTestId } = render(OffcanvasNavbarTest, {
            props: { useBackdrop, onShown, onHidden, onHidePrevented }
        });
        const toggler = getByTestId('navbar-toggler');
        // Clicking the icon must recognize ownership just like clicking the button.
        const icon = toggler.querySelector('span')!;

        await user.click(icon);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        expect(toggler).toHaveAttribute('aria-expanded', 'true');
        expect(toggler).not.toHaveClass('collapsed');
        await user.click(icon);
        await waitFor(() => expect(onHidden).toHaveBeenCalledTimes(1));
        expect(queryByTestId('navbar-offcanvas')).not.toBeInTheDocument();
        expect(toggler).toHaveAttribute('aria-expanded', 'false');
        expect(toggler).toHaveClass('collapsed');
        await user.click(icon);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(2));
        expect(getByTestId('navbar-offcanvas')).toHaveClass('show');
        expect(toggler).toHaveAttribute('aria-expanded', 'true');
        expect(toggler).not.toHaveClass('collapsed');
        expect(onHidePrevented).not.toHaveBeenCalled();

        await user.click(getByTestId('navbar-offcanvas'));
        expect(onHidden).toHaveBeenCalledTimes(1);
        expect(onHidePrevented).not.toHaveBeenCalled();
        if (useBackdrop === 'static') {
            await user.click(document.querySelector('.offcanvas-backdrop')!);
            expect(onHidePrevented).toHaveBeenCalledTimes(1);
            expect(getByTestId('navbar-offcanvas')).toHaveClass('show');
        }
    });

    it('registers the generated panel id before opening, follows id changes, and cleans up on removal', async () => {
        const user = userEvent.setup();
        const onShown = vi.fn();
        const { getByTestId, rerender } = render(OffcanvasNavbarTest, { props: { onShown } });
        const toggler = getByTestId('navbar-toggler');
        const generatedId = toggler.getAttribute('aria-controls');
        expect(toggler).toHaveAttribute('aria-controls', expect.stringMatching(/^offcanvas-/));
        await user.click(toggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        expect(getByTestId('navbar-offcanvas')).toHaveAttribute('id', generatedId);

        await rerender({ id: 'renamed-panel' });
        expect(toggler).toHaveAttribute('aria-controls', 'renamed-panel');
        expect(getByTestId('navbar-offcanvas')).toHaveAttribute('id', 'renamed-panel');
        await rerender({ renderOffcanvas: false });
        expect(toggler).not.toHaveAttribute('aria-controls');
        await rerender({ renderOffcanvas: true, id: 'replacement-panel' });
        expect(toggler).toHaveAttribute('aria-controls', 'replacement-panel');
    });

    it('preserves consumer aria-controls through panel updates and teardown', async () => {
        const { getByTestId, rerender } = render(OffcanvasNavbarTest, {
            props: { id: 'panel', ariaControls: 'consumer-target' }
        });
        const toggler = getByTestId('navbar-toggler');
        expect(toggler).toHaveAttribute('aria-controls', 'consumer-target');
        await rerender({ id: 'renamed-panel' });
        expect(toggler).toHaveAttribute('aria-controls', 'consumer-target');
        await rerender({ ariaControls: undefined });
        expect(toggler).toHaveAttribute('aria-controls', 'renamed-panel');
        await rerender({ ariaControls: 'consumer-target', renderOffcanvas: false });
        expect(toggler).toHaveAttribute('aria-controls', 'consumer-target');
    });

    it('restores a remaining collapse registration after the offcanvas is removed', async () => {
        const { getByTestId, rerender } = render(OffcanvasNavbarTest, {
            props: { id: 'panel', renderCollapse: true }
        });
        const toggler = getByTestId('navbar-toggler');
        expect(toggler).toHaveAttribute('aria-controls', 'panel');
        await rerender({ id: 'renamed-panel' });
        expect(toggler).toHaveAttribute('aria-controls', 'renamed-panel');
        await rerender({ renderOffcanvas: false });
        expect(toggler).toHaveAttribute('aria-controls', 'fallback-collapse');
        await rerender({ renderCollapse: false });
        expect(toggler).not.toHaveAttribute('aria-controls');
    });

    it('keeps registration precedence when an earlier panel id changes', async () => {
        const { getByTestId, rerender } = render(OffcanvasNavbarTest, {
            props: { id: 'panel', renderFollowingCollapse: true }
        });
        const toggler = getByTestId('navbar-toggler');
        expect(toggler).toHaveAttribute('aria-controls', 'following-collapse');
        await rerender({ id: 'renamed-panel' });
        expect(toggler).toHaveAttribute('aria-controls', 'following-collapse');
        await rerender({ renderFollowingCollapse: false });
        expect(toggler).toHaveAttribute('aria-controls', 'renamed-panel');
    });

    it.each([true, 'static'] as const)('does not exempt another Navbar toggler from backdrop %s dismissal', async (useBackdrop) => {
        const user = userEvent.setup();
        const onShown = vi.fn();
        const onHidden = vi.fn();
        const onHidePrevented = vi.fn();
        const first = render(OffcanvasNavbarTest, { props: { id: 'first-panel', useBackdrop, onShown, onHidden, onHidePrevented } });
        const second = render(OffcanvasNavbarTest, { props: { id: 'second-panel' } });
        const firstToggler = within(first.container).getByTestId('navbar-toggler');
        const secondToggler = within(second.container).getByTestId('navbar-toggler');
        expect(firstToggler).toHaveAttribute('aria-controls', 'first-panel');
        expect(secondToggler).toHaveAttribute('aria-controls', 'second-panel');
        await user.click(firstToggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        await user.click(secondToggler);
        expect(secondToggler).toHaveAttribute('aria-expanded', 'true');
        if (useBackdrop === true) {
            await waitFor(() => expect(onHidden).toHaveBeenCalledTimes(1));
            expect(firstToggler).toHaveAttribute('aria-expanded', 'false');
        } else {
            expect(onHidePrevented).toHaveBeenCalledTimes(1);
            expect(firstToggler).toHaveAttribute('aria-expanded', 'true');
        }
    });

    it('removes ownership when a toggler unmounts', async () => {
        const user = userEvent.setup();
        const onShown = vi.fn();
        const onHidden = vi.fn();
        const { getByTestId, rerender } = render(OffcanvasNavbarTest, { props: { useBackdrop: true, onShown, onHidden } });
        const toggler = getByTestId('navbar-toggler');
        await user.click(toggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        await rerender({ renderToggler: false });
        // A consumer retaining the old DOM node must not retain its ownership.
        document.body.append(toggler);
        try {
            await fireEvent.mouseDown(toggler);
            await waitFor(() => expect(onHidden).toHaveBeenCalledTimes(1));
        } finally {
            toggler.remove();
        }
    });
});

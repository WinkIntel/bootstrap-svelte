import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import OffcanvasTriggerTest from './offcanvas-trigger-test.svelte';

describe('Standalone Offcanvas trigger ownership', () => {
    it.each([true, false, 'static'] as const)('opens, closes and reopens once per full click with backdrop %s', async (useBackdrop) => {
        const onShow = vi.fn();
        const onShown = vi.fn();
        const onHide = vi.fn();
        const onHidden = vi.fn();
        const onHidePrevented = vi.fn();
        render(OffcanvasTriggerTest, { useBackdrop, onShow, onShown, onHide, onHidden, onHidePrevented });
        const user = userEvent.setup();
        const trigger = screen.getByTestId('owned-panel-trigger');

        await user.click(trigger);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        await user.click(trigger);
        await waitFor(() => expect(screen.queryByTestId('owned-panel')).not.toBeInTheDocument());
        expect(onHidden).toHaveBeenCalledTimes(1);
        await user.click(trigger);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(2));

        expect(onShow).toHaveBeenCalledTimes(2);
        expect(onHide).toHaveBeenCalledTimes(1);
        expect(onHidePrevented).not.toHaveBeenCalled();
    });

    it('accepts multiple references and leaves visibility unchanged until the consumer click', async () => {
        const onHidePrevented = vi.fn();
        const onHide = vi.fn();
        render(OffcanvasTriggerTest, { onHidePrevented, onHide });
        await userEvent.setup().click(screen.getByTestId('owned-panel-trigger'));
        await screen.findByTestId('owned-panel');
        await fireEvent.mouseDown(screen.getByTestId('owned-panel-alternate'));
        expect(screen.getByTestId('owned-panel')).toBeInTheDocument();
        expect(onHide).not.toHaveBeenCalled();
        expect(onHidePrevented).not.toHaveBeenCalled();
    });

    it.each([true, 'static'] as const)('does not dismiss on an abandoned or cancelled owning press with backdrop %s', async (useBackdrop) => {
        const onHide = vi.fn();
        const onHidePrevented = vi.fn();
        const view = render(OffcanvasTriggerTest, { useBackdrop, onHide, onHidePrevented });
        const user = userEvent.setup();
        const trigger = screen.getByTestId('owned-panel-trigger');
        await user.click(trigger);
        await screen.findByTestId('owned-panel');
        trigger.addEventListener('mousedown', (event) => event.preventDefault(), { once: true });
        await fireEvent.mouseDown(trigger);
        await fireEvent.pointerCancel(trigger);
        await fireEvent.mouseUp(document.body);
        await view.rerender({ cancelClick: true });
        await user.click(trigger);
        expect(screen.getByTestId('owned-panel')).toBeInTheDocument();
        expect(onHide).not.toHaveBeenCalled();
        expect(onHidePrevented).not.toHaveBeenCalled();
        // Cancelling one activation leaves no pending exemption for the next outside press.
        await fireEvent.mouseDown(document.body);
        if (useBackdrop === 'static') expect(onHidePrevented).toHaveBeenCalledTimes(1);
        else await waitFor(() => expect(onHide).toHaveBeenCalledTimes(1));
    });

    it.each([{ disabled: true }, { fieldsetDisabled: true }, { ariaDisabled: true }])(
        'treats a disabled trigger as an outside press: %j',
        async (disabledProps) => {
            const onHidePrevented = vi.fn();
            const view = render(OffcanvasTriggerTest, { onHidePrevented });
            const trigger = screen.getByTestId('owned-panel-trigger');
            await userEvent.setup().click(trigger);
            await screen.findByTestId('owned-panel');
            await view.rerender(disabledProps);
            // Dispatch explicitly: browsers may suppress native disabled-button mouse events.
            await fireEvent.mouseDown(trigger);
            expect(onHidePrevented).toHaveBeenCalledTimes(1);
        }
    );

    it.each([1, 2])('retains outside-press behavior for mouse button %s', async (button) => {
        const onHidePrevented = vi.fn();
        render(OffcanvasTriggerTest, { onHidePrevented });
        const trigger = screen.getByTestId('owned-panel-trigger');
        await userEvent.setup().click(trigger);
        await screen.findByTestId('owned-panel');
        await fireEvent.mouseDown(trigger, { button });
        expect(onHidePrevented).toHaveBeenCalledTimes(1);
    });

    it('does not infer ownership from matching aria-controls or Navbar CSS classes', async () => {
        const onHidePrevented = vi.fn();
        render(OffcanvasTriggerTest, { onHidePrevented });
        await userEvent.setup().click(screen.getByTestId('owned-panel-trigger'));
        await screen.findByTestId('owned-panel');
        await fireEvent.mouseDown(screen.getByTestId('owned-panel-unrelated'));
        expect(onHidePrevented).toHaveBeenCalledTimes(1);
    });

    it('revokes ownership when references are removed and restores it when re-added', async () => {
        const onHidePrevented = vi.fn();
        const view = render(OffcanvasTriggerTest, { onHidePrevented });
        const trigger = screen.getByTestId('owned-panel-trigger');
        await userEvent.setup().click(trigger);
        await screen.findByTestId('owned-panel');
        await view.rerender({ registered: false });
        await fireEvent.mouseDown(trigger);
        expect(onHidePrevented).toHaveBeenCalledTimes(1);
        await view.rerender({ registered: true });
        await fireEvent.mouseDown(trigger);
        expect(onHidePrevented).toHaveBeenCalledTimes(1);
    });

    it('handles trigger unmount and replacement without retaining ownership of the old node', async () => {
        const onHidePrevented = vi.fn();
        const view = render(OffcanvasTriggerTest, { onHidePrevented });
        const oldTrigger = screen.getByTestId('owned-panel-trigger');
        await userEvent.setup().click(oldTrigger);
        await screen.findByTestId('owned-panel');
        await view.rerender({ triggerVisible: false });
        expect(oldTrigger.isConnected).toBe(false);
        await view.rerender({ triggerVisible: true });
        await fireEvent.mouseDown(screen.getByTestId('owned-panel-trigger'));
        expect(onHidePrevented).not.toHaveBeenCalled();
        // Reinsert the old button to verify ownership follows the current binding, not an old registration.
        const oldButton = oldTrigger.closest('button')!;
        view.container.append(oldButton);
        await fireEvent.mouseDown(oldTrigger);
        expect(onHidePrevented).toHaveBeenCalledTimes(1);
        oldButton.remove();
    });

    it('scopes ownership to the top panel and releases it when that panel is destroyed', async () => {
        const preventedA = vi.fn();
        const preventedB = vi.fn();
        render(OffcanvasTriggerTest, { panelId: 'panel-a', onHidePrevented: preventedA });
        const second = render(OffcanvasTriggerTest, { panelId: 'panel-b', onHidePrevented: preventedB });
        const user = userEvent.setup();
        await user.click(screen.getByTestId('panel-a-trigger'));
        await screen.findByTestId('panel-a');
        await user.click(screen.getByTestId('panel-b-trigger'));
        await screen.findByTestId('panel-b');
        preventedA.mockClear();
        await fireEvent.mouseDown(screen.getByTestId('panel-b-trigger'));
        expect(preventedB).not.toHaveBeenCalled();
        await fireEvent.mouseDown(screen.getByTestId('panel-a-trigger'));
        expect(preventedB).toHaveBeenCalledTimes(1);
        expect(preventedA).not.toHaveBeenCalled();
        await second.unmount();
        await fireEvent.mouseDown(screen.getByTestId('panel-a-trigger'));
        expect(preventedA).not.toHaveBeenCalled();
        await fireEvent.mouseDown(document.body);
        expect(preventedA).toHaveBeenCalledTimes(1);
    });
});

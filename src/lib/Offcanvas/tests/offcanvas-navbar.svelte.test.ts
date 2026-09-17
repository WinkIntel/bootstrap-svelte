import { fireEvent, render, waitFor, within } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import OffcanvasNavbarTest from './offcanvas-navbar-test.svelte';

function expectControls(toggler: HTMLElement, ids: string[]) {
    if (ids.length === 0) {
        expect(toggler).not.toHaveAttribute('aria-controls');
        return;
    }
    expect(toggler.getAttribute('aria-controls')?.split(' ').sort()).toEqual([...ids].sort());
    for (const id of ids) expect(document.getElementById(id)).toBeInTheDocument();
}

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
        expect(getByTestId('navbar-offcanvas')).toHaveClass('show');
        expect(toggler).toHaveAttribute('aria-expanded', 'true');
        expect(onHidden).toHaveBeenCalledTimes(1);
        expect(onHidePrevented).not.toHaveBeenCalled();
        if (useBackdrop === 'static') {
            await user.click(document.querySelector('.offcanvas-backdrop')!);
            expect(onHidePrevented).toHaveBeenCalledTimes(1);
            expect(getByTestId('navbar-offcanvas')).toHaveClass('show');
        }
    });

    it.each([
        { button: 1, disabled: 'none', useBackdrop: true },
        { button: 2, disabled: 'none', useBackdrop: true },
        { button: 0, disabled: 'button', useBackdrop: true },
        { button: 0, disabled: 'fieldset', useBackdrop: true },
        { button: 1, disabled: 'none', useBackdrop: 'static' },
        { button: 2, disabled: 'none', useBackdrop: 'static' },
        { button: 0, disabled: 'button', useBackdrop: 'static' },
        { button: 0, disabled: 'fieldset', useBackdrop: 'static' }
    ] as const)('handles non-activating presses: $button / $disabled / $useBackdrop', async ({ button, disabled, useBackdrop }) => {
        const user = userEvent.setup();
        const onShown = vi.fn();
        const onHidden = vi.fn();
        const onHidePrevented = vi.fn();
        const { getByTestId, rerender } = render(OffcanvasNavbarTest, { props: { useBackdrop, onShown, onHidden, onHidePrevented } });
        const toggler = getByTestId('navbar-toggler');
        await user.click(toggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        await rerender({ togglerDisabled: disabled === 'button', fieldsetDisabled: disabled === 'fieldset' });

        await fireEvent.mouseDown(toggler.querySelector('span')!, { button });
        if (useBackdrop === true) {
            await waitFor(() => expect(onHidden).toHaveBeenCalledTimes(1));
            expect(toggler).toHaveAttribute('aria-expanded', 'false');
        } else {
            expect(onHidePrevented).toHaveBeenCalledTimes(1);
            expect(getByTestId('navbar-offcanvas')).toHaveClass('show');
        }
    });

    it.each([true, 'static'] as const)('does not activate a cancelled primary toggler press with backdrop %s', async (useBackdrop) => {
        const user = userEvent.setup();
        const onShown = vi.fn();
        const onHidePrevented = vi.fn();
        const { getByTestId } = render(OffcanvasNavbarTest, { props: { useBackdrop, onShown, onHidePrevented } });
        const toggler = getByTestId('navbar-toggler');
        await user.click(toggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));

        await user.pointer([
            { target: toggler, keys: '[MouseLeft>]' },
            { target: document.body, keys: '[/MouseLeft]' }
        ]);
        expect(getByTestId('navbar-offcanvas')).toHaveClass('show');
        expect(toggler).toHaveAttribute('aria-expanded', 'true');
        expect(onHidePrevented).not.toHaveBeenCalled();
    });

    it('references the generated panel only while rendered and follows id changes', async () => {
        const user = userEvent.setup();
        const onShown = vi.fn();
        const onHidden = vi.fn();
        const { getByTestId, queryByTestId, rerender } = render(OffcanvasNavbarTest, { props: { onShown, onHidden } });
        const toggler = getByTestId('navbar-toggler');
        expect(toggler).not.toHaveAttribute('aria-controls');
        await user.click(toggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        const generatedId = getByTestId('navbar-offcanvas').id;
        expect(generatedId).toMatch(/^offcanvas-/);
        expectControls(toggler, [generatedId]);

        await rerender({ id: 'renamed-panel' });
        expectControls(toggler, ['renamed-panel']);
        await user.click(toggler);
        await waitFor(() => expect(onHidden).toHaveBeenCalledTimes(1));
        expect(queryByTestId('navbar-offcanvas')).not.toBeInTheDocument();
        expectControls(toggler, []);
        await rerender({ id: 'replacement-panel' });
        expectControls(toggler, []);
        await user.click(toggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(2));
        expectControls(toggler, ['replacement-panel']);
        await rerender({ renderOffcanvas: false });
        await waitFor(() => expect(queryByTestId('navbar-offcanvas')).not.toBeInTheDocument());
        expectControls(toggler, []);
    });

    it('preserves consumer aria-controls through panel updates and teardown', async () => {
        const user = userEvent.setup();
        const onShown = vi.fn();
        const { getByTestId, queryByTestId, rerender } = render(OffcanvasNavbarTest, {
            props: { id: 'panel', ariaControls: 'consumer-target', onShown }
        });
        const toggler = getByTestId('navbar-toggler');
        expect(toggler).toHaveAttribute('aria-controls', 'consumer-target');
        await user.click(toggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        await rerender({ id: 'renamed-panel' });
        expect(toggler).toHaveAttribute('aria-controls', 'consumer-target');
        await rerender({ ariaControls: undefined });
        expectControls(toggler, ['renamed-panel']);
        await rerender({ ariaControls: 'consumer-target', renderOffcanvas: false });
        await waitFor(() => expect(queryByTestId('navbar-offcanvas')).not.toBeInTheDocument());
        expect(toggler).toHaveAttribute('aria-controls', 'consumer-target');
    });

    it('references all controlled panels across collapse removal and remount', async () => {
        const user = userEvent.setup();
        const onShown = vi.fn();
        const { getByTestId, queryByTestId, rerender } = render(OffcanvasNavbarTest, {
            props: { id: 'panel', renderCollapse: true, onShown }
        });
        const toggler = getByTestId('navbar-toggler');
        expectControls(toggler, []);
        await user.click(toggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        expectControls(toggler, ['fallback-collapse', 'panel']);
        await rerender({ renderCollapse: false });
        await waitFor(() => expect(document.getElementById('fallback-collapse')).not.toBeInTheDocument());
        expectControls(toggler, ['panel']);
        await rerender({ renderCollapse: true });
        expectControls(toggler, ['fallback-collapse', 'panel']);
        await rerender({ id: 'renamed-panel' });
        expectControls(toggler, ['fallback-collapse', 'renamed-panel']);
        await rerender({ renderOffcanvas: false });
        await waitFor(() => expect(queryByTestId('navbar-offcanvas')).not.toBeInTheDocument());
        expectControls(toggler, ['fallback-collapse']);
        await rerender({ renderCollapse: false });
        await waitFor(() => expect(document.getElementById('fallback-collapse')).not.toBeInTheDocument());
        expectControls(toggler, []);
    });

    it('omits empty panel ids without losing the other controlled panels', async () => {
        const user = userEvent.setup();
        const onShown = vi.fn();
        const { getByTestId, rerender } = render(OffcanvasNavbarTest, {
            props: { id: 'panel', renderFollowingCollapse: true, onShown }
        });
        const toggler = getByTestId('navbar-toggler');
        await user.click(toggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        expectControls(toggler, ['panel', 'following-collapse']);
        await rerender({ id: '' });
        expectControls(toggler, ['following-collapse']);
        await rerender({ id: 'renamed-panel' });
        expectControls(toggler, ['renamed-panel', 'following-collapse']);
        await rerender({ renderFollowingCollapse: false });
        await waitFor(() => expect(document.getElementById('following-collapse')).not.toBeInTheDocument());
        expectControls(toggler, ['renamed-panel']);
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
        expectControls(firstToggler, []);
        expectControls(secondToggler, []);
        await user.click(firstToggler);
        await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
        expectControls(firstToggler, ['first-panel']);
        await user.click(secondToggler);
        await waitFor(() => expectControls(secondToggler, ['second-panel']));
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

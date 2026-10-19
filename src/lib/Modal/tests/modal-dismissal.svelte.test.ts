import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ModalDismissalTest from './modal-dismissal-test.svelte';

describe('Modal dismissal paths', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it.each(['backdrop', 'modal surface', 'header close'])('dismisses via %s with ordered lifecycle callbacks', async (target) => {
        const events: string[] = [];
        const { rerender } = render(ModalDismissalTest, {
            isShown: false,
            onShow: () => events.push('show'),
            onShown: () => events.push('shown'),
            onHide: () => events.push('hide'),
            onHidden: () => events.push('hidden')
        });
        await rerender({ isShown: true });
        await vi.advanceTimersByTimeAsync(350);
        expect(events).toEqual(['show', 'shown']);
        if (target === 'header close') await fireEvent.click(screen.getByLabelText('Close'));
        else {
            const element = target === 'backdrop' ? document.querySelector('.modal-backdrop')! : screen.getByRole('dialog');
            expect(element).not.toBeNull();
            await fireEvent.mouseDown(element);
        }
        await vi.advanceTimersByTimeAsync(1);
        expect(events).toEqual(['show', 'shown', 'hide']);
        await vi.advanceTimersByTimeAsync(350);
        expect(events).toEqual(['show', 'shown', 'hide', 'hidden']);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(document.querySelector('.modal-backdrop')).toBeNull();
        expect(document.body).not.toHaveClass('modal-open');
    });

    it('keeps the modal open for mousedown on the dialog and its descendants', async () => {
        const onHide = vi.fn();
        render(ModalDismissalTest, { isShown: true, onHide });
        await tick();
        await fireEvent.mouseDown(document.querySelector('.modal-dialog')!);
        await fireEvent.mouseDown(screen.getByRole('button', { name: 'Inside action' }));
        await vi.advanceTimersByTimeAsync(400);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(onHide).not.toHaveBeenCalled();
    });

    it('adds and removes the backdrop at runtime without dismissing the modal', async () => {
        const onHide = vi.fn();
        const { rerender } = render(ModalDismissalTest, { isShown: true, useBackdrop: false, onHide });
        await tick();
        expect(document.querySelector('.modal-backdrop')).toBeNull();
        await rerender({ useBackdrop: true });
        await vi.advanceTimersByTimeAsync(200);
        expect(document.querySelector('.modal-backdrop')).toBeInTheDocument();
        await rerender({ useBackdrop: false });
        await vi.advanceTimersByTimeAsync(200);
        expect(document.querySelector('.modal-backdrop')).toBeNull();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(onHide).not.toHaveBeenCalled();
    });

    it('does not move focus into the modal when isFocusable is false', async () => {
        const opener = document.createElement('button');
        document.body.append(opener);
        opener.focus();
        try {
            const { rerender } = render(ModalDismissalTest, { isShown: false, isFocusable: false });
            await rerender({ isShown: true });
            await vi.advanceTimersByTimeAsync(350);
            expect(screen.getByRole('dialog')).not.toHaveAttribute('tabindex');
            expect(opener).toHaveFocus();
        } finally {
            opener.remove();
        }
    });
});

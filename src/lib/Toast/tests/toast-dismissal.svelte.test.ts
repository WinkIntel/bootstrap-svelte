import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ToastDismissalTest from './toast-dismissal-test.svelte';

describe('Toast dismissal', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it('hides only after the configured delay and completes its outro', async () => {
        const onHide = vi.fn();
        const onHidden = vi.fn();
        render(ToastDismissalTest, { isShown: true, delay: 1000, onHide, onHidden });
        await tick();
        await vi.advanceTimersByTimeAsync(999);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(onHide).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(1);
        await tick();
        // Svelte schedules transition events after the state update.
        await vi.advanceTimersByTimeAsync(1);
        expect(onHide).toHaveBeenCalledOnce();
        expect(onHidden).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(200);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(onHidden).toHaveBeenCalledOnce();
    });

    it.each([{ doAutohide: false, delay: 1000 }, { delay: 0 }, { delay: -1 }])('does not autohide with %j', async (props) => {
        const onHide = vi.fn();
        render(ToastDismissalTest, { isShown: true, ...props, onHide });
        await tick();
        await vi.advanceTimersByTimeAsync(10000);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(onHide).not.toHaveBeenCalled();
    });

    it('header close cancels the pending autohide instead of reopening at the old deadline', async () => {
        const onHide = vi.fn();
        const onHidden = vi.fn();
        render(ToastDismissalTest, { isShown: true, delay: 1000, onHide, onHidden });
        await tick();
        await vi.advanceTimersByTimeAsync(200);
        await fireEvent.click(screen.getByLabelText('Close'));
        await vi.advanceTimersByTimeAsync(200);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(vi.getTimerCount()).toBe(0);
        await vi.advanceTimersByTimeAsync(1000);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(onHide).toHaveBeenCalledOnce();
        expect(onHidden).toHaveBeenCalledOnce();
    });

    it('clears the autohide timer on unmount without firing dismissal callbacks', async () => {
        const onHide = vi.fn();
        const onHidden = vi.fn();
        const { unmount } = render(ToastDismissalTest, { isShown: true, delay: 1000, onHide, onHidden });
        await tick();
        expect(vi.getTimerCount()).toBe(1);
        unmount();
        expect(vi.getTimerCount()).toBe(0);
        await vi.advanceTimersByTimeAsync(1200);
        expect(onHide).not.toHaveBeenCalled();
        expect(onHidden).not.toHaveBeenCalled();
    });

    it('reopens on false-to-true prop transitions and orders lifecycle callbacks once per cycle', async () => {
        const events: string[] = [];
        const { rerender } = render(ToastDismissalTest, {
            isShown: false,
            doAutohide: false,
            onShow: () => events.push('show'),
            onShown: () => events.push('shown'),
            onHide: () => events.push('hide'),
            onHidden: () => events.push('hidden')
        });
        for (let cycle = 0; cycle < 2; cycle++) {
            await rerender({ isShown: true });
            await vi.advanceTimersByTimeAsync(200);
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(events).toEqual([...Array(cycle).fill(['show', 'shown', 'hide', 'hidden']).flat(), 'show', 'shown']);
            await rerender({ isShown: false });
            await vi.advanceTimersByTimeAsync(200);
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
            expect(events).toEqual(
                Array(cycle + 1)
                    .fill(['show', 'shown', 'hide', 'hidden'])
                    .flat()
            );
        }
    });
});

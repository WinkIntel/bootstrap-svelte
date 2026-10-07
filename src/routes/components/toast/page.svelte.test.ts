import { cleanup, fireEvent, render, screen, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ToastPage from './+page.svelte';

beforeEach(() => vi.useFakeTimers());

afterEach(() => {
    // Unmount while fake timers are active, including the other live examples.
    cleanup();
    const pendingTimers = vi.getTimerCount();
    vi.useRealTimers();
    expect(pendingTimers).toBe(0);
});

describe('Toast showcase basic example', () => {
    test.each(['autohide', 'header close'])('can be shown repeatedly after %s', async (dismissal) => {
        render(ToastPage);
        const button = screen.getByRole('button', { name: 'Show toast' });
        const example = within(button.closest('.card-body') as HTMLElement);

        for (let cycle = 0; cycle < 3; cycle++) {
            await fireEvent.click(button);
            await tick();
            expect(example.getByRole('alert')).toHaveTextContent('Hello, world! This is a toast message.');
            await vi.advanceTimersByTimeAsync(200);

            if (dismissal === 'autohide') await vi.advanceTimersByTimeAsync(5000);
            else await fireEvent.click(example.getByLabelText('Close'));

            await tick();
            await vi.advanceTimersByTimeAsync(200);
            await tick();
            expect(example.queryByRole('alert')).not.toBeInTheDocument();
        }
    });
    test.each(['autohide', 'header close'])('reopens during the %s outro', async (dismissal) => {
        render(ToastPage);
        const button = screen.getByRole('button', { name: 'Show toast' });
        const example = within(button.closest('.card-body') as HTMLElement);
        await fireEvent.click(button);
        await vi.advanceTimersByTimeAsync(200);
        const toast = example.getByRole('alert');
        const outroStarted = vi.fn();
        toast.addEventListener('outrostart', outroStarted);

        if (dismissal === 'autohide') await vi.advanceTimersByTimeAsync(4800);
        else await fireEvent.click(example.getByLabelText('Close'));

        await vi.advanceTimersByTimeAsync(50);
        expect(toast).toBeInTheDocument();
        expect(outroStarted).toHaveBeenCalledOnce();
        await fireEvent.click(button);
        await vi.advanceTimersByTimeAsync(200);
        expect(example.getByRole('alert')).toHaveClass('show');
    });
});

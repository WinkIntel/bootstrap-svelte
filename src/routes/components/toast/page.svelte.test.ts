import { cleanup, fireEvent, render, screen, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import ToastPage from './+page.svelte';

describe('Toast showcase basic example', () => {
    test.each(['autohide', 'header close'])('can be shown repeatedly after %s', async (dismissal) => {
        vi.useFakeTimers();
        try {
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
        } finally {
            cleanup();
            vi.useRealTimers();
        }
    });
});

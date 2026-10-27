import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import Fixture from './tab-lifecycle-test.svelte';
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    cleanup();
    vi.useRealTimers();
});
it.each([false, true])('chains Tab lifecycle events and preserves receivers with fade=%s', async (doFade) => {
    const calls: { name: string; event: Event; receiver: unknown; target: EventTarget | null; active: boolean }[] = [];
    const handler = (name: string) =>
        function (this: HTMLElement, event: Event) {
            calls.push({
                name,
                event,
                receiver: this,
                target: event.currentTarget,
                active: (event.currentTarget as HTMLElement).classList.contains('active')
            });
        };
    render(Fixture, {
        doFade,
        paneProps: {
            onShow: handler('show'),
            onShown: handler('shown'),
            onHide: handler('hide'),
            onHidden: handler('hidden'),
            onintrostart: handler('introstart'),
            onintroend: handler('introend'),
            onoutrostart: handler('outrostart'),
            onoutroend: handler('outroend')
        }
    });
    await vi.advanceTimersByTimeAsync(600);
    for (let cycle = 0; cycle < 2; cycle++) {
        calls.length = 0;
        await fireEvent.click(screen.getByTestId('second-link'));
        await vi.advanceTimersByTimeAsync(600);
        const pane = screen.getByTestId('pane');
        expect(pane).toHaveClass('active');
        await fireEvent.click(screen.getByTestId('first-link'));
        await vi.advanceTimersByTimeAsync(20);
        if (doFade) {
            expect(pane).toBeInTheDocument();
            expect(pane).not.toHaveClass('active');
        }
        await vi.advanceTimersByTimeAsync(600);
        expect(calls.map((c) => c.name)).toEqual(['show', 'introstart', 'shown', 'introend', 'hide', 'outrostart', 'hidden', 'outroend']);
        for (const call of calls) {
            expect(call.receiver).toBe(pane);
            expect(call.target).toBe(pane);
        }
        for (let i = 0; i < 8; i += 2) expect(calls[i]!.event).toBe(calls[i + 1]!.event);
        if (doFade) expect(calls.find((c) => c.name === 'outrostart')!.active).toBe(false);
        expect(screen.queryByTestId('pane')).not.toBeInTheDocument();
    }
});

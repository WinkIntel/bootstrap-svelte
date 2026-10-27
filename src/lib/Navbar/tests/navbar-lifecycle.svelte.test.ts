import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import Fixture from './navbar-lifecycle-test.svelte';
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    cleanup();
    vi.useRealTimers();
});
it('forwards the collapsed receiver and event before the consumer outro handler', async () => {
    const calls: { name: string; receiver: unknown; event: Event; target: EventTarget | null }[] = [];
    const handler = (name: string) =>
        function (this: HTMLElement, event: Event) {
            calls.push({ name, receiver: this, event, target: event.currentTarget });
        };
    render(Fixture, { onCollapsed: handler('collapsed'), onoutroend: handler('outroend') });
    for (let cycle = 0; cycle < 2; cycle++) {
        calls.length = 0;
        await fireEvent.click(screen.getByTestId('toggle'));
        await vi.advanceTimersByTimeAsync(200);
        const panel = screen.getByTestId('panel');
        await fireEvent.click(screen.getByTestId('toggle'));
        await vi.advanceTimersByTimeAsync(200);
        expect(calls.map((c) => c.name)).toEqual(['collapsed', 'outroend']);
        expect(calls[0]!.event).toBe(calls[1]!.event);
        for (const call of calls) {
            expect(call.receiver).toBe(panel);
            expect(call.target).toBe(panel);
        }
    }
});

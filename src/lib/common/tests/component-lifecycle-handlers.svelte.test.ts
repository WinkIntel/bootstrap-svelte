import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Alert from '../../Alert/alert.svelte';
import Collapse from '../../Collapse/collapse.svelte';
import Carousel from './carousel-lifecycle-test.svelte';

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    cleanup();
    vi.useRealTimers();
});

function recorder() {
    const calls: { name: string; event: Event; receiver: HTMLElement; target: EventTarget | null }[] = [];
    const handler = (name: string) =>
        function (this: HTMLElement, event: Event) {
            calls.push({ name, event, receiver: this, target: event.currentTarget });
        };
    function expectPair(offset: number, lifecycle: string, dom: string, element: HTMLElement) {
        const pair = calls.slice(offset, offset + 2);
        expect(pair.map(({ name }) => name)).toEqual([lifecycle, dom]);
        expect(pair[0]!.event).toBe(pair[1]!.event);
        for (const call of pair) {
            expect(call.receiver).toBe(element);
            expect(call.target).toBe(element);
        }
    }
    return { calls, handler, expectPair };
}

describe('component lifecycle handler composition', () => {
    it.each([true, false])('Alert chains closing callbacks with animation=%s and preserves role', async (isAnimated) => {
        const r = recorder();
        const { rerender } = render(Alert, {
            isOpen: true,
            isAnimated,
            role: 'status',
            onClose: r.handler('close'),
            onClosed: r.handler('closed'),
            onoutrostart: r.handler('outrostart'),
            onoutroend: r.handler('outroend'),
            'data-testid': 'alert'
        });
        await vi.advanceTimersByTimeAsync(200);
        const panel = screen.getByTestId('alert');
        expect(panel).toHaveAttribute('role', 'status');
        await rerender({ isOpen: false });
        await vi.advanceTimersByTimeAsync(200);
        expect(r.calls).toHaveLength(4);
        r.expectPair(0, 'close', 'outrostart', panel);
        r.expectPair(2, 'closed', 'outroend', panel);
        expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });

    it.each([0, 100])('Collapse chains every lifecycle phase at %sms and on repeated opens', async (transitionDuration) => {
        const r = recorder();
        const { rerender } = render(Collapse, {
            isExpanded: false,
            transitionDuration,
            onExpand: r.handler('expand'),
            onExpanded: r.handler('expanded'),
            onCollapse: r.handler('collapse'),
            onCollapsed: r.handler('collapsed'),
            onintrostart: r.handler('introstart'),
            onintroend: r.handler('introend'),
            onoutrostart: r.handler('outrostart'),
            onoutroend: r.handler('outroend'),
            'data-testid': 'collapse'
        });
        for (let cycle = 0; cycle < 2; cycle++) {
            r.calls.length = 0;
            await rerender({ isExpanded: true });
            await vi.advanceTimersByTimeAsync(200);
            const panel = screen.getByTestId('collapse');
            r.expectPair(0, 'expand', 'introstart', panel);
            r.expectPair(2, 'expanded', 'introend', panel);
            await rerender({ isExpanded: false });
            await vi.advanceTimersByTimeAsync(200);
            expect(r.calls).toHaveLength(8);
            r.expectPair(4, 'collapse', 'outrostart', panel);
            r.expectPair(6, 'collapsed', 'outroend', panel);
            expect(screen.queryByTestId('collapse')).not.toBeInTheDocument();
        }
    });

    it.each(['none', 'slide', 'fade', 'crossfade'] as const)('Carousel.Item chains intro callbacks in %s mode', async (animation) => {
        const r = recorder();
        render(Carousel, {
            animation,
            itemProps: {
                onSlide: r.handler('slide'),
                onSlid: r.handler('slid'),
                onintrostart: r.handler('introstart'),
                onintroend: r.handler('introend')
            }
        });
        await vi.advanceTimersByTimeAsync(300);
        await fireEvent.click(screen.getByTestId('next'));
        await vi.advanceTimersByTimeAsync(300);
        const panel = screen.getByTestId('second');
        expect(panel).toHaveClass('active');
        expect(r.calls).toHaveLength(4);
        r.expectPair(0, 'slide', 'introstart', panel);
        r.expectPair(2, 'slid', 'introend', panel);
    });

    it('reads updated DOM callbacks instead of retaining the previous handler', async () => {
        const old = vi.fn();
        const next = vi.fn();
        const lifecycle = vi.fn();
        const { rerender } = render(Alert, { isOpen: true, onClosed: lifecycle, onoutroend: old });
        await rerender({ onoutroend: next, isOpen: false });
        await vi.advanceTimersByTimeAsync(200);
        expect(lifecycle).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledOnce();
        expect(old).not.toHaveBeenCalled();
    });
});

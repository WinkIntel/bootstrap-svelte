import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Overlay from './overlay-owned-props-test.svelte';

const poppers = vi.hoisted(() => ({ destroyers: [] as ReturnType<typeof vi.fn>[] }));
vi.mock('@popperjs/core', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@popperjs/core')>();
    return {
        ...actual,
        createPopper: (...args: Parameters<typeof actual.createPopper>) => {
            const instance = actual.createPopper(...args);
            poppers.destroyers.push(vi.spyOn(instance, 'destroy'));
            return instance;
        }
    };
});

const kinds = ['Modal', 'Offcanvas', 'Toast', 'Tooltip'] as const;
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    cleanup();
    vi.useRealTimers();
});

describe.each(kinds)('%s owned props', (kind) => {
    it.each([false, true])('chains lifecycle handlers in library-first order with intro=%s', async (intro) => {
        const events: string[] = [];
        const targets: EventTarget[] = [];
        const consumer = (name: string) =>
            function (this: HTMLDivElement, event: Event) {
                expect(this).toBe(event.currentTarget);
                events.push(name);
                targets.push(event.currentTarget!);
                if (name === 'outroend' && (kind === 'Modal' || kind === 'Offcanvas')) {
                    expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
                    expect(document.body).not.toHaveClass('modal-open');
                }
            };
        const { rerender } = render(Overlay, {
            props: {
                kind,
                onShow: function (this: HTMLDivElement, event: Event) {
                    expect(this).toBe(event.currentTarget);
                    events.push('show');
                },
                onShown: function (this: HTMLDivElement, event: Event) {
                    expect(this).toBe(event.currentTarget);
                    events.push('shown');
                },
                onHide: function (this: HTMLDivElement, event: Event) {
                    expect(this).toBe(event.currentTarget);
                    events.push('hide');
                },
                onHidden: () => events.push('hidden'),
                rootProps: {
                    onintrostart: consumer('introstart'),
                    onintroend: consumer('introend'),
                    onoutrostart: consumer('outrostart'),
                    onoutroend: consumer('outroend')
                }
            },
            intro
        });
        await vi.advanceTimersByTimeAsync(400);
        const panel = screen.getByTestId('overlay');
        expect(events).toEqual(['show', 'introstart', 'shown', 'introend']);
        if (kind === 'Modal' || kind === 'Offcanvas') expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');
        await rerender({ isShown: false });
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual(['show', 'introstart', 'shown', 'introend', 'hide', 'outrostart', 'hidden', 'outroend']);
        expect(targets).toEqual([panel, panel, panel, panel]);
        expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
        events.length = 0;
        await rerender({ isShown: true });
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual(['show', 'introstart', 'shown', 'introend']);
    });

    it('preserves its owned semantics while forwarding accessible names and other attributes', async () => {
        render(Overlay, {
            kind,
            rootProps: {
                role: 'presentation',
                'aria-modal': false,
                'aria-label': 'Consumer name',
                'aria-describedby': 'description',
                'data-custom': 'retained'
            }
        });
        await tick();
        const panel = screen.getByTestId('overlay');
        expect(panel).toHaveAttribute('role', kind === 'Toast' ? 'alert' : kind === 'Tooltip' ? 'tooltip' : 'dialog');
        if (kind === 'Modal' || kind === 'Offcanvas') expect(panel).toHaveAttribute('aria-modal', 'true');
        expect(panel).toHaveAttribute('aria-label', 'Consumer name');
        expect(panel).toHaveAttribute('aria-describedby', 'description');
        expect(panel).toHaveAttribute('data-custom', 'retained');
    });

    it('forwards mousedown exactly once and preserves dismissal behavior', async () => {
        const onmousedown = vi.fn(function (this: HTMLDivElement, event: MouseEvent) {
            expect(this).toBe(event.currentTarget);
        });
        const onHidden = vi.fn();
        render(Overlay, { kind, onHidden, rootProps: { onmousedown } });
        await vi.advanceTimersByTimeAsync(400);
        const panel = screen.getByTestId('overlay');
        await fireEvent.mouseDown(panel);
        await vi.advanceTimersByTimeAsync(400);
        expect(onmousedown).toHaveBeenCalledOnce();
        if (kind === 'Modal') {
            expect(onHidden).toHaveBeenCalledOnce();
            expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
            expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
            expect(document.body).not.toHaveClass('modal-open');
        } else {
            expect(panel).toBeInTheDocument();
            if (kind === 'Offcanvas') {
                await fireEvent.mouseDown(document.body);
                await vi.advanceTimersByTimeAsync(400);
                expect(onHidden).toHaveBeenCalledOnce();
                expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
            }
        }
    });
});

it('destroys the live Popper instance before notifying a consumer outro handler', async () => {
    const onoutroend = vi.fn(() => expect(destroy).toHaveBeenCalledOnce());
    const { rerender } = render(Overlay, { kind: 'Tooltip', rootProps: { onoutroend } });
    await vi.advanceTimersByTimeAsync(400);
    const destroy = poppers.destroyers.at(-1)!;
    expect(destroy).not.toHaveBeenCalled();
    await rerender({ isShown: false });
    await vi.advanceTimersByTimeAsync(400);
    expect(onoutroend).toHaveBeenCalledOnce();
    expect(destroy).toHaveBeenCalledOnce();
});

it.each(kinds)('uses updated %s consumer callbacks without duplicate subscriptions', async (kind) => {
    const oldHandler = vi.fn();
    const newHandler = vi.fn();
    const { rerender } = render(Overlay, { kind, isShown: false, rootProps: { onintroend: oldHandler } });
    await rerender({ rootProps: { onintroend: newHandler }, isShown: true });
    await vi.advanceTimersByTimeAsync(400);
    expect(newHandler).toHaveBeenCalledOnce();
    expect(oldHandler).not.toHaveBeenCalled();
});

it.each(['Modal', 'Offcanvas'] as const)('releases %s locks on unmount with consumer handlers attached', async (kind) => {
    const { unmount } = render(Overlay, { kind, rootProps: { onoutroend: vi.fn() } });
    await vi.advanceTimersByTimeAsync(400);
    expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');
    unmount();
    expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    expect(document.body).not.toHaveClass('modal-open');
});

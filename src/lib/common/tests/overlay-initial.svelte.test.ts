import { cleanup, render, screen } from '@testing-library/svelte';
import { mount, tick, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Overlay from './overlay-initial-test.svelte';
import NativeIntro from './initial-show-native-test.svelte';
import { mockMatchMedia } from './mock-match-media.js';
import { Modal } from '../../Modal/index.js';

const kinds = ['Modal', 'Offcanvas', 'Toast', 'Tooltip'] as const;
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    cleanup();
    vi.useRealTimers();
});

function callbacks() {
    const events: string[] = [];
    const targets: EventTarget[] = [];
    return {
        events,
        targets,
        props: {
            onShow: (event: Event) => {
                events.push('show');
                targets.push(event.currentTarget!);
            },
            onShown: (event: Event) => {
                events.push('shown');
                targets.push(event.currentTarget!);
            },
            onHide: () => events.push('hide'),
            onHidden: () => events.push('hidden')
        }
    };
}

describe.each(kinds)('%s initial visibility', (kind) => {
    it.each([false, true])('notifies once on initial mount with intro=%s, then closes and reopens', async (intro) => {
        const { events, targets, props } = callbacks();
        const { rerender } = render(Overlay, { props: { kind, ...props }, intro });
        await tick();
        if (kind === 'Modal') {
            expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');
            expect(document.body).toHaveClass('modal-open');
        }
        await vi.advanceTimersByTimeAsync(400);
        const element = screen.getByTestId('overlay');
        expect(events).toEqual(['show', 'shown']);
        expect(targets).toEqual([element, element]);
        await rerender({ isShown: false });
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual(['show', 'shown', 'hide', 'hidden']);
        expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
        if (kind === 'Modal' || kind === 'Offcanvas') expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        expect(document.body).not.toHaveClass('modal-open');
        await rerender({ isShown: true });
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual(['show', 'shown', 'hide', 'hidden', 'show', 'shown']);
    });

    it('uses native transitions once when first opened after mounting hidden', async () => {
        const { events, props } = callbacks();
        const { rerender } = render(Overlay, { kind, isShown: false, ...props });
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual([]);
        await rerender({ isShown: true });
        await vi.advanceTimersByTimeAsync(1);
        expect(events).toEqual(['show']);
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual(['show', 'shown']);
    });

    it('handles conditional mounting already shown and cleans up on removal', async () => {
        const { events, props } = callbacks();
        const { rerender } = render(Overlay, { kind, mounted: false, ...props });
        await rerender({ mounted: true });
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual(['show', 'shown']);
        await rerender({ mounted: false });
        await vi.advanceTimersByTimeAsync(400);
        expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        expect(document.body).not.toHaveClass('modal-open');
    });

    it('does not report shown if onShow closes the initially visible component', async () => {
        const { events, props } = callbacks();
        render(Overlay, { kind, closeOnShow: true, ...props });
        await tick();
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual(['show', 'hide', 'hidden']);
        expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        expect(document.body).not.toHaveClass('modal-open');
    });

    it('does not notify for an initially hidden component or after immediate unmount', async () => {
        const { events, props } = callbacks();
        const hidden = render(Overlay, { kind, isShown: false, ...props });
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual([]);
        hidden.unmount();
        const shown = render(Overlay, { kind, ...props });
        shown.unmount();
        const before = [...events];
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual(before);
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        expect(document.body).not.toHaveClass('modal-open');
    });
});

it('lets a native initial intro finish at its own duration without synthetic duplicates', async () => {
    const onShow = vi.fn();
    const onShown = vi.fn();
    render(NativeIntro, { props: { onShow, onShown }, intro: true });
    await tick();
    await vi.advanceTimersByTimeAsync(1);
    expect(onShow).toHaveBeenCalledOnce();
    expect(onShown).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(150);
    expect(onShow).toHaveBeenCalledOnce();
    expect(onShown).toHaveBeenCalledOnce();
});

it('retains the other initially shown modal lock when one modal unmounts', async () => {
    const first = render(Modal.Root, { isShown: true });
    const second = render(Modal.Root, { isShown: true });
    await tick();
    await vi.advanceTimersByTimeAsync(400);
    expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '2');
    expect(document.body).toHaveClass('modal-open');
    first.unmount();
    expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');
    expect(document.body).toHaveClass('modal-open');
    second.unmount();
    expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    expect(document.body).not.toHaveClass('modal-open');
});

it('notifies and cleans up an initially shown portalled Tooltip', async () => {
    const { events, props } = callbacks();
    const { unmount } = render(Overlay, { kind: 'Tooltip', portal: true, ...props });
    await vi.advanceTimersByTimeAsync(400);
    expect(events).toEqual(['show', 'shown']);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    unmount();
    await vi.advanceTimersByTimeAsync(400);
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(events).toEqual(['show', 'shown']);
});

it('cancels the initial shown callback when onShow starts an unmount outro', async () => {
    const target = document.createElement('div');
    document.body.append(target);
    const onShown = vi.fn();
    let removal: Promise<void> | undefined;
    const instance = mount(NativeIntro, {
        target,
        intro: false,
        props: {
            onShow: () => {
                removal = unmount(instance, { outro: true });
            },
            onShown
        }
    });
    await tick();
    await vi.advanceTimersByTimeAsync(150);
    await removal;
    expect(onShown).not.toHaveBeenCalled();
    expect(target).toBeEmptyDOMElement();
    target.remove();
});

it.each([false, true])('does not synthesize overlay callbacks for inline responsive Offcanvas (Navbar=%s)', async (responsiveNavbar) => {
    mockMatchMedia(1200);
    const { events, props } = callbacks();
    render(Overlay, { kind: 'Offcanvas', isShown: false, responsiveNavbar, showOnBreakpoint: responsiveNavbar ? undefined : 'lg', ...props });
    await vi.advanceTimersByTimeAsync(400);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    expect(events).toEqual([]);
    expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
});

it('uses the private Offcanvas panel when onShow clears the consumer ref', async () => {
    const { events, targets, props } = callbacks();
    render(Overlay, { kind: 'Offcanvas', clearRefOnShow: true, ...props });
    await vi.advanceTimersByTimeAsync(400);
    expect(events).toEqual(['show', 'shown']);
    expect(targets).toEqual([screen.getByTestId('overlay'), screen.getByTestId('overlay')]);
});

it('forwards Svelte transition direction to the wrapped transition', async () => {
    const onDirection = vi.fn();
    render(NativeIntro, { props: { onShow: vi.fn(), onShown: vi.fn(), onDirection }, intro: true });
    await vi.advanceTimersByTimeAsync(150);
    expect(onDirection).toHaveBeenCalledExactlyOnceWith('both');
});

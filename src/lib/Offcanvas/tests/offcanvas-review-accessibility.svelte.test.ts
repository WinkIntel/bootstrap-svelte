import { mockMatchMedia } from '$lib/common/tests/mock-match-media.js';
import { BreakpointMinimumMediaQuery } from '$lib/common/types.js';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tick } from 'svelte';
import Fixture from './offcanvas-accessibility-test.svelte';

const extraElements: HTMLElement[] = [];
afterEach(() => extraElements.splice(0).forEach((element) => element.remove()));
function addOutsideButton(before = false): HTMLButtonElement {
    const button = document.createElement('button');
    if (before) document.body.prepend(button);
    else document.body.append(button);
    extraElements.push(button);
    return button;
}
async function settled() {
    await tick();
    await tick();
}

describe('Offcanvas PR review compatibility', () => {
    it('keeps a scrollable backdrop-free panel nonmodal while preserving Escape stack ownership', async () => {
        const opener = addOutsideButton(true);
        opener.focus();
        render(Fixture, { isBodyScrollable: true, useBackdrop: false });
        await settled();
        expect(opener).toHaveFocus();
        expect(screen.getByTestId('panel')).toHaveAttribute('role', 'dialog');
        expect(screen.getByTestId('panel')).not.toHaveAttribute('aria-modal');
        screen.getByTestId('outside').insertAdjacentHTML('beforeend', '<input aria-label="Page first"><input aria-label="Page second">');
        screen.getByRole('textbox', { name: 'Page first' }).focus();
        const user = userEvent.setup();
        await user.tab();
        expect(screen.getByRole('textbox', { name: 'Page second' })).toHaveFocus();
        await user.keyboard('{Escape}');
        expect(screen.getByRole('textbox', { name: 'Page second' })).toHaveFocus();
    });
    it('starts and stops modal focus management without re-registering an already open overlay', async () => {
        const { rerender } = render(Fixture, { isBodyScrollable: true, useBackdrop: false });
        await settled();
        const outside = screen.getByRole('button', { name: 'Outside' });
        outside.focus();
        await rerender({ isBodyScrollable: false });
        await settled();
        expect(screen.getByTestId('first-action')).toHaveFocus();
        expect(screen.getByTestId('panel')).toHaveAttribute('aria-modal', 'true');
        await rerender({ isBodyScrollable: true });
        expect(screen.getByTestId('first-action')).toHaveFocus();
        expect(screen.getByTestId('panel')).not.toHaveAttribute('aria-modal');
        await rerender({ modalShown: true });
        await settled();
        await rerender({ isBodyScrollable: false });
        await settled();
        expect(screen.getByRole('button', { name: 'Modal action' })).toHaveFocus();
    });
    it.each(['aria-hidden="true"', 'tabindex="-1"'])('continues native traversal from an internal %s control', async (attribute) => {
        render(Fixture, { empty: true });
        await settled();
        screen
            .getByTestId('panel')
            .insertAdjacentHTML(
                'beforeend',
                `<button>Close</button><a href="#one">Link one</a><button id="internal-noncandidate" ${attribute}>Internal</button><a href="#two" id="following-link">Link two</a>`
            );
        document.getElementById('internal-noncandidate')!.focus();
        await userEvent.setup().tab();
        expect(document.getElementById('following-link')).toHaveFocus();
    });
    it.each([false, true])('does not admit a href-less anchor as a native boundary (reverse=%s)', async (reverse) => {
        const before = addOutsideButton(true);
        render(Fixture, { empty: true });
        await settled();
        const after = addOutsideButton();
        const onOutsideFocus = vi.fn();
        before.addEventListener('focus', onOutsideFocus);
        after.addEventListener('focus', onOutsideFocus);
        screen.getByRole('button', { name: 'Outside' }).addEventListener('focus', onOutsideFocus);
        screen
            .getByTestId('panel')
            .insertAdjacentHTML(
                'beforeend',
                '<a class="disabled" aria-disabled="true">No href before</a><button id="real-boundary">Real</button><a>No href after</a>'
            );
        const real = document.getElementById('real-boundary')!;
        real.focus();
        await userEvent.setup().tab({ shift: reverse });
        expect(real).toHaveFocus();
        expect(onOutsideFocus).not.toHaveBeenCalled();
    });
    it('omits generated naming in inline mode and retains the same association when becoming an overlay', async () => {
        const { emit } = mockMatchMedia({ [BreakpointMinimumMediaQuery.lg!]: true });
        render(Fixture, { showOnBreakpoint: 'lg' });
        await settled();
        const panel = screen.getByTestId('panel');
        const id = screen.getByTestId('first-title').id;
        expect(panel).not.toHaveAttribute('aria-labelledby');
        emit(BreakpointMinimumMediaQuery.lg!, false);
        await settled();
        expect(panel).toHaveAttribute('aria-labelledby', id);
        emit(BreakpointMinimumMediaQuery.lg!, true);
        await settled();
        expect(panel).not.toHaveAttribute('aria-labelledby');
    });
    it('preserves consumer naming in inline mode', async () => {
        mockMatchMedia({ [BreakpointMinimumMediaQuery.lg!]: true });
        render(Fixture, { showOnBreakpoint: 'lg', names: { 'aria-labelledby': 'consumer-title' } });
        await settled();
        expect(screen.getByTestId('panel')).toHaveAttribute('aria-labelledby', 'consumer-title');
    });
    it('cancels only the dismissing backdrop default action so restored focus survives native mouse handling', async () => {
        const opener = addOutsideButton(true);
        opener.focus();
        render(Fixture, { useBackdrop: true });
        await settled();
        const event = new MouseEvent('mousedown', { button: 0, bubbles: true, cancelable: true });
        document.querySelector('.offcanvas-backdrop')!.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        await settled();
        expect(opener).toHaveFocus();
    });
    it('preserves an external control mouse default action on outside dismissal', async () => {
        render(Fixture, { useBackdrop: true });
        await settled();
        const outside = screen.getByRole('button', { name: 'Outside' });
        const event = new MouseEvent('mousedown', { button: 0, bubbles: true, cancelable: true });
        outside.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
    });
    it('preserves valid consumer focus placed before deferred panel entry settles', async () => {
        render(Fixture);
        const preferred = screen.getByTestId('last-action');
        preferred.focus();
        await settled();
        expect(preferred).toHaveFocus();
    });
    it.each([
        '<input autofocus aria-label="Preferred search">',
        '<input autofocus tabindex="-1" aria-label="Preferred search">',
        '<h2 autofocus tabindex="-1" aria-label="Preferred search">Search heading</h2>'
    ])('honors an available explicit autofocus entry target: %s', async (html) => {
        render(Fixture);
        screen.getByTestId('panel').insertAdjacentHTML('beforeend', html);
        await settled();
        expect(screen.getByLabelText('Preferred search')).toHaveFocus();
    });
    it('retains focus placed by the working onShow lifecycle path', async () => {
        render(Fixture, {
            onShow(event) {
                (event.currentTarget as HTMLElement).querySelector<HTMLElement>('[data-testid="last-action"]')?.focus();
            }
        });
        await settled();
        expect(screen.getByTestId('last-action')).toHaveFocus();
    });
    it('leaves focus inside a still-visible panel when crossing to inline mode', async () => {
        const { emit } = mockMatchMedia();
        const opener = addOutsideButton(true);
        opener.focus();
        render(Fixture, { showOnBreakpoint: 'lg' });
        await settled();
        const action = screen.getByTestId('last-action');
        action.focus();
        emit(BreakpointMinimumMediaQuery.lg!, true);
        await settled();
        expect(action).toHaveFocus();
    });
    it('hands focus to a surviving Modal when the top responsive panel becomes inline', async () => {
        const { emit } = mockMatchMedia();
        const { rerender } = render(Fixture, { isShown: false, modalShown: true, showOnBreakpoint: 'lg' });
        await settled();
        await rerender({ isShown: true });
        await settled();
        screen.getByTestId('last-action').focus();
        emit(BreakpointMinimumMediaQuery.lg!, true);
        await settled();
        expect(screen.getByRole('button', { name: 'Modal action' })).toHaveFocus();
    });
    it('hands focus to a surviving Modal when a top nonmodal panel closes', async () => {
        const { rerender } = render(Fixture, { isShown: false, modalShown: true, isBodyScrollable: true, useBackdrop: false });
        await settled();
        await rerender({ isShown: true });
        await settled();
        screen.getByTestId('last-action').focus();
        await rerender({ isShown: false });
        await settled();
        expect(screen.getByRole('button', { name: 'Modal action' })).toHaveFocus();
    });
    it.each(['details', 'radio', 'object', 'shadow', 'slot'])(
        'uses realm-safe predicates when wrapping into same-origin frame %s content',
        async (kind) => {
            render(Fixture, { empty: true });
            await settled();
            screen
                .getByTestId('panel')
                .insertAdjacentHTML(
                    'beforeend',
                    '<button id="outer-first">Outer first</button><button>Outer last</button><iframe id="realm-frame"></iframe>'
                );
            const frame = document.getElementById('realm-frame') as HTMLIFrameElement;
            const child = frame.contentDocument!;
            if (kind === 'details')
                child.body.innerHTML =
                    '<button>Frame first</button><details><summary id="frame-edge">Summary</summary><button>Closed content</button></details>';
            if (kind === 'radio') child.body.innerHTML = '<input type="radio" name="frame" checked id="frame-edge"><input type="radio" name="frame">';
            if (kind === 'object') child.body.innerHTML = '<button id="frame-edge">Real edge</button><object></object>';
            if (kind === 'shadow' || kind === 'slot') {
                child.body.innerHTML = '<button id="frame-edge">Real edge</button><div id="frame-host"></div>';
                const host = child.getElementById('frame-host')!;
                const shadow = host.attachShadow({ mode: 'open' });
                if (kind === 'shadow') {
                    host.setAttribute('inert', '');
                    shadow.innerHTML = '<button>Inert shadow content</button>';
                } else {
                    shadow.innerHTML = '<slot></slot>';
                    host.innerHTML = '<button id="frame-slotted">Slotted edge</button>';
                }
            }
            document.getElementById('outer-first')!.focus();
            await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
            const expected = child.getElementById(kind === 'slot' ? 'frame-slotted' : 'frame-edge');
            expect(document.activeElement).toBe(frame);
            expect(child.activeElement).toBe(expected);
        }
    );
});

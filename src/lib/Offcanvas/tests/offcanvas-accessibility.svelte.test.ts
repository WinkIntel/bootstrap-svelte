import { mockMatchMedia } from '$lib/common/tests/mock-match-media.js';
import { BreakpointMinimumMediaQuery } from '$lib/common/types.js';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync, tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Offcanvas } from '../index.js';
import Fixture from './offcanvas-accessibility-test.svelte';

let opener: HTMLButtonElement;
afterEach(() => opener?.remove());
function focusOpener() {
    opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    return opener;
}
async function settled() {
    await tick();
    await tick();
}

describe('Offcanvas overlay accessibility', () => {
    it('focuses the first available descendant on mount and every subsequent open, then restores the opener', async () => {
        focusOpener();
        const { rerender } = render(Fixture);
        await settled();
        expect(screen.getByTestId('first-action')).toHaveFocus();
        await rerender({ isShown: false });
        expect(opener).toHaveFocus();
        await rerender({ isShown: true });
        await settled();
        expect(screen.getByTestId('first-action')).toHaveFocus();
    });
    it('wraps forward and reverse Tab with live DOM order and contains focus outside the private panel', async () => {
        const { rerender } = render(Fixture);
        await settled();
        const first = screen.getByTestId('first-action');
        const last = screen.getByTestId('last-action');
        last.focus();
        await fireEvent.keyDown(window, { key: 'Tab' });
        expect(first).toHaveFocus();
        await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
        expect(last).toHaveFocus();
        first.before(last);
        first.focus();
        await fireEvent.keyDown(window, { key: 'Tab' });
        expect(last).toHaveFocus();
        await rerender({ replaceRef: true });
        screen.getByRole('button', { name: 'Outside' }).focus();
        await fireEvent.keyDown(window, { key: 'Tab' });
        expect(last).toHaveFocus();
    });
    it('uses the panel when there are no available descendants, including reverse Tab from the panel', async () => {
        render(Fixture, { empty: true });
        await settled();
        const panel = screen.getByTestId('panel');
        expect(panel).toHaveFocus();
        await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
        expect(panel).toHaveFocus();
    });
    it('wraps in native positive tabindex order, retaining DOM order among equal values', async () => {
        render(Fixture);
        await settled();
        const first = screen.getByTestId('first-action');
        const last = screen.getByTestId('last-action');
        first.tabIndex = 2;
        last.tabIndex = 1;
        first.focus();
        await fireEvent.keyDown(window, { key: 'Tab' });
        expect(last).toHaveFocus();
        await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
        expect(first).toHaveFocus();
    });
    it.each([
        [
            'checked radio',
            '<input type="radio" name="choice" checked id="radio-first"><input type="radio" name="choice" id="radio-last">',
            'radio-first'
        ],
        [
            'unchecked radio group',
            '<input type="radio" name="choice" id="radio-first"><input type="radio" name="choice" id="radio-last">',
            'radio-first'
        ],
        ['editable region', '<div contenteditable="true" id="editor">Edit text</div>', 'editor'],
        ['closed details', '<details><summary id="summary">Summary</summary><button>Collapsed action</button></details>', 'summary']
    ])('contains native Tab when the sole sequential stop is a %s', async (_kind, html, targetId) => {
        render(Fixture, { empty: true });
        await settled();
        screen.getByTestId('panel').insertAdjacentHTML('beforeend', html);
        const target = document.getElementById(targetId)!;
        target.focus();
        expect(target).toHaveFocus();
        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        target.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(target).toHaveFocus();
    });
    it('keeps same-name radio groups separate by form owner and ignores unavailable group members', async () => {
        render(Fixture, { empty: true });
        await settled();
        screen.getByTestId('panel').insertAdjacentHTML(
            'beforeend',
            `
            <form id="first-form"><input type="radio" name="choice" checked id="first-radio"><input type="radio" name="choice"></form>
            <form id="second-form"><input type="radio" name="choice"><input type="radio" name="choice" checked id="second-radio"></form>
            <input form="first-form" type="radio" name="choice" disabled>
        `
        );
        const first = document.getElementById('first-radio')!;
        const second = document.getElementById('second-radio')!;
        first.focus();
        await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
        expect(second).toHaveFocus();
        await fireEvent.keyDown(window, { key: 'Tab' });
        expect(first).toHaveFocus();
    });
    it('restores focus when an open panel unmounts and ignores an unavailable opener', async () => {
        focusOpener();
        const { rerender } = render(Fixture);
        await settled();
        await rerender({ renderPanel: false });
        expect(opener).toHaveFocus();
        await rerender({ renderPanel: true });
        await settled();
        opener.disabled = true;
        const outside = screen.getByRole('button', { name: 'Outside' });
        outside.focus();
        await rerender({ renderPanel: false });
        expect(outside).toHaveFocus();
    });
    it('does not let a pending focus task act after unmount', async () => {
        focusOpener();
        const view = render(Fixture);
        flushSync(() => view.unmount());
        await settled();
        expect(opener).toHaveFocus();
    });
    it('cancels pending entry after a synchronous close or responsive mode change', async () => {
        focusOpener();
        const view = render(Fixture);
        const closing = view.rerender({ isShown: false });
        flushSync();
        await closing;
        await settled();
        expect(opener).toHaveFocus();
        await view.rerender({ isShown: true });
        await settled();
        expect(screen.getByTestId('first-action')).toHaveFocus();
    });
    it('does not focus a lower Offcanvas after another overlay opens before settling', async () => {
        const view = render(Fixture);
        const lowerAction = screen.getByTestId('first-action');
        const focus = vi.spyOn(lowerAction, 'focus');
        const opening = view.rerender({ nested: true });
        flushSync();
        await opening;
        await settled();
        expect(focus).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Nested action' })).toHaveFocus();
    });
    it('recovers Tab from the panel and from descendants that become unavailable', async () => {
        render(Fixture);
        await settled();
        screen.getByTestId('panel').focus();
        await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
        expect(screen.getByTestId('last-action')).toHaveFocus();
        screen.getByTestId('last-action').setAttribute('hidden', '');
        await fireEvent.keyDown(window, { key: 'Tab' });
        expect(screen.getByTestId('first-action')).toHaveFocus();
    });
    it('leaves inline content unfocused and starts/stops focus management at responsive crossings', async () => {
        const { emit } = mockMatchMedia({ [BreakpointMinimumMediaQuery.lg!]: true });
        focusOpener();
        render(Fixture, { showOnBreakpoint: 'lg' });
        await settled();
        expect(opener).toHaveFocus();
        expect(screen.getByTestId('panel')).not.toHaveAttribute('role');
        await fireEvent.keyDown(window, { key: 'Tab' });
        expect(opener).toHaveFocus();
        emit(BreakpointMinimumMediaQuery.lg!, false);
        await settled();
        expect(screen.getByTestId('first-action')).toHaveFocus();
        emit(BreakpointMinimumMediaQuery.lg!, true);
        await settled();
        expect(opener).toHaveFocus();
        expect(screen.getByTestId('panel')).not.toHaveAttribute('aria-modal');
    });
    it('keeps focus in the surviving Offcanvas after a Modal above it closes', async () => {
        const { rerender } = render(Fixture);
        await settled();
        await rerender({ modalShown: true });
        await settled();
        expect(screen.getByRole('button', { name: 'Modal action' })).toHaveFocus();
        await rerender({ modalShown: false });
        await settled();
        expect(screen.getByTestId('first-action')).toHaveFocus();
    });
    it('does not steal focus from a top Modal when a lower Offcanvas closes or unmounts', async () => {
        const { rerender } = render(Fixture);
        await rerender({ modalShown: true });
        await settled();
        await rerender({ isShown: false });
        await settled();
        expect(screen.getByRole('button', { name: 'Modal action' })).toHaveFocus();
        await rerender({ renderPanel: false });
        expect(screen.getByRole('button', { name: 'Modal action' })).toHaveFocus();
    });
    it('returns focus to the surviving overlay when its opener is outside that overlay', async () => {
        const { rerender } = render(Fixture);
        await settled();
        screen.getByRole('button', { name: 'Outside' }).focus();
        await rerender({ nested: true });
        await settled();
        expect(screen.getByRole('button', { name: 'Nested action' })).toHaveFocus();
        await rerender({ nested: false });
        await settled();
        expect(screen.getByTestId('first-action')).toHaveFocus();
    });
});

describe('Offcanvas title association', () => {
    it('labels with the first mounted title, retaining its registry position through ID changes and removal', async () => {
        const { rerender } = render(Fixture);
        await settled();
        const panel = screen.getByTestId('panel');
        const title = screen.getByTestId('first-title');
        expect(title.id).toMatch(/^offcanvas-title-/);
        expect(panel).toHaveAttribute('aria-labelledby', title.id);
        expect(panel).toHaveAccessibleName('First title');
        await rerender({ titleId: 'renamed' });
        expect(panel).toHaveAttribute('aria-labelledby', 'renamed');
        await rerender({ firstTitle: false });
        expect(panel).toHaveAttribute('aria-labelledby', 'second-title');
    });
    it('retains first-mount order when a title opts out and later gets an ID', async () => {
        const { rerender } = render(Fixture);
        await rerender({ titleId: null });
        expect(screen.getByTestId('panel')).toHaveAttribute('aria-labelledby', 'second-title');
        await rerender({ titleId: 'restored' });
        expect(screen.getByTestId('panel')).toHaveAttribute('aria-labelledby', 'restored');
    });
    it.each([
        { 'aria-label': 'Explicit' },
        { 'aria-labelledby': 'external' },
        { 'aria-label': '' },
        { 'aria-label': null },
        { 'aria-labelledby': '' },
        { 'aria-labelledby': null }
    ])('preserves explicit accessible names or opt-outs: %j', async (names) => {
        render(Fixture, { names });
        await settled();
        const panel = screen.getByTestId('panel');
        if ('aria-labelledby' in names && names['aria-labelledby'] !== null)
            expect(panel).toHaveAttribute('aria-labelledby', names['aria-labelledby']);
        else expect(panel).not.toHaveAttribute('aria-labelledby');
        if (names['aria-label'] != null) expect(panel).toHaveAttribute('aria-label', names['aria-label']);
    });
    it.each([{ 'aria-label': undefined }, { 'aria-labelledby': undefined }])(
        'uses the title when an optional naming prop is undefined: %j',
        async (names) => {
            render(Fixture, { names });
            await settled();
            expect(screen.getByTestId('panel')).toHaveAccessibleName('First title');
        }
    );
    it('scopes nested titles to their nearest Offcanvas root and allows standalone titles', async () => {
        render(Fixture, { nested: true });
        await settled();
        expect(screen.getByTestId('panel')).toHaveAccessibleName('First title');
        expect(screen.getByTestId('nested-panel')).toHaveAccessibleName('Nested title');
        const { container } = render(Offcanvas.Title);
        expect(container.querySelector('h5')?.id).toMatch(/^offcanvas-title-/);
    });
});

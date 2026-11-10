import { mockMatchMedia } from '$lib/common/tests/mock-match-media.js';
import { BreakpointMinimumMediaQuery } from '$lib/common/types.js';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
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
    it('traverses an unchecked radio group in both directions without skipping adjacent controls', async () => {
        render(Fixture, { empty: true });
        await settled();
        screen.getByTestId('panel').insertAdjacentHTML(
            'beforeend',
            `
            <button id="sequence-a">A</button><input type="radio" name="direction" id="direction-r1">
            <input type="radio" name="direction" id="direction-r2"><button id="sequence-b">B</button>
        `
        );
        const user = userEvent.setup();
        document.getElementById('sequence-b')!.focus();
        await user.tab({ shift: true });
        expect(document.getElementById('direction-r2')).toHaveFocus();
        await user.tab({ shift: true });
        expect(document.getElementById('sequence-a')).toHaveFocus();
        await user.tab({ shift: true });
        expect(document.getElementById('sequence-b')).toHaveFocus();
        document.getElementById('sequence-a')!.focus();
        await user.tab();
        expect(document.getElementById('direction-r1')).toHaveFocus();
        await user.tab();
        expect(document.getElementById('sequence-b')).toHaveFocus();
    });
    it.each([
        ['available', '', '', true],
        ['hidden', 'hidden', '', false],
        ['disabled', 'disabled', '', false],
        ['negative tabindex', 'tabindex="-1"', '', false],
        ['different form owner', '', 'form="external-form"', false]
    ])('uses whole-tree radio membership for a checked %s external group member', async (_kind, attributes, ownership, shouldWrap) => {
        render(Fixture, { empty: true });
        await settled();
        screen
            .getByTestId('outside')
            .insertAdjacentHTML(
                'beforeend',
                `<form id="external-form"></form><input type="radio" name="spanning" checked ${attributes} ${ownership}>`
            );
        screen
            .getByTestId('panel')
            .insertAdjacentHTML(
                'beforeend',
                '<button id="spanning-action">Action</button><input type="radio" name="spanning" id="spanning-internal">'
            );
        const action = document.getElementById('spanning-action')!;
        action.focus();
        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        action.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(shouldWrap);
        expect(action).toHaveFocus();
    });
    it.each([
        ['display contents', '<div tabindex="0" style="display:contents">Contents</div>'],
        ['content visibility hidden descendant', '<div style="content-visibility:hidden"><button>Hidden content</button></div>']
    ])('wraps before a nonfocusable %s candidate after the last control', async (_kind, html) => {
        render(Fixture, { empty: true });
        await settled();
        screen.getByTestId('panel').insertAdjacentHTML('beforeend', `<button id="visible-last">Visible</button>${html}`);
        const target = document.getElementById('visible-last')!;
        target.focus();
        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        target.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(target).toHaveFocus();
    });
    it.each([
        ['overridden visibility', '<div style="visibility:hidden"><button id="available-only" style="visibility:visible">Visible</button></div>'],
        ['case-insensitive editable', '<div id="available-only" contenteditable="TRUE">Editable</div>'],
        ['mixed-case plaintext editor', '<div id="available-only" contenteditable="PlainText-Only">Editable</div>'],
        ['editor below case-insensitive false', '<div contenteditable="FALSE"><div id="available-only" contenteditable="TRUE">Editable</div></div>']
    ])('retains native focus on the sole %s control', async (_kind, html) => {
        render(Fixture, { empty: true });
        await settled();
        screen.getByTestId('panel').insertAdjacentHTML('beforeend', html);
        const target = document.getElementById('available-only')!;
        target.focus();
        expect(target).toHaveFocus();
        await fireEvent.keyDown(target, { key: 'Tab' });
        expect(target).toHaveFocus();
        await fireEvent.keyDown(target, { key: 'Tab', shiftKey: true });
        expect(target).toHaveFocus();
    });
    it.each([false, true])('retains native group ownership for an ARIA-hidden external checked radio (ancestor=%s)', async (ancestor) => {
        render(Fixture, { empty: true });
        await settled();
        const outside = screen.getByTestId('outside');
        outside.insertAdjacentHTML('beforeend', '<input type="radio" name="aria-owner" checked>');
        (ancestor ? outside : outside.querySelector('input')!).setAttribute('aria-hidden', 'true');
        screen
            .getByTestId('panel')
            .insertAdjacentHTML('beforeend', '<button id="aria-owner-action">Action</button><input type="radio" name="aria-owner">');
        const action = document.getElementById('aria-owner-action')!;
        action.focus();
        const user = userEvent.setup();
        await user.tab();
        expect(action).toHaveFocus();
        await user.tab({ shift: true });
        expect(action).toHaveFocus();
    });
    it('recovers a native forward focus escape from a panel-owned browsing context', async () => {
        render(Fixture, { empty: true });
        await settled();
        screen
            .getByTestId('panel')
            .insertAdjacentHTML('beforeend', '<button id="frame-boundary-first">First</button><iframe id="boundary-frame"></iframe>');
        const frame = document.getElementById('boundary-frame') as HTMLIFrameElement;
        frame.contentDocument!.body.innerHTML = '<button id="frame-control">Frame action</button>';
        frame.contentDocument!.getElementById('frame-control')!.focus();
        await fireEvent.blur(window);
        const after = focusOpener();
        expect(document.getElementById('frame-boundary-first')).toHaveFocus();
        expect(after).not.toHaveFocus();
    });
    it('recovers reverse browsing-context escape into the last embedded control while allowing pointer ownership', async () => {
        render(Fixture, { empty: true });
        await settled();
        screen.getByTestId('panel').insertAdjacentHTML('beforeend', '<button>First</button><iframe id="reverse-frame"></iframe>');
        const frame = document.getElementById('reverse-frame') as HTMLIFrameElement;
        frame.contentDocument!.body.innerHTML = '<button id="reverse-control">Frame action</button>';
        const inner = frame.contentDocument!.getElementById('reverse-control')!;
        inner.focus();
        await fireEvent.blur(window);
        const outside = screen.getByRole('button', { name: 'Outside' });
        outside.focus();
        expect(document.activeElement).toBe(frame);
        expect(inner).toHaveFocus();
        await fireEvent.mouseDown(outside);
        outside.focus();
        expect(outside).toHaveFocus();
    });
    it('preserves an open shadow focus scope and wraps at its deepest boundary', async () => {
        render(Fixture, { empty: true });
        await settled();
        const panel = screen.getByTestId('panel');
        panel.insertAdjacentHTML('beforeend', '<button id="shadow-first">First</button><div id="shadow-host" tabindex="0"></div>');
        const host = document.getElementById('shadow-host')!;
        const shadow = host.attachShadow({ mode: 'open' });
        shadow.innerHTML = '<button id="shadow-a">A</button><button id="shadow-b">B</button>';
        host.focus();
        const entering = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, composed: true, cancelable: true });
        host.dispatchEvent(entering);
        expect(entering.defaultPrevented).toBe(false);
        const last = shadow.getElementById('shadow-b') as HTMLElement;
        last.focus();
        await fireEvent.keyDown(last, { key: 'Tab', composed: true });
        expect(document.getElementById('shadow-first')).toHaveFocus();
        await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
        expect(shadow.activeElement).toBe(last);
    });
    it('ignores an empty object as a sequential stop and retains resource-backed objects', async () => {
        render(Fixture, { empty: true });
        await settled();
        screen.getByTestId('panel').insertAdjacentHTML('beforeend', '<button id="object-action">First</button><object></object>');
        const action = document.getElementById('object-action')!;
        action.focus();
        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        action.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(action).toHaveFocus();
        screen.getByTestId('panel').querySelector('object')!.setAttribute('data', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E');
        const loaded = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        action.dispatchEvent(loaded);
        expect(loaded.defaultPrevented).toBe(false);
    });
    it('respects a control that consumes Tab before it reaches the overlay handler', async () => {
        render(Fixture);
        await settled();
        const last = screen.getByTestId('last-action');
        last.focus();
        last.addEventListener('keydown', (event) => event.preventDefault());
        await fireEvent.keyDown(last, { key: 'Tab' });
        expect(last).toHaveFocus();
        screen.getByRole('button', { name: 'Outside' }).focus();
        expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
    });
    it.each(['hide', 'inline', 'unmount'])('cancels pending sequential recovery on %s', async (mode) => {
        const { emit } = mockMatchMedia();
        const view = render(Fixture, { showOnBreakpoint: 'lg' });
        await settled();
        const outside = focusOpener();
        const first = screen.getByTestId('first-action');
        first.focus();
        await fireEvent.keyDown(first, { key: 'Tab' });
        if (mode === 'hide') await view.rerender({ isShown: false });
        else if (mode === 'inline') {
            emit(BreakpointMinimumMediaQuery.lg!, true);
            await settled();
        } else view.unmount();
        outside.focus();
        expect(outside).toHaveFocus();
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

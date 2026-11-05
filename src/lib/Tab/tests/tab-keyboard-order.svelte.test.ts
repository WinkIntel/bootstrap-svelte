import { NavLinkState, TabRootState } from '$lib/common/nav-tab.svelte.js';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import KeyboardTest from './tab-keyboard-test.svelte';

const names = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const link = (name: string) => document.querySelector<HTMLElement>(`#key-${name}`)!;

// Calibrate one reversed ordering pass using this engine's native Array.sort.
// This avoids tying the comparison budget to a particular sorting algorithm.
function reversedPassComparisons(length: number): number {
    let comparisons = 0;
    Array.from({ length }, (_, index) => index).sort((a, b) => {
        comparisons++;
        return b - a;
    });
    return comparisons;
}

function trackComparisons(elements: HTMLElement[]) {
    const spies = elements.map((element) => vi.spyOn(element, 'compareDocumentPosition'));
    return {
        count: () => spies.reduce((total, spy) => total + spy.mock.calls.length, 0),
        restore: () => spies.forEach((spy) => spy.mockRestore())
    };
}

describe.each(['tab', 'nav'] as const)('%s shared tab ordering', (kind) => {
    it('sorts once for a keyed DOM reorder across all roving tab stops', async () => {
        const { rerender } = render(KeyboardTest, { kind, order: names, initial: '', disabled: [] });
        const elements = names.map(link);
        const comparisons = trackComparisons(elements);
        try {
            await rerender({ order: names.toReversed() });
            expect(elements.at(-1)).toHaveAttribute('tabindex', '0');
            expect(comparisons.count()).toBe(reversedPassComparisons(names.length));
        } finally {
            comparisons.restore();
        }
    });

    it('reuses ordering for a selection-only change without pane-control registry churn', async () => {
        render(KeyboardTest, { kind, order: names, initial: '', disabled: [] });
        const elements = names.map(link);
        const comparisons = trackComparisons(elements);
        try {
            // H has no pane controls or nested roots to register/unregister.
            await fireEvent.click(elements.at(-1)!);
            expect(elements.at(-1)).toHaveAttribute('aria-selected', 'true');
            expect(elements.at(-1)).toHaveAttribute('tabindex', '0');
            expect(elements[0]).toHaveAttribute('tabindex', '-1');
            expect(comparisons.count()).toBe(0);
            await fireEvent.keyDown(elements.at(-1)!, { key: 'ArrowLeft' });
            expect(elements.at(-2)).toHaveFocus();
            expect(elements.at(-2)).toHaveAttribute('aria-selected', 'true');
            expect(comparisons.count()).toBe(0);
        } finally {
            comparisons.restore();
        }
    });

    it('handles a sole mounted link, later bindings, removal and remount in DOM order', async () => {
        const { rerender } = render(KeyboardTest, { kind, order: ['c'], initial: '', disabled: [] });
        expect(link('c')).toHaveAttribute('tabindex', '0');
        await rerender({ order: ['a', 'c'] });
        expect(link('a')).toHaveAttribute('tabindex', '0');
        expect(link('c')).toHaveAttribute('tabindex', '-1');
        await fireEvent.keyDown(link('a'), { key: 'End' });
        expect(link('c')).toHaveFocus();
        await rerender({ order: [] });
        await rerender({ order: ['b', 'a'] });
        expect(link('b')).toHaveAttribute('tabindex', '0');
        await fireEvent.keyDown(link('b'), { key: 'ArrowRight' });
        expect(link('a')).toHaveFocus();
    });

    it('refreshes eligibility for disabled and role changes without losing rendered selection', async () => {
        const { rerender } = render(KeyboardTest, { kind, initial: '', disabled: ['a', 'b', 'c'] });
        expect(link('a')).toHaveAttribute('tabindex', '-1');
        await rerender({ disabled: ['b'] });
        expect(link('a')).toHaveAttribute('tabindex', '0');
        await fireEvent.keyDown(link('a'), { key: 'End' });
        expect(link('c')).toHaveFocus();
        expect(link('c')).toHaveAttribute('aria-selected', 'true');
        await rerender({ disabled: ['b', 'c'] });
        expect(link('a')).toHaveAttribute('tabindex', '0');
        await rerender({ disabled: ['b'], linkRole: null });
        expect(link('c')).not.toHaveAttribute('tabindex');
        await rerender({ linkRole: 'tab' });
        expect(link('c')).toHaveAttribute('tabindex', '0');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Pane C');
    });
});

it('refreshes native disabled button eligibility after all-disabled and selected-disabled updates', async () => {
    const { rerender } = render(KeyboardTest, { initial: '', disabled: [], nativeDisabled: ['a', 'b', 'c'] });
    expect(link('a')).toHaveAttribute('tabindex', '-1');
    await rerender({ nativeDisabled: ['b'] });
    expect(link('a')).toHaveAttribute('tabindex', '0');
    await fireEvent.keyDown(link('a'), { key: 'End' });
    expect(link('c')).toHaveFocus();
    await rerender({ nativeDisabled: ['a', 'c'] });
    expect(link('b')).toHaveAttribute('tabindex', '0');
    await rerender({ nativeDisabled: [] });
    expect(link('c')).toHaveAttribute('tabindex', '0');
});

it('orders bound states correctly across a null binding and refreshes each later binding', () => {
    const root = new TabRootState({});
    const roles = { isTablist: true, hasTablistContext: true, group: root };
    const links = ['a', 'b', 'c'].map((id) => new NavLinkState({ id, href: `#${id}` }, root, roles, true));
    const unregister = links.map((state) => root.registerNavLinkState(state));
    const list = document.createElement('div');
    list.setAttribute('role', 'tablist');
    const buttons = ['c', 'b', 'a'].map((name) => {
        const button = document.createElement('button');
        button.textContent = name;
        list.appendChild(button);
        return button;
    });
    document.body.appendChild(list);
    try {
        // Model bind:this callbacks arriving separately from registration. The
        // registry is A/B/C, DOM is C/B/A, and B has not bound its element yet.
        links[0]!.element = buttons[2]!;
        expect(root.getTabIndex(links[0]!)).toBe(0);
        links[2]!.element = buttons[0]!;
        expect(root.getTabIndex(links[2]!)).toBe(0);
        expect(root.getTabIndex(links[0]!)).toBe(-1);
        links[1]!.element = buttons[1]!;
        links[2]!.element = null;
        expect(root.getTabIndex(links[1]!)).toBe(0);
        links[2]!.element = buttons[0]!;
        expect(root.getTabIndex(links[2]!)).toBe(0);
    } finally {
        unregister.forEach((cleanup) => cleanup());
        list.remove();
    }
});

it.each(['tab', 'nav'] as const)('uses live %s order changed by an earlier keydown listener before observer delivery', async (kind) => {
    render(KeyboardTest, { kind, initial: '', disabled: [] });
    const a = link('a');
    const b = link('b');
    const c = link('c');
    expect(a).toHaveAttribute('tabindex', '0');
    a.addEventListener('keydown', () => b.before(c), { once: true });
    await fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(c).toHaveFocus();
    expect(c).toHaveAttribute('aria-selected', 'true');
});

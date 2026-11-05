import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import KeyboardTest from './tab-keyboard-test.svelte';

const tab = (name: string) => within(screen.getByRole('tablist', { name: 'Main' })).getByRole('tab', { name });

describe.each(['tab', 'nav'] as const)('%s tab keyboard', (kind) => {
    it.each([
        ['ArrowRight', 'C'],
        ['ArrowDown', 'C'],
        ['ArrowLeft', 'C'],
        ['ArrowUp', 'C'],
        ['End', 'C'],
        ['Home', 'A']
    ])('activates and focuses with %s, skipping disabled tabs and wrapping', async (key, destination) => {
        render(KeyboardTest, { kind });
        tab('A').focus();
        await fireEvent.keyDown(tab('A'), { key });
        expect(tab(destination)).toHaveFocus();
        expect(tab(destination)).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent(`Pane ${destination}`);
        expect(screen.getByTestId('callbacks')).toHaveTextContent('1:1');
    });

    it('uses one tab stop and selected ARIA instead of aria-current', async () => {
        render(KeyboardTest, { kind });
        expect(tab('A')).toHaveAttribute('tabindex', '0');
        expect(tab('B')).toHaveAttribute('tabindex', '-1');
        expect(tab('C')).toHaveAttribute('tabindex', '-1');
        expect(tab('A')).not.toHaveAttribute('aria-current');
        await fireEvent.click(tab('C'));
        // Nav.Link's explicit initial isActive=true remains controlled.
        if (kind === 'tab') expect(tab('A')).toHaveAttribute('tabindex', '-1');
        expect(screen.getByTestId('callbacks')).toHaveTextContent('1:0');
    });

    it('blocks disabled synthetic clicks before selection and callbacks', async () => {
        render(KeyboardTest, { kind });
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        tab('B').dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(tab('A')).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByTestId('callbacks')).toHaveTextContent('0:0');
    });

    it('uses current DOM order after keyed reordering and remounting', async () => {
        const { rerender } = render(KeyboardTest, { kind, disabled: [], initial: '' });
        await rerender({ order: ['c', 'a', 'b'] });
        expect(tab('C')).toHaveAttribute('tabindex', '0');
        tab('C').focus();
        await fireEvent.keyDown(tab('C'), { key: 'ArrowRight' });
        expect(tab('A')).toHaveFocus();
        await rerender({ order: ['c', 'b'] });
        await rerender({ order: ['a', 'c', 'b'] });
        tab('A').focus();
        await fireEvent.keyDown(tab('A'), { key: 'ArrowRight' });
        expect(tab('C')).toHaveFocus();
    });

    it('keeps the list reachable after disable/removal/empty updates without moving focus', async () => {
        const { rerender } = render(KeyboardTest, { kind });
        const outside = screen.getByTestId('callbacks');
        outside.tabIndex = 0;
        outside.focus();
        await rerender({ disabled: ['a', 'b'] });
        expect(tab('C')).toHaveAttribute('tabindex', '0');
        expect(outside).toHaveFocus();
        await rerender({ order: ['b', 'c'] });
        expect(tab('C')).toHaveAttribute('tabindex', '0');
        await rerender({ disabled: ['b', 'c'] });
        expect(tab('C')).toHaveAttribute('tabindex', '-1');
        await rerender({ order: [] });
        await rerender({ order: ['c'], disabled: [] });
        expect(tab('C')).toHaveAttribute('tabindex', '0');
        expect(outside).toHaveFocus();
    });

    it.each([null, 'menuitem'] as const)('honors effective role %s and reactive opt-in', async (linkRole) => {
        const { container, rerender } = render(KeyboardTest, { kind, linkRole, consumerTabIndex: 4 });
        const a = container.querySelector<HTMLElement>('#key-a')!;
        expect(a.getAttribute('role')).toBe(linkRole);
        expect(a).not.toHaveAttribute('aria-selected');
        expect(a).not.toHaveAttribute('aria-controls');
        expect(a).toHaveAttribute('tabindex', '4');
        const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true });
        a.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
        await rerender({ linkRole: 'tab' });
        await fireEvent.keyDown(tab('A'), { key: 'End' });
        expect(tab('C')).toHaveFocus();
    });

    it('preserves role-opted-out root behavior and consumer keyboard cancellation', async () => {
        const { container, rerender } = render(KeyboardTest, { kind, rootRole: null, consumerTabIndex: 3 });
        const a = container.querySelector<HTMLElement>('#key-a')!;
        expect(a).not.toHaveAttribute('aria-selected');
        expect(a).toHaveAttribute('tabindex', '3');
        const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true });
        a.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
        await rerender({ rootRole: 'tablist', cancelKeys: true });
        a.focus();
        await fireEvent.keyDown(a, { key: 'End' });
        expect(a).toHaveFocus();
        expect(tab('A')).toHaveAttribute('aria-selected', 'true');
    });

    it('does not trust consumer-reassigned element refs for keyboard focus', async () => {
        render(KeyboardTest, { kind, corruptRef: true });
        await fireEvent.keyDown(tab('A'), { key: 'End' });
        expect(tab('C')).toHaveFocus();
    });
});

it('scopes keys and tab stops to independent tablists and nested roots', async () => {
    render(KeyboardTest, { secondList: true, nested: true });
    const second = within(screen.getByRole('tablist', { name: 'Second' }));
    expect(second.getByRole('tab', { name: 'D' })).toHaveAttribute('tabindex', '0');
    await fireEvent.keyDown(second.getByRole('tab', { name: 'D' }), { key: 'End' });
    expect(second.getByRole('tab', { name: 'E' })).toHaveFocus();
    await fireEvent.click(tab('A'));
    const inner = within(screen.getByRole('tablist', { name: 'Nested' }));
    await fireEvent.keyDown(inner.getByRole('tab', { name: 'Inner A' }), { key: 'End' });
    expect(inner.getByRole('tab', { name: 'Inner B' })).toHaveFocus();
    expect(tab('A')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Pane control')).not.toHaveAttribute('tabindex');
});

it('preserves controlled Nav.Link rendered selection and ordinary navigation keys', async () => {
    const { rerender, unmount } = render(KeyboardTest, { kind: 'nav', controlled: true, disabled: [] });
    await fireEvent.keyDown(tab('A'), { key: 'End' });
    expect(tab('C')).toHaveFocus();
    expect(tab('A')).toHaveAttribute('aria-selected', 'true');
    expect(tab('C')).toHaveAttribute('aria-selected', 'false');
    expect(tab('A')).toHaveAttribute('tabindex', '0');
    await rerender({ initial: 'c' });
    expect(tab('C')).toHaveAttribute('tabindex', '0');
    await unmount();
    render(KeyboardTest, { kind: 'nav', ordinary: true, consumerTabIndex: 5 });
    const link = screen.getByRole('link', { name: 'A' });
    const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(link).toHaveAttribute('tabindex', '5');
    expect(link).toHaveAttribute('aria-current', 'page');
});

it.each([false, true])('supports all four arrow keys in vertical=%s tablists', async (vertical) => {
    render(KeyboardTest, { kind: 'nav', initial: '', disabled: [], vertical });
    const a = tab('A');
    expect(a).toHaveAttribute('tabindex', '0');
    for (const [key, name] of [
        ['ArrowRight', 'B'],
        ['ArrowDown', 'C'],
        ['ArrowLeft', 'B'],
        ['ArrowUp', 'A']
    ] as const) {
        const source = document.activeElement?.getAttribute('role') === 'tab' ? document.activeElement! : a;
        await fireEvent.keyDown(source, { key });
        expect(tab(name)).toHaveFocus();
        expect(tab(name)).toHaveAttribute('aria-selected', 'true');
        expect(tab(name)).toHaveAttribute('tabindex', '0');
        expect(screen.getByRole('tabpanel')).toHaveTextContent(`Pane ${name}`);
    }
});

it.each(['tab', 'nav'] as const)('leaves Tab and unhandled keys alone for %s links', async (kind) => {
    render(KeyboardTest, { kind });
    const a = tab('A');
    a.focus();
    for (const key of ['Tab', 'Enter', ' ', 'Escape', 'x']) {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        a.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
        expect(a).toHaveFocus();
        expect(a).toHaveAttribute('aria-selected', 'true');
    }
});

it('retains explicit ordinary Nav.Link active props when another link is clicked', async () => {
    render(KeyboardTest, { kind: 'nav', ordinary: true, controlled: true, disabled: [] });
    await fireEvent.click(screen.getByRole('link', { name: 'C' }));
    expect(screen.getByRole('link', { name: 'A' })).toHaveClass('active');
    expect(screen.getByRole('link', { name: 'C' })).not.toHaveClass('active');
});

it('uses nearest authored tablists for bare strip links and nested list boundaries', async () => {
    render(KeyboardTest, { rawLists: true });
    await fireEvent.keyDown(tab('A'), { key: 'End' });
    expect(tab('C')).toHaveFocus();
    const inner = within(screen.getByRole('tablist', { name: 'Raw nested' }));
    expect(inner.getByRole('tab', { name: 'Raw D' })).toHaveAttribute('tabindex', '0');
    await fireEvent.keyDown(inner.getByRole('tab', { name: 'Raw D' }), { key: 'Home' });
    expect(inner.getByRole('tab', { name: 'Raw D' })).toHaveFocus();
    await fireEvent.keyDown(inner.getByRole('tab', { name: 'Raw D' }), { key: 'ArrowLeft' });
    expect(inner.getByRole('tab', { name: 'Raw E' })).toHaveFocus();
});

it.each(['tab', 'nav'] as const)('preserves explicit null tabindex for %s links', (kind) => {
    render(KeyboardTest, { kind, tabindexNull: true });
    expect(tab('A')).not.toHaveAttribute('tabindex');
    expect(tab('B')).toHaveAttribute('tabindex', '-1');
});

it('preserves explicit Tab.NavLink panel associations and selected ARIA overrides', () => {
    render(KeyboardTest, { consumerAria: true });
    expect(tab('A')).toHaveAttribute('aria-controls', 'consumer-panel');
    expect(tab('A')).toHaveAttribute('aria-selected', 'false');
});

it('skips native disabled Tab.NavLink buttons and blocks synthetic activation', async () => {
    render(KeyboardTest, { disabled: [], nativeDisabled: ['b'] });
    await fireEvent.keyDown(tab('A'), { key: 'ArrowRight' });
    expect(tab('C')).toHaveFocus();
    expect(tab('C')).toHaveAttribute('aria-selected', 'true');
    expect(tab('B')).toHaveAttribute('tabindex', '-1');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    tab('B').dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(tab('C')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('callbacks')).toHaveTextContent('1:1');
});

it.each(['tab', 'nav'] as const)('preserves a shared public ref owned by a remaining %s link', async (kind) => {
    const { component, rerender } = render(KeyboardTest, { kind });
    const c = tab('C');
    expect(component.readRef()).toBe(c);
    await rerender({ order: ['b', 'c'] });
    expect(component.readRef()).toBe(c);
    await fireEvent.keyDown(c, { key: 'Home' });
    expect(c).toHaveFocus();
});

it.each(['tab', 'nav'] as const)('preserves a consumer-reassigned public ref when %s links unmount', async (kind) => {
    const { component, unmount } = render(KeyboardTest, { kind, corruptRef: true });
    const external = component.readRef();
    expect(external).not.toBe(tab('C'));
    await unmount();
    expect(component.readRef()).toBe(external);
});

describe.each(['tab', 'nav'] as const)('%s review regressions', (kind) => {
    it('leaves bare links natively tabbable without consuming arrow keys', async () => {
        const { container, rerender } = render(KeyboardTest, { kind, bare: true });
        for (const name of ['a', 'c']) {
            const link = container.querySelector<HTMLElement>(`#key-${name}`)!;
            expect(link).not.toHaveAttribute('tabindex');
            link.focus();
            const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true });
            await fireEvent(link, event);
            expect(event.defaultPrevented).toBe(false);
            expect(link).toHaveFocus();
        }
        await rerender({ bare: false });
        expect(tab('A')).toHaveAttribute('tabindex', '0');
        await fireEvent.keyDown(tab('A'), { key: 'End' });
        expect(tab('C')).toHaveFocus();
    });

    it('uses the destination click callback once with its DOM currentTarget', async () => {
        render(KeyboardTest, { kind, initial: '' });
        const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true });
        await fireEvent(tab('A'), event);
        expect(event.defaultPrevented).toBe(true);
        expect(tab('C')).toHaveFocus();
        expect(tab('C')).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByTestId('callbacks')).toHaveTextContent('1:1');
        expect(screen.getByTestId('last-click')).toHaveTextContent('click:key-c');
    });

    it('does not suppress a peer listener at the Svelte delegation target', async () => {
        const { container } = render(KeyboardTest, { kind });
        const peer = vi.fn();
        container.addEventListener('keydown', peer);
        await fireEvent.keyDown(tab('A'), { key: 'End' });
        expect(peer).toHaveBeenCalledOnce();
        container.removeEventListener('keydown', peer);
    });

    it.each(['altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'isComposing'] as const)('preserves %s keyboard combinations', async (modifier) => {
        render(KeyboardTest, { kind });
        const a = tab('A');
        a.focus();
        for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']) {
            const event = new KeyboardEvent('keydown', { key, [modifier]: true, bubbles: true, cancelable: true });
            await fireEvent(a, event);
            expect(event.defaultPrevented).toBe(false);
            expect(a).toHaveFocus();
            expect(a).toHaveAttribute('aria-selected', 'true');
        }
        expect(screen.getByTestId('callbacks')).toHaveTextContent('0:6');
    });

    it('does not rebuild observation or invalidate tab order for label-only mutations', async () => {
        const { rerender, unmount } = render(KeyboardTest, { kind, initial: '' });
        const observe = vi.spyOn(MutationObserver.prototype, 'observe');
        const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
        const compare = vi.spyOn(tab('A'), 'compareDocumentPosition');
        try {
            await rerender({ badge: true });
            tab('A').querySelector('span')!.setAttribute('role', 'img');
            await tick();
            expect(observe).not.toHaveBeenCalled();
            expect(disconnect).not.toHaveBeenCalled();
            expect(compare).not.toHaveBeenCalled();
            await rerender({ badge: false, order: ['c', 'b', 'a'], initial: '' });
            expect(tab('C')).toHaveAttribute('tabindex', '0');
            await fireEvent.keyDown(tab('C'), { key: 'ArrowRight' });
            expect(tab('A')).toHaveFocus();
            disconnect.mockClear();
            await unmount();
            expect(disconnect).toHaveBeenCalledOnce();
        } finally {
            observe.mockRestore();
            disconnect.mockRestore();
            compare.mockRestore();
        }
    });
});

it('synchronizes controlled Nav.Link selection through its existing click callback', async () => {
    render(KeyboardTest, { kind: 'nav', controlled: true, syncControlled: true });
    await fireEvent.keyDown(tab('A'), { key: 'End' });
    expect(tab('C')).toHaveFocus();
    expect(tab('C')).toHaveAttribute('aria-selected', 'true');
    expect(tab('C')).toHaveAttribute('tabindex', '0');
    expect(tab('A')).toHaveAttribute('aria-selected', 'false');
    expect(tab('A')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Pane C');
    expect(screen.getByTestId('callbacks')).toHaveTextContent('1:1');
    await fireEvent.click(tab('A'));
    expect(tab('A')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Pane A');
    expect(screen.getByTestId('callbacks')).toHaveTextContent('2:1');
});

it.each(['tab', 'nav'] as const)('tracks wrapped moves and nearest authored list changes for %s links', async (kind) => {
    render(KeyboardTest, { kind, initial: '', disabled: [] });
    const list = screen.getByRole('tablist', { name: 'Main' });
    const a = tab('A');
    const b = tab('B');
    const c = tab('C');
    const wrapper = document.createElement('div');
    list.appendChild(wrapper);
    wrapper.append(c, a, b);
    await waitFor(() => expect(c).toHaveAttribute('tabindex', '0'));
    await fireEvent.keyDown(c, { key: 'ArrowRight' });
    expect(a).toHaveFocus();
    const nested = document.createElement('div');
    nested.setAttribute('role', 'tablist');
    wrapper.appendChild(nested);
    nested.appendChild(c);
    await waitFor(() => expect(c).toHaveAttribute('tabindex', '0'));
    await fireEvent.keyDown(a, { key: 'End' });
    expect(b).toHaveFocus();
    wrapper.prepend(c);
    await fireEvent.keyDown(b, { key: 'ArrowRight' });
    expect(c).toHaveFocus();
});

it.each(['tab', 'nav'] as const)('restores roving entry after every %s link leaves and returns to an empty tablist', async (kind) => {
    const { container } = render(KeyboardTest, { kind, initial: '', disabled: [] });
    const list = screen.getByRole('tablist', { name: 'Main' });
    const links = ['a', 'b', 'c'].map((name) => container.querySelector<HTMLElement>(`#key-${name}`)!);
    const bare = document.createElement('div');
    list.parentElement!.appendChild(bare);
    bare.append(...links);
    await waitFor(() => {
        for (const link of links) expect(link).not.toHaveAttribute('tabindex');
    });
    list.append(...links.toReversed());
    await waitFor(() => expect(links[2]).toHaveAttribute('tabindex', '0'));
    expect(links[0]).toHaveAttribute('tabindex', '-1');
    await fireEvent.keyDown(links[2]!, { key: 'ArrowRight' });
    expect(links[1]).toHaveFocus();
});

it.each(['tab', 'nav'] as const)('updates native and roving stops when an authored %s tablist role is removed and restored', async (kind) => {
    render(KeyboardTest, { kind, rawLists: true, initial: '', disabled: [] });
    const list = screen.getByRole('tablist', { name: 'Main' });
    const links = ['A', 'B', 'C'].map(tab);
    const inner = within(screen.getByRole('tablist', { name: 'Raw nested' })).getByRole('tab', { name: 'Raw D' });
    list.removeAttribute('role');
    await waitFor(() => {
        for (const link of links) expect(link).not.toHaveAttribute('tabindex');
    });
    expect(inner).toHaveAttribute('tabindex', '0');
    links[0]!.focus();
    const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true });
    await fireEvent(links[0]!, event);
    expect(event.defaultPrevented).toBe(false);
    expect(links[0]).toHaveFocus();
    list.setAttribute('role', 'tablist');
    await waitFor(() => expect(links[0]).toHaveAttribute('tabindex', '0'));
    expect(links[2]).toHaveAttribute('tabindex', '-1');
    await fireEvent.keyDown(links[0]!, { key: 'End' });
    expect(links[2]).toHaveFocus();
});

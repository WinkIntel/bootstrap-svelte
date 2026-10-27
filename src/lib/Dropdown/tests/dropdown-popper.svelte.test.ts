import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { createPopper } from '@popperjs/core';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DropdownMenuState } from '../dropdown.svelte.js';
import Fixture from './dropdown-popper-test.svelte';
vi.mock('@popperjs/core', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@popperjs/core')>();
    return {
        ...actual,
        createPopper: vi.fn((...args: Parameters<typeof actual.createPopper>) => {
            const instance = actual.createPopper(...args);
            vi.spyOn(instance, 'destroy');
            return instance;
        })
    };
});
beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);
const mock = vi.mocked(createPopper);
function offsetOption() {
    return mock.mock.calls.at(-1)?.[2]?.modifiers?.find((m) => m.name === 'offset')?.options?.offset;
}
it('destroys on hide, recreates once on reopen, and destroys on unmount', async () => {
    const { unmount } = render(Fixture);
    expect(mock).not.toHaveBeenCalled();
    await fireEvent.click(screen.getByTestId('toggle'));
    expect(mock).toHaveBeenCalledTimes(1);
    const first = mock.mock.results[0]!.value;
    await fireEvent.click(screen.getByTestId('toggle'));
    expect(first.destroy).toHaveBeenCalledOnce();
    await fireEvent.click(screen.getByTestId('toggle'));
    expect(mock).toHaveBeenCalledTimes(2);
    const second = mock.mock.results[1]!.value;
    unmount();
    expect(first.destroy).toHaveBeenCalledOnce();
    expect(second.destroy).toHaveBeenCalledOnce();
});
it('does not destroy a hidden instance twice on unmount', async () => {
    const { unmount } = render(Fixture);
    await fireEvent.click(screen.getByTestId('toggle'));
    const first = mock.mock.results[0]!.value;
    await fireEvent.click(screen.getByTestId('toggle'));
    expect(first.destroy).toHaveBeenCalledOnce();
    unmount();
    expect(first.destroy).toHaveBeenCalledOnce();
});
it('marks static menus while shown and disables Popper styles', async () => {
    render(Fixture, { display: 'static' });
    expect(screen.getByTestId('menu')).not.toHaveAttribute('data-bs-popper');
    await fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('menu')).toHaveAttribute('data-bs-popper', 'static');
    expect(mock.mock.calls[0]![2]?.modifiers).toContainEqual({ name: 'applyStyles', enabled: false });
    await fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('menu')).not.toHaveAttribute('data-bs-popper');
});
it('updates offset while shown, ignores equal tuples and retains hidden updates for reopen', async () => {
    const { rerender } = render(Fixture, { offset: [1, 3] });
    await fireEvent.click(screen.getByTestId('toggle'));
    expect(offsetOption()).toEqual([1, 3]);
    const first = mock.mock.results[0]!.value;
    await rerender({ offset: [4, 8] });
    expect(offsetOption()).toEqual([4, 8]);
    expect(first.destroy).toHaveBeenCalledOnce();
    expect(mock).toHaveBeenCalledTimes(2);
    await rerender({ offset: [4, 8] });
    expect(mock).toHaveBeenCalledTimes(2);
    await fireEvent.click(screen.getByTestId('toggle'));
    await rerender({ offset: [6, 9] });
    expect(mock).toHaveBeenCalledTimes(2);
    await fireEvent.click(screen.getByTestId('toggle'));
    expect(mock).toHaveBeenCalledTimes(3);
    expect(offsetOption()).toEqual([6, 9]);
});

it('forwards each offset prop change once without subscribing to internal state', async () => {
    const setter = vi.spyOn(DropdownMenuState.prototype, 'popperOffset', 'set');
    try {
        const { rerender } = render(Fixture, { offset: [0, 2] });
        setter.mockClear();
        await rerender({ offset: [4, 8] });
        expect(setter).toHaveBeenCalledTimes(1);
    } finally {
        setter.mockRestore();
    }
});
it('switches display while open and restores dynamic Popper options', async () => {
    const { rerender } = render(Fixture);
    await fireEvent.click(screen.getByTestId('toggle'));
    const first = mock.mock.results[0]!.value;
    await rerender({ display: 'static' });
    expect(first.destroy).toHaveBeenCalledOnce();
    expect(mock).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('menu')).toHaveAttribute('data-bs-popper', 'static');
    expect(mock.mock.calls.at(-1)![2]?.modifiers).toContainEqual({ name: 'applyStyles', enabled: false });
    await rerender({ display: 'dynamic' });
    expect(mock).toHaveBeenCalledTimes(3);
    expect(screen.getByTestId('menu')).not.toHaveAttribute('data-bs-popper');
    expect(mock.mock.calls.at(-1)![2]?.modifiers?.some((m) => m.name === 'offset')).toBe(true);
});

it('uses the same static positioning contract inside a navbar', async () => {
    render(Fixture, { inNavbar: true });
    await fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('menu')).toHaveAttribute('data-bs-popper', 'static');
    expect(mock.mock.calls.at(-1)![2]?.modifiers).toContainEqual({ name: 'applyStyles', enabled: false });
});

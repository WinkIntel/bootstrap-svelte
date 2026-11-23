import '@testing-library/jest-dom/vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { flushSync, mount, tick, unmount } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import Fixture from './tests/button-check-flush-test.svelte';

const settle = async () => {
    await tick();
    await tick();
};
const action = async (container: HTMLElement, name: string) => {
    await fireEvent.click(container.querySelector(`[data-action="${name}"]`)!);
    await settle();
};
const radios = (container: HTMLElement) => Array.from(container.querySelectorAll('input'));
const output = (container: HTMLElement) => container.querySelector('output')!;
const selected = (objectValue: boolean, value: string) => (objectValue ? JSON.stringify({ id: value }) : JSON.stringify(value));
function submission(container: HTMLElement, association: string, selectedB: boolean, objectValue: boolean) {
    const forms = container.querySelectorAll('form');
    const entries = [...new FormData(forms[0]!).entries(), ...new FormData(forms[1]!).entries()];
    expect(entries).toEqual(
        association === 'nameless'
            ? []
            : [[association === 'names' && selectedB ? 'other' : 'choices', objectValue ? '[object Object]' : selectedB ? 'b' : 'a']]
    );
}

describe.each(['named', 'nameless', 'names', 'forms'] as const)('ButtonCheck flush ownership (%s)', (association) => {
    test.each([false, true])('synchronizes a checked sibling after a checked-owned group write (object=%s)', async (objectValue) => {
        const { container } = render(Fixture, { association, objectValue });
        await action(container, 'a');
        expect(output(container)).toHaveTextContent(`${selected(objectValue, 'a')}:true:false:0`);
        expect(radios(container).map((input) => input.checked)).toEqual([true, false]);
        submission(container, association, false, objectValue);
    });
    test.each([false, true])('retains a simultaneous checked ownership swap (object=%s)', async (objectValue) => {
        const { container } = render(Fixture, { association, objectValue, initial: 'a' });
        await action(container, 'swap');
        expect(output(container)).toHaveTextContent(`${selected(objectValue, 'b')}:false:true:0`);
        expect(radios(container).map((input) => input.checked)).toEqual([false, true]);
        submission(container, association, true, objectValue);
    });
    test('does not reuse a stale native snapshot after controlled deselection and release', async () => {
        const { container } = render(Fixture, { association, initial: 'uncontrolled' });
        await action(container, 'select-a');
        await action(container, 'a');
        await action(container, 'clear');
        await action(container, 'release');
        await action(container, 'false');
        expect(output(container)).toHaveTextContent('null:false:false:0');
        expect(radios(container).map((input) => input.checked)).toEqual([false, false]);
        expect([...new FormData(container.querySelector('form')!).entries()]).toEqual([]);
    });
    test('preserves a native sibling selection across release and false readoption', async () => {
        const { container } = render(Fixture, { association, initial: 'uncontrolled' });
        await action(container, 'select-a');
        await action(container, 'a');
        await fireEvent.click(radios(container)[1]!);
        await settle();
        await action(container, 'release');
        await action(container, 'false');
        expect(output(container)).toHaveTextContent('"b":false:true:1');
        expect(radios(container).map((input) => input.checked)).toEqual([false, true]);
        submission(container, association, true, false);
    });
    test.each(['parent', 'parent-reverse'])('retains simultaneous explicit parent group authority (%s)', async (name) => {
        const { container } = render(Fixture, { association, initial: 'a' });
        await action(container, 'clear');
        await action(container, name);
        expect(output(container)).toHaveTextContent('"b":false:true:0');
        expect(radios(container).map((input) => input.checked)).toEqual([false, true]);
        submission(container, association, true, false);
    });
    test.each(['parent-false', 'parent-false-reverse'])('retains a simultaneous parent group write during false adoption (%s)', async (name) => {
        const { container } = render(Fixture, { association, initial: 'uncontrolled' });
        await action(container, 'select-a');
        await action(container, name);
        expect(output(container)).toHaveTextContent('"b":false:true:0');
        expect(radios(container).map((input) => input.checked)).toEqual([false, true]);
        submission(container, association, true, false);
    });
    test.each([false, true])('keeps DOM and submission aligned when checked control is released (object=%s)', async (objectValue) => {
        const { container } = render(Fixture, { association, objectValue, initial: 'a' });
        await action(container, 'release');
        expect(output(container)).toHaveTextContent(`${selected(objectValue, 'a')}:undefined:false:0`);
        expect(radios(container).map((input) => input.checked)).toEqual([true, false]);
        submission(container, association, false, objectValue);
        await action(container, 'false');
        expect(output(container)).toHaveTextContent('undefined:false:false:0');
        expect(radios(container).map((input) => input.checked)).toEqual([false, false]);
    });
});

test('shares one capturing radio-change listener per document and releases it on unmount', () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    try {
        const { unmount } = render(Fixture);
        const listeners = add.mock.calls.filter(([type, , capture]) => type === 'change' && capture === true);
        expect(listeners).toHaveLength(1);
        unmount();
        expect(
            remove.mock.calls.filter(([type, listener, capture]) => type === 'change' && listener === listeners[0]?.[1] && capture === true)
        ).toHaveLength(1);
    } finally {
        add.mockRestore();
        remove.mockRestore();
    }
});

test.each(['detached', 'shadow'] as const)('shares and cleans up radio-change observers for a %s root', async (location) => {
    const host = document.createElement('div');
    const target = document.createElement('div');
    if (location === 'shadow') {
        document.body.append(host);
        host.attachShadow({ mode: 'open' }).append(target);
    }
    const root = target.getRootNode();
    const add = vi.spyOn(root, 'addEventListener');
    const remove = vi.spyOn(root, 'removeEventListener');
    const instance = mount(Fixture, { target });
    flushSync();
    try {
        const listeners = add.mock.calls.filter(([type, , capture]) => type === 'change' && capture === true);
        expect(listeners).toHaveLength(1);
        await unmount(instance);
        expect(
            remove.mock.calls.filter(([type, listener, capture]) => type === 'change' && listener === listeners[0]?.[1] && capture === true)
        ).toHaveLength(1);
    } finally {
        add.mockRestore();
        remove.mockRestore();
        target.remove();
        host.remove();
    }
});

test('preserves a selected equal-valued native sibling without a form owner', async () => {
    const { container } = render(Fixture, { initial: 'a', duplicate: true });
    const [a, b] = radios(container);
    a!.setAttribute('form', 'unowned');
    b!.setAttribute('form', 'unowned');
    await action(container, 'release');
    await fireEvent.click(b!);
    await settle();
    await action(container, 'false');
    expect(output(container)).toHaveTextContent('"a":false:true:1');
    expect(radios(container).map((input) => input.checked)).toEqual([false, true]);
});

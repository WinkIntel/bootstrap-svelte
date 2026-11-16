import { describe, expect, test, vi } from 'vitest';
import { syncFormReset } from '../form-reset.js';

const task = () => new Promise((resolve) => setTimeout(resolve, 0));

function controls() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.defaultValue = 'default';
    input.value = 'changed';
    form.append(input);
    document.body.append(form);
    return { form, input };
}

describe('public native reset action scheduling', () => {
    test('waits beyond a microtask checkpoint before publishing the reset binding', async () => {
        const { form, input } = controls();
        const sync = vi.fn();
        const action = syncFormReset(input, sync);
        try {
            form.reset();
            await Promise.resolve();
            expect(sync).not.toHaveBeenCalled();
            await task();
            expect(sync).toHaveBeenCalledExactlyOnceWith({ checked: false, value: 'default' });
        } finally {
            action.destroy();
            form.remove();
        }
    });
    test('honors later form cancellation and unmount before the pending task', async () => {
        const { form, input } = controls();
        const sync = vi.fn();
        const action = syncFormReset(input, sync);
        const cancel = (event: Event) => event.preventDefault();
        form.addEventListener('reset', cancel);
        form.reset();
        await task();
        expect(input.value).toBe('changed');
        expect(sync).not.toHaveBeenCalled();
        form.removeEventListener('reset', cancel);
        form.reset();
        action.destroy();
        await task();
        expect(sync).not.toHaveBeenCalled();
        form.remove();
    });
    test('captures every sibling default before a binding update changes the DOM', async () => {
        const { form, input } = controls();
        const sibling = document.createElement('input');
        sibling.type = 'checkbox';
        sibling.defaultChecked = true;
        form.append(sibling);
        const first = syncFormReset(input, () => {
            sibling.checked = false;
        });
        const sync = vi.fn();
        const second = syncFormReset(sibling, sync);
        form.reset();
        await task();
        expect(sync).toHaveBeenCalledExactlyOnceWith({ checked: true, value: 'on' });
        first.destroy();
        second.destroy();
        form.remove();
    });
    test('observes initially detached forms before and after attachment without duplicate synchronization', async () => {
        const outer = document.createElement('div');
        const form = document.createElement('form');
        const input = document.createElement('input');
        outer.append(form);
        form.append(input);
        const sync = vi.fn();
        const action = syncFormReset(input, sync);
        form.reset();
        await task();
        expect(sync).toHaveBeenCalledTimes(1);
        document.body.append(outer);
        form.reset();
        await task();
        expect(sync).toHaveBeenCalledTimes(2);
        action.destroy();
        outer.remove();
    });
    test('observes an initially mounted shadow-root form', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = host.attachShadow({ mode: 'open' });
        const form = document.createElement('form');
        const input = document.createElement('input');
        root.append(form);
        form.append(input);
        const sync = vi.fn();
        expect(input.form).toBe(form);
        expect(input.getRootNode()).toBe(root);
        const action = syncFormReset(input, sync);
        form.reset();
        await task();
        expect(sync).toHaveBeenCalledTimes(1);
        action.destroy();
        host.remove();
    });
});

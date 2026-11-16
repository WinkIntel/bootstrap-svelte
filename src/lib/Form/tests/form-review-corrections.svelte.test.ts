import '@testing-library/jest-dom/vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { flushSync, mount, tick, unmount } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import CheckInput from '../form-check-input.svelte';
import SwitchInput from '../form-switch-input.svelte';
import Detached from './form-review-detached-test.svelte';
import GroupReset from './form-review-reset-test.svelte';

const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await tick();
};

describe.each([
    { switchOnly: false, mixed: false },
    { switchOnly: true, mixed: false },
    { switchOnly: false, mixed: true }
])('native group reset $switchOnly/$mixed', (mode) => {
    test.each([false, true])('reconciles native defaults including checked B=%s and preserves outside members', async (defaultB) => {
        const { container } = render(GroupReset, { ...mode, defaultB });
        const form = container.querySelector('form')!;
        const [a, b, c] = Array.from(form.querySelectorAll('input'));
        form.reset();
        await settle();
        expect(a?.checked).toBe(false);
        expect(b?.checked).toBe(defaultB);
        expect(c?.checked).toBe(false);
        expect(container.querySelector('output')).toHaveTextContent(defaultB ? '["outside","b"]:0' : '["outside"]:0');
        await fireEvent.click(c!);
        expect(a?.checked).toBe(false);
        expect(b?.checked).toBe(defaultB);
        expect(container.querySelector('output')).toHaveTextContent(defaultB ? '["outside","b","c"]:1' : '["outside","c"]:1');
    });
    test('does not reconcile a canceled script-initiated reset', async () => {
        const { container } = render(GroupReset, { ...mode, cancel: true });
        container.querySelector('form')!.reset();
        await settle();
        expect(container.querySelector('output')).toHaveTextContent('["a","outside"]:0');
        expect(container.querySelector('input')?.checked).toBe(true);
    });
});

describe.each([CheckInput, SwitchInput])('malformed group callback', (Component) => {
    test('still forwards a real change with the actual checked input', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const onchange = vi.fn();
        const { container } = render(Component, { group: 'invalid', onchange });
        const input = container.querySelector('input')!;
        await fireEvent.click(input);
        expect(input.checked).toBe(true);
        expect(warn).toHaveBeenCalledTimes(1);
        expect(onchange).toHaveBeenCalledTimes(1);
        expect(onchange.mock.calls[0]?.[0].target).toBe(input);
        warn.mockRestore();
    });
});

test('tracks an external form after mounting in a detached container and attaching it later', async () => {
    const form = document.createElement('form');
    form.id = 'detached-owner';
    document.body.append(form);
    const target = document.createElement('div');
    const instance = mount(Detached, { props: { form: form.id }, target });
    flushSync();
    expect(target.isConnected).toBe(false);
    document.body.append(target);
    try {
        const input = target.querySelector('input')!;
        await fireEvent.input(input, { target: { value: '#abcdef' } });
        input.defaultValue = '#ffffff';
        form.reset();
        await settle();
        expect(input.value).toBe('#ffffff');
        expect(target.querySelector('output')).toHaveTextContent('#ffffff');
    } finally {
        await unmount(instance);
        target.remove();
        form.remove();
    }
});

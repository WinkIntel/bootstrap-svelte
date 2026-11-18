import '@testing-library/jest-dom/vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { flushSync, mount, tick, unmount, type ComponentProps } from 'svelte';
import { describe, expect, test } from 'vitest';
import Fixture from './tests/button-check-adoption-reset-test.svelte';

const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await tick();
};
const action = (container: HTMLElement, name: string) => fireEvent.click(container.querySelector(`[data-action="${name}"]`)!);
async function select(input: HTMLInputElement) {
    await fireEvent.click(input);
    // jsdom omits click's native change event for a disconnected input.
    // Dispatch that event explicitly; the reset below remains form.reset().
    if (!input.isConnected) await fireEvent.change(input);
}
const state = (container: HTMLElement) => container.querySelector('output')!;

function radios(container: HTMLElement) {
    const [a, b] = Array.from(container.querySelectorAll('input'));
    return { a: a!, b: b!, form: container.querySelector('form')! };
}

describe.each([false, true])('ButtonCheck false adoption (object=%s)', (objectValue) => {
    const selected = objectValue ? '{"id":"a"}' : '"a"';
    const submitted = objectValue ? '[object Object]' : 'a';
    test.each(['click', 'parent'])('releases a previously %s-selected group and permits parent reselection', async (selection) => {
        const { container } = render(Fixture, { objectValue });
        const { a, b, form } = radios(container);
        if (selection === 'click') await select(a);
        else await action(container, 'select-a');
        expect(a.checked).toBe(true);
        expect(state(container)).toHaveTextContent(`${selected}:undefined:undefined:${selection === 'click' ? 1 : 0}`);
        await action(container, 'adopt-false');
        expect(a.checked).toBe(false);
        expect(b.checked).toBe(false);
        expect(state(container)).toHaveTextContent(`undefined:false:undefined:${selection === 'click' ? 1 : 0}`);
        expect(new FormData(form).get('choices')).toBe(null);
        await action(container, 'select-a');
        expect(a.checked).toBe(true);
        expect(state(container)).toHaveTextContent(`${selected}:true:undefined:${selection === 'click' ? 1 : 0}`);
        expect(new FormData(form).get('choices')).toBe(submitted);
    });
    test('preserves a simultaneous parent sibling selection when adopting false', async () => {
        const { container } = render(Fixture, { objectValue });
        const { a, b, form } = radios(container);
        await select(a);
        await action(container, 'adopt-b');
        expect(a.checked).toBe(false);
        expect(b.checked).toBe(true);
        expect(state(container)).toHaveTextContent(`${objectValue ? '{"id":"b"}' : '"b"'}:false:undefined:1`);
        expect(new FormData(form).get('choices')).toBe(objectValue ? '[object Object]' : 'b');
    });
    test('does not release an unselected duplicate-value sibling when adopting false', async () => {
        const { container } = render(Fixture, { objectValue, duplicate: true });
        const { a, b, form } = radios(container);
        await fireEvent.click(b);
        await action(container, 'adopt-false');
        expect(a.checked).toBe(false);
        expect(b.checked).toBe(true);
        expect(state(container)).toHaveTextContent(`${selected}:false:undefined:1`);
        expect(new FormData(form).get('choices')).toBe(submitted);
    });
});

function mountIn(location: 'connected' | 'detached' | 'shadow', props: ComponentProps<typeof Fixture>) {
    const container = document.createElement('div');
    const host = document.createElement('div');
    if (location === 'connected') document.body.append(container);
    if (location === 'shadow') {
        document.body.append(host);
        host.attachShadow({ mode: 'open' }).append(container);
    }
    const instance = mount(Fixture, { target: container, props });
    flushSync();
    return {
        container,
        async cleanup() {
            await unmount(instance);
            container.remove();
            host.remove();
        }
    };
}

describe.each(['connected', 'detached', 'shadow'] as const)('ButtonCheck reset group parity (%s)', (location) => {
    test.each([false, true])('clears an owned default-unchecked group to null (object=%s)', async (objectValue) => {
        const fixture = mountIn(location, { initialChecked: false, objectValue });
        try {
            const { container } = fixture;
            const { a, b, form } = radios(container);
            await select(a);
            expect(a.checked).toBe(true);
            form.reset();
            await settle();
            expect(a.checked).toBe(false);
            expect(b.checked).toBe(false);
            expect(state(container)).toHaveTextContent('null:false:false:1');
            expect(new FormData(form).get('choices')).toBe(null);
            await action(container, 'select-a');
            expect(a.checked).toBe(true);
            expect(state(container)).toHaveTextContent(`${objectValue ? '{"id":"a"}' : '"a"'}:true:false:1`);
            expect(new FormData(form).get('choices')).toBe(objectValue ? '[object Object]' : 'a');
        } finally {
            await fixture.cleanup();
        }
    });
    test.each([
        { defaultA: true, defaultB: false, duplicate: false, objectValue: false, winner: 'a' },
        { defaultA: true, defaultB: false, duplicate: true, objectValue: false, winner: 'a' },
        { defaultA: true, defaultB: false, duplicate: true, objectValue: true, winner: 'a' },
        { defaultA: false, defaultB: true, duplicate: true, objectValue: true, winner: 'b' },
        { defaultA: true, defaultB: true, duplicate: true, objectValue: true, winner: 'b' }
    ])(
        'restores native default $winner without an unselected duplicate clearing the group ($duplicate/$objectValue)',
        async ({ winner, ...props }) => {
            const fixture = mountIn(location, { initialChecked: false, ...props });
            try {
                const { container } = fixture;
                const { a, b, form } = radios(container);
                await select(winner === 'a' ? b : a);
                form.reset();
                await settle();
                expect(a.checked).toBe(winner === 'a');
                expect(b.checked).toBe(winner === 'b');
                const value = props.objectValue ? '{"id":"a"}' : winner === 'a' || props.duplicate ? '"a"' : '"b"';
                expect(state(container)).toHaveTextContent(`${value}:${winner === 'a'}:${winner === 'b'}:1`);
                expect(new FormData(form).get('choices')).toBe(props.objectValue ? '[object Object]' : JSON.parse(value));
            } finally {
                await fixture.cleanup();
            }
        }
    );
    test.each(['group', 'checked'] as const)('retains a parent %s override after reset binding publication', async (overrideReset) => {
        const fixture = mountIn(location, { initialChecked: false, defaultA: true, overrideReset });
        try {
            const { container } = fixture;
            const { a, b, form } = radios(container);
            await select(b);
            form.reset();
            await settle();
            expect(a.checked).toBe(false);
            expect(b.checked).toBe(overrideReset === 'group');
            expect(state(container)).toHaveTextContent(overrideReset === 'group' ? '"b":false:true:1' : 'undefined:false:false:1');
            expect(new FormData(form).get('choices')).toBe(overrideReset === 'group' ? 'b' : null);
        } finally {
            await fixture.cleanup();
        }
    });
    test('does not publish reset changes or callbacks after cancellation', async () => {
        const fixture = mountIn(location, { initialChecked: false, defaultA: true, cancelReset: true });
        try {
            const { container } = fixture;
            const { a, b, form } = radios(container);
            await select(b);
            form.reset();
            await settle();
            expect(a.checked).toBe(false);
            expect(b.checked).toBe(true);
            expect(state(container)).toHaveTextContent('"b":false:true:1');
            expect(new FormData(form).get('choices')).toBe('b');
        } finally {
            await fixture.cleanup();
        }
    });
});

describe.each(['a', 'b'] as const)('ButtonCheck duplicate physical ownership (last selected %s)', (selected) => {
    test('does not let a stale sibling snapshot clear the selected member on false adoption', async () => {
        const { container } = render(Fixture, { duplicate: true });
        const { a, b, form } = radios(container);
        await select(b);
        await select(a);
        if (selected === 'b') await select(b);
        const calls = selected === 'a' ? 2 : 3;
        expect(a.checked).toBe(selected === 'a');
        expect(b.checked).toBe(selected === 'b');
        expect(state(container)).toHaveTextContent(`"a":undefined:undefined:${calls}`);
        await action(container, selected === 'a' ? 'adopt-false-b' : 'adopt-false');
        expect(a.checked).toBe(selected === 'a');
        expect(b.checked).toBe(selected === 'b');
        expect(state(container)).toHaveTextContent(selected === 'a' ? `"a":undefined:false:${calls}` : `"a":false:undefined:${calls}`);
        expect(new FormData(form).get('choices')).toBe('a');
        await action(container, selected === 'a' ? 'adopt-false' : 'adopt-false-b');
        expect(a.checked).toBe(false);
        expect(b.checked).toBe(false);
        expect(state(container)).toHaveTextContent(`undefined:false:false:${calls}`);
        expect(new FormData(form).get('choices')).toBe(null);
        await action(container, 'select-a');
        expect(container.querySelectorAll('input:checked')).toHaveLength(1);
        expect(state(container)).toHaveTextContent(`"a":false:true:${calls}`);
        expect(new FormData(form).get('choices')).toBe('a');
    });
});

describe.each(['connected', 'detached', 'shadow'] as const)('ButtonCheck released ownership (%s)', (location) => {
    test.each([false, true])('clears its released selection on false adoption and permits parent reselection (object=%s)', async (objectValue) => {
        const fixture = mountIn(location, { initialChecked: true, controlB: false, objectValue });
        try {
            const { container } = fixture;
            const { a, b, form } = radios(container);
            expect(a.checked).toBe(true);
            await action(container, 'release-a');
            expect(a.checked).toBe(false);
            expect(state(container)).toHaveTextContent(`${objectValue ? '{"id":"a"}' : '"a"'}:undefined:undefined:0`);
            await action(container, 'adopt-false');
            expect(a.checked).toBe(false);
            expect(b.checked).toBe(false);
            expect(state(container)).toHaveTextContent('undefined:false:undefined:0');
            expect(new FormData(form).get('choices')).toBe(null);
            await action(container, 'select-a');
            expect(a.checked).toBe(true);
            expect(state(container)).toHaveTextContent(`${objectValue ? '{"id":"a"}' : '"a"'}:true:undefined:0`);
            expect(new FormData(form).get('choices')).toBe(objectValue ? '[object Object]' : 'a');
        } finally {
            await fixture.cleanup();
        }
    });
    test('preserves an equal-valued sibling selected after release', async () => {
        const fixture = mountIn(location, { initialChecked: true, controlB: false, duplicate: true });
        try {
            const { container } = fixture;
            const { a, b, form } = radios(container);
            await select(a);
            expect(a.checked).toBe(true);
            await action(container, 'release-a');
            await select(b);
            const calls = state(container).textContent!.split(':').at(-1);
            await action(container, 'adopt-false');
            expect(a.checked).toBe(false);
            expect(b.checked).toBe(true);
            expect(state(container)).toHaveTextContent(`"a":false:undefined:${calls}`);
            expect(new FormData(form).get('choices')).toBe('a');
        } finally {
            await fixture.cleanup();
        }
    });
});

describe.each(['connected', 'detached', 'shadow'] as const)('ButtonCheck mixed ownership reset (%s)', (location) => {
    test.each([
        { duplicate: false, objectValue: false },
        { duplicate: true, objectValue: false },
        { duplicate: false, objectValue: true }
    ])('clears the group when an uncontrolled sibling is the native default ($duplicate/$objectValue)', async ({ duplicate, objectValue }) => {
        const fixture = mountIn(location, { initialChecked: false, controlB: false, defaultB: true, duplicate, objectValue });
        try {
            const { container } = fixture;
            const { a, b, form } = radios(container);
            await select(a);
            // Group binding can initially select the last duplicate. Use the
            // explicit checked API to establish A before testing its reset.
            if (duplicate) await action(container, 'adopt-true');
            expect(a.checked).toBe(true);
            expect(state(container)).toHaveTextContent(`${objectValue ? '{"id":"a"}' : '"a"'}:true:undefined:1`);
            form.reset();
            await settle();
            expect(state(container)).toHaveTextContent('null:false:undefined:1');
            expect(a.checked).toBe(false);
            expect(b.checked).toBe(false);
            expect(new FormData(form).get('choices')).toBe(null);
            await action(container, 'select-b');
            expect(b.checked).toBe(true);
            expect(state(container)).toHaveTextContent(
                `${objectValue ? JSON.stringify(duplicate ? { id: 'a' } : { id: 'b' }) : duplicate ? '"a"' : '"b"'}:false:undefined:1`
            );
            expect(new FormData(form).get('choices')).toBe(objectValue ? '[object Object]' : duplicate ? 'a' : 'b');
        } finally {
            await fixture.cleanup();
        }
    });
});

describe.each(['connected', 'detached', 'shadow'] as const)('ButtonCheck reset ownership changes (%s)', (location) => {
    test('tracks default winner ownership through release and readoption', async () => {
        const fixture = mountIn(location, { initialChecked: false, defaultB: true });
        try {
            const { container } = fixture;
            const { a, b, form } = radios(container);
            await select(a);
            form.reset();
            await settle();
            expect(state(container)).toHaveTextContent('"b":false:true:1');
            expect(b.checked).toBe(true);
            await action(container, 'release-b');
            await select(a);
            form.reset();
            await settle();
            expect(state(container)).toHaveTextContent('null:false:undefined:2');
            expect(a.checked).toBe(false);
            expect(b.checked).toBe(false);
            expect(new FormData(form).get('choices')).toBe(null);
            await action(container, 'adopt-false-b');
            await select(a);
            form.reset();
            await settle();
            expect(state(container)).toHaveTextContent('"b":false:true:3');
            expect(a.checked).toBe(false);
            expect(b.checked).toBe(true);
            expect(new FormData(form).get('choices')).toBe('b');
        } finally {
            await fixture.cleanup();
        }
    });
    test('leaves a mixed group unchanged when reset is canceled', async () => {
        const fixture = mountIn(location, { initialChecked: false, controlB: false, defaultB: true, cancelReset: true });
        try {
            const { container } = fixture;
            const { a, b, form } = radios(container);
            await select(a);
            form.reset();
            await settle();
            expect(state(container)).toHaveTextContent('"a":true:undefined:1');
            expect(a.checked).toBe(true);
            expect(b.checked).toBe(false);
            expect(new FormData(form).get('choices')).toBe('a');
        } finally {
            await fixture.cleanup();
        }
    });
});

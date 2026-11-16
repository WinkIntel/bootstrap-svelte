import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { flushSync, tick } from 'svelte';
import { describe, expect, test } from 'vitest';
import Fixture from './form-reset-correctness-test.svelte';

const settleReset = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await tick();
};

async function changeInputs(container: HTMLElement) {
    const color = container.querySelector('input[type=color]') as HTMLInputElement;
    const file = container.querySelector('input[type=file]') as HTMLInputElement;
    await fireEvent.input(color, { target: { value: '#123456' } });
    await userEvent.setup().upload(file, new File(['data'], 'example.txt', { type: 'text/plain' }));
    expect(screen.getByTestId('files')).toHaveTextContent('1');
    // userEvent overrides these platform properties with a getter-only upload shim.
    // Restore the real jsdom properties so form.reset() runs its native default action.
    delete (file as unknown as Record<string, unknown>).files;
    delete (file as unknown as Record<string, unknown>).value;
    return { color, file, form: container.querySelector('form') as HTMLFormElement };
}

describe('native color/file form reset', () => {
    test('makes native clearing observable when the selected FileList identity is retained', async () => {
        const { container } = render(Fixture);
        const input = container.querySelector('input[type=file]') as HTMLInputElement;
        await userEvent.setup().upload(input, new File(['data'], 'selected.txt'));
        const selected = input.files!;
        expect(screen.getByTestId('file-name')).toHaveTextContent('selected.txt');
        // userEvent exposes a native-like immutable FileList snapshot rather than
        // Chromium's mutable selection. The reset listener below models only that
        // platform identity behavior; the real form still performs its default reset.
        let cleared = false;
        const nativeLikeFiles = new Proxy(Object.create(Object.getPrototypeOf(selected)) as FileList, {
            get(_target, key) {
                if (cleared && key === 'length') return 0;
                if (cleared && key === '0') return undefined;
                if (key === 'item') return (index: number) => (cleared ? null : selected.item(index));
                if (key === Symbol.iterator)
                    return function* () {
                        if (!cleared) yield* selected;
                    };
                return Reflect.get(selected, key, selected);
            }
        });
        Object.defineProperty(input, 'files', { configurable: true, get: () => nativeLikeFiles });
        delete (input as unknown as Record<string, unknown>).value;
        await fireEvent.change(input);
        const form = container.querySelector('form') as HTMLFormElement;
        form.addEventListener('reset', () => {
            cleared = true;
        });
        form.reset();
        await settleReset();
        expect(input.files).toBe(nativeLikeFiles);
        expect(input.files).toHaveLength(0);
        expect(screen.getByTestId('file-name')).toHaveTextContent('none');
    });
    test('preserves an explicit native defaultValue and its reactive updates', async () => {
        const { container, rerender } = render(Fixture, { defaultColor: '#ffffff' });
        const input = container.querySelector('input[type=color]') as HTMLInputElement;
        const form = container.querySelector('form') as HTMLFormElement;
        expect(input.value).toBe('#563d7c');
        expect(input.defaultValue).toBe('#ffffff');
        await fireEvent.input(input, { target: { value: '#123456' } });
        form.reset();
        await settleReset();
        expect(input.value).toBe('#ffffff');
        expect(screen.getByTestId('color')).toHaveTextContent('#ffffff');
        await rerender({ defaultColor: '#abcdef' });
        expect(input.defaultValue).toBe('#abcdef');
        await fireEvent.input(input, { target: { value: '#123456' } });
        form.reset();
        await settleReset();
        expect(input.value).toBe('#abcdef');
        expect(screen.getByTestId('color')).toHaveTextContent('#abcdef');
    });
    test.each([false, true])('synchronizes bound state after reset (external=%s)', async (external) => {
        const { container } = render(Fixture, { external });
        const { color, file, form } = await changeInputs(container);
        form.reset();
        await settleReset();
        expect(color.value).toBe('#563d7c');
        expect(screen.getByTestId('color')).toHaveTextContent('#563d7c');
        expect(file.files).toHaveLength(0);
        expect(screen.getByTestId('files')).toHaveTextContent('null');
        expect(screen.getByTestId('file-value')).toHaveTextContent('empty');
        expect(new FormData(form).get('color')).toBe('#563d7c');
        expect((new FormData(form).get('file') as File).name).toBe('');
        expect(screen.getByTestId('calls')).toHaveTextContent('2');
    });
    test('follows a changed external form association', async () => {
        const { container, rerender } = render(Fixture, { external: true });
        const { form } = await changeInputs(container);
        await rerender({ external: true, association: 'other-reset-form' });
        form.reset();
        await settleReset();
        expect(screen.getByTestId('color')).toHaveTextContent('#123456');
        expect(screen.getByTestId('files')).toHaveTextContent('1');
        (container.querySelector('#other-reset-form') as HTMLFormElement).reset();
        await settleReset();
        expect(screen.getByTestId('color')).toHaveTextContent('#563d7c');
        expect(screen.getByTestId('files')).toHaveTextContent('null');
    });
    test('honors a canceled reset', async () => {
        const { container } = render(Fixture, { cancel: true });
        const color = container.querySelector('input[type=color]') as HTMLInputElement;
        const file = container.querySelector('input[type=file]') as HTMLInputElement;
        await fireEvent.input(color, { target: { value: '#123456' } });
        await userEvent.setup().upload(file, new File(['data'], 'example.txt'));
        (container.querySelector('form') as HTMLFormElement).reset();
        await settleReset();
        expect(color.value).toBe('#123456');
        expect(screen.getByTestId('color')).toHaveTextContent('#123456');
        expect(screen.getByTestId('files')).toHaveTextContent('1');
        expect(screen.getByTestId('calls')).toHaveTextContent('2');
    });
    test('cancels deferred reset synchronization when inputs unmount', async () => {
        const { container } = render(Fixture);
        const { form } = await changeInputs(container);
        form.reset();
        flushSync(() => screen.getByText('Unmount inputs').click());
        await settleReset();
        expect(screen.getByTestId('color')).toHaveTextContent('#123456');
        expect(screen.getByTestId('files')).toHaveTextContent('1');
    });
    test('does not update stale bindings after inputs unmount', async () => {
        const { container } = render(Fixture);
        const { color, file, form } = await changeInputs(container);
        form.reset();
        await settleReset();
        await fireEvent.click(screen.getByText('Unmount inputs'));
        form.append(color, file);
        color.defaultValue = '#abcdef';
        color.value = '#abcdef';
        form.reset();
        await settleReset();
        expect(screen.getByTestId('color')).toHaveTextContent('#563d7c');
        expect(screen.getByTestId('calls')).toHaveTextContent('2');
    });
});

import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { flushSync, tick } from 'svelte';
import { describe, expect, test } from 'vitest';
import Fixture from './form-reset-correctness-test.svelte';

const settleReset = async () => {
    await Promise.resolve();
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
    test.each([false, true])('synchronizes bound state after reset (external=%s)', async (external) => {
        const { container } = render(Fixture, { external });
        const { color, file, form } = await changeInputs(container);
        form.reset();
        await settleReset();
        expect(color.value).toBe('#563d7c');
        expect(screen.getByTestId('color')).toHaveTextContent('#563d7c');
        expect(file.files).toHaveLength(0);
        expect(screen.getByTestId('files')).toHaveTextContent('0');
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
        expect(screen.getByTestId('files')).toHaveTextContent('0');
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

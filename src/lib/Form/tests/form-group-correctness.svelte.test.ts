import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, test } from 'vitest';
import Fixture from './form-group-correctness-test.svelte';
import CheckInput from '../form-check-input.svelte';
import SwitchInput from '../form-switch-input.svelte';

describe.each([false, true])('group correctness (switch=%s)', (switchInput) => {
    test.each([
        { initial: ['a'], checked: true, expected: '["a"]' },
        { initial: [], checked: false, expected: '[]' },
        { initial: [], checked: true, expected: '["a"]' },
        { initial: ['a'], checked: false, expected: '[]' }
    ])('uses actual checked=$checked with group $initial', async ({ initial, checked, expected }) => {
        render(Fixture, { initial, switchInput });
        const input = screen.getByTestId('group-input') as HTMLInputElement;
        await fireEvent.change(input, { target: { checked } });
        expect(screen.getByTestId('group')).toHaveTextContent(expected);
        await fireEvent.change(input, { target: { checked } });
        expect(screen.getByTestId('group')).toHaveTextContent(expected);
        expect(screen.getByTestId('calls')).toHaveTextContent('2');
    });
    test('next click after native reset adds the checked value', async () => {
        const { container } = render(Fixture, { initial: ['a'], switchInput });
        const input = screen.getByTestId('group-input') as HTMLInputElement;
        input.defaultChecked = false;
        (container.querySelector('form') as HTMLFormElement).reset();
        await tick();
        expect(input.checked).toBe(false);
        input.click();
        await tick();
        expect(input.checked).toBe(true);
        expect(screen.getByTestId('group')).toHaveTextContent('["a"]');
    });
});

describe.each([CheckInput, SwitchInput])('native indeterminate alias', (Component) => {
    test('honors native alias with reactive explicit false precedence', async () => {
        const { container, rerender } = render(Component, { indeterminate: true, 'data-consumer': 'kept' });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.indeterminate).toBe(true);
        expect(input).toHaveAttribute('data-consumer', 'kept');
        await rerender({ indeterminate: true, isIndeterminate: false } as never);
        expect(input.indeterminate).toBe(false);
        await rerender({ indeterminate: true, isIndeterminate: undefined } as never);
        expect(input.indeterminate).toBe(true);
        await rerender({ indeterminate: false, isIndeterminate: undefined } as never);
        expect(input.indeterminate).toBe(false);
        await rerender({ indeterminate: false, isIndeterminate: true } as never);
        expect(input.indeterminate).toBe(true);
    });
});

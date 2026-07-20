/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import RadioInput from '../form-radio-input.svelte';
import RadioInputBindingTest from './form-radio-input-binding-test.svelte';

describe('Form.RadioInput', () => {
    test('type and base class', () => {
        const { container } = render(RadioInput);
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-check-input');
        expect(input).toHaveAttribute('type', 'radio');
    });

    test('custom classes', () => {
        const { container } = render(RadioInput, { props: { class: 'custom-class another-class' } });
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-check-input');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('valid state (isValid: true adds class)', () => {
        const { container } = render(RadioInput, { props: { isValid: true } });
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input).toHaveClass('is-valid');
    });

    test('valid state (undefined: no validation class)', () => {
        const { container } = render(RadioInput);
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input).not.toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('invalid state (isInvalid: true adds class)', () => {
        const { container } = render(RadioInput, { props: { isInvalid: true } });
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
    });

    test('invalid state (undefined: no validation class)', () => {
        const { container } = render(RadioInput);
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(RadioInput, { props: { isValid: true, isInvalid: true } });
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
        // Component logic forces them to be inverses; isInvalid wins here
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('checked state (checked: true)', () => {
        const { container } = render(RadioInput, { props: { checked: true } });
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input.checked).toBe(true);
    });

    test('checked state (checked: false)', () => {
        // Provide a value so group (undefined) !== value and the input is not auto-checked via bind:group
        const { container } = render(RadioInput, { props: { checked: false, value: 'not-selected' } });
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input.checked).toBe(false);
    });

    test('updates standalone checked state across rerenders without a group binding', async () => {
        const { container, rerender } = render(RadioInput, { props: { checked: true } });
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;

        expect(input.checked).toBe(true);
        await rerender({ checked: false });
        expect(input.checked).toBe(false);
    });

    test('binds an explicitly provided group even when its initial value is undefined', async () => {
        render(RadioInputBindingTest);
        const firstRadio = screen.getByTestId('group-one') as HTMLInputElement;

        expect(screen.getByTestId('group-value')).toHaveTextContent('unset');
        expect(firstRadio.checked).toBe(false);

        await fireEvent.click(firstRadio);

        expect(screen.getByTestId('group-value')).toHaveTextContent('one');
        expect(firstRadio.checked).toBe(true);

        await fireEvent.click(screen.getByTestId('clear-group'));

        expect(screen.getByTestId('group-value')).toHaveTextContent('unset');
        expect(firstRadio.checked).toBe(false);
    });

    test('converges when multiple controlled radios share a group and honors parent group changes', async () => {
        render(RadioInputBindingTest);

        const firstRadio = screen.getByTestId('controlled-one') as HTMLInputElement;
        const secondRadio = screen.getByTestId('controlled-two') as HTMLInputElement;

        expect(screen.getByTestId('controlled-group-value')).toHaveTextContent('one');
        expect(screen.getByTestId('controlled-checked-values')).toHaveTextContent('true:false');
        expect(firstRadio.checked).toBe(true);
        expect(secondRadio.checked).toBe(false);

        await fireEvent.click(screen.getByTestId('select-controlled-other'));

        expect(screen.getByTestId('controlled-group-value')).toHaveTextContent('other');
        expect(screen.getByTestId('controlled-checked-values')).toHaveTextContent('false:false');
        expect(firstRadio.checked).toBe(false);
        expect(secondRadio.checked).toBe(false);
    });

    test('keeps standalone checked binding independent from group selection', async () => {
        render(RadioInputBindingTest);
        const standaloneRadio = screen.getByTestId('standalone-radio') as HTMLInputElement;

        await fireEvent.click(standaloneRadio);

        expect(screen.getByTestId('standalone-checked')).toHaveTextContent('true');
        expect(standaloneRadio.checked).toBe(true);

        await fireEvent.click(screen.getByTestId('clear-standalone'));

        expect(screen.getByTestId('standalone-checked')).toHaveTextContent('false');
        expect(standaloneRadio.checked).toBe(false);
    });

    test('adopts checked control when an initially undefined parent value becomes boolean', async () => {
        render(RadioInputBindingTest);
        const radio = screen.getByTestId('late-checked-radio') as HTMLInputElement;

        expect(screen.getByTestId('late-checked')).toHaveTextContent('undefined');
        expect(radio.checked).toBe(false);

        await fireEvent.click(screen.getByTestId('set-late-checked-true'));
        expect(radio.checked).toBe(true);

        await fireEvent.click(screen.getByTestId('set-late-checked-false'));
        expect(radio.checked).toBe(false);

        await fireEvent.click(radio);
        expect(screen.getByTestId('late-checked')).toHaveTextContent('true');
        expect(radio.checked).toBe(true);
    });

    test('does not allow rest props to replace radio type or validation aria state', () => {
        const { container } = render(RadioInput, { props: { isInvalid: true, type: 'text', 'aria-invalid': 'false' } as never });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('type', 'radio');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('accepts a null change handler', async () => {
        const { container } = render(RadioInput, { props: { onchange: null } as never });
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;

        await expect(fireEvent.change(input)).resolves.toBe(true);
    });

    test('prop forwarding (id, name, value, disabled, aria-label)', () => {
        const props = {
            id: 'radioDefault',
            name: 'radioGroup',
            value: 'foo',
            disabled: true,
            'aria-label': 'Some label'
        } as const;
        const { container } = render(RadioInput, { props });
        const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input).toHaveAttribute('id', 'radioDefault');
        expect(input).toHaveAttribute('name', 'radioGroup');
        expect(input).toHaveAttribute('value', 'foo');
        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('aria-label', 'Some label');
    });
});

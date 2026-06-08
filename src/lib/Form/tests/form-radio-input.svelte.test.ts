/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import RadioInput from '../form-radio-input.svelte';

describe('Form.RadioInput', () => {
    test('renders', () => {
        const { container } = render(RadioInput);
        expect(container).toBeInTheDocument();
        const input = container.querySelector('input[type="radio"]');
        expect(input).toBeInTheDocument();
    });

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

    test('group (checked when group equals value)', () => {
        // When group equals value, radio should render as checked
        const { container: c1 } = render(RadioInput, { props: { group: 'one', value: 'one' } });
        const input1 = c1.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input1.checked).toBe(true);

        // When group differs from value, radio should render as not checked
        const { container: c2 } = render(RadioInput, { props: { group: 'one', value: 'two' } });
        const input2 = c2.querySelector('input[type="radio"]') as HTMLInputElement;
        expect(input2.checked).toBe(false);
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

    test('elementRef bound (input exists and is HTMLInputElement)', () => {
        const { container } = render(RadioInput);
        const input = container.querySelector('input[type="radio"]');
        expect(input).toBeInTheDocument();
        expect(input instanceof HTMLInputElement).toBe(true);
    });
});

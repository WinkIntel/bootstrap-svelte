/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import TelephoneInput from '../form-telephone-input.svelte';

// Tests for Form.TelephoneInput covering all props and behaviors

describe('Form.TelephoneInput', () => {
    test('renders input[type=tel] with base class', () => {
        const { container } = render(TelephoneInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'tel');
        expect(input).toHaveClass('form-control');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(TelephoneInput, { props: { class: 'custom-class another-class' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('plaintext mode toggles classes', () => {
        const { container } = render(TelephoneInput, { props: { isPlaintext: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('no validation classes by default', () => {
        const { container } = render(TelephoneInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('applies is-valid when isValid is true', () => {
        const { container } = render(TelephoneInput, { props: { isValid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(TelephoneInput, { props: { isValid: false } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid when isInvalid is true', () => {
        const { container } = render(TelephoneInput, { props: { isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(TelephoneInput, { props: { isValid: true, isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('applies sizing classes when sizing set', () => {
        let res = render(TelephoneInput, { props: { sizing: 'sm' } });
        let input = res.container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-sm');
        res.unmount();

        res = render(TelephoneInput, { props: { sizing: 'lg' } });
        input = res.container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-lg');
        res.unmount();

        const { container } = render(TelephoneInput);
        input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('value binding: sets value when provided, empty when undefined', () => {
        let res = render(TelephoneInput, { props: { value: '555-867-5309' } });
        let input = res.container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('555-867-5309');
        res.unmount();

        res = render(TelephoneInput);
        input = res.container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('');
    });

    test('forwards common attributes (id, name, placeholder, pattern, aria-label)', () => {
        const { container } = render(TelephoneInput, {
            props: {
                id: 'telId',
                name: 'telephone',
                placeholder: '555-867-5309',
                pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
                'aria-label': 'Telephone'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('id', 'telId');
        expect(input).toHaveAttribute('name', 'telephone');
        expect(input).toHaveAttribute('placeholder', '555-867-5309');
        expect(input).toHaveAttribute('pattern', '[0-9]{3}-[0-9]{3}-[0-9]{4}');
        expect(input).toHaveAttribute('aria-label', 'Telephone');
    });

    test('forwards disabled, readonly, list, and title', () => {
        const { container } = render(TelephoneInput, {
            props: {
                disabled: true,
                readonly: true,
                list: 'listOfTelephones',
                title: 'Enter phone'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('readonly');
        expect(input).toHaveAttribute('list', 'listOfTelephones');
        expect(input).toHaveAttribute('title', 'Enter phone');
    });

    test('forwards data attributes', () => {
        const { container } = render(TelephoneInput, { props: { 'data-testid': 'tel', 'data-custom': 'x' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('data-testid', 'tel');
        expect(input).toHaveAttribute('data-custom', 'x');
    });

    test('binds elementRef to input element', () => {
        const { container } = render(TelephoneInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(input).toBeInTheDocument();
    });

    test('handles a complete configuration', () => {
        const { container } = render(TelephoneInput, {
            props: {
                class: 'tel-input',
                isValid: true,
                sizing: 'lg',
                id: 'fullTel',
                name: 'full-tel',
                'aria-label': 'Phone',
                placeholder: '555-867-5309',
                pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
                value: '555-123-4567'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('tel-input');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveAttribute('id', 'fullTel');
        expect(input).toHaveAttribute('name', 'full-tel');
        expect(input).toHaveAttribute('aria-label', 'Phone');
        expect(input).toHaveAttribute('placeholder', '555-867-5309');
        expect(input).toHaveAttribute('pattern', '[0-9]{3}-[0-9]{3}-[0-9]{4}');
        expect(input.value).toBe('555-123-4567');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(TelephoneInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(TelephoneInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(TelephoneInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(TelephoneInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    // mask prop tests
    test('preserves unmasked behavior when no mask prop is provided', async () => {
        const { container } = render(TelephoneInput);
        const input = container.querySelector('input') as HTMLInputElement;

        await fireEvent.input(input, { target: { value: '5555151212' } });

        // No mask → user input is left exactly as typed.
        expect(input.value).toBe('5555151212');
    });

    test('single mask formats typed digits into the template', async () => {
        const { container } = render(TelephoneInput, { props: { mask: '(###) ###-####' } });
        const input = container.querySelector('input') as HTMLInputElement;

        await fireEvent.input(input, { target: { value: '5555151212' } });

        expect(input.value).toBe('(555) 515-1212');
    });

    test('single mask formats progressively as digits are added', async () => {
        const { container } = render(TelephoneInput, { props: { mask: '(###) ###-####' } });
        const input = container.querySelector('input') as HTMLInputElement;

        await fireEvent.input(input, { target: { value: '5' } });
        expect(input.value).toBe('(5');

        await fireEvent.input(input, { target: { value: '(555' } });
        expect(input.value).toBe('(555');

        await fireEvent.input(input, { target: { value: '(555) 515' } });
        expect(input.value).toBe('(555) 515');
    });

    test('non-digit input is ignored by the mask formatter', async () => {
        const { container } = render(TelephoneInput, { props: { mask: '(###) ###-####' } });
        const input = container.querySelector('input') as HTMLInputElement;

        // Letters and punctuation interleaved with digits should be stripped — only
        // digit characters fill the `#` slots; literal mask characters are inserted
        // automatically.
        await fireEvent.input(input, { target: { value: '5a5b5c5d1e5f1g2h1i2' } });

        expect(input.value).toBe('(555) 515-1212');
    });

    test('masking does not remove or replace the pattern attribute', async () => {
        const { container } = render(TelephoneInput, {
            props: {
                mask: '(###) ###-####',
                pattern: '\\(\\d{3}\\) \\d{3}-\\d{4}'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        // `pattern` is browser-validation only and must survive the mask wiring.
        expect(input).toHaveAttribute('pattern', '\\(\\d{3}\\) \\d{3}-\\d{4}');

        await fireEvent.input(input, { target: { value: '5555151212' } });

        // The masked value matches the supplied pattern, but the attribute itself
        // is untouched by the mask formatter.
        expect(input.value).toBe('(555) 515-1212');
        expect(input).toHaveAttribute('pattern', '\\(\\d{3}\\) \\d{3}-\\d{4}');
    });

    test('array of masks selects the shortest mask that fits the digit count', async () => {
        const { container } = render(TelephoneInput, {
            props: { mask: ['###-###-####', '+# (###) ###-####'] }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        // 10 digits fit the first 10-slot mask.
        await fireEvent.input(input, { target: { value: '5555151212' } });
        expect(input.value).toBe('555-515-1212');

        // 11 digits overflow the first mask, so the second (longer) mask is chosen.
        await fireEvent.input(input, { target: { value: '15555151212' } });
        expect(input.value).toBe('+1 (555) 515-1212');
    });

    test('array of masks falls back to the longest mask when overflowing all entries', async () => {
        const { container } = render(TelephoneInput, {
            props: { mask: ['###-####', '###-###-####'] }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        // 13 digits exceed every mask in the array; the last mask is used and any
        // extra digits past its `#` slots are dropped.
        await fireEvent.input(input, { target: { value: '1234567890123' } });
        expect(input.value).toBe('123-456-7890');
    });

    test('mask still renders the input as type="tel" and preserves base class', () => {
        const { container } = render(TelephoneInput, { props: { mask: '(###) ###-####' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('type', 'tel');
        expect(input).toHaveClass('form-control');
    });
});

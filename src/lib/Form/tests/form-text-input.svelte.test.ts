/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import TextInput from '../form-text-input.svelte';

// Tests for Form.TextInput covering all props and behaviors

describe('Form.TextInput', () => {
    test('renders input[type=text] with base class', () => {
        const { container } = render(TextInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(TextInput, { props: { class: 'custom-class another-class' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('plaintext mode toggles classes', () => {
        const { container } = render(TextInput, { props: { isPlaintext: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('no validation classes by default', () => {
        const { container } = render(TextInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('applies is-valid when isValid is true', () => {
        const { container } = render(TextInput, { props: { isValid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(TextInput, { props: { isValid: false } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid when isInvalid is true', () => {
        const { container } = render(TextInput, { props: { isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(TextInput, { props: { isValid: true, isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('applies sizing classes when sizing set', () => {
        let res = render(TextInput, { props: { sizing: 'sm' } });
        let input = res.container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-sm');
        res.unmount();

        res = render(TextInput, { props: { sizing: 'lg' } });
        input = res.container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-lg');
        res.unmount();

        const { container } = render(TextInput);
        input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('value binding: sets value when provided, empty when undefined', () => {
        let res = render(TextInput, { props: { value: 'hello' } });
        let input = res.container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('hello');
        res.unmount();

        res = render(TextInput);
        input = res.container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('');
    });

    test('forwards common attributes (id, name, placeholder, pattern, inputmode, autocomplete, aria-label)', () => {
        const { container } = render(TextInput, {
            props: {
                id: 'textId',
                name: 'text',
                placeholder: 'Type here',
                pattern: '[A-Za-z ]*',
                inputmode: 'text',
                autocomplete: 'on',
                'aria-label': 'Text'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('id', 'textId');
        expect(input).toHaveAttribute('name', 'text');
        expect(input).toHaveAttribute('placeholder', 'Type here');
        expect(input).toHaveAttribute('pattern', '[A-Za-z ]*');
        expect(input).toHaveAttribute('inputmode', 'text');
        expect(input).toHaveAttribute('autocomplete', 'on');
        expect(input).toHaveAttribute('aria-label', 'Text');
    });

    test('forwards disabled, readonly, required, list, minlength, maxlength, and title', () => {
        const { container } = render(TextInput, {
            props: {
                disabled: true,
                readonly: true,
                required: true,
                list: 'listOfTextValues',
                minlength: 2,
                maxlength: 12,
                title: 'Enter text'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('readonly');
        expect(input).toHaveAttribute('required');
        expect(input).toHaveAttribute('list', 'listOfTextValues');
        expect(input).toHaveAttribute('minlength', '2');
        expect(input).toHaveAttribute('maxlength', '12');
        expect(input).toHaveAttribute('title', 'Enter text');
    });

    test('forwards data attributes', () => {
        const { container } = render(TextInput, { props: { 'data-testid': 'text', 'data-custom': 'x' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('data-testid', 'text');
        expect(input).toHaveAttribute('data-custom', 'x');
    });

    test('handles a complete configuration', () => {
        const { container } = render(TextInput, {
            props: {
                class: 'text-input',
                isValid: true,
                sizing: 'lg',
                id: 'fullText',
                name: 'full-text',
                'aria-label': 'Full Text',
                placeholder: 'Enter text',
                minlength: 3,
                maxlength: 30,
                value: 'Hello world'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('text-input');
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveAttribute('id', 'fullText');
        expect(input).toHaveAttribute('name', 'full-text');
        expect(input).toHaveAttribute('aria-label', 'Full Text');
        expect(input).toHaveAttribute('placeholder', 'Enter text');
        expect(input).toHaveAttribute('minlength', '3');
        expect(input).toHaveAttribute('maxlength', '30');
        expect(input.value).toBe('Hello world');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(TextInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(TextInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(TextInput);
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('does not render aria-invalid when isValid is false and isInvalid is undefined', () => {
        const { container } = render(TextInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('does not render aria-invalid when isInvalid is false and isValid is undefined', () => {
        const { container } = render(TextInput, {
            props: {
                isInvalid: false
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(TextInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        // isInvalid takes precedence
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });
});

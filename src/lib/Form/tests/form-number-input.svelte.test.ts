/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import NumberInput from '../form-number-input.svelte';

describe('Form.NumberInput', () => {
    test('renders input with type number and base class', () => {
        const { container } = render(NumberInput);
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(NumberInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(NumberInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('is-valid');
    });

    test('does not apply is-valid class when isValid is undefined', () => {
        const { container } = render(NumberInput);
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(NumberInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('is-invalid');
    });

    test('does not apply is-invalid class when isInvalid is undefined', () => {
        const { container } = render(NumberInput);
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(NumberInput, {
            props: {
                isValid: true,
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        // Both flags operate independently now: both classes should be present when both are true
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(NumberInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        // Validation flags are independent: false/undefined should not add validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies form-control-plaintext class when isPlaintext is true', () => {
        const { container } = render(NumberInput, {
            props: {
                isPlaintext: true
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('applies form-control class when isPlaintext is false', () => {
        const { container } = render(NumberInput, {
            props: {
                isPlaintext: false
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies form-control class when isPlaintext is undefined', () => {
        const { container } = render(NumberInput);
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies sizing class when sizing is sm', () => {
        const { container } = render(NumberInput, {
            props: {
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-sm');
    });

    test('applies sizing class when sizing is lg', () => {
        const { container } = render(NumberInput, {
            props: {
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(NumberInput);
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('sets value when provided as number', () => {
        const { container } = render(NumberInput, {
            props: {
                value: 42
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input.valueAsNumber).toBe(42);
    });

    test('sets value when provided as zero', () => {
        const { container } = render(NumberInput, {
            props: {
                value: 0
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input.valueAsNumber).toBe(0);
    });

    test('sets value when provided as negative number', () => {
        const { container } = render(NumberInput, {
            props: {
                value: -10
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input.valueAsNumber).toBe(-10);
    });

    test('sets value when provided as decimal', () => {
        const { container } = render(NumberInput, {
            props: {
                value: 3.14
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input.valueAsNumber).toBe(3.14);
    });

    test('has empty value when value is undefined', () => {
        const { container } = render(NumberInput);
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input.value).toBe('');
        expect(isNaN(input.valueAsNumber)).toBe(true);
    });

    test('forwards min and max attributes to input', () => {
        const { container } = render(NumberInput, {
            props: {
                min: 1,
                max: 100
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveAttribute('min', '1');
        expect(input).toHaveAttribute('max', '100');
    });

    test('forwards step attribute to input', () => {
        const { container } = render(NumberInput, {
            props: {
                step: 0.1
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveAttribute('step', '0.1');
    });

    test('forwards id, name, and title props to input', () => {
        const { container } = render(NumberInput, {
            props: {
                id: 'numberDefault',
                name: 'numberDefault',
                title: 'Set a number'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveAttribute('id', 'numberDefault');
        expect(input).toHaveAttribute('name', 'numberDefault');
        expect(input).toHaveAttribute('title', 'Set a number');
    });

    test('forwards accessibility attributes to input', () => {
        const { container } = render(NumberInput, {
            props: {
                'aria-label': 'Custom number input label',
                'aria-describedby': 'help-text'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-label', 'Custom number input label');
        expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('forwards disabled attribute to input', () => {
        const { container } = render(NumberInput, {
            props: {
                disabled: true
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveAttribute('disabled');
        expect(input.disabled).toBe(true);
    });

    test('forwards readonly attribute to input', () => {
        const { container } = render(NumberInput, {
            props: {
                readonly: true
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveAttribute('readonly');
        expect(input.readOnly).toBe(true);
    });

    test('forwards list attribute to input', () => {
        const { container } = render(NumberInput, {
            props: {
                list: 'listOfNumbers'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveAttribute('list', 'listOfNumbers');
    });

    test('forwards placeholder attribute to input', () => {
        const { container } = render(NumberInput, {
            props: {
                placeholder: 'Enter a number'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveAttribute('placeholder', 'Enter a number');
    });

    test('forwards data attributes to input', () => {
        const { container } = render(NumberInput, {
            props: {
                'data-testid': 'number-test',
                'data-custom': 'custom-value'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveAttribute('data-testid', 'number-test');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });

    test('applies multiple conditional classes together', () => {
        const { container } = render(NumberInput, {
            props: {
                class: 'custom-class',
                isValid: true,
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('form-control-lg');
    });

    test('applies plaintext with validation and sizing together', () => {
        const { container } = render(NumberInput, {
            props: {
                class: 'custom-plaintext',
                isPlaintext: true,
                isInvalid: true,
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).toHaveClass('custom-plaintext');
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control');
    });

    test('handles complete number input configuration', () => {
        const { container } = render(NumberInput, {
            props: {
                class: 'test-number-input',
                value: 25,
                min: 1,
                max: 100,
                step: 5,
                isValid: true,
                sizing: 'lg',
                id: 'complexNumber',
                title: 'Complex number input',
                placeholder: 'Enter value 1-100'
            }
        });
        const input = container.querySelector('input[type="number"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('test-number-input');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('form-control-lg');
        expect(input.valueAsNumber).toBe(25);
        expect(input).toHaveAttribute('min', '1');
        expect(input).toHaveAttribute('max', '100');
        expect(input).toHaveAttribute('step', '5');
        expect(input).toHaveAttribute('id', 'complexNumber');
        expect(input).toHaveAttribute('title', 'Complex number input');
        expect(input).toHaveAttribute('placeholder', 'Enter value 1-100');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(NumberInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(NumberInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(NumberInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(NumberInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

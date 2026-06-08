/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import MonthInput from '../form-month-input.svelte';

describe('Form.MonthInput', () => {
    test('renders without crashing', () => {
        const { container } = render(MonthInput);
        expect(container).toBeInTheDocument();
    });

    test('renders input with type month and base class', () => {
        const { container } = render(MonthInput);
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(MonthInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(MonthInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveClass('is-valid');
    });

    test('does not apply is-valid class when isValid is undefined', () => {
        const { container } = render(MonthInput);
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(MonthInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveClass('is-invalid');
    });

    test('does not apply is-invalid class when isInvalid is undefined', () => {
        const { container } = render(MonthInput);
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(MonthInput, {
            props: {
                isValid: true,
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        // Both flags operate independently now: both classes should be present when both are true
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(MonthInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        // Validation flags are independent: false/undefined should not add validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies form-control-plaintext class when isPlaintext is true', () => {
        const { container } = render(MonthInput, {
            props: {
                isPlaintext: true
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('applies form-control class when isPlaintext is false', () => {
        const { container } = render(MonthInput, {
            props: {
                isPlaintext: false
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies form-control class when isPlaintext is undefined', () => {
        const { container } = render(MonthInput);
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies sizing class when sizing is sm', () => {
        const { container } = render(MonthInput, {
            props: {
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-sm');
    });

    test('applies sizing class when sizing is lg', () => {
        const { container } = render(MonthInput, {
            props: {
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(MonthInput);
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('sets value when provided', () => {
        const { container } = render(MonthInput, {
            props: {
                value: '2025-06'
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input.value).toBe('2025-06');
    });

    test('has empty value when value is undefined', () => {
        const { container } = render(MonthInput);
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input.value).toBe('');
    });

    test('forwards id, name, and title props to input', () => {
        const { container } = render(MonthInput, {
            props: {
                id: 'monthDefault',
                name: 'monthDefault',
                title: 'Choose a month'
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveAttribute('id', 'monthDefault');
        expect(input).toHaveAttribute('name', 'monthDefault');
        expect(input).toHaveAttribute('title', 'Choose a month');
    });

    test('forwards accessibility attributes to input', () => {
        const { container } = render(MonthInput, {
            props: {
                'aria-label': 'Custom month input label',
                'aria-describedby': 'help-text'
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-label', 'Custom month input label');
        expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('forwards disabled attribute to input', () => {
        const { container } = render(MonthInput, {
            props: {
                disabled: true
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveAttribute('disabled');
        expect(input.disabled).toBe(true);
    });

    test('forwards readonly attribute to input', () => {
        const { container } = render(MonthInput, {
            props: {
                readonly: true
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveAttribute('readonly');
        expect(input.readOnly).toBe(true);
    });

    test('forwards list attribute to input', () => {
        const { container } = render(MonthInput, {
            props: {
                list: 'listOfMonths'
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveAttribute('list', 'listOfMonths');
    });

    test('forwards data attributes to input', () => {
        const { container } = render(MonthInput, {
            props: {
                'data-testid': 'month-test',
                'data-custom': 'custom-value'
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveAttribute('data-testid', 'month-test');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });

    test('binds elementRef to the input element', () => {
        const { container } = render(MonthInput);
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(input).toBeInTheDocument();
    });

    test('applies multiple conditional classes together', () => {
        const { container } = render(MonthInput, {
            props: {
                class: 'custom-class',
                isValid: true,
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('form-control-lg');
    });

    test('applies plaintext with validation and sizing together', () => {
        const { container } = render(MonthInput, {
            props: {
                class: 'custom-plaintext',
                isPlaintext: true,
                isInvalid: true,
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="month"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).toHaveClass('custom-plaintext');
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(MonthInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(MonthInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(MonthInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(MonthInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

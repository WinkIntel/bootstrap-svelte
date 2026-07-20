/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import DateInput from '../form-date-input.svelte';

describe('Form.DateInput', () => {
    test('renders input with type date and default form-control class', () => {
        const { container } = render(DateInput);
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies form-control-plaintext class when isPlaintext is true', () => {
        const { container } = render(DateInput, {
            props: {
                isPlaintext: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('does not apply form-control-plaintext class when isPlaintext is false', () => {
        const { container } = render(DateInput, {
            props: {
                isPlaintext: false
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('merges custom classes with base classes', () => {
        const { container } = render(DateInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(DateInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('is-valid');
    });

    test('does not apply is-valid class when isValid is undefined', () => {
        const { container } = render(DateInput);
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(DateInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('is-invalid');
    });

    test('does not apply is-invalid class when isInvalid is undefined', () => {
        const { container } = render(DateInput);
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(DateInput, {
            props: {
                isValid: true,
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        // Both flags operate independently now: both classes should be present when both are true
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(DateInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        // Validation flags are independent: false/undefined should not add validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies small sizing class when sizing is sm', () => {
        const { container } = render(DateInput, {
            props: {
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-sm');
    });

    test('applies large sizing class when sizing is lg', () => {
        const { container } = render(DateInput, {
            props: {
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(DateInput);
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('sets value when provided', () => {
        const { container } = render(DateInput, {
            props: {
                value: '2025-06-10'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input.value).toBe('2025-06-10');
    });

    test('has empty value when value is undefined', () => {
        const { container } = render(DateInput);
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input.value).toBe('');
    });

    test('sets default autocomplete to off', () => {
        const { container } = render(DateInput);
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('autocomplete', 'off');
    });

    test('applies autocomplete off data attributes by default', () => {
        const { container } = render(DateInput);
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('data-form-type', 'other');
        expect(input).toHaveAttribute('data-lpignore', 'true');
    });

    test('forwards custom autocomplete prop', () => {
        const { container } = render(DateInput, {
            props: {
                autocomplete: 'bday'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('autocomplete', 'bday');
    });

    test('preserves custom data attributes when autocomplete is not off', () => {
        const { container } = render(DateInput, {
            props: {
                autocomplete: 'bday',
                'data-form-type': 'birthday',
                'data-lpignore': 'false'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('autocomplete', 'bday');
        expect(input).toHaveAttribute('data-form-type', 'birthday');
        expect(input).toHaveAttribute('data-lpignore', 'false');
    });

    test('uses default data-form-type when autocomplete is not off and no custom value is provided', () => {
        const { container } = render(DateInput, {
            props: {
                autocomplete: 'bday'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('data-form-type', 'email');
        expect(input).not.toHaveAttribute('data-lpignore');
    });

    test('overrides custom data attributes when autocomplete is off', () => {
        const { container } = render(DateInput, {
            props: {
                autocomplete: 'off',
                'data-form-type': 'birthday',
                'data-lpignore': 'false'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('autocomplete', 'off');
        expect(input).toHaveAttribute('data-form-type', 'other');
        expect(input).toHaveAttribute('data-lpignore', 'true');
    });

    test('forwards id attribute to input', () => {
        const { container } = render(DateInput, {
            props: {
                id: 'date-picker'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('id', 'date-picker');
    });

    test('forwards name attribute to input', () => {
        const { container } = render(DateInput, {
            props: {
                name: 'birth-date'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('name', 'birth-date');
    });

    test('forwards disabled attribute to input', () => {
        const { container } = render(DateInput, {
            props: {
                disabled: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('disabled');
        expect(input.disabled).toBe(true);
    });

    test('forwards readonly attribute to input', () => {
        const { container } = render(DateInput, {
            props: {
                readonly: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('readonly');
        expect(input.readOnly).toBe(true);
    });

    test('forwards min and max attributes to input', () => {
        const { container } = render(DateInput, {
            props: {
                min: '2025-01-01',
                max: '2025-12-31'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('min', '2025-01-01');
        expect(input).toHaveAttribute('max', '2025-12-31');
    });

    test('forwards step attribute to input', () => {
        const { container } = render(DateInput, {
            props: {
                step: '7'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('step', '7');
    });

    test('forwards list attribute to input', () => {
        const { container } = render(DateInput, {
            props: {
                list: 'listOfDates'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('list', 'listOfDates');
    });

    test('forwards accessibility attributes to input', () => {
        const { container } = render(DateInput, {
            props: {
                'aria-label': 'Date picker',
                'aria-describedby': 'date-help'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-label', 'Date picker');
        expect(input).toHaveAttribute('aria-describedby', 'date-help');
    });

    test('forwards data attributes to input', () => {
        const { container } = render(DateInput, {
            props: {
                'data-testid': 'date-input',
                'data-custom': 'custom-value'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('data-testid', 'date-input');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });

    test('forwards title attribute to input', () => {
        const { container } = render(DateInput, {
            props: {
                title: 'Choose your date'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('title', 'Choose your date');
    });

    test('combines plaintext with validation classes', () => {
        const { container } = render(DateInput, {
            props: {
                isPlaintext: true,
                isValid: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).toHaveClass('is-valid');
        expect(input).not.toHaveClass('form-control');
    });

    test('combines sizing with validation classes', () => {
        const { container } = render(DateInput, {
            props: {
                sizing: 'lg',
                isValid: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveClass('is-valid');
    });

    test('combines sizing with custom classes', () => {
        const { container } = render(DateInput, {
            props: {
                sizing: 'sm',
                class: 'custom-date-input'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-sm');
        expect(input).toHaveClass('custom-date-input');
    });

    test('accepts valid date values', () => {
        const testDates = ['2025-01-01', '2025-06-10', '2025-12-31', '2024-02-29', '2023-07-15'];

        testDates.forEach((date) => {
            const { container } = render(DateInput, {
                props: {
                    value: date
                }
            });
            const input = container.querySelector('input[type="date"]') as HTMLInputElement;

            expect(input.value).toBe(date);
        });
    });

    test('handles all combinations of validation states', () => {
        // Test all possible combinations
        const combinations = [
            { isValid: undefined, isInvalid: undefined, expectValid: false, expectInvalid: false },
            { isValid: true, isInvalid: undefined, expectValid: true, expectInvalid: false },
            { isValid: false, isInvalid: undefined, expectValid: false, expectInvalid: false },
            { isValid: undefined, isInvalid: true, expectValid: false, expectInvalid: true },
            { isValid: undefined, isInvalid: false, expectValid: false, expectInvalid: false }
        ];

        combinations.forEach(({ isValid, isInvalid, expectValid, expectInvalid }) => {
            const { container } = render(DateInput, {
                props: {
                    isValid,
                    isInvalid
                }
            });
            const input = container.querySelector('input[type="date"]') as HTMLInputElement;

            if (expectValid) {
                expect(input).toHaveClass('is-valid');
            } else {
                expect(input).not.toHaveClass('is-valid');
            }

            if (expectInvalid) {
                expect(input).toHaveClass('is-invalid');
            } else {
                expect(input).not.toHaveClass('is-invalid');
            }
        });
    });

    test('renders with all props combined', () => {
        const { container } = render(DateInput, {
            props: {
                id: 'birth-date',
                name: 'birthDate',
                value: '2025-06-10',
                autocomplete: 'bday',
                sizing: 'lg',
                isValid: true,
                disabled: false,
                readonly: false,
                min: '2000-01-01',
                max: '2030-12-31',
                title: 'Choose your birth date',
                class: 'custom-date-input',
                'data-testid': 'birth-date-picker',
                'data-form-type': 'birthday',
                'data-lpignore': 'false'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('custom-date-input');
        expect(input).toHaveAttribute('id', 'birth-date');
        expect(input).toHaveAttribute('name', 'birthDate');
        expect(input).toHaveAttribute('title', 'Choose your birth date');
        expect(input).toHaveAttribute('min', '2000-01-01');
        expect(input).toHaveAttribute('max', '2030-12-31');
        expect(input).toHaveAttribute('autocomplete', 'bday');
        expect(input).toHaveAttribute('data-testid', 'birth-date-picker');
        expect(input).toHaveAttribute('data-form-type', 'birthday');
        expect(input).toHaveAttribute('data-lpignore', 'false');
        expect(input.value).toBe('2025-06-10');
        expect(input.disabled).toBe(false);
        expect(input.readOnly).toBe(false);
    });

    test('renders as plaintext with readonly state', () => {
        const { container } = render(DateInput, {
            props: {
                isPlaintext: true,
                readonly: true,
                value: '2025-06-10'
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
        expect(input.readOnly).toBe(true);
        expect(input.value).toBe('2025-06-10');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(DateInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(DateInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(DateInput);
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('does not render aria-invalid when isValid is false and isInvalid is undefined', () => {
        const { container } = render(DateInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('does not render aria-invalid when isInvalid is false and isValid is undefined', () => {
        const { container } = render(DateInput, {
            props: {
                isInvalid: false
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(DateInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });
        const input = container.querySelector('input[type="date"]') as HTMLInputElement;

        // isInvalid takes precedence
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });
});

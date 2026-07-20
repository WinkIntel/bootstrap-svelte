/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import DatetimeLocalInput from '../form-datetime-local-input.svelte';

describe('Form.DatetimeLocalInput', () => {
    test('renders input with type datetime-local and default form-control class', () => {
        const { container } = render(DatetimeLocalInput);
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies form-control-plaintext class when isPlaintext is true', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isPlaintext: true
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('does not apply form-control-plaintext class when isPlaintext is false', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isPlaintext: false
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('merges custom classes with base classes', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('is-valid');
    });

    test('does not apply is-valid class when isValid is undefined', () => {
        const { container } = render(DatetimeLocalInput);
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('is-invalid');
    });

    test('does not apply is-invalid class when isInvalid is undefined', () => {
        const { container } = render(DatetimeLocalInput);
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isValid: true,
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        // Both flags operate independently now: both classes should be present when both are true
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        // Validation flags are independent: false/undefined should not add validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies small sizing class when sizing is sm', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-sm');
    });

    test('applies large sizing class when sizing is lg', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(DatetimeLocalInput);
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('sets value when provided', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                value: '2025-06-10T19:30'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input.value).toBe('2025-06-10T19:30');
    });

    test('has empty value when value is undefined', () => {
        const { container } = render(DatetimeLocalInput);
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input.value).toBe('');
    });

    test('forwards id attribute to input', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                id: 'datetime-picker'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('id', 'datetime-picker');
    });

    test('forwards name attribute to input', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                name: 'appointment-time'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('name', 'appointment-time');
    });

    test('forwards disabled attribute to input', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                disabled: true
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('disabled');
        expect(input.disabled).toBe(true);
    });

    test('forwards readonly attribute to input', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                readonly: true
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('readonly');
        expect(input.readOnly).toBe(true);
    });

    test('forwards min and max attributes to input', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                min: '2025-01-01T00:00',
                max: '2025-12-31T23:59'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('min', '2025-01-01T00:00');
        expect(input).toHaveAttribute('max', '2025-12-31T23:59');
    });

    test('forwards step attribute to input', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                step: '60'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('step', '60');
    });

    test('forwards list attribute to input', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                list: 'listOfDatetimes'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('list', 'listOfDatetimes');
    });

    test('forwards accessibility attributes to input', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                'aria-label': 'Datetime picker',
                'aria-describedby': 'datetime-help'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-label', 'Datetime picker');
        expect(input).toHaveAttribute('aria-describedby', 'datetime-help');
    });

    test('forwards data attributes to input', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                'data-testid': 'datetime-input',
                'data-custom': 'custom-value'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('data-testid', 'datetime-input');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });

    test('forwards title attribute to input', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                title: 'Choose your datetime'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('title', 'Choose your datetime');
    });

    test('combines plaintext with validation classes', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isPlaintext: true,
                isValid: true
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).toHaveClass('is-valid');
        expect(input).not.toHaveClass('form-control');
    });

    test('combines sizing with validation classes', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                sizing: 'lg',
                isValid: true
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveClass('is-valid');
    });

    test('combines sizing with custom classes', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                sizing: 'sm',
                class: 'custom-datetime-input'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-sm');
        expect(input).toHaveClass('custom-datetime-input');
    });

    test('accepts valid datetime-local values', () => {
        const testDatetimes = ['2025-01-01T00:00', '2025-06-10T19:30', '2025-12-31T23:59', '2024-02-29T12:15', '2023-07-15T08:45'];

        testDatetimes.forEach((datetime) => {
            const { container } = render(DatetimeLocalInput, {
                props: {
                    value: datetime
                }
            });
            const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

            expect(input.value).toBe(datetime);
        });
    });

    test('handles datetime values with seconds', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                value: '2025-06-10T19:30:45'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input.value).toBe('2025-06-10T19:30:45.000');
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
            const { container } = render(DatetimeLocalInput, {
                props: {
                    isValid,
                    isInvalid
                }
            });
            const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

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
        const { container } = render(DatetimeLocalInput, {
            props: {
                id: 'appointment-datetime',
                name: 'appointmentTime',
                value: '2025-06-10T19:30',
                sizing: 'lg',
                isValid: true,
                disabled: false,
                readonly: false,
                min: '2025-01-01T00:00',
                max: '2025-12-31T23:59',
                title: 'Choose your appointment datetime',
                class: 'custom-datetime-input',
                'data-testid': 'appointment-datetime-picker'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('custom-datetime-input');
        expect(input).toHaveAttribute('id', 'appointment-datetime');
        expect(input).toHaveAttribute('name', 'appointmentTime');
        expect(input).toHaveAttribute('title', 'Choose your appointment datetime');
        expect(input).toHaveAttribute('min', '2025-01-01T00:00');
        expect(input).toHaveAttribute('max', '2025-12-31T23:59');
        expect(input).toHaveAttribute('data-testid', 'appointment-datetime-picker');
        expect(input.value).toBe('2025-06-10T19:30');
        expect(input.disabled).toBe(false);
        expect(input.readOnly).toBe(false);
    });

    test('renders as plaintext with readonly state', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isPlaintext: true,
                readonly: true,
                value: '2025-06-10T19:30'
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
        expect(input.readOnly).toBe(true);
        expect(input.value).toBe('2025-06-10T19:30');
    });

    test('handles step attribute for time increments', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                step: '900' // 15 minutes
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('step', '900');
    });

    test('handles required attribute', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                required: true
            }
        });
        const input = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

        expect(input).toHaveAttribute('required');
        expect(input.required).toBe(true);
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(DatetimeLocalInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(DatetimeLocalInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

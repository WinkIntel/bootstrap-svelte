/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import EmailInput from '../form-email-input.svelte';

describe('Form.EmailInput', () => {
    test('renders without crashing', () => {
        const { container } = render(EmailInput);
        expect(container).toBeInTheDocument();
    });

    test('renders input with type email and default form-control class', () => {
        const { container } = render(EmailInput);
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies form-control-plaintext class when isPlaintext is true', () => {
        const { container } = render(EmailInput, {
            props: {
                isPlaintext: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('does not apply form-control-plaintext class when isPlaintext is false', () => {
        const { container } = render(EmailInput, {
            props: {
                isPlaintext: false
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('merges custom classes with base classes', () => {
        const { container } = render(EmailInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(EmailInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('is-valid');
    });

    test('does not apply is-valid class when isValid is undefined', () => {
        const { container } = render(EmailInput);
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(EmailInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('is-invalid');
    });

    test('does not apply is-invalid class when isInvalid is undefined', () => {
        const { container } = render(EmailInput);
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(EmailInput, {
            props: {
                isValid: true,
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        // Both flags operate independently now: both classes should be present when both are true
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(EmailInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        // Validation flags are independent: false/undefined should not add validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies small sizing class when sizing is sm', () => {
        const { container } = render(EmailInput, {
            props: {
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-sm');
    });

    test('applies large sizing class when sizing is lg', () => {
        const { container } = render(EmailInput, {
            props: {
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(EmailInput);
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('sets value when provided', () => {
        const { container } = render(EmailInput, {
            props: {
                value: 'test@example.com'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input.value).toBe('test@example.com');
    });

    test('has empty value when value is undefined', () => {
        const { container } = render(EmailInput);
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input.value).toBe('');
    });

    test('forwards id attribute to input', () => {
        const { container } = render(EmailInput, {
            props: {
                id: 'email-input'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('id', 'email-input');
    });

    test('forwards name attribute to input', () => {
        const { container } = render(EmailInput, {
            props: {
                name: 'user-email'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('name', 'user-email');
    });

    test('forwards disabled attribute to input', () => {
        const { container } = render(EmailInput, {
            props: {
                disabled: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('disabled');
        expect(input.disabled).toBe(true);
    });

    test('forwards readonly attribute to input', () => {
        const { container } = render(EmailInput, {
            props: {
                readonly: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('readonly');
        expect(input.readOnly).toBe(true);
    });

    test('forwards placeholder attribute to input', () => {
        const { container } = render(EmailInput, {
            props: {
                placeholder: 'name@example.com'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('placeholder', 'name@example.com');
    });

    test('forwards pattern attribute to input', () => {
        const { container } = render(EmailInput, {
            props: {
                pattern: '.+@winkintel\\.com'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('pattern', '.+@winkintel\\.com');
    });

    test('forwards list attribute to input', () => {
        const { container } = render(EmailInput, {
            props: {
                list: 'listOfEmails'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('list', 'listOfEmails');
    });

    test('forwards accessibility attributes to input', () => {
        const { container } = render(EmailInput, {
            props: {
                'aria-label': 'Email address',
                'aria-describedby': 'email-help'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-label', 'Email address');
        expect(input).toHaveAttribute('aria-describedby', 'email-help');
    });

    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(EmailInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('does not set aria-invalid when isInvalid is false', () => {
        const { container } = render(EmailInput, {
            props: {
                isInvalid: false
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('does not set aria-invalid when isInvalid is undefined', () => {
        const { container } = render(EmailInput);
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('forwards data attributes to input', () => {
        const { container } = render(EmailInput, {
            props: {
                'data-testid': 'email-input',
                'data-custom': 'custom-value'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('data-testid', 'email-input');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });

    test('forwards title attribute to input', () => {
        const { container } = render(EmailInput, {
            props: {
                title: 'Enter your email address'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('title', 'Enter your email address');
    });

    test('binds elementRef to the input element', () => {
        const { container } = render(EmailInput);
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(input).toBeInTheDocument();
    });

    test('combines plaintext with validation classes', () => {
        const { container } = render(EmailInput, {
            props: {
                isPlaintext: true,
                isValid: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).toHaveClass('is-valid');
        expect(input).not.toHaveClass('form-control');
    });

    test('combines sizing with validation classes', () => {
        const { container } = render(EmailInput, {
            props: {
                sizing: 'lg',
                isValid: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveClass('is-valid');
    });

    test('combines sizing with custom classes', () => {
        const { container } = render(EmailInput, {
            props: {
                sizing: 'sm',
                class: 'custom-email-input'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-sm');
        expect(input).toHaveClass('custom-email-input');
    });

    test('accepts valid email values', () => {
        const testEmails = [
            'test@example.com',
            'user.name@domain.co.uk',
            'firstname+lastname@company.org',
            'email@subdomain.example.com',
            'firstname_lastname@example.com'
        ];

        testEmails.forEach((email) => {
            const { container } = render(EmailInput, {
                props: {
                    value: email
                }
            });
            const input = container.querySelector('input[type="email"]') as HTMLInputElement;

            expect(input.value).toBe(email);
        });
    });

    test('handles all combinations of validation states', () => {
        // Test all possible combinations
        const combinations = [
            { isValid: undefined, isInvalid: undefined, expectValid: false, expectInvalid: false, expectAriaInvalid: undefined },
            { isValid: true, isInvalid: undefined, expectValid: true, expectInvalid: false, expectAriaInvalid: 'false' },
            { isValid: false, isInvalid: undefined, expectValid: false, expectInvalid: false, expectAriaInvalid: undefined },
            { isValid: undefined, isInvalid: true, expectValid: false, expectInvalid: true, expectAriaInvalid: 'true' },
            { isValid: undefined, isInvalid: false, expectValid: false, expectInvalid: false, expectAriaInvalid: undefined }
        ];

        combinations.forEach(({ isValid, isInvalid, expectValid, expectInvalid, expectAriaInvalid }) => {
            const { container } = render(EmailInput, {
                props: {
                    isValid,
                    isInvalid
                }
            });
            const input = container.querySelector('input[type="email"]') as HTMLInputElement;

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

            if (expectAriaInvalid === 'true') {
                expect(input).toHaveAttribute('aria-invalid', 'true');
            } else if (expectAriaInvalid === 'false') {
                expect(input).toHaveAttribute('aria-invalid', 'false');
            } else {
                expect(input).not.toHaveAttribute('aria-invalid');
            }
        });
    });

    test('renders with all props combined', () => {
        const { container } = render(EmailInput, {
            props: {
                id: 'user-email',
                name: 'userEmail',
                value: 'test@example.com',
                sizing: 'lg',
                isValid: true,
                disabled: false,
                readonly: false,
                placeholder: 'name@example.com',
                pattern: '.+@example\\.com',
                title: 'Enter your email address',
                class: 'custom-email-input',
                'data-testid': 'user-email-input'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('custom-email-input');
        expect(input).toHaveAttribute('id', 'user-email');
        expect(input).toHaveAttribute('name', 'userEmail');
        expect(input).toHaveAttribute('title', 'Enter your email address');
        expect(input).toHaveAttribute('placeholder', 'name@example.com');
        expect(input).toHaveAttribute('pattern', '.+@example\\.com');
        expect(input).toHaveAttribute('data-testid', 'user-email-input');
        expect(input.value).toBe('test@example.com');
        expect(input.disabled).toBe(false);
        expect(input.readOnly).toBe(false);
        expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    test('renders as plaintext with readonly state', () => {
        const { container } = render(EmailInput, {
            props: {
                isPlaintext: true,
                readonly: true,
                value: 'test@example.com'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
        expect(input.readOnly).toBe(true);
        expect(input.value).toBe('test@example.com');
    });

    test('handles required attribute', () => {
        const { container } = render(EmailInput, {
            props: {
                required: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('required');
        expect(input.required).toBe(true);
    });

    test('handles autocomplete attribute', () => {
        const { container } = render(EmailInput, {
            props: {
                autocomplete: 'email'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('autocomplete', 'email');
    });

    test('handles multiple attribute for multiple emails', () => {
        const { container } = render(EmailInput, {
            props: {
                multiple: true
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('multiple');
        expect(input.multiple).toBe(true);
    });

    test('handles maxlength attribute', () => {
        const { container } = render(EmailInput, {
            props: {
                maxlength: 50
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveAttribute('maxlength', '50');
    });

    test('combines validation classes with aria-invalid', () => {
        const { container } = render(EmailInput, {
            props: {
                isInvalid: true,
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="email"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-sm');
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });
});

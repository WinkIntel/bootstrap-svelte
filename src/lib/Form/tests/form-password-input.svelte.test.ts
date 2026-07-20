/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import PasswordInput from '../form-password-input.svelte';

describe('Form.PasswordInput', () => {
    test('renders input with type password and base class by default', () => {
        const { container } = render(PasswordInput);
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
    });

    test('renders input with type text when showPassword is true', () => {
        const { container } = render(PasswordInput, {
            props: {
                showPassword: true
            }
        });
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
    });

    test('renders input with type password when showPassword is false', () => {
        const { container } = render(PasswordInput, {
            props: {
                showPassword: false
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
    });

    test('renders input with type password when showPassword is undefined', () => {
        const { container } = render(PasswordInput);
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(PasswordInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(PasswordInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveClass('is-valid');
    });

    test('does not apply is-valid class when isValid is undefined', () => {
        const { container } = render(PasswordInput);
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(PasswordInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveClass('is-invalid');
    });

    test('does not apply is-invalid class when isInvalid is undefined', () => {
        const { container } = render(PasswordInput);
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(PasswordInput, {
            props: {
                isValid: true,
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        // Both flags operate independently now: both classes should be present when both are true
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(PasswordInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        // Validation flags are independent: false/undefined should not add validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies form-control-plaintext class when isPlaintext is true', () => {
        const { container } = render(PasswordInput, {
            props: {
                isPlaintext: true
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('applies form-control class when isPlaintext is false', () => {
        const { container } = render(PasswordInput, {
            props: {
                isPlaintext: false
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies form-control class when isPlaintext is undefined', () => {
        const { container } = render(PasswordInput);
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies sizing class when sizing is sm', () => {
        const { container } = render(PasswordInput, {
            props: {
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-sm');
    });

    test('applies sizing class when sizing is lg', () => {
        const { container } = render(PasswordInput, {
            props: {
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(PasswordInput);
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('sets value when provided', () => {
        const { container } = render(PasswordInput, {
            props: {
                value: 'myP@55w0rd'
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input.value).toBe('myP@55w0rd');
    });

    test('has empty value when value is undefined', () => {
        const { container } = render(PasswordInput);
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input.value).toBe('');
    });

    test('sets default autocomplete to off', () => {
        const { container } = render(PasswordInput);
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveAttribute('autocomplete', 'off');
    });

    test('forwards custom autoComplete prop', () => {
        const { container } = render(PasswordInput, {
            props: {
                autocomplete: 'current-password'
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveAttribute('autocomplete', 'current-password');
    });

    test('forwards autocomplete values correctly', () => {
        const autocompleteValues = ['current-password', 'new-password', 'off', 'on'] as const;

        autocompleteValues.forEach((value) => {
            const { container } = render(PasswordInput, {
                props: {
                    autocomplete: value
                }
            });
            const input = container.querySelector('input') as HTMLInputElement;
            expect(input).toHaveAttribute('autocomplete', value);
        });
    });

    test('forwards id, name, and title props to input', () => {
        const { container } = render(PasswordInput, {
            props: {
                id: 'passwordDefault',
                name: 'passwordDefault',
                title: 'Set a password'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('id', 'passwordDefault');
        expect(input).toHaveAttribute('name', 'passwordDefault');
        expect(input).toHaveAttribute('title', 'Set a password');
    });

    test('forwards accessibility attributes to input', () => {
        const { container } = render(PasswordInput, {
            props: {
                'aria-label': 'Custom password input label',
                'aria-describedby': 'help-text'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-label', 'Custom password input label');
        expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('forwards disabled attribute to input', () => {
        const { container } = render(PasswordInput, {
            props: {
                disabled: true
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('disabled');
        expect(input.disabled).toBe(true);
    });

    test('forwards readonly attribute to input', () => {
        const { container } = render(PasswordInput, {
            props: {
                readonly: true
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('readonly');
        expect(input.readOnly).toBe(true);
    });

    test('forwards placeholder attribute to input', () => {
        const { container } = render(PasswordInput, {
            props: {
                placeholder: 'Enter your password'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('placeholder', 'Enter your password');
    });

    test('forwards data attributes to input', () => {
        const { container } = render(PasswordInput, {
            props: {
                'data-testid': 'password-test',
                'data-custom': 'custom-value'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('data-testid', 'password-test');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });

    test('applies multiple conditional classes together', () => {
        const { container } = render(PasswordInput, {
            props: {
                class: 'custom-class',
                isValid: true,
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('form-control-lg');
    });

    test('applies plaintext with validation and sizing together', () => {
        const { container } = render(PasswordInput, {
            props: {
                class: 'custom-plaintext',
                isPlaintext: true,
                isInvalid: true,
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveClass('form-control-plaintext');
        expect(input).toHaveClass('custom-plaintext');
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control');
    });

    test('password type changes based on showPassword prop', () => {
        // Test with showPassword false
        const { container: container1 } = render(PasswordInput, {
            props: {
                showPassword: false,
                value: 'secret123'
            }
        });

        const passwordInput = container1.querySelector('input[type="password"]') as HTMLInputElement;
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput.value).toBe('secret123');
        expect(container1.querySelector('input[type="text"]')).toBeNull();

        // Test with showPassword true
        const { container: container2 } = render(PasswordInput, {
            props: {
                showPassword: true,
                value: 'secret123'
            }
        });

        const textInput = container2.querySelector('input[type="text"]') as HTMLInputElement;
        expect(textInput).toBeInTheDocument();
        expect(textInput.value).toBe('secret123');
        expect(container2.querySelector('input[type="password"]')).toBeNull();
    });

    test('handles complete password input configuration', () => {
        const { container } = render(PasswordInput, {
            props: {
                class: 'test-password-input',
                value: 'mySecureP@ssw0rd',
                autocomplete: 'new-password',
                isValid: true,
                sizing: 'lg',
                id: 'complexPassword',
                title: 'Complex password input',
                placeholder: 'Enter secure password',
                showPassword: false
            }
        });
        const input = container.querySelector('input[type="password"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('test-password-input');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('form-control-lg');
        expect(input.value).toBe('mySecureP@ssw0rd');
        expect(input).toHaveAttribute('autocomplete', 'new-password');
        expect(input).toHaveAttribute('id', 'complexPassword');
        expect(input).toHaveAttribute('title', 'Complex password input');
        expect(input).toHaveAttribute('placeholder', 'Enter secure password');
        expect(input.type).toBe('password');
    });

    test('handles password visibility toggle with all features', () => {
        const { container } = render(PasswordInput, {
            props: {
                class: 'visibility-test',
                value: 'testPassword123!',
                autocomplete: 'current-password',
                isInvalid: true,
                sizing: 'sm',
                showPassword: true,
                placeholder: 'Current password'
            }
        });
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('visibility-test');
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('form-control-sm');
        expect(input.value).toBe('testPassword123!');
        expect(input).toHaveAttribute('autocomplete', 'current-password');
        expect(input).toHaveAttribute('placeholder', 'Current password');
        expect(input.type).toBe('text');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(PasswordInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(PasswordInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(PasswordInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(PasswordInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

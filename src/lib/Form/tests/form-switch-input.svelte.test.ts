/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import SwitchInput from '../form-switch-input.svelte';

// Form.SwitchInput tests: cover all props and key behaviors

describe('Form.SwitchInput', () => {
    test('renders an input[type=checkbox] with role="switch" and base class', () => {
        const { container } = render(SwitchInput);
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'checkbox');
        expect(input).toHaveAttribute('role', 'switch');
        expect(input).toHaveClass('form-check-input');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(SwitchInput, { props: { class: 'custom-class another-class' } });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveClass('form-check-input');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('no validation classes by default', () => {
        const { container } = render(SwitchInput);
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).not.toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('applies is-valid when isValid is true', () => {
        const { container } = render(SwitchInput, { props: { isValid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(SwitchInput, { props: { isValid: false } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid when isInvalid is true', () => {
        const { container } = render(SwitchInput, { props: { isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(SwitchInput, { props: { isValid: true, isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('unchecked by default when checked is undefined', () => {
        const { container } = render(SwitchInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.checked).toBe(false);
    });

    test('respects checked=true and checked=false props', () => {
        let result = render(SwitchInput, { props: { checked: true } });
        let input = result.container.querySelector('input') as HTMLInputElement;
        expect(input.checked).toBe(true);
        result.unmount();

        result = render(SwitchInput, { props: { checked: false } });
        input = result.container.querySelector('input') as HTMLInputElement;
        expect(input.checked).toBe(false);
        result.unmount();
    });

    test('toggles on click (bind:checked)', async () => {
        const { container } = render(SwitchInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.checked).toBe(false);
        await fireEvent.click(input);
        expect(input.checked).toBe(true);
    });

    test('forwards standard attributes (id, name, aria-label, disabled, title, value)', () => {
        const { container } = render(SwitchInput, {
            props: {
                id: 'switchDefault',
                name: 'switchDefault',
                'aria-label': 'Default switch',
                disabled: true,
                title: 'Toggle me',
                value: 'yes'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('id', 'switchDefault');
        expect(input).toHaveAttribute('name', 'switchDefault');
        expect(input).toHaveAttribute('aria-label', 'Default switch');
        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('title', 'Toggle me');
        expect(input).toHaveAttribute('value', 'yes');
    });

    test('forwards data attributes', () => {
        const { container } = render(SwitchInput, { props: { 'data-testid': 'switch-test', 'data-x': '1' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('data-testid', 'switch-test');
        expect(input).toHaveAttribute('data-x', '1');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(SwitchInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(SwitchInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(SwitchInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(SwitchInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

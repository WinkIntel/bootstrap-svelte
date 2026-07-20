/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import ColorInput from '../form-color-input.svelte';
import ColorInputBindingTest from './form-color-input-binding-test.svelte';

describe('Form.ColorInput', () => {
    test('renders input with type color and base classes', () => {
        const { container } = render(ColorInput);
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-color');
    });

    test('merges custom classes with base classes', () => {
        const { container } = render(ColorInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-color');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(ColorInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveClass('is-valid');
    });

    test('does not apply is-valid class when isValid is undefined', () => {
        const { container } = render(ColorInput);
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(ColorInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveClass('is-invalid');
    });

    test('does not apply is-invalid class when isInvalid is undefined', () => {
        const { container } = render(ColorInput);
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(ColorInput, {
            props: {
                isValid: true,
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        // Both flags operate independently now: both classes should be present when both are true
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(ColorInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        // Validation flags are independent: false/undefined should not add validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies small sizing class when sizing is sm', () => {
        const { container } = render(ColorInput, {
            props: {
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-sm');
    });

    test('applies large sizing class when sizing is lg', () => {
        const { container } = render(ColorInput, {
            props: {
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(ColorInput);
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('sets value when provided', () => {
        const { container } = render(ColorInput, {
            props: {
                value: '#563d7c'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input.value).toBe('#563d7c');
    });

    test('has default black value when value is undefined', () => {
        const { container } = render(ColorInput);
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        // HTML color inputs default to black (#000000) when no value is provided
        expect(input.value).toBe('#000000');
    });

    test('does not render a value attribute while syncing the input value property', () => {
        const { container } = render(ColorInput, {
            props: {
                value: '#563d7c'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).not.toHaveAttribute('value');
        expect(input.value).toBe('#563d7c');
    });

    test('updates the input value when the value prop changes after mount', async () => {
        const { container, rerender } = render(ColorInput, {
            props: {
                value: '#111111'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input.value).toBe('#111111');

        await rerender({
            value: '#222222'
        });

        expect(input.value).toBe('#222222');
    });

    test('propagates user-selected colors through bind:value', async () => {
        render(ColorInputBindingTest);
        const input = screen.getByTestId('color-input') as HTMLInputElement;

        await fireEvent.input(input, {
            target: {
                value: '#123456'
            }
        });

        expect(input.value).toBe('#123456');
        expect(screen.getByTestId('bound-value')).toHaveTextContent('#123456');
        expect(screen.getByTestId('input-calls')).toHaveTextContent('1');
        expect(screen.getByTestId('observed-color')).toHaveTextContent('#123456');
    });

    test('accepts a null input handler', async () => {
        const { container } = render(ColorInput, { props: { oninput: null } as never });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        await expect(fireEvent.input(input, { target: { value: '#123456' } })).resolves.toBe(true);
    });

    test('does not allow rest props to replace color type or validation aria state', () => {
        const { container } = render(ColorInput, { props: { isInvalid: true, type: 'text', 'aria-invalid': 'false' } as never });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('type', 'color');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('syncs parent-driven bound value changes into the input property', async () => {
        render(ColorInputBindingTest);
        const input = screen.getByTestId('color-input') as HTMLInputElement;

        expect(input.value).toBe('#563d7c');

        await fireEvent.click(screen.getByTestId('set-accent'));

        expect(input.value).toBe('#ff5722');
        expect(screen.getByTestId('bound-value')).toHaveTextContent('#ff5722');
    });

    test('normalizes an empty bound value to black for the DOM input', async () => {
        render(ColorInputBindingTest);
        const input = screen.getByTestId('color-input') as HTMLInputElement;

        await fireEvent.click(screen.getByTestId('clear-color'));

        expect(screen.getByTestId('bound-value')).toHaveTextContent('empty');
        expect(input.value).toBe('#000000');
    });

    test('binds elementRef to the rendered color input', async () => {
        render(ColorInputBindingTest);

        await waitFor(() => {
            expect(screen.getByTestId('bound-element-type')).toHaveTextContent('color');
        });
    });

    test('forwards id attribute to input', () => {
        const { container } = render(ColorInput, {
            props: {
                id: 'color-picker'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveAttribute('id', 'color-picker');
    });

    test('forwards name attribute to input', () => {
        const { container } = render(ColorInput, {
            props: {
                name: 'theme-color'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveAttribute('name', 'theme-color');
    });

    test('forwards disabled attribute to input', () => {
        const { container } = render(ColorInput, {
            props: {
                disabled: true
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveAttribute('disabled');
        expect(input.disabled).toBe(true);
    });

    test('forwards accessibility attributes to input', () => {
        const { container } = render(ColorInput, {
            props: {
                'aria-label': 'Color picker',
                'aria-describedby': 'color-help'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-label', 'Color picker');
        expect(input).toHaveAttribute('aria-describedby', 'color-help');
    });

    test('forwards data attributes to input', () => {
        const { container } = render(ColorInput, {
            props: {
                'data-testid': 'color-input',
                'data-custom': 'custom-value'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveAttribute('data-testid', 'color-input');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });

    test('forwards title attribute to input', () => {
        const { container } = render(ColorInput, {
            props: {
                title: 'Choose your color'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveAttribute('title', 'Choose your color');
    });

    test('keeps component-controlled attributes from being overridden by rest props', () => {
        const { container } = render(ColorInput, {
            props: {
                type: 'text',
                'aria-invalid': 'false',
                isInvalid: true
            } as never
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('type', 'color');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('combines sizing with validation classes', () => {
        const { container } = render(ColorInput, {
            props: {
                sizing: 'lg',
                isValid: true
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-color');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveClass('is-valid');
    });

    test('combines sizing with custom classes', () => {
        const { container } = render(ColorInput, {
            props: {
                sizing: 'sm',
                class: 'custom-color-picker'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-color');
        expect(input).toHaveClass('form-control-sm');
        expect(input).toHaveClass('custom-color-picker');
    });

    test('accepts valid hex color values', () => {
        const testColors = ['#000000', '#ffffff', '#563d7c', '#ff5722', '#4caf50'];

        testColors.forEach((color) => {
            const { container } = render(ColorInput, {
                props: {
                    value: color
                }
            });
            const input = container.querySelector('input[type="color"]') as HTMLInputElement;

            expect(input.value).toBe(color);
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
            const { container } = render(ColorInput, {
                props: {
                    isValid,
                    isInvalid
                }
            });
            const input = container.querySelector('input[type="color"]') as HTMLInputElement;

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
        const { container } = render(ColorInput, {
            props: {
                id: 'theme-color',
                name: 'themeColor',
                value: '#563d7c',
                sizing: 'lg',
                isValid: true,
                disabled: false,
                title: 'Choose theme color',
                class: 'custom-color-input',
                'data-testid': 'theme-color-picker'
            }
        });
        const input = container.querySelector('input[type="color"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-color');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('custom-color-input');
        expect(input).toHaveAttribute('id', 'theme-color');
        expect(input).toHaveAttribute('name', 'themeColor');
        expect(input).toHaveAttribute('title', 'Choose theme color');
        expect(input).toHaveAttribute('data-testid', 'theme-color-picker');
        expect(input.value).toBe('#563d7c');
        expect(input.disabled).toBe(false);
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(ColorInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(ColorInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(ColorInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(ColorInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

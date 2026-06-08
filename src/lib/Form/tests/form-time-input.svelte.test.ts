/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import TimeInput from '../form-time-input.svelte';

// Tests for Form.TimeInput covering all props and behaviors

describe('Form.TimeInput', () => {
    test('renders input[type=time] with base class', () => {
        const { container } = render(TimeInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'time');
        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(TimeInput, { props: { class: 'custom-class another-class' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('plaintext mode toggles classes', () => {
        const { container } = render(TimeInput, { props: { isPlaintext: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('no validation classes by default', () => {
        const { container } = render(TimeInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('applies is-valid when isValid is true', () => {
        const { container } = render(TimeInput, { props: { isValid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(TimeInput, { props: { isValid: false } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid when isInvalid is true', () => {
        const { container } = render(TimeInput, { props: { isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(TimeInput, { props: { isValid: true, isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('applies sizing classes when sizing set', () => {
        let res = render(TimeInput, { props: { sizing: 'sm' } });
        let input = res.container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-sm');
        res.unmount();

        res = render(TimeInput, { props: { sizing: 'lg' } });
        input = res.container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-lg');
        res.unmount();

        const { container } = render(TimeInput);
        input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('value binding: sets value when provided, empty when undefined', () => {
        let res = render(TimeInput, { props: { value: '07:32' } });
        let input = res.container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('07:32');
        res.unmount();

        res = render(TimeInput);
        input = res.container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('');
    });

    test('forwards common attributes (id, name, min, max, step, list, aria-label)', () => {
        const { container } = render(TimeInput, {
            props: {
                id: 'timeId',
                name: 'time',
                min: '00:00',
                max: '12:00',
                step: 60,
                list: 'listOfTimes',
                'aria-label': 'Time'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('id', 'timeId');
        expect(input).toHaveAttribute('name', 'time');
        expect(input).toHaveAttribute('min', '00:00');
        expect(input).toHaveAttribute('max', '12:00');
        expect(input).toHaveAttribute('step', '60');
        expect(input).toHaveAttribute('list', 'listOfTimes');
        expect(input).toHaveAttribute('aria-label', 'Time');
    });

    test('forwards disabled, readonly, required, title', () => {
        const { container } = render(TimeInput, {
            props: {
                disabled: true,
                readonly: true,
                required: true,
                title: 'Pick a time'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('readonly');
        expect(input).toHaveAttribute('required');
        expect(input).toHaveAttribute('title', 'Pick a time');
    });

    test('forwards data attributes', () => {
        const { container } = render(TimeInput, { props: { 'data-testid': 'time', 'data-custom': 'x' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('data-testid', 'time');
        expect(input).toHaveAttribute('data-custom', 'x');
    });

    test('binds elementRef to input element', () => {
        const { container } = render(TimeInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(input).toBeInTheDocument();
    });

    test('handles a complete configuration', () => {
        const { container } = render(TimeInput, {
            props: {
                class: 'time-input',
                isValid: true,
                sizing: 'lg',
                id: 'fullTime',
                name: 'full-time',
                'aria-label': 'Full Time',
                min: '06:00',
                max: '18:00',
                step: 300,
                value: '07:32'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('time-input');
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveAttribute('id', 'fullTime');
        expect(input).toHaveAttribute('name', 'full-time');
        expect(input).toHaveAttribute('aria-label', 'Full Time');
        expect(input).toHaveAttribute('min', '06:00');
        expect(input).toHaveAttribute('max', '18:00');
        expect(input).toHaveAttribute('step', '300');
        expect(input.value).toBe('07:32');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(TimeInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(TimeInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(TimeInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(TimeInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

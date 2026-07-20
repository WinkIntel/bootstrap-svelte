/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import WeekInput from '../form-week-Input.svelte';

// Tests for Form.WeekInput covering all props and behaviors

describe('Form.WeekInput', () => {
    test('renders input[type=week] with base class', () => {
        const { container } = render(WeekInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'week');
        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(WeekInput, { props: { class: 'custom-class another-class' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('plaintext mode toggles classes', () => {
        const { container } = render(WeekInput, { props: { isPlaintext: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('no validation classes by default', () => {
        const { container } = render(WeekInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('applies is-valid when isValid is true', () => {
        const { container } = render(WeekInput, { props: { isValid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(WeekInput, { props: { isValid: false } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid when isInvalid is true', () => {
        const { container } = render(WeekInput, { props: { isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(WeekInput, { props: { isValid: true, isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('applies sizing classes when sizing set', () => {
        let res = render(WeekInput, { props: { sizing: 'sm' } });
        let input = res.container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-sm');
        res.unmount();

        res = render(WeekInput, { props: { sizing: 'lg' } });
        input = res.container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-lg');
        res.unmount();

        const { container } = render(WeekInput);
        input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('value binding: sets value when provided, empty when undefined', () => {
        let res = render(WeekInput, { props: { value: '2025-W07' } });
        let input = res.container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('2025-W07');
        res.unmount();

        res = render(WeekInput);
        input = res.container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('');
    });

    test('forwards common attributes (id, name, min, max, step, list, aria-label)', () => {
        const { container } = render(WeekInput, {
            props: {
                id: 'weekId',
                name: 'week',
                min: '2025-W01',
                max: '2025-W52',
                step: 1,
                list: 'listOfWeeks',
                'aria-label': 'Week'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('id', 'weekId');
        expect(input).toHaveAttribute('name', 'week');
        expect(input).toHaveAttribute('min', '2025-W01');
        expect(input).toHaveAttribute('max', '2025-W52');
        expect(input).toHaveAttribute('step', '1');
        expect(input).toHaveAttribute('list', 'listOfWeeks');
        expect(input).toHaveAttribute('aria-label', 'Week');
    });

    test('forwards disabled, readonly, required, title', () => {
        const { container } = render(WeekInput, {
            props: {
                disabled: true,
                readonly: true,
                required: true,
                title: 'Pick a week'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('readonly');
        expect(input).toHaveAttribute('required');
        expect(input).toHaveAttribute('title', 'Pick a week');
    });

    test('forwards data attributes', () => {
        const { container } = render(WeekInput, { props: { 'data-testid': 'week', 'data-custom': 'x' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('data-testid', 'week');
        expect(input).toHaveAttribute('data-custom', 'x');
    });

    test('handles a complete configuration', () => {
        const { container } = render(WeekInput, {
            props: {
                class: 'week-input',
                isValid: true,
                sizing: 'lg',
                id: 'fullWeek',
                name: 'full-week',
                'aria-label': 'Full Week',
                min: '2025-W01',
                max: '2025-W52',
                step: 1,
                value: '2025-W07'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('week-input');
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveAttribute('id', 'fullWeek');
        expect(input).toHaveAttribute('name', 'full-week');
        expect(input).toHaveAttribute('aria-label', 'Full Week');
        expect(input).toHaveAttribute('min', '2025-W01');
        expect(input).toHaveAttribute('max', '2025-W52');
        expect(input).toHaveAttribute('step', '1');
        expect(input.value).toBe('2025-W07');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(WeekInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(WeekInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(WeekInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(WeekInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import RangeInput from '../form-range-input.svelte';

describe('Form.RangeInput', () => {
    test('renders input with type range and base class', () => {
        const { container } = render(RangeInput);
        const input = container.querySelector('input[type="range"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-range');
        expect(input).toHaveAttribute('type', 'range');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(RangeInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="range"]') as HTMLInputElement;

        expect(input).toHaveClass('form-range');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('binds value when provided as number', () => {
        const { container } = render(RangeInput, {
            props: {
                value: 3
            }
        });
        const input = container.querySelector('input[type="range"]') as HTMLInputElement;

        expect(input.value).toBe('3');
        expect(input.valueAsNumber).toBe(3);
    });

    test('uses default browser value when value is undefined', () => {
        const { container } = render(RangeInput);
        const input = container.querySelector('input[type="range"]') as HTMLInputElement;

        // HTML range inputs default to 50 when no value/min/max provided
        expect(input.value).toBe('50');
        expect(input.valueAsNumber).toBe(50);
    });

    test('forwards min, max, and step attributes', () => {
        const { container } = render(RangeInput, {
            props: {
                min: 0,
                max: 5,
                step: 0.5
            }
        });
        const input = container.querySelector('input[type="range"]') as HTMLInputElement;

        expect(input).toHaveAttribute('min', '0');
        expect(input).toHaveAttribute('max', '5');
        expect(input).toHaveAttribute('step', '0.5');
    });

    test('forwards id, name, and title props', () => {
        const { container } = render(RangeInput, {
            props: {
                id: 'rangeDefault',
                name: 'rangeDefault',
                title: 'Set a number'
            }
        });
        const input = container.querySelector('input[type="range"]') as HTMLInputElement;

        expect(input).toHaveAttribute('id', 'rangeDefault');
        expect(input).toHaveAttribute('name', 'rangeDefault');
        expect(input).toHaveAttribute('title', 'Set a number');
    });

    test('forwards accessibility attributes', () => {
        const { container } = render(RangeInput, {
            props: {
                'aria-label': 'Custom range input label',
                'aria-describedby': 'help-text'
            }
        });
        const input = container.querySelector('input[type="range"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-label', 'Custom range input label');
        expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('forwards disabled and readonly attributes', () => {
        const { container } = render(RangeInput, {
            props: {
                disabled: true,
                readonly: true
            }
        });
        const input = container.querySelector('input[type="range"]') as HTMLInputElement;

        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('readonly');
        expect(input.readOnly).toBe(true);
    });

    test('forwards list and data attributes', () => {
        const { container } = render(RangeInput, {
            props: {
                list: 'tickmarks',
                'data-testid': 'range-test',
                'data-custom': 'custom-value'
            }
        });
        const input = container.querySelector('input[type="range"]') as HTMLInputElement;

        expect(input).toHaveAttribute('list', 'tickmarks');
        expect(input).toHaveAttribute('data-testid', 'range-test');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });
});

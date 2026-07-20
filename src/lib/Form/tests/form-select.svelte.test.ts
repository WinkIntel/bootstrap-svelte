/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import Select from '../form-select.svelte';
import type { Form } from '../index.js';

const renderSelectWithOptions = (optionsHtml: string = '', props: Form.SelectProps = {}) => {
    return render(Select, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => optionsHtml
            }))
        }
    });
};

describe('Form.Select', () => {
    test('renders select element with base class', () => {
        const { container } = render(Select);
        const select = container.querySelector('select') as HTMLSelectElement;

        expect(select).toBeInTheDocument();
        expect(select).toHaveClass('form-select');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(Select, { props: { class: 'custom-class another-class' } });
        const select = container.querySelector('select') as HTMLSelectElement;

        expect(select).toHaveClass('form-select');
        expect(select).toHaveClass('custom-class');
        expect(select).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(Select, { props: { isValid: true } });
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select).toHaveClass('is-valid');
    });

    test('does not apply validation classes when undefined', () => {
        const { container } = render(Select);
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select).not.toHaveClass('is-valid');
        expect(select).not.toHaveClass('is-invalid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(Select, { props: { isInvalid: true } });
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select).toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(Select, { props: { isValid: true, isInvalid: true } });
        const select = container.querySelector('select') as HTMLSelectElement;
        // Both flags operate independently now: both classes should be present when both are true
        expect(select).toHaveClass('is-invalid');
        expect(select).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(Select, { props: { isValid: false } });
        const select = container.querySelector('select') as HTMLSelectElement;
        // Validation flags are independent: false/undefined should not add validation classes
        expect(select).not.toHaveClass('is-invalid');
        expect(select).not.toHaveClass('is-valid');
    });

    test('applies sizing class when sizing is sm', () => {
        const { container } = render(Select, { props: { sizing: 'sm' } });
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select).toHaveClass('form-select-sm');
    });

    test('applies sizing class when sizing is lg', () => {
        const { container } = render(Select, { props: { sizing: 'lg' } });
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select).toHaveClass('form-select-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(Select);
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select).not.toHaveClass('form-select-sm');
        expect(select).not.toHaveClass('form-select-lg');
    });

    test('renders children options correctly', () => {
        // Note: Snippet child content renders a single root; pass one option
        const { container } = renderSelectWithOptions('<option value="1">One</option>');
        const select = container.querySelector('select') as HTMLSelectElement;
        const opt1 = select.querySelector('option[value="1"]');
        expect(opt1).toBeInTheDocument();
        expect(opt1).toHaveTextContent('One');
    });

    test('binds value when provided and option exists', () => {
        const { container } = renderSelectWithOptions('<option value="2">Two</option>', {
            value: '2'
        });
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select.value).toBe('2');
        const selected = select.querySelector('option:checked') as HTMLOptionElement;
        expect(selected).toBeInTheDocument();
        expect(selected.value).toBe('2');
    });

    test('has empty value when value is undefined and no options', () => {
        const { container } = render(Select);
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select.value).toBe('');
    });

    test('forwards id, name, and aria-label props', () => {
        const { container } = render(Select, { props: { id: 'selectDefault', name: 'selectDefault', 'aria-label': 'Default select example' } });
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select).toHaveAttribute('id', 'selectDefault');
        expect(select).toHaveAttribute('name', 'selectDefault');
        expect(select).toHaveAttribute('aria-label', 'Default select example');
    });

    test('forwards disabled, multiple, and size attributes', () => {
        const { container } = render(Select, { props: { disabled: true, multiple: true, size: 3 } });
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select).toBeDisabled();
        expect(select).toHaveAttribute('multiple');
        expect(select.multiple).toBe(true);
        expect(select).toHaveAttribute('size', '3');
    });

    test('forwards data attributes to select', () => {
        const { container } = render(Select, { props: { 'data-testid': 'select-test', 'data-custom': 'custom-value' } });
        const select = container.querySelector('select') as HTMLSelectElement;
        expect(select).toHaveAttribute('data-testid', 'select-test');
        expect(select).toHaveAttribute('data-custom', 'custom-value');
    });

    test('handles complete select configuration', () => {
        const { container } = renderSelectWithOptions('<option value="1">One</option>', {
            class: 'test-select',
            value: '1',
            isValid: true,
            sizing: 'lg',
            id: 'complexSelect',
            name: 'complex-select',
            'aria-label': 'Complex select'
        });
        const select = container.querySelector('select') as HTMLSelectElement;

        expect(select).toHaveClass('form-select');
        expect(select).toHaveClass('test-select');
        expect(select).toHaveClass('is-valid');
        expect(select).toHaveClass('form-select-lg');
        expect(select.value).toBe('1');
        expect(select).toHaveAttribute('id', 'complexSelect');
        expect(select).toHaveAttribute('name', 'complex-select');
        expect(select).toHaveAttribute('aria-label', 'Complex select');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(Select, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('select') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(Select, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('select') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(Select);

        const field = container.querySelector('select') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(Select, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('select') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

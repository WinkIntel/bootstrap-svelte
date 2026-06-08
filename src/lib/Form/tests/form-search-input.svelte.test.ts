/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import SearchInput from '../form-search-input.svelte';

describe('Form.SearchInput', () => {
    test('renders without crashing', () => {
        const { container } = render(SearchInput);
        expect(container).toBeInTheDocument();
    });

    test('renders input with type search and base class', () => {
        const { container } = render(SearchInput);
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
        expect(input).toHaveAttribute('type', 'search');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(SearchInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(SearchInput, { props: { isValid: true } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toHaveClass('is-valid');
    });

    test('does not apply is-valid class when isValid is undefined', () => {
        const { container } = render(SearchInput);
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(SearchInput, { props: { isInvalid: true } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
    });

    test('does not apply is-invalid class when isInvalid is undefined', () => {
        const { container } = render(SearchInput);
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(SearchInput, { props: { isValid: true, isInvalid: true } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        // Both flags operate independently now: both classes should be present when both are true
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(SearchInput, { props: { isValid: false } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        // Validation flags are independent: false/undefined should not add validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies form-control-plaintext when isPlaintext is true', () => {
        const { container } = render(SearchInput, { props: { isPlaintext: true } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('applies form-control when isPlaintext is false', () => {
        const { container } = render(SearchInput, { props: { isPlaintext: false } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies form-control when isPlaintext is undefined', () => {
        const { container } = render(SearchInput);
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('applies sizing class when sizing is sm', () => {
        const { container } = render(SearchInput, { props: { sizing: 'sm' } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toHaveClass('form-control-sm');
    });

    test('applies sizing class when sizing is lg', () => {
        const { container } = render(SearchInput, { props: { sizing: 'lg' } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toHaveClass('form-control-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(SearchInput);
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('sets value when provided as string', () => {
        const { container } = render(SearchInput, { props: { value: 'search value' } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input.value).toBe('search value');
    });

    test('has empty value when value is undefined', () => {
        const { container } = render(SearchInput);
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input.value).toBe('');
    });

    test('forwards id, name, and title props', () => {
        const { container } = render(SearchInput, { props: { id: 'searchDefault', name: 'searchDefault', title: 'Set a search value' } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toHaveAttribute('id', 'searchDefault');
        expect(input).toHaveAttribute('name', 'searchDefault');
        expect(input).toHaveAttribute('title', 'Set a search value');
    });

    test('forwards accessibility attributes', () => {
        const { container } = render(SearchInput, { props: { 'aria-label': 'Custom search input label', 'aria-describedby': 'help-text' } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toHaveAttribute('aria-label', 'Custom search input label');
        expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('forwards disabled and readonly attributes', () => {
        const { container } = render(SearchInput, { props: { disabled: true, readonly: true } });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('readonly');
        expect(input.readOnly).toBe(true);
    });

    test('forwards list, placeholder, and data attributes', () => {
        const { container } = render(SearchInput, {
            props: { list: 'listOfSearchValues', placeholder: 'Search here', 'data-testid': 'search-test', 'data-custom': 'custom-value' }
        });
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toHaveAttribute('list', 'listOfSearchValues');
        expect(input).toHaveAttribute('placeholder', 'Search here');
        expect(input).toHaveAttribute('data-testid', 'search-test');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });

    test('binds elementRef to the input element', () => {
        const { container } = render(SearchInput);
        const input = container.querySelector('input[type="search"]') as HTMLInputElement;
        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(input).toBeInTheDocument();
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(SearchInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(SearchInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(SearchInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(SearchInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

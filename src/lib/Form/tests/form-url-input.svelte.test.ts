/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import UrlInput from '../form-url-input.svelte';

// Tests for Form.UrlInput covering all props and behaviors

describe('Form.UrlInput', () => {
    test('renders input[type=url] with base class', () => {
        const { container } = render(UrlInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'url');
        expect(input).toHaveClass('form-control');
        expect(input).not.toHaveClass('form-control-plaintext');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(UrlInput, { props: { class: 'custom-class another-class' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('plaintext mode toggles classes', () => {
        const { container } = render(UrlInput, { props: { isPlaintext: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-plaintext');
        expect(input).not.toHaveClass('form-control');
    });

    test('no validation classes by default', () => {
        const { container } = render(UrlInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('applies is-valid when isValid is true', () => {
        const { container } = render(UrlInput, { props: { isValid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-valid');
        expect(input).not.toHaveClass('is-invalid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(UrlInput, { props: { isValid: false } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid when isInvalid is true', () => {
        const { container } = render(UrlInput, { props: { isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(UrlInput, { props: { isValid: true, isInvalid: true } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('applies sizing classes when sizing set', () => {
        let res = render(UrlInput, { props: { sizing: 'sm' } });
        let input = res.container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-sm');
        res.unmount();

        res = render(UrlInput, { props: { sizing: 'lg' } });
        input = res.container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('form-control-lg');
        res.unmount();

        const { container } = render(UrlInput);
        input = container.querySelector('input') as HTMLInputElement;
        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('value binding: sets value when provided, empty when undefined', () => {
        let res = render(UrlInput, { props: { value: 'https://example.com' } });
        let input = res.container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('https://example.com');
        res.unmount();

        res = render(UrlInput);
        input = res.container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('');
    });

    test('forwards common attributes (id, name, placeholder, pattern, inputmode, autocomplete, list, aria-label)', () => {
        const { container } = render(UrlInput, {
            props: {
                id: 'urlId',
                name: 'url',
                placeholder: 'https://example.com',
                pattern: 'https://.*',
                inputmode: 'url',
                autocomplete: 'on',
                list: 'listOfUrls',
                'aria-label': 'URL'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('id', 'urlId');
        expect(input).toHaveAttribute('name', 'url');
        expect(input).toHaveAttribute('placeholder', 'https://example.com');
        expect(input).toHaveAttribute('pattern', 'https://.*');
        expect(input).toHaveAttribute('inputmode', 'url');
        expect(input).toHaveAttribute('autocomplete', 'on');
        expect(input).toHaveAttribute('list', 'listOfUrls');
        expect(input).toHaveAttribute('aria-label', 'URL');
    });

    test('forwards disabled, readonly, required, minlength, maxlength, and title', () => {
        const { container } = render(UrlInput, {
            props: {
                disabled: true,
                readonly: true,
                required: true,
                minlength: 5,
                maxlength: 200,
                title: 'Enter a URL'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('readonly');
        expect(input).toHaveAttribute('required');
        expect(input).toHaveAttribute('minlength', '5');
        expect(input).toHaveAttribute('maxlength', '200');
        expect(input).toHaveAttribute('title', 'Enter a URL');
    });

    test('forwards data attributes', () => {
        const { container } = render(UrlInput, { props: { 'data-testid': 'url', 'data-custom': 'x' } });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveAttribute('data-testid', 'url');
        expect(input).toHaveAttribute('data-custom', 'x');
    });

    test('binds elementRef to input element', () => {
        const { container } = render(UrlInput);
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(input).toBeInTheDocument();
    });

    test('handles a complete configuration', () => {
        const { container } = render(UrlInput, {
            props: {
                class: 'url-input',
                isValid: true,
                sizing: 'lg',
                id: 'fullUrl',
                name: 'full-url',
                'aria-label': 'Full URL',
                placeholder: 'https://example.com',
                pattern: 'https://.*',
                inputmode: 'url',
                autocomplete: 'on',
                value: 'https://example.com/path'
            }
        });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toHaveClass('url-input');
        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveAttribute('id', 'fullUrl');
        expect(input).toHaveAttribute('name', 'full-url');
        expect(input).toHaveAttribute('aria-label', 'Full URL');
        expect(input).toHaveAttribute('placeholder', 'https://example.com');
        expect(input).toHaveAttribute('pattern', 'https://.*');
        expect(input).toHaveAttribute('inputmode', 'url');
        expect(input).toHaveAttribute('autocomplete', 'on');
        expect(input.value).toBe('https://example.com/path');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(UrlInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(UrlInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(UrlInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(UrlInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

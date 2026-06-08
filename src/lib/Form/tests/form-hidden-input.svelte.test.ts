import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FormHiddenInput from '../form-hidden-input.svelte';

describe('FormHiddenInput', () => {
    describe('Rendering', () => {
        it('should render an input element with type hidden', () => {
            render(FormHiddenInput);

            const hiddenInput = document.querySelector('input[type="hidden"]');
            expect(hiddenInput).toBeInTheDocument();
            expect(hiddenInput).toHaveAttribute('type', 'hidden');
        });

        it('should render without any visible content', () => {
            render(FormHiddenInput);

            const hiddenInput = document.querySelector('input[type="hidden"]');
            expect(hiddenInput).toBeInTheDocument();
            expect(hiddenInput).not.toBeVisible();
        });

        it('should not be focusable by default', () => {
            render(FormHiddenInput);

            const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
            expect(hiddenInput?.tabIndex).toBe(0);
            // Hidden inputs are not visible and effectively not focusable in normal tab order
            expect(hiddenInput).not.toBeVisible();
        });
    });

    describe('Value Handling', () => {
        it('should render with undefined value by default', () => {
            render(FormHiddenInput);

            const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('');
        });

        it('should render with string value when provided', () => {
            render(FormHiddenInput, { value: 'hidden-value' });

            const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('hidden-value');
        });

        it('should render with numeric value when provided', () => {
            render(FormHiddenInput, { value: 42 });

            const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('42');
        });

        it('should render with boolean value when provided', () => {
            render(FormHiddenInput, { value: true });

            const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('true');
        });

        it('should handle empty string value', () => {
            render(FormHiddenInput, { value: '' });

            const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('');
        });

        it('should handle null value', () => {
            render(FormHiddenInput, { value: null });

            const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('');
        });

        it('should handle zero value', () => {
            render(FormHiddenInput, { value: 0 });

            const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('0');
        });

        it('should handle false value', () => {
            render(FormHiddenInput, { value: false });

            const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('false');
        });
    });

    describe('Element Reference', () => {
        it('should handle elementRef prop without throwing', () => {
            expect(() => {
                render(FormHiddenInput, {});
            }).not.toThrow();
        });

        it('should handle null elementRef gracefully', () => {
            expect(() => {
                render(FormHiddenInput, { elementRef: null });
            }).not.toThrow();
        });
    });

    describe('Form Integration', () => {
        it('should support name attribute for form submission', () => {
            render(FormHiddenInput, { name: 'hidden-field' });

            const hiddenInput = document.querySelector('input[type="hidden"]');
            expect(hiddenInput).toHaveAttribute('name', 'hidden-field');
        });

        it('should support id attribute for identification', () => {
            render(FormHiddenInput, { id: 'hidden-input' });

            const hiddenInput = document.querySelector('#hidden-input');
            expect(hiddenInput).toBeInTheDocument();
            expect(hiddenInput).toHaveAttribute('id', 'hidden-input');
        });

        it('should support form attribute for form association', () => {
            render(FormHiddenInput, { form: 'my-form' });

            const hiddenInput = document.querySelector('input[type="hidden"]');
            expect(hiddenInput).toHaveAttribute('form', 'my-form');
        });

        it('should support disabled attribute', () => {
            render(FormHiddenInput, { disabled: true });

            const hiddenInput = document.querySelector('input[type="hidden"]');
            expect(hiddenInput).toHaveAttribute('disabled');
            expect(hiddenInput).toBeDisabled();
        });

        it('should support readonly attribute', () => {
            render(FormHiddenInput, { readonly: true });

            const hiddenInput = document.querySelector('input[type="hidden"]');
            expect(hiddenInput).toHaveAttribute('readonly');
        });
    });

    describe('Prop Forwarding', () => {
        it('should forward data attributes', () => {
            render(FormHiddenInput, { 'data-testid': 'hidden-input' });

            const hiddenInput = screen.getByTestId('hidden-input');
            expect(hiddenInput).toBeInTheDocument();
            expect(hiddenInput).toHaveAttribute('data-testid', 'hidden-input');
        });

        it('should forward custom attributes', () => {
            render(FormHiddenInput, { 'data-custom': 'hidden-value' });

            const hiddenInput = document.querySelector('[data-custom="hidden-value"]');
            expect(hiddenInput).toBeInTheDocument();
            expect(hiddenInput).toHaveAttribute('data-custom', 'hidden-value');
        });

        it('should forward multiple attributes', () => {
            render(FormHiddenInput, {
                'data-testid': 'hidden-input',
                'data-category': 'form-field',
                title: 'Hidden input field'
            });

            const hiddenInput = screen.getByTestId('hidden-input');
            expect(hiddenInput).toHaveAttribute('data-category', 'form-field');
            expect(hiddenInput).toHaveAttribute('title', 'Hidden input field');
        });

        it('should forward aria attributes', () => {
            render(FormHiddenInput, { 'aria-hidden': 'true' });

            const hiddenInput = document.querySelector('input[type="hidden"]');
            expect(hiddenInput).toHaveAttribute('aria-hidden', 'true');
        });

        it('should forward class attribute', () => {
            render(FormHiddenInput, { class: 'custom-hidden' });

            const hiddenInput = document.querySelector('.custom-hidden');
            expect(hiddenInput).toBeInTheDocument();
            expect(hiddenInput).toHaveClass('custom-hidden');
        });
    });

    describe('Use Cases', () => {
        it('should work for CSRF tokens', () => {
            render(FormHiddenInput, {
                name: '_token',
                value: 'abc123def456'
            });

            const hiddenInput = document.querySelector('input[name="_token"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('abc123def456');
        });

        it('should work for user IDs', () => {
            render(FormHiddenInput, {
                name: 'user_id',
                value: 12345
            });

            const hiddenInput = document.querySelector('input[name="user_id"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('12345');
        });

        it('should work for form state tracking', () => {
            render(FormHiddenInput, {
                name: 'form_step',
                value: 'step-2'
            });

            const hiddenInput = document.querySelector('input[name="form_step"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('step-2');
        });

        it('should work for tracking modified state', () => {
            render(FormHiddenInput, {
                name: 'is_modified',
                value: true
            });

            const hiddenInput = document.querySelector('input[name="is_modified"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('true');
        });

        it('should work for referrer URLs', () => {
            render(FormHiddenInput, {
                name: 'referrer',
                value: 'https://example.com/page'
            });

            const hiddenInput = document.querySelector('input[name="referrer"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('https://example.com/page');
        });
    });

    describe('Security Considerations', () => {
        it('should handle special characters safely', () => {
            render(FormHiddenInput, {
                name: 'data',
                value: '<script>alert("xss")</script>'
            });

            const hiddenInput = document.querySelector('input[name="data"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('<script>alert("xss")</script>');
            expect(hiddenInput?.type).toBe('hidden');
        });

        it('should handle HTML entities', () => {
            render(FormHiddenInput, {
                name: 'content',
                value: '&lt;div&gt;content&lt;/div&gt;'
            });

            const hiddenInput = document.querySelector('input[name="content"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('&lt;div&gt;content&lt;/div&gt;');
        });

        it('should handle quotes and apostrophes', () => {
            render(FormHiddenInput, {
                name: 'text',
                value: `It's a "test" with 'quotes'`
            });

            const hiddenInput = document.querySelector('input[name="text"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe(`It's a "test" with 'quotes'`);
        });
    });

    describe('Edge Cases', () => {
        it('should handle very long values', () => {
            const longValue = 'a'.repeat(1000);
            render(FormHiddenInput, {
                name: 'long_data',
                value: longValue
            });

            const hiddenInput = document.querySelector('input[name="long_data"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe(longValue);
            expect(hiddenInput?.value.length).toBe(1000);
        });

        it('should handle unicode characters', () => {
            render(FormHiddenInput, {
                name: 'unicode',
                value: '🚀 Hello 世界 🌟'
            });

            const hiddenInput = document.querySelector('input[name="unicode"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('🚀 Hello 世界 🌟');
        });

        it('should handle newlines and tabs', () => {
            render(FormHiddenInput, {
                name: 'formatted',
                value: 'line1\nline2\tindented'
            });

            const hiddenInput = document.querySelector('input[name="formatted"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('line1\nline2\tindented');
        });

        it('should handle JSON strings', () => {
            const jsonValue = JSON.stringify({ key: 'value', number: 42 });
            render(FormHiddenInput, {
                name: 'json_data',
                value: jsonValue
            });

            const hiddenInput = document.querySelector('input[name="json_data"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe(jsonValue);
        });

        it('should handle undefined value gracefully', () => {
            render(FormHiddenInput, {
                name: 'optional_field',
                value: undefined
            });

            const hiddenInput = document.querySelector('input[name="optional_field"]') as HTMLInputElement;
            expect(hiddenInput?.value).toBe('');
        });
    });
});

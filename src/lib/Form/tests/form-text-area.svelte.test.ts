/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import TextArea from '../form-text-area.svelte';

// Tests for Form.TextArea covering all props and behaviors

describe('Form.TextArea', () => {
    test('renders textarea with base class', () => {
        const { container } = render(TextArea);
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveClass('form-control');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(TextArea, { props: { class: 'custom-class another-class' } });
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toHaveClass('form-control');
        expect(textarea).toHaveClass('custom-class');
        expect(textarea).toHaveClass('another-class');
    });

    test('no validation classes by default', () => {
        const { container } = render(TextArea);
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).not.toHaveClass('is-valid');
        expect(textarea).not.toHaveClass('is-invalid');
    });

    test('applies is-valid when isValid is true', () => {
        const { container } = render(TextArea, { props: { isValid: true } });
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toHaveClass('is-valid');
        expect(textarea).not.toHaveClass('is-invalid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(TextArea, { props: { isValid: false } });
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).not.toHaveClass('is-invalid');
        expect(textarea).not.toHaveClass('is-valid');
    });

    test('applies is-invalid when isInvalid is true', () => {
        const { container } = render(TextArea, { props: { isInvalid: true } });
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toHaveClass('is-invalid');
        expect(textarea).not.toHaveClass('is-valid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(TextArea, { props: { isValid: true, isInvalid: true } });
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toHaveClass('is-invalid');
        expect(textarea).toHaveClass('is-valid');
    });

    test('applies sizing classes when sizing set', () => {
        let res = render(TextArea, { props: { sizing: 'sm' } });
        let textarea = res.container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toHaveClass('form-control-sm');
        res.unmount();

        res = render(TextArea, { props: { sizing: 'lg' } });
        textarea = res.container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toHaveClass('form-control-lg');
        res.unmount();

        const { container } = render(TextArea);
        textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).not.toHaveClass('form-control-sm');
        expect(textarea).not.toHaveClass('form-control-lg');
    });

    test('value binding: sets value when provided, empty when undefined', () => {
        let res = render(TextArea, { props: { value: 'hello\nworld' } });
        let textarea = res.container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea.value).toBe('hello\nworld');
        res.unmount();

        res = render(TextArea);
        textarea = res.container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea.value).toBe('');
    });

    test('isResizable: default true yields no resize style; false adds resize: none', () => {
        let res = render(TextArea);
        let textarea = res.container.querySelector('textarea') as HTMLTextAreaElement;
        // No inline styles by default
        expect(textarea.getAttribute('style') ?? '').toBe('');
        res.unmount();

        res = render(TextArea, { props: { isResizable: false } });
        textarea = res.container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toHaveStyle('resize: none');
        res.unmount();
    });

    test('style prop is respected; combines with isResizable=false', () => {
        let res = render(TextArea, { props: { style: 'color: red;' } });
        let textarea = res.container.querySelector('textarea') as HTMLTextAreaElement;
        const style1 = textarea.getAttribute('style') ?? '';
        expect(style1).toContain('color: red');
        expect(style1).not.toContain('resize: none');
        res.unmount();

        res = render(TextArea, { props: { isResizable: false, style: 'color: red; font-weight: bold;' } });
        textarea = res.container.querySelector('textarea') as HTMLTextAreaElement;
        const style2 = textarea.getAttribute('style') ?? '';
        expect(style2).toContain('resize: none');
        expect(style2).toContain('color: red');
        expect(style2).toContain('font-weight: bold');
        res.unmount();
    });

    test('forwards common attributes (id, name, placeholder, rows, cols, aria-label)', () => {
        const { container } = render(TextArea, {
            props: {
                id: 'taId',
                name: 'message',
                placeholder: 'Type here',
                rows: 5,
                cols: 40,
                'aria-label': 'Message'
            }
        });
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toHaveAttribute('id', 'taId');
        expect(textarea).toHaveAttribute('name', 'message');
        expect(textarea).toHaveAttribute('placeholder', 'Type here');
        expect(textarea).toHaveAttribute('rows', '5');
        expect(textarea).toHaveAttribute('cols', '40');
        expect(textarea).toHaveAttribute('aria-label', 'Message');
    });

    test('forwards disabled, readonly, required, maxlength, minlength, and title', () => {
        const { container } = render(TextArea, {
            props: {
                disabled: true,
                readonly: true,
                required: true,
                maxlength: 120,
                minlength: 2,
                title: 'Enter text'
            }
        });
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toBeDisabled();
        expect(textarea).toHaveAttribute('readonly');
        expect(textarea).toHaveAttribute('required');
        expect(textarea).toHaveAttribute('maxlength', '120');
        expect(textarea).toHaveAttribute('minlength', '2');
        expect(textarea).toHaveAttribute('title', 'Enter text');
    });

    test('forwards data attributes', () => {
        const { container } = render(TextArea, { props: { 'data-testid': 'ta', 'data-custom': 'x' } });
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toHaveAttribute('data-testid', 'ta');
        expect(textarea).toHaveAttribute('data-custom', 'x');
    });

    test('binds elementRef to textarea element', () => {
        const { container } = render(TextArea);
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toBeInstanceOf(HTMLTextAreaElement);
        expect(textarea).toBeInTheDocument();
    });

    test('handles a complete configuration', () => {
        const { container } = render(TextArea, {
            props: {
                class: 'my-textarea',
                isValid: true,
                sizing: 'lg',
                id: 'fullTa',
                name: 'full-message',
                'aria-label': 'Full Message',
                placeholder: 'Enter full message',
                rows: 6,
                cols: 50,
                maxlength: 200,
                value: 'Hello, world!'
            }
        });
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        expect(textarea).toHaveClass('form-control');
        expect(textarea).toHaveClass('my-textarea');
        expect(textarea).toHaveClass('is-valid');
        expect(textarea).toHaveClass('form-control-lg');
        expect(textarea).toHaveAttribute('id', 'fullTa');
        expect(textarea).toHaveAttribute('name', 'full-message');
        expect(textarea).toHaveAttribute('aria-label', 'Full Message');
        expect(textarea).toHaveAttribute('placeholder', 'Enter full message');
        expect(textarea).toHaveAttribute('rows', '6');
        expect(textarea).toHaveAttribute('cols', '50');
        expect(textarea).toHaveAttribute('maxlength', '200');
        expect(textarea.value).toBe('Hello, world!');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(TextArea, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('textarea') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(TextArea, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('textarea') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(TextArea);

        const field = container.querySelector('textarea') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(TextArea, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('textarea') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});

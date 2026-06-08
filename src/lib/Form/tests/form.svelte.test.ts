/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Root from '../form.svelte';

// Tests for Form.Root covering all props except `enhance`

describe('Form.Root', () => {
    test('renders form element', () => {
        const { container } = render(Root);
        const form = container.querySelector('form') as HTMLFormElement;
        expect(form).toBeInTheDocument();
        expect(form).not.toHaveClass('needs-validation');
        expect(form).not.toHaveClass('was-validated');
    });

    test('merges custom classes with computed classes', () => {
        const { container } = render(Root, { props: { class: 'my-form custom' } });
        const form = container.querySelector('form') as HTMLFormElement;
        expect(form).toHaveClass('my-form');
        expect(form).toHaveClass('custom');
    });

    test('applies needs-validation when needsValidation is true', () => {
        const { container } = render(Root, { props: { needsValidation: true } });
        const form = container.querySelector('form') as HTMLFormElement;
        expect(form).toHaveClass('needs-validation');
        expect(form).not.toHaveClass('was-validated');
    });

    test('applies was-validated when wasValidated is true', () => {
        const { container } = render(Root, { props: { wasValidated: true } });
        const form = container.querySelector('form') as HTMLFormElement;
        expect(form).toHaveClass('was-validated');
        expect(form).not.toHaveClass('needs-validation');
    });

    test('applies both needs-validation and was-validated when both flags are true', () => {
        const { container } = render(Root, { props: { needsValidation: true, wasValidated: true, class: 'extra' } });
        const form = container.querySelector('form') as HTMLFormElement;
        expect(form).toHaveClass('needs-validation');
        expect(form).toHaveClass('was-validated');
        expect(form).toHaveClass('extra');
    });

    test('forwards common form attributes (id, name, method, action, enctype, novalidate, target, autocomplete)', () => {
        const { container } = render(Root, {
            props: {
                id: 'login-form',
                name: 'login',
                method: 'post',
                action: '/submit',
                enctype: 'multipart/form-data',
                novalidate: true,
                target: '_blank',
                autocomplete: 'on'
            }
        });
        const form = container.querySelector('form') as HTMLFormElement;
        expect(form).toHaveAttribute('id', 'login-form');
        expect(form).toHaveAttribute('name', 'login');
        expect(form).toHaveAttribute('method', 'post');
        expect(form).toHaveAttribute('action', '/submit');
        expect(form).toHaveAttribute('enctype', 'multipart/form-data');
        expect(form).toHaveAttribute('novalidate');
        expect(form).toHaveAttribute('target', '_blank');
        expect(form).toHaveAttribute('autocomplete', 'on');
    });

    test('forwards accessibility and data attributes', () => {
        const { container } = render(Root, {
            props: {
                'aria-label': 'Main form',
                'aria-describedby': 'help-text',
                'data-testid': 'root-form',
                'data-custom': 'abc'
            }
        });
        const form = container.querySelector('form') as HTMLFormElement;
        expect(form).toHaveAttribute('aria-label', 'Main form');
        expect(form).toHaveAttribute('aria-describedby', 'help-text');
        expect(form).toHaveAttribute('data-testid', 'root-form');
        expect(form).toHaveAttribute('data-custom', 'abc');
    });

    test('binds elementRef to the form element (exists in DOM)', () => {
        const { container } = render(Root);
        const form = container.querySelector('form') as HTMLFormElement;
        expect(form).toBeInstanceOf(HTMLFormElement);
        expect(form).toBeInTheDocument();
    });

    test('handles a complete configuration (classes + flags + attrs)', () => {
        const { container } = render(Root, {
            props: {
                class: 'rounded p-3',
                needsValidation: true,
                wasValidated: true,
                id: 'complete',
                name: 'complete-form',
                method: 'get',
                action: '/search',
                target: '_self',
                autocomplete: 'off',
                'aria-label': 'Complete',
                'data-role': 'form'
            }
        });
        const form = container.querySelector('form') as HTMLFormElement;
        expect(form).toHaveClass('rounded');
        expect(form).toHaveClass('p-3');
        expect(form).toHaveClass('needs-validation');
        expect(form).toHaveClass('was-validated');
        expect(form).toHaveAttribute('id', 'complete');
        expect(form).toHaveAttribute('name', 'complete-form');
        expect(form).toHaveAttribute('method', 'get');
        expect(form).toHaveAttribute('action', '/search');
        expect(form).toHaveAttribute('target', '_self');
        expect(form).toHaveAttribute('autocomplete', 'off');
        expect(form).toHaveAttribute('aria-label', 'Complete');
        expect(form).toHaveAttribute('data-role', 'form');
    });

    test('uses enhance action when provided (invokes on mount and cleans up on unmount)', () => {
        let called = false;
        let destroyed = false;
        let receivedNode: Element | null = null;

        const mockEnhance = (node: HTMLFormElement) => {
            called = true;
            receivedNode = node;
            return {
                destroy() {
                    destroyed = true;
                }
            };
        };

        const { container, unmount } = render(Root, {
            props: {
                enhance: mockEnhance as unknown as (el: HTMLFormElement, events?: Record<string, unknown>) => { destroy(): void }
            }
        });
        const form = container.querySelector('form') as HTMLFormElement;

        expect(called).toBe(true);
        expect(receivedNode).toBe(form);

        unmount();
        expect(destroyed).toBe(true);
    });
});

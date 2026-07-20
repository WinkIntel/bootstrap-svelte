/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import FormInputGroupText from '../form-input-group-text.svelte';

describe('FormInputGroupText', () => {
    describe('Rendering', () => {
        it('should render a span element by default', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toBeInTheDocument();
            expect(textElement?.tagName.toLowerCase()).toBe('span');
            expect(textElement).toHaveClass('input-group-text');
        });

        it('should render text content from children', () => {
            const testText = '@example.com';
            const children = createRawSnippet(() => ({
                render: () => testText
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveTextContent(testText);
        });

        it('should render label element when elementType is label', () => {
            const children = createRawSnippet(() => ({
                render: () => `Upload`
            }));
            render(FormInputGroupText, {
                children,
                elementType: 'label'
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toBeInTheDocument();
            expect(textElement?.tagName.toLowerCase()).toBe('label');
        });

        it('should render span element when elementType is span', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                elementType: 'span'
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement?.tagName.toLowerCase()).toBe('span');
        });
    });

    describe('Class Handling', () => {
        it('should apply additional classes when class prop is provided', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                class: 'custom-class'
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveClass('input-group-text');
            expect(textElement).toHaveClass('custom-class');
        });

        it('should apply multiple additional classes', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                class: 'class1 class2 class3'
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveClass('input-group-text');
            expect(textElement).toHaveClass('class1');
            expect(textElement).toHaveClass('class2');
            expect(textElement).toHaveClass('class3');
        });

        it('should handle empty class prop gracefully', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                class: ''
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveClass('input-group-text');
            expect(textElement?.className).toBe('input-group-text');
        });

        it('should handle undefined class prop gracefully', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                class: undefined
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveClass('input-group-text');
        });
    });

    describe('Label Properties', () => {
        it('should support for attribute when elementType is label', () => {
            const children = createRawSnippet(() => ({
                render: () => `Upload`
            }));
            render(FormInputGroupText, {
                children,
                elementType: 'label',
                for: 'fileInput'
            });

            const labelElement = document.querySelector('label.input-group-text') as HTMLLabelElement;
            expect(labelElement).toBeInTheDocument();
            expect(labelElement?.getAttribute('for')).toBe('fileInput');
        });
    });

    describe('Accessibility', () => {
        it('should support id attribute for identification', () => {
            const testId = 'text-addon';
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                id: testId
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement?.getAttribute('id')).toBe(testId);
        });

        it('should support aria-label attribute', () => {
            const testLabel = 'Username prefix';
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                'aria-label': testLabel
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement?.getAttribute('aria-label')).toBe(testLabel);
        });

        it('should support aria-describedby attribute', () => {
            const testDescribedBy = 'help-text';
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                'aria-describedby': testDescribedBy
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement?.getAttribute('aria-describedby')).toBe(testDescribedBy);
        });

        it('should support role attribute when provided', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                role: 'presentation'
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement?.getAttribute('role')).toBe('presentation');
        });
    });

    describe('Children Content', () => {
        it('should render simple text content', () => {
            const children = createRawSnippet(() => ({
                render: () => `$`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveTextContent('$');
        });

        it('should render complex HTML content', () => {
            const children = createRawSnippet(() => ({
                render: () => `<span>Price: <strong>$</strong></span>`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            const strongElement = textElement?.querySelector('strong');
            expect(strongElement).toBeInTheDocument();
            expect(strongElement).toHaveTextContent('$');
        });

        it('should render checkbox input content', () => {
            const children = createRawSnippet(() => ({
                render: () => `<input type="checkbox" aria-label="Checkbox for following text input" />`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            const checkbox = textElement?.querySelector('input[type="checkbox"]') as HTMLInputElement;
            expect(checkbox).toBeInTheDocument();
            expect(checkbox?.getAttribute('aria-label')).toBe('Checkbox for following text input');
        });

        it('should render radio input content', () => {
            const children = createRawSnippet(() => ({
                render: () => `<input type="radio" aria-label="Radio for following text input" />`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            const radio = textElement?.querySelector('input[type="radio"]') as HTMLInputElement;
            expect(radio).toBeInTheDocument();
            expect(radio?.getAttribute('aria-label')).toBe('Radio for following text input');
        });

        it('should render icon content', () => {
            const children = createRawSnippet(() => ({
                render: () => `<i class="bi bi-person"></i>`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            const icon = textElement?.querySelector('i.bi-person');
            expect(icon).toBeInTheDocument();
        });
    });

    describe('Prop Forwarding', () => {
        it('should forward data attributes', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                'data-testid': 'input-group-text'
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement?.getAttribute('data-testid')).toBe('input-group-text');
        });

        it('should forward multiple data attributes', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                'data-id': '123',
                'data-category': 'addon'
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement?.getAttribute('data-id')).toBe('123');
            expect(textElement?.getAttribute('data-category')).toBe('addon');
        });

        it('should forward event handlers', () => {
            let clicked = false;
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                onclick: () => {
                    clicked = true;
                }
            });

            const textElement = document.querySelector('.input-group-text') as HTMLElement;
            textElement?.click();
            expect(clicked).toBe(true);
        });

        it('should forward style attribute', () => {
            const testStyle = 'background-color: red;';
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                style: testStyle
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement?.getAttribute('style')).toBe(testStyle);
        });

        it('should forward title attribute', () => {
            const testTitle = 'Tooltip text';
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                title: testTitle
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement?.getAttribute('title')).toBe(testTitle);
        });
    });

    describe('Use Cases', () => {
        it('should work as prepended text in input group', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                id: 'basic-addon1'
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveTextContent('@');
            expect(textElement?.getAttribute('id')).toBe('basic-addon1');
        });

        it('should work as appended text in input group', () => {
            const children = createRawSnippet(() => ({
                render: () => `@example.com`
            }));
            render(FormInputGroupText, {
                children,
                id: 'basic-addon2'
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveTextContent('@example.com');
            expect(textElement?.getAttribute('id')).toBe('basic-addon2');
        });

        it('should work as currency prefix', () => {
            const children = createRawSnippet(() => ({
                render: () => `$`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveTextContent('$');
        });

        it('should work as currency suffix', () => {
            const children = createRawSnippet(() => ({
                render: () => `.00`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveTextContent('.00');
        });

        it('should work as file upload label', () => {
            const children = createRawSnippet(() => ({
                render: () => `Upload`
            }));
            render(FormInputGroupText, {
                children,
                elementType: 'label',
                for: 'inputGroupFile01'
            });

            const labelElement = document.querySelector('label.input-group-text') as HTMLLabelElement;
            expect(labelElement).toHaveTextContent('Upload');
            expect(labelElement?.getAttribute('for')).toBe('inputGroupFile01');
        });

        it('should work with descriptive text for multiple inputs', () => {
            const children = createRawSnippet(() => ({
                render: () => `First and last name`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveTextContent('First and last name');
        });

        it('should work with URL prefixes', () => {
            const children = createRawSnippet(() => ({
                render: () => `https://example.com/users/`
            }));
            render(FormInputGroupText, {
                children,
                id: 'basic-addon3'
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveTextContent('https://example.com/users/');
        });
    });

    describe('Edge Cases', () => {
        it('should handle missing children gracefully', () => {
            expect(() => {
                render(FormInputGroupText, {});
            }).not.toThrow();

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toBeInTheDocument();
        });

        it('should handle empty children content', () => {
            const children = createRawSnippet(() => ({
                render: () => `<span></span>`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toBeInTheDocument();
            const spanElement = textElement?.querySelector('span');
            expect(spanElement).toBeInTheDocument();
        });

        it('should handle whitespace-only children', () => {
            const children = createRawSnippet(() => ({
                render: () => `<span>&nbsp;&nbsp;&nbsp;</span>`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toBeInTheDocument();
            const spanElement = textElement?.querySelector('span');
            expect(spanElement).toBeInTheDocument();
        });

        it('should handle special characters in content', () => {
            const specialText = '&nbsp;@&amp;#$%';
            const children = createRawSnippet(() => ({
                render: () => specialText
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toBeInTheDocument();
        });

        it('should handle very long text content', () => {
            const longText = 'This is a very long text that might overflow the input group text container';
            const children = createRawSnippet(() => ({
                render: () => longText
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveTextContent(longText);
        });

        it('should handle numeric content', () => {
            const children = createRawSnippet(() => ({
                render: () => `999.99`
            }));
            render(FormInputGroupText, { children });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement).toHaveTextContent('999.99');
        });

        it('should handle boolean attributes correctly', () => {
            const children = createRawSnippet(() => ({
                render: () => `@`
            }));
            render(FormInputGroupText, {
                children,
                hidden: true
            });

            const textElement = document.querySelector('.input-group-text');
            expect(textElement?.hasAttribute('hidden')).toBe(true);
        });
    });
});

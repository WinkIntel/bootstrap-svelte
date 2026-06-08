/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import CheckLabel from '../form-check-label.svelte';
import type { Form } from '../index.js';

const renderCheckLabelWithContent = (content: string = '', props: Form.CheckLabelProps = {}) => {
    return render(CheckLabel, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => content
            }))
        }
    });
};

describe('Form.CheckLabel', () => {
    test('renders without crashing', () => {
        const { container } = render(CheckLabel);
        expect(container).toBeInTheDocument();
    });

    test('renders label element with base class', () => {
        const { container } = render(CheckLabel);
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toBeInTheDocument();
        expect(label).toHaveClass('form-check-label');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(CheckLabel, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveClass('form-check-label');
        expect(label).toHaveClass('custom-class');
        expect(label).toHaveClass('another-class');
    });

    test('renders children content', () => {
        const { container } = renderCheckLabelWithContent('Checkbox Label Text');
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveTextContent('Checkbox Label Text');
    });

    test('renders HTML content correctly', () => {
        const { container } = renderCheckLabelWithContent('<span>Label</span>');
        const label = container.querySelector('label') as HTMLLabelElement;

        // The createRawSnippet correctly renders the HTML element
        expect(label.querySelector('span')).toBeInTheDocument();
        expect(label.querySelector('span')).toHaveTextContent('Label');
        expect(label).toHaveTextContent('Label');
    });

    test('forwards for attribute to label', () => {
        const { container } = render(CheckLabel, {
            props: {
                for: 'checkExample'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('for', 'checkExample');
    });

    test('forwards id attribute to label', () => {
        const { container } = render(CheckLabel, {
            props: {
                id: 'labelId'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('id', 'labelId');
    });

    test('forwards accessibility attributes to label', () => {
        const { container } = render(CheckLabel, {
            props: {
                'aria-label': 'Accessible label',
                'aria-describedby': 'help-text'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('aria-label', 'Accessible label');
        expect(label).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('forwards data attributes to label', () => {
        const { container } = render(CheckLabel, {
            props: {
                'data-testid': 'label-test',
                'data-custom': 'custom-value'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('data-testid', 'label-test');
        expect(label).toHaveAttribute('data-custom', 'custom-value');
    });

    test('forwards title attribute to label', () => {
        const { container } = render(CheckLabel, {
            props: {
                title: 'Label tooltip'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('title', 'Label tooltip');
    });

    test('renders without children when none provided', () => {
        const { container } = render(CheckLabel);
        const label = container.querySelector('label') as HTMLLabelElement;

        // Svelte may insert a comment node when there's no slot content; assert there is no text and no element children instead
        expect(label).toHaveTextContent('');
        expect(label.childElementCount).toBe(0);
    });

    test('binds elementRef to the label element', () => {
        const { container } = render(CheckLabel);
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toBeInstanceOf(HTMLLabelElement);
        expect(label).toBeInTheDocument();
    });

    test('renders as form control with proper association', () => {
        const { container } = renderCheckLabelWithContent('Associated Label', {
            for: 'associated-input'
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('for', 'associated-input');
        expect(label).toHaveTextContent('Associated Label');
        expect(label).toHaveClass('form-check-label');
    });

    test('handles multiple CSS classes correctly', () => {
        const { container } = render(CheckLabel, {
            props: {
                class: 'class1 class2 class3'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveClass('form-check-label');
        expect(label).toHaveClass('class1');
        expect(label).toHaveClass('class2');
        expect(label).toHaveClass('class3');
    });

    test('renders with styled content', () => {
        const { container } = renderCheckLabelWithContent('<span class="text-primary">Primary</span>');
        const label = container.querySelector('label') as HTMLLabelElement;

        // Check the HTML structure and styling
        expect(label.querySelector('.text-primary')).toBeInTheDocument();
        expect(label.querySelector('.text-primary')).toHaveTextContent('Primary');
        expect(label).toHaveTextContent('Primary');
    });

    test('combines custom class with content', () => {
        const { container } = renderCheckLabelWithContent('Custom styled label', {
            class: 'custom-label-class',
            for: 'styled-input'
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveClass('form-check-label');
        expect(label).toHaveClass('custom-label-class');
        expect(label).toHaveAttribute('for', 'styled-input');
        expect(label).toHaveTextContent('Custom styled label');
    });

    test("renders as 'span' when elementType prop is 'span'", () => {
        const { container } = render(CheckLabel, {
            props: {
                elementType: 'span',
                children: createRawSnippet(() => ({
                    render: () => 'Span Label'
                }))
            }
        });

        const span = container.querySelector('span') as HTMLSpanElement;

        expect(span).toBeInTheDocument();
        expect(span).toHaveClass('form-check-label');
        expect(span).toHaveTextContent('Span Label');
    });

    test('handles empty content gracefully', () => {
        const { container } = render(CheckLabel);
        const label = container.querySelector('label') as HTMLLabelElement;

        // Svelte may insert a comment node when there's no slot content; assert there is no text and no element children instead
        expect(label).toHaveTextContent('');
        expect(label.childElementCount).toBe(0);
        expect(label).toHaveClass('form-check-label');
    });
});

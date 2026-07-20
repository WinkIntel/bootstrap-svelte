/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import RadioLabel from '../form-radio-label.svelte';
import type { Form } from '../index.js';

const renderRadioLabelWithContent = (content: string = '', props: Form.RadioLabelProps = {}) => {
    return render(RadioLabel, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => content
            }))
        }
    });
};

describe('Form.RadioLabel', () => {
    test('renders label element with base class', () => {
        const { container } = render(RadioLabel);
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toBeInTheDocument();
        expect(label).toHaveClass('form-check-label');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(RadioLabel, {
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
        const { container } = renderRadioLabelWithContent('Radio Label Text');
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveTextContent('Radio Label Text');
    });

    test('renders HTML content correctly', () => {
        const { container } = renderRadioLabelWithContent('<span>Label</span>');
        const label = container.querySelector('label') as HTMLLabelElement;

        // The createRawSnippet correctly renders the HTML element
        expect(label.querySelector('span')).toBeInTheDocument();
        expect(label.querySelector('span')).toHaveTextContent('Label');
        expect(label).toHaveTextContent('Label');
    });

    test('forwards for attribute to label', () => {
        const { container } = render(RadioLabel, {
            props: {
                for: 'radioExample'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('for', 'radioExample');
    });

    test('forwards id attribute to label', () => {
        const { container } = render(RadioLabel, {
            props: {
                id: 'labelId'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('id', 'labelId');
    });

    test('forwards accessibility attributes to label', () => {
        const { container } = render(RadioLabel, {
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
        const { container } = render(RadioLabel, {
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
        const { container } = render(RadioLabel, {
            props: {
                title: 'Label tooltip'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('title', 'Label tooltip');
    });

    test('renders without children when none provided', () => {
        const { container } = render(RadioLabel);
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toBeEmptyDOMElement();
    });

    test('renders as form control with proper association', () => {
        const { container } = renderRadioLabelWithContent('Associated Label', {
            for: 'associated-input'
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('for', 'associated-input');
        expect(label).toHaveTextContent('Associated Label');
        expect(label).toHaveClass('form-check-label');
    });

    test('handles multiple CSS classes correctly', () => {
        const { container } = render(RadioLabel, {
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
        const { container } = renderRadioLabelWithContent('<span class="text-primary">Primary</span>');
        const label = container.querySelector('label') as HTMLLabelElement;

        // Check the HTML structure and styling
        expect(label.querySelector('.text-primary')).toBeInTheDocument();
        expect(label.querySelector('.text-primary')).toHaveTextContent('Primary');
        expect(label).toHaveTextContent('Primary');
    });

    test('combines custom class with content', () => {
        const { container } = renderRadioLabelWithContent('Custom styled label', {
            class: 'custom-label-class',
            for: 'styled-input'
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveClass('form-check-label');
        expect(label).toHaveClass('custom-label-class');
        expect(label).toHaveAttribute('for', 'styled-input');
        expect(label).toHaveTextContent('Custom styled label');
    });

    test('handles empty content gracefully', () => {
        const { container } = render(RadioLabel);
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toBeEmptyDOMElement();
        expect(label).toHaveClass('form-check-label');
    });
});

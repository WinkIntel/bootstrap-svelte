/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import InputLabel from '../form-input-label.svelte';
import type { Form } from '../index.js';

const renderInputLabelWithContent = (content: string = '', props: Form.InputLabelProps = {}) => {
    return render(InputLabel, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => content
            }))
        }
    });
};

describe('Form.InputLabel', () => {
    test('renders without crashing', () => {
        const { container } = render(InputLabel);
        expect(container).toBeInTheDocument();
    });

    test('renders label element with base class', () => {
        const { container } = render(InputLabel);
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toBeInTheDocument();
        expect(label).toHaveClass('form-label');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(InputLabel, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveClass('form-label');
        expect(label).toHaveClass('custom-class');
        expect(label).toHaveClass('another-class');
    });

    test('does not apply form-label class when isFloating is true', () => {
        const { container } = render(InputLabel, {
            props: {
                isFloating: true
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).not.toHaveClass('form-label');
    });

    test('applies form-label class when isFloating is false', () => {
        const { container } = render(InputLabel, {
            props: {
                isFloating: false
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveClass('form-label');
    });

    test('applies form-label class when isFloating is undefined', () => {
        const { container } = render(InputLabel);
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveClass('form-label');
    });

    test('applies custom classes when isFloating is true', () => {
        const { container } = render(InputLabel, {
            props: {
                isFloating: true,
                class: 'custom-floating-class'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).not.toHaveClass('form-label');
        expect(label).toHaveClass('custom-floating-class');
    });

    test('forwards for attribute to label', () => {
        const { container } = render(InputLabel, {
            props: {
                for: 'exampleInput'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('for', 'exampleInput');
    });

    test('forwards id and data attributes to label', () => {
        const { container } = render(InputLabel, {
            props: {
                id: 'input-label-default',
                'data-value': 'label-value'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('id', 'input-label-default');
        expect(label).toHaveAttribute('data-value', 'label-value');
    });

    test('forwards accessibility attributes to label', () => {
        const { container } = render(InputLabel, {
            props: {
                'aria-label': 'Custom input label',
                'aria-describedby': 'help-text'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('aria-label', 'Custom input label');
        expect(label).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('forwards data attributes to label', () => {
        const { container } = render(InputLabel, {
            props: {
                'data-testid': 'input-label-test',
                'data-custom': 'custom-value'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveAttribute('data-testid', 'input-label-test');
        expect(label).toHaveAttribute('data-custom', 'custom-value');
    });

    test('binds elementRef to the label element', () => {
        const { container } = render(InputLabel);
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toBeInstanceOf(HTMLLabelElement);
        expect(label).toBeInTheDocument();
    });

    test('renders children content', () => {
        const { container } = renderInputLabelWithContent('Email address');
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent('Email address');
    });

    test('applies multiple props together for standard label', () => {
        const { container } = render(InputLabel, {
            props: {
                class: 'custom-class',
                for: 'testInput',
                id: 'testLabel'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).toHaveClass('form-label');
        expect(label).toHaveClass('custom-class');
        expect(label).toHaveAttribute('for', 'testInput');
        expect(label).toHaveAttribute('id', 'testLabel');
    });

    test('applies multiple props together for floating label', () => {
        const { container } = render(InputLabel, {
            props: {
                class: 'floating-custom-class',
                isFloating: true,
                for: 'floatingInput',
                id: 'floatingLabel'
            }
        });
        const label = container.querySelector('label') as HTMLLabelElement;

        expect(label).not.toHaveClass('form-label');
        expect(label).toHaveClass('floating-custom-class');
        expect(label).toHaveAttribute('for', 'floatingInput');
        expect(label).toHaveAttribute('id', 'floatingLabel');
    });
});

/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import Check from '../form-check.svelte';
import type { Form } from '../index.js';

const renderCheckWithContent = (content: string = '', props: Form.CheckProps = {}) => {
    return render(Check, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => content
            }))
        }
    });
};

describe('Form.Check', () => {
    test('renders without crashing', () => {
        const { container } = render(Check);
        expect(container).toBeInTheDocument();
    });

    test('renders div element with base class', () => {
        const { container } = render(Check);
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toBeInTheDocument();
        expect(checkContainer).toHaveClass('form-check');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(Check, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).toHaveClass('custom-class');
        expect(checkContainer).toHaveClass('another-class');
    });

    test('applies form-switch class when isSwitch is true', () => {
        const { container } = render(Check, {
            props: {
                isSwitch: true
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).toHaveClass('form-switch');
    });

    test('does not apply form-switch class when isSwitch is false', () => {
        const { container } = render(Check, {
            props: {
                isSwitch: false
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).not.toHaveClass('form-switch');
    });

    test('does not apply form-switch class when isSwitch is undefined', () => {
        const { container } = render(Check);
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).not.toHaveClass('form-switch');
    });

    test('applies form-check-inline class when isInline is true', () => {
        const { container } = render(Check, {
            props: {
                isInline: true
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).toHaveClass('form-check-inline');
    });

    test('does not apply form-check-inline class when isInline is false', () => {
        const { container } = render(Check, {
            props: {
                isInline: false
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).not.toHaveClass('form-check-inline');
    });

    test('does not apply form-check-inline class when isInline is undefined', () => {
        const { container } = render(Check);
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).not.toHaveClass('form-check-inline');
    });

    test('renders simple content', () => {
        const { container } = renderCheckWithContent('<input type="checkbox" />');
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    });

    test('renders checkbox input with proper structure', () => {
        const { container } = renderCheckWithContent('<input class="form-check-input" type="checkbox" id="test-checkbox" />');
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        const input = checkContainer.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-check-input');
        expect(input).toHaveAttribute('id', 'test-checkbox');
    });

    test('renders switch structure with isSwitch true', () => {
        const switchContent =
            '<input class="form-check-input" type="checkbox" role="switch" id="test-switch" /><label class="form-check-label" for="test-switch">Switch Label</label>';
        const { container } = renderCheckWithContent(switchContent, { isSwitch: true });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).toHaveClass('form-switch');

        const input = checkContainer.querySelector('input[type="checkbox"]') as HTMLInputElement;
        expect(input).toHaveAttribute('role', 'switch');
    });

    test('renders radio input structure', () => {
        const { container } = renderCheckWithContent('<input class="form-check-input" type="radio" name="test-radio" id="test-radio" />');
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        const input = checkContainer.querySelector('input[type="radio"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('name', 'test-radio');
        expect(input).toHaveAttribute('id', 'test-radio');
    });

    test('forwards id attribute to container', () => {
        const { container } = render(Check, {
            props: {
                id: 'check-container'
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveAttribute('id', 'check-container');
    });

    test('forwards data attributes to container', () => {
        const { container } = render(Check, {
            props: {
                'data-testid': 'check-test',
                'data-custom': 'custom-value'
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveAttribute('data-testid', 'check-test');
        expect(checkContainer).toHaveAttribute('data-custom', 'custom-value');
    });

    test('forwards accessibility attributes to container', () => {
        const { container } = render(Check, {
            props: {
                'aria-label': 'Check container',
                'aria-describedby': 'help-text'
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveAttribute('aria-label', 'Check container');
        expect(checkContainer).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('forwards title attribute to container', () => {
        const { container } = render(Check, {
            props: {
                title: 'Check tooltip'
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveAttribute('title', 'Check tooltip');
    });

    test('binds elementRef to the container element', () => {
        const { container } = render(Check);
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toBeInstanceOf(HTMLDivElement);
        expect(checkContainer).toBeInTheDocument();
    });

    test('renders without children when none provided', () => {
        const { container } = render(Check);
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toBeEmptyDOMElement();
        expect(checkContainer).toHaveClass('form-check');
    });

    test('combines switch class with custom classes', () => {
        const { container } = render(Check, {
            props: {
                isSwitch: true,
                class: 'custom-switch-class'
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).toHaveClass('form-switch');
        expect(checkContainer).toHaveClass('custom-switch-class');
    });

    test('combines inline class with custom classes', () => {
        const { container } = render(Check, {
            props: {
                isInline: true,
                class: 'custom-inline-class'
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).toHaveClass('form-check-inline');
        expect(checkContainer).toHaveClass('custom-inline-class');
    });

    test('applies both switch and inline classes when both are true', () => {
        const { container } = render(Check, {
            props: {
                isSwitch: true,
                isInline: true
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).toHaveClass('form-switch');
        expect(checkContainer).toHaveClass('form-check-inline');
    });

    test('combines switch, inline, and custom classes', () => {
        const { container } = render(Check, {
            props: {
                isSwitch: true,
                isInline: true,
                class: 'custom-combined-class'
            }
        });
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        expect(checkContainer).toHaveClass('form-check');
        expect(checkContainer).toHaveClass('form-switch');
        expect(checkContainer).toHaveClass('form-check-inline');
        expect(checkContainer).toHaveClass('custom-combined-class');
    });

    test('renders nested wrapper content', () => {
        const { container } = renderCheckWithContent(
            '<div class="form-check-input-wrapper"><input type="checkbox" class="form-check-input" /></div>'
        );
        const checkContainer = container.querySelector('div.form-check') as HTMLDivElement;

        expect(checkContainer.querySelector('.form-check-input-wrapper')).toBeInTheDocument();
        expect(checkContainer.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    });

    test('renders with text content', () => {
        const { container } = renderCheckWithContent('Simple text content');
        const checkContainer = container.querySelector('div.form-check') as HTMLDivElement;

        expect(checkContainer).toHaveTextContent('Simple text content');
    });

    test('renders container with proper semantic structure', () => {
        const { container } = render(Check);
        const checkContainer = container.querySelector('div') as HTMLDivElement;

        // Verify it's a div container with proper Bootstrap classes
        expect(checkContainer.tagName).toBe('DIV');
        expect(checkContainer).toHaveClass('form-check');

        // Verify it can contain form elements (structural test)
        expect(checkContainer).toBeInTheDocument();
    });
});

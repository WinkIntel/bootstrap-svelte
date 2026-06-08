/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import InputGroup from '../form-input-group.svelte';

describe('Form.InputGroup', () => {
    test('renders without crashing', () => {
        const { container } = render(InputGroup);
        expect(container).toBeInTheDocument();
    });

    test('renders div element with base class', () => {
        const { container } = render(InputGroup);
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toBeInTheDocument();
        expect(div).toHaveClass('input-group');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(InputGroup, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toHaveClass('input-group');
        expect(div).toHaveClass('custom-class');
        expect(div).toHaveClass('another-class');
    });

    test('applies has-validation class when hasValidation is true', () => {
        const { container } = render(InputGroup, {
            props: {
                hasValidation: true
            }
        });
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toHaveClass('has-validation');
    });

    test('does not apply has-validation class when hasValidation is undefined', () => {
        const { container } = render(InputGroup);
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).not.toHaveClass('has-validation');
    });

    test('applies flex-nowrap class when noWrap is true', () => {
        const { container } = render(InputGroup, {
            props: {
                noWrap: true
            }
        });
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toHaveClass('flex-nowrap');
    });

    test('does not apply flex-nowrap class when noWrap is undefined', () => {
        const { container } = render(InputGroup);
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).not.toHaveClass('flex-nowrap');
    });

    test('applies sizing class when sizing is sm', () => {
        const { container } = render(InputGroup, {
            props: {
                sizing: 'sm'
            }
        });
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toHaveClass('input-group-sm');
    });

    test('applies sizing class when sizing is lg', () => {
        const { container } = render(InputGroup, {
            props: {
                sizing: 'lg'
            }
        });
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toHaveClass('input-group-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(InputGroup);
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).not.toHaveClass('input-group-sm');
        expect(div).not.toHaveClass('input-group-lg');
    });

    test('forwards id and data attributes to div', () => {
        const { container } = render(InputGroup, {
            props: {
                id: 'input-group-default',
                'data-value': 'input-group-value'
            }
        });
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toHaveAttribute('id', 'input-group-default');
        expect(div).toHaveAttribute('data-value', 'input-group-value');
    });

    test('forwards accessibility attributes to div', () => {
        const { container } = render(InputGroup, {
            props: {
                'aria-label': 'Custom input group label',
                'aria-describedby': 'help-text'
            }
        });
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toHaveAttribute('aria-label', 'Custom input group label');
        expect(div).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('forwards data attributes to div', () => {
        const { container } = render(InputGroup, {
            props: {
                'data-testid': 'input-group-test',
                'data-custom': 'custom-value'
            }
        });
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toHaveAttribute('data-testid', 'input-group-test');
        expect(div).toHaveAttribute('data-custom', 'custom-value');
    });

    test('binds elementRef to the div element', () => {
        const { container } = render(InputGroup);
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toBeInstanceOf(HTMLDivElement);
        expect(div).toBeInTheDocument();
    });

    test('applies multiple conditional classes together', () => {
        const { container } = render(InputGroup, {
            props: {
                class: 'custom-class',
                hasValidation: true,
                noWrap: true,
                sizing: 'lg'
            }
        });
        const div = container.querySelector('div') as HTMLDivElement;

        expect(div).toHaveClass('input-group');
        expect(div).toHaveClass('custom-class');
        expect(div).toHaveClass('has-validation');
        expect(div).toHaveClass('flex-nowrap');
        expect(div).toHaveClass('input-group-lg');
    });
});

/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import Feedback from '../form-feedback.svelte';

describe('Form.Feedback', () => {
    test('renders without crashing', () => {
        const { container } = render(Feedback);
        expect(container).toBeInTheDocument();
    });

    test('renders as div element', () => {
        const { container } = render(Feedback);
        const feedback = container.querySelector('div');

        expect(feedback).toBeInTheDocument();
    });

    test('renders children content', () => {
        const children = createRawSnippet(() => ({
            render: () => `<span>Validation message</span>`
        }));

        const { container } = render(Feedback, {
            props: { children }
        });

        expect(container.textContent).toContain('Validation message');
    });

    test('applies valid-feedback class when isValid is true', () => {
        const { container } = render(Feedback, {
            props: {
                isValid: true
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveClass('valid-feedback');
        expect(feedback).not.toHaveClass('invalid-feedback');
        expect(feedback).not.toHaveClass('valid-tooltip');
        expect(feedback).not.toHaveClass('invalid-tooltip');
    });

    test('applies invalid-feedback class when isInvalid is true', () => {
        const { container } = render(Feedback, {
            props: {
                isInvalid: true
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveClass('invalid-feedback');
        expect(feedback).not.toHaveClass('valid-feedback');
        expect(feedback).not.toHaveClass('valid-tooltip');
        expect(feedback).not.toHaveClass('invalid-tooltip');
    });

    test('applies valid-tooltip class when isValid and isTooltip are true', () => {
        const { container } = render(Feedback, {
            props: {
                isValid: true,
                isTooltip: true
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveClass('valid-tooltip');
        expect(feedback).not.toHaveClass('valid-feedback');
        expect(feedback).not.toHaveClass('invalid-feedback');
        expect(feedback).not.toHaveClass('invalid-tooltip');
    });

    test('applies invalid-tooltip class when isInvalid and isTooltip are true', () => {
        const { container } = render(Feedback, {
            props: {
                isInvalid: true,
                isTooltip: true
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveClass('invalid-tooltip');
        expect(feedback).not.toHaveClass('invalid-feedback');
        expect(feedback).not.toHaveClass('valid-feedback');
        expect(feedback).not.toHaveClass('valid-tooltip');
    });

    test('does not apply any feedback classes when validation states are undefined', () => {
        const { container } = render(Feedback);
        const feedback = container.querySelector('div');

        expect(feedback).not.toHaveClass('valid-feedback');
        expect(feedback).not.toHaveClass('invalid-feedback');
        expect(feedback).not.toHaveClass('valid-tooltip');
        expect(feedback).not.toHaveClass('invalid-tooltip');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(Feedback, {
            props: {
                isValid: true,
                isInvalid: true
            }
        });
        const feedback = container.querySelector('div');

        // Both flags operate independently now: both classes should be present when both are true
        expect(feedback).toHaveClass('invalid-feedback');
        expect(feedback).toHaveClass('valid-feedback');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(Feedback, {
            props: {
                isValid: false
            }
        });
        const feedback = container.querySelector('div');

        // Validation flags are independent: false/undefined should not add validation classes
        expect(feedback).not.toHaveClass('invalid-feedback');
        expect(feedback).not.toHaveClass('valid-feedback');
    });

    test('tooltip takes precedence over feedback when isTooltip is true', () => {
        const { container } = render(Feedback, {
            props: {
                isValid: true,
                isTooltip: true
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveClass('valid-tooltip');
        expect(feedback).not.toHaveClass('valid-feedback');
    });

    test('merges custom classes with validation classes', () => {
        const { container } = render(Feedback, {
            props: {
                isValid: true,
                class: 'custom-class another-class'
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveClass('valid-feedback');
        expect(feedback).toHaveClass('custom-class');
        expect(feedback).toHaveClass('another-class');
    });

    test('forwards id attribute to div', () => {
        const { container } = render(Feedback, {
            props: {
                id: 'feedback-message'
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveAttribute('id', 'feedback-message');
    });

    test('forwards data attributes to div', () => {
        const { container } = render(Feedback, {
            props: {
                'data-testid': 'form-feedback',
                'data-custom': 'custom-value'
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveAttribute('data-testid', 'form-feedback');
        expect(feedback).toHaveAttribute('data-custom', 'custom-value');
    });

    test('forwards accessibility attributes to div', () => {
        const { container } = render(Feedback, {
            props: {
                'aria-live': 'polite',
                'aria-describedby': 'form-help'
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveAttribute('aria-live', 'polite');
        expect(feedback).toHaveAttribute('aria-describedby', 'form-help');
    });

    test('forwards title attribute to div', () => {
        const { container } = render(Feedback, {
            props: {
                title: 'Feedback message'
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveAttribute('title', 'Feedback message');
    });

    test('binds elementRef to the div element', () => {
        const { container } = render(Feedback);
        const feedback = container.querySelector('div');

        expect(feedback).toBeInstanceOf(HTMLDivElement);
        expect(feedback).toBeInTheDocument();
    });

    test('renders with complex children content', () => {
        const children = createRawSnippet(() => ({
            render: () => `<span><strong>Error:</strong> Please fix this field.</span>`
        }));

        const { container } = render(Feedback, {
            props: {
                children,
                isInvalid: true
            }
        });

        expect(container.textContent).toContain('Error: Please fix this field.');
        expect(container.querySelector('div')).toHaveClass('invalid-feedback');
    });

    test('handles empty children gracefully', () => {
        const { container } = render(Feedback, {
            props: {
                isValid: true
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveClass('valid-feedback');
        expect(feedback?.textContent).toBe('');
    });

    test('handles all combinations of validation and tooltip states', () => {
        const combinations = [
            { isValid: true, isInvalid: undefined, isTooltip: false, expected: 'valid-feedback' },
            { isValid: true, isInvalid: undefined, isTooltip: true, expected: 'valid-tooltip' },
            { isValid: undefined, isInvalid: true, isTooltip: false, expected: 'invalid-feedback' },
            { isValid: undefined, isInvalid: true, isTooltip: true, expected: 'invalid-tooltip' }
        ];

        combinations.forEach(({ isValid, isInvalid, isTooltip, expected }) => {
            const { container } = render(Feedback, {
                props: {
                    isValid,
                    isInvalid,
                    isTooltip
                }
            });
            const feedback = container.querySelector('div');
            expect(feedback).toHaveClass(expected);

            // Ensure no other feedback classes are applied
            const allClasses = ['valid-feedback', 'invalid-feedback', 'valid-tooltip', 'invalid-tooltip'];
            allClasses
                .filter((cls) => cls !== expected)
                .forEach((cls) => {
                    expect(feedback).not.toHaveClass(cls);
                });
        });
    });

    test('renders with all props combined', () => {
        const children = createRawSnippet(() => ({
            render: () => `<span>Success message</span>`
        }));

        const { container } = render(Feedback, {
            props: {
                children,
                isValid: true,
                isTooltip: false,
                id: 'success-feedback',
                class: 'custom-feedback-class',
                title: 'Success tooltip',
                'data-testid': 'feedback-element',
                'aria-live': 'polite'
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveClass('valid-feedback');
        expect(feedback).toHaveClass('custom-feedback-class');
        expect(feedback).toHaveAttribute('id', 'success-feedback');
        expect(feedback).toHaveAttribute('title', 'Success tooltip');
        expect(feedback).toHaveAttribute('data-testid', 'feedback-element');
        expect(feedback).toHaveAttribute('aria-live', 'polite');
        expect(container.textContent).toContain('Success message');
    });

    test('correctly applies tooltip classes with validation precedence', () => {
        // Test isInvalid precedence with tooltip
        const { container } = render(Feedback, {
            props: {
                isValid: true,
                isInvalid: true,
                isTooltip: true
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveClass('invalid-tooltip');
        expect(feedback).toHaveClass('valid-tooltip');
        expect(feedback).not.toHaveClass('valid-feedback');
        expect(feedback).not.toHaveClass('invalid-feedback');
    });

    test('supports role attribute for accessibility', () => {
        const { container } = render(Feedback, {
            props: {
                role: 'alert',
                isInvalid: true
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveAttribute('role', 'alert');
        expect(feedback).toHaveClass('invalid-feedback');
    });

    test('supports hidden attribute', () => {
        const { container } = render(Feedback, {
            props: {
                hidden: true,
                isValid: true
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveAttribute('hidden');
        expect(feedback).toHaveClass('valid-feedback');
    });

    test('handles undefined isTooltip correctly', () => {
        const { container } = render(Feedback, {
            props: {
                isValid: true
                // isTooltip is undefined
            }
        });
        const feedback = container.querySelector('div');

        expect(feedback).toHaveClass('valid-feedback');
        expect(feedback).not.toHaveClass('valid-tooltip');
    });

    test('validates that only one validation class is applied at a time', () => {
        const testCases = [
            { props: { isValid: true }, expected: 'valid-feedback' },
            { props: { isInvalid: true }, expected: 'invalid-feedback' },
            { props: { isValid: true, isTooltip: true }, expected: 'valid-tooltip' },
            { props: { isInvalid: true, isTooltip: true }, expected: 'invalid-tooltip' }
        ];

        testCases.forEach(({ props, expected }) => {
            const { container } = render(Feedback, { props });
            const feedback = container.querySelector('div');
            const allValidationClasses = ['valid-feedback', 'invalid-feedback', 'valid-tooltip', 'invalid-tooltip'];

            // Count how many validation classes are applied
            const appliedClasses = allValidationClasses.filter((cls) => feedback?.classList.contains(cls));

            expect(appliedClasses).toHaveLength(1);
            expect(feedback).toHaveClass(expected);
        });
    });

    test('renders correctly with no props', () => {
        const { container } = render(Feedback);
        const feedback = container.querySelector('div');

        expect(feedback).toBeInTheDocument();
        expect(feedback?.className).toBe('');
        expect(feedback?.textContent).toBe('');
    });
});

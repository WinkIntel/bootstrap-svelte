import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import FormHelperText from '../form-helper-text.svelte';

describe('FormHelperText', () => {
    describe('Rendering', () => {
        it('should render a div element', () => {
            render(FormHelperText);

            const helperText = document.querySelector('.form-text');
            expect(helperText).toBeInTheDocument();
            expect(helperText?.tagName).toBe('DIV');
            expect(helperText).toHaveClass('form-text');
        });

        it('should render children content when provided', () => {
            const children = createRawSnippet(() => ({ render: () => '<span>Helper text content</span>' }));
            render(FormHelperText, { children });

            expect(screen.getByText('Helper text content')).toBeInTheDocument();
        });

        it('should render text content directly', () => {
            const children = createRawSnippet(() => ({ render: () => 'Your password must be 8-20 characters long.' }));
            render(FormHelperText, { children });

            expect(screen.getByText('Your password must be 8-20 characters long.')).toBeInTheDocument();
        });

        it('should render HTML content in children', () => {
            const children = createRawSnippet(() => ({ render: () => '<div><strong>Important:</strong> Keep your password secure.</div>' }));
            render(FormHelperText, { children });

            expect(screen.getByText('Important:')).toBeInTheDocument();
            expect(screen.getByText('Keep your password secure.')).toBeInTheDocument();
        });
    });

    describe('Class Handling', () => {
        it('should apply additional classes when class prop is provided', () => {
            render(FormHelperText, { class: 'custom-helper' });

            const helperText = document.querySelector('.form-text.custom-helper');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveClass('form-text', 'custom-helper');
        });

        it('should apply multiple additional classes', () => {
            render(FormHelperText, { class: 'custom-helper text-muted' });

            const helperText = document.querySelector('.form-text');
            expect(helperText).toHaveClass('form-text', 'custom-helper', 'text-muted');
        });

        it('should handle empty class prop gracefully', () => {
            render(FormHelperText, { class: '' });

            const helperText = document.querySelector('.form-text');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveClass('form-text');
            expect(helperText?.className).toBe('form-text');
        });

        it('should handle undefined class prop gracefully', () => {
            render(FormHelperText, { class: undefined });

            const helperText = document.querySelector('.form-text');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveClass('form-text');
            expect(helperText?.className).toBe('form-text');
        });
    });

    describe('Accessibility', () => {
        it('should support id attribute for aria-describedby association', () => {
            render(FormHelperText, { id: 'password-help' });

            const helperText = document.querySelector('#password-help');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveAttribute('id', 'password-help');
        });

        it('should support role attribute when provided', () => {
            render(FormHelperText, { role: 'note' });

            const helperText = screen.getByRole('note');
            expect(helperText).toBeInTheDocument();
        });

        it('should support aria-live attribute for dynamic content', () => {
            render(FormHelperText, { 'aria-live': 'polite' });

            const helperText = document.querySelector('[aria-live="polite"]');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveAttribute('aria-live', 'polite');
        });

        it('should support aria-describedby attribute when provided', () => {
            render(FormHelperText, { 'aria-describedby': 'additional-info' });

            const helperText = document.querySelector('[aria-describedby="additional-info"]');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveAttribute('aria-describedby', 'additional-info');
        });
    });

    describe('Prop Forwarding', () => {
        it('should forward data attributes', () => {
            render(FormHelperText, { 'data-testid': 'helper-text' });

            const helperText = screen.getByTestId('helper-text');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveAttribute('data-testid', 'helper-text');
        });

        it('should forward custom attributes', () => {
            render(FormHelperText, { 'data-custom': 'value' });

            const helperText = document.querySelector('[data-custom="value"]');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveAttribute('data-custom', 'value');
        });

        it('should forward multiple attributes', () => {
            render(FormHelperText, {
                'data-testid': 'helper-text',
                'data-section': 'form-help',
                title: 'Additional information'
            });

            const helperText = screen.getByTestId('helper-text');
            expect(helperText).toHaveAttribute('data-section', 'form-help');
            expect(helperText).toHaveAttribute('title', 'Additional information');
        });

        it('should forward event handlers', () => {
            let clicked = false;
            const handleClick = () => {
                clicked = true;
            };

            render(FormHelperText, { onclick: handleClick });

            const helperText = document.querySelector('.form-text') as HTMLElement;
            helperText?.click();
            expect(clicked).toBe(true);
        });

        it('should forward style attribute', () => {
            render(FormHelperText, { style: 'color: red; font-weight: bold;' });

            const helperText = document.querySelector('[style]');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveAttribute('style', 'color: red; font-weight: bold;');
        });
    });

    describe('Content Variations', () => {
        it('should render with validation instructions', () => {
            const children = createRawSnippet(() => ({ render: () => 'Password must contain at least 8 characters.' }));
            render(FormHelperText, { children });

            expect(screen.getByText('Password must contain at least 8 characters.')).toBeInTheDocument();
        });

        it('should render with format instructions', () => {
            const children = createRawSnippet(() => ({ render: () => 'Enter date in MM/DD/YYYY format.' }));
            render(FormHelperText, { children });

            expect(screen.getByText('Enter date in MM/DD/YYYY format.')).toBeInTheDocument();
        });

        it('should render with privacy information', () => {
            const children = createRawSnippet(() => ({ render: () => "We'll never share your email with anyone else." }));
            render(FormHelperText, { children });

            expect(screen.getByText("We'll never share your email with anyone else.")).toBeInTheDocument();
        });

        it('should render with example text', () => {
            const children = createRawSnippet(() => ({ render: () => 'Example: john.doe@company.com' }));
            render(FormHelperText, { children });

            expect(screen.getByText('Example: john.doe@company.com')).toBeInTheDocument();
        });

        it('should render with multiple paragraphs wrapped in container', () => {
            const children = createRawSnippet(() => ({ render: () => '<div><p>First instruction.</p><p>Second instruction.</p></div>' }));
            render(FormHelperText, { children });

            expect(screen.getByText('First instruction.')).toBeInTheDocument();
            expect(screen.getByText('Second instruction.')).toBeInTheDocument();
        });
    });

    describe('Bootstrap Integration', () => {
        it('should work with text-muted class for subtle styling', () => {
            render(FormHelperText, { class: 'text-muted' });

            const helperText = document.querySelector('.form-text.text-muted');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveClass('form-text', 'text-muted');
        });

        it('should work with small text class', () => {
            render(FormHelperText, { class: 'small' });

            const helperText = document.querySelector('.form-text.small');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveClass('form-text', 'small');
        });

        it('should work with text color utilities', () => {
            render(FormHelperText, { class: 'text-primary' });

            const helperText = document.querySelector('.form-text.text-primary');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveClass('form-text', 'text-primary');
        });

        it('should work with margin utilities', () => {
            render(FormHelperText, { class: 'mt-2' });

            const helperText = document.querySelector('.form-text.mt-2');
            expect(helperText).toBeInTheDocument();
            expect(helperText).toHaveClass('form-text', 'mt-2');
        });
    });

    describe('Edge Cases', () => {
        it('should render without children', () => {
            render(FormHelperText);

            const helperText = document.querySelector('.form-text');
            expect(helperText).toBeInTheDocument();
            expect(helperText?.textContent).toBe('');
        });

        it('should handle empty string children', () => {
            const children = createRawSnippet(() => ({ render: () => '<span></span>' }));
            render(FormHelperText, { children });

            const helperText = document.querySelector('.form-text');
            expect(helperText).toBeInTheDocument();
        });

        it('should handle numeric content', () => {
            const children = createRawSnippet(() => ({ render: () => '123' }));
            render(FormHelperText, { children });

            expect(screen.getByText('123')).toBeInTheDocument();
        });

        it('should handle special characters in content', () => {
            const children = createRawSnippet(() => ({ render: () => '!@#$%^&*()' }));
            render(FormHelperText, { children });

            expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument();
        });
    });
});

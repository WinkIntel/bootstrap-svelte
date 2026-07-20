/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import Floating from '../form-floating.svelte';

describe('Form.Floating', () => {
    test('renders as div element with form-floating class', () => {
        const { container } = render(Floating);
        const floating = container.querySelector('div');

        expect(floating).toBeInTheDocument();
        expect(floating).toHaveClass('form-floating');
    });

    test('renders children content', () => {
        const children = createRawSnippet(() => ({
            render: () => `<input type="text" placeholder="Test input" />`
        }));

        const { container } = render(Floating, {
            props: { children }
        });

        expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
        expect(container.querySelector('input')).toHaveAttribute('placeholder', 'Test input');
    });

    test('merges custom classes with form-floating class', () => {
        const { container } = render(Floating, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const floating = container.querySelector('div');

        expect(floating).toHaveClass('form-floating');
        expect(floating).toHaveClass('custom-class');
        expect(floating).toHaveClass('another-class');
    });

    test('forwards id attribute to div', () => {
        const { container } = render(Floating, {
            props: {
                id: 'floating-container'
            }
        });
        const floating = container.querySelector('div');

        expect(floating).toHaveAttribute('id', 'floating-container');
    });

    test('forwards data attributes to div', () => {
        const { container } = render(Floating, {
            props: {
                'data-testid': 'floating-wrapper',
                'data-custom': 'custom-value'
            }
        });
        const floating = container.querySelector('div');

        expect(floating).toHaveAttribute('data-testid', 'floating-wrapper');
        expect(floating).toHaveAttribute('data-custom', 'custom-value');
    });

    test('forwards accessibility attributes to div', () => {
        const { container } = render(Floating, {
            props: {
                'aria-label': 'Floating form section',
                'aria-describedby': 'floating-help'
            }
        });
        const floating = container.querySelector('div');

        expect(floating).toHaveAttribute('aria-label', 'Floating form section');
        expect(floating).toHaveAttribute('aria-describedby', 'floating-help');
    });

    test('forwards title attribute to div', () => {
        const { container } = render(Floating, {
            props: {
                title: 'Floating label container'
            }
        });
        const floating = container.querySelector('div');

        expect(floating).toHaveAttribute('title', 'Floating label container');
    });

    test('renders with complex children content', () => {
        const children = createRawSnippet(() => ({
            render: () => `<div>
                <input type="email" placeholder="name@example.com" id="floatingEmail" />
                <label for="floatingEmail">Email address</label>
            </div>`
        }));

        const { container } = render(Floating, {
            props: { children }
        });

        expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
        expect(container.querySelector('label[for="floatingEmail"]')).toBeInTheDocument();
        expect(container.querySelector('input')).toHaveAttribute('placeholder', 'name@example.com');
        expect(container.querySelector('label')?.textContent).toContain('Email address');
    });

    test('handles empty children gracefully', () => {
        const { container } = render(Floating);
        const floating = container.querySelector('div');

        expect(floating).toHaveClass('form-floating');
        expect(floating?.textContent).toBe('');
    });

    test('supports role attribute for accessibility', () => {
        const { container } = render(Floating, {
            props: {
                role: 'group'
            }
        });
        const floating = container.querySelector('div');

        expect(floating).toHaveAttribute('role', 'group');
        expect(floating).toHaveClass('form-floating');
    });

    test('supports hidden attribute', () => {
        const { container } = render(Floating, {
            props: {
                hidden: true
            }
        });
        const floating = container.querySelector('div');

        expect(floating).toHaveAttribute('hidden');
        expect(floating).toHaveClass('form-floating');
    });

    test('renders with all props combined', () => {
        const children = createRawSnippet(() => ({
            render: () => `<div>
                <input type="text" placeholder="Enter text" id="floatingText" />
                <label for="floatingText">Text input</label>
            </div>`
        }));

        const { container } = render(Floating, {
            props: {
                children,
                id: 'main-floating',
                class: 'custom-floating-class',
                title: 'Main floating container',
                'data-testid': 'floating-element',
                'aria-label': 'Floating form group',
                role: 'group'
            }
        });
        const floating = container.querySelector('div.form-floating');

        expect(floating).toHaveClass('form-floating');
        expect(floating).toHaveClass('custom-floating-class');
        expect(floating).toHaveAttribute('id', 'main-floating');
        expect(floating).toHaveAttribute('title', 'Main floating container');
        expect(floating).toHaveAttribute('data-testid', 'floating-element');
        expect(floating).toHaveAttribute('aria-label', 'Floating form group');
        expect(floating).toHaveAttribute('role', 'group');
        expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
        expect(container.querySelector('label')).toBeInTheDocument();
    });

    test('always applies form-floating class regardless of other props', () => {
        const { container } = render(Floating, {
            props: {
                class: 'completely-different-class',
                id: 'test-id',
                'data-custom': 'custom'
            }
        });
        const floating = container.querySelector('div');

        expect(floating).toHaveClass('form-floating');
        expect(floating).toHaveClass('completely-different-class');
        expect(floating).toHaveAttribute('id', 'test-id');
        expect(floating).toHaveAttribute('data-custom', 'custom');
    });

    test('renders with input and label for typical floating label pattern', () => {
        const children = createRawSnippet(() => ({
            render: () => `<div>
                <input type="password" placeholder="Password" id="floatingPassword" />
                <label for="floatingPassword">Password</label>
            </div>`
        }));

        const { container } = render(Floating, {
            props: { children }
        });

        const floating = container.querySelector('div.form-floating');
        const input = container.querySelector('input[type="password"]');
        const label = container.querySelector('label');

        expect(floating).toBeInTheDocument();
        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('id', 'floatingPassword');
        expect(label).toHaveAttribute('for', 'floatingPassword');
        expect(input).toHaveAttribute('placeholder', 'Password');
        expect(label?.textContent).toContain('Password');
    });

    test('renders with textarea for floating label textarea pattern', () => {
        const children = createRawSnippet(() => ({
            render: () => `<div>
                <textarea placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                <label for="floatingTextarea">Comments</label>
            </div>`
        }));

        const { container } = render(Floating, {
            props: { children }
        });

        expect(container.querySelector('div.form-floating')).toBeInTheDocument();
        expect(container.querySelector('textarea')).toBeInTheDocument();
        expect(container.querySelector('label[for="floatingTextarea"]')).toBeInTheDocument();
        expect(container.querySelector('textarea')).toHaveAttribute('placeholder', 'Leave a comment here');
    });

    test('renders with select for floating label select pattern', () => {
        const children = createRawSnippet(() => ({
            render: () => `<div>
                <select id="floatingSelect">
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                </select>
                <label for="floatingSelect">Works with selects</label>
            </div>`
        }));

        const { container } = render(Floating, {
            props: { children }
        });

        expect(container.querySelector('div.form-floating')).toBeInTheDocument();
        expect(container.querySelector('select')).toBeInTheDocument();
        expect(container.querySelector('label[for="floatingSelect"]')).toBeInTheDocument();
        expect(container.querySelectorAll('option')).toHaveLength(3);
    });

    test('maintains form-floating class with various custom classes', () => {
        const customClasses = ['mb-3', 'custom-floating', 'has-validation', 'position-relative', 'form-group'];

        customClasses.forEach((customClass) => {
            const { container } = render(Floating, {
                props: {
                    class: customClass
                }
            });
            const floating = container.querySelector('div');

            expect(floating).toHaveClass('form-floating');
            expect(floating).toHaveClass(customClass);
        });
    });

    test('supports event handlers', () => {
        const { container } = render(Floating, {
            props: {
                onclick: () => {},
                onmouseenter: () => {},
                onmouseleave: () => {}
            }
        });
        const floating = container.querySelector('div');

        expect(floating).toBeInTheDocument();
        // Event handlers are attached but not easily testable without user interaction
    });

    test('supports tabindex attribute', () => {
        const { container } = render(Floating, {
            props: {
                tabindex: 0
            }
        });
        const floating = container.querySelector('div');

        expect(floating).toHaveAttribute('tabindex', '0');
    });

    test('renders correctly with no props', () => {
        const { container } = render(Floating);
        const floating = container.querySelector('div');

        expect(floating).toBeInTheDocument();
        expect(floating).toHaveClass('form-floating');
        expect(floating?.className).toBe('form-floating');
        expect(floating?.textContent).toBe('');
    });

    test('handles multiple children elements', () => {
        const children = createRawSnippet(() => ({
            render: () => `<div>
                <input type="email" placeholder="name@example.com" id="email" />
                <label for="email">Email</label>
                <div class="invalid-feedback">Please provide a valid email.</div>
            </div>`
        }));

        const { container } = render(Floating, {
            props: { children }
        });

        expect(container.querySelector('div.form-floating')).toBeInTheDocument();
        expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
        expect(container.querySelector('label')).toBeInTheDocument();
        expect(container.querySelector('.invalid-feedback')).toBeInTheDocument();
    });

    test('preserves Bootstrap floating label functionality structure', () => {
        const children = createRawSnippet(() => ({
            render: () => `<input type="text" class="form-control" placeholder="name@example.com" id="floatingInput" />`
        }));

        const { container } = render(Floating, {
            props: { children }
        });

        const floating = container.querySelector('div.form-floating');
        const input = container.querySelector('input.form-control');

        expect(floating).toBeInTheDocument();
        expect(input).toBeInTheDocument();

        // Verify the structure for Bootstrap floating labels
        expect(floating?.firstElementChild).toBe(input);
    });

    test('applies correct CSS class structure', () => {
        const { container } = render(Floating, {
            props: {
                class: 'mb-3 position-relative'
            }
        });
        const floating = container.querySelector('div');

        // Verify all expected classes are present
        expect(floating?.className).toContain('form-floating');
        expect(floating?.className).toContain('mb-3');
        expect(floating?.className).toContain('position-relative');

        // Verify form-floating is always first (due to uniqueClsx)
        const classes = floating?.className.split(' ');
        expect(classes?.[0]).toBe('form-floating');
    });
});

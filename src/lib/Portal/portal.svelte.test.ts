import { cleanup, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Portal from './portal.svelte';

// Test component to render inside the portal - using a function that returns HTML
const portalHtml: string = '<div data-testid="portal-content">Portal Content</div>';

describe('Portal Component', () => {
    let targetElement: HTMLElement;

    beforeEach(() => {
        // Create a target element to mount portal content into
        targetElement = document.createElement('div');
        targetElement.id = 'portal-target';
        document.body.appendChild(targetElement);
    });

    afterEach(() => {
        // Clean up the DOM after each test
        document.body.removeChild(targetElement);
        cleanup();
    });

    it('renders content in the target element', () => {
        // Render the portal component
        render(Portal, {
            props: {
                target: '#portal-target',
                children: createRawSnippet(() => ({
                    render: () => portalHtml
                }))
            }
        });

        // Check that the content is rendered in the target element
        const portalContent = targetElement.querySelector('[data-testid="portal-content"]');
        expect(portalContent).not.toBeNull();
        expect(portalContent?.textContent).toBe('Portal Content');
    });

    it('renders content inline when disabled is true', () => {
        // Render the portal component with disabled=true
        const { container } = render(Portal, {
            props: {
                target: '#portal-target',
                disabled: true,
                children: createRawSnippet(() => ({
                    render: () => portalHtml
                }))
            }
        });

        // Check that content is rendered inline (in the container) instead of in the target
        const portalContent = container.querySelector('[data-testid="portal-content"]');
        expect(portalContent).not.toBeNull();

        // Target element should be empty
        expect(targetElement.innerHTML).toBe('');
    });

    it('warns when target is not provided', () => {
        // Mock console.warn
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        // Render the portal without a target
        render(Portal, {
            // @ts-expect-error: Testing missing target prop
            props: {
                children: createRawSnippet(() => ({
                    render: () => portalHtml
                }))
            }
        });

        // Check that a warning was issued
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[Portal] target is not defined'));

        warnSpy.mockRestore();
    });

    it('warns when target element cannot be found', () => {
        // Mock console.warn
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        // Render the portal with a non-existent target
        render(Portal, {
            props: {
                children: createRawSnippet(() => ({
                    render: () => portalHtml
                })),
                target: '#non-existent-element'
            }
        });

        // Check that a warning was issued
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[Portal] Unable to find target element'));

        warnSpy.mockRestore();
    });

    it('accepts an Element reference as target', () => {
        // Render the portal with an Element reference
        render(Portal, {
            props: {
                children: createRawSnippet(() => ({
                    render: () => portalHtml
                })),
                target: targetElement
            }
        });

        // Check that the content is rendered in the target element
        const portalContent = targetElement.querySelector('[data-testid="portal-content"]');
        expect(portalContent).not.toBeNull();
    });

    it('unmounts content when component is destroyed', async () => {
        // Render the portal in a container we can control
        const { unmount } = render(Portal, {
            props: {
                children: createRawSnippet(() => ({
                    render: () => portalHtml
                })),
                target: '#portal-target'
            }
        });

        // Verify content is in target
        expect(targetElement.querySelector('[data-testid="portal-content"]')).not.toBeNull();

        // Unmount the component
        unmount();

        // Target should now be empty
        expect(targetElement.innerHTML).toBe('');
    });
});

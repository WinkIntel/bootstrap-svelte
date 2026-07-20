/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import Container from './container.svelte';
import type { ContainerBreakpoint, ContainerElementType, ContainerRootProps } from './types.js';

const renderContainerWithContent = (content: string, props: ContainerRootProps = {}) => {
    return render(Container, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => content
            }))
        }
    });
};

describe('Container.svelte', () => {
    test('renders a container with default properties', () => {
        renderContainerWithContent('Default Container');
        const container = screen.getByText('Default Container');

        // Check essential properties
        expect(container).toBeInTheDocument();
        expect(container).toHaveClass('container');
        expect(container?.tagName).toBe('DIV');
    });

    // Test for fluid container
    test('renders fluid container', () => {
        renderContainerWithContent('Fluid Container', { isFluid: true });
        const container = screen.getByText('Fluid Container');

        expect(container).toHaveClass('container-fluid');
        expect(container).not.toHaveClass('container');
    });

    // Test for breakpoint containers
    test.each([
        ['xs', 'container'],
        ['sm', 'container-sm'],
        ['md', 'container-md'],
        ['lg', 'container-lg'],
        ['xl', 'container-xl'],
        ['xxl', 'container-xxl']
    ])('renders container with %s breakpoint', (breakpoint, expectedClass) => {
        renderContainerWithContent(`${breakpoint.toUpperCase()} Container`, { breakpoint: breakpoint as ContainerBreakpoint });
        const container = screen.getByText(`${breakpoint.toUpperCase()} Container`);

        expect(container).toHaveClass(expectedClass);
        expect(container).not.toHaveClass('container-fluid');
    });

    // Test for custom ID
    test('renders with custom ID', () => {
        renderContainerWithContent('Custom ID Container', { id: 'custom-container-id' });
        const container = screen.getByText('Custom ID Container');

        expect(container).toHaveAttribute('id', 'custom-container-id');
    });

    // Test for custom class
    test('accepts and applies custom classes', () => {
        renderContainerWithContent('Custom Class Container', {
            class: 'custom-class another-class'
        });

        const container = screen.getByText('Custom Class Container');

        expect(container).toHaveClass('container');
        expect(container).toHaveClass('custom-class');
        expect(container).toHaveClass('another-class');
    });

    // Test for combined props
    test('combines multiple props correctly', () => {
        renderContainerWithContent('Complex Container', {
            isFluid: true,
            class: 'test-class',
            id: 'complex-container'
        });

        const container = screen.getByText('Complex Container');

        expect(container).toHaveClass('container-fluid');
        expect(container).toHaveClass('test-class');
        expect(container).toHaveAttribute('id', 'complex-container');
        expect(container).not.toHaveClass('container');
    });

    // Test for elementType property
    describe('elementType property', () => {
        // Test for default element type
        test('renders as a div by default', () => {
            const { container } = renderContainerWithContent('Default Element Container');
            const element = container.querySelector('.container');
            expect(element).not.toBeNull();
            expect(element?.tagName).toBe('DIV');
        });

        // Test each valid elementType
        test.each([
            ['article', 'ARTICLE'],
            ['aside', 'ASIDE'],
            ['div', 'DIV'],
            ['footer', 'FOOTER'],
            ['header', 'HEADER'],
            ['main', 'MAIN'],
            ['section', 'SECTION']
        ])('renders as %s when elementType="%s"', (elementType, expectedTag) => {
            const { container } = renderContainerWithContent(`${elementType.toUpperCase()} Container`, {
                elementType: elementType as ContainerElementType
            });

            // Find the container element
            const element = container.querySelector('.container');
            expect(element).not.toBeNull();
            expect(element?.tagName).toBe(expectedTag);
            expect(element?.textContent).toBe(`${elementType.toUpperCase()} Container`);
        });

        // Test elementType with other properties
        test('combines elementType with other properties correctly', () => {
            const { container } = renderContainerWithContent('Combined Properties', {
                elementType: 'section',
                isFluid: true,
                class: 'custom-section',
                id: 'test-section'
            });

            const element = container.querySelector('.container-fluid');
            expect(element).not.toBeNull();
            expect(element?.tagName).toBe('SECTION');
            expect(element).toHaveClass('custom-section');
            expect(element).toHaveAttribute('id', 'test-section');
        });
    });
});

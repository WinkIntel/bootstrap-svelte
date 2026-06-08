import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import { Offcanvas } from '../index.js';
import OffcanvasBasicTest from './offcanvas-basic-test.svelte';

describe('Offcanvas Component', () => {
    it('should render basic offcanvas with all sub-components', () => {
        render(OffcanvasBasicTest);

        // Check if offcanvas root component is rendered
        const offcanvas = screen.getByTestId('offcanvas');
        expect(offcanvas).toHaveClass('offcanvas');
        expect(offcanvas).toHaveClass('offcanvas-start');
        expect(offcanvas).toHaveClass('test-class');
        expect(offcanvas).toHaveAttribute('id', 'test-offcanvas');

        // Check if offcanvas header is rendered
        const header = screen.getByTestId('offcanvas-header');
        expect(header).toHaveClass('offcanvas-header');

        // Check if offcanvas title is rendered
        const title = screen.getByTestId('offcanvas-title');
        expect(title).toHaveClass('offcanvas-title');
        expect(title.tagName).toBe('H5'); // Default heading level is 5
        expect(title).toHaveTextContent('Offcanvas Title');

        // Check if offcanvas body is rendered
        const body = screen.getByTestId('offcanvas-body');
        expect(body).toHaveClass('offcanvas-body');

        // Check content in the body
        const content = screen.getByTestId('offcanvas-content');
        expect(content).toHaveTextContent('This is the offcanvas body content.');

        // Check close button in the body
        const closeButton = screen.getByTestId('close-button');
        expect(closeButton).toHaveClass('btn');
        expect(closeButton).toHaveClass('btn-secondary');
    });

    it('should render offcanvas with different placements', () => {
        // Render the test component
        render(OffcanvasBasicTest);

        // Check end placement
        const endOffcanvas = screen.getByTestId('end-offcanvas');
        expect(endOffcanvas).toHaveClass('offcanvas-end');
        expect(endOffcanvas).toHaveAttribute('id', 'end-offcanvas');

        // Check top placement
        const topOffcanvas = screen.getByTestId('top-offcanvas');
        expect(topOffcanvas).toHaveClass('offcanvas-top');
        expect(topOffcanvas).toHaveAttribute('id', 'top-offcanvas');

        // Check bottom placement
        const bottomOffcanvas = screen.getByTestId('bottom-offcanvas');
        expect(bottomOffcanvas).toHaveClass('offcanvas-bottom');
        expect(bottomOffcanvas).toHaveAttribute('id', 'bottom-offcanvas');
    });

    it('should render with different backdrop options', () => {
        render(OffcanvasBasicTest);

        // Static backdrop option
        const staticBackdrop = screen.getByTestId('static-backdrop');
        expect(staticBackdrop).toHaveClass('offcanvas');

        // No backdrop option
        const noBackdrop = screen.getByTestId('no-backdrop');
        expect(noBackdrop).toHaveClass('offcanvas');
    });

    it('should render responsive offcanvas with breakpoint class', () => {
        render(OffcanvasBasicTest);

        // Check responsive offcanvas with lg breakpoint
        const responsiveOffcanvas = screen.getByTestId('responsive');
        expect(responsiveOffcanvas).toHaveClass('offcanvas-lg');
        expect(responsiveOffcanvas).not.toHaveClass('offcanvas');
    });

    it('should create offcanvas with different props directly', () => {
        // Test with explicit props by directly rendering Offcanvas.Root
        const { container: smContainer } = render(Offcanvas.Root, { props: { isShown: true, showOnBreakpoint: 'sm' } });
        expect(smContainer.querySelector('.offcanvas-sm')).not.toBeNull();

        const { container: mdContainer } = render(Offcanvas.Root, { props: { isShown: true, showOnBreakpoint: 'md' } });
        expect(mdContainer.querySelector('.offcanvas-md')).not.toBeNull();

        const { container: xlContainer } = render(Offcanvas.Root, { props: { isShown: true, showOnBreakpoint: 'xl' } });
        expect(xlContainer.querySelector('.offcanvas-xl')).not.toBeNull();

        const { container: xxlContainer } = render(Offcanvas.Root, { props: { isShown: true, showOnBreakpoint: 'xxl' } });
        expect(xxlContainer.querySelector('.offcanvas-xxl')).not.toBeNull();
    });

    it('should apply custom classes to Offcanvas components', () => {
        const { container } = render(Offcanvas.Root, {
            props: {
                class: 'custom-offcanvas-class',
                isShown: true,
                placement: 'start'
            }
        });

        const offcanvas = container.querySelector('.offcanvas');
        expect(offcanvas).not.toBeNull();
        expect(offcanvas).toHaveClass('custom-offcanvas-class');
        expect(offcanvas).toHaveClass('offcanvas-start');
    });

    it('should render header with dismissible button when isDismissible is true', () => {
        render(OffcanvasBasicTest);

        const offcanvas = screen.getByTestId('offcanvas');
        const closeButton = offcanvas.querySelector('.btn-close');
        expect(closeButton).not.toBeNull();
        expect(closeButton).toHaveAttribute('aria-label', 'Close');
    });

    it('should render title with custom heading level', () => {
        const { container: h1Container } = render(Offcanvas.Title, {
            props: {
                level: 1,
                children: createRawSnippet(() => ({
                    render: () => 'H1 Title'
                }))
            }
        });

        const h1Title = h1Container.querySelector('h1');
        expect(h1Title).not.toBeNull();
        expect(h1Title).toHaveClass('offcanvas-title');
        expect(h1Title).toHaveTextContent('H1 Title');

        const { container: h3Container } = render(Offcanvas.Title, {
            props: {
                level: 3,
                children: createRawSnippet(() => ({
                    render: () => 'H3 Title'
                }))
            }
        });

        const h3Title = h3Container.querySelector('h3');
        expect(h3Title).not.toBeNull();
        expect(h3Title).toHaveClass('offcanvas-title');
        expect(h3Title).toHaveTextContent('H3 Title');
    });

    it('should have appropriate ARIA attributes when visible', () => {
        const { container } = render(Offcanvas.Root, {
            props: {
                isShown: true
            }
        });

        const offcanvas = container.querySelector('.offcanvas');
        expect(offcanvas).toHaveAttribute('aria-modal', 'true');
        expect(offcanvas).toHaveAttribute('role', 'dialog');
        expect(offcanvas).toHaveAttribute('tabindex', '-1');
    });
});

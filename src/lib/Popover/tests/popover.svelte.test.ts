import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { Popover } from '../index.js';
import PopoverBasicTest from './popover-basic-test.svelte';

describe('Popover Component', () => {
    it('should render basic popover with header and body', () => {
        render(PopoverBasicTest);

        // Check if popover root component is rendered
        const popover = screen.getByTestId('popover');
        expect(popover).toHaveClass('popover');
        expect(popover).toHaveClass('fade');
        expect(popover).toHaveClass('show');
        expect(popover).toHaveAttribute('id', 'test-popover');
        expect(popover).toHaveAttribute('role', 'tooltip');

        // Check if popover arrow is rendered
        const arrow = popover.querySelector('.popover-arrow');
        expect(arrow).not.toBeNull();

        // Check if popover header is rendered
        const header = screen.getByTestId('popover-header');
        expect(header).toHaveClass('popover-header');
        expect(header.tagName).toBe('H3'); // Default heading level is 3
        expect(header).toHaveTextContent('Popover Title');

        // Check if popover body is rendered
        const body = screen.getByTestId('popover-body');
        expect(body).toHaveClass('popover-body');

        // Check content in the body
        const bodyContent = screen.getByTestId('popover-content-text');
        expect(bodyContent).toHaveTextContent('This is the popover content.');
    });

    it('should render popovers with different triggers', () => {
        render(PopoverBasicTest);

        // Check hover trigger popover
        const hoverPopover = screen.getByTestId('hover-popover');
        expect(hoverPopover).toHaveClass('popover');
        const hoverHeader = screen.getByTestId('hover-popover-header');
        expect(hoverHeader).toHaveTextContent('Hover Popover');
        const hoverBody = screen.getByTestId('hover-popover-body');
        expect(hoverBody).toHaveTextContent('This popover appears on hover.');

        // Check focus trigger popover
        const focusPopover = screen.getByTestId('focus-popover');
        expect(focusPopover).toHaveClass('popover');
        const focusHeader = screen.getByTestId('focus-popover-header');
        expect(focusHeader).toHaveTextContent('Focus Popover');
        const focusBody = screen.getByTestId('focus-popover-body');
        expect(focusBody).toHaveTextContent('This popover appears on focus.');
    });

    it('should render popovers with different placements', () => {
        render(PopoverBasicTest);

        // Check top placement
        const topPopover = screen.getByTestId('top-popover');
        expect(topPopover).toHaveClass('popover');
        expect(topPopover).toHaveAttribute('data-popper-placement', 'top');
        // In a real DOM with rendered CSS, we would also check for bs-popover-top class

        // Check bottom placement
        const bottomPopover = screen.getByTestId('bottom-popover');
        expect(bottomPopover).toHaveClass('popover');
        expect(bottomPopover).toHaveAttribute('data-popper-placement', 'bottom');

        // Check left placement
        const leftPopover = screen.getByTestId('left-popover');
        expect(leftPopover).toHaveClass('popover');
        expect(leftPopover).toHaveAttribute('data-popper-placement', 'left');
    });

    it('should render popover without fade effect when useFade is false', () => {
        render(PopoverBasicTest);

        const noFadePopover = screen.getByTestId('no-fade-popover');
        expect(noFadePopover).toHaveClass('popover');
        expect(noFadePopover).not.toHaveClass('fade');
        expect(noFadePopover).toHaveClass('show');
    });

    it('should render popover header with custom heading level', () => {
        render(PopoverBasicTest);

        const customHeadingHeader = screen.getByTestId('custom-heading-header');
        expect(customHeadingHeader).toHaveClass('popover-header');
        expect(customHeadingHeader.tagName).toBe('H2'); // Custom heading level
        expect(customHeadingHeader).toHaveTextContent('H2 Heading');
    });

    it('should render popover in a custom container when container prop is provided', () => {
        render(PopoverBasicTest);

        const containerPopover = screen.getByTestId('container-popover');
        expect(containerPopover).toHaveClass('popover');
        expect(containerPopover).toHaveClass('show');

        // Check header and body content
        const containerHeader = screen.getByTestId('container-popover-header');
        expect(containerHeader).toHaveTextContent('Container Popover');
        const containerBody = screen.getByTestId('container-popover-body');
        expect(containerBody).toHaveTextContent('This popover is rendered in a custom container.');

        // Check that the popover is inside the custom container
        const customContainer = screen.getByTestId('custom-container');
        expect(customContainer).toBeDefined();
        expect(containerPopover.closest('#custom-container')).toBeTruthy();
    });

    // Additional tests for programmatic API (these would require Jest mocks and DOM events)

    it('should create a Root component with expected properties', () => {
        expect(Popover.Root).toBeDefined();
    });

    it('should create a Header component with expected properties', () => {
        expect(Popover.Header).toBeDefined();
    });

    it('should create a Body component with expected properties', () => {
        expect(Popover.Body).toBeDefined();
    });
});

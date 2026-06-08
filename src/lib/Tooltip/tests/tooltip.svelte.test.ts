import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../index.js';
import TooltipBasicTest from './tooltip-basic-test.svelte';

describe('Tooltip Component', () => {
    it('should render basic tooltip with inner content', () => {
        render(TooltipBasicTest);

        // Check if tooltip root component is rendered
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip).toHaveClass('tooltip');
        expect(tooltip).toHaveClass('fade');
        expect(tooltip).toHaveClass('show');
        expect(tooltip).toHaveAttribute('id', 'test-tooltip');
        expect(tooltip).toHaveAttribute('role', 'tooltip');

        // Check if tooltip arrow is rendered
        const arrow = tooltip.querySelector('.tooltip-arrow');
        expect(arrow).not.toBeNull();

        // Check if tooltip inner is rendered
        const inner = screen.getByTestId('tooltip-inner');
        expect(inner).toHaveClass('tooltip-inner');
        expect(inner).toHaveTextContent('This is a tooltip');
    });

    it('should render tooltips with different triggers', () => {
        render(TooltipBasicTest);

        // Check click trigger tooltip
        const clickTooltip = screen.getByTestId('click-tooltip');
        expect(clickTooltip).toHaveClass('tooltip');
        const clickInner = screen.getByTestId('click-tooltip-inner');
        expect(clickInner).toHaveTextContent('This tooltip appears on click');

        // Check focus trigger tooltip
        const focusTooltip = screen.getByTestId('focus-tooltip');
        expect(focusTooltip).toHaveClass('tooltip');
        const focusInner = screen.getByTestId('focus-tooltip-inner');
        expect(focusInner).toHaveTextContent('This tooltip appears on focus');
    });

    it('should render tooltips with different placements', () => {
        render(TooltipBasicTest);

        // Check top placement
        const topTooltip = screen.getByTestId('top-tooltip');
        expect(topTooltip).toHaveClass('tooltip');
        expect(topTooltip).toHaveAttribute('data-popper-placement', 'top');
        // In a real DOM with rendered CSS, we would also check for bs-tooltip-top class

        // Check bottom placement
        const bottomTooltip = screen.getByTestId('bottom-tooltip');
        expect(bottomTooltip).toHaveClass('tooltip');
        expect(bottomTooltip).toHaveAttribute('data-popper-placement', 'bottom');

        // Check left placement
        const leftTooltip = screen.getByTestId('left-tooltip');
        expect(leftTooltip).toHaveClass('tooltip');
        expect(leftTooltip).toHaveAttribute('data-popper-placement', 'left');
    });

    it('should render tooltip without fade effect when useFade is false', () => {
        render(TooltipBasicTest);

        const noFadeTooltip = screen.getByTestId('no-fade-tooltip');
        expect(noFadeTooltip).toHaveClass('tooltip');
        expect(noFadeTooltip).not.toHaveClass('fade');
        expect(noFadeTooltip).toHaveClass('show');
    });

    it('should render tooltip in a custom container when container prop is provided', () => {
        render(TooltipBasicTest);

        const containerTooltip = screen.getByTestId('container-tooltip');
        expect(containerTooltip).toHaveClass('tooltip');
        expect(containerTooltip).toHaveClass('show');

        // Check inner content
        const containerInner = screen.getByTestId('container-tooltip-inner');
        expect(containerInner).toHaveTextContent('This tooltip is rendered in a custom container');

        // Check that the tooltip is inside the custom container
        const customContainer = screen.getByTestId('custom-container');
        expect(customContainer).toBeDefined();
        expect(containerTooltip.closest('#custom-container')).toBeTruthy();
    });

    // Test for specific tooltip features that differ from popover

    it('should have default placement of top for tooltips', () => {
        render(TooltipBasicTest);

        // The default for tooltips should be 'top' (while for popovers it's 'right')
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip).toHaveAttribute('data-popper-placement', 'top');
    });

    // Additional tests for programmatic API (these would require Jest mocks and DOM events)

    it('should create a Root component with expected properties', () => {
        expect(Tooltip.Root).toBeDefined();
    });

    it('should create an Inner component with expected properties', () => {
        expect(Tooltip.Inner).toBeDefined();
    });
});

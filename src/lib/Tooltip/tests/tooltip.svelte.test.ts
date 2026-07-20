import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import TooltipBasicTest from './tooltip-basic-test.svelte';
import TooltipMixedTriggerTest from './tooltip-mixed-trigger-test.svelte';
import TooltipSpecialIdTest from './tooltip-special-id-test.svelte';

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
        expect(containerTooltip.closest('#custom-container')).toBeTruthy();
    });

    // Test for specific tooltip features that differ from popover

    it('should have default placement of top for tooltips', () => {
        render(TooltipBasicTest);

        // The default for tooltips should be 'top' (while for popovers it's 'right')
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip).toHaveAttribute('data-popper-placement', 'top');
    });
});

describe('Tooltip mixed triggers', () => {
    it('keeps the default hover-focus tooltip open until both triggers end', async () => {
        render(TooltipMixedTriggerTest);

        const trigger = screen.getByTestId('default-tooltip-trigger');

        await fireEvent.mouseEnter(trigger);
        await fireEvent.focusIn(trigger);
        expect(screen.getByTestId('default-tooltip')).toBeInTheDocument();

        await fireEvent.mouseLeave(trigger);
        expect(screen.getByTestId('default-tooltip')).toBeInTheDocument();

        await fireEvent.focusOut(trigger);
        expect(screen.queryByTestId('default-tooltip')).not.toBeInTheDocument();

        await fireEvent.focusIn(trigger);
        await fireEvent.mouseEnter(trigger);
        await fireEvent.focusOut(trigger);
        expect(screen.getByTestId('default-tooltip')).toBeInTheDocument();

        await fireEvent.mouseLeave(trigger);
        expect(screen.queryByTestId('default-tooltip')).not.toBeInTheDocument();
    });

    it('clears inactive trigger state when the configured triggers change', async () => {
        render(TooltipMixedTriggerTest);

        const trigger = screen.getByTestId('mixed-tooltip-trigger');
        await fireEvent.mouseEnter(trigger);
        expect(screen.getByTestId('mixed-tooltip')).toBeInTheDocument();

        await fireEvent.click(screen.getByTestId('set-tooltip-focus-trigger'));
        expect(screen.queryByTestId('mixed-tooltip')).not.toBeInTheDocument();

        await fireEvent.focusIn(trigger);
        expect(screen.getByTestId('mixed-tooltip')).toBeInTheDocument();
        await fireEvent.focusOut(trigger);
        expect(screen.queryByTestId('mixed-tooltip')).not.toBeInTheDocument();
    });

    it('preserves focus activity when hover is removed from the configured triggers', async () => {
        render(TooltipMixedTriggerTest);

        const trigger = screen.getByTestId('mixed-tooltip-trigger');
        trigger.focus();
        await fireEvent.focusIn(trigger);
        expect(screen.getByTestId('mixed-tooltip')).toBeInTheDocument();

        await fireEvent.click(screen.getByTestId('set-tooltip-focus-trigger'));
        expect(screen.getByTestId('mixed-tooltip')).toBeInTheDocument();

        await fireEvent.focusOut(trigger);
        expect(screen.queryByTestId('mixed-tooltip')).not.toBeInTheDocument();
    });

    it('shows when focus is added while the reference is already focused', async () => {
        render(TooltipMixedTriggerTest);

        const trigger = screen.getByTestId('mixed-tooltip-trigger');
        await fireEvent.click(screen.getByTestId('set-tooltip-hover-trigger'));
        trigger.focus();
        expect(screen.queryByTestId('mixed-tooltip')).not.toBeInTheDocument();

        await fireEvent.click(screen.getByTestId('add-tooltip-focus-trigger'));
        expect(screen.getByTestId('mixed-tooltip')).toBeInTheDocument();
    });

    it('shows when hover is enabled while the pointer is already over the reference', async () => {
        render(TooltipMixedTriggerTest);

        const trigger = screen.getByTestId('mixed-tooltip-trigger');
        await fireEvent.click(screen.getByTestId('set-tooltip-focus-trigger'));
        vi.spyOn(trigger, 'matches').mockImplementation((selector) => selector === ':hover');

        await fireEvent.click(screen.getByTestId('add-tooltip-focus-trigger'));
        expect(screen.getByTestId('mixed-tooltip')).toBeInTheDocument();
    });
});

describe('Tooltip Reference Element With Special-Character Id', () => {
    it('should bind to the reference element and show on trigger when its id contains a dot', async () => {
        render(TooltipSpecialIdTest);

        // Before any interaction, the tooltip should not be in the DOM (isShown defaults to false).
        expect(screen.queryByTestId('dotted-id-tooltip')).not.toBeInTheDocument();

        const trigger = screen.getByTestId('dotted-id-trigger');
        await fireEvent.click(trigger);

        // If the reference element lookup had silently failed (the old `querySelector`
        // behavior for a dotted id), no click listener would ever have been attached and
        // the tooltip would never show.
        const tooltip = screen.getByTestId('dotted-id-tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveClass('show');
    });
});

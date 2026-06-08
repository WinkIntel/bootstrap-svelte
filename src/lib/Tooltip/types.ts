import type { DivElement, PopperPlacement } from '$lib/common/types.js';

/**
 * Defines where the tooltip should be appended in the DOM
 * - string: CSS selector for the container element
 * - HTMLElement: Direct reference to a DOM element
 * - false: Stays within natural DOM placement (no portal/teleport)
 */
export type TooltipContainer = string | HTMLElement | false;

// TooltipPlacement inherits from PopperPlacement for positioning options
export type TooltipPlacement = PopperPlacement;

/**
 * Specifies what user interaction will activate the tooltip
 * - 'click': Shows on click, hides on second click
 * - 'hover': Shows on mouseenter, hides on mouseleave
 * - 'focus': Shows on element focus, hides on blur
 * - 'manual': Programmatic control only via isShown prop
 */
export type TooltipTrigger = 'click' | 'hover' | 'focus' | 'manual';

/**
 * Determines visual style and behavior variant
 * - 'tooltip': Smaller, simpler style for brief hints
 * - 'popover': Larger with styled header/body areas for more content
 */
export type TooltipType = 'tooltip' | 'popover';

export type TooltipRootProps = DivElement & {
    container?: TooltipContainer;
    isShown?: boolean;
    onHide?: EventListener; // Triggered when hide transition begins
    onHidden?: EventListener; // Triggered when tooltip is completely hidden
    onShow?: EventListener; // Triggered when show transition begins
    onShown?: EventListener; // Triggered when tooltip is completely visible
    placement?: TooltipPlacement;
    referenceElementId?: string; // ID of the element tooltip is attached to
    trigger?: TooltipTrigger | string; // Accepts space-separated values (e.g., 'hover focus')
    type?: TooltipType;
    useFade?: boolean; // Whether to use fade transition effect
};

/**
 * Props for the inner content of the tooltip
 * Uses type to adjust styling based on tooltip or popover variant
 */
export type TooltipInnerProps = DivElement & {
    type?: TooltipType;
};

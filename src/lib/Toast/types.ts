import type { DivElement } from '$lib/common/types.js';

/**
 * Specifies the position of toasts within a container
 *
 * The naming convention follows a two-part structure:
 * - Vertical position: top, middle, bottom
 * - Horizontal position: start, center, end (respects RTL/LTR direction)
 */
export type ToastPlacement =
    'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'middle-center' | 'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

/**
 * Transforms the placement type into a Bootstrap class string.
 * @param placement the placement of the toast
 * @returns the corresponding Bootstrap class string
 */
export const transformToastPlacement = (placement: ToastPlacement): string => {
    const placementTypeToClassMap = {
        'top-start': 'top-0 start-0',
        'top-center': 'top-0 start-50 translate-middle-x',
        'top-end': 'top-0 end-0',
        'middle-start': 'top-50 start-0 translate-middle-y',
        'middle-center': 'top-50 start-50 translate-middle',
        'middle-end': 'top-50 end-0 translate-middle-y',
        'bottom-start': 'bottom-0 start-0',
        'bottom-center': 'bottom-0 start-50 translate-middle-x',
        'bottom-end': 'bottom-0 end-0'
    };
    return placementTypeToClassMap[placement];
};

/**
 * Props for the main Toast component
 *
 * Controls visibility, animation, timing, and lifecycle events
 */
export type ToastRootProps = DivElement & {
    delay?: number; // Time in milliseconds before the toast auto-hides
    doAutohide?: boolean; // Whether toast should disappear automatically after delay
    isShown?: boolean; // Controls the visibility state of the toast
    onHide?: EventListener; // Triggered when hide animation begins
    onHidden?: EventListener; // Triggered when toast is completely hidden
    onShow?: EventListener; // Triggered when show animation begins
    onShown?: EventListener; // Triggered when toast is completely visible
    useFade?: boolean; // Whether to use fade transition effect
};

/**
 * Props for the Toast header section
 *
 * Contains title and optional close button
 */
export type ToastHeaderProps = DivElement & {
    isDismissible?: boolean; // Whether to show a close button in the header
};

/**
 * Props for the Toast body content
 *
 * Contains the main toast message
 */
export type ToastBodyProps = DivElement;

/**
 * Props for the Toast container component
 *
 * Manages multiple toasts with positioning control
 */
export type ToastContainerProps = DivElement & {
    isFixed?: boolean; // Whether container uses fixed positioning
    placement?: ToastPlacement; // Position within viewport or parent element
};

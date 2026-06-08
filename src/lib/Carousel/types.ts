import type { ButtonElement, DivElement } from '$lib/common/types.js';

/**
 * Controls the transition effect between carousel items
 * - 'none': No animation (immediate change)
 * - 'slide': Standard horizontal sliding transition
 * - 'fade': Opacity transition without horizontal movement
 * - 'crossfade': Cross-dissolve between slides
 */
export type CarouselAnimation = 'none' | 'slide' | 'fade' | 'crossfade';

/**
 * Denotes the relative position of a carousel item during transitions
 */
export type CarouselItemOrder = 'next' | 'prev';

/**
 * Specifies the direction of movement for carousel transitions
 * - 'start': Move toward the start (right-to-left in LTR, left-to-right in RTL)
 * - 'end': Move toward the end (left-to-right in LTR, right-to-left in RTL)
 */
export type CarouselItemDirection = 'start' | 'end';

/**
 * Controls auto-cycling behavior
 * - true: Enable auto-cycling with default settings
 * - false: Disable auto-cycling
 * - 'carousel': Enable auto-cycling with Bootstrap's standard behavior
 */
export type CarouselRide = boolean | 'carousel';

/**
 * Determines what pauses the carousel's cycling
 * - 'hover': Pause when mouse hovers over carousel
 * - false: Don't pause on hover
 */
export type CarouselPause = 'hover' | false;

/**
 * Root carousel container properties
 * Controls overall carousel behavior including animation type and timing
 */
export type CarouselRootProps = DivElement & {
    animation?: CarouselAnimation;
    interval?: number; // Time between item transitions in milliseconds
    pause?: CarouselPause;
    ride?: CarouselRide;
    transitionDuration?: number; // Duration of transition animation in milliseconds
};

/**
 * Container for carousel items that manages the sliding surface
 */
export type CarouselInnerProps = DivElement;

/**
 * Individual carousel slide properties
 */
export type CarouselItemProps = DivElement & {
    isActive?: boolean; // Whether this item is currently displayed
    interval?: number; // Override parent carousel's interval for this specific item
    onSlide?: EventListener; // Fired when slide transition starts
    onSlid?: EventListener; // Fired when slide transition completes
};

/**
 * Container for optional caption text within carousel items
 */
export type CarouselCaptionProps = DivElement;

/**
 * Container for the indicator dots/buttons showing current position
 */
export type CarouselIndicatorsProps = DivElement;

/**
 * Individual indicator button properties
 */
export type CarouselIndicatorButtonProps = ButtonElement & {
    ariaLabel?: string; // Accessibility label for screen readers
};

/**
 * Properties for previous/next navigation controls
 */
export type CarouselControlProps = ButtonElement;

import type { BaseColorVariant, DivElement } from '$lib/common/types.js';

/**
 * Color variants for the Progress component's background.
 * Uses the same color scheme as Bootstrap's base color variants.
 */
export type ProgressBackgroundColorVariant = BaseColorVariant;

/**
 * Props for stacked progress bars, allowing multiple bars to be
 * combined in a single progress component.
 */
export type ProgressStackedProps = DivElement;

/**
 * Props for the main Progress component.
 * Follows the WAI-ARIA pattern for progress indicators. Numeric value attributes
 * (min, max, now) are present only for determinate bars. Explicit aria-valuetext
 * remains consumer-controlled and should be updated or omitted when the mode changes.
 */
export type ProgressProps = DivElement & {
    /** Accessible label for screen readers describing the progress bar */
    ariaLabel?: string;
    /** Color variant for the progress track (background) */
    backgroundColorVariant?: ProgressBackgroundColorVariant;
    /** Props passed to the inner progress bar element */
    barProps?: ProgressBarProps;
    /** Omit numeric value ARIA attributes and computed widths for unknown progress (defaults to false). Consumer styles and explicit aria-valuetext are preserved. */
    isIndeterminate?: boolean;
    /** Maximum value of the progress bar (defaults to 100) */
    valueMax?: number;
    /** Minimum value of the progress bar (defaults to 0) */
    valueMin?: number;
    /** Current value of the progress bar, used to calculate the percentage completion */
    valueNow?: number;
};

/**
 * Props for the inner bar element of the Progress component.
 * Allows customization of the actual progress indicator.
 */
export type ProgressBarProps = DivElement & {
    /** Apply a striped pattern to the progress bar */
    isStriped?: boolean;
    /** Apply an animated effect to the striped progress bar */
    isAnimated?: boolean;
};

import type { BackgroundSubtleColorVariant, SpanElement, TextBackgroundColorVariant } from '$lib/common/types.js';

/**
 * Available visual variants for badges, supporting both standard and subtle color schemes.
 */
export type BadgeColorVariant = TextBackgroundColorVariant | BackgroundSubtleColorVariant;

/**
 * Defines the possible positioning options for badges when used as positioned elements.
 * Follows a "vertical-horizontal" naming pattern to indicate placement.
 */
export type BadgePosition =
    | 'top-start'
    | 'top-middle'
    | 'top-end'
    | 'middle-start'
    | 'middle-middle'
    | 'middle-end'
    | 'bottom-start'
    | 'bottom-middle'
    | 'bottom-end';

/**
 * Props for the Badge component root element.
 * Extends standard span element properties with Badge-specific options.
 */
export type BadgeRootProps = SpanElement & {
    colorVariant?: BadgeColorVariant;
    isPill?: boolean;
    position?: BadgePosition;
};

/**
 * Transforms a logical badge position value into the corresponding Bootstrap CSS classes.
 * Returns a string with position-absolute class combined with the specific positioning
 * and translation classes required for proper badge placement.
 *
 * @param position - The logical position descriptor for the badge
 * @returns - Bootstrap CSS classes that implement the requested position
 */
export const transformBadgePosition = (position: BadgePosition) => {
    // Map logical position names to their corresponding Bootstrap utility classes
    const positionTypeToClassMap = {
        'top-start': 'top-0 start-0',
        'top-middle': 'top-0 start-50',
        'top-end': 'top-0 start-100',
        'middle-start': 'top-50 start-0',
        'middle-middle': 'top-50 start-50',
        'middle-end': 'top-50 start-100',
        'bottom-start': 'top-100 start-0',
        'bottom-middle': 'top-100 start-50',
        'bottom-end': 'top-100 start-100'
    };
    const positionClass = positionTypeToClassMap[position];
    return `position-absolute ${positionClass} translate-middle`;
};

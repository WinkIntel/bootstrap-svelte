import { hasAttribute, isRTL, setAttribute } from './dom.js';

const SCROLLBAR_INITIAL_OVERFLOW = 'data-scrollbar-initial-overflow-value';
const SCROLLBAR_INITIAL_PADDING = 'data-scrollbar-initial-padding-value';

/**
 * Calculates the width of the browser's scrollbar
 *
 * @returns {number} The width of the scrollbar in pixels
 */
export const getScrollbarWidth = (): number => {
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
};

/**
 * Disables body scrolling by setting overflow to hidden and
 * adjusting padding to prevent layout shift from scrollbar removal
 *
 * @param {HTMLElement} bodyElement - The body element to disable scrolling on
 */
export const disableBodyScrolling = (bodyElement: HTMLElement): void => {
    const paddingPropName = isRTL() ? 'padding-left' : 'padding-right';
    const scrollbarWidth = getScrollbarWidth();
    // Save initial style values as data attributes
    const initialOverflow = bodyElement.style.getPropertyValue('overflow');
    const initialPadding = bodyElement.style.getPropertyValue(paddingPropName);

    setAttribute(bodyElement, SCROLLBAR_INITIAL_OVERFLOW, initialOverflow);
    setAttribute(bodyElement, SCROLLBAR_INITIAL_PADDING, initialPadding);

    // Set the overflow to hidden and add padding-right to prevent layout shift
    const newPaddingRight = parseInt(initialPadding || '0', 10) + scrollbarWidth;
    bodyElement.style.setProperty('overflow', 'hidden');
    bodyElement.style.setProperty(paddingPropName, `${newPaddingRight}px`);
};

/**
 * Restores body scrolling by resetting overflow and padding-right to their
 * original values before scrolling was disabled
 *
 * @param {HTMLElement} bodyElement - The body element to restore scrolling on
 */
export const resetBodyScrolling = (bodyElement: HTMLElement): void => {
    // Skip reset if data attributes aren't present (scrolling was never disabled)
    if (!hasAttribute(bodyElement, SCROLLBAR_INITIAL_OVERFLOW) || !hasAttribute(bodyElement, SCROLLBAR_INITIAL_PADDING)) {
        return;
    }

    // Get the initial values from the data attributes
    const initialOverflow = bodyElement.getAttribute(SCROLLBAR_INITIAL_OVERFLOW);
    const initialPadding = bodyElement.getAttribute(SCROLLBAR_INITIAL_PADDING);

    // Reset the overflow and padding-right values to their initial values
    const paddingPropName = isRTL() ? 'padding-left' : 'padding-right';
    bodyElement.style.setProperty('overflow', initialOverflow || '');
    bodyElement.style.setProperty(paddingPropName, initialPadding || '');

    // Remove the data attributes
    bodyElement.removeAttribute(SCROLLBAR_INITIAL_OVERFLOW);
    bodyElement.removeAttribute(SCROLLBAR_INITIAL_PADDING);
};

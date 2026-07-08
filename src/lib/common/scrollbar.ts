import { hasAttribute, isRTL, setAttribute } from './dom.js';

const SCROLLBAR_INITIAL_OVERFLOW = 'data-scrollbar-initial-overflow-value';
const SCROLLBAR_INITIAL_PADDING = 'data-scrollbar-initial-padding-value';
const SCROLLBAR_LOCK_COUNT = 'data-scrollbar-lock-count';

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
 * @remarks Prefer {@link acquireBodyScrollLock} in library code — calling
 * this directly is not safe when multiple overlays may lock scrolling at
 * once, since a second call overwrites the saved "original" values.
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
 * @remarks Prefer {@link releaseBodyScrollLock} in library code — pairing
 * this directly with {@link disableBodyScrolling} corrupts scroll state
 * when more than one overlay locks scrolling at the same time.
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

/**
 * Acquires a body scroll lock. The first acquisition disables scrolling;
 * nested acquisitions only increment the count.
 *
 * @param {HTMLElement} bodyElement - The body element to lock scrolling on
 * @returns {number} the lock count after acquiring
 */
export const acquireBodyScrollLock = (bodyElement: HTMLElement): number => {
    const count = parseInt(bodyElement.getAttribute(SCROLLBAR_LOCK_COUNT) ?? '0', 10) + 1;
    bodyElement.setAttribute(SCROLLBAR_LOCK_COUNT, `${count}`);
    if (count === 1) {
        disableBodyScrolling(bodyElement);
    }
    return count;
};

/**
 * Releases a body scroll lock. Scrolling is restored only when the last
 * holder releases. Releasing with no lock held is a no-op.
 *
 * @param {HTMLElement} bodyElement - The body element to unlock scrolling on
 * @returns {number} the lock count after releasing
 */
export const releaseBodyScrollLock = (bodyElement: HTMLElement): number => {
    const current = parseInt(bodyElement.getAttribute(SCROLLBAR_LOCK_COUNT) ?? '0', 10);
    if (current <= 0) {
        return 0;
    }
    const count = current - 1;
    if (count === 0) {
        bodyElement.removeAttribute(SCROLLBAR_LOCK_COUNT);
        resetBodyScrolling(bodyElement);
    } else {
        bodyElement.setAttribute(SCROLLBAR_LOCK_COUNT, `${count}`);
    }
    return count;
};

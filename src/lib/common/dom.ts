/**
 * Gets the value of an attribute from an HTML element
 * @param element - The HTML element
 * @param attribute - The attribute name
 * @returns The attribute value or null if not found
 */
export const getAttribute = (element: HTMLElement | null | undefined, attribute: string): string | null => {
    if (!element) {
        return null;
    }
    return element.getAttribute(attribute);
};

/**
 * Checks if an HTML element has a specific attribute
 * @param element - The HTML element
 * @param attribute - The attribute name
 * @returns Whether the element has the attribute
 */
export const hasAttribute = (element: HTMLElement | null | undefined, attribute: string): boolean => {
    if (!element) {
        return false;
    }
    return element.hasAttribute(attribute);
};

/**
 * Checks if the given element has focus.
 * @param element - The HTML element to check
 * @returns {boolean} True if the element has focus, false otherwise
 */
export const hasFocus = (element: HTMLElement | null | undefined): boolean => {
    if (!element) {
        return false;
    }
    return element === document.activeElement;
};

/**
 * Checks if an HTML element is disabled.
 * @param element - The HTML element to check
 * @returns {boolean} True if the element is disabled, false otherwise.
 */
export const isDisabled = (element: HTMLElement | null | undefined): boolean => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
    }

    if (element.classList.contains('disabled')) {
        return true;
    }

    // Check if it's an input, button, or other element with a disabled property
    if ('disabled' in element) {
        return (element as HTMLButtonElement | HTMLInputElement).disabled;
    }

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};

/**
 * Checks if the document is in RTL (right-to-left) mode
 * @returns {boolean} True if the document is in RTL mode, false otherwise
 */
export const isRTL = (): boolean => typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

/**
 * Removes an attribute from an HTML element
 * @param element - The HTML element
 * @param attribute - The attribute name
 */
export const removeAttribute = (element: HTMLElement | null | undefined, attribute: string): void => {
    if (!element) {
        return;
    }
    element.removeAttribute(attribute);
};

/**
 * Sets an attribute on an HTML element
 * @param element - The HTML element
 * @param attribute - The attribute name
 * @param value - The attribute value
 */
export const setAttribute = (element: HTMLElement | null | undefined, attribute: string, value: string): void => {
    if (!element) {
        return;
    }
    element.setAttribute(attribute, value);
};

/**
 * Toggles an attribute on an HTML element
 * @param element - The HTML element
 * @param attribute - The attribute name
 * @param defaultValue - The default value to set when adding the attribute
 */
export const toggleAttribute = (element: HTMLElement | null | undefined, attribute: string, defaultValue: string = ''): void => {
    if (!element) {
        return;
    }
    if (hasAttribute(element, attribute)) {
        removeAttribute(element, attribute);
    } else {
        setAttribute(element, attribute, defaultValue);
    }
};

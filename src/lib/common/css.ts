import BezierEasing, { type EasingFunction } from 'bezier-easing';
import clsx from 'clsx';

/**
 * This easing function will match the CSS `ease-in-out` easing function using a cubic Bezier curve defined by the points (0.25, 0.1, 0.25, 1).
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function#ease
 * @returns {EasingFunction} The easing function: (input: number): number;
 */
export const ease: EasingFunction = BezierEasing(0.25, 0.1, 0.25, 1);

/**
 * This easing function will match the CSS `ease-in-out` easing function using a cubic Bezier curve defined by the points (0.42, 0, 1, 1).
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function#ease-in
 * @returns {EasingFunction} The easing function: (input: number): number;
 */
export const easeIn: EasingFunction = BezierEasing(0.42, 0, 1, 1);

/**
 * This easing function will match the CSS `ease-in-out` easing function using a cubic Bezier curve defined by the points (0, 0, 0.58, 1).
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function#ease-out
 * @returns {EasingFunction} The easing function: (input: number): number;
 */
export const easeOut: EasingFunction = BezierEasing(0, 0, 0.58, 1);

/**
 * This easing function will match the CSS `ease-in-out` easing function using a cubic Bezier curve defined by the points (0.42, 0, 0.58, 1).
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function#ease-in-out
 * @returns {EasingFunction} The easing function: (input: number): number;
 */
export const easeInOut: EasingFunction = BezierEasing(0.42, 0, 0.58, 1);

/**
 * This easing function will match the CSS `cubic-bezier()` easing function using a cubic Bezier curve defined by the points (0, 0, 1, 1).
 * @param x1 A number between 0 and 1 that defines the x-coordinate of the first control point of the cubic Bezier curve.
 * @param y1 A number between 0 and 1 that defines the y-coordinate of the first control point of the cubic Bezier curve.
 * @param x2 A number between 0 and 1 that defines the x-coordinate of the second control point of the cubic Bezier curve.
 * @param y2 A number between 0 and 1 that defines the y-coordinate of the second control point of the cubic Bezier curve.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/cubic-bezier
 * @returns {EasingFunction} The easing function: (input: number): number;
 */
export const cubicBezier = (x1: number, y1: number, x2: number, y2: number): EasingFunction => {
    return BezierEasing(x1, y1, x2, y2);
};

/**
 * A utility function that wraps the `clsx` function to remove duplicate class names and reserve the order of appearance.
 * @param args - The same input parameters as the `clsx` function.
 * @returns A string containing unique class names.
 */
export function uniqueClsx(...args: Parameters<typeof clsx>): string {
    const classString = clsx(...args);

    // Early return for empty strings
    if (!classString) {
        return '';
    }

    // Using a regex split will normalize whitespace and split simultaneously...
    const classes = classString.split(/\s+/);
    const seen = new Set<string>();
    const result: string[] = [];

    for (let i = 0; i < classes.length; i++) {
        const cls = classes[i];
        if (cls && !seen.has(cls)) {
            seen.add(cls);
            result.push(cls);
        }
    }

    return result.join(' ');
}

export type CSSProperties = {
    [key: string]: string | number;
};

/**
 * Converts a JavaScript style object to a CSS string
 * @param {CSSProperties} styleObj - Object with camelCase style properties
 * @returns {string} CSS string with kebab-case properties
 *
 * @example
 * const styleObj = {
 *     backgroundColor: 'red',
 *     fontSize: '16px',
 *     marginTop: '10px'
 * };
 * const cssString = toStyle(styleObj);
 * console.log(cssString); // "background-color: red; font-size: 16px; margin-top: 10px"
 */
export function toStyle(styleObj: CSSProperties): string {
    if (!styleObj || typeof styleObj !== 'object') {
        return '';
    }

    return Object.entries(styleObj)
        .map(([key, value]) => {
            // Convert camelCase to kebab-case (e.g., flexDirection to flex-direction)
            const kebabKey = key.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
            return `${kebabKey}: ${value}`;
        })
        .join(';');
}

/**
 * Converts a CSS string to a JavaScript style object
 * @param {string|null|undefined} cssString - CSS string with kebab-case properties
 * @returns {CSSProperties} Object with camelCase style properties
 *
 * @example
 * const cssString = "background-color: red; font-size: 16px; margin-top: 10px";
 * const styleObj = fromStyle(cssString);
 * console.log(styleObj); // { backgroundColor: 'red', fontSize: '16px', marginTop: '10px' }
 */
export function fromStyle(cssString: string | null | undefined): CSSProperties {
    if (!cssString || typeof cssString !== 'string') {
        return {};
    }

    const styleObj: CSSProperties = {};

    // Split the string by semicolons and process each style declaration
    cssString.split(';').forEach((declaration) => {
        // Skip empty declarations
        if (!declaration.trim()) {
            return;
        }

        // Split the declaration into property and value
        const [property, ...valueParts] = declaration.split(':');

        // Handle case where there might be colons in the value (like in data URLs)
        const value = valueParts.join(':').trim();
        const trimmedProperty = property?.trim();

        if (!trimmedProperty || !value) {
            return;
        }

        let camelProperty: string;

        // Special handling for CSS custom properties (variables)
        if (trimmedProperty.startsWith('--')) {
            // Keep CSS variables as-is, don't convert to camelCase
            camelProperty = trimmedProperty;
        } else {
            // Convert kebab-case to camelCase (e.g., flex-direction to flexDirection)
            camelProperty = trimmedProperty.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        }

        // Try to convert numeric strings to numbers, but not for CSS variables or var() functions
        const parsedValue = !isNaN(Number(value)) && value.trim() !== '' && !value.includes('var(') ? Number(value) : value;

        styleObj[camelProperty] = parsedValue;
    });

    return styleObj;
}

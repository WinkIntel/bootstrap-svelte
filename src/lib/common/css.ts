import BezierEasing from 'bezier-easing';
import type clsx from 'clsx';

type ClassValue = Parameters<typeof clsx>[number];
type EasingFunction = ReturnType<typeof BezierEasing>;

const whitespacePattern = /\s/;
const classTokenPattern = /\S+/g;

function appendClassTokens(result: string[], seenTokens: Set<string>, value: string | number): void {
    const classValue = typeof value === 'string' ? value : String(value);

    if (!classValue) {
        return;
    }

    if (!whitespacePattern.test(classValue)) {
        if (!seenTokens.has(classValue)) {
            seenTokens.add(classValue);
            result.push(classValue);
        }
        return;
    }

    const classTokens = classValue.match(classTokenPattern);
    if (!classTokens) {
        return;
    }

    for (let i = 0; i < classTokens.length; i++) {
        const token = classTokens[i]!;
        if (!seenTokens.has(token)) {
            seenTokens.add(token);
            result.push(token);
        }
    }
}

function appendClassValue(result: string[], tokens: Set<string>, value: ClassValue): void {
    if (typeof value === 'string' || typeof value === 'number') {
        appendClassTokens(result, tokens, value);
        return;
    }

    if (!value || typeof value !== 'object') {
        return;
    }

    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            if (value[i]) {
                appendClassValue(result, tokens, value[i]);
            }
        }
        return;
    }

    for (const key in value) {
        if (value[key]) {
            appendClassTokens(result, tokens, key);
        }
    }
}

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
    const result: string[] = [];
    const tokens = new Set<string>();

    for (let i = 0; i < args.length; i++) {
        const value = args[i];
        if (!value) {
            continue;
        }

        if (typeof value === 'string' || typeof value === 'number') {
            appendClassTokens(result, tokens, value);
        } else {
            appendClassValue(result, tokens, value);
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
            const kebabKey = key.startsWith('--') ? key : key.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
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

    const appendDeclaration = (declaration: string): void => {
        let quote: '"' | "'" | undefined;
        let parentheses = 0;
        let escaped = false;
        let separator = -1;

        for (let index = 0; index < declaration.length; index++) {
            const character = declaration[index]!;

            if (escaped) {
                escaped = false;
                continue;
            }

            if (quote) {
                if (character === '\\') {
                    escaped = true;
                } else if (character === quote) {
                    quote = undefined;
                }
                continue;
            }

            if (character === '\\') {
                escaped = true;
            } else if (character === '"' || character === "'") {
                quote = character;
            } else if (character === '(') {
                parentheses++;
            } else if (character === ')' && parentheses > 0) {
                parentheses--;
            } else if (character === ':' && parentheses === 0) {
                separator = index;
                break;
            }
        }

        if (separator === -1) {
            return;
        }

        const trimmedProperty = declaration.slice(0, separator).trim();
        const value = declaration.slice(separator + 1).trim();

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
    };

    let declarationStart = 0;
    let quote: '"' | "'" | undefined;
    let parentheses = 0;
    let escaped = false;

    for (let index = 0; index <= cssString.length; index++) {
        const character = cssString[index];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (quote) {
            if (character === '\\') {
                escaped = true;
            } else if (character === quote) {
                quote = undefined;
            }
            continue;
        }

        if (character === '\\') {
            escaped = true;
        } else if (character === '"' || character === "'") {
            quote = character;
        } else if (character === '(') {
            parentheses++;
        } else if (character === ')' && parentheses > 0) {
            parentheses--;
        } else if (character === ';' || index === cssString.length) {
            if (parentheses === 0) {
                appendDeclaration(cssString.slice(declarationStart, index));
                declarationStart = index + 1;
            }
        }
    }

    return styleObj;
}

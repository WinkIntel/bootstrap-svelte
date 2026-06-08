import { screen } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getAttribute, hasAttribute, hasFocus, isDisabled, isRTL, removeAttribute, setAttribute, toggleAttribute } from './dom.js';

describe('dom.ts', () => {
    let element: HTMLElement;

    // Mock for document.documentElement
    const originalDir = document.documentElement.dir;

    beforeEach(() => {
        // Set up a clean test environment
        document.body.innerHTML = '<div data-testid="test-element" tabindex="0"></div>';
        element = screen.getByTestId('test-element');
    });

    // Clean up after each test
    afterEach(() => {
        document.body.innerHTML = '';
        document.documentElement.dir = originalDir;
    });

    describe('getAttribute', () => {
        it('should get attribute value from element', () => {
            element.setAttribute('data-test', 'value');
            expect(getAttribute(element, 'data-test')).toBe('value');
        });

        it('should return null when attribute does not exist', () => {
            expect(getAttribute(element, 'data-test')).toBe(null);
        });

        it('should return null for null/undefined element', () => {
            expect(getAttribute(null, 'data-test')).toBe(null);
            expect(getAttribute(undefined, 'data-test')).toBe(null);
        });
    });

    describe('hasAttribute', () => {
        it('should return true when element has attribute', () => {
            element.setAttribute('data-test', 'value');
            expect(hasAttribute(element, 'data-test')).toBe(true);
        });

        it('should return false when element does not have attribute', () => {
            expect(hasAttribute(element, 'data-test')).toBe(false);
        });

        it('should return false for null/undefined element', () => {
            expect(hasAttribute(null, 'data-test')).toBe(false);
            expect(hasAttribute(undefined, 'data-test')).toBe(false);
        });
    });

    describe('hasFocus', () => {
        it('should return true when element has focus', () => {
            element.focus();
            expect(hasFocus(element)).toBe(true);
        });

        it('should return false when element does not have focus', () => {
            // Create a second element to focus instead
            document.body.innerHTML += '<div data-testid="other-element" tabindex="0"></div>';
            const otherElement = screen.getByTestId('other-element');

            // Focus the other element
            otherElement.focus();
            expect(hasFocus(element)).toBe(false);
        });

        it('should return false for null/undefined element', () => {
            expect(hasFocus(null)).toBe(false);
            expect(hasFocus(undefined)).toBe(false);
        });
    });

    describe('isDisabled', () => {
        it('should return true when element has disabled attribute', () => {
            element.setAttribute('disabled', '');
            expect(isDisabled(element)).toBe(true);
        });

        it('should return false when element has disabled="false" attribute', () => {
            element.setAttribute('disabled', 'false');
            expect(isDisabled(element)).toBe(false);
        });

        it('should return true when element has disabled property', () => {
            const button = document.createElement('button');
            button.disabled = true;
            document.body.appendChild(button);
            expect(isDisabled(button)).toBe(true);
        });

        it('should return false when element has disabled property set to false', () => {
            const button = document.createElement('button');
            button.disabled = false;
            document.body.appendChild(button);
            expect(isDisabled(button)).toBe(false);
        });

        it('should return true when element has disabled class', () => {
            element.classList.add('disabled');
            expect(isDisabled(element)).toBe(true);
        });

        it('should return false when element has no disabled attribute, property, or class', () => {
            expect(isDisabled(element)).toBe(false);
        });

        it('should return true for null/undefined element', () => {
            expect(isDisabled(null)).toBe(true);
            expect(isDisabled(undefined)).toBe(true);
        });

        it('should return true for non-element node', () => {
            const textNode = document.createTextNode('test');
            expect(isDisabled(textNode as unknown as HTMLElement)).toBe(true);
        });
    });

    describe('isRTL', () => {
        it('should return true when document direction is rtl', () => {
            document.documentElement.dir = 'rtl';
            expect(isRTL()).toBe(true);
        });

        it('should return false when document direction is not rtl', () => {
            document.documentElement.dir = 'ltr';
            expect(isRTL()).toBe(false);
        });

        it('should return false when document direction is empty', () => {
            document.documentElement.dir = '';
            expect(isRTL()).toBe(false);
        });
    });

    describe('removeAttribute', () => {
        it('should remove attribute from element', () => {
            element.setAttribute('data-test', 'value');
            expect(element).toHaveAttribute('data-test');

            removeAttribute(element, 'data-test');
            expect(element).not.toHaveAttribute('data-test');
        });

        it('should handle null/undefined element', () => {
            expect(() => removeAttribute(null, 'data-test')).not.toThrow();
            expect(() => removeAttribute(undefined, 'data-test')).not.toThrow();
        });
    });

    describe('setAttribute', () => {
        it('should set attribute on element', () => {
            setAttribute(element, 'data-test', 'value');
            expect(element).toHaveAttribute('data-test', 'value');
        });

        it('should handle null/undefined element', () => {
            // Should not throw error when element is null
            expect(() => setAttribute(null, 'data-test', 'value')).not.toThrow();
            expect(() => setAttribute(undefined, 'data-test', 'value')).not.toThrow();
        });
    });

    describe('toggleAttribute', () => {
        it('should add attribute when it does not exist', () => {
            toggleAttribute(element, 'data-test', 'value');
            expect(element).toHaveAttribute('data-test', 'value');
        });

        it('should remove attribute when it exists', () => {
            element.setAttribute('data-test', 'value');
            toggleAttribute(element, 'data-test');
            expect(element).not.toHaveAttribute('data-test');
        });

        it('should use empty string as default value if not provided', () => {
            toggleAttribute(element, 'data-test');
            expect(element).toHaveAttribute('data-test', '');
        });

        it('should handle null/undefined element', () => {
            expect(() => toggleAttribute(null, 'data-test')).not.toThrow();
            expect(() => toggleAttribute(undefined, 'data-test')).not.toThrow();
        });
    });
});

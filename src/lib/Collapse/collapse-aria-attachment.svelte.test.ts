/* eslint-disable @typescript-eslint/no-explicit-any -- tests intentionally pass invalid inputs (null, 'invalid', wrong-type ariaExpanded) to verify defensive behavior */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { collapseAria } from './collapse-aria-attachment.svelte.js';
import type { CollapseAriaOptions } from './types.js';

describe('collapse-aria-attachment.ts', () => {
    let element: HTMLElement;

    beforeEach(() => {
        // Create a fresh element for each test
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    afterEach(() => {
        // Clean up DOM after each test
        document.body.innerHTML = '';
    });

    describe('collapseAria', () => {
        it('should set aria-expanded attribute based on options', () => {
            const options: CollapseAriaOptions = {
                ariaControls: 'collapse-target',
                ariaExpanded: true
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(element);

            expect(element.getAttribute('aria-expanded')).toBe('true');

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should set aria-expanded to false when ariaExpanded is false', () => {
            const options: CollapseAriaOptions = {
                ariaControls: 'collapse-target',
                ariaExpanded: false
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(element);

            expect(element.getAttribute('aria-expanded')).toBe('false');

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should set aria-controls attribute', () => {
            const options: CollapseAriaOptions = {
                ariaControls: 'my-collapse-id',
                ariaExpanded: true
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(element);

            expect(element.getAttribute('aria-controls')).toBe('my-collapse-id');

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should not override existing aria-controls attribute', () => {
            element.setAttribute('aria-controls', 'existing-control');

            const options: CollapseAriaOptions = {
                ariaControls: 'new-control',
                ariaExpanded: true
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(element);

            expect(element.getAttribute('aria-controls')).toBe('existing-control');

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should set role="button" on non-button elements', () => {
            const options: CollapseAriaOptions = {
                ariaControls: 'collapse-target',
                ariaExpanded: false
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(element);

            expect(element.getAttribute('role')).toBe('button');

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should not set role="button" on button elements', () => {
            const buttonElement = document.createElement('button');
            document.body.appendChild(buttonElement);

            const options: CollapseAriaOptions = {
                ariaControls: 'collapse-target',
                ariaExpanded: false
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(buttonElement);

            expect(buttonElement.hasAttribute('role')).toBe(false);

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should not override existing role attribute', () => {
            element.setAttribute('role', 'tab');

            const options: CollapseAriaOptions = {
                ariaControls: 'collapse-target',
                ariaExpanded: false
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(element);

            expect(element.getAttribute('role')).toBe('tab');

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should remove aria-expanded when cleanup is called', () => {
            const options: CollapseAriaOptions = {
                ariaControls: 'collapse-target',
                ariaExpanded: true
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(element);

            expect(element.hasAttribute('aria-expanded')).toBe(true);

            if (typeof cleanup === 'function') {
                cleanup();
            }

            expect(element.hasAttribute('aria-expanded')).toBe(false);
        });

        it('should remove aria-controls when cleanup is called', () => {
            const options: CollapseAriaOptions = {
                ariaControls: 'collapse-target',
                ariaExpanded: true
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(element);

            expect(element.hasAttribute('aria-controls')).toBe(true);

            if (typeof cleanup === 'function') {
                cleanup();
            }

            expect(element.hasAttribute('aria-controls')).toBe(false);
        });

        it('should remove role="button" when cleanup is called', () => {
            const options: CollapseAriaOptions = {
                ariaControls: 'collapse-target',
                ariaExpanded: false
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(element);

            expect(element.getAttribute('role')).toBe('button');

            if (typeof cleanup === 'function') {
                cleanup();
            }

            expect(element.hasAttribute('role')).toBe(false);
        });

        it('should not remove role attribute if it was not "button"', () => {
            element.setAttribute('role', 'tab');

            const options: CollapseAriaOptions = {
                ariaControls: 'collapse-target',
                ariaExpanded: false
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(element);

            if (typeof cleanup === 'function') {
                cleanup();
            }

            expect(element.getAttribute('role')).toBe('tab');
        });

        // Error handling tests
        it('should throw error when options are missing', () => {
            const attachment = collapseAria(null as any);
            expect(() => attachment(element)).toThrow('CollapseAria: options must be an object');
        });

        it('should throw error when options are not an object', () => {
            const attachment = collapseAria('invalid' as any);
            expect(() => attachment(element)).toThrow('CollapseAria: options must be an object');
        });

        it('should throw error when ariaControls is missing', () => {
            const options = {
                ariaExpanded: true
            } as any;

            const attachment = collapseAria(options);
            expect(() => attachment(element)).toThrow('CollapseAria: options.ariaControls is required');
        });

        it('should throw error when ariaExpanded is not a boolean', () => {
            const options = {
                ariaControls: 'collapse-target',
                ariaExpanded: 'true' as any
            };

            const attachment = collapseAria(options);
            expect(() => attachment(element)).toThrow('CollapseAria: options.ariaExpanded must be a boolean');
        });

        it('should throw error when ariaExpanded is undefined', () => {
            const options = {
                ariaControls: 'collapse-target',
                ariaExpanded: undefined as any
            };

            const attachment = collapseAria(options);
            expect(() => attachment(element)).toThrow('CollapseAria: options.ariaExpanded must be a boolean');
        });

        it('should handle multiple attachments on the same element', () => {
            const options1: CollapseAriaOptions = {
                ariaControls: 'collapse-1',
                ariaExpanded: true
            };

            const options2: CollapseAriaOptions = {
                ariaControls: 'collapse-2',
                ariaExpanded: false
            };

            const attachment1 = collapseAria(options1);
            const cleanup1 = attachment1(element);

            // First attachment should have set aria-expanded to true
            expect(element.getAttribute('aria-expanded')).toBe('true');

            const attachment2 = collapseAria(options2);
            const cleanup2 = attachment2(element);

            // Second attachment should override aria-expanded to false
            expect(element.getAttribute('aria-expanded')).toBe('false');

            if (typeof cleanup2 === 'function') {
                cleanup2();
            }

            if (typeof cleanup1 === 'function') {
                cleanup1();
            }
        });

        it('should work with button elements with existing aria-controls', () => {
            const buttonElement = document.createElement('button');
            buttonElement.setAttribute('aria-controls', 'existing-id');
            document.body.appendChild(buttonElement);

            const options: CollapseAriaOptions = {
                ariaControls: 'new-id',
                ariaExpanded: true
            };

            const attachment = collapseAria(options);
            const cleanup = attachment(buttonElement);

            // Should not override existing aria-controls
            expect(buttonElement.getAttribute('aria-controls')).toBe('existing-id');
            // Should set aria-expanded
            expect(buttonElement.getAttribute('aria-expanded')).toBe('true');
            // Should not set role on button
            expect(buttonElement.hasAttribute('role')).toBe(false);

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });
    });
});

/* eslint-disable @typescript-eslint/no-explicit-any -- test uses partial/mock typings */
import { isDisabled } from '$lib/common/dom.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scrollspy } from './scrollspy-attachment.svelte.js';
import type { ScrollspyOptions } from './types.js';

// Mock the isDisabled function
vi.mock('$lib/common/dom.js', () => ({
    isDisabled: vi.fn().mockImplementation((element) => {
        if (element?.hasAttribute('disabled') || element?.classList.contains('disabled')) {
            return true;
        }
        return false;
    })
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
    root: Element | Document | null;
    callback: IntersectionObserverCallback;
    observedElements: Element[];
    disconnected: boolean;

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.root = options?.root || null;
        this.callback = callback;
        this.observedElements = [];
        this.disconnected = false;
    }

    observe(element: Element) {
        this.observedElements.push(element);
    }

    disconnect() {
        this.disconnected = true;
        this.observedElements = [];
    }
}

// Keep a reference to the last created mock observer for testing
let lastMockObserver: MockIntersectionObserver;

describe('scrollspy-attachment.ts', () => {
    let container: HTMLElement;
    let targets: HTMLElement[];
    let _targetContainer: HTMLElement;
    const originalIntersectionObserver = global.IntersectionObserver;

    beforeEach(() => {
        // Set up DOM environment with navigation links and target sections
        document.body.innerHTML = `
      <div id="container">
        <div id="nav-container">
          <a href="#section1">Section 1</a>
          <a href="#section2">Section 2</a>
          <a href="#section3">Section 3</a>
          <a href="#" class="empty-hash">Empty hash</a>
          <a href="https://example.com" class="external">External link</a>
          <a href="#nonexistent">Nonexistent target</a>
          <a href="#section1" class="disabled">Disabled link</a>
        </div>
        <div id="section1" class="target-section"></div>
        <div id="section2" class="target-section"></div>
        <div id="section3" class="target-section"></div>
      </div>
    `;

        container = document.getElementById('container') as HTMLElement;
        _targetContainer = document.getElementById('nav-container') as HTMLElement;
        targets = Array.from(document.querySelectorAll('.target-section'));

        // Add scrollTo mock to elements
        container.scrollTo = vi.fn();
        window.scrollTo = vi.fn();

        // Reset the last mock observer reference
        lastMockObserver = null as unknown as MockIntersectionObserver;

        // Mock IntersectionObserver
        vi.stubGlobal('IntersectionObserver', function (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
            const observer = new MockIntersectionObserver(callback, options);
            lastMockObserver = observer;
            return observer;
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.unstubAllGlobals();
        vi.clearAllMocks();
        global.IntersectionObserver = originalIntersectionObserver;
    });

    describe('scrollspy', () => {
        it('should create an attachment function', () => {
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback: vi.fn(),
                observerOptions: {}
            };

            const attachment = scrollspy(options);
            expect(attachment).toBeTypeOf('function');
        });

        it('should create IntersectionObserver with container as root', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions: {}
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            expect(options.observerOptions?.root).toBe(container);
            expect(cleanup).toBeTypeOf('function');
        });

        it('should create observerOptions if not provided', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback
                // No observerOptions
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            expect(options.observerOptions).toBeDefined();
            expect(options.observerOptions?.root).toBe(container);
            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should observe all target elements referenced by anchors', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions: {}
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            // Get the created observer using our reference
            const observer = lastMockObserver;

            // Verify sections are observed
            expect(observer.observedElements.length).toBe(3);
            targets.forEach((target) => {
                expect(observer.observedElements).toContain(target);
            });

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should disconnect observer when cleanup function is called', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions: {}
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            // Get the created observer using our reference
            const observer = lastMockObserver;

            // Initial state
            expect(observer.disconnected).toBe(false);

            // Call cleanup function
            if (typeof cleanup === 'function') {
                cleanup();
            }

            // Verify observer was disconnected
            expect(observer.disconnected).toBe(true);
        });

        // New tests for error handling
        it('should throw error when options are missing', () => {
            const attachment = scrollspy({} as ScrollspyOptions);
            expect(() => attachment(container)).toThrow('targetSelector is required');
        });

        it('should throw error when callback is not a function', () => {
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback: 'not a function' as any,
                observerOptions: {}
            };

            const attachment = scrollspy(options);
            expect(() => attachment(container)).toThrow('callback must be a function');
        });

        it('should throw error when target element is not found', () => {
            const options: ScrollspyOptions = {
                targetSelector: '#nonexistent-element',
                callback: vi.fn(),
                observerOptions: {}
            };

            const attachment = scrollspy(options);
            expect(() => attachment(container)).toThrow('target element not found');
        });

        it('should not handle clicks on links with empty hash', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions: {}
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            // Get the anchor with empty hash
            const emptyHashAnchor = document.querySelector('a.empty-hash') as HTMLAnchorElement;

            // Simulate a click event
            const clickEvent = new MouseEvent('click', { bubbles: true });
            const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
            emptyHashAnchor.dispatchEvent(clickEvent);

            // Verify preventDefault was not called
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(container.scrollTo).not.toHaveBeenCalled();

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should not handle clicks on external links', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions: {}
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            // Get the external anchor
            const externalAnchor = document.querySelector('a.external') as HTMLAnchorElement;

            // Simulate a click event
            const clickEvent = new MouseEvent('click', { bubbles: true });
            const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
            externalAnchor.dispatchEvent(clickEvent);

            // Verify preventDefault was not called
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(container.scrollTo).not.toHaveBeenCalled();

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should not handle clicks on disabled links', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions: {}
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            // Verify isDisabled is called for disabled links
            expect(isDisabled).toHaveBeenCalled();

            // Get the disabled anchor
            const disabledAnchor = document.querySelector('a.disabled') as HTMLAnchorElement;

            // Simulate a click event
            const clickEvent = new MouseEvent('click', { bubbles: true });
            const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
            disabledAnchor.dispatchEvent(clickEvent);

            // Verify preventDefault was not called
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(container.scrollTo).not.toHaveBeenCalled();

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should handle scrolling differently based on root element', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions: { root: null } // Use window as root
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            // Get the anchor and section elements
            const anchor = document.querySelector('a[href="#section1"]') as HTMLAnchorElement;
            const section = document.getElementById('section1') as HTMLElement;

            // Mock getBoundingClientRect for both elements
            document.documentElement.getBoundingClientRect = vi.fn().mockReturnValue({ top: 0 });
            section.getBoundingClientRect = vi.fn().mockReturnValue({ top: 100 });

            // Mock window.pageYOffset
            Object.defineProperty(window, 'pageYOffset', { value: 50, configurable: true });

            // Simulate a click event
            const clickEvent = new MouseEvent('click', { bubbles: true });
            anchor.dispatchEvent(clickEvent);

            // Verify container.scrollTo was called instead of container.scrollTo
            expect(window.scrollTo).not.toHaveBeenCalledWith({ top: expect.any(Number), behavior: 'smooth' });
            expect(container.scrollTo).toHaveBeenCalled();

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should remove event listeners when cleanup is called', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions: {}
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            // Get the anchor element
            const anchor = document.querySelector('a[href="#section1"]') as HTMLAnchorElement;
            const removeEventListenerSpy = vi.spyOn(anchor, 'removeEventListener');

            // Call cleanup function
            if (typeof cleanup === 'function') {
                cleanup();
            }

            // Verify removeEventListener was called
            expect(removeEventListenerSpy).toHaveBeenCalled();
        });
    });
});

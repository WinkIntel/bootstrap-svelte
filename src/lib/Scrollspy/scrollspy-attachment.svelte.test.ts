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
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

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
        vi.restoreAllMocks();
        vi.clearAllMocks();
        global.IntersectionObserver = originalIntersectionObserver;
    });

    describe('scrollspy', () => {
        it('should use the container as its default observer root without changing supplied options', () => {
            const callback = vi.fn();
            const observerOptions: IntersectionObserverInit = { threshold: 0.5 };
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            expect(lastMockObserver.root).toBe(container);
            expect(options.observerOptions).toBe(observerOptions);
            expect(options.observerOptions).toEqual({ threshold: 0.5 });
            expect(cleanup).toBeTypeOf('function');
        });

        it('should apply defaults without creating observerOptions on the caller object', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback
                // No observerOptions
            };

            const attachment = scrollspy(options);
            const cleanup = attachment(container);

            expect(lastMockObserver.root).toBe(container);
            expect(options.observerOptions).toBeUndefined();
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

        it('resolves special-character and malformed-escape hashes by element id', () => {
            const specialAnchor = document.createElement('a');
            specialAnchor.href = '#section:1';
            specialAnchor.textContent = 'Special section';
            const malformedAnchor = document.createElement('a');
            malformedAnchor.setAttribute('href', '#section%ZZ');
            malformedAnchor.textContent = 'Malformed escape section';
            _targetContainer.append(specialAnchor, malformedAnchor);

            const specialSection = document.createElement('section');
            specialSection.id = 'section:1';
            const malformedSection = document.createElement('section');
            malformedSection.id = 'section%ZZ';
            container.append(specialSection, malformedSection);

            const cleanup = scrollspy({ targetSelector: '#nav-container', callback: vi.fn() })(container);

            expect(lastMockObserver.observedElements).toContain(specialSection);
            expect(lastMockObserver.observedElements).toContain(malformedSection);

            specialAnchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            malformedAnchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            expect(container.scrollTo).toHaveBeenCalledTimes(2);

            cleanup?.();
        });

        it('does not observe or hijack hash targets outside the attached container', () => {
            const outsideAnchor = document.createElement('a');
            outsideAnchor.href = '#outside-section';
            outsideAnchor.textContent = 'Outside section';
            _targetContainer.append(outsideAnchor);

            const outsideSection = document.createElement('section');
            outsideSection.id = 'outside-section';
            document.body.append(outsideSection);

            const cleanup = scrollspy({ targetSelector: '#nav-container', callback: vi.fn() })(container);
            const click = new MouseEvent('click', { bubbles: true, cancelable: true });
            outsideAnchor.dispatchEvent(click);

            expect(lastMockObserver.observedElements).not.toContain(outsideSection);
            expect(click.defaultPrevented).toBe(false);
            expect(container.scrollTo).not.toHaveBeenCalled();

            cleanup?.();
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
        it.each([null, 42])('should reject non-object options (%s)', (invalidOptions) => {
            const attachment = scrollspy(invalidOptions as never);

            expect(() => attachment(container)).toThrow('options must be an object');
        });

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

        it('reports a malformed target selector without leaking a DOMException', () => {
            const attachment = scrollspy({ targetSelector: '[', callback: vi.fn() });

            expect(() => attachment(container)).toThrow('invalid target selector "["');
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
            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
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
            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            let defaultPreventedBeforeNavigationGuard: boolean | undefined;
            const preventNavigation = (event: Event) => {
                defaultPreventedBeforeNavigationGuard = event.defaultPrevented;
                event.preventDefault();
            };

            // Preserve the real external href and inspect the attachment's behavior
            // before a test-only bubble guard suppresses jsdom navigation.
            document.addEventListener('click', preventNavigation, { once: true });
            externalAnchor.dispatchEvent(clickEvent);

            // Verify preventDefault was not called
            expect(defaultPreventedBeforeNavigationGuard).toBe(false);
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

        it('handles clicks originating from SVG content inside a registered anchor', () => {
            const anchor = document.querySelector('a[href="#section1"]') as HTMLAnchorElement;
            anchor.innerHTML = '<svg><circle data-testid="nested-circle"></circle></svg>';
            const cleanup = scrollspy({ targetSelector: '#nav-container', callback: vi.fn() })(container);
            const circle = anchor.querySelector('circle') as SVGCircleElement;

            circle.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

            expect(container.scrollTo).toHaveBeenCalledOnce();
            cleanup?.();
        });

        it('should scroll the window when observer root is explicitly null', () => {
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
            vi.spyOn(document.documentElement, 'getBoundingClientRect').mockReturnValue({ top: 0 } as DOMRect);
            section.getBoundingClientRect = vi.fn().mockReturnValue({ top: 100 });

            // Mock window.pageYOffset
            vi.spyOn(window, 'pageYOffset', 'get').mockReturnValue(50);

            // Simulate a click event
            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            anchor.dispatchEvent(clickEvent);

            expect(window.scrollTo).toHaveBeenCalledWith({ top: 150, behavior: 'smooth' });
            expect(container.scrollTo).not.toHaveBeenCalled();

            if (typeof cleanup === 'function') {
                cleanup();
            }
        });

        it('should not offset window scrolling by the document element rect', () => {
            const callback = vi.fn();
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions: { root: null }
            };
            const attachment = scrollspy(options);
            const cleanup = attachment(container);
            const anchor = document.querySelector('a[href="#section1"]') as HTMLAnchorElement;
            const section = document.getElementById('section1') as HTMLElement;

            vi.spyOn(document.documentElement, 'getBoundingClientRect').mockReturnValue({ top: -40 } as DOMRect);
            section.getBoundingClientRect = vi.fn().mockReturnValue({ top: 100 });
            vi.spyOn(window, 'pageYOffset', 'get').mockReturnValue(50);

            anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

            expect(window.scrollTo).toHaveBeenCalledWith({ top: 150, behavior: 'smooth' });

            if (typeof cleanup === 'function') cleanup();
        });

        it('should derive fresh observer options for each attachment using the same options object', () => {
            const callback = vi.fn();
            const observerOptions: IntersectionObserverInit = { threshold: 0.5 };
            const options: ScrollspyOptions = {
                targetSelector: '#nav-container',
                callback,
                observerOptions
            };
            const attachment = scrollspy(options);
            const secondContainer = document.createElement('div');

            const firstCleanup = attachment(container);
            const secondCleanup = attachment(secondContainer);

            expect(lastMockObserver.root).toBe(secondContainer);
            expect(options.observerOptions).toBe(observerOptions);
            expect(options.observerOptions).toEqual({ threshold: 0.5 });

            if (typeof firstCleanup === 'function') firstCleanup();
            if (typeof secondCleanup === 'function') secondCleanup();
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

        it('removes listeners from every duplicate link targeting the same section', () => {
            const firstAnchor = document.querySelector('a[href="#section1"]') as HTMLAnchorElement;
            const duplicateAnchor = firstAnchor.cloneNode(true) as HTMLAnchorElement;
            _targetContainer.append(duplicateAnchor);
            const cleanup = scrollspy({ targetSelector: '#nav-container', callback: vi.fn() })(container);

            cleanup?.();
            firstAnchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            duplicateAnchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

            expect(container.scrollTo).not.toHaveBeenCalled();
        });
    });
});

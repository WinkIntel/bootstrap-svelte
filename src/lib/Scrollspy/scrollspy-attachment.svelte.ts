import { isDisabled } from '$lib/common/dom.js';
import type { Attachment } from 'svelte/attachments';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import type { ScrollspyOptions } from './types.js';

function resolveHashTarget(hash: string): HTMLElement | null {
    const rawId = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!rawId) {
        return null;
    }

    let decodedId = rawId;
    try {
        decodedId = decodeURIComponent(rawId);
    } catch {
        // A literal percent sequence can be a valid element ID even when it is
        // not a valid URI escape. Fall back to the exact fragment text.
    }

    return document.getElementById(decodedId) ?? (decodedId === rawId ? null : document.getElementById(rawId));
}

/**
 * Creates a scrollspy attachment that monitors elements matching a target selector
 * and triggers a callback when they intersect with the scrolling container.
 *
 * @param options Configuration options for the scrollspy behavior
 * @returns An Attachment function compatible with Svelte 5's {@attach ...} directive
 */
export function scrollspy(options: ScrollspyOptions): Attachment<HTMLElement> {
    return (element: HTMLElement) => {
        // Sanity check the options...
        if (!options || typeof options !== 'object') {
            throw new Error('Scrollspy: options must be an object');
        }
        if (options.targetSelector === undefined) {
            throw new Error('Scrollspy: targetSelector is required in options');
        }
        if (typeof options.callback !== 'function') {
            throw new Error('Scrollspy: callback must be a function');
        }

        // Get the target element from options targetSelector...
        let targetElement: HTMLElement | null;
        try {
            targetElement = document.querySelector<HTMLElement>(options.targetSelector);
        } catch {
            throw new Error(`Scrollspy: invalid target selector "${options.targetSelector}"`);
        }
        if (!targetElement) {
            throw new Error(`Scrollspy: target element not found for selector "${options.targetSelector}"`);
        }

        const observerOptions: IntersectionObserverInit = {
            root: element,
            rootMargin: '0px 0px -25%',
            threshold: [0.1, 0.5, 1],
            ...options.observerOptions
        };

        // Smooth scroll functionality
        const handleClick = (event: Event) => {
            const target: EventTarget | null = event.target;
            if (!(target instanceof Element)) {
                return;
            }

            // Only handle clicks on anchor links with hash
            const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
            if (!anchor || !anchor.hash) {
                return;
            }

            // Find the target element that corresponds to the clicked link's hash
            const targetElement = resolveHashTarget(anchor.hash);

            if (targetElement && element.contains(targetElement)) {
                event.preventDefault();

                // A null observer root represents the viewport/window.
                const root = observerOptions.root;
                const scrollContainer = root instanceof HTMLElement ? root : null;

                // Calculate the scroll position
                const elementRect = targetElement.getBoundingClientRect();

                let scrollTop: number;

                if (scrollContainer) {
                    // Scrolling within a container element
                    // Cast targetElement to HTMLElement to use offsetTop
                    scrollTop = (targetElement as HTMLElement).offsetTop - element.offsetTop;
                } else {
                    // Scrolling the window
                    scrollTop = elementRect.top + window.pageYOffset;
                }

                // Perform smooth scroll
                if (scrollContainer) {
                    if (scrollContainer.scrollTo) {
                        scrollContainer.scrollTo({ top: scrollTop, behavior: 'smooth' });
                    } else {
                        // Fallback for older browsers
                        scrollContainer.scrollTop = scrollTop;
                    }
                } else {
                    // Scroll the window
                    if (window.scrollTo) {
                        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                    } else {
                        // Fallback for older browsers
                        document.documentElement.scrollTop = scrollTop; // Use document.documentElement.scrollTop instead
                        document.body.scrollTop = scrollTop; // For Safari compatibility
                    }
                }
            }
        };

        // Maps to store links and their target sections
        const targetLinks = new SvelteSet<HTMLAnchorElement>();
        const observableSections = new SvelteMap<string, Element>();

        // Find all the anchor links within the target element...
        const anchors: NodeListOf<HTMLAnchorElement> = targetElement.querySelectorAll<HTMLAnchorElement>('[href]');
        for (const anchor of anchors) {
            // ensure that the anchor has a valid hash and is not disabled
            if (!anchor.hash || ['#', '#!'].includes(anchor.hash) || isDisabled(anchor)) {
                continue;
            }

            const observableSection = resolveHashTarget(anchor.hash);

            if (observableSection !== null && element.contains(observableSection)) {
                targetLinks.add(anchor);
                observableSections.set(anchor.hash, observableSection);
                // attach the click handler to the anchor
                anchor.addEventListener('click', handleClick);
            }
        }

        // Create an IntersectionObserver that will invoke the callback when targets intersect
        const observer = new IntersectionObserver(options.callback, observerOptions);

        // Start observing each target element for intersection events
        for (const section of observableSections.values()) {
            observer.observe(section);
        }

        // Return cleanup function that will be called when the attachment is removed
        return () => {
            // Remove click event listener
            for (const anchor of targetLinks) {
                anchor.removeEventListener('click', handleClick);
            }
            // Disconnect the observer to prevent memory leaks
            observer.disconnect();
        };
    };
}

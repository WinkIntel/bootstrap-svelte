/**
 * Configuration options for the Scrollspy component.
 * Used to track when elements enter/exit the viewport and trigger navigation highlights.
 */
export type ScrollspyOptions = {
    targetSelector: string;
    callback: IntersectionObserverCallback;
    observerOptions?: IntersectionObserverInit;
};

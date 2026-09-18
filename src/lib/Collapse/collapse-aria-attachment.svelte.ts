import type { Attachment } from 'svelte/attachments';
import type { CollapseAriaOptions } from './types.js';

/**
 * Applies browser-only ARIA attributes; does not discover targets or provide SSR attributes.
 * Cleanup restores only values still matching this attachment's writes. Identical writes
 * from another owner cannot be distinguished. Each reattachment reapplies ariaExpanded.
 */
export function collapseAria(options: CollapseAriaOptions): Attachment<HTMLElement> {
    return (element: HTMLElement) => {
        // Sanity check the options...
        if (!options || typeof options !== 'object') {
            throw new Error('CollapseAria: options must be an object');
        }
        if (options.ariaControls === undefined) {
            throw new Error('CollapseAria: options.ariaControls is required');
        }
        if (typeof options.ariaExpanded !== 'boolean') {
            throw new Error('CollapseAria: options.ariaExpanded must be a boolean');
        }

        const changes: { name: string; previous: string | null; written: string }[] = [];
        function writeAttribute(name: string, written: string) {
            changes.push({ name, previous: element.getAttribute(name), written });
            element.setAttribute(name, written);
        }

        // Expanded state belongs to this attachment while active; preserve its baseline.
        writeAttribute('aria-expanded', options.ariaExpanded.toString());

        // Set the aria-controls attribute to link to the controlled element
        if (!element.hasAttribute('aria-controls')) {
            writeAttribute('aria-controls', options.ariaControls);
        }

        // If the element is not a button, set role="button" for accessibility
        if (element.tagName.toLowerCase() !== 'button' && !element.hasAttribute('role')) {
            writeAttribute('role', 'button');
        }

        // Leave later consumer changes (including removals) intact.
        return () => {
            for (const { name, previous, written } of changes) {
                if (element.getAttribute(name) !== written) continue;
                if (previous === null) element.removeAttribute(name);
                else element.setAttribute(name, previous);
            }
        };
    };
}

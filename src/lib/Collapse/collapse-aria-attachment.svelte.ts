import type { Attachment } from 'svelte/attachments';
import type { CollapseAriaOptions } from './types.js';

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

        // Update the aria-expanded attribute based on isExpanded option
        element.setAttribute('aria-expanded', options.ariaExpanded.toString());

        // Set the aria-controls attribute to link to the controlled element
        if (!element.hasAttribute('aria-controls')) {
            element.setAttribute('aria-controls', options.ariaControls);
        }

        // If the element is not a button, set role="button" for accessibility
        if (element.tagName.toLowerCase() !== 'button' && !element.hasAttribute('role')) {
            element.setAttribute('role', 'button');
        }

        // Return cleanup function that will be called when the attachment is removed
        return () => {
            element.removeAttribute('aria-expanded');
            element.removeAttribute('aria-controls');
            if (element.getAttribute('role') === 'button') {
                element.removeAttribute('role');
            }
        };
    };
}

import type { Attachment } from 'svelte/attachments';
import type { CollapseAriaOptions } from './types.js';

type AttributeWrite = {
    name: string;
    previous: string | null;
    written: string;
    previousWrite?: AttributeWrite;
};

// Track this helper's live writes so cleanup cannot resurrect a removed attachment.
const liveWrites = new WeakMap<HTMLElement, Map<string, AttributeWrite[]>>();

/**
 * Applies browser-only ARIA attributes; does not discover targets or provide SSR attributes.
 * Cleanup restores only values still matching this attachment's writes. Identical writes
 * from a consumer cannot be distinguished. With Svelte-managed attributes, cleanup may
 * leave the DOM out of sync until the bound value changes again, because Svelte caches
 * its last write. Each reattachment reapplies ariaExpanded.
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

        // eslint-disable-next-line svelte/prefer-svelte-reactivity -- ownership bookkeeping must not subscribe or retrigger attachments
        const writes = liveWrites.get(element) ?? new Map<string, AttributeWrite[]>();
        liveWrites.set(element, writes);
        const changes: AttributeWrite[] = [];
        function writeAttribute(name: string, written: string) {
            const previous = element.getAttribute(name);
            const attributeWrites = writes.get(name) ?? [];
            const previousWrite = attributeWrites.at(-1);
            const change: AttributeWrite = {
                name,
                previous,
                written,
                previousWrite: previousWrite?.written === previous ? previousWrite : undefined
            };
            changes.push(change);
            attributeWrites.push(change);
            writes.set(name, attributeWrites);
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
            for (const change of changes) {
                const attributeWrites = writes.get(change.name);
                const index = attributeWrites?.indexOf(change) ?? -1;
                if (!attributeWrites || index < 0) continue;
                const isLatest = attributeWrites.at(-1) === change;
                // Splice this writer out of later baselines, even when cleanup is not LIFO.
                // Only link helper-owned values; intervening consumer writes stay baselines.
                for (const later of attributeWrites) {
                    if (later.previousWrite === change) {
                        later.previous = change.previous;
                        later.previousWrite = change.previousWrite;
                    }
                }
                attributeWrites.splice(index, 1);
                if (attributeWrites.length === 0) writes.delete(change.name);
                if (!isLatest || element.getAttribute(change.name) !== change.written) continue;
                if (change.previous === null) element.removeAttribute(change.name);
                else element.setAttribute(change.name, change.previous);
            }
            if (writes.size === 0 && liveWrites.get(element) === writes) liveWrites.delete(element);
        };
    };
}

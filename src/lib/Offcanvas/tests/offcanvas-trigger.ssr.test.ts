import { Offcanvas } from '$lib/index.js';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';

describe('Offcanvas trigger references during SSR', () => {
    it('accepts references that are not mounted yet without forwarding them as DOM attributes', () => {
        const { body } = render(Offcanvas.Root, {
            props: { isShown: true, triggerElements: [null, undefined] }
        });
        expect(body).toContain('role="dialog"');
        expect(body.toLowerCase()).not.toContain('triggerelements');
    });
});

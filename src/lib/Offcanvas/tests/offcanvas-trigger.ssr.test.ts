import { Offcanvas } from '$lib/index.js';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';

describe('Offcanvas trigger references during SSR', () => {
    it.each([{ triggerElements: null }, { triggerElements: [null, undefined] }])(
        'accepts unmounted references %j without forwarding them as DOM attributes',
        ({ triggerElements }) => {
            const { body } = render(Offcanvas.Root, {
                props: { isShown: true, triggerElements }
            });
            expect(body).toContain('role="dialog"');
            expect(body.toLowerCase()).not.toContain('triggerelements');
        }
    );
});

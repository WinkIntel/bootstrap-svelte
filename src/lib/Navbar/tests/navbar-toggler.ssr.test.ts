import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import NavbarTogglerSsrTest from './navbar-toggler-ssr-test.svelte';

describe('Navbar.Toggler SSR', () => {
    it('preserves an explicit aria-controls before the collapse sibling registers', () => {
        const { body } = render(NavbarTogglerSsrTest);

        expect(body).toContain('aria-controls="consumer-collapse"');
    });

    it('uses a root-derived collapse id when neither sibling has an explicit relationship', () => {
        const { body } = render(NavbarTogglerSsrTest);

        expect(body).toContain('aria-controls="default-navbar-collapse"');
    });
});

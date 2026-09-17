import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import NavbarTogglerSsrTest from './navbar-toggler-ssr-test.svelte';

describe('Navbar.Toggler SSR', () => {
    it('does not reference an unrendered offcanvas even when that component precedes the toggler', () => {
        const { body } = render(NavbarTogglerSsrTest);

        expect(body).not.toContain('id="absent-offcanvas"');
        expect(body).toMatch(/<button(?=[^>]*id="offcanvas-toggler")(?![^>]*aria-controls)[^>]*>/);
    });

    it('preserves an explicit aria-controls before the collapse sibling registers', () => {
        const { body } = render(NavbarTogglerSsrTest);

        expect(body).toContain('aria-controls="consumer-collapse"');
    });

    it('does not emit a speculative default target before a collapse registers', () => {
        const { body } = render(NavbarTogglerSsrTest);

        expect(body).not.toContain('aria-controls="default-navbar-collapse"');
        expect(body).toMatch(/<button(?=[^>]*id="no-collapse-toggler")(?![^>]*aria-controls)[^>]*>/);
    });

    it('does not emit a stale default target before a custom-id collapse registers', () => {
        const { body } = render(NavbarTogglerSsrTest);

        expect(body).toMatch(/<button(?=[^>]*id="custom-collapse-toggler")(?![^>]*aria-controls)[^>]*>/);
        expect(body).not.toContain('aria-controls="custom-collapse-navbar-collapse"');
    });
});

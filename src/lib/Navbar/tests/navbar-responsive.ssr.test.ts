import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import NavbarResponsiveTest from './navbar-responsive-test.svelte';

describe('Navbar responsive SSR', () => {
    it.each([undefined, 'xs'] as const)('renders %s expanded without an overlay or browser APIs', (expandOnBreakpoint) => {
        const { body } = render(NavbarResponsiveTest, { props: { expandOnBreakpoint } });
        expect(body).toContain('class="navbar navbar-expand"');
        expect(body).toContain('aria-expanded="true"');
        expect(body).toContain('data-testid="responsive-collapse"');
        expect(body).toContain('data-testid="responsive-offcanvas"');
        expect(body).not.toContain('offcanvas-backdrop');
    });
    it('leaves a viewport-dependent navbar collapsed on the server', () => {
        const { body } = render(NavbarResponsiveTest, { props: { expandOnBreakpoint: 'lg' } });
        expect(body).toContain('navbar-expand-lg');
        expect(body).toContain('aria-expanded="false"');
        expect(body).not.toContain('data-testid="responsive-offcanvas"');
    });
});

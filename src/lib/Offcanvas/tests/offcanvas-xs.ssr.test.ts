import { render } from 'svelte/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import type { Offcanvas } from '$lib/index.js';
import type { OffcanvasBreakpoint } from '../types.js';
import NavbarResponsiveTest from '../../Navbar/tests/navbar-responsive-test.svelte';
import OffcanvasXsTest from './offcanvas-xs-test.svelte';

const legacyXs = 'xs' as OffcanvasBreakpoint;

describe('legacy Offcanvas xs SSR', () => {
    it('exposes only Bootstrap-supported responsive sizes (checked by pnpm check-types)', () => {
        // Vitest transpiles this assertion; svelte-check enforces it during pnpm check-types and CI.
        expectTypeOf<NonNullable<Offcanvas.RootProps['showOnBreakpoint']>>().toEqualTypeOf<'sm' | 'md' | 'lg' | 'xl' | 'xxl'>();
    });
    it('keeps a standalone panel closed unless explicitly shown', () => {
        const closed = render(OffcanvasXsTest, { props: { showOnBreakpoint: legacyXs } }).body;
        expect(closed).not.toContain('role="dialog"');
        const shown = render(OffcanvasXsTest, { props: { showOnBreakpoint: legacyXs, isShown: true } }).body;
        expect(shown).toContain('class="offcanvas offcanvas-start show"');
        expect(shown).not.toContain('offcanvas-xs');
    });
    it.each([undefined, 'xs'] as const)('inherits an always-inline Navbar %s without browser APIs', (expandOnBreakpoint) => {
        const { body } = render(NavbarResponsiveTest, { props: { expandOnBreakpoint, showOnBreakpoint: legacyXs } });
        expect(body).toContain('data-testid="responsive-offcanvas"');
        expect(body).toContain('class="offcanvas offcanvas-start show"');
        expect(body).not.toContain('offcanvas-backdrop');
        expect(body).not.toContain('offcanvas-xs');
    });
    it.each([false, 'lg'] as const)('inherits collapsed Navbar %s without browser APIs', (expandOnBreakpoint) => {
        const { body } = render(NavbarResponsiveTest, { props: { expandOnBreakpoint, showOnBreakpoint: legacyXs } });
        expect(body).toContain('aria-expanded="false"');
        expect(body).not.toContain('data-testid="responsive-offcanvas"');
        expect(body).not.toContain('role="dialog"');
        expect(body).not.toContain('offcanvas-backdrop');
    });
});

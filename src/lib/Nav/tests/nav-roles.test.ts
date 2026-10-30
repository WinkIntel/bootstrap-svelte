import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import { Nav } from '../index.js';
import NavTabRoleTest from './nav-tab-role-test.svelte';

describe('server-rendered Nav roles', () => {
    it.each(['tabs', 'pills', 'underline'] as const)('distinguishes ordinary and Tab %s markup', (itemStyle) => {
        const ordinary = render(Nav.Root, { props: { itemStyle, verticalBreakpoint: 'xs' } }).body;
        expect(ordinary).not.toContain('role=');
        expect(ordinary).not.toContain('aria-orientation=');
        const tabs = render(NavTabRoleTest, { props: { itemStyle, verticalBreakpoint: 'xs' } }).body;
        expect(tabs).toMatch(/<ul[^>]*role="tablist"/);
        expect(tabs).toMatch(/<ul[^>]*aria-orientation="vertical"/);
    });

    it('preserves explicit null in a server-rendered Tab root', () => {
        const html = render(NavTabRoleTest, { props: { role: null, verticalBreakpoint: 'xs' } }).body;
        const root = html.match(/<ul\b[^>]*>/)?.[0];
        expect(root).toBeDefined();
        expect(root).not.toContain('role=');
        expect(root).not.toContain('aria-orientation=');
    });
});

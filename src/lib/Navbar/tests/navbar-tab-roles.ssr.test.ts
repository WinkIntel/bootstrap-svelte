import type { ComponentProps } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import NavbarTabRoleTest from './navbar-tab-role-test.svelte';

const ordinaryRoles = [undefined, null, 'navigation', 'menubar'] as const;

const renderHtml = (props: ComponentProps<typeof NavbarTabRoleTest>) => render(NavbarTabRoleTest, { props }).body;
const count = (html: string, text: string) => html.split(text).length - 1;

function navbarNav(html: string) {
    const nav = html.match(/<ul\b[^>]*data-testid="navbar-nav"[^>]*>[\s\S]*<\/ul>/)?.[0] ?? '';
    return { nav, root: nav.slice(0, nav.indexOf('>')) };
}

function expectRenderedRole(root: string, role: ComponentProps<typeof NavbarTabRoleTest>['role']) {
    if (role) {
        expect(root).toContain(`role="${role}"`);
    } else {
        expect(root).not.toContain('role=');
    }
}

function expectTabChildren(nav: string) {
    expect(count(nav, 'role="tab"')).toBe(2);
    expect(count(nav, 'role="presentation"')).toBe(2);
    expect(count(nav, 'aria-selected=')).toBe(2);
    expect(count(nav, 'aria-selected="true"')).toBe(1);
    expect(count(nav, 'aria-controls=')).toBe(2);
}

function expectOrdinaryChildren(nav: string) {
    expect(nav).not.toContain('role="tab"');
    expect(nav).not.toContain('role="presentation"');
    expect(nav).not.toContain('aria-selected=');
    expect(nav).not.toContain('aria-controls=');
}

describe('server-rendered Navbar.Nav tab semantics', () => {
    it.each(['strip', 'collapse-strip', 'nested-strip'] as const)('infers tab children for an explicit tablist in %s', (scenario) => {
        const { nav, root } = navbarNav(renderHtml({ role: 'tablist', scenario }));
        expect(root).toContain('role="tablist"');
        expect(root).not.toContain('aria-orientation=');
        expectTabChildren(nav);
    });

    it.each(ordinaryRoles)('renders role %s unchanged with ordinary children in a Tab strip', (role) => {
        const { nav, root } = navbarNav(renderHtml({ role }));
        expectRenderedRole(root, role);
        expectOrdinaryChildren(nav);
    });

    it.each([...ordinaryRoles, 'tablist'] as const)('keeps children ordinary for role %s outside Tab.Root', (role) => {
        const { nav, root } = navbarNav(renderHtml({ role, scenario: 'no-tab-root' }));
        expectRenderedRole(root, role);
        expectOrdinaryChildren(nav);
    });

    it.each([...ordinaryRoles, 'tablist'] as const)('keeps pane navigation ordinary for role %s', (role) => {
        const { nav, root } = navbarNav(renderHtml({ role, scenario: 'pane' }));
        expectRenderedRole(root, role);
        expect(nav).toContain('data-tab-pane-id="#two"');
        expectOrdinaryChildren(nav);
    });

    it.each([...ordinaryRoles, 'tablist'] as const)('does not apply role %s to an independent nested Tab.Root', (role) => {
        const { nav, root } = navbarNav(renderHtml({ role, scenario: 'nested-tab-root' }));
        expectRenderedRole(root, role);
        expectTabChildren(nav);
    });
});

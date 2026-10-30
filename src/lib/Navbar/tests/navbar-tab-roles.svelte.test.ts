import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import type { Navbar } from '../index.js';
import NavbarTabRoleTest from './navbar-tab-role-test.svelte';

const ordinaryRoles = [undefined, null, 'navigation', 'menubar'] as const;
const outerTabs = { one: 'One', two: 'Two', onePanel: 'First pane', twoPanel: 'Second pane' };
const innerTabs = { one: 'Inner one', two: 'Inner two', onePanel: 'Inner first', twoPanel: 'Inner second' };

function expectRenderedRole(nav: HTMLElement, role: Navbar.NavProps['role']) {
    if (role) {
        expect(nav).toHaveAttribute('role', role);
    } else {
        expect(nav).not.toHaveAttribute('role');
    }
}

function expectTabChildren(nav: HTMLElement) {
    expect(within(nav).getAllByRole('tab')).toHaveLength(2);
    expect(nav.querySelectorAll('li[role="presentation"]')).toHaveLength(2);
    expect(nav.querySelectorAll('[aria-selected]')).toHaveLength(2);
    expect(nav.querySelectorAll('[aria-controls]')).toHaveLength(2);
}

function expectOrdinaryChildren(nav: HTMLElement) {
    expect(within(nav).queryAllByRole('tab')).toHaveLength(0);
    expect(nav.querySelectorAll('li[role]')).toHaveLength(0);
    expect(nav.querySelectorAll('[aria-selected], [aria-controls]')).toHaveLength(0);
}

function expectPanel(shown: string, hidden: string) {
    expect(screen.getByText(shown)).toHaveAttribute('role', 'tabpanel');
    expect(screen.queryByText(hidden)).not.toBeInTheDocument();
}

/** Clicks the Nav.Link, then the Tab.NavLink, moving selection and the panel in both directions. */
async function expectSelectionMoves(nav: HTMLElement, tabs = outerTabs) {
    const one = within(nav).getByRole('tab', { name: tabs.one });
    const two = within(nav).getByRole('tab', { name: tabs.two });
    expect(one.tagName.toLowerCase()).toBe('button');
    expect(two.tagName.toLowerCase()).toBe('a');

    await fireEvent.click(two);
    expect(one).toHaveAttribute('aria-selected', 'false');
    expect(two).toHaveAttribute('aria-selected', 'true');
    expectPanel(tabs.twoPanel, tabs.onePanel);

    await fireEvent.click(one);
    expect(one).toHaveAttribute('aria-selected', 'true');
    expect(two).toHaveAttribute('aria-selected', 'false');
    expectPanel(tabs.onePanel, tabs.twoPanel);
}

describe('Navbar.Nav tab semantics', () => {
    it.each(['strip', 'collapse-strip'] as const)('infers tab children for an explicit tablist in %s', async (scenario) => {
        render(NavbarTabRoleTest, { role: 'tablist', scenario });
        const nav = screen.getByRole('tablist', { name: 'Sections' });
        expect(nav).not.toHaveAttribute('aria-orientation');
        expectTabChildren(nav);

        const one = within(nav).getByRole('tab', { name: 'One' });
        const two = within(nav).getByRole('tab', { name: 'Two' });
        expect(one).toHaveAttribute('aria-controls', 'one');
        expect(one).toHaveAttribute('aria-selected', 'true');
        expect(two).toHaveAttribute('aria-controls', 'two');
        expect(two).toHaveAttribute('aria-selected', 'false');

        await expectSelectionMoves(nav);
    });

    it.each(ordinaryRoles)('renders role %s unchanged with ordinary children that still select panes in a Tab strip', async (role) => {
        render(NavbarTabRoleTest, { role });
        const nav = screen.getByTestId('navbar-nav');
        expectRenderedRole(nav, role);
        expectOrdinaryChildren(nav);

        const one = within(nav).getByRole('button', { name: 'One' });
        const two = within(nav).getByRole('link', { name: 'Two' });
        expect(one).toHaveClass('active');
        expect(two).not.toHaveClass('active');

        expect(await fireEvent.click(two)).toBe(false);
        expect(one).not.toHaveClass('active');
        expect(two).toHaveClass('active');
        expectPanel('Second pane', 'First pane');

        await fireEvent.click(one);
        expect(one).toHaveClass('active');
        expect(two).not.toHaveClass('active');
        expectPanel('First pane', 'Second pane');
        expectOrdinaryChildren(nav);
    });

    it.each([...ordinaryRoles, 'tablist'] as const)('keeps children ordinary for role %s outside Tab.Root', (role) => {
        render(NavbarTabRoleTest, { role, scenario: 'no-tab-root' });
        const nav = screen.getByTestId('navbar-nav');
        expectRenderedRole(nav, role);
        expectOrdinaryChildren(nav);
        expect(within(nav).getAllByRole('link')).toHaveLength(2);
    });

    it('tracks reactive role updates without remounting the strip', async () => {
        const { rerender } = render(NavbarTabRoleTest, { role: 'tablist' });
        const nav = screen.getByTestId('navbar-nav');
        expectTabChildren(nav);

        for (const role of ordinaryRoles) {
            await rerender({ role });
            expect(screen.getByTestId('navbar-nav')).toBe(nav);
            expectRenderedRole(nav, role);
            expectOrdinaryChildren(nav);

            await rerender({ role: 'tablist' });
            expect(screen.getByRole('tablist', { name: 'Sections' })).toBe(nav);
            expectTabChildren(nav);
        }

        await expectSelectionMoves(nav);
    });

    it.each([...ordinaryRoles, 'tablist'] as const)(
        'keeps pane navigation ordinary for role %s while Tab.NavLink selects its Tab.Root',
        async (role) => {
            render(NavbarTabRoleTest, { role, scenario: 'pane' });
            const nav = screen.getByTestId('navbar-nav');
            expectRenderedRole(nav, role);
            expectOrdinaryChildren(nav);

            expect(await fireEvent.click(within(nav).getByRole('link', { name: 'Section' }))).toBe(true);
            expect(screen.getByRole('tabpanel')).toHaveTextContent('First pane');

            await fireEvent.click(within(nav).getByRole('button', { name: 'Next' }));
            expect(screen.getByRole('tabpanel')).toHaveTextContent('Second pane');
        }
    );

    it.each([...ordinaryRoles, 'tablist'] as const)('does not apply role %s to an independent nested Tab.Root', async (role) => {
        render(NavbarTabRoleTest, { role, scenario: 'nested-tab-root' });
        const nav = screen.getByTestId('navbar-nav');
        expectRenderedRole(nav, role);
        expectTabChildren(nav);

        await expectSelectionMoves(nav, innerTabs);
    });

    it('binds a tablist in a nested Tab.Root to that root, not the enclosing pane', async () => {
        render(NavbarTabRoleTest, { role: 'tablist', scenario: 'nested-strip' });
        const nav = screen.getByRole('tablist', { name: 'Sections' });
        expectTabChildren(nav);

        await expectSelectionMoves(nav, innerTabs);
        expect(screen.getByText(/Outer pane/)).toBeInTheDocument();
    });
});

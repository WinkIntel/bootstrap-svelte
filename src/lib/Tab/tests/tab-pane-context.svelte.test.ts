import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TabPaneContextTest from './tab-pane-context-test.svelte';

function expectNoTabAttributes(element: HTMLElement) {
    expect(element).not.toHaveAttribute('aria-controls');
    expect(element).not.toHaveAttribute('aria-selected');
}

describe('Tab.Pane content context', () => {
    it.each([
        { scenario: 'bare-tab-nav-link', role: 'button' },
        { scenario: 'bare-nav-link', role: 'link' }
    ] as const)('selects another pane from $scenario without tab semantics', async ({ scenario, role }) => {
        render(TabPaneContextTest, { scenario });
        const pane = screen.getByRole('tabpanel');
        const control = within(pane).getByRole(role, { name: 'Next' });
        expect(within(pane).queryByRole('tab')).not.toBeInTheDocument();
        expectNoTabAttributes(control);
        expect(control.closest('li') ?? pane).not.toHaveAttribute('role', 'presentation');

        await fireEvent.click(control);
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Second step');
    });

    it.each([undefined, null, 'tablist'] as const)('selects a pane from Tab.NavLink under a pane Nav.Root with role %s', async (paneNavRole) => {
        render(TabPaneContextTest, { paneNavRole, scenario: 'pane-nav-tab-nav-link' });
        const nav = screen.getByTestId('pane-nav');
        if (paneNavRole) {
            expect(nav).toHaveAttribute('role', paneNavRole);
        } else {
            expect(nav).not.toHaveAttribute('role');
        }
        expect(within(nav).getByRole('listitem')).not.toHaveAttribute('role');
        const control = within(nav).getByRole('button', { name: 'Next' });
        expectNoTabAttributes(control);

        await fireEvent.click(control);
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Second step');
    });

    it('keeps Nav.Link under a pane Nav.Root ordinary, even for a pane href', async () => {
        render(TabPaneContextTest, { scenario: 'pane-nav-link' });
        const nav = screen.getByTestId('pane-nav');
        expect(nav).not.toHaveAttribute('role');
        const link = within(nav).getByRole('link', { name: 'Section' });
        expectNoTabAttributes(link);

        expect(await fireEvent.click(link)).toBe(true);
        expect(screen.getByRole('tabpanel')).toHaveTextContent('First step');
    });

    it('renders a Tab.Pane nested in a Tab.Pane against the real Tab root', () => {
        render(TabPaneContextTest, { scenario: 'nested-pane' });
        expect(screen.getByRole('tabpanel')).toHaveTextContent('First step');
        expect(screen.queryByText('Nested step')).not.toBeInTheDocument();
    });

    it.each(['outer-nav-root', 'strip-wrapped-pane'] as const)(
        'falls back to the real Tab root past a Nav.Root outside the pane in %s',
        async (scenario) => {
            render(TabPaneContextTest, { scenario });
            const link = within(screen.getByRole('tabpanel')).getByRole('link', { name: 'Next' });
            expectNoTabAttributes(link);

            await fireEvent.click(link);
            expect(screen.getByRole('tabpanel')).toHaveTextContent('Second step');
        }
    );

    it('binds links in nested tabs to the nearest Tab.Root and leaves the outer pane selected', async () => {
        render(TabPaneContextTest, { scenario: 'nested-tab-root' });
        expect(screen.getAllByRole('tablist')).toHaveLength(2);
        expect(screen.getByRole('tab', { name: 'Inner one' })).toHaveAttribute('aria-selected', 'true');

        await fireEvent.click(screen.getByRole('button', { name: 'Inner next' }));
        expect(screen.getByText('Inner second')).toBeInTheDocument();
        expect(screen.queryByText('Inner first')).not.toBeInTheDocument();
        expect(screen.getByText(/First step/)).toBeInTheDocument();
    });

    it('does not let an outer strip opt-out reach an independent nested Tab.Root', () => {
        render(TabPaneContextTest, { scenario: 'opted-out-outer-strip' });
        expect(screen.getByTestId('opted-out-nav')).not.toHaveAttribute('role');
        const tab = screen.getByRole('tab', { name: 'Inner one' });
        expect(tab).toHaveAttribute('aria-controls', 'inner-one');
        expect(tab).toHaveAttribute('aria-selected', 'true');
        expect(tab.closest('li')).toHaveAttribute('role', 'presentation');
    });

    it('does not let a pane Nav.Root make an independent nested Tab.Root ordinary', async () => {
        render(TabPaneContextTest, { scenario: 'pane-nav-nested-tab-root' });
        expect(screen.getByTestId('pane-nav')).not.toHaveAttribute('role');
        const tab = screen.getByRole('tab', { name: 'Inner two' });
        expect(tab.closest('li')).toHaveAttribute('role', 'presentation');

        await fireEvent.click(tab);
        expect(screen.getByText('Inner second')).toBeInTheDocument();
        expect(screen.getByText(/First step/)).toBeInTheDocument();
    });
});

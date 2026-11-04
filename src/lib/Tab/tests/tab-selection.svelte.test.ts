import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TabSelectionTest from './tab-selection-test.svelte';

function expectSelected(link: HTMLElement, selected: boolean) {
    expect(link).toHaveAttribute('aria-selected', String(selected));
    if (selected) expect(link).toHaveClass('active');
    else expect(link).not.toHaveClass('active');
}

describe('Tab pane controls synchronize strip selection', () => {
    it.each(['tab', 'nav'] as const)('restores strip A after B → A from an in-pane %s link, repeatedly', async (control) => {
        render(TabSelectionTest, { control });
        const a = screen.getByRole('tab', { name: 'A' });
        const b = screen.getByRole('tab', { name: 'B' });
        for (let count = 0; count < 2; count++) {
            await fireEvent.click(b);
            expect(screen.getByRole('tabpanel')).toHaveTextContent('Pane B');
            expectSelected(b, true);
            await fireEvent.click(screen.getByText('Return to A'));
            expect(screen.getByRole('tabpanel')).toHaveTextContent('Pane A');
            expectSelected(a, true);
            expectSelected(b, false);
        }
    });

    it('ignores earlier pane controls when choosing and labelling a strip representative', async () => {
        render(TabSelectionTest, { panesFirst: true, duplicates: true });
        expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'strip-a');
        await fireEvent.click(screen.getByRole('tab', { name: 'B' }));
        await fireEvent.click(screen.getByText('Return to A'));
        expectSelected(screen.getByRole('tab', { name: 'A' }), true);
        expectSelected(screen.getByRole('tab', { name: 'A second' }), false);
        expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'strip-a');
    });

    it('prefers the clicked duplicate, preserves it for same-pane controls, then falls back to the first strip match', async () => {
        render(TabSelectionTest, { duplicates: true });
        const a = screen.getByRole('tab', { name: 'A' });
        const second = screen.getByRole('tab', { name: 'A second' });
        await fireEvent.click(second);
        expectSelected(second, true);
        expectSelected(a, false);
        expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'strip-a-second');
        await fireEvent.click(screen.getByText('Stay on A'));
        expectSelected(second, true);
        expectSelected(a, false);
        await fireEvent.click(screen.getByRole('tab', { name: 'B' }));
        await fireEvent.click(screen.getByText('Return to A'));
        expectSelected(a, true);
        expectSelected(second, false);
    });

    it('shows a valid unlisted pane with an empty strip selection', async () => {
        render(TabSelectionTest);
        await fireEvent.click(screen.getByText('Go unlisted'));
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Unlisted pane');
        expect(screen.getByRole('tabpanel')).not.toHaveAttribute('aria-labelledby');
        for (const tab of screen.getAllByRole('tab')) expectSelected(tab, false);
        await fireEvent.click(screen.getByText('Return to A'));
        expectSelected(screen.getByRole('tab', { name: 'A' }), true);
    });

    it('keeps nested root selection isolated from the enclosing pane', async () => {
        render(TabSelectionTest, { nested: true });
        const outer = screen.getByRole('tablist', { name: 'Outer tabs' });
        const inner = screen.getByRole('tablist', { name: 'Inner tabs' });
        await fireEvent.click(within(inner).getByRole('tab', { name: 'Inner B' }));
        await fireEvent.click(screen.getByText('Return inner A'));
        expectSelected(within(inner).getByRole('tab', { name: 'Inner A' }), true);
        expectSelected(within(inner).getByRole('tab', { name: 'Inner B' }), false);
        expectSelected(within(outer).getByRole('tab', { name: 'A' }), true);
        expectSelected(within(outer).getByRole('tab', { name: 'B' }), false);
        expect(screen.getByText('Inner pane A')).toBeInTheDocument();
    });

    it.each([null, 'navigation'] as const)('selects strip members independently of root role %s', async (stripRole) => {
        render(TabSelectionTest, { stripRole });
        const a = screen.getByRole('button', { name: 'A' });
        const b = screen.getByRole('button', { name: 'B' });
        await fireEvent.click(b);
        await fireEvent.click(screen.getByText('Return to A'));
        expect(a).toHaveClass('active');
        expect(b).not.toHaveClass('active');
        expect(a).not.toHaveAttribute('aria-selected');
        expect(b).not.toHaveAttribute('aria-selected');
    });

    it.each([null, 'menuitem'] as const)('preserves explicit link role %s while synchronizing active classes', async (linkRole) => {
        const { container } = render(TabSelectionTest, { linkRole });
        const a = container.querySelector<HTMLElement>('#strip-a')!;
        const b = container.querySelector<HTMLElement>('#strip-b')!;
        await fireEvent.click(b);
        await fireEvent.click(screen.getByText('Return to A'));
        expect(a).toHaveClass('active');
        expect(b).not.toHaveClass('active');
        if (linkRole === null) expect(a).not.toHaveAttribute('role');
        else expect(a).toHaveAttribute('role', linkRole);
    });

    it('does not select a removed strip candidate', async () => {
        const { rerender } = render(TabSelectionTest, { duplicates: true });
        await fireEvent.click(screen.getByRole('tab', { name: 'B' }));
        await rerender({ showFirst: false });
        await fireEvent.click(screen.getByText('Return to A'));
        expectSelected(screen.getByRole('tab', { name: 'A second' }), true);
        expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'strip-a-second');
    });

    it('reads current strip IDs and targets after prop changes', async () => {
        const { rerender } = render(TabSelectionTest, { firstTarget: '#unlisted' });
        await fireEvent.click(screen.getByRole('tab', { name: 'B' }));
        await rerender({ firstId: 'renamed-strip-a', firstTarget: '#a' });
        await fireEvent.click(screen.getByText('Return to A'));
        const a = screen.getByRole('tab', { name: 'A' });
        expectSelected(a, true);
        expect(a).toHaveAttribute('id', 'renamed-strip-a');
        expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'renamed-strip-a');
    });

    it('preserves explicit controlled Nav.Link active props', async () => {
        render(TabSelectionTest, { controlled: true });
        const a = screen.getByRole('tab', { name: 'A' });
        const b = screen.getByRole('tab', { name: 'B' });
        await fireEvent.click(b);
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Pane B');
        expectSelected(a, true);
        expectSelected(b, false);
        await fireEvent.click(screen.getByText('Return to A'));
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Pane A');
        expectSelected(a, true);
        expectSelected(b, false);
    });

    it('preserves the empty-target no-op', async () => {
        render(TabSelectionTest, { returnTarget: '#' });
        const b = screen.getByRole('tab', { name: 'B' });
        await fireEvent.click(b);
        await fireEvent.click(screen.getByText('Return to A'));
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Pane B');
        expectSelected(b, true);
    });

    it('preserves unknown-target pane clearing and allows strip recovery', async () => {
        render(TabSelectionTest, { returnTarget: '#missing' });
        await fireEvent.click(screen.getByRole('tab', { name: 'B' }));
        await fireEvent.click(screen.getByText('Return to A'));
        expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
        for (const tab of screen.getAllByRole('tab')) expectSelected(tab, false);
        await fireEvent.click(screen.getByRole('tab', { name: 'A' }));
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Pane A');
        expectSelected(screen.getByRole('tab', { name: 'A' }), true);
    });
});

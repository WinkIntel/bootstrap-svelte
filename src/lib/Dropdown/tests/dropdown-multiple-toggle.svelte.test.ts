import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { DropdownRootState, DropdownToggleState } from '../dropdown.svelte.js';
import Fixture from './dropdown-multiple-toggle-test.svelte';
import LifecycleFixture from './dropdown-toggle-lifecycle-test.svelte';

describe('Dropdown multiple toggles', () => {
    it('keeps the first constructed toggle as the fallback', () => {
        const root = new DropdownRootState({});
        const first = new DropdownToggleState({ id: 'first' }, root);
        new DropdownToggleState({ id: 'second', isSplit: true }, root);
        expect(root.toggle).toBe(first);
        expect(root.ariaLabelledBy).toBe('first');
        expect(root.isButtonGroup).toBe(true);
    });

    it.each(['first-toggle', 'second-toggle'])('returns focus to the clicked %s on Escape', async (id) => {
        render(Fixture);
        const toggle = screen.getByTestId(id);
        const other = screen.getByTestId(id === 'first-toggle' ? 'second-toggle' : 'first-toggle');
        other.style.display = 'none';
        await fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(other).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByTestId('multiple-menu')).toHaveAttribute('aria-labelledby', id);
        screen.getByTestId('first-item').focus();
        await fireEvent.keyDown(screen.getByTestId('first-item'), { key: 'Escape' });
        expect(toggle).toHaveFocus();
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(other).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByTestId('multiple-root')).toHaveClass('btn-group');
    });

    it.each(['Tab', 'Shift', 'a', 'Escape'])('does not steal the opener on passive or dismissal key %s', async (key) => {
        render(Fixture);
        const first = screen.getByTestId('first-toggle');
        const second = screen.getByTestId('second-toggle');
        await fireEvent.click(first);
        second.focus();
        await fireEvent.keyDown(second, { key });
        expect(screen.getByTestId('multiple-menu')).toHaveAttribute('aria-labelledby', 'first-toggle');
        if (key !== 'Escape') {
            await fireEvent.keyDown(screen.getByTestId('first-item'), { key: 'Escape' });
        }
        expect(first).toHaveFocus();
    });

    it.each([
        ['first-toggle', 'ArrowDown', 'first-item'],
        ['second-toggle', 'ArrowUp', 'last-item']
    ])('opens from %s with %s and restores its focus', async (id, key, item) => {
        render(Fixture);
        const toggle = screen.getByTestId(id);
        toggle.focus();
        await fireEvent.keyDown(toggle, { key });
        await waitFor(() => expect(screen.getByTestId(item)).toHaveFocus());
        await fireEvent.keyDown(screen.getByTestId(item), { key: 'Escape' });
        expect(toggle).toHaveFocus();
    });

    it.each([
        ['first-toggle', 'remove-first', 'second-toggle'],
        ['second-toggle', 'remove-second', 'first-toggle']
    ])('releases unmounted %s and lets a remaining toggle claim the menu', async (id, removeId, remainingId) => {
        render(Fixture);
        const owner = screen.getByTestId(id);
        const focus = vi.spyOn(owner, 'focus');
        await fireEvent.click(owner);
        await fireEvent.click(screen.getByTestId(removeId));
        screen.getByTestId('first-item').focus();
        await fireEvent.keyDown(screen.getByTestId('first-item'), { key: 'Escape' });
        expect(focus).not.toHaveBeenCalled();
        const remaining = screen.getByTestId(remainingId);
        expect(remaining).toHaveFocus();
        expect(screen.getByTestId('multiple-menu')).toHaveAttribute('aria-labelledby', remainingId);
        await fireEvent.keyDown(remaining, { key: 'ArrowDown' });
        await waitFor(() => expect(screen.getByTestId('first-item')).toHaveFocus());
        await fireEvent.keyDown(screen.getByTestId('first-item'), { key: 'Escape' });
        expect(remaining).toHaveFocus();
        expect(screen.getByTestId('multiple-menu')).toHaveAttribute('aria-labelledby', remainingId);
    });

    it.each([false, true])('preserves a replacement toggle with keyed=%s', async (keyed) => {
        render(LifecycleFixture, { keyed });
        await fireEvent.click(screen.getByTestId('swap-toggle'));
        await fireEvent.click(screen.getByTestId('swap'));
        expect(screen.getByTestId('swap-menu')).toHaveAttribute('aria-labelledby', 'replacement-toggle');
        screen.getByTestId('swap-item').focus();
        await fireEvent.keyDown(screen.getByTestId('swap-item'), { key: 'Escape' });
        expect(screen.getByTestId('swap-toggle')).toHaveFocus();
    });

    it('hands off after an outgoing branch finishes its transition', async () => {
        render(LifecycleFixture, { withOutro: true });
        await fireEvent.click(screen.getByTestId('swap-toggle'));
        await fireEvent.click(screen.getByTestId('swap'));
        await waitFor(() => expect(screen.getByTestId('swap-menu')).toHaveAttribute('aria-labelledby', 'replacement-toggle'));
        screen.getByTestId('swap-item').focus();
        await fireEvent.keyDown(screen.getByTestId('swap-item'), { key: 'Escape' });
        expect(screen.getByTestId('swap-toggle')).toHaveFocus();
    });

    it('keeps the menu label in sync when the owning toggle id changes', async () => {
        render(LifecycleFixture);
        expect(screen.getByTestId('dynamic-menu')).toHaveAttribute('aria-labelledby', 'original-toggle');
        await fireEvent.click(screen.getByTestId('rename'));
        expect(screen.getByTestId('dynamic-toggle')).toHaveAttribute('id', 'renamed-toggle');
        expect(screen.getByTestId('dynamic-menu')).toHaveAttribute('aria-labelledby', 'renamed-toggle');
    });

    it.each(['remove-split', 'unset-split'])('keeps mounted split promotion until %s', async (control) => {
        render(LifecycleFixture);
        expect(screen.getByTestId('split-root')).toHaveClass('btn-group');
        await fireEvent.click(screen.getByTestId(control));
        expect(screen.getByTestId('split-root')).not.toHaveClass('btn-group');
    });

    it('preserves explicit button group styling when split toggles are removed', async () => {
        render(LifecycleFixture, { buttonGroup: true });
        await fireEvent.click(screen.getByTestId('remove-split'));
        expect(screen.getByTestId('split-root')).toHaveClass('btn-group');
    });

    it('clears focus return and labelling when no toggles remain', async () => {
        render(Fixture);
        const first = screen.getByTestId('first-toggle');
        const second = screen.getByTestId('second-toggle');
        const focusFirst = vi.spyOn(first, 'focus');
        const focusSecond = vi.spyOn(second, 'focus');
        await fireEvent.click(first);
        await fireEvent.click(screen.getByTestId('remove-first'));
        await fireEvent.click(screen.getByTestId('remove-second'));
        expect(screen.getByTestId('multiple-menu')).not.toHaveAttribute('aria-labelledby');
        screen.getByTestId('first-item').focus();
        await fireEvent.keyDown(screen.getByTestId('first-item'), { key: 'Escape' });
        expect(focusFirst).not.toHaveBeenCalled();
        expect(focusSecond).not.toHaveBeenCalled();
    });

    it('does not clear the owner when another toggle unmounts', async () => {
        render(Fixture);
        const first = screen.getByTestId('first-toggle');
        await fireEvent.click(first);
        await fireEvent.click(screen.getByTestId('remove-second'));
        screen.getByTestId('first-item').focus();
        await fireEvent.keyDown(screen.getByTestId('first-item'), { key: 'Escape' });
        expect(first).toHaveFocus();
    });
});

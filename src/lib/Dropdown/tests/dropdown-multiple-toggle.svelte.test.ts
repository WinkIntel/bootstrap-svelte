import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { DropdownRootState, DropdownToggleState } from '../dropdown.svelte.js';
import Fixture from './dropdown-multiple-toggle-test.svelte';

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
        expect(screen.getByTestId('multiple-menu')).not.toHaveAttribute('aria-labelledby');
        const remaining = screen.getByTestId(remainingId);
        await fireEvent.keyDown(remaining, { key: 'ArrowDown' });
        await waitFor(() => expect(screen.getByTestId('first-item')).toHaveFocus());
        await fireEvent.keyDown(screen.getByTestId('first-item'), { key: 'Escape' });
        expect(remaining).toHaveFocus();
        expect(screen.getByTestId('multiple-menu')).toHaveAttribute('aria-labelledby', remainingId);
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

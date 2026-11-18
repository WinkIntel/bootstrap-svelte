import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Fixture from './pagination-selection-test.svelte';

const root = () => screen.getByTestId('selection-root');
const active = () => [...root().querySelectorAll('.page-item.active')];
const current = () => [...root().querySelectorAll('[aria-current="page"]')];
function selected(id: string) {
    expect(active()).toEqual([screen.getByTestId(`${id}-item`)]);
    expect(current()).toEqual(active());
}

describe('Pagination interaction-owned selection', () => {
    test('replaces earlier declarative flags after repeated page selection', async () => {
        render(Fixture, { multiple: true });
        expect(active()).toHaveLength(2);
        for (const id of ['one', 'three', 'two', 'one', 'one']) {
            await fireEvent.click(screen.getByTestId(`${id}-link`));
            selected(id);
        }
        expect(screen.getByTestId('clicks')).toHaveTextContent('3');
    });
    test('later observable declarative changes supersede the click selection', async () => {
        render(Fixture);
        await fireEvent.click(screen.getByTestId('one-link'));
        await fireEvent.click(screen.getByTestId('declare-one'));
        selected('one');
        await fireEvent.click(screen.getByTestId('declare-two'));
        selected('two');
    });
    test('a later false flag releases selection even when no flag becomes true', async () => {
        render(Fixture);
        await fireEvent.click(screen.getByTestId('one-link'));
        await fireEvent.click(screen.getByTestId('declare-none'));
        expect(active()).toHaveLength(0);
        expect(current()).toHaveLength(0);
        await fireEvent.click(screen.getByTestId('three-link'));
        selected('three');
    });
    test('newly mounted flags do not supersede an existing selected identity', async () => {
        render(Fixture);
        await fireEvent.click(screen.getByTestId('one-link'));
        await fireEvent.click(screen.getByTestId('mount-active'));
        selected('one');
    });
    test.each(['change-id', 'remove-one'])('restores declarative flags on %s without selecting a reused id', async (action) => {
        render(Fixture, { multiple: true });
        await fireEvent.click(screen.getByTestId('one-link'));
        await fireEvent.click(screen.getByTestId(action));
        expect(active()).toEqual([screen.getByTestId('two-item'), screen.getByTestId('three-item')]);
        expect(current()).toEqual(active());
        await fireEvent.click(screen.getByTestId('reuse-link'));
        selected('reuse');
    });
    test('keeps declarative-only rendering reactive before interaction', async () => {
        render(Fixture, { multiple: true });
        expect(active()).toHaveLength(2);
        await fireEvent.click(screen.getByTestId('declare-one'));
        selected('one');
        await fireEvent.click(screen.getByTestId('declare-two'));
        selected('two');
    });
    test('leaves disabled items inert without clearing declarative selection', async () => {
        render(Fixture, { disabled: true });
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        screen.getByTestId('one-link').dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        selected('two');
        expect(screen.getByTestId('clicks')).toHaveTextContent('0');
    });
    test('preserves fully declarative stateless selection and callbacks', async () => {
        render(Fixture, { isStateful: false, multiple: true });
        await fireEvent.click(screen.getByTestId('one-link'));
        expect(active()).toHaveLength(2);
        expect(screen.getByTestId('one-item')).not.toHaveClass('active');
        expect(screen.getByTestId('clicks')).toHaveTextContent('1');
        await fireEvent.click(screen.getByTestId('declare-one'));
        selected('one');
        await fireEvent.click(screen.getByTestId('three-link'));
        selected('one');
    });
    test('uses declarative flags when switching to stateless mode', async () => {
        const { rerender } = render(Fixture);
        await fireEvent.click(screen.getByTestId('one-link'));
        selected('one');
        await rerender({ isStateful: false });
        selected('two');
        await fireEvent.click(screen.getByTestId('three-link'));
        selected('two');
        await rerender({ isStateful: true });
        selected('two');
        await fireEvent.click(screen.getByTestId('one-link'));
        selected('one');
        await rerender({ isStateful: false });
        selected('two');
        await rerender({ isStateful: true });
        selected('two');
    });
    test('keeps roots independent even with matching item ids', async () => {
        render(Fixture);
        await fireEvent.click(screen.getByTestId('one-link'));
        const other = screen.getByTestId('independent-root');
        expect(other.querySelector('.active')).toHaveAttribute('id', 'two');
        await fireEvent.click(screen.getByTestId('other-link'));
        selected('one');
        expect(other.querySelectorAll('.active')).toHaveLength(1);
        expect(other.querySelector('.active')).toHaveAttribute('id', 'one');
    });
});

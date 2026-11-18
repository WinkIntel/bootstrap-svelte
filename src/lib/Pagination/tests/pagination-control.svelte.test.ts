import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Fixture from './pagination-control-test.svelte';

describe('Pagination designated controls', () => {
    test('preserves selection, navigation and callbacks for Prev, Next and ellipsis', async () => {
        render(Fixture);
        for (const name of ['prev', 'next', 'ellipsis']) {
            const link = screen.getByTestId(`${name}-link`);
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            await fireEvent(link, event);
            expect(event.defaultPrevented).toBe(false);
            expect(link).toHaveAttribute('href', name === 'prev' ? '#previous' : name === 'next' ? '#next' : '#more');
            expect(screen.getByTestId(`${name}-item`)).not.toHaveClass('active');
            expect(screen.getByTestId(`${name}-item`)).not.toHaveAttribute('aria-current');
            expect(screen.getByTestId(`${name}-item`)).not.toHaveAttribute('isControl');
        }
        expect(screen.getByTestId('controls-root').querySelectorAll('.active')).toHaveLength(1);
        expect(screen.getByTestId('page-item')).toHaveClass('active');
        expect(screen.getByTestId('control-calls')).toHaveTextContent('3');
    });
    test('retains legacy selection for unmarked items and reacts to the control flag', async () => {
        const { rerender } = render(Fixture, { isControl: false });
        await fireEvent.click(screen.getByTestId('next-link'));
        expect(screen.getByTestId('next-item')).toHaveClass('active');
        expect(screen.getByTestId('page-item')).not.toHaveClass('active');
        await rerender({ isControl: true });
        await fireEvent.click(screen.getByTestId('prev-link'));
        expect(screen.getByTestId('next-item')).toHaveClass('active');
        expect(screen.getByTestId('prev-item')).not.toHaveClass('active');
    });
    test('leaves stateless control behavior and disabled event handling unchanged', async () => {
        render(Fixture, { isStateful: false, disabled: true });
        await fireEvent.click(screen.getByTestId('next-link'));
        expect(screen.getByTestId('page-item')).toHaveClass('active');
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        screen.getByTestId('disabled-control-link').dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(screen.getByTestId('control-calls')).toHaveTextContent('1');
    });
});

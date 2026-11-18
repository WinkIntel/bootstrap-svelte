import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import Playground from './PaginationPlayground.svelte';

test('legacy app-managed stateful playground keeps page and arrow callbacks synchronized', async () => {
    const { container } = render(Playground);
    const selected = (page: string) => {
        const active = container.querySelectorAll('.page-item.active');
        expect(active).toHaveLength(1);
        expect(active[0]!.textContent?.trim()).toBe(page);
        expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    };
    selected('1');
    await fireEvent.click(screen.getByRole('link', { name: '3' }));
    selected('3');
    await fireEvent.click(screen.getByRole('link', { name: 'Next' }));
    selected('4');
    await fireEvent.click(screen.getByRole('link', { name: 'Previous' }));
    selected('3');
});

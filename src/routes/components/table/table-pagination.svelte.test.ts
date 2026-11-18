import { fireEvent, render, within } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import Page from './+page.svelte';

test('Table footer navigation controls preserve the current page and match their displayed example', async () => {
    const { container } = render(Page);
    const section = container.querySelector('#table-container-footer-example')!;
    const next = within(section as HTMLElement).getByRole('link', { name: 'Next' });
    await fireEvent.click(next);
    const active = section.querySelectorAll('.page-item.active');
    expect(active).toHaveLength(1);
    expect(active[0]!.textContent?.trim()).toBe('1');
    expect(next.parentElement).not.toHaveAttribute('aria-current');
    const sample = section.querySelector('pre code')!.textContent!;
    expect(sample.match(/<Pagination.Item isControl/g)).toHaveLength(2);
});

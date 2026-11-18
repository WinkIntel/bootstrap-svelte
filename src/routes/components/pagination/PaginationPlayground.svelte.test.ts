import { fireEvent, render, screen } from '@testing-library/svelte';
import { compile } from 'svelte/compiler';
import { expect, test } from 'vitest';
import Playground from './PaginationPlayground.svelte';

test('application-controlled page and arrow clicks retain a single current page', async () => {
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

test('generated controlled example compiles and includes working page callbacks', () => {
    const { container } = render(Playground);
    const code = container.querySelector('pre code')!.textContent!;
    expect(code).toContain('isStateful={false}');
    expect(code).toContain('isControl');
    expect(code).toContain('onclick={() => activePage = 3}');
    expect(() => compile(code, { generate: 'client' })).not.toThrow();
});

test('reachable disabled-item controls preserve selection and produce a compilable example', async () => {
    const { container } = render(Playground);
    await fireEvent.click(screen.getByRole('checkbox', { name: 'Include Disabled Item' }));
    const disabled = screen.getByRole('link', { name: '2' });
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await fireEvent.click(disabled);
    expect(container.querySelector('.page-item.active')!.textContent?.trim()).toBe('1');
    const code = container.querySelector('pre code')!.textContent!;
    expect(() => compile(code, { generate: 'client' })).not.toThrow();
});

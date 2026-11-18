import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Fixture from './pagination-app-state-test.svelte';

const selected = (id: string) => {
    const root = screen.getByTestId('app-root');
    expect([...root.querySelectorAll('.active')]).toEqual([screen.getByTestId(id)]);
    expect([...root.querySelectorAll('[aria-current="page"]')]).toEqual([screen.getByTestId(id)]);
};

describe('Pagination application state compatibility', () => {
    test('lets callback-driven page flags supersede an unmarked arrow selection', async () => {
        render(Fixture);
        await fireEvent.click(screen.getByTestId('link-3'));
        selected('page-3');
        await fireEvent.click(screen.getByTestId('next-link'));
        expect(screen.getByTestId('app-page')).toHaveTextContent('4');
        selected('page-4');
        await fireEvent.click(screen.getByTestId('previous-link'));
        selected('page-3');
    });
    test('lets external page updates supersede clicks repeatedly', async () => {
        render(Fixture);
        for (const page of [3, 4, 2]) {
            await fireEvent.click(screen.getByTestId(`link-${page}`));
            selected(`page-${page}`);
            await fireEvent.click(screen.getByTestId('external-page'));
            selected('page-1');
        }
    });
    test('restores current app flags on repeated keyed remounts', async () => {
        render(Fixture);
        await fireEvent.click(screen.getByTestId('link-3'));
        for (let n = 0; n < 3; n++) {
            await fireEvent.click(screen.getByTestId('remount-pages'));
            selected('page-3');
        }
    });
    test('does not activate empty or null ids when the selected identity disappears', async () => {
        render(Fixture, { emptyIds: true });
        await fireEvent.click(screen.getByTestId('link-3'));
        await fireEvent.click(screen.getByTestId('remove-selected'));
        expect(screen.getByTestId('app-root').querySelectorAll('.active')).toHaveLength(0);
        expect(screen.getByTestId('app-root').querySelectorAll('[aria-current="page"]')).toHaveLength(0);
        await fireEvent.click(screen.getByTestId('external-page'));
        selected('page-1');
    });
    test('lets marked controls update app flags after repeated page clicks', async () => {
        render(Fixture, { controls: true });
        for (let n = 0; n < 3; n++) {
            await fireEvent.click(screen.getByTestId('link-3'));
            await fireEvent.click(screen.getByTestId('next-link'));
            selected('page-4');
            await fireEvent.click(screen.getByTestId('previous-link'));
            selected('page-3');
        }
    });
});

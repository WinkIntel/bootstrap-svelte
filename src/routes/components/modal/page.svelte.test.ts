import { cleanup, fireEvent, render, screen, within } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { compile, parse } from 'svelte/compiler';
import ModalPage from './+page.svelte';

beforeEach(() => vi.useFakeTimers());

afterEach(() => {
    cleanup();
    const pendingTimers = vi.getTimerCount();
    vi.useRealTimers();
    expect(pendingTimers).toBe(0);
});

async function dismiss(modal: HTMLElement, method: string) {
    if (method === 'Escape') await fireEvent.keyDown(document, { key: 'Escape' });
    else if (method === 'backdrop') await fireEvent.mouseDown(modal);
    else if (method === 'header close') await fireEvent.click(within(modal).getByLabelText('Close'));
    else await fireEvent.click(within(modal.querySelector('.modal-footer') as HTMLElement).getByRole('button', { name: 'Close' }));
}

describe('Modal showcase basic example', () => {
    test.each(['Escape', 'backdrop', 'header close', 'footer close'])('reopens after completed %s dismissal', async (method) => {
        render(ModalPage);
        const opener = screen.getByRole('button', { name: 'Launch demo modal' });
        for (let cycle = 0; cycle < 3; cycle++) {
            await fireEvent.click(opener);
            await vi.advanceTimersByTimeAsync(350);
            const modal = screen.getByRole('dialog', { name: 'Modal title' });
            await dismiss(modal, method);
            await vi.advanceTimersByTimeAsync(350);
            expect(modal).not.toBeInTheDocument();
        }
    });

    test.each(['Escape', 'backdrop', 'header close', 'footer close'])('reopens during the %s outro', async (method) => {
        render(ModalPage);
        const opener = screen.getByRole('button', { name: 'Launch demo modal' });
        for (let cycle = 0; cycle < 3; cycle++) {
            await fireEvent.click(opener);
            await vi.advanceTimersByTimeAsync(350);
            const modal = screen.getByRole('dialog', { name: 'Modal title' });
            const outroStarted = vi.fn();
            modal.addEventListener('outrostart', outroStarted, { once: true });
            await dismiss(modal, method);
            await vi.advanceTimersByTimeAsync(50);
            expect(outroStarted).toHaveBeenCalledOnce();
            expect(modal).toBeInTheDocument();
            await fireEvent.click(opener);
            await vi.advanceTimersByTimeAsync(400);
            const reopened = screen.getByRole('dialog', { name: 'Modal title' });
            expect(reopened).toHaveClass('show');
            await dismiss(reopened, 'footer close');
            await vi.advanceTimersByTimeAsync(350);
            expect(screen.queryByRole('dialog', { name: 'Modal title' })).not.toBeInTheDocument();
        }
    });
});

describe('Other Modal showcase examples', () => {
    const examples = [
        ['Launch static backdrop modal', 'Static modal', ['Escape', 'header close', 'footer close']],
        ['Long content modal', 'Long content modal'],
        ['Scrollable modal', 'Long content modal with scrollable'],
        ['Vertically centered modal', 'Vertically centered modal'],
        ['Vertically centered scrollable', 'Vertically centered scrollable modal'],
        ['Launch modal with grid', 'Grid in Modal'],
        ['Open first modal', 'Modal 1', ['Escape', 'backdrop', 'header close']],
        ['Full screen below lg', 'Full screen below lg']
    ] as const;
    const cases = examples.flatMap(([buttonName, dialogName, methods = ['Escape', 'backdrop', 'header close', 'footer close']]) =>
        methods.map((method) => ({ buttonName, dialogName, method }))
    );

    test.each(cases)('$buttonName reopens during $method outro and dismisses again', async ({ buttonName, dialogName, method }) => {
        render(ModalPage);
        const opener = screen.getByRole('button', { name: buttonName });
        for (let cycle = 0; cycle < 2; cycle++) {
            await fireEvent.click(opener);
            await vi.advanceTimersByTimeAsync(350);
            const modal = screen.getByRole('dialog', { name: dialogName });
            const outroStarted = vi.fn();
            modal.addEventListener('outrostart', outroStarted, { once: true });
            await dismiss(modal, method);
            await vi.advanceTimersByTimeAsync(50);
            expect(outroStarted).toHaveBeenCalledOnce();
            expect(modal).toBeInTheDocument();
            await fireEvent.click(opener);
            await vi.advanceTimersByTimeAsync(400);
            const reopened = screen.getByRole('dialog', { name: dialogName });
            expect(reopened).toHaveClass('show');
            await dismiss(reopened, 'header close');
            await vi.advanceTimersByTimeAsync(350);
            expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument();
        }
    });

    test.each(['Escape', 'backdrop', 'header close', 'footer close'])('the unanimated example reopens immediately after %s', async (method) => {
        render(ModalPage);
        const opener = screen.getByRole('button', { name: 'Modal without fade' });
        for (let cycle = 0; cycle < 3; cycle++) {
            await fireEvent.click(opener);
            const modal = screen.getByRole('dialog', { name: 'Modal without fade animation' });
            const outroStarted = vi.fn();
            modal.addEventListener('outrostart', outroStarted, { once: true });
            await dismiss(modal, method);
            // There is no mid-outro interval with a zero-duration transition.
            expect(outroStarted).toHaveBeenCalledOnce();
            expect(screen.queryByRole('dialog', { name: 'Modal without fade animation' })).not.toBeInTheDocument();
        }
        // Flush Svelte's zero-delay delegated-event cleanup before unmounting.
        await vi.advanceTimersByTimeAsync(0);
    });

    test.each(['Escape', 'backdrop', 'header close'])('Modal 2 reopens through the toggle flow after %s', async (method) => {
        render(ModalPage);
        for (let cycle = 0; cycle < 3; cycle++) {
            await fireEvent.click(screen.getByRole('button', { name: 'Open first modal' }));
            await vi.advanceTimersByTimeAsync(350);
            await fireEvent.click(screen.getByRole('button', { name: 'Open second modal' }));
            await vi.advanceTimersByTimeAsync(750);
            await dismiss(screen.getByRole('dialog', { name: 'Modal 2' }), method);
            await vi.advanceTimersByTimeAsync(350);
            expect(screen.queryByRole('dialog', { name: 'Modal 2' })).not.toBeInTheDocument();
        }
    });

    test('the toggle footer returns to Modal 1 and both dialogs can dismiss', async () => {
        render(ModalPage);
        for (let cycle = 0; cycle < 2; cycle++) {
            await fireEvent.click(screen.getByRole('button', { name: 'Open first modal' }));
            await vi.advanceTimersByTimeAsync(350);
            await fireEvent.click(screen.getByRole('button', { name: 'Open second modal' }));
            await vi.advanceTimersByTimeAsync(750);
            await fireEvent.click(screen.getByRole('button', { name: 'Back to first' }));
            await vi.advanceTimersByTimeAsync(750);
            expect(screen.queryByRole('dialog', { name: 'Modal 2' })).not.toBeInTheDocument();
            const first = screen.getByRole('dialog', { name: 'Modal 1' });
            expect(first).toHaveClass('show');
            await dismiss(first, 'header close');
            await vi.advanceTimersByTimeAsync(350);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        }
    });
});

describe.each([true, false])('Modal playground (event tracking: %s)', (trackEvents) => {
    test('the displayed snippet resets visibility when hiding starts', async () => {
        render(ModalPage);
        if (!trackEvents) await fireEvent.click(screen.getByLabelText('Track Events'));
        // Svelte clears the last delegated event in a zero-delay task.
        await vi.advanceTimersByTimeAsync(0);
        const code = document.querySelector('.playground pre')?.textContent ?? '';
        expect(code).toContain('onHide={handleHide}');
        expect(code).toMatch(/function handleHide\(\)\s*\{\s*isShown = false;/);
        const ast = parse(code, { modern: true });
        const declarations = ast.instance?.content.body ?? [];
        const imports = declarations.filter((node) => node.type === 'ImportDeclaration');
        expect(imports).toEqual([
            expect.objectContaining({
                source: expect.objectContaining({ value: '@winkintel/bootstrap-svelte' }),
                specifiers: expect.arrayContaining([
                    expect.objectContaining({ local: expect.objectContaining({ name: 'Button' }) }),
                    expect.objectContaining({ local: expect.objectContaining({ name: 'Modal' }) })
                ])
            })
        ]);
        const functions = declarations.filter((node) => node.type === 'FunctionDeclaration').map((node) => node.id?.name);
        for (const [, handler] of code.matchAll(/\bon\w+=\{(\w+)\}/g)) {
            expect(functions, `The generated snippet must define ${handler}`).toContain(handler);
        }
        expect(() => compile(code, { generate: 'client', runes: true })).not.toThrow();
    });

    test.each(['Escape', 'backdrop', 'header close', 'footer close'])('reopens after completed %s dismissal', async (method) => {
        render(ModalPage);
        if (!trackEvents) await fireEvent.click(screen.getByLabelText('Track Events'));
        const opener = screen.getByRole('button', { name: 'Open Modal' });
        for (let cycle = 0; cycle < 3; cycle++) {
            await fireEvent.click(opener);
            await vi.advanceTimersByTimeAsync(350);
            const modal = screen.getByRole('dialog', { name: 'Modal Title' });
            await dismiss(modal, method);
            await vi.advanceTimersByTimeAsync(350);
            expect(modal).not.toBeInTheDocument();
        }
    });

    test.each(['Escape', 'backdrop', 'header close', 'footer close'])('reopens during the %s outro', async (method) => {
        render(ModalPage);
        if (!trackEvents) await fireEvent.click(screen.getByLabelText('Track Events'));
        const opener = screen.getByRole('button', { name: 'Open Modal' });
        await fireEvent.click(opener);
        await vi.advanceTimersByTimeAsync(350);
        const modal = screen.getByRole('dialog', { name: 'Modal Title' });
        const outroStarted = vi.fn();
        modal.addEventListener('outrostart', outroStarted, { once: true });
        await dismiss(modal, method);
        await vi.advanceTimersByTimeAsync(50);
        expect(outroStarted).toHaveBeenCalledOnce();
        expect(modal).toBeInTheDocument();
        await fireEvent.click(opener);
        await vi.advanceTimersByTimeAsync(400);
        const reopened = screen.getByRole('dialog', { name: 'Modal Title' });
        expect(reopened).toHaveClass('show');
        if (trackEvents) {
            expect(screen.getByText('Modal is hiding')).toBeInTheDocument();
            expect(screen.queryByText('Modal is fully hidden')).not.toBeInTheDocument();
        }
        await dismiss(reopened, 'footer close');
        await vi.advanceTimersByTimeAsync(350);
        expect(screen.queryByRole('dialog', { name: 'Modal Title' })).not.toBeInTheDocument();
    });
});

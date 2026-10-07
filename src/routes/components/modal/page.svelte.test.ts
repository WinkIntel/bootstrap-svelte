import { cleanup, fireEvent, render, screen, within } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
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
            expect(screen.getByRole('dialog', { name: 'Modal title' })).toHaveClass('show');
            await dismiss(modal, 'footer close');
            await vi.advanceTimersByTimeAsync(350);
            expect(modal).not.toBeInTheDocument();
        }
    });
});

describe('Other Modal showcase examples', () => {
    test.each([
        ['Launch static backdrop modal', 'Static modal'],
        ['Long content modal', 'Long content modal'],
        ['Scrollable modal', 'Long content modal with scrollable'],
        ['Vertically centered modal', 'Vertically centered modal'],
        ['Vertically centered scrollable', 'Vertically centered scrollable modal'],
        ['Launch modal with grid', 'Grid in Modal'],
        ['Open first modal', 'Modal 1'],
        ['Full screen below lg', 'Full screen below lg']
    ])('%s reopens during header-close outro', async (buttonName, dialogName) => {
        render(ModalPage);
        const opener = screen.getByRole('button', { name: buttonName });
        await fireEvent.click(opener);
        await vi.advanceTimersByTimeAsync(350);
        const modal = screen.getByRole('dialog', { name: dialogName });
        const outroStarted = vi.fn();
        modal.addEventListener('outrostart', outroStarted, { once: true });
        await dismiss(modal, 'header close');
        await vi.advanceTimersByTimeAsync(50);
        expect(outroStarted).toHaveBeenCalledOnce();
        expect(modal).toBeInTheDocument();
        await fireEvent.click(opener);
        await vi.advanceTimersByTimeAsync(400);
        expect(screen.getByRole('dialog', { name: dialogName })).toHaveClass('show');
    });

    test('the unanimated example reopens after header close', async () => {
        render(ModalPage);
        const opener = screen.getByRole('button', { name: 'Modal without fade' });
        for (let cycle = 0; cycle < 3; cycle++) {
            await fireEvent.click(opener);
            await vi.advanceTimersByTimeAsync(50);
            const modal = screen.getByRole('dialog', { name: 'Modal without fade animation' });
            await dismiss(modal, 'header close');
            await vi.advanceTimersByTimeAsync(50);
            expect(modal).not.toBeInTheDocument();
        }
    });

    test('both toggle examples can be reopened after header dismissal', async () => {
        render(ModalPage);
        for (let cycle = 0; cycle < 3; cycle++) {
            await fireEvent.click(screen.getByRole('button', { name: 'Open first modal' }));
            await vi.advanceTimersByTimeAsync(350);
            await fireEvent.click(screen.getByRole('button', { name: 'Open second modal' }));
            await vi.advanceTimersByTimeAsync(750);
            const modal = screen.getByRole('dialog', { name: 'Modal 2' });
            await dismiss(modal, 'header close');
            await vi.advanceTimersByTimeAsync(350);
            expect(modal).not.toBeInTheDocument();
        }
    });
});

describe.each([true, false])('Modal playground (event tracking: %s)', (trackEvents) => {
    test('the displayed snippet resets visibility when hiding starts', async () => {
        render(ModalPage);
        if (!trackEvents) await fireEvent.click(screen.getByLabelText('Track Events'));
        // Svelte clears the last delegated event in a zero-delay task.
        await vi.advanceTimersByTimeAsync(0);
        const code = document.querySelector('.playground pre')?.textContent;
        expect(code).toMatch(/onHide=\{[^\n]*isShown = false/);
        expect(code).not.toMatch(/onHidden=\{[^\n]*isShown = false/);
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
        expect(screen.getByRole('dialog', { name: 'Modal Title' })).toHaveClass('show');
        if (trackEvents) {
            expect(screen.getByText('Modal is hiding')).toBeInTheDocument();
            expect(screen.queryByText('Modal is fully hidden')).not.toBeInTheDocument();
        }
    });
});

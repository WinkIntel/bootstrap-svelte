import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from '../index.js';
import ModalAccessibilityTest from './modal-accessibility-test.svelte';
import ModalBasicTest from './modal-basic-test.svelte';
import ModalDynamicTitleIdTest from './modal-dynamic-title-id-test.svelte';
import ModalLifecycleTest from './modal-lifecycle-test.svelte';
import ModalOffcanvasStackTest from './modal-offcanvas-stack-test.svelte';
import ModalStackedTest from './modal-stacked-test.svelte';
import ModalStaticBackdropTest from './modal-static-backdrop-test.svelte';

describe('Modal Component', () => {
    it('should render basic modal with all sub-components', () => {
        render(ModalBasicTest);

        // Check if modal root component is rendered
        const modal = screen.getByTestId('modal');
        expect(modal).toHaveClass('modal');
        expect(modal).toHaveClass('fade');
        expect(modal).toHaveClass('show');
        expect(modal).toHaveClass('d-block');
        expect(modal).toHaveAttribute('id', 'test-modal');

        // Check if modal dialog is rendered
        const dialog = screen.getByTestId('modal-dialog');
        expect(dialog).toHaveClass('modal-dialog');

        // Check if modal content is rendered
        const content = screen.getByTestId('modal-content');
        expect(content).toHaveClass('modal-content');

        // Check if modal header is rendered
        const header = screen.getByTestId('modal-header');
        expect(header).toHaveClass('modal-header');

        // Check if modal title is rendered
        const title = screen.getByTestId('modal-title');
        expect(title).toHaveClass('modal-title');
        expect(title.tagName).toBe('H5'); // Default heading level is 5
        expect(title).toHaveTextContent('Modal Title');

        // Check if modal body is rendered
        const body = screen.getByTestId('modal-body');
        expect(body).toHaveClass('modal-body');

        // Check content in the body
        const bodyContent = screen.getByTestId('modal-content-text');
        expect(bodyContent).toHaveTextContent('This is the modal body content.');

        // Check close button in the body
        const closeButton = screen.getByTestId('close-button');
        expect(closeButton).toHaveClass('btn');
        expect(closeButton).toHaveClass('btn-secondary');

        // Check if modal footer is rendered
        const footer = screen.getByTestId('modal-footer');
        expect(footer).toHaveClass('modal-footer');

        // Check buttons in the footer
        const secondaryButton = screen.getByTestId('secondary-button');
        expect(secondaryButton).toHaveClass('btn');
        expect(secondaryButton).toHaveClass('btn-secondary');
        expect(secondaryButton).toHaveTextContent('Cancel');

        const primaryButton = screen.getByTestId('primary-button');
        expect(primaryButton).toHaveClass('btn');
        expect(primaryButton).toHaveClass('btn-primary');
        expect(primaryButton).toHaveTextContent('Save changes');
    });

    it('should render modal with different sizes', () => {
        render(ModalBasicTest);

        // Check small size
        const smDialog = screen.getByTestId('sm-dialog');
        expect(smDialog).toHaveClass('modal-sm');

        // Check large size
        const lgDialog = screen.getByTestId('lg-dialog');
        expect(lgDialog).toHaveClass('modal-lg');

        // Check extra large size
        const xlDialog = screen.getByTestId('xl-dialog');
        expect(xlDialog).toHaveClass('modal-xl');
    });

    it('should render with different backdrop options', () => {
        render(ModalBasicTest);

        // Static backdrop option
        const staticBackdrop = screen.getByTestId('static-backdrop');
        expect(staticBackdrop).toHaveClass('modal');

        // No backdrop option
        const noBackdrop = screen.getByTestId('no-backdrop');
        expect(noBackdrop).toHaveClass('modal');
    });

    it('should render dialog with different display options', () => {
        render(ModalBasicTest);

        // Check centered dialog
        const centeredDialog = screen.getByTestId('centered-dialog');
        expect(centeredDialog).toHaveClass('modal-dialog-centered');

        // Check scrollable dialog
        const scrollableDialog = screen.getByTestId('scrollable-dialog');
        expect(scrollableDialog).toHaveClass('modal-dialog-scrollable');
    });

    it('should render fullscreen modals', () => {
        render(ModalBasicTest);

        // Check always fullscreen option
        const fullscreenDialog = screen.getByTestId('fullscreen-dialog');
        expect(fullscreenDialog).toHaveClass('modal-fullscreen');

        // Check responsive fullscreen
        const fullscreenSmDialog = screen.getByTestId('fullscreen-sm-dialog');
        expect(fullscreenSmDialog).toHaveClass('modal-fullscreen-sm-down');
    });

    it('should render header with dismissible button when isDismissible is true', () => {
        render(ModalBasicTest);

        const header = screen.getByTestId('modal-header');
        const closeButton = header.querySelector('.btn-close');
        expect(closeButton).not.toBeNull();
        expect(closeButton).toHaveAttribute('aria-label', 'Close');
    });

    it('should create modal with different props directly', () => {
        // Test with explicit props by directly rendering Modal components
        const { container: dialogContainer } = render(Modal.Dialog, { props: { size: 'lg' } });
        expect(dialogContainer.querySelector('.modal-lg')).not.toBeNull();

        const { container: staticContainer } = render(Modal.Root, { props: { isShown: true, useBackdrop: 'static' } });
        expect(staticContainer.querySelector('.modal')).not.toBeNull();

        const { container: noFadeContainer } = render(Modal.Root, { props: { isShown: true, useFade: false } });
        expect(noFadeContainer.querySelector('.fade')).toBeNull();
    });

    it('should apply custom classes to Modal components', () => {
        const { container } = render(Modal.Root, {
            props: {
                class: 'custom-modal-class',
                isShown: true
            }
        });

        const modal = container.querySelector('.modal');
        expect(modal).not.toBeNull();
        expect(modal).toHaveClass('custom-modal-class');
    });

    it('should render title with custom heading level', () => {
        const { container: h1Container } = render(Modal.Title, {
            props: {
                level: 1,
                children: createRawSnippet(() => ({
                    render: () => 'H1 Title'
                }))
            }
        });

        const h1Title = h1Container.querySelector('h1');
        expect(h1Title).not.toBeNull();
        expect(h1Title).toHaveClass('modal-title');
        expect(h1Title).toHaveTextContent('H1 Title');

        const { container: h3Container } = render(Modal.Title, {
            props: {
                level: 3,
                children: createRawSnippet(() => ({
                    render: () => 'H3 Title'
                }))
            }
        });

        const h3Title = h3Container.querySelector('h3');
        expect(h3Title).not.toBeNull();
        expect(h3Title).toHaveClass('modal-title');
        expect(h3Title).toHaveTextContent('H3 Title');
    });

    it('should have appropriate ARIA attributes when visible', () => {
        const { container } = render(Modal.Root, {
            props: {
                isShown: true
            }
        });

        const modal = container.querySelector('.modal');
        expect(modal).toHaveAttribute('aria-modal', 'true');
        expect(modal).toHaveAttribute('role', 'dialog');
    });

    it('should label the dialog from Modal.Title and manage focus', async () => {
        render(ModalAccessibilityTest);

        const opener = screen.getByTestId('modal-opener');
        opener.focus();
        await fireEvent.click(opener);

        const modal = await screen.findByRole('dialog', { name: 'Accessible modal' });
        const titleId = modal.getAttribute('aria-labelledby');
        expect(titleId).toBeTruthy();
        expect(document.getElementById(titleId as string)).toHaveTextContent('Accessible modal');

        await waitFor(() => expect(screen.getByLabelText('Close')).toHaveFocus());

        await fireEvent.keyDown(window, { key: 'Escape' });
        await waitFor(() => expect(opener).toHaveFocus());
    });

    it('should update the dialog label when the title id changes', async () => {
        render(ModalDynamicTitleIdTest);

        const modal = screen.getByRole('dialog', { name: 'Dynamic modal title' });
        expect(modal).toHaveAttribute('aria-labelledby', 'initial-modal-title');

        await fireEvent.click(screen.getByTestId('change-title-id'));

        await waitFor(() => {
            expect(screen.getByText('Dynamic modal title')).toHaveAttribute('id', 'updated-modal-title');
            expect(modal).toHaveAttribute('aria-labelledby', 'updated-modal-title');
        });
    });

    describe('stacked modals', () => {
        it('does not restore focus from a lower modal while a higher modal remains shown', async () => {
            render(ModalStackedTest);

            await fireEvent.click(screen.getByTestId('open-a'));
            await fireEvent.click(screen.getByTestId('open-b'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-b')).toBeInTheDocument());

            const bLast = screen.getByTestId('b-last');
            bLast.focus();
            await fireEvent.click(screen.getByTestId('close-a'));

            await waitFor(() => expect(screen.queryByTestId('stacked-modal-a')).not.toBeInTheDocument());
            expect(bLast).toHaveFocus();
        });

        it('returns focus and Tab trapping to A after B closes or unmounts', async () => {
            render(ModalStackedTest);

            await fireEvent.click(screen.getByTestId('open-a'));
            screen.getByTestId('open-b').focus();
            await fireEvent.click(screen.getByTestId('open-b'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-b')).toBeInTheDocument());

            await fireEvent.click(screen.getByTestId('close-b'));
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-b')).not.toBeInTheDocument());

            const aFirst = screen.getByTestId('a-first');
            await waitFor(() => expect(aFirst).toHaveFocus());
            screen.getByTestId('open-b-inside-a').focus();
            await fireEvent.keyDown(window, { key: 'Tab' });
            expect(aFirst).toHaveFocus();

            await fireEvent.click(screen.getByTestId('close-a'));
            await fireEvent.click(screen.getByTestId('open-a'));
            await fireEvent.click(screen.getByTestId('open-b'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-b')).toBeInTheDocument());
            await fireEvent.click(screen.getByTestId('unmount-b'));

            await waitFor(() => expect(screen.queryByTestId('stacked-modal-b')).not.toBeInTheDocument());
            await waitFor(() => expect(screen.getByTestId('a-first')).toHaveFocus());
        });

        it("restores B's opener inside A without overriding it with A's first focusable element", async () => {
            render(ModalStackedTest);

            await fireEvent.click(screen.getByTestId('open-a'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-a')).toBeInTheDocument());

            const bOpener = screen.getByTestId('open-b-inside-a');
            bOpener.focus();
            await fireEvent.click(bOpener);
            await waitFor(() => expect(screen.getByTestId('stacked-modal-b')).toBeInTheDocument());

            await fireEvent.click(screen.getByTestId('close-b'));
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-b')).not.toBeInTheDocument());
            expect(bOpener).toHaveFocus();
        });

        it('lets only the top modal handle Escape and Tab, then cleans its stack entry on unmount', async () => {
            render(ModalStackedTest);

            await fireEvent.click(screen.getByTestId('open-a'));
            await fireEvent.click(screen.getByTestId('open-b'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-b')).toBeInTheDocument());

            const bFirst = screen.getByTestId('b-first');
            const bLast = screen.getByTestId('b-last');
            const aLast = screen.getByTestId('a-last');
            aLast.focus();
            await fireEvent.keyDown(window, { key: 'Tab' });
            expect(bFirst).toHaveFocus();

            aLast.focus();
            await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
            expect(bLast).toHaveFocus();

            bLast.focus();
            await fireEvent.keyDown(window, { key: 'Tab' });
            expect(bFirst).toHaveFocus();

            await fireEvent.keyDown(window, { key: 'Escape' });
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-b')).not.toBeInTheDocument());
            expect(screen.getByTestId('stacked-modal-a')).toBeInTheDocument();

            await fireEvent.keyDown(window, { key: 'Escape' });
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-a')).not.toBeInTheDocument());

            await fireEvent.click(screen.getByTestId('close-a'));
            await fireEvent.click(screen.getByTestId('close-b'));
            await fireEvent.click(screen.getByTestId('open-a'));
            await fireEvent.click(screen.getByTestId('open-b'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-b')).toBeInTheDocument());
            await fireEvent.click(screen.getByTestId('unmount-b'));
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-b')).not.toBeInTheDocument());

            await fireEvent.keyDown(window, { key: 'Escape' });
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-a')).not.toBeInTheDocument());
        });

        it('layers a reopened earlier DOM sibling above the modal that was previously on top', async () => {
            render(ModalStackedTest);

            await fireEvent.click(screen.getByTestId('open-a'));
            await fireEvent.click(screen.getByTestId('open-b'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-b')).toBeInTheDocument());

            await fireEvent.click(screen.getByTestId('close-a'));
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-a')).not.toBeInTheDocument());
            await fireEvent.click(screen.getByTestId('open-a'));

            const modalA = await screen.findByTestId('stacked-modal-a');
            const modalB = screen.getByTestId('stacked-modal-b');
            await waitFor(() => expect(Number(modalA.style.zIndex)).toBeGreaterThan(Number(modalB.style.zIndex)));

            const backdropLayers = Array.from(document.querySelectorAll<HTMLElement>('.modal-backdrop'), (backdrop) => Number(backdrop.style.zIndex));
            expect(Math.max(...backdropLayers)).toBeGreaterThan(Number(modalB.style.zIndex));
            expect(Math.max(...backdropLayers)).toBeLessThan(Number(modalA.style.zIndex));

            await fireEvent.keyDown(window, { key: 'Escape' });
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-a')).not.toBeInTheDocument());
            expect(modalB).toBeInTheDocument();
        });

        it('should restore body scroll only after both modals are closed, closing B before A', async () => {
            render(ModalStackedTest);

            await fireEvent.click(screen.getByTestId('open-a'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-a')).toBeInTheDocument());
            expect(document.body.style.overflow).toBe('hidden');

            await fireEvent.click(screen.getByTestId('open-b'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-b')).toBeInTheDocument());
            expect(document.body.style.overflow).toBe('hidden');

            await fireEvent.click(screen.getByTestId('close-b'));
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-b')).not.toBeInTheDocument());

            // A is still open, so scrolling must remain locked (the regression case).
            expect(document.body.style.overflow).toBe('hidden');
            expect(document.body.hasAttribute('data-scrollbar-lock-count')).toBe(true);

            await fireEvent.click(screen.getByTestId('close-a'));
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-a')).not.toBeInTheDocument());

            expect(document.body.style.overflow).toBe('');
            expect(document.body.hasAttribute('data-scrollbar-lock-count')).toBe(false);
        });

        it('should restore body scroll only after both modals are closed, closing A before B', async () => {
            render(ModalStackedTest);

            await fireEvent.click(screen.getByTestId('open-a'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-a')).toBeInTheDocument());

            await fireEvent.click(screen.getByTestId('open-b'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-b')).toBeInTheDocument());

            expect(document.body.style.overflow).toBe('hidden');

            await fireEvent.click(screen.getByTestId('close-a'));
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-a')).not.toBeInTheDocument());

            // B is still open, so scrolling must remain locked regardless of close order.
            expect(document.body.style.overflow).toBe('hidden');
            expect(document.body.hasAttribute('data-scrollbar-lock-count')).toBe(true);

            await fireEvent.click(screen.getByTestId('close-b'));
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-b')).not.toBeInTheDocument());

            expect(document.body.style.overflow).toBe('');
            expect(document.body.hasAttribute('data-scrollbar-lock-count')).toBe(false);
        });
    });

    describe('mixed overlay ownership', () => {
        it('preserves a closing offcanvas layer until its outro completes', async () => {
            render(ModalOffcanvasStackTest);

            await fireEvent.click(screen.getByTestId('open-mixed-modal'));
            await fireEvent.click(screen.getByTestId('open-mixed-offcanvas'));
            const offcanvas = await screen.findByTestId('mixed-offcanvas');
            const modal = screen.getByTestId('mixed-modal');
            const closingLayer = offcanvas.style.zIndex;

            await fireEvent.click(screen.getByTestId('close-mixed-offcanvas'));
            await tick();

            expect(offcanvas).toBeInTheDocument();
            expect(offcanvas.style.zIndex).toBe(closingLayer);
            expect(Number(closingLayer)).toBeGreaterThan(Number(modal.style.zIndex));
            await waitFor(() => expect(screen.queryByTestId('mixed-offcanvas')).not.toBeInTheDocument());
        });

        it('preserves a closing modal layer until its outro completes', async () => {
            render(ModalOffcanvasStackTest);

            await fireEvent.click(screen.getByTestId('open-mixed-offcanvas'));
            await fireEvent.click(screen.getByTestId('open-mixed-modal'));
            const modal = await screen.findByTestId('mixed-modal');
            const offcanvas = screen.getByTestId('mixed-offcanvas');
            const closingLayer = modal.style.zIndex;

            await fireEvent.click(screen.getByTestId('close-mixed-modal'));
            await tick();

            expect(modal).toBeInTheDocument();
            expect(modal.style.zIndex).toBe(closingLayer);
            expect(Number(closingLayer)).toBeGreaterThan(Number(offcanvas.style.zIndex));
            await waitFor(() => expect(screen.queryByTestId('mixed-modal')).not.toBeInTheDocument());
        });

        it('closes only an offcanvas opened above a modal on one Escape', async () => {
            render(ModalOffcanvasStackTest);

            await fireEvent.click(screen.getByTestId('open-mixed-modal'));
            await waitFor(() => expect(screen.getByTestId('mixed-modal')).toBeInTheDocument());
            await fireEvent.click(screen.getByTestId('open-mixed-offcanvas'));
            const offcanvas = await screen.findByTestId('mixed-offcanvas');
            const modal = screen.getByTestId('mixed-modal');
            const offcanvasLayer = Number(offcanvas.style.zIndex);
            const modalLayer = Number(modal.style.zIndex);

            await fireEvent.keyDown(window, { key: 'Escape' });

            await waitFor(() => expect(screen.queryByTestId('mixed-offcanvas')).not.toBeInTheDocument());
            expect(modal).toBeInTheDocument();
            expect(offcanvasLayer).toBeGreaterThan(modalLayer);
        });

        it('closes only a modal opened above an offcanvas on one Escape', async () => {
            render(ModalOffcanvasStackTest);

            await fireEvent.click(screen.getByTestId('open-mixed-offcanvas'));
            await waitFor(() => expect(screen.getByTestId('mixed-offcanvas')).toBeInTheDocument());
            await fireEvent.click(screen.getByTestId('open-mixed-modal'));
            const modal = await screen.findByTestId('mixed-modal');
            const offcanvas = screen.getByTestId('mixed-offcanvas');
            const modalLayer = Number(modal.style.zIndex);
            const offcanvasLayer = Number(offcanvas.style.zIndex);

            await fireEvent.keyDown(window, { key: 'Escape' });

            await waitFor(() => expect(screen.queryByTestId('mixed-modal')).not.toBeInTheDocument());
            expect(offcanvas).toBeInTheDocument();
            expect(modalLayer).toBeGreaterThan(offcanvasLayer);
        });

        it('removes modal-open when the last modal closes before an offcanvas', async () => {
            render(ModalOffcanvasStackTest);
            await fireEvent.click(screen.getByTestId('open-mixed-overlays'));
            await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '2'));
            expect(document.body).toHaveClass('modal-open');

            await fireEvent.click(screen.getByTestId('close-mixed-modal'));
            await waitFor(() => expect(screen.queryByTestId('mixed-modal')).not.toBeInTheDocument());

            expect(document.body).not.toHaveClass('modal-open');
            expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');
            expect(document.body.style.overflow).toBe('hidden');

            await fireEvent.click(screen.getByTestId('close-mixed-offcanvas'));
            await waitFor(() => expect(screen.queryByTestId('mixed-offcanvas')).not.toBeInTheDocument());
            expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
            expect(document.body.style.overflow).toBe('');
        });

        it('keeps modal-open when an offcanvas closes before the remaining modal', async () => {
            render(ModalOffcanvasStackTest);
            await fireEvent.click(screen.getByTestId('open-mixed-overlays'));
            await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '2'));

            await fireEvent.click(screen.getByTestId('close-mixed-offcanvas'));
            await waitFor(() => expect(screen.queryByTestId('mixed-offcanvas')).not.toBeInTheDocument());

            expect(document.body).toHaveClass('modal-open');
            expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');
            expect(document.body.style.overflow).toBe('hidden');

            await fireEvent.click(screen.getByTestId('close-mixed-modal'));
            await waitFor(() => expect(screen.queryByTestId('mixed-modal')).not.toBeInTheDocument());
            expect(document.body).not.toHaveClass('modal-open');
            expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
            expect(document.body.style.overflow).toBe('');
        });
    });

    describe('Modal lifecycle callbacks', () => {
        it("restores a standalone modal's external opener when it unmounts", async () => {
            render(ModalStaticBackdropTest);

            const opener = screen.getByTestId('open-static-modal');
            opener.focus();
            await fireEvent.click(opener);
            await waitFor(() => expect(screen.getByTestId('static-modal')).toBeInTheDocument());

            await fireEvent.click(screen.getByTestId('unmount-static-modal'));
            await waitFor(() => expect(screen.queryByTestId('static-modal')).not.toBeInTheDocument());
            expect(opener).toHaveFocus();
        });

        it('clears repeated static-backdrop timers when the modal unmounts', async () => {
            vi.useFakeTimers();

            try {
                render(ModalStaticBackdropTest);
                await fireEvent.click(screen.getByTestId('open-static-modal'));
                await tick();
                const pendingTimersBeforeBackdrop = vi.getTimerCount();

                const modal = screen.getByTestId('static-modal');
                await fireEvent.mouseDown(modal);
                await fireEvent.mouseDown(modal);
                expect(vi.getTimerCount()).toBe(pendingTimersBeforeBackdrop + 1);

                await fireEvent.click(screen.getByTestId('unmount-static-modal'));
                expect(vi.getTimerCount()).toBe(pendingTimersBeforeBackdrop);
            } finally {
                vi.runOnlyPendingTimers();
                vi.useRealTimers();
            }
        });

        it('notifies onHidePrevented when Escape cannot dismiss the modal', async () => {
            const onHidePrevented = vi.fn();
            render(Modal.Root, {
                props: { isShown: true, isKeyboardDismissible: false, onHidePrevented, useBackdrop: 'static', useFade: false }
            });

            await fireEvent.keyDown(window, { key: 'Escape' });

            expect(onHidePrevented).toHaveBeenCalledTimes(1);
            expect(screen.getByRole('dialog')).toHaveClass('modal-static');
        });

        it('should call onShow before onShown, exactly once each, when opening', async () => {
            const onShow = vi.fn();
            const onShown = vi.fn();
            const onHide = vi.fn();
            const onHidden = vi.fn();

            render(ModalLifecycleTest, { props: { onShow, onShown, onHide, onHidden } });

            await fireEvent.click(screen.getByTestId('lifecycle-open'));

            await waitFor(() => {
                expect(onShow).toHaveBeenCalledTimes(1);
                expect(onShown).toHaveBeenCalledTimes(1);
            });

            expect(onHide).not.toHaveBeenCalled();
            expect(onHidden).not.toHaveBeenCalled();
            expect(onShow.mock.invocationCallOrder[0]!).toBeLessThan(onShown.mock.invocationCallOrder[0]!);
        });

        it('should call onHide before onHidden, exactly once each, when closing', async () => {
            const onShow = vi.fn();
            const onShown = vi.fn();
            const onHide = vi.fn();
            const onHidden = vi.fn();

            render(ModalLifecycleTest, { props: { onShow, onShown, onHide, onHidden } });

            await fireEvent.click(screen.getByTestId('lifecycle-open'));
            await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));

            await fireEvent.click(screen.getByTestId('lifecycle-close'));

            await waitFor(() => {
                expect(onHide).toHaveBeenCalledTimes(1);
                expect(onHidden).toHaveBeenCalledTimes(1);
            });

            expect(onHide.mock.invocationCallOrder[0]!).toBeLessThan(onHidden.mock.invocationCallOrder[0]!);
        });

        it('should not throw when closed before its show transition finishes, and should settle hidden', async () => {
            const onShow = vi.fn();
            const onHidden = vi.fn();

            render(ModalLifecycleTest, { props: { onShow, onHidden } });

            await fireEvent.click(screen.getByTestId('lifecycle-open'));
            await waitFor(() => expect(onShow).toHaveBeenCalledTimes(1));

            // Close immediately, without waiting for the intro transition (300ms) to finish.
            expect(() => fireEvent.click(screen.getByTestId('lifecycle-close'))).not.toThrow();

            await waitFor(() => expect(onHidden).toHaveBeenCalledTimes(1));
            expect(screen.queryByTestId('lifecycle-modal')).not.toBeInTheDocument();
        });

        it('should not leak the body scroll lock when reopened during its own outro transition', async () => {
            const onShown = vi.fn();
            const onHidden = vi.fn();

            render(ModalLifecycleTest, { props: { onShown, onHidden } });

            await fireEvent.click(screen.getByTestId('lifecycle-open'));
            await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
            expect(document.body.style.overflow).toBe('hidden');

            // Start closing, but reopen before the outro transition (and its
            // outroend event) has a chance to complete. This re-fires
            // introstart without an intervening outroend, which previously
            // acquired a second, unmatched scroll lock.
            await fireEvent.click(screen.getByTestId('lifecycle-close'));
            await fireEvent.click(screen.getByTestId('lifecycle-open'));

            await waitFor(() => expect(onShown).toHaveBeenCalledTimes(2));
            expect(document.body.getAttribute('data-scrollbar-lock-count')).toBe('1');

            await fireEvent.click(screen.getByTestId('lifecycle-close'));
            await waitFor(() => expect(onHidden).toHaveBeenCalledTimes(1));

            expect(document.body.style.overflow).toBe('');
            expect(document.body.hasAttribute('data-scrollbar-lock-count')).toBe(false);
        });
    });

    describe('Modal focus management', () => {
        it('should move focus into the modal when it opens', async () => {
            render(ModalAccessibilityTest);

            const opener = screen.getByTestId('modal-opener');
            opener.focus();
            await fireEvent.click(opener);

            const modal = await screen.findByRole('dialog', { name: 'Accessible modal' });

            await waitFor(() => expect(modal.contains(document.activeElement)).toBe(true));
            expect(document.activeElement).not.toBe(opener);
            expect(document.activeElement).toBe(screen.getByLabelText('Close'));
        });

        it('should wrap focus from the last to the first focusable element when tabbing forward', async () => {
            const user = userEvent.setup();
            render(ModalAccessibilityTest);

            await fireEvent.click(screen.getByTestId('modal-opener'));
            await screen.findByRole('dialog', { name: 'Accessible modal' });

            const closeButton = screen.getByLabelText('Close');
            const actionButton = screen.getByTestId('modal-action');

            await waitFor(() => expect(closeButton).toHaveFocus());

            actionButton.focus();
            expect(actionButton).toHaveFocus();

            await user.tab();

            expect(document.activeElement).toBe(closeButton);
        });

        it('should wrap focus from the first to the last focusable element when tabbing backward', async () => {
            const user = userEvent.setup();
            render(ModalAccessibilityTest);

            await fireEvent.click(screen.getByTestId('modal-opener'));
            await screen.findByRole('dialog', { name: 'Accessible modal' });

            const closeButton = screen.getByLabelText('Close');
            const actionButton = screen.getByTestId('modal-action');

            await waitFor(() => expect(closeButton).toHaveFocus());

            await user.tab({ shift: true });

            expect(document.activeElement).toBe(actionButton);
        });

        it('should restore focus to the trigger element after the modal is closed', async () => {
            render(ModalAccessibilityTest);

            const opener = screen.getByTestId('modal-opener');
            opener.focus();
            await fireEvent.click(opener);

            await screen.findByRole('dialog', { name: 'Accessible modal' });
            await waitFor(() => expect(screen.getByLabelText('Close')).toHaveFocus());

            await fireEvent.click(screen.getByTestId('modal-action'));

            await waitFor(() => expect(opener).toHaveFocus());
            expect(screen.queryByRole('dialog', { name: 'Accessible modal' })).not.toBeInTheDocument();
        });
    });
});

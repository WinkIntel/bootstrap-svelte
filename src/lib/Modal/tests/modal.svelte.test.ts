import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import { Modal } from '../index.js';
import ModalAccessibilityTest from './modal-accessibility-test.svelte';
import ModalBasicTest from './modal-basic-test.svelte';
import ModalStackedTest from './modal-stacked-test.svelte';

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

    describe('stacked modals', () => {
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

        it('should keep overflow hidden while the first modal remains open after the second closes', async () => {
            render(ModalStackedTest);

            await fireEvent.click(screen.getByTestId('open-a'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-a')).toBeInTheDocument());

            await fireEvent.click(screen.getByTestId('open-b'));
            await waitFor(() => expect(screen.getByTestId('stacked-modal-b')).toBeInTheDocument());

            await fireEvent.click(screen.getByTestId('close-b'));
            await waitFor(() => expect(screen.queryByTestId('stacked-modal-b')).not.toBeInTheDocument());

            expect(document.body.style.overflow).toBe('hidden');
            expect(screen.getByTestId('stacked-modal-a')).toBeInTheDocument();

            // Clean up so this test doesn't leak a locked body into the next one.
            await fireEvent.click(screen.getByTestId('close-a'));
            await waitFor(() => expect(document.body.style.overflow).toBe(''));
        });
    });
});

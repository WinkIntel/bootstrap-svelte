import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { Toast } from '../index.js';
import ToastBasicTest from './toast-basic-test.svelte';

describe('Toast Component', () => {
    it('should render basic toast with header and body', () => {
        render(ToastBasicTest);

        // Check if toast root component is rendered
        const toast = screen.getByTestId('toast');
        expect(toast).toHaveClass('toast');
        expect(toast).toHaveClass('fade');
        expect(toast).toHaveClass('show');
        expect(toast).toHaveAttribute('id', 'test-toast');
        expect(toast).toHaveAttribute('role', 'alert');
        expect(toast).toHaveAttribute('aria-live', 'assertive');
        expect(toast).toHaveAttribute('aria-atomic', 'true');

        // Check if toast header is rendered
        const header = screen.getByTestId('toast-header');
        expect(header).toHaveClass('toast-header');
        const headerContent = screen.getByTestId('toast-header-content');
        expect(headerContent).toHaveTextContent('Toast Title');

        // Check if toast body is rendered
        const body = screen.getByTestId('toast-body');
        expect(body).toHaveClass('toast-body');
        expect(body).toHaveTextContent('This is a toast message');

        // Check if close button is rendered in header (since isDismissible defaults to true)
        const closeButton = header.querySelector('.btn-close');
        expect(closeButton).not.toBeNull();
    });

    it('should render toast with autohide disabled', () => {
        render(ToastBasicTest);

        const noAutohideToast = screen.getByTestId('no-autohide-toast');
        expect(noAutohideToast).toHaveClass('toast');

        const noAutohideHeader = screen.getByTestId('no-autohide-header');
        expect(noAutohideHeader).toBeInTheDocument();

        const noAutohideBody = screen.getByTestId('no-autohide-body');
        expect(noAutohideBody).toHaveTextContent('This toast will not hide automatically');
    });

    it('should render toast with custom delay', () => {
        render(ToastBasicTest);

        const customDelayToast = screen.getByTestId('custom-delay-toast');
        expect(customDelayToast).toHaveClass('toast');

        const customDelayBody = screen.getByTestId('custom-delay-body');
        expect(customDelayBody).toHaveTextContent('This toast will hide after 2 seconds');
    });

    it('should render toast without fade effect', () => {
        render(ToastBasicTest);

        const noFadeToast = screen.getByTestId('no-fade-toast');
        expect(noFadeToast).toHaveClass('toast');
        expect(noFadeToast).not.toHaveClass('fade');
        expect(noFadeToast).toHaveClass('show');
    });

    it('should render toast header without dismiss button when isDismissible is false', () => {
        render(ToastBasicTest);

        const noDismissHeader = screen.getByTestId('no-dismiss-header');
        expect(noDismissHeader).toHaveClass('toast-header');

        // Should not find a close button in the header
        const closeButton = noDismissHeader.querySelector('.btn-close');
        expect(closeButton).toBeNull();
    });

    it('should render toast inside a container with specified placement', () => {
        render(ToastBasicTest);

        const container = screen.getByTestId('toast-container');
        expect(container).toHaveClass('toast-container');
        expect(container).toHaveClass('position-fixed');
        expect(container).toHaveClass('top-0');
        expect(container).toHaveClass('end-0');

        const containerToast = screen.getByTestId('container-toast');
        expect(containerToast).toHaveClass('toast');
        expect(container).toContainElement(containerToast);

        const containerBody = screen.getByTestId('container-body');
        expect(containerBody).toHaveTextContent('This toast is rendered in a container at top-end');
    });

    // Test for component API existence

    it('should create a Root component with expected properties', () => {
        expect(Toast.Root).toBeDefined();
    });

    it('should create a Header component with expected properties', () => {
        expect(Toast.Header).toBeDefined();
    });

    it('should create a Body component with expected properties', () => {
        expect(Toast.Body).toBeDefined();
    });

    it('should create a Container component with expected properties', () => {
        expect(Toast.Container).toBeDefined();
    });
});

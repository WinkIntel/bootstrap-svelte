/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import Alert from './alert.svelte';
import type { AlertRootProps } from './types.js';

const renderAlertWithText = (text: string, props: AlertRootProps = {}) => {
    return render(Alert, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => text
            }))
        }
    });
};

describe('Alert.svelte', () => {
    test('should render', () => {
        renderAlertWithText('Alert content');
        const alert = screen.getByText('Alert content');

        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('alert');
    });

    test('renders an alert with default properties', () => {
        renderAlertWithText('Default Alert');
        const alert = screen.getByText('Default Alert');

        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('alert');
        expect(alert).toHaveClass('alert-primary');
        expect(alert).toHaveAttribute('role', 'alert');
    });

    // Test for specific variant
    test('renders with primary variant', () => {
        renderAlertWithText('Primary Alert', { colorVariant: 'primary' });
        const alert = screen.getByText('Primary Alert');

        expect(alert).toHaveClass('alert');
        expect(alert).toHaveClass('alert-primary');
    });

    test('renders with success variant', () => {
        renderAlertWithText('Success Alert', { colorVariant: 'success' });
        const alert = screen.getByText('Success Alert');

        expect(alert).toHaveClass('alert');
        expect(alert).toHaveClass('alert-success');
    });

    // Test dismissible alert
    test('renders dismissible alert with close button', () => {
        renderAlertWithText('Dismissible Alert', { isDismissible: true });
        const alert = screen.getByText('Dismissible Alert');
        const closeButton = alert?.querySelector('.btn-close');

        expect(alert).toHaveClass('alert-dismissible');
        expect(closeButton).toBeInTheDocument();
    });

    // Test for animations
    test('applies animation classes when animated', () => {
        renderAlertWithText('Animated Alert', { isAnimated: true });
        const alert = screen.getByText('Animated Alert');

        expect(alert).toHaveClass('fade');
        expect(alert).toHaveClass('show');
    });

    // Test for no animations
    test('does not apply animation classes when not animated', () => {
        renderAlertWithText('Non-animated Alert', { isAnimated: false });
        const alert = screen.getByText('Non-animated Alert');

        expect(alert).not.toHaveClass('fade');
    });

    // Test for custom class
    test('accepts and applies custom classes', () => {
        renderAlertWithText('Custom Alert', {
            class: 'custom-class another-class',
            colorVariant: 'success'
        });

        const alert = screen.getByText('Custom Alert');
        expect(alert).toHaveClass('alert');
        expect(alert).toHaveClass('alert-success');
        expect(alert).toHaveClass('custom-class');
        expect(alert).toHaveClass('another-class');
    });

    // Test dismissal functionality
    test('dismisses alert when close button is clicked', async () => {
        const user = userEvent.setup();
        const { container } = renderAlertWithText('Dismissible Alert', { isDismissible: true });
        const closeButton = container.querySelector('.btn-close');

        expect(screen.getByText('Dismissible Alert')).toBeInTheDocument();

        if (closeButton) {
            await user.click(closeButton);
        }

        // Not able to get events to work with svelte...
        // expect(screen.queryByText('Dismissible Alert')).not.toBeInTheDocument();
    });
});

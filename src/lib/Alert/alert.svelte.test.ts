/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { createRawSnippet } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import Alert from './alert.svelte';
import AlertVariantStateTest from './tests/alert-variant-state-test.svelte';
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
    test('renders an alert with default properties', () => {
        renderAlertWithText('Default Alert');
        const alert = screen.getByText('Default Alert');

        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('alert');
        expect(alert).toHaveClass('alert-primary');
        expect(alert).toHaveAttribute('role', 'alert');
    });

    test('applies explicit color variants and caller classes without the default', () => {
        const { container } = renderAlertWithText('Explicit Alert', { colorVariant: 'success', class: 'text-bg-secondary' });
        const alert = container.querySelector('[role="alert"]');

        expect(alert).toHaveClass('alert-success', 'text-bg-secondary');
        expect(alert).not.toHaveClass('alert-primary');
    });

    test('does not combine the default with an explicit color variant', () => {
        renderAlertWithText('Success Alert', { colorVariant: 'success' });
        const alert = screen.getByText('Success Alert');

        expect(alert).toHaveClass('alert-success');
        expect(alert).not.toHaveClass('alert-primary');
    });

    test.each([
        [undefined, undefined, true],
        [null, null, true],
        ['', '', true],
        ['success', undefined, false],
        [undefined, 'text-bg-secondary', false]
    ])('normalizes colorVariant=%s and class=%s defaults', (colorVariant, classValue, hasDefault) => {
        const { container } = renderAlertWithText('Normalized Alert', {
            colorVariant: colorVariant as never,
            class: classValue as never
        });
        const alert = container.querySelector('[role="alert"]');

        expect(alert).toHaveClass('alert');
        expect(alert?.classList.contains('alert-primary')).toBe(hasDefault);
    });

    test('reapplies the default only after class and color overrides are cleared', async () => {
        const user = userEvent.setup();
        render(AlertVariantStateTest);
        const alert = screen.getByTestId('stateful-alert');

        expect(alert).toHaveClass('alert-primary');
        await user.click(screen.getByTestId('set-alert-class'));
        expect(alert).toHaveClass('text-bg-secondary');
        expect(alert).not.toHaveClass('alert-primary');
        await user.click(screen.getByTestId('set-alert-variant'));
        expect(alert).toHaveClass('alert-success', 'text-bg-secondary');
        await user.click(screen.getByTestId('clear-alert-variant'));
        expect(alert).not.toHaveClass('alert-success', 'alert-primary');
        await user.click(screen.getByTestId('clear-alert-class'));
        expect(alert).toHaveClass('alert-primary');
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
        const onClose = vi.fn();
        const onClosed = vi.fn();
        const { container } = renderAlertWithText('Dismissible Alert', { isAnimated: false, isDismissible: true, onClose, onClosed });
        const closeButton = container.querySelector('.btn-close');

        expect(screen.getByText('Dismissible Alert')).toBeInTheDocument();

        await user.click(closeButton!);

        expect(screen.queryByText('Dismissible Alert')).not.toBeInTheDocument();
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClosed).toHaveBeenCalledTimes(1);
    });
});

describe('Alert color class normalization', () => {
    test.each([
        'mb-3',
        ['mb-3', false],
        { 'mb-3': true, 'alert-warning': false },
        ['mb-3', [null, { 'p-2': true }]],
        'bg-gradient bg-opacity-50',
        'alert-dismissible alert-heading alert-link'
    ])('retains the default with non-color classes %j', (classValue) => {
        renderAlertWithText('Color test', { class: classValue });
        expect(screen.getByText('Color test')).toHaveClass('alert-primary');
    });
    test.each([
        'alert-warning',
        ['alert-warning'],
        { 'alert-warning': true },
        ['mb-3', [{ 'alert-warning': true }]],
        'bg-danger',
        ['text-bg-secondary']
    ])('suppresses the default for explicit color classes %j', (classValue) => {
        renderAlertWithText('Color test', { class: classValue });
        expect(screen.getByText('Color test')).not.toHaveClass('alert-primary');
    });
    test('reacts to layout, color and disabled object-class changes', async () => {
        const { rerender } = renderAlertWithText('Color test', { class: 'mb-3' });
        const element = screen.getByText('Color test');
        expect(element).toHaveClass('alert-primary');
        await rerender({ class: ['alert-warning', 'mb-3'] });
        expect(element).toHaveClass('alert-warning');
        expect(element).not.toHaveClass('alert-primary');
        await rerender({ class: { 'alert-warning': false, 'mb-3': true } });
        expect(element).toHaveClass('alert-primary');
        expect(element).not.toHaveClass('alert-warning');
    });
});

test('retains the default for a custom Alert layout modifier', () => {
    renderAlertWithText('Compact Alert', { class: 'alert-compact mb-3' });
    expect(screen.getByText('Compact Alert')).toHaveClass('alert-primary');
});

describe('Alert explicit color opt-out', () => {
    test.each(['brand-alert', ['brand-alert'], { 'brand-alert': true }, ['mb-3', [{ 'brand-alert': true }]]])(
        'none leaves custom theme classes alone: %j',
        (classValue) => {
            renderAlertWithText('Custom theme', { colorVariant: 'none', class: classValue });
            const element = screen.getByText('Custom theme');
            expect(element).toHaveClass('brand-alert');
            expect(element).not.toHaveClass('alert-primary', 'none', 'alert-none');
        }
    );
    test('restores default for null and empty values after none or explicit colors', async () => {
        const { rerender } = renderAlertWithText('Custom theme', { colorVariant: 'none', class: 'brand-alert' });
        const element = screen.getByText('Custom theme');
        expect(element).not.toHaveClass('alert-primary');
        await rerender({ colorVariant: null as never });
        expect(element).toHaveClass('alert-primary');
        await rerender({ colorVariant: 'warning' });
        expect(element).not.toHaveClass('alert-primary');
        await rerender({ colorVariant: '' as never });
        expect(element).toHaveClass('alert-primary');
    });
    test.each(['bg-brand', 'text-bg-brand', 'alert-brand'])('does not infer arbitrary custom color intent: %s', (classValue) => {
        renderAlertWithText('Custom theme', { class: classValue });
        expect(screen.getByText('Custom theme')).toHaveClass('alert-primary');
    });
});

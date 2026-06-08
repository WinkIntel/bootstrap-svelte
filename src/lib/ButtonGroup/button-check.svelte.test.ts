/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import ButtonCheck from './button-check.svelte';
import type { ButtonCheckRootProps } from './types.js';

const renderButtonCheckWithText = (text: string = 'Toggle', props: ButtonCheckRootProps = {}) => {
    return render(ButtonCheck, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => text
            }))
        }
    });
};

describe('ButtonCheck.svelte', () => {
    test('should render', () => {
        const results = render(ButtonCheck);
        expect(() => results.container.querySelector('input.btn-check')).not.toThrow();
    });

    test('renders with default properties', () => {
        renderButtonCheckWithText();

        const input = screen.getByRole('checkbox');
        const label = screen.getByText('Toggle');

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('btn-check');
        expect(input).toHaveAttribute('type', 'checkbox');
        expect(input).toHaveAttribute('autocomplete', 'off');
        expect(input).toHaveAttribute('id');

        expect(label).toBeInTheDocument();
        expect(label.tagName).toBe('LABEL');
        expect(label).toHaveClass('btn');
        expect(label).toHaveAttribute('for', input.getAttribute('id'));
    });

    test('renders as radio when type is radio', () => {
        renderButtonCheckWithText('Radio Toggle', { type: 'radio', name: 'toggle-options' });

        const input = screen.getByRole('radio');
        expect(input).toHaveAttribute('type', 'radio');
        expect(input).toHaveAttribute('name', 'toggle-options');
    });

    test('applies color variant to label', () => {
        renderButtonCheckWithText('Primary Toggle', { colorVariant: 'primary' });

        const label = screen.getByText('Primary Toggle');
        expect(label).toHaveClass('btn');
        expect(label).toHaveClass('btn-primary');
    });

    test('uses custom id and links label to input', () => {
        renderButtonCheckWithText('Custom Id Toggle', { id: 'custom-toggle-id' });

        const input = screen.getByRole('checkbox');
        const label = screen.getByText('Custom Id Toggle');

        expect(input).toHaveAttribute('id', 'custom-toggle-id');
        expect(label).toHaveAttribute('for', 'custom-toggle-id');
    });

    test('applies custom classes to input and label', () => {
        renderButtonCheckWithText('Custom Classes', {
            class: 'custom-input-class',
            labelClass: 'custom-label-class another-label-class'
        });

        const input = screen.getByRole('checkbox');
        const label = screen.getByText('Custom Classes');

        expect(input).toHaveClass('btn-check');
        expect(input).toHaveClass('custom-input-class');

        expect(label).toHaveClass('btn');
        expect(label).toHaveClass('custom-label-class');
        expect(label).toHaveClass('another-label-class');
    });

    test('supports disabled state', () => {
        renderButtonCheckWithText('Disabled Toggle', { disabled: true });

        const input = screen.getByRole('checkbox');
        expect(input).toBeDisabled();
    });

    test('renders as checked when checked is true', () => {
        renderButtonCheckWithText('Checked Toggle', { checked: true });

        const input = screen.getByRole('checkbox');
        expect(input).toBeChecked();
    });

    test('renders as unchecked when checked is false', () => {
        renderButtonCheckWithText('Unchecked Toggle', { checked: false });

        const input = screen.getByRole('checkbox');
        expect(input).not.toBeChecked();
    });

    test('checkbox group checks when value is included in group', () => {
        renderButtonCheckWithText('Grouped Checkbox', {
            group: ['option-1', 'option-2'],
            value: 'option-2'
        });

        const input = screen.getByRole('checkbox');
        expect(input).toBeChecked();
    });

    test('checkbox group is unchecked when value is not included in group', () => {
        renderButtonCheckWithText('Grouped Checkbox', {
            group: ['option-1'],
            value: 'option-2'
        });

        const input = screen.getByRole('checkbox');
        expect(input).not.toBeChecked();
    });

    test('checkbox group toggles checked state on interaction', () => {
        renderButtonCheckWithText('Grouped Checkbox', {
            group: [],
            value: 'option-1'
        });

        const input = screen.getByRole('checkbox') as HTMLInputElement;
        expect(input).not.toBeChecked();

        input.click();
        expect(input).toBeChecked();

        input.click();
        expect(input).not.toBeChecked();
    });

    test('radio group checks when group equals value', () => {
        renderButtonCheckWithText('Grouped Radio', {
            type: 'radio',
            group: 'option-1',
            value: 'option-1'
        });

        const input = screen.getByRole('radio');
        expect(input).toBeChecked();
    });

    test('radio group is unchecked when group differs from value', () => {
        renderButtonCheckWithText('Grouped Radio', {
            type: 'radio',
            group: 'option-1',
            value: 'option-2'
        });

        const input = screen.getByRole('radio');
        expect(input).not.toBeChecked();
    });
});

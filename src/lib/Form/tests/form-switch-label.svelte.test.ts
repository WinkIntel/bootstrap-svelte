/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import SwitchLabel from '../form-switch-label.svelte';

const renderWithChildren = (content: string = '', props: Record<string, unknown> = {}) => {
    return render(SwitchLabel, {
        props: {
            ...props,
            children: createRawSnippet(() => ({
                render: () => content
            }))
        }
    });
};

describe('Form.SwitchLabel', () => {
    test('renders a label with base class', () => {
        const { container } = render(SwitchLabel);
        const el = container.querySelector('label') as HTMLLabelElement;
        expect(el).toBeInTheDocument();
        expect(el).toHaveClass('form-check-label');
    });

    test('merges custom classes with base class', () => {
        const { container } = render(SwitchLabel, { props: { class: 'custom-class another-class' } });
        const el = container.querySelector('label') as HTMLLabelElement;
        expect(el).toHaveClass('form-check-label');
        expect(el).toHaveClass('custom-class');
        expect(el).toHaveClass('another-class');
    });

    test('renders children content', () => {
        const { container } = renderWithChildren('Switch label text');
        const el = container.querySelector('label') as HTMLLabelElement;
        expect(el).toHaveTextContent('Switch label text');
    });

    test('forwards "for" attribute to label', () => {
        const { container } = render(SwitchLabel, { props: { for: 'switchId' } });
        const el = container.querySelector('label') as HTMLLabelElement;
        expect(el).toHaveAttribute('for', 'switchId');
    });

    test('forwards id and aria-* attributes', () => {
        const { container } = render(SwitchLabel, { props: { id: 'lbl', 'aria-label': 'Switch label' } });
        const el = container.querySelector('label') as HTMLLabelElement;
        expect(el).toHaveAttribute('id', 'lbl');
        expect(el).toHaveAttribute('aria-label', 'Switch label');
    });

    test('forwards data-* and title attributes', () => {
        const { container } = render(SwitchLabel, { props: { 'data-testid': 'switch-label', title: 'Title' } });
        const el = container.querySelector('label') as HTMLLabelElement;
        expect(el).toHaveAttribute('data-testid', 'switch-label');
        expect(el).toHaveAttribute('title', 'Title');
    });

    test('renders with empty children gracefully', () => {
        const { container } = render(SwitchLabel);
        const el = container.querySelector('label') as HTMLLabelElement;
        expect(el).toBeInTheDocument();
        expect(el).toBeEmptyDOMElement();
    });
});

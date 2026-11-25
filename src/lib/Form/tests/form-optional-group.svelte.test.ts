import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Fixture from './form-optional-group-test.svelte';

afterEach(() => vi.restoreAllMocks());

describe.each([
    { component: 'Form.CheckInput', switchInput: false },
    { component: 'Form.SwitchInput', switchInput: true }
])('$component optional group binding', ({ switchInput }) => {
    test.each([
        { initialGroup: undefined, expected: 'undefined' },
        { initialGroup: null, expected: 'null' }
    ])('keeps $expected as a standalone binding through clicks and native reset', async ({ initialGroup, expected }) => {
        const warn = vi.spyOn(console, 'warn');
        const { container } = render(Fixture, { switchInput, initialGroup });
        const input = container.querySelector('input') as HTMLInputElement;
        const form = container.querySelector('form') as HTMLFormElement;
        expect(input).not.toBeChecked();
        expect(screen.getByTestId('group')).toHaveTextContent(expected);

        input.click();
        await tick();
        expect(input).toBeChecked();
        expect(screen.getByTestId('checked')).toHaveTextContent('true');
        expect(screen.getByTestId('group')).toHaveTextContent(expected);

        input.click();
        await tick();
        expect(input).not.toBeChecked();
        expect(screen.getByTestId('checked')).toHaveTextContent('false');
        input.click();
        await tick();

        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        await tick();
        expect(input).not.toBeChecked();
        expect(screen.getByTestId('checked')).toHaveTextContent('false');
        expect(screen.getByTestId('group')).toHaveTextContent(expected);
        expect(warn).not.toHaveBeenCalled();
    });
    test.each([
        { button: 'clear-undefined', expected: 'undefined' },
        { button: 'clear-null', expected: 'null' }
    ])('preserves checked state when an array becomes $expected', async ({ button, expected }) => {
        const warn = vi.spyOn(console, 'warn');
        const { container } = render(Fixture, { switchInput, initialGroup: ['a'] });
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input).toBeChecked();

        await fireEvent.click(screen.getByTestId(button));
        expect(input).toBeChecked();
        expect(screen.getByTestId('checked')).toHaveTextContent('true');
        expect(screen.getByTestId('group')).toHaveTextContent(expected);

        input.click();
        await tick();
        expect(input).not.toBeChecked();
        expect(screen.getByTestId('group')).toHaveTextContent(expected);
        expect(warn).not.toHaveBeenCalled();
    });

    test('keeps undefined sibling bindings standalone until an array is supplied', async () => {
        const warn = vi.spyOn(console, 'warn');
        const { container } = render(Fixture, { switchInput, withSibling: true });
        const inputs = container.querySelectorAll('input');
        inputs.item(0).click();
        inputs.item(1).click();
        await tick();
        expect(inputs.item(0)).toBeChecked();
        expect(inputs.item(1)).toBeChecked();
        expect(screen.getByTestId('group')).toHaveTextContent('undefined');

        await fireEvent.click(screen.getByTestId('start-group'));
        expect(inputs.item(0)).not.toBeChecked();
        expect(inputs.item(1)).not.toBeChecked();
        inputs.item(0).click();
        inputs.item(1).click();
        await tick();
        expect(screen.getByTestId('group')).toHaveTextContent('["a","b"]');
        expect(warn).not.toHaveBeenCalled();
    });

    test('preserves array membership through native reset', async () => {
        const { container } = render(Fixture, { switchInput, initialGroup: [] });
        const input = container.querySelector('input') as HTMLInputElement;
        input.click();
        await tick();
        expect(input).toBeChecked();
        expect(screen.getByTestId('group')).toHaveTextContent('["a"]');
        (container.querySelector('form') as HTMLFormElement).reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        await tick();
        expect(input).not.toBeChecked();
        expect(screen.getByTestId('checked')).toHaveTextContent('false');
        expect(screen.getByTestId('group')).toHaveTextContent('[]');
    });
});

import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, test } from 'vitest';
import ObjectOwnership from './tests/button-check-object-ownership-test.svelte';

const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await tick();
};

describe('ButtonCheck checked-owned object values', () => {
    test('retains the raw object selection after the parent proxies its checked seed', () => {
        const { container } = render(ObjectOwnership);
        expect(container.querySelector('input')?.checked).toBe(true);
        expect(container.querySelector('output')).toHaveTextContent('{"id":"a"}:true:0');
    });
    test('migrates a checked-owned raw object value without a change callback', async () => {
        const { container } = render(ObjectOwnership);
        await fireEvent.click(screen.getByText('Change value'));
        expect(container.querySelector('input')?.checked).toBe(true);
        expect(container.querySelector('output')).toHaveTextContent('{"id":"c"}:true:0');
        expect(new FormData(container.querySelector('form')!).get('choices')).toBe('[object Object]');
    });
    test('preserves distinct object identity and later native raw/proxy selection', async () => {
        const { container } = render(ObjectOwnership);
        await fireEvent.click(screen.getByText('Distinct object'));
        expect(container.querySelector('input')?.checked).toBe(false);
        expect(container.querySelector('output')).toHaveTextContent('{"id":"a"}:false:0');
        await fireEvent.click(screen.getByText('Original object'));
        expect(container.querySelector('input')?.checked).toBe(true);
        expect(container.querySelector('output')).toHaveTextContent('{"id":"a"}:true:0');
        await fireEvent.click(screen.getByText('Uncheck A'));
        expect(container.querySelector('input')?.checked).toBe(false);
        expect(container.querySelector('output')).toHaveTextContent('undefined:false:0');
        expect(new FormData(container.querySelector('form')!).get('choices')).toBe(null);
    });
    test('retains simultaneous parent object selection authority', async () => {
        const { container } = render(ObjectOwnership);
        await fireEvent.click(screen.getByText('Parent B and value'));
        const [a, b] = Array.from(container.querySelectorAll('input'));
        expect(a?.checked).toBe(false);
        expect(b?.checked).toBe(true);
        expect(container.querySelector('output')).toHaveTextContent('{"id":"b"}:false:0');
    });
    test('tracks native sibling changes and explicit null clearing with object values', async () => {
        const { container } = render(ObjectOwnership);
        const [a, b] = Array.from(container.querySelectorAll('input'));
        await fireEvent.click(b!);
        expect(a?.checked).toBe(false);
        expect(b?.checked).toBe(true);
        expect(container.querySelector('output')).toHaveTextContent('{"id":"b"}:false:1');
        await fireEvent.click(screen.getByText('Clear group'));
        expect(a?.checked).toBe(false);
        expect(b?.checked).toBe(false);
        expect(container.querySelector('output')).toHaveTextContent('null:false:1');
    });
});

describe.each(['Clear public ref', 'Replace public ref'])('ButtonCheck mounted radio identity (%s)', (action) => {
    test('keeps native selection and reset synchronization when a consumer changes elementRef', async () => {
        const { container } = render(ObjectOwnership);
        await fireEvent.click(screen.getByText(action));
        await fireEvent.click(screen.getByText('Parent B'));
        const [a, b] = Array.from(container.querySelectorAll('input'));
        expect(a?.checked).toBe(false);
        expect(b?.checked).toBe(true);
        expect(container.querySelector('output')).toHaveTextContent('{"id":"b"}:false:0');
        container.querySelector('form')!.reset();
        await settle();
        expect(a?.checked).toBe(true);
        expect(b?.checked).toBe(false);
        expect(container.querySelector('output')).toHaveTextContent('{"id":"a"}:true:0');
        expect(new FormData(container.querySelector('form')!).get('choices')).toBe('[object Object]');
    });
});

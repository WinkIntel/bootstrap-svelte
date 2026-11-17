import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, test } from 'vitest';
import Fixture from './tests/button-check-review-test.svelte';
import NativeBinding from './tests/button-check-native-binding-test.svelte';
import ObjectOwnership from './tests/button-check-object-ownership-test.svelte';
import Group from './tests/button-check-ssr-group-test.svelte';

const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await tick();
};

describe('ButtonCheck review regressions', () => {
    test('retains explicit null as an empty controlled group, including parent clearing', async () => {
        const { container } = render(Fixture, { initialGroup: null, initialChecked: true });
        const [a, b] = Array.from(container.querySelectorAll('input'));
        expect(a?.checked).toBe(false);
        expect(b?.checked).toBe(false);
        expect(container.querySelector('output')).toHaveTextContent('null:true:0');
        await fireEvent.click(b!);
        await fireEvent.click(screen.getByText('Clear group'));
        expect(a?.checked).toBe(false);
        expect(b?.checked).toBe(false);
        expect(container.querySelector('output')).toHaveTextContent('null:true:1');
    });
    test('restores a standalone initially checked radio on native form reset', async () => {
        const { container } = render(Fixture);
        const [a, b] = Array.from(container.querySelectorAll('input'));
        await fireEvent.click(b!);
        expect(a?.checked).toBe(false);
        container.querySelector('form')!.reset();
        await settle();
        expect(a?.checked).toBe(true);
        expect(b?.checked).toBe(false);
        expect(container.querySelector('output')).toHaveTextContent('"a":true:1');
        expect(new FormData(container.querySelector('form')!).get('choices')).toBe('a');
    });
    test.each([
        { initialChecked: true, secondChecked: false, defaultA: undefined, defaultB: undefined, selected: 'a' },
        { initialChecked: false, secondChecked: true, defaultA: undefined, defaultB: undefined, selected: 'b' },
        { initialChecked: true, secondChecked: true, defaultA: undefined, defaultB: undefined, selected: 'b' },
        { initialChecked: true, secondChecked: false, defaultA: false, defaultB: true, selected: 'b' }
    ])('restores shared initially undefined group with two checked bindings to $selected', async ({ selected, ...props }) => {
        const { container } = render(Fixture, props);
        container.querySelector('form')!.reset();
        await settle();
        const [a, b] = Array.from(container.querySelectorAll('input'));
        expect(a?.checked).toBe(selected === 'a');
        expect(b?.checked).toBe(selected === 'b');
        expect(container.querySelector('output')).toHaveTextContent(`"${selected}":${selected === 'a'}:0`);
        expect(screen.getByTestId('second-checked')).toHaveTextContent(String(selected === 'b'));
    });
    test('keeps an initially checked owned selection consistent when its value changes', async () => {
        const { container } = render(Fixture);
        await fireEvent.click(screen.getByText('Change value'));
        expect(container.querySelector('input')?.checked).toBe(true);
        expect(container.querySelector('output')).toHaveTextContent('"c":true:0');
        expect(new FormData(container.querySelector('form')!).get('choices')).toBe('c');
    });
    test('never migrates an explicit established group when an option value changes', async () => {
        const { container } = render(Fixture, { initialGroup: 'a' });
        await fireEvent.click(screen.getByText('Change value'));
        expect(container.querySelector('input')?.checked).toBe(false);
        expect(container.querySelector('output')).toHaveTextContent('"a":true:0');
    });
    test('a simultaneous parent group assignment wins over an owned value change', async () => {
        const { container } = render(Fixture);
        await fireEvent.click(screen.getByText('Parent B and value'));
        const [a, b] = Array.from(container.querySelectorAll('input'));
        expect(a?.checked).toBe(false);
        expect(b?.checked).toBe(true);
        expect(container.querySelector('output')).toHaveTextContent('"b":false:0');
    });
    test('follows a parent selection when the option later takes that value', async () => {
        const { container } = render(Fixture);
        await fireEvent.click(screen.getByText('Parent B'));
        await fireEvent.click(screen.getByText('Value B'));
        expect(container.querySelector('input')?.checked).toBe(true);
        expect(container.querySelector('output')).toHaveTextContent('"b":true:0');
    });
    test('standalone checked binding requires a shared group to track sibling deselection', async () => {
        const { container } = render(NativeBinding);
        const [a, b] = Array.from(container.querySelectorAll('input'));
        await fireEvent.click(b!);
        expect(a?.checked).toBe(false);
        expect(container.querySelector('output')).toHaveTextContent('true');
        await fireEvent.click(screen.getByText('Reselect A'));
        expect(a?.checked).toBe(false);
    });
});

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
    });
});

test('preserves an explicit native radio default while an established group selects its sibling', () => {
    const { container } = render(Group, { group: 'b', defaultChecked: true });
    const [a, b] = Array.from(container.querySelectorAll('input'));
    expect(a?.defaultChecked).toBe(true);
    expect(a?.checked).toBe(false);
    expect(b?.checked).toBe(true);
    expect(new FormData(container.querySelector('form')!).get('choices')).toBe('b');
});

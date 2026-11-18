import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import Group from './tests/button-check-ssr-group-test.svelte';
import NativeDefaults from './tests/button-check-native-defaults-test.svelte';
import { describe, expect, test } from 'vitest';
import ButtonCheck from './button-check.svelte';

describe('ButtonCheck radio SSR', () => {
    test.each([undefined, 'a'])('serializes standalone checked with value %s', (value) => {
        expect(render(ButtonCheck, { props: { type: 'radio', checked: true, value } }).body).toContain(' checked');
    });
    test('does not serialize checked for an unselected radio without value', () => {
        expect(render(ButtonCheck, { props: { type: 'radio' } }).body).not.toContain(' checked');
    });
});

describe('ButtonCheck grouped radio SSR authority', () => {
    test.each([
        { group: 'a', checked: undefined, defaultChecked: undefined, selected: 'a' },
        { group: 'b', checked: undefined, defaultChecked: undefined, selected: 'b' },
        { group: 'a', checked: false, defaultChecked: undefined, selected: 'a' },
        { group: 'b', checked: true, defaultChecked: undefined, selected: 'b' },
        { group: null, checked: true, defaultChecked: undefined, selected: null },
        { group: undefined, checked: true, defaultChecked: undefined, selected: 'a' },
        { group: undefined, checked: false, defaultChecked: undefined, selected: null },
        { group: undefined, checked: undefined, defaultChecked: undefined, selected: null },
        { group: 'a', checked: false, defaultChecked: false, selected: 'a' }
    ])('SSR group=$group checked=$checked default=$defaultChecked selects $selected', ({ selected, ...props }) => {
        const dom = new JSDOM(render(Group, { props }).body);
        try {
            const form = dom.window.document.querySelector('form')!;
            const [a, b] = Array.from(form.querySelectorAll('input'));
            expect(a?.hasAttribute('checked')).toBe(selected === 'a');
            expect(b?.hasAttribute('checked')).toBe(selected === 'b');
            const NativeFormData = form.ownerDocument.defaultView!.FormData;
            expect(new NativeFormData(form).get('choices')).toBe(selected);
        } finally {
            dom.window.close();
        }
    });
    test('matches native default attributes while the grouped B selection is submitted', () => {
        const dom = new JSDOM(render(Group, { props: { group: 'b', defaultChecked: true } }).body);
        const native = new JSDOM(render(NativeDefaults).body);
        try {
            const form = dom.window.document.querySelector('form')!;
            const [a, b] = Array.from(form.querySelectorAll('input'));
            const [nativeA, nativeB] = Array.from(native.window.document.querySelectorAll('input'));
            expect(a?.defaultChecked).toBe(nativeA?.defaultChecked);
            expect(b?.defaultChecked).toBe(nativeB?.defaultChecked);
            expect(a?.checked).toBe(false);
            expect(b?.checked).toBe(true);
            const NativeFormData = form.ownerDocument.defaultView!.FormData;
            expect(new NativeFormData(form).get('choices')).toBe('b');
        } finally {
            dom.window.close();
            native.window.close();
        }
    });
    test('uses native SSR identity equality for object group values', () => {
        const value = { id: 'same' };
        const selected = new JSDOM(render(ButtonCheck, { props: { type: 'radio', group: value, value } }).body);
        const distinct = new JSDOM(render(ButtonCheck, { props: { type: 'radio', group: { id: 'same' }, value } }).body);
        try {
            expect(selected.window.document.querySelector('input')?.hasAttribute('checked')).toBe(true);
            expect(distinct.window.document.querySelector('input')?.hasAttribute('checked')).toBe(false);
        } finally {
            selected.window.close();
            distinct.window.close();
        }
    });
});

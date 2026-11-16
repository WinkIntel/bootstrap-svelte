import { render } from 'svelte/server';
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

import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import RadioInput from '../form-radio-input.svelte';

describe('Form.RadioInput SSR', () => {
    it('serializes a standalone checked radio without relying on a client effect', () => {
        const { body } = render(RadioInput, { props: { checked: true, name: 'choice', value: 'selected' } });

        expect(body).toContain('type="radio"');
        expect(body).toContain('checked');
    });

    it('does not serialize checked for a controlled false radio', () => {
        const { body } = render(RadioInput, { props: { checked: false, name: 'choice', value: 'selected' } });

        expect(body).not.toContain('checked');
    });
});

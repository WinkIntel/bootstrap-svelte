import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import ColorInput from '../form-color-input.svelte';
import TextArea from '../form-text-area.svelte';

describe('form SSR defaults', () => {
    test.each([
        { value: '#563d7c', expected: '#563d7c' },
        { value: undefined, expected: '#000000' },
        { value: '', expected: '#000000' }
    ])('serializes color $value', ({ value, expected }) => {
        expect(render(ColorInput, { props: { value } }).body).toContain(`value="${expected}"`);
    });
    test('serializes nonresizable textarea without undefined style', () => {
        const { body } = render(TextArea, { props: { isResizable: false } });
        expect(body).toContain('resize: none');
        expect(body).not.toContain('undefined');
    });
});

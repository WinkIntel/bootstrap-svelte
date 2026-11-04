import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import KeyboardTest from './tab-keyboard-test.svelte';

describe.each(['tab', 'nav'] as const)('%s server tab entry', (kind) => {
    it('renders only the selected enabled tab with tabindex zero, including a later selected tab', () => {
        const html = render(KeyboardTest, { props: { kind, initial: 'c' } }).body;
        const links = html.match(/<(?:button|a)\b[^>]*id="key-[abc]"[^>]*>/g)!;
        expect(links).toHaveLength(3);
        expect(links[0]).toContain('tabindex="-1"');
        expect(links[1]).toContain('tabindex="-1"');
        expect(links[2]).toContain('tabindex="0"');
        expect(links.join('')).not.toContain('aria-current');
    });

    it('defers the no-selection fallback until mount and leaves all-disabled lists without an entry', () => {
        for (const props of [{ initial: '' }, { initial: 'c', disabled: ['a', 'b', 'c'] }]) {
            const html = render(KeyboardTest, { props: { kind, ...props } }).body;
            expect(html).not.toContain('tabindex="0"');
        }
    });
});

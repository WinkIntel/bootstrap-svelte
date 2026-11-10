import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Fixture from './offcanvas-accessibility-test.svelte';

describe('Offcanvas title server identity', () => {
    it('renders unique deterministic generated title IDs for hydration, including nested panels', () => {
        const first = render(Fixture, { props: { nested: true }, idPrefix: 'offcanvas-test' }).body;
        const second = render(Fixture, { props: { nested: true }, idPrefix: 'offcanvas-test' }).body;
        const ids = (html: string) => Array.from(html.matchAll(/id="(offcanvas-title-[^"]+)"/g), (match) => match[1]);
        expect(ids(first)).toHaveLength(2);
        expect(new Set(ids(first)).size).toBe(2);
        expect(ids(second)).toEqual(ids(first));
    });
    it('preserves explicit title IDs and unnamed roots without browser globals', () => {
        const html = render(Fixture, { props: { titleId: 'server-title', names: { 'aria-label': 'Server name' } } }).body;
        expect(html).toContain('id="server-title"');
        expect(html).toContain('aria-label="Server name"');
    });
});

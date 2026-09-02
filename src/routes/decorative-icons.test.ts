import { describe, expect, test } from 'vitest';

/**
 * Bootstrap Icons paint their glyph through `::before`, and generated content takes part in accessible-name
 * computation, so a decorative `<i class="bi …">` inside a link or label leaks a private-use character into what
 * screen readers announce. Every icon in the showcase is decorative and must be hidden from assistive technology.
 * The Markdown converter relies on the same attribute to keep icons out of the agent-facing output.
 */
const sources = import.meta.glob('./**/*.svelte', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const ICON_TAG = /<i\b[^>]*\bclass="[^"]*\bbi\b[^"]*"[^>]*>/g;

function unhiddenIcons(source: string): number[] {
    const lines: number[] = [];
    for (const match of source.matchAll(ICON_TAG)) {
        if (!/\baria-hidden="true"/.test(match[0])) lines.push(source.slice(0, match.index).split('\n').length);
    }
    return lines;
}

describe('decorative Bootstrap icons in the showcase', () => {
    test('scans the route sources', () => {
        expect(Object.keys(sources).length).toBeGreaterThan(10);
    });

    test('every <i class="bi …"> carries aria-hidden="true"', () => {
        const offenders = Object.entries(sources).flatMap(([file, source]) => unhiddenIcons(source).map((line) => `${file}:${line}`));
        expect(offenders).toEqual([]);
    });
});

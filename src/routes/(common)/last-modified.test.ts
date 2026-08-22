import { describe, expect, test } from 'vitest';
import { lastModified } from './last-modified.js';

const FALLBACK = new Date('2000-01-01T00:00:00.000Z');
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe('lastModified', () => {
    test('returns the UTC ISO date of the newest commit touching the given paths', () => {
        const value = lastModified(['src/routes/+page.svelte'], FALLBACK);
        expect(value).toMatch(ISO_UTC);
        expect(value).not.toBe(FALLBACK.toISOString());
    });

    test('falls back to the provided date for paths without history', () => {
        expect(lastModified(['src/routes/this-path-does-not-exist/'], FALLBACK)).toBe(FALLBACK.toISOString());
    });
});

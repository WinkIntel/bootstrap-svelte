import { describe, expect, test } from 'vitest';
import { negotiate, parseAccept } from './accept-negotiation.js';

describe('parseAccept', () => {
    test('parses media ranges with quality values and ignores other parameters', () => {
        expect(parseAccept('text/html, text/markdown; charset=utf-8; q=0.5, */*;q=0.1')).toEqual([
            { type: 'text', subtype: 'html', q: 1 },
            { type: 'text', subtype: 'markdown', q: 0.5 },
            { type: '*', subtype: '*', q: 0.1 }
        ]);
    });

    test('lower-cases types, tolerates whitespace, and clamps or defaults malformed q values', () => {
        expect(parseAccept(' TEXT/Markdown ;Q=2 , text/html;q=abc, text/plain;q=-1 ')).toEqual([
            { type: 'text', subtype: 'markdown', q: 1 },
            { type: 'text', subtype: 'html', q: 1 },
            { type: 'text', subtype: 'plain', q: 0 }
        ]);
    });

    test('skips entries that are not media ranges', () => {
        expect(parseAccept('text/markdown,,garbage, /x, text/')).toEqual([{ type: 'text', subtype: 'markdown', q: 1 }]);
    });

    test('returns an empty list for a missing or empty header', () => {
        expect(parseAccept(null)).toEqual([]);
        expect(parseAccept(undefined)).toEqual([]);
        expect(parseAccept('   ')).toEqual([]);
    });
});

describe('negotiate', () => {
    test.each([
        [null, 'html'],
        ['', 'html'],
        ['*/*', 'html'],
        ['text/*', 'html'],
        ['text/html', 'html'],
        ['application/xhtml+xml', 'html'],
        ['text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8', 'html'],
        ['text/markdown', 'markdown'],
        ['TEXT/MARKDOWN', 'markdown'],
        ['text/markdown, text/html', 'markdown'],
        ['text/markdown, text/html;q=0.9', 'markdown'],
        ['text/markdown;q=0.9, text/html;q=0.8', 'markdown'],
        ['text/html;q=0.8, text/markdown;q=0.9', 'markdown'],
        ['text/markdown;q=0.001', 'markdown'],
        ['text/*;q=0.5, text/markdown;q=0.5', 'markdown'],
        ['text/html, text/markdown;q=0.9', 'html'],
        ['text/html;q=0.9, text/markdown;q=0.5', 'html'],
        ['text/html;q=0.9, text/markdown; charset=utf-8; q=0.5', 'html'],
        ['text/markdown;q=0.5, */*', 'html'],
        ['text/markdown;q=0.5, text/*', 'html'],
        ['text/markdown;q=0, */*', 'html'],
        ['text/markdown;q=0', 'not-acceptable'],
        ['text/markdown;q=0.0', 'not-acceptable'],
        ['text/markdown; charset=utf-8; q=0', 'not-acceptable'],
        ['text/markdown;q=0, application/json', 'not-acceptable'],
        ['text/html;q=0, text/markdown;q=0', 'not-acceptable'],
        ['application/json', 'not-acceptable'],
        ['image/png, */*;q=0.1', 'html']
    ])('Accept: %s → %s', (accept, expected) => {
        expect(negotiate(accept)).toBe(expected);
    });
});

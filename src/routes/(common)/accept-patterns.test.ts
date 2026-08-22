import { describe, expect, test } from 'vitest';
import { negotiate } from './accept-negotiation.js';
import { acceptPatterns, routeDecision } from './accept-patterns.js';

/** Accept headers on which the static Vercel routes must agree with the RFC 9110 reference implementation. */
const AGREEING_HEADERS = [
    null,
    '',
    '   ',
    '*/*',
    'text/*',
    'text/html',
    'application/xhtml+xml',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'text/markdown',
    'TEXT/MARKDOWN',
    'text/markdown, text/html',
    'text/markdown, text/html;q=0.9',
    'text/markdown;q=0.9, text/html;q=0.8',
    'text/html;q=0.8, text/markdown;q=0.9',
    'text/markdown;q=0.001',
    'text/*;q=0.5, text/markdown;q=0.5',
    'text/html, text/markdown;q=0.9',
    'text/html;q=1, text/markdown;q=0.9',
    'text/html;q=1.0, text/markdown;q=1.0',
    'text/html;q=0.9, text/markdown;q=0.5',
    'text/html;q=0.9, text/markdown; charset=utf-8; q=0.5',
    'text/html ; level=1 ; q=0.9 , text/markdown ; q=0.5',
    'text/html;Q=0.9, text/markdown;q=0.5',
    'text/markdown;q=0.5, */*',
    'text/markdown;q=0.5, text/*',
    'text/markdown;q=0, */*',
    'text/markdown;q=0',
    'text/markdown;q=0.0',
    'text/markdown; charset=utf-8; q=0',
    'text/markdown;q=0, application/json',
    'text/html;q=0, text/markdown;q=0',
    '*/*;q=0',
    'application/json',
    'image/png, */*;q=0.1',
    'text/markdown;q=0.05, text/html;q=0.5',
    'text/html;q=0.5, text/markdown;q=0.05'
] as const;

/** Quality values are compared on their first decimal digit; finer differences tie, and a tie goes to explicit `text/markdown`. */
const DOCUMENTED_DIVERGENCES = [
    ['text/html;q=0.95, text/markdown;q=0.9', 'markdown', 'html'],
    ['text/markdown;q=0.9, text/html;q=0.95', 'markdown', 'html']
] as const;

describe('routeDecision (what the static Vercel routes decide)', () => {
    test.each(AGREEING_HEADERS)('Accept: %s agrees with negotiate()', (accept) => {
        expect(routeDecision(accept)).toBe(negotiate(accept));
    });

    test.each(DOCUMENTED_DIVERGENCES)('Accept: %s → %s (reference says %s)', (accept, routes, reference) => {
        expect(routeDecision(accept)).toBe(routes);
        expect(negotiate(accept)).toBe(reference);
    });
});

/** Vercel rejects deployments whose route conditions exceed this many characters. */
const VERCEL_CONDITION_LIMIT = 4096;

function everyPattern(): [string, string][] {
    return Object.entries(acceptPatterns).flatMap(([name, value]) =>
        Array.isArray(value) ? value.map((pattern, index): [string, string] => [`${name}[${index}]`, pattern]) : [[name, value]]
    );
}

describe('acceptPatterns', () => {
    test('are anchored, lookaround-free regular expressions that compile in JavaScript', () => {
        for (const [name, pattern] of everyPattern()) {
            expect(pattern.startsWith('^'), name).toBe(true);
            expect(pattern.endsWith('$'), name).toBe(true);
            expect(pattern, name).not.toMatch(/\(\?[=!<]/);
            expect(() => new RegExp(pattern), name).not.toThrow();
        }
    });

    test('stay within the length Vercel accepts for a route condition', () => {
        for (const [name, pattern] of everyPattern()) {
            expect(pattern.length, name).toBeLessThanOrEqual(VERCEL_CONDITION_LIMIT);
        }
    });

    test('htmlBeatsMarkdown is a list of conditions that are all required to be absent', () => {
        expect(Array.isArray(acceptPatterns.htmlBeatsMarkdown)).toBe(true);
        expect(acceptPatterns.htmlBeatsMarkdown.length).toBeGreaterThan(1);
        const matchesAny = (accept: string) => acceptPatterns.htmlBeatsMarkdown.some((pattern) => new RegExp(pattern).test(accept));
        expect(matchesAny('text/html, text/markdown;q=0.9')).toBe(true);
        expect(matchesAny('text/html;q=0.9, text/markdown;q=0.5')).toBe(true);
        expect(matchesAny('text/markdown;q=0.5, text/html;q=0.9')).toBe(true);
        expect(matchesAny('text/markdown, text/html;q=0.9')).toBe(false);
    });

    test('markdownAcceptable requires an explicit text/markdown range whose q is not zero', () => {
        const matches = (accept: string) => new RegExp(acceptPatterns.markdownAcceptable).test(accept);
        expect(matches('text/markdown')).toBe(true);
        expect(matches('text/html, text/markdown; charset=utf-8; q=0.5')).toBe(true);
        expect(matches('text/markdown;q=0')).toBe(false);
        expect(matches('text/markdown; charset=utf-8; q=0.0')).toBe(false);
        expect(matches('*/*')).toBe(false);
    });

    test('htmlAcceptable accepts exact, subtype-wildcard, and wildcard ranges unless they carry q=0', () => {
        const matches = (accept: string) => new RegExp(acceptPatterns.htmlAcceptable).test(accept);
        expect(matches('text/html')).toBe(true);
        expect(matches('text/*;q=0.1')).toBe(true);
        expect(matches('image/png, */*;q=0.1')).toBe(true);
        expect(matches('application/xhtml+xml')).toBe(true);
        expect(matches('*/*;q=0')).toBe(false);
        expect(matches('text/markdown')).toBe(false);
    });

    test('nonEmpty only matches headers with a value', () => {
        const matches = (accept: string) => new RegExp(acceptPatterns.nonEmpty).test(accept);
        expect(matches('text/html')).toBe(true);
        expect(matches('')).toBe(false);
        expect(matches('   ')).toBe(false);
    });
});

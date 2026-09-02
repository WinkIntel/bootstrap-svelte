import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { describeIndexNowStatus, INDEXNOW_ENDPOINT, INDEXNOW_KEY, INDEXNOW_KEY_PATH, indexNowPayload, sitemapUrls } from './indexnow.js';
import { SITE_URL } from './site-url.js';

const staticDir = fileURLToPath(new URL('../../../static/', import.meta.url));

describe('IndexNow key', () => {
    test('is 8 to 128 characters drawn from letters, digits, and dashes', () => {
        expect(INDEXNOW_KEY).toMatch(/^[A-Za-z0-9-]{8,128}$/);
    });

    test('is hosted at the site root as <key>.txt, a UTF-8 file containing exactly the key', () => {
        expect(INDEXNOW_KEY_PATH).toBe(`/${INDEXNOW_KEY}.txt`);
        const file = `${staticDir}${INDEXNOW_KEY}.txt`;
        expect(existsSync(file)).toBe(true);
        expect(readFileSync(file, 'utf8').trim()).toBe(INDEXNOW_KEY);
    });

    test('submits to the shared IndexNow API, which fans out to Bing and the other participating engines', () => {
        expect(INDEXNOW_ENDPOINT).toBe('https://api.indexnow.org/indexnow');
    });
});

describe('sitemapUrls', () => {
    test('extracts every <loc> in document order and decodes XML entities', () => {
        const xml = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            '<url><loc>https://example.test/</loc><lastmod>2026-01-01T00:00:00.000Z</lastmod></url>',
            '<url><loc> https://example.test/a?x=1&amp;y=2 </loc></url>',
            '<url><loc>https://example.test/b&apos;c</loc></url>',
            '</urlset>'
        ].join('\n');

        expect(sitemapUrls(xml)).toEqual(['https://example.test/', 'https://example.test/a?x=1&y=2', "https://example.test/b'c"]);
    });

    test('returns an empty list when the sitemap has no URLs', () => {
        expect(sitemapUrls('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>')).toEqual([]);
    });
});

describe('indexNowPayload', () => {
    test('names the site host and key, points at the key file, and lists the URLs', () => {
        expect(indexNowPayload([`${SITE_URL}/`, `${SITE_URL}/components/button`])).toEqual({
            host: 'bootstrap-svelte.vercel.app',
            key: INDEXNOW_KEY,
            keyLocation: `${SITE_URL}${INDEXNOW_KEY_PATH}`,
            urlList: [`${SITE_URL}/`, `${SITE_URL}/components/button`]
        });
    });

    test('drops duplicate URLs while keeping the first occurrence in place', () => {
        const payload = indexNowPayload([`${SITE_URL}/about`, `${SITE_URL}/`, `${SITE_URL}/about`]);
        expect(payload.urlList).toEqual([`${SITE_URL}/about`, `${SITE_URL}/`]);
    });

    test('rejects URLs on another host, since IndexNow only accepts URLs the key file vouches for', () => {
        expect(() => indexNowPayload([`${SITE_URL}/`, 'https://example.com/'])).toThrow(/example\.com/);
        expect(() => indexNowPayload(['http://bootstrap-svelte.vercel.app/'])).toThrow(/http:\/\/bootstrap-svelte/);
    });

    test('rejects an empty submission', () => {
        expect(() => indexNowPayload([])).toThrow(/no urls/i);
    });

    test('rejects more URLs than one IndexNow request allows', () => {
        const urls = Array.from({ length: 10_001 }, (_, index) => `${SITE_URL}/page-${index}`);
        expect(() => indexNowPayload(urls)).toThrow(/10,000/);
    });
});

describe('describeIndexNowStatus', () => {
    test.each([
        [200, /submitted/i],
        [202, /key .*pending|pending .*key|validation/i],
        [400, /invalid|bad request/i],
        [403, /key/i],
        [422, /host|key file/i],
        [429, /too many|rate/i]
    ])('explains HTTP %i in the words of the protocol', (status, pattern) => {
        expect(describeIndexNowStatus(status)).toMatch(pattern);
    });

    test('still names an unexpected status code', () => {
        expect(describeIndexNowStatus(503)).toMatch(/503/);
    });
});

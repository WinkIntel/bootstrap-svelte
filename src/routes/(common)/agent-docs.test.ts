import { describe, expect, test } from 'vitest';
import { buildAgentsMd, buildLlmsFullTxt, buildLlmsTxt, buildNotAcceptableTxt, buildRobotsTxt, buildSitemapXml } from './agent-docs.js';
import { sitePages } from './site.js';

const summaries = sitePages().map((page) => ({ ...page, lead: `${page.label} lead text.` }));

describe('buildLlmsTxt', () => {
    const text = buildLlmsTxt(summaries);
    const lines = text.split('\n');

    test('starts with the H1 project name followed by a blockquote summary', () => {
        expect(lines[0]).toBe('# Bootstrap Svelte');
        expect(lines[1]).toBe('');
        expect(lines[2]?.startsWith('> ')).toBe(true);
    });

    test('uses no headings other than the H1 and the H2 file-list sections', () => {
        const headings = lines.filter((line) => line.startsWith('#'));
        expect(headings[0]).toBe('# Bootstrap Svelte');
        for (const heading of headings.slice(1)) {
            expect(heading.startsWith('## ')).toBe(true);
        }
    });

    test('explains when to use the library and how agents should read the site before the file lists', () => {
        const preamble = text.slice(0, text.indexOf('\n## '));
        expect(preamble).toContain('When to use');
        expect(preamble).toContain('When not to use');
        expect(preamble).toContain('Accept: text/markdown');
        expect(preamble).toContain('pnpm add @winkintel/bootstrap-svelte bootstrap');
    });

    test('lists every page as a Markdown link with its lead as the note', () => {
        expect(text).toContain('## Components');
        expect(text).toContain('- [Overview](https://bootstrap-svelte.vercel.app/index.md): Overview lead text.');
        expect(text).toContain('- [Button](https://bootstrap-svelte.vercel.app/components/button.md): Button lead text.');
        expect(text).toContain('- [Privacy](https://bootstrap-svelte.vercel.app/privacy.md): Privacy lead text.');
    });

    test('falls back to the page description when a page has no lead', () => {
        const withoutLead = buildLlmsTxt(summaries.map((page) => ({ ...page, lead: '' })));
        expect(withoutLead).toContain('- [About](https://bootstrap-svelte.vercel.app/about.md): What Bootstrap Svelte is');
        expect(withoutLead).not.toMatch(/\): *\n/);
    });

    test('ends with an Optional section pointing at the full docs file and the sitemap', () => {
        const optional = text.slice(text.indexOf('## Optional'));
        expect(optional).toContain('https://bootstrap-svelte.vercel.app/llms-full.txt');
        expect(optional).toContain('https://bootstrap-svelte.vercel.app/sitemap.xml');
        expect(optional).toContain('https://bootstrap-svelte.vercel.app/agents.md');
    });
});

describe('buildAgentsMd', () => {
    const text = buildAgentsMd();

    test('is a Markdown document with when-to-use guidance and integration rules', () => {
        expect(text.startsWith('# Bootstrap Svelte — agent instructions\n')).toBe(true);
        expect(text).toContain('## When to use');
        expect(text).toContain('## When not to use');
        expect(text).toContain('## How to use');
        expect(text).toContain("import { Button, Card, Modal } from '@winkintel/bootstrap-svelte';");
        expect(text).toContain('<Card.Header>');
        expect(text).toContain('https://bootstrap-svelte.vercel.app/llms.txt');
    });
});

describe('buildRobotsTxt', () => {
    test('allows crawling and advertises the sitemap', () => {
        expect(buildRobotsTxt()).toBe('User-agent: *\nAllow: /\n\nSitemap: https://bootstrap-svelte.vercel.app/sitemap.xml\n');
    });
});

describe('buildSitemapXml', () => {
    test('produces a sitemaps.org urlset with absolute locations and lastmod dates', () => {
        const xml = buildSitemapXml([
            { href: '/', lastmod: '2026-08-19T18:00:54.000Z' },
            { href: '/components/button', lastmod: '2026-08-01T00:00:00.000Z' }
        ]);
        expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')).toBe(true);
        expect(xml).toContain('<url><loc>https://bootstrap-svelte.vercel.app/</loc><lastmod>2026-08-19T18:00:54.000Z</lastmod></url>');
        expect(xml).toContain(
            '<url><loc>https://bootstrap-svelte.vercel.app/components/button</loc><lastmod>2026-08-01T00:00:00.000Z</lastmod></url>'
        );
        expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
    });

    test('escapes XML special characters in locations', () => {
        expect(buildSitemapXml([{ href: '/a?b=1&c=2', lastmod: '2026-01-01T00:00:00.000Z' }])).toContain(
            '<loc>https://bootstrap-svelte.vercel.app/a?b=1&amp;c=2</loc>'
        );
    });
});

describe('buildLlmsFullTxt', () => {
    test('concatenates every page with separators under a document title', () => {
        const text = buildLlmsFullTxt([
            { href: '/', title: 'Home', lead: '', markdown: '# Home\n\nBody\n' },
            { href: '/about', title: 'About', lead: 'x', markdown: '# About\n\nMore\n' }
        ]);
        expect(text.startsWith('# Bootstrap Svelte — full documentation\n')).toBe(true);
        expect(text).toContain('\n# Home\n\nBody\n');
        expect(text).toContain('\n---\n');
        expect(text).toContain('\n# About\n\nMore\n');
    });
});

describe('buildNotAcceptableTxt', () => {
    test('lists the available representations', () => {
        const text = buildNotAcceptableTxt();
        expect(text).toContain('406 Not Acceptable');
        expect(text).toContain('text/html');
        expect(text).toContain('text/markdown');
    });
});

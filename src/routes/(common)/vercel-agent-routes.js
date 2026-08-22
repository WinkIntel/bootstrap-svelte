// @ts-check
/**
 * Build-time patch for the Vercel Build Output config written by `@sveltejs/adapter-static` (zero-config Vercel mode).
 *
 * The showcase is fully prerendered, so content negotiation has to happen in Vercel's routing layer:
 * - requests that prefer `text/markdown` are rewritten to the prerendered `.md` sibling of each page,
 * - page responses carry `Vary: Accept` and a `Link: <…>; rel="alternate"; type="text/markdown"` header,
 * - requests whose Accept header lists nothing we can serve get a 406 with an explanatory body,
 * - unknown paths get a real 404 with a Markdown or HTML body depending on the Accept header.
 *
 * The Accept matching is regex based (Vercel `has`/`missing` conditions), which approximates RFC 9110 negotiation:
 * `text/markdown` wins when it is listed with a non-zero q, unless `text/html` is listed without a q while
 * markdown carries a fractional one. `negotiate()` is the reference implementation of the same rules.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { SITE_URL } from './site-url.js';

/** @typedef {{ type: 'header' | 'cookie' | 'query' | 'host', key?: string, value?: string }} VercelCondition */
/**
 * @typedef {{
 *   handle?: string,
 *   src?: string,
 *   dest?: string,
 *   headers?: Record<string, string>,
 *   status?: number,
 *   continue?: boolean,
 *   check?: boolean,
 *   has?: VercelCondition[],
 *   missing?: VercelCondition[]
 * }} VercelRoute
 */
/** @typedef {{ version: 3, routes?: VercelRoute[], overrides?: Record<string, { path?: string, contentType?: string }> }} VercelConfig */
/** @typedef {{ pages: string[], markdownFiles: string[] }} AgentManifest */

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

/** Anchored regular expressions (no lookarounds, so they work in Vercel's PCRE matcher and in JavaScript). */
export const acceptPatterns = {
    /** `text/markdown` is mentioned at all. */
    markdown: '^.*text/markdown.*$',
    /** `text/markdown` is explicitly rejected with `q=0`. */
    markdownRejected: '^.*text/markdown\\s*;\\s*q=0(?:\\.0+)?\\s*(?:[,;].*)?$',
    /** `text/html` is listed without a q-value (q=1) while `text/markdown` carries a fractional one, so HTML ranks higher. */
    htmlPreferred: '^(?:.*text/markdown\\s*;\\s*q=0\\.\\d+.*,\\s*text/html\\s*(?:,.*)?|.*text/html\\s*,.*text/markdown\\s*;\\s*q=0\\.\\d+.*)$',
    /** At least one representation we can produce is acceptable. */
    acceptable: '^.*(?:text/html|text/\\*|\\*/\\*|text/markdown|application/xhtml\\+xml).*$'
};

/**
 * Reference implementation of the routing rules, used by tests and available for local tooling.
 * @param {string | null | undefined} accept
 * @returns {'html' | 'markdown' | 'not-acceptable'}
 */
export function negotiate(accept) {
    if (accept === null || accept === undefined || accept.trim() === '') return 'html';

    /** @param {string} pattern */
    const matches = (pattern) => new RegExp(pattern).test(accept);

    if (!matches(acceptPatterns.acceptable)) return 'not-acceptable';
    if (matches(acceptPatterns.markdown) && !matches(acceptPatterns.markdownRejected) && !matches(acceptPatterns.htmlPreferred)) return 'markdown';
    return 'html';
}

/** @param {string} value */
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** @param {string} path */
function alternateLink(path) {
    return `<${SITE_URL}${path}>; rel="alternate"; type="text/markdown"`;
}

/**
 * Returns a copy of `config` with the negotiation, header, 406, and 404 routes added and the
 * Markdown files forced to `text/markdown`. The input is not modified.
 * @param {VercelConfig} config
 * @param {AgentManifest} manifest
 * @returns {VercelConfig}
 */
export function addAgentRoutes(config, manifest) {
    const pages = manifest.pages
        .filter((page) => page !== '/' && page !== '/404')
        .map((page) => page.replace(/^\//, ''))
        .sort();
    const pageAlternation = pages.map(escapeRegex).join('|');
    const vary = { Vary: 'Accept' };

    /** @type {VercelCondition} */
    const prefersMarkdown = { type: 'header', key: 'accept', value: acceptPatterns.markdown };
    /** @type {VercelCondition[]} */
    const unlessHtmlWins = [
        { type: 'header', key: 'accept', value: acceptPatterns.markdownRejected },
        { type: 'header', key: 'accept', value: acceptPatterns.htmlPreferred }
    ];

    /** @type {VercelRoute[]} */
    const negotiation = [
        { src: '^/[^.]*$', headers: vary, continue: true },
        { src: '^/$', headers: { Link: alternateLink('/index.md') }, continue: true },
        ...(pages.length > 0 ? [{ src: `^/(${pageAlternation})$`, headers: { Link: alternateLink('/$1.md') }, continue: true }] : []),
        {
            src: `^/(?:${pageAlternation})?$`,
            has: [{ type: 'header', key: 'accept' }],
            missing: [{ type: 'header', key: 'accept', value: acceptPatterns.acceptable }],
            status: 406,
            dest: '/406.txt',
            headers: vary
        },
        { src: '^/$', has: [prefersMarkdown], missing: unlessHtmlWins, dest: '/index.md' },
        ...(pages.length > 0 ? [{ src: `^/(${pageAlternation})$`, has: [prefersMarkdown], missing: unlessHtmlWins, dest: '/$1.md' }] : [])
    ];

    /** @type {VercelRoute[]} */
    const notFound = [
        { src: '^/.*$', has: [prefersMarkdown], missing: unlessHtmlWins, status: 404, dest: '/404.md', headers: vary },
        { src: '^/.*$', status: 404, dest: '/404.html', headers: vary }
    ];

    const routes = [...(config.routes ?? [])];
    let filesystemIndex = routes.findIndex((route) => route.handle === 'filesystem');
    if (filesystemIndex === -1) {
        routes.push({ handle: 'filesystem' });
        filesystemIndex = routes.length - 1;
    }

    /** @type {Record<string, { path?: string, contentType?: string }>} */
    const overrides = { ...(config.overrides ?? {}) };
    // Keep 404.html addressable by file name so the catch-all routes (and Vercel's own 404.html convention) can serve it.
    delete overrides['404.html'];
    for (const file of manifest.markdownFiles) {
        overrides[file] = { ...(overrides[file] ?? {}), contentType: MARKDOWN_CONTENT_TYPE };
    }

    return {
        ...config,
        routes: [...routes.slice(0, filesystemIndex), ...negotiation, ...routes.slice(filesystemIndex), ...notFound],
        overrides
    };
}

/**
 * Wraps a SvelteKit adapter so that, after it runs, the Vercel Build Output config it produced gains the agent routes.
 * Does nothing when no config was written (for example a local, non-Vercel build).
 * @param {import('@sveltejs/kit').Adapter} base
 * @param {{ configPath?: string }} [options]
 * @returns {import('@sveltejs/kit').Adapter}
 */
export function withAgentRoutes(base, options = {}) {
    const configPath = options.configPath ?? '.vercel/output/config.json';

    return {
        ...base,
        name: base.name,
        async adapt(builder) {
            await base.adapt(builder);
            if (!existsSync(configPath)) return;

            /** @type {VercelConfig} */
            const config = JSON.parse(readFileSync(configPath, 'utf8'));
            /** @type {AgentManifest} */
            const manifest = {
                pages: [...builder.prerendered.pages.keys()],
                markdownFiles: [...builder.prerendered.assets.keys()].filter((path) => path.endsWith('.md')).map((path) => path.replace(/^\//, ''))
            };

            writeFileSync(configPath, JSON.stringify(addAgentRoutes(config, manifest), null, '  '));
            builder.log?.minor?.(`Added Markdown content negotiation and 404 routes to ${configPath}`);
        }
    };
}

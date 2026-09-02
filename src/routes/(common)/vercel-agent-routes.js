// @ts-check
/**
 * Build-time patch for the Vercel Build Output config written by `@sveltejs/adapter-static` (zero-config Vercel mode).
 *
 * The showcase is fully prerendered and deliberately ships no runtime functions, so everything happens in static
 * routing rules:
 * - trailing-slash URLs redirect to the canonical path with a 301 (Bing's Webmaster Guidelines ask for 301 on permanent
 *   moves; for a GET-only static site it is equivalent to 308),
 * - requests that prefer `text/markdown` are rewritten to the prerendered `.md` sibling of each page,
 * - page responses carry `Vary: Accept` and a `Link: <…>; rel="alternate"; type="text/markdown"` header,
 * - requests whose Accept header accepts neither representation get a 406 with an explanatory body,
 * - unknown paths get a real 404 with a Markdown or HTML body depending on the Accept header.
 *
 * The Accept conditions are the regular expressions built by `accept-patterns.js`; see that file for exactly what
 * they honor and approximate.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { acceptPatterns } from './accept-patterns.js';
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
 *   has?: VercelCondition[],
 *   missing?: VercelCondition[]
 * }} VercelRoute
 */
/** @typedef {{ version: 3, routes?: VercelRoute[], overrides?: Record<string, { path?: string, contentType?: string }> }} VercelConfig */
/** @typedef {{ pages: string[], markdownFiles: string[] }} AgentManifest */

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

/** @param {string} value */
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** @param {string} path */
function alternateLink(path) {
    return `<${SITE_URL}${path}>; rel="alternate"; type="text/markdown"`;
}

/** @param {string} value @returns {VercelCondition} */
function accept(value) {
    return { type: 'header', key: 'accept', value };
}

/**
 * Returns a copy of `config` with the redirect, negotiation, header, 406, and 404 routes added and the Markdown
 * files forced to `text/markdown`. The input is not modified.
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
    const prefersMarkdown = [accept(acceptPatterns.markdownAcceptable)];
    const unlessHtmlWins = acceptPatterns.htmlBeatsMarkdown.map(accept);

    /** @type {VercelRoute[]} */
    const negotiation = [
        { src: '^/[^.]*$', headers: vary, continue: true },
        { src: '^/$', headers: { Link: alternateLink('/index.md') }, continue: true },
        ...(pages.length > 0 ? [{ src: `^/(${pageAlternation})$`, headers: { Link: alternateLink('/$1.md') }, continue: true }] : []),
        {
            src: `^/(?:${pageAlternation})?$`,
            has: [accept(acceptPatterns.nonEmpty)],
            missing: [accept(acceptPatterns.htmlAcceptable), accept(acceptPatterns.markdownAcceptable)],
            status: 406,
            dest: '/406.txt',
            headers: vary
        },
        { src: '^/$', has: prefersMarkdown, missing: unlessHtmlWins, dest: '/index.md' },
        ...(pages.length > 0 ? [{ src: `^/(${pageAlternation})$`, has: prefersMarkdown, missing: unlessHtmlWins, dest: '/$1.md' }] : [])
    ];

    /** @type {VercelRoute[]} */
    const notFound = [
        { src: '^/.*$', has: prefersMarkdown, missing: unlessHtmlWins, status: 404, dest: '/404.md', headers: vary },
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
        routes: [
            { src: '^/(.+?)/+$', status: 301, headers: { Location: '/$1' } },
            ...routes.slice(0, filesystemIndex),
            ...negotiation,
            ...routes.slice(filesystemIndex),
            ...notFound
        ],
        overrides
    };
}

/**
 * Wraps a SvelteKit adapter so that, after it runs, the Vercel Build Output config it produced gains the agent routes.
 * Does nothing when no config was written (for example a local, non-Vercel build).
 * @param {import('@sveltejs/kit').Adapter} base
 * @param {{ outputDir?: string }} [options]
 * @returns {import('@sveltejs/kit').Adapter}
 */
export function withAgentRoutes(base, options = {}) {
    const outputDir = options.outputDir ?? '.vercel/output';

    return {
        ...base,
        name: base.name,
        async adapt(builder) {
            await base.adapt(builder);

            const configPath = join(outputDir, 'config.json');
            if (!existsSync(configPath)) return;

            /** @type {VercelConfig} */
            const config = JSON.parse(readFileSync(configPath, 'utf8'));
            /** @type {AgentManifest} */
            const manifest = {
                pages: [...builder.prerendered.pages.keys()],
                markdownFiles: [...builder.prerendered.assets.keys()].filter((path) => path.endsWith('.md')).map((path) => path.replace(/^\//, ''))
            };

            writeFileSync(configPath, JSON.stringify(addAgentRoutes(config, manifest), null, '  '));
            builder.log?.minor?.(`Added Markdown content negotiation, redirect, and 404/406 routes to ${configPath}`);
        }
    };
}

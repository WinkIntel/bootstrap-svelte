// @ts-check
/**
 * Vercel Routing Middleware for the prerendered showcase. It runs for every extension-less path and:
 * - redirects trailing-slash variants to the canonical path (308),
 * - serves a Markdown or HTML 404 body for unknown paths,
 * - answers 406 when the Accept header lists nothing this site can produce,
 * - rewrites Markdown-preferring requests to the prerendered `.md` sibling,
 * - adds `Vary: Accept` and a `Link: rel="alternate"` header to page responses.
 *
 * Only its sibling modules are imported; `vercel-agent-routes.js` copies them next to this file into the function bundle.
 */
import { negotiate } from './accept-negotiation.js';
import { markdownPath } from './site-url.js';

/**
 * @typedef {{
 *   siteUrl: string,
 *   pages: string[],
 *   notFound: { html: string, markdown: string },
 *   notAcceptable: string
 * }} MiddlewareConfig
 */

const MARKDOWN_TYPE = 'text/markdown; charset=utf-8';
const HTML_TYPE = 'text/html; charset=utf-8';
const TEXT_TYPE = 'text/plain; charset=utf-8';
const VARY = { Vary: 'Accept' };

/** @param {Record<string, string>} [headers] */
function next(headers = {}) {
    return new Response(null, { headers: { 'x-middleware-next': '1', ...headers } });
}

/**
 * @param {Request} request
 * @param {MiddlewareConfig} config
 * @returns {Response}
 */
export function handleRequest(request, config) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname.length > 1 && pathname.endsWith('/')) {
        url.pathname = pathname.replace(/\/+$/, '') || '/';
        return Response.redirect(url.toString(), 308);
    }

    // Static assets are never negotiated; the route matcher excludes them, this is a guard.
    if (pathname.includes('.')) return next();

    const decision = negotiate(request.headers.get('accept'));

    if (!config.pages.includes(pathname)) {
        const markdown = decision === 'markdown';
        return new Response(markdown ? config.notFound.markdown : config.notFound.html, {
            status: 404,
            headers: { 'content-type': markdown ? MARKDOWN_TYPE : HTML_TYPE, ...VARY }
        });
    }

    if (decision === 'not-acceptable') {
        return new Response(config.notAcceptable, { status: 406, headers: { 'content-type': TEXT_TYPE, ...VARY } });
    }

    const link = { Link: `<${config.siteUrl}${markdownPath(pathname)}>; rel="alternate"; type="text/markdown"` };

    if (decision === 'markdown') {
        url.pathname = markdownPath(pathname);
        return new Response(null, { headers: { 'x-middleware-rewrite': url.toString(), ...VARY, ...link } });
    }

    return next({ ...VARY, ...link });
}

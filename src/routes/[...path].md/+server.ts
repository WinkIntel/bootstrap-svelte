import { error } from '@sveltejs/kit';
import { renderPageMarkdown } from '../(common)/markdown/render-page.js';
import { findPage, notFoundPage, sitePages } from '../(common)/site.js';
import type { EntryGenerator, RequestHandler } from './$types.js';

/**
 * Markdown representation of every page, prerendered next to its HTML (`/components/button.md`, `/index.md`).
 * On Vercel, requests with `Accept: text/markdown` are rewritten to these files (see `vercel-agent-routes.js`).
 */
export const prerender = true;

function hrefFromPath(path: string): string {
    return path === 'index' ? '/' : `/${path}`;
}

function pathFromHref(href: string): string {
    return href === '/' ? 'index' : href.slice(1);
}

export const entries: EntryGenerator = () => [...sitePages(), notFoundPage].map((page) => ({ path: pathFromHref(page.href) }));

export const GET: RequestHandler = async ({ params }) => {
    const href = hrefFromPath(params.path);
    if (params.path === '' || !findPage(href)) error(404, `No page at ${href}`);

    const page = await renderPageMarkdown(href);
    return new Response(page.markdown, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
};

import { buildSitemapXml } from '../(common)/agent-docs.js';
import { lastModified } from '../(common)/last-modified.js';
import { sitePages } from '../(common)/site.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

const buildDate = new Date();

/** Source files whose git history determines a page's `lastmod`. */
function sourcePaths(href: string): string[] {
    return href === '/' ? ['src/routes/+page.svelte', 'src/routes/(common)/routes.json'] : [`src/routes${href}`];
}

export const GET: RequestHandler = () => {
    const entries = sitePages().map((page) => ({ href: page.href, lastmod: lastModified(sourcePaths(page.href), buildDate) }));
    return new Response(buildSitemapXml(entries), { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};

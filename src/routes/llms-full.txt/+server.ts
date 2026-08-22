import { buildLlmsFullTxt } from '../(common)/agent-docs.js';
import { renderPageMarkdown } from '../(common)/markdown/render-page.js';
import { sitePages } from '../(common)/site.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = async () => {
    const pages = await Promise.all(sitePages().map((page) => renderPageMarkdown(page.href)));
    return new Response(buildLlmsFullTxt(pages), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};

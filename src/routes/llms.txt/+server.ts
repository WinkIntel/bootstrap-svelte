import { buildLlmsTxt } from '../(common)/agent-docs.js';
import { renderPageMarkdown } from '../(common)/markdown/render-page.js';
import { sitePages } from '../(common)/site.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = async () => {
    const summaries = await Promise.all(sitePages().map(async (page) => ({ ...page, lead: (await renderPageMarkdown(page.href)).lead })));
    return new Response(buildLlmsTxt(summaries), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};

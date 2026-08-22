import { buildNotAcceptableTxt } from '../(common)/agent-docs.js';
import type { RequestHandler } from './$types.js';

/** Body served by the Vercel routing layer for requests whose Accept header lists nothing this site can serve. */
export const prerender = true;

export const GET: RequestHandler = () => new Response(buildNotAcceptableTxt(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });

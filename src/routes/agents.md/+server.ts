import { buildAgentsMd } from '../(common)/agent-docs.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = () => new Response(buildAgentsMd(), { headers: { 'content-type': 'text/markdown; charset=utf-8' } });

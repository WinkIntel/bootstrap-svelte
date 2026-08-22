import { buildRobotsTxt } from '../(common)/agent-docs.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = () => new Response(buildRobotsTxt(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });

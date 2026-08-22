// @ts-check
/**
 * Build-time patch for the Vercel Build Output written by `@sveltejs/adapter-static` (zero-config Vercel mode).
 *
 * The showcase is fully prerendered, so content negotiation happens in Vercel's routing layer: every extension-less
 * path is routed through a small Routing Middleware (`agent-middleware.js`, emitted as an edge function) that
 * negotiates HTML vs. Markdown per RFC 9110, redirects trailing slashes, and serves 404/406 bodies. This module adds
 * that route, forces `.md` files to `text/markdown`, and keeps `404.html` as the catch-all for anything else.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from './site-url.js';

/**
 * @typedef {{
 *   handle?: string,
 *   src?: string,
 *   dest?: string,
 *   headers?: Record<string, string>,
 *   status?: number,
 *   continue?: boolean,
 *   middlewarePath?: string
 * }} VercelRoute
 */
/** @typedef {{ version: 3, routes?: VercelRoute[], overrides?: Record<string, { path?: string, contentType?: string }> }} VercelConfig */
/** @typedef {{ markdownFiles: string[] }} AgentManifest */
/** @typedef {import('./agent-middleware.js').MiddlewareConfig} MiddlewareConfig */

export const MIDDLEWARE_NAME = 'agent-negotiation';
export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

const MIDDLEWARE_SOURCES = ['agent-middleware.js', 'accept-negotiation.js', 'site-url.js'];

/**
 * Returns a copy of `config` with the middleware route first, a 404 catch-all last, and Markdown files forced to
 * `text/markdown`. The input is not modified.
 * @param {VercelConfig} config
 * @param {AgentManifest} manifest
 * @returns {VercelConfig}
 */
export function addAgentRoutes(config, manifest) {
    const routes = [...(config.routes ?? [])];
    if (!routes.some((route) => route.handle === 'filesystem')) routes.push({ handle: 'filesystem' });

    /** @type {Record<string, { path?: string, contentType?: string }>} */
    const overrides = { ...(config.overrides ?? {}) };
    // Keep 404.html addressable by file name so the catch-all route (and Vercel's own 404.html convention) can serve it.
    delete overrides['404.html'];
    for (const file of manifest.markdownFiles) {
        overrides[file] = { ...(overrides[file] ?? {}), contentType: MARKDOWN_CONTENT_TYPE };
    }

    return {
        ...config,
        routes: [
            { src: '^/[^.]*$', middlewarePath: MIDDLEWARE_NAME, continue: true },
            ...routes,
            { src: '^/.*$', status: 404, dest: '/404.html', headers: { Vary: 'Accept' } }
        ],
        overrides
    };
}

/**
 * Emits the middleware as an edge function: its source modules, a build-time config, and the entrypoint.
 * @param {string} outputDir
 * @param {MiddlewareConfig} config
 */
function writeMiddleware(outputDir, config) {
    const functionDir = join(outputDir, 'functions', `${MIDDLEWARE_NAME}.func`);
    const sourceDir = dirname(fileURLToPath(import.meta.url));
    mkdirSync(functionDir, { recursive: true });

    writeFileSync(join(functionDir, '.vc-config.json'), JSON.stringify({ runtime: 'edge', entrypoint: 'index.js' }, null, '  '));
    for (const file of MIDDLEWARE_SOURCES) {
        copyFileSync(join(sourceDir, file), join(functionDir, file));
    }
    writeFileSync(join(functionDir, 'config.js'), `export default ${JSON.stringify(config, null, '  ')};\n`);
    writeFileSync(
        join(functionDir, 'index.js'),
        [
            "import config from './config.js';",
            "import { handleRequest } from './agent-middleware.js';",
            '',
            '/** @param {Request} request */',
            'export default function middleware(request) {',
            '    return handleRequest(request, config);',
            '}',
            ''
        ].join('\n')
    );
}

/**
 * Wraps a SvelteKit adapter so that, after it runs, the Vercel Build Output it produced gains the negotiation
 * middleware and routes. Does nothing when no Vercel config was written (for example a local, non-Vercel build).
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

            /** @param {string} name */
            const staticFile = (name) => readFileSync(join(outputDir, 'static', name), 'utf8');

            /** @type {VercelConfig} */
            const config = JSON.parse(readFileSync(configPath, 'utf8'));
            const markdownFiles = [...builder.prerendered.assets.keys()]
                .filter((path) => path.endsWith('.md'))
                .map((path) => path.replace(/^\//, ''));
            writeFileSync(configPath, JSON.stringify(addAgentRoutes(config, { markdownFiles }), null, '  '));

            writeMiddleware(outputDir, {
                siteUrl: SITE_URL,
                pages: [...builder.prerendered.pages.keys()].filter((path) => path !== '/404'),
                notFound: { html: staticFile('404.html'), markdown: staticFile('404.md') },
                notAcceptable: staticFile('406.txt')
            });

            builder.log?.minor?.(`Added the ${MIDDLEWARE_NAME} middleware and agent routes to ${outputDir}`);
        }
    };
}

import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { acceptPatterns } from './accept-patterns.js';
import { addAgentRoutes, withAgentRoutes, type VercelConfig, type VercelRoute } from './vercel-agent-routes.js';

const MARKDOWN_TYPE = 'text/markdown; charset=utf-8';

function baseConfig(): VercelConfig {
    return {
        version: 3,
        routes: [{ src: '/_app/immutable/.+', headers: { 'cache-control': 'public, immutable, max-age=31536000' } }, { handle: 'filesystem' }],
        overrides: {
            'index.html': { path: '' },
            'about.html': { path: 'about' },
            '404.html': { path: '404' },
            'components/button.html': { path: 'components/button' }
        }
    };
}

const manifest = {
    pages: ['/', '/about', '/404', '/components/button'],
    markdownFiles: ['index.md', 'about.md', '404.md', 'components/button.md', 'agents.md']
};

const prefersMarkdown = { type: 'header', key: 'accept', value: acceptPatterns.markdownAcceptable };
const unlessHtmlWins = acceptPatterns.htmlBeatsMarkdown.map((value) => ({ type: 'header', key: 'accept', value }));

function routesOf(config: VercelConfig): VercelRoute[] {
    return config.routes ?? [];
}

function filesystemIndex(routes: VercelRoute[]): number {
    return routes.findIndex((route) => 'handle' in route && route.handle === 'filesystem');
}

describe('addAgentRoutes', () => {
    const result = addAgentRoutes(baseConfig(), manifest);
    const routes = routesOf(result);
    const beforeFilesystem = routes.slice(0, filesystemIndex(routes));
    const afterFilesystem = routes.slice(filesystemIndex(routes) + 1);

    test('does not mutate the input config', () => {
        const input = baseConfig();
        addAgentRoutes(input, manifest);
        expect(input).toEqual(baseConfig());
    });

    test('emits no functions or middleware routes: the deployment stays static', () => {
        expect(routes.some((route) => 'middlewarePath' in route)).toBe(false);
    });

    test('redirects trailing-slash variants to the canonical path with a 301 before anything else', () => {
        expect(routes[0]).toEqual({ src: '^/(.+?)/+$', status: 301, headers: { Location: '/$1' } });
    });

    test('keeps the adapter routes, in order, ahead of the filesystem handler', () => {
        const original = routesOf(baseConfig()).slice(0, 1);
        const kept = beforeFilesystem.filter((route) => original.some((candidate) => JSON.stringify(candidate) === JSON.stringify(route)));
        expect(kept).toEqual(original);
    });

    test('adds Vary: Accept to every extension-less path', () => {
        expect(beforeFilesystem).toContainEqual({ src: '^/[^.]*$', headers: { Vary: 'Accept' }, continue: true });
    });

    test('advertises the Markdown alternate of each page with a Link header', () => {
        expect(beforeFilesystem).toContainEqual({
            src: '^/$',
            headers: { Link: '<https://bootstrap-svelte.vercel.app/index.md>; rel="alternate"; type="text/markdown"' },
            continue: true
        });
        expect(beforeFilesystem).toContainEqual({
            src: '^/(about|components/button)$',
            headers: { Link: '<https://bootstrap-svelte.vercel.app/$1.md>; rel="alternate"; type="text/markdown"' },
            continue: true
        });
    });

    test('returns 406 with an explanatory body when neither representation is acceptable', () => {
        const route = beforeFilesystem.find((candidate) => candidate.status === 406);
        expect(route).toEqual({
            src: '^/(?:about|components/button)?$',
            has: [{ type: 'header', key: 'accept', value: acceptPatterns.nonEmpty }],
            missing: [
                { type: 'header', key: 'accept', value: acceptPatterns.htmlAcceptable },
                { type: 'header', key: 'accept', value: acceptPatterns.markdownAcceptable }
            ],
            status: 406,
            dest: '/406.txt',
            headers: { Vary: 'Accept' }
        });
    });

    test('rewrites markdown-preferring requests for the home page to /index.md', () => {
        expect(beforeFilesystem).toContainEqual({ src: '^/$', has: [prefersMarkdown], missing: unlessHtmlWins, dest: '/index.md' });
    });

    test('rewrites markdown-preferring requests for pages to their .md sibling, excluding the 404 page', () => {
        expect(beforeFilesystem).toContainEqual({
            src: '^/(about|components/button)$',
            has: [prefersMarkdown],
            missing: unlessHtmlWins,
            dest: '/$1.md'
        });
    });

    test('evaluates the 406 route before the Markdown rewrites', () => {
        const notAcceptable = beforeFilesystem.findIndex((route) => route.status === 406);
        const rewrite = beforeFilesystem.findIndex((route) => route.dest === '/index.md');
        expect(notAcceptable).toBeGreaterThan(-1);
        expect(notAcceptable).toBeLessThan(rewrite);
    });

    test('serves negotiated 404 bodies once the filesystem misses', () => {
        expect(afterFilesystem).toEqual([
            { src: '^/.*$', has: [prefersMarkdown], missing: unlessHtmlWins, status: 404, dest: '/404.md', headers: { Vary: 'Accept' } },
            { src: '^/.*$', status: 404, dest: '/404.html', headers: { Vary: 'Accept' } }
        ]);
    });

    test('forces the Markdown content type on .md files and keeps 404.html addressable by file name', () => {
        expect(result.overrides?.['components/button.md']).toEqual({ contentType: MARKDOWN_TYPE });
        expect(result.overrides?.['agents.md']).toEqual({ contentType: MARKDOWN_TYPE });
        expect(result.overrides?.['404.html']).toBeUndefined();
        expect(result.overrides?.['about.html']).toEqual({ path: 'about' });
    });

    test('appends a filesystem handler when the adapter config has none', () => {
        const patched = routesOf(addAgentRoutes({ version: 3, routes: [] }, manifest));
        expect(filesystemIndex(patched)).toBeGreaterThan(0);
        expect(patched.slice(filesystemIndex(patched) + 1)).toHaveLength(2);
    });
});

describe('withAgentRoutes', () => {
    const builder = {
        prerendered: {
            pages: new Map([
                ['/', { file: 'index.html' }],
                ['/about', { file: 'about.html' }],
                ['/404', { file: '404.html' }]
            ]),
            assets: new Map([
                ['/index.md', { type: 'text/markdown' }],
                ['/about.md', { type: 'text/markdown' }],
                ['/404.md', { type: 'text/markdown' }],
                ['/llms.txt', { type: 'text/plain' }]
            ])
        }
    };

    test('patches the config written by the wrapped adapter without emitting functions', async () => {
        const outputDir = mkdtempSync(join(tmpdir(), 'agent-routes-'));
        const configPath = join(outputDir, 'config.json');
        let adapted = false;
        const base = {
            name: 'fake-adapter',
            adapt: async () => {
                adapted = true;
                writeFileSync(configPath, JSON.stringify(baseConfig()));
            }
        };

        const adapter = withAgentRoutes(base, { outputDir });
        await adapter.adapt(builder as never);

        expect(adapted).toBe(true);
        expect(adapter.name).toBe('fake-adapter');
        const written = JSON.parse(readFileSync(configPath, 'utf8')) as VercelConfig;
        expect(routesOf(written)).toContainEqual(expect.objectContaining({ dest: '/index.md' }));
        expect(routesOf(written)).toContainEqual(expect.objectContaining({ src: '^/(about)$', dest: '/$1.md' }));
        expect(written.overrides?.['about.md']).toEqual({ contentType: MARKDOWN_TYPE });
        expect(written.overrides?.['404.html']).toBeUndefined();
        expect(existsSync(join(outputDir, 'functions'))).toBe(false);
    });

    test('leaves non-Vercel builds alone when no config was written', async () => {
        const outputDir = mkdtempSync(join(tmpdir(), 'agent-routes-'));
        const adapter = withAgentRoutes({ name: 'fake-adapter', adapt: async () => {} }, { outputDir });

        await adapter.adapt(builder as never);

        expect(existsSync(join(outputDir, 'config.json'))).toBe(false);
    });
});

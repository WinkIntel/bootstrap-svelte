import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { addAgentRoutes, negotiate, withAgentRoutes, type VercelConfig, type VercelRoute } from './vercel-agent-routes.js';

const MARKDOWN_TYPE = 'text/markdown; charset=utf-8';

function baseConfig(): VercelConfig {
    return {
        version: 3,
        routes: [
            { src: '/about/', dest: '/about' },
            { src: '/about', status: 308, headers: { Location: '/about/' } },
            { src: '/_app/immutable/.+', headers: { 'cache-control': 'public, immutable, max-age=31536000' } },
            { handle: 'filesystem' }
        ],
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

    test('keeps the adapter routes, in order, ahead of the filesystem handler', () => {
        const original = routesOf(baseConfig()).slice(0, 3);
        const kept = beforeFilesystem.filter((route) => original.some((candidate) => JSON.stringify(candidate) === JSON.stringify(route)));
        expect(kept).toEqual(original);
        expect(filesystemIndex(routes)).toBeGreaterThan(2);
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

    test('rewrites markdown-preferring requests for the home page to /index.md', () => {
        const route = beforeFilesystem.find((candidate) => 'dest' in candidate && candidate.dest === '/index.md');
        expect(route).toMatchObject({ src: '^/$', dest: '/index.md' });
        expect(route?.has).toEqual([{ type: 'header', key: 'accept', value: expect.stringContaining('text/markdown') }]);
        expect(route?.missing).toHaveLength(2);
        expect(route?.check).toBeUndefined();
    });

    test('rewrites markdown-preferring requests for pages to their .md sibling, excluding the 404 page', () => {
        const route = beforeFilesystem.find((candidate) => 'dest' in candidate && candidate.dest === '/$1.md');
        expect(route).toMatchObject({ src: '^/(about|components/button)$', dest: '/$1.md' });
        expect(route?.has).toEqual([{ type: 'header', key: 'accept', value: expect.stringContaining('text/markdown') }]);
        expect(route?.missing).toHaveLength(2);
    });

    test('returns 406 with an explanatory body when nothing acceptable can be served', () => {
        const route = beforeFilesystem.find((candidate) => candidate.status === 406);
        expect(route).toMatchObject({ src: '^/(?:about|components/button)?$', status: 406, dest: '/406.txt', headers: { Vary: 'Accept' } });
        expect(route?.has).toEqual([{ type: 'header', key: 'accept' }]);
        expect(route?.missing).toEqual([{ type: 'header', key: 'accept', value: expect.stringContaining('text/html') }]);
    });

    test('serves negotiated 404 bodies once the filesystem misses', () => {
        expect(afterFilesystem).toHaveLength(2);
        expect(afterFilesystem[0]).toMatchObject({ src: '^/.*$', status: 404, dest: '/404.md', headers: { Vary: 'Accept' } });
        expect(afterFilesystem[0]?.has).toEqual([{ type: 'header', key: 'accept', value: expect.stringContaining('text/markdown') }]);
        expect(afterFilesystem[0]?.missing).toHaveLength(2);
        expect(afterFilesystem[1]).toEqual({ src: '^/.*$', status: 404, dest: '/404.html', headers: { Vary: 'Accept' } });
    });

    test('forces the Markdown content type on .md files and keeps 404.html addressable by file name', () => {
        expect(result.overrides?.['components/button.md']).toEqual({ contentType: MARKDOWN_TYPE });
        expect(result.overrides?.['agents.md']).toEqual({ contentType: MARKDOWN_TYPE });
        expect(result.overrides?.['404.html']).toBeUndefined();
        expect(result.overrides?.['about.html']).toEqual({ path: 'about' });
    });

    test('appends a filesystem handler when the adapter config has none', () => {
        const patched = addAgentRoutes({ version: 3, routes: [] }, manifest);
        const patchedRoutes = routesOf(patched);
        expect(filesystemIndex(patchedRoutes)).toBeGreaterThan(0);
        expect(patchedRoutes.slice(filesystemIndex(patchedRoutes) + 1)).toHaveLength(2);
    });
});

describe('negotiate (reference implementation of the routing rules)', () => {
    test.each([
        [null, 'html'],
        ['*/*', 'html'],
        ['text/html', 'html'],
        ['text/*', 'html'],
        ['text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'html'],
        ['text/markdown', 'markdown'],
        ['text/markdown, text/html;q=0.9', 'markdown'],
        ['text/markdown;q=0.9, text/html;q=0.8', 'markdown'],
        ['text/html;q=0.8, text/markdown;q=0.9', 'markdown'],
        ['text/html, text/markdown;q=0.9', 'html'],
        ['text/markdown;q=0', 'html'],
        ['text/markdown;q=0, */*', 'html'],
        ['text/markdown;q=0.0', 'html'],
        ['application/json', 'not-acceptable'],
        ['image/png', 'not-acceptable']
    ])('Accept: %s → %s', (accept, expected) => {
        expect(negotiate(accept)).toBe(expected);
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

    test('patches the config written by the wrapped adapter', async () => {
        const directory = mkdtempSync(join(tmpdir(), 'agent-routes-'));
        const configPath = join(directory, 'config.json');
        let adapted = false;
        const base = {
            name: 'fake-adapter',
            adapt: async () => {
                adapted = true;
                writeFileSync(configPath, JSON.stringify(baseConfig()));
            }
        };

        const adapter = withAgentRoutes(base, { configPath });
        await adapter.adapt(builder as never);

        expect(adapted).toBe(true);
        expect(adapter.name).toBe('fake-adapter');
        const written = JSON.parse(readFileSync(configPath, 'utf8')) as VercelConfig;
        expect(routesOf(written)).toContainEqual(expect.objectContaining({ dest: '/index.md' }));
        expect(routesOf(written)).toContainEqual(expect.objectContaining({ src: '^/(about)$', dest: '/$1.md' }));
        expect(written.overrides?.['about.md']).toEqual({ contentType: MARKDOWN_TYPE });
        expect(written.overrides?.['404.html']).toBeUndefined();
    });

    test('leaves non-Vercel builds alone when no config was written', async () => {
        const directory = mkdtempSync(join(tmpdir(), 'agent-routes-'));
        const configPath = join(directory, 'config.json');
        const adapter = withAgentRoutes({ name: 'fake-adapter', adapt: async () => {} }, { configPath });

        await adapter.adapt(builder as never);

        expect(existsSync(configPath)).toBe(false);
    });
});

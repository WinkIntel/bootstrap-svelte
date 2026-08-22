import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { MIDDLEWARE_NAME, addAgentRoutes, withAgentRoutes, type VercelConfig, type VercelRoute } from './vercel-agent-routes.js';

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

const manifest = { markdownFiles: ['index.md', 'about.md', '404.md', 'components/button.md', 'agents.md'] };

function routesOf(config: VercelConfig): VercelRoute[] {
    return config.routes ?? [];
}

function filesystemIndex(routes: VercelRoute[]): number {
    return routes.findIndex((route) => 'handle' in route && route.handle === 'filesystem');
}

describe('addAgentRoutes', () => {
    const result = addAgentRoutes(baseConfig(), manifest);
    const routes = routesOf(result);

    test('does not mutate the input config', () => {
        const input = baseConfig();
        addAgentRoutes(input, manifest);
        expect(input).toEqual(baseConfig());
    });

    test('routes every extension-less path through the negotiation middleware before anything else', () => {
        expect(routes[0]).toEqual({ src: '^/[^.]*$', middlewarePath: MIDDLEWARE_NAME, continue: true });
    });

    test('keeps the adapter routes, in order, ahead of the filesystem handler', () => {
        const original = routesOf(baseConfig()).slice(0, 3);
        expect(routes.slice(1, filesystemIndex(routes))).toEqual(original);
    });

    test('serves 404.html with a 404 status for anything the filesystem misses', () => {
        expect(routes.slice(filesystemIndex(routes) + 1)).toEqual([{ src: '^/.*$', status: 404, dest: '/404.html', headers: { Vary: 'Accept' } }]);
    });

    test('forces the Markdown content type on .md files and keeps 404.html addressable by file name', () => {
        expect(result.overrides?.['components/button.md']).toEqual({ contentType: MARKDOWN_TYPE });
        expect(result.overrides?.['agents.md']).toEqual({ contentType: MARKDOWN_TYPE });
        expect(result.overrides?.['404.html']).toBeUndefined();
        expect(result.overrides?.['about.html']).toEqual({ path: 'about' });
    });

    test('appends a filesystem handler when the adapter config has none', () => {
        const patched = routesOf(addAgentRoutes({ version: 3, routes: [] }, manifest));
        expect(filesystemIndex(patched)).toBe(1);
        expect(patched).toHaveLength(3);
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

    function fakeAdapter(outputDir: string, writeOutput: boolean) {
        return {
            name: 'fake-adapter',
            adapt: async () => {
                if (!writeOutput) return;
                mkdirSync(join(outputDir, 'static'), { recursive: true });
                writeFileSync(join(outputDir, 'config.json'), JSON.stringify(baseConfig()));
                writeFileSync(join(outputDir, 'static', '404.html'), '<h1>Page not found</h1>');
                writeFileSync(join(outputDir, 'static', '404.md'), '# Page not found\n');
                writeFileSync(join(outputDir, 'static', '406.txt'), '406 Not Acceptable\n');
            }
        };
    }

    test('patches the config written by the wrapped adapter and emits the middleware function', async () => {
        const outputDir = mkdtempSync(join(tmpdir(), 'agent-routes-'));
        const adapter = withAgentRoutes(fakeAdapter(outputDir, true), { outputDir });

        await adapter.adapt(builder as never);

        expect(adapter.name).toBe('fake-adapter');
        const written = JSON.parse(readFileSync(join(outputDir, 'config.json'), 'utf8')) as VercelConfig;
        expect(routesOf(written)[0]).toEqual({ src: '^/[^.]*$', middlewarePath: MIDDLEWARE_NAME, continue: true });
        expect(written.overrides?.['about.md']).toEqual({ contentType: MARKDOWN_TYPE });
        expect(written.overrides?.['404.html']).toBeUndefined();

        const functionDir = join(outputDir, 'functions', `${MIDDLEWARE_NAME}.func`);
        expect(JSON.parse(readFileSync(join(functionDir, '.vc-config.json'), 'utf8'))).toEqual({ runtime: 'edge', entrypoint: 'index.js' });
        for (const file of ['index.js', 'agent-middleware.js', 'accept-negotiation.js', 'site-url.js']) {
            expect(existsSync(join(functionDir, file)), file).toBe(true);
        }
        expect(readFileSync(join(functionDir, 'index.js'), 'utf8')).toMatch(/from '\.\/agent-middleware\.js'/);

        const configModule = readFileSync(join(functionDir, 'config.js'), 'utf8');
        expect(configModule.startsWith('export default ')).toBe(true);
        const middlewareConfig = JSON.parse(configModule.replace(/^export default /, '').replace(/;\s*$/, ''));
        expect(middlewareConfig).toEqual({
            siteUrl: 'https://bootstrap-svelte.vercel.app',
            pages: ['/', '/about'],
            notFound: { html: '<h1>Page not found</h1>', markdown: '# Page not found\n' },
            notAcceptable: '406 Not Acceptable\n'
        });
    });

    test('leaves non-Vercel builds alone when no config was written', async () => {
        const outputDir = mkdtempSync(join(tmpdir(), 'agent-routes-'));
        const adapter = withAgentRoutes(fakeAdapter(outputDir, false), { outputDir });

        await adapter.adapt(builder as never);

        expect(existsSync(join(outputDir, 'config.json'))).toBe(false);
        expect(existsSync(join(outputDir, 'functions'))).toBe(false);
    });
});

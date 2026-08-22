import { describe, expect, test } from 'vitest';
import { handleRequest, type MiddlewareConfig } from './agent-middleware.js';

const config: MiddlewareConfig = {
    siteUrl: 'https://bootstrap-svelte.vercel.app',
    pages: ['/', '/about', '/components/button'],
    notFound: { html: '<h1>Page not found</h1>', markdown: '# Page not found\n' },
    notAcceptable: '406 Not Acceptable\n'
};

function request(path: string, accept?: string): Request {
    return new Request(`https://example.test${path}`, { headers: accept === undefined ? {} : { accept } });
}

const ALTERNATE = '<https://bootstrap-svelte.vercel.app/components/button.md>; rel="alternate"; type="text/markdown"';

describe('handleRequest', () => {
    test('rewrites markdown-preferring requests to the .md sibling and advertises the alternate', async () => {
        const response = await handleRequest(request('/components/button?x=1', 'text/markdown, text/html;q=0.9'), config);
        expect(response.status).toBe(200);
        expect(response.headers.get('x-middleware-rewrite')).toBe('https://example.test/components/button.md?x=1');
        expect(response.headers.get('x-middleware-next')).toBeNull();
        expect(response.headers.get('vary')).toBe('Accept');
        expect(response.headers.get('link')).toBe(ALTERNATE);
    });

    test('maps the home page to /index.md', async () => {
        const response = await handleRequest(request('/', 'text/markdown'), config);
        expect(response.headers.get('x-middleware-rewrite')).toBe('https://example.test/index.md');
        expect(response.headers.get('link')).toBe('<https://bootstrap-svelte.vercel.app/index.md>; rel="alternate"; type="text/markdown"');
    });

    test('lets HTML-preferring requests continue with Vary and Link headers', async () => {
        const response = await handleRequest(request('/components/button', 'text/html;q=0.9, text/markdown;q=0.5'), config);
        expect(response.headers.get('x-middleware-next')).toBe('1');
        expect(response.headers.get('x-middleware-rewrite')).toBeNull();
        expect(response.headers.get('vary')).toBe('Accept');
        expect(response.headers.get('link')).toBe(ALTERNATE);
    });

    test('treats a missing Accept header as an HTML request', async () => {
        const response = await handleRequest(request('/about'), config);
        expect(response.headers.get('x-middleware-next')).toBe('1');
        expect(response.headers.get('vary')).toBe('Accept');
    });

    test('returns 406 with an explanatory body when nothing acceptable is listed', async () => {
        const response = await handleRequest(request('/components/button', 'text/markdown;q=0, application/json'), config);
        expect(response.status).toBe(406);
        expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
        expect(response.headers.get('vary')).toBe('Accept');
        expect(await response.text()).toBe('406 Not Acceptable\n');
    });

    test('returns a Markdown 404 body for unknown paths that prefer Markdown', async () => {
        const response = await handleRequest(request('/does-not-exist', 'text/markdown'), config);
        expect(response.status).toBe(404);
        expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
        expect(response.headers.get('vary')).toBe('Accept');
        expect(response.headers.get('link')).toBeNull();
        expect(await response.text()).toBe('# Page not found\n');
    });

    test('returns an HTML 404 body for unknown paths otherwise', async () => {
        const response = await handleRequest(request('/does-not-exist'), config);
        expect(response.status).toBe(404);
        expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
        expect(await response.text()).toBe('<h1>Page not found</h1>');
    });

    test('treats /404 itself as an unknown path', async () => {
        expect((await handleRequest(request('/404'), config)).status).toBe(404);
    });

    test('redirects trailing-slash variants to the canonical path, keeping the query string', async () => {
        const response = await handleRequest(request('/about/?x=1', 'text/markdown'), config);
        expect(response.status).toBe(308);
        expect(response.headers.get('location')).toBe('https://example.test/about?x=1');
    });

    test('collapses repeated trailing slashes and never redirects the root path', async () => {
        expect((await handleRequest(request('/components/button///'), config)).headers.get('location')).toBe(
            'https://example.test/components/button'
        );
        expect((await handleRequest(request('/'), config)).status).toBe(200);
    });

    test('continues without negotiation for paths that have a file extension', async () => {
        const response = await handleRequest(request('/og-image.png', 'text/markdown'), config);
        expect(response.headers.get('x-middleware-next')).toBe('1');
        expect(response.headers.get('x-middleware-rewrite')).toBeNull();
        expect(response.headers.get('vary')).toBeNull();
        expect(response.headers.get('link')).toBeNull();
    });
});

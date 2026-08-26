import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { crawlStaticBuild } from './static-crawl.js';

const SITE_URL = 'https://bootstrap-svelte.vercel.app';
const TEST_ROUTES = ['/', '/components/button'];

type JsonLdObject = Record<string, unknown>;

type HtmlOptions = {
    breadcrumbNav?: boolean;
    breadcrumbList?: JsonLdObject[] | null;
};

function pageName(title: string): string {
    return title.replace(' | Bootstrap Svelte', '');
}

function defaultBreadcrumbList(path: string, title: string): JsonLdObject[] | null {
    if (path === '/') return null;
    return [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Bootstrap Svelte',
            item: `${SITE_URL}/`
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: pageName(title),
            item: `${SITE_URL}${path}`
        }
    ];
}

function breadcrumbNav(path: string, title: string): string {
    return `<nav class="wk-breadcrumbs" aria-label="Breadcrumb">
<ol>
<li><a href="/">Bootstrap Svelte</a></li>
<li><span aria-current="page">${pageName(title)}</span></li>
</ol>
</nav>`;
}

function html(path: string, title: string, description: string, options: HtmlOptions = {}): string {
    const url = `${SITE_URL}${path}`;
    const breadcrumbList = options.breadcrumbList === undefined ? defaultBreadcrumbList(path, title) : options.breadcrumbList;
    const graph: JsonLdObject[] = [{ '@type': 'WebPage', url }];
    if (breadcrumbList) {
        graph.push({ '@type': 'BreadcrumbList', itemListElement: breadcrumbList });
    }

    return `<!doctype html>
<html lang="en">
<head>
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<link rel="alternate" type="text/markdown" href="${url === `${SITE_URL}/` ? `${SITE_URL}/index.md` : `${url}.md`}">
<meta property="og:url" content="${url}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
</head>
<body>
${(options.breadcrumbNav ?? path !== '/') ? breadcrumbNav(path, title) : ''}
<main><h1>${pageName(title)}</h1></main>
</body>
</html>`;
}

async function writeFixtureFile(root: string, path: string, content: string): Promise<void> {
    const fullPath = join(root, path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content);
}

async function createStaticBuild(taskId: string, overrides: Partial<Record<'homeHtml' | 'buttonHtml', string>> = {}): Promise<string> {
    const root = join('/tmp', `bootstrap-svelte-crawl-${process.pid}-${taskId.replace(/\W/g, '-')}`);
    await writeFixtureFile(
        root,
        'sitemap.xml',
        [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            '<url><loc>https://bootstrap-svelte.vercel.app/</loc></url>',
            '<url><loc>https://bootstrap-svelte.vercel.app/components/button</loc></url>',
            '</urlset>'
        ].join('\n')
    );
    await writeFixtureFile(root, 'index.html', overrides.homeHtml ?? html('/', 'Home | Bootstrap Svelte', 'Home description'));
    await writeFixtureFile(root, 'index.md', '# Home\n');
    await writeFixtureFile(
        root,
        'components/button/index.html',
        overrides.buttonHtml ?? html('/components/button', 'Button | Bootstrap Svelte', 'Button description')
    );
    await writeFixtureFile(root, 'components/button.md', '# Button\n');
    return root;
}

async function crawlFixture(root: string) {
    return crawlStaticBuild({
        buildDir: root,
        routes: TEST_ROUTES,
        siteUrl: SITE_URL
    });
}

describe('static crawl checks', () => {
    test('accepts complete unique static output for indexable routes', async ({ task }) => {
        const root = await createStaticBuild(task.id);

        const result = await crawlFixture(root);

        expect(result.errors).toEqual([]);
        expect(result.pages).toHaveLength(2);
    });

    test('requires visible semantic breadcrumb navigation on non-home routes', async ({ task }) => {
        const root = await createStaticBuild(task.id, {
            buttonHtml: html('/components/button', 'Button | Bootstrap Svelte', 'Button description', { breadcrumbNav: false })
        });

        const result = await crawlFixture(root);

        expect(result.errors).toEqual(expect.arrayContaining(['/components/button is missing visible breadcrumb navigation']));
    });

    test('requires BreadcrumbList JSON-LD on non-home routes', async ({ task }) => {
        const root = await createStaticBuild(task.id, {
            buttonHtml: html('/components/button', 'Button | Bootstrap Svelte', 'Button description', { breadcrumbList: null })
        });

        const result = await crawlFixture(root);

        expect(result.errors).toEqual(expect.arrayContaining(['/components/button is missing BreadcrumbList JSON-LD']));
    });

    test('rejects malformed BreadcrumbList item positions and relative item URLs', async ({ task }) => {
        const root = await createStaticBuild(task.id, {
            buttonHtml: html('/components/button', 'Button | Bootstrap Svelte', 'Button description', {
                breadcrumbList: [
                    { '@type': 'ListItem', position: 1, name: 'Bootstrap Svelte', item: `${SITE_URL}/` },
                    { '@type': 'ListItem', position: 3, name: 'Button', item: '/components/button' }
                ]
            })
        });

        const result = await crawlFixture(root);

        expect(result.errors).toEqual(
            expect.arrayContaining([
                '/components/button BreadcrumbList item 2 position 3 should be 2',
                '/components/button BreadcrumbList item 2 item URL /components/button must be absolute'
            ])
        );
    });

    test('keeps the home page breadcrumb-free', async ({ task }) => {
        const root = await createStaticBuild(task.id, {
            homeHtml: html('/', 'Home | Bootstrap Svelte', 'Home description', {
                breadcrumbNav: true,
                breadcrumbList: [{ '@type': 'ListItem', position: 1, name: 'Bootstrap Svelte', item: `${SITE_URL}/` }]
            })
        });

        const result = await crawlFixture(root);

        expect(result.errors).toEqual(
            expect.arrayContaining(['/ must not include visible breadcrumb navigation', '/ must not include BreadcrumbList JSON-LD'])
        );
    });

    test('rejects visible breadcrumb-like containers on the home page even without semantic nav', async ({ task }) => {
        const root = await createStaticBuild(task.id, {
            homeHtml: html('/', 'Home | Bootstrap Svelte', 'Home description', { breadcrumbNav: false }).replace(
                '<main>',
                '<div class="wk-breadcrumbs"><span>Home</span><span>/</span><span>Overview</span></div><main>'
            )
        });

        const result = await crawlFixture(root);

        expect(result.errors).toEqual(expect.arrayContaining(['/ must not include visible breadcrumb navigation']));
    });
});

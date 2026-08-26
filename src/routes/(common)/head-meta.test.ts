import { describe, expect, test } from 'vitest';
import { buildHeadMeta } from './head-meta.js';
import { site } from './site.js';

type Node = Record<string, unknown>;

function graph(pathname: string): Node[] {
    const parsed = JSON.parse(buildHeadMeta(pathname).jsonLd) as { '@context': string; '@graph': Node[] };
    expect(parsed['@context']).toBe('https://schema.org');
    return parsed['@graph'];
}

function node(pathname: string, type: string): Node {
    const found = graph(pathname).find((candidate) => candidate['@type'] === type);
    if (!found) throw new Error(`missing ${type}`);
    return found;
}

describe('buildHeadMeta', () => {
    test('home page leads with the brand and has a canonical URL with a trailing slash', () => {
        const meta = buildHeadMeta('/');
        expect(meta.title).toBe('Bootstrap 5 components for Svelte 5 | Bootstrap Svelte');
        expect(meta.description).toBe(site.description);
        expect(meta.canonical).toBe('https://bootstrap-svelte.vercel.app/');
        expect(meta.markdownUrl).toBe('https://bootstrap-svelte.vercel.app/index.md');
        expect(meta.robots).toBeUndefined();
    });

    test('provides Open Graph and Twitter card metadata', () => {
        const meta = buildHeadMeta('/');
        expect(meta.ogType).toBe('website');
        expect(meta.siteName).toBe('Bootstrap Svelte');
        expect(meta.ogImage).toBe('https://bootstrap-svelte.vercel.app/og-image.png');
        expect(meta.ogImageAlt).toContain('Bootstrap Svelte');
        expect(meta.twitterCard).toBe('summary_large_image');
    });

    test('documentation pages use their own title and a canonical URL without a trailing slash', () => {
        const meta = buildHeadMeta('/components/button');
        expect(meta.title).toBe('Svelte 5 Button Component - Bootstrap 5 | Bootstrap Svelte');
        expect(meta.canonical).toBe('https://bootstrap-svelte.vercel.app/components/button');
        expect(meta.markdownUrl).toBe('https://bootstrap-svelte.vercel.app/components/button.md');
    });

    test('the 404 page is noindex and has no canonical or Markdown alternate', () => {
        const meta = buildHeadMeta('/404');
        expect(meta.robots).toBe('noindex, nofollow');
        expect(meta.canonical).toBeUndefined();
        expect(meta.markdownUrl).toBeUndefined();
    });

    test('unknown paths are noindex with the 404 title and no canonical or Markdown alternate', () => {
        const meta = buildHeadMeta('/does-not-exist');
        expect(meta.title).toBe('Page not found | Bootstrap Svelte');
        expect(meta.robots).toBe('noindex, nofollow');
        expect(meta.canonical).toBeUndefined();
        expect(meta.markdownUrl).toBeUndefined();
    });

    test('JSON-LD describes the website, the software, the organization, and the page', () => {
        const types = graph('/').map((candidate) => candidate['@type']);
        expect(types).toEqual(expect.arrayContaining(['WebSite', 'SoftwareApplication', 'Organization', 'WebPage']));
    });

    test('JSON-LD describes breadcrumbs for non-home indexable pages', () => {
        const breadcrumb = node('/components/button', 'BreadcrumbList');
        expect(breadcrumb.itemListElement).toEqual([
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Bootstrap Svelte',
                item: 'https://bootstrap-svelte.vercel.app/'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Button',
                item: 'https://bootstrap-svelte.vercel.app/components/button'
            }
        ]);
    });

    test('the SoftwareApplication node carries identity, licensing, download, and offer details', () => {
        const software = node('/', 'SoftwareApplication');
        expect(software).toMatchObject({
            name: 'Bootstrap Svelte',
            alternateName: '@winkintel/bootstrap-svelte',
            url: 'https://bootstrap-svelte.vercel.app/',
            description: site.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            softwareVersion: site.version,
            license: 'https://www.apache.org/licenses/LICENSE-2.0',
            downloadUrl: 'https://www.npmjs.com/package/@winkintel/bootstrap-svelte',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
        });
        expect(software.sameAs).toEqual(expect.arrayContaining([site.repositoryUrl, site.npmUrl]));
        expect(software.author).toEqual({ '@id': 'https://bootstrap-svelte.vercel.app/#organization' });
    });

    test('the Organization node has a postal address, contact points, and sameAs links', () => {
        const organization = node('/', 'Organization');
        expect(organization).toMatchObject({
            '@id': 'https://bootstrap-svelte.vercel.app/#organization',
            name: 'Wink, Inc.',
            alternateName: 'WinkIntel',
            url: 'https://www.winkintel.com/',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '5 Greenwood Terrace',
                addressLocality: 'Des Moines',
                addressRegion: 'IA',
                postalCode: '50312',
                addressCountry: 'US'
            }
        });
        expect(organization.contactPoint).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ '@type': 'ContactPoint', contactType: 'customer service', telephone: '+1-855-275-9465' }),
                expect.objectContaining({ '@type': 'ContactPoint', contactType: 'technical support', url: site.issuesUrl })
            ])
        );
        expect(organization.sameAs).toEqual(expect.arrayContaining(['https://github.com/WinkIntel']));
    });

    test('the WebPage node links the page to the site and the software', () => {
        const page = node('/components/button', 'WebPage');
        expect(page).toMatchObject({
            url: 'https://bootstrap-svelte.vercel.app/components/button',
            name: 'Svelte 5 Button Component - Bootstrap 5 | Bootstrap Svelte',
            isPartOf: { '@id': 'https://bootstrap-svelte.vercel.app/#website' },
            about: { '@id': 'https://bootstrap-svelte.vercel.app/#software' }
        });
    });

    test('JSON-LD is safe to inline in a script element', () => {
        expect(buildHeadMeta('/').jsonLd).not.toContain('<');
    });
});

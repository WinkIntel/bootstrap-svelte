import { absoluteUrl, findPage, getBreadcrumbs, getPageMeta, markdownPath, normalizePathname, site } from './site.js';

export type HeadMeta = {
    title: string;
    description: string;
    /** Absent on the 404 page and on paths that are not site pages. */
    canonical?: string;
    /** URL of the Markdown representation of the page, when it has one. */
    markdownUrl?: string;
    robots?: string;
    ogType: 'website';
    siteName: string;
    ogImage: string;
    ogImageAlt: string;
    twitterCard: 'summary_large_image';
    /** Serialized JSON-LD `@graph`, safe to inline in a `<script type="application/ld+json">`. */
    jsonLd: string;
};

const WEBSITE_ID = `${site.url}/#website`;
const SOFTWARE_ID = `${site.url}/#software`;
const ORGANIZATION_ID = `${site.url}/#organization`;

function structuredData(pathname: string, pageUrl: string, title: string, description: string): string {
    const breadcrumbs = getBreadcrumbs(pathname);
    const graph: Record<string, unknown>[] = [
        {
            '@type': 'WebSite',
            '@id': WEBSITE_ID,
            url: `${site.url}/`,
            name: site.name,
            description: site.description,
            inLanguage: 'en',
            publisher: { '@id': ORGANIZATION_ID }
        },
        {
            '@type': 'SoftwareApplication',
            '@id': SOFTWARE_ID,
            name: site.name,
            alternateName: site.packageName,
            description: site.description,
            url: `${site.url}/`,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            softwareVersion: site.version,
            programmingLanguage: ['TypeScript', 'Svelte'],
            license: site.license.url,
            downloadUrl: site.npmUrl,
            installUrl: site.npmUrl,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            author: { '@id': ORGANIZATION_ID },
            sameAs: [site.repositoryUrl, site.npmUrl]
        },
        {
            '@type': 'Organization',
            '@id': ORGANIZATION_ID,
            name: site.organization.name,
            alternateName: site.organization.alternateName,
            url: site.organization.url,
            logo: absoluteUrl('/favicon.png'),
            address: { '@type': 'PostalAddress', ...site.organization.address },
            contactPoint: [
                { '@type': 'ContactPoint', contactType: 'customer service', telephone: site.organization.telephone, url: site.organization.url },
                { '@type': 'ContactPoint', contactType: 'technical support', url: site.issuesUrl }
            ],
            sameAs: [...site.organization.sameAs]
        },
        {
            '@type': 'WebPage',
            '@id': pageUrl,
            url: pageUrl,
            name: title,
            description,
            inLanguage: 'en',
            isPartOf: { '@id': WEBSITE_ID },
            about: { '@id': SOFTWARE_ID }
        }
    ];

    if (breadcrumbs.length > 0) {
        graph.push({
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((breadcrumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: breadcrumb.label,
                ...(breadcrumb.href ? { item: absoluteUrl(breadcrumb.href) } : {})
            }))
        });
    }

    // "<" is escaped so the JSON can never terminate the <script> element it is inlined in.
    return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

/** Everything the layout needs to describe a page to browsers, social cards, search engines, and agents. */
export function buildHeadMeta(requestedPathname: string): HeadMeta {
    const pathname = normalizePathname(requestedPathname);
    const meta = getPageMeta(pathname);
    const indexable = findPage(pathname) !== undefined && !meta.noindex;
    const canonical = indexable ? absoluteUrl(pathname) : undefined;

    return {
        title: meta.title,
        description: meta.description,
        canonical,
        markdownUrl: indexable ? absoluteUrl(markdownPath(pathname)) : undefined,
        robots: meta.noindex ? 'noindex, nofollow' : undefined,
        ogType: 'website',
        siteName: site.name,
        ogImage: absoluteUrl('/og-image.png'),
        ogImageAlt: `${site.name} — ${site.tagline}`,
        twitterCard: 'summary_large_image',
        jsonLd: structuredData(pathname, canonical ?? absoluteUrl(pathname), meta.title, meta.description)
    };
}

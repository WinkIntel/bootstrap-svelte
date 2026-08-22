import routeJson from './routes.json' with { type: 'json' };
import { markdownPath, SITE_URL } from './site-url.js';
import type { RouteType } from './types.js';

export type SitePage = {
    href: string;
    label: string;
    section: string;
    description?: string;
};

export type PageMeta = {
    label: string;
    section: string;
    title: string;
    description: string;
    noindex: boolean;
};

/** Facts about the site, the package, and the maintaining organization. Single source of truth for metadata, JSON-LD, llms.txt, and the sitemap. */
export const site = {
    name: 'Bootstrap Svelte',
    tagline: 'Bootstrap 5 components for Svelte 5',
    packageName: '@winkintel/bootstrap-svelte',
    version: __PACKAGE_VERSION__,
    url: SITE_URL,
    description: 'Bootstrap components for Svelte 5 with TypeScript support, live examples, and package-local documentation.',
    license: { name: 'Apache-2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0' },
    repositoryUrl: 'https://github.com/WinkIntel/bootstrap-svelte',
    issuesUrl: 'https://github.com/WinkIntel/bootstrap-svelte/issues',
    securityPolicyUrl: 'https://github.com/WinkIntel/bootstrap-svelte/security/policy',
    npmUrl: 'https://www.npmjs.com/package/@winkintel/bootstrap-svelte',
    organization: {
        name: 'Wink, Inc.',
        alternateName: 'WinkIntel',
        url: 'https://www.winkintel.com/',
        githubUrl: 'https://github.com/WinkIntel',
        telephone: '+1-855-275-9465',
        address: {
            streetAddress: '5 Greenwood Terrace',
            addressLocality: 'Des Moines',
            addressRegion: 'IA',
            postalCode: '50312',
            addressCountry: 'US'
        },
        sameAs: [
            'https://github.com/WinkIntel',
            'https://www.linkedin.com/company/wink-incorporated',
            'https://twitter.com/WinkIntel',
            'https://www.facebook.com/WinkIntel'
        ]
    }
} as const;

export const homePage: SitePage = { href: '/', label: 'Overview', section: 'Home' };

/** Trust-anchor pages that live outside the component navigation. */
export const projectPages: SitePage[] = [
    {
        href: '/about',
        label: 'About',
        section: 'Project',
        description: 'What Bootstrap Svelte is, who maintains it, how it is licensed, and how the documentation site is built and published.'
    },
    {
        href: '/contact',
        label: 'Contact',
        section: 'Project',
        description:
            'How to reach the Bootstrap Svelte maintainers: GitHub issues for bugs and features, private security reporting, and Wink, Inc. contact details.'
    },
    {
        href: '/privacy',
        label: 'Privacy',
        section: 'Project',
        description:
            'Privacy notice for the Bootstrap Svelte documentation site: what is and is not collected, third-party resources, and local storage use.'
    }
];

export const notFoundPage: SitePage = {
    href: '/404',
    label: 'Page not found',
    section: 'Project',
    description:
        'The requested page does not exist on the Bootstrap Svelte documentation site. Links to the documentation index, sitemap, and machine-readable resources.'
};

const navigationPages: SitePage[] = (routeJson as RouteType[]).flatMap((section) =>
    section.items.map((item) => ({ href: item.href, label: item.label, section: section.section }))
);

/** Every indexable page on the site, home page first. The 404 page is deliberately excluded. */
export function sitePages(): SitePage[] {
    return [homePage, ...navigationPages, ...projectPages];
}

export function findPage(pathname: string): SitePage | undefined {
    if (pathname === notFoundPage.href) return notFoundPage;
    return sitePages().find((page) => page.href === pathname);
}

/** Drops trailing slashes so `/about/` resolves like `/about`. */
export function normalizePathname(pathname: string): string {
    return pathname.replace(/\/+$/, '') || '/';
}

/**
 * Metadata for the page at `pathname`. Unknown paths are served with the 404 page, which then hydrates at the
 * requested URL, so they carry the 404 page's metadata.
 */
export function getPageMeta(pathname: string): PageMeta {
    const page = findPage(normalizePathname(pathname)) ?? notFoundPage;
    const description = page.description ?? site.description;
    const noindex = page.href === notFoundPage.href;

    if (page.href === homePage.href) {
        return { label: page.label, section: page.section, title: `${site.name} | ${site.tagline}`, description, noindex };
    }

    return { label: page.label, section: page.section, title: `${page.label} | ${site.name}`, description, noindex };
}

export function absoluteUrl(path: string): string {
    return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export { markdownPath };

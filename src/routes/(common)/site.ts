import routeJson from './routes.json' with { type: 'json' };
import { markdownPath, SITE_URL } from './site-url.js';
import type { RouteType } from './types.js';

export type SitePage = {
    href: string;
    label: string;
    section: string;
    title?: string;
    description?: string;
    noindex?: boolean;
};

export type PageMeta = {
    label: string;
    section: string;
    title: string;
    description: string;
    noindex: boolean;
};

export type Breadcrumb = {
    section: string;
    label: string;
    href?: string;
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
    installCommand: 'pnpm add @winkintel/bootstrap-svelte bootstrap',
    sveltePeerRange: '^5.29.0',
    bootstrapCssImport: "import 'bootstrap/dist/css/bootstrap.min.css';",
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

const navigationDescriptions: Record<string, Pick<SitePage, 'title' | 'description'>> = {
    '/theming': {
        title: 'Theme Bootstrap 5 Components with Svelte 5 | Bootstrap Svelte',
        description: 'Configure Bootstrap 5 CSS, Sass variables, CSS variables, and color modes for Bootstrap Svelte components in Svelte 5 apps.'
    },
    '/guides/sveltekit-bootstrap-5': {
        title: 'Use Bootstrap 5 with SvelteKit and Svelte 5 | Bootstrap Svelte',
        description:
            'Install Bootstrap Svelte in SvelteKit, add required Bootstrap CSS or optional SCSS, and use typed Svelte 5 examples for buttons, navbars, forms, and modals.'
    },
    '/guides/compare-sveltestrap': {
        title: 'Bootstrap Svelte vs Sveltestrap for Svelte 5 | Bootstrap Svelte',
        description:
            'Compare Bootstrap Svelte and Sveltestrap by Svelte version support, TypeScript API style, Bootstrap assets, component coverage, SSR evidence, and project fit.'
    },
    '/layout/breakpoint': {
        title: 'Svelte 5 Breakpoint Utilities - Bootstrap 5 | Bootstrap Svelte',
        description: 'Detect Bootstrap 5 responsive breakpoints in Svelte 5 with typed helpers for adaptive layouts and component behavior.'
    },
    '/layout/container': {
        title: 'Svelte 5 Container Layout - Bootstrap 5 | Bootstrap Svelte',
        description: 'Use Bootstrap 5 containers in Svelte 5 with typed props for fixed, fluid, and breakpoint-specific responsive layout widths.'
    },
    '/layout/grid': {
        title: 'Bootstrap 5 Grid with Svelte 5 | Bootstrap Svelte',
        description: 'Build responsive Bootstrap 5 grids in Svelte 5 with Container, Row, and Col examples that preserve Bootstrap class behavior.'
    },
    '/layout/columns': {
        title: 'Responsive Columns with Bootstrap 5 and Svelte 5 | Bootstrap Svelte',
        description: 'Compose responsive Bootstrap 5 columns in Svelte 5 using typed Row and Col APIs for alignment, gutters, ordering, and offsets.'
    },
    '/components/accordion': {
        title: 'Svelte 5 Accordion Component - Bootstrap 5 | Bootstrap Svelte',
        description: 'Create Bootstrap 5 accordions in Svelte 5 with typed items, collapse state, keyboard-friendly markup, and accessible headings.'
    },
    '/components/alert': {
        title: 'Svelte 5 Alert Component - Bootstrap 5 | Bootstrap Svelte',
        description: 'Show Bootstrap 5 alerts in Svelte 5 with typed color variants, dismissible behavior, and live examples for status messaging.'
    },
    '/components/badge': {
        title: 'Svelte 5 Badge Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Add Bootstrap 5 badges to Svelte 5 interfaces with typed variants, pill styling, heading examples, and positioned notification marks.'
    },
    '/components/breadcrumb': {
        title: 'Svelte 5 Breadcrumb Component - Bootstrap 5 | Bootstrap Svelte',
        description: 'Render Bootstrap 5 breadcrumbs in Svelte 5 with semantic navigation markup, active items, dividers, and accessible page trails.'
    },
    '/components/button': {
        title: 'Svelte 5 Button Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Use Bootstrap 5 buttons in Svelte 5 with typed variants, sizes, outline styles, disabled states, links, and loading-friendly events.'
    },
    '/components/button-group': {
        title: 'Svelte 5 Button Group Component - Bootstrap 5 | Bootstrap Svelte',
        description: 'Group Bootstrap 5 buttons in Svelte 5 with typed toolbar, sizing, vertical layout, radio, and checkbox-style control examples.'
    },
    '/components/card': {
        title: 'Svelte 5 Card Component - Bootstrap 5 | Bootstrap Svelte',
        description: 'Compose Bootstrap 5 cards in Svelte 5 with typed Header, Body, Footer, Title, Text, image, and layout sub-components.'
    },
    '/components/carousel': {
        title: 'Svelte 5 Carousel Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Build Bootstrap 5 carousels in Svelte 5 with typed slides, controls, indicators, captions, autoplay options, and SSR-safe state.'
    },
    '/components/close-button': {
        title: 'Svelte 5 Close Button Component - Bootstrap 5 | Bootstrap Svelte',
        description: 'Use Bootstrap 5 close buttons in Svelte 5 with typed disabled, white variant, aria-label, and event handling examples.'
    },
    '/components/collapse': {
        title: 'Svelte 5 Collapse Component - Bootstrap 5 | Bootstrap Svelte',
        description: 'Toggle Bootstrap 5 collapse regions in Svelte 5 with typed shown state, transition events, and accessible trigger patterns.'
    },
    '/components/dropdown': {
        title: 'Svelte 5 Dropdown Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Create Bootstrap 5 dropdowns in Svelte 5 with typed toggles, menus, items, dividers, alignment, keyboard behavior, and Popper positioning.'
    },
    '/components/list-group': {
        title: 'Svelte 5 List Group Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Render Bootstrap 5 list groups in Svelte 5 with typed items, links, buttons, active states, badges, and flush or numbered styles.'
    },
    '/components/modal': {
        title: 'Svelte 5 Modal Component - Accessible Bootstrap 5 Modal | Bootstrap Svelte',
        description: 'Open Bootstrap 5 modals in Svelte 5 with typed shown state, focus handling, backdrops, dialogs, headers, bodies, and footers.'
    },
    '/components/nav': {
        title: 'Svelte 5 Nav Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Build Bootstrap 5 navs in Svelte 5 with typed links, tabs, pills, fills, justified layouts, active state, and keyboard-ready markup.'
    },
    '/components/navbar': {
        title: 'Responsive Svelte 5 Navbar - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Assemble responsive Bootstrap 5 navbars in Svelte 5 with brand, collapse, toggler, nav links, containers, and offcanvas-friendly structure.'
    },
    '/components/offcanvas': {
        title: 'Svelte 5 Offcanvas Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Show Bootstrap 5 offcanvas panels in Svelte 5 with typed placement, backdrop, scroll, focus, header, body, and dismissal behavior.'
    },
    '/components/pagination': {
        title: 'Svelte 5 Pagination Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Create Bootstrap 5 pagination in Svelte 5 with typed page items, previous and next controls, active states, disabled states, and sizing.'
    },
    '/components/placeholder': {
        title: 'Svelte 5 Placeholder Component - Bootstrap 5 | Bootstrap Svelte',
        description: 'Display Bootstrap 5 placeholders in Svelte 5 with typed glow, wave, sizing, color, and loading skeleton composition examples.'
    },
    '/components/popover': {
        title: 'Svelte 5 Popover Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Attach Bootstrap 5 popovers in Svelte 5 with typed triggers, placement, titles, body content, Popper positioning, and SSR-aware behavior.'
    },
    '/components/progress': {
        title: 'Svelte 5 Progress Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Render Bootstrap 5 progress bars in Svelte 5 with typed values, labels, colors, stripes, animation, stacking, and accessibility attributes.'
    },
    '/components/scrollspy': {
        title: 'Svelte 5 Scrollspy Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Track Bootstrap 5 scrollspy navigation in Svelte 5 with typed targets, offsets, active links, and section-aware documentation examples.'
    },
    '/components/spinner': {
        title: 'Svelte 5 Spinner Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Show Bootstrap 5 spinners in Svelte 5 with typed border and grow styles, sizes, colors, accessibility labels, and loading states.'
    },
    '/components/tab': {
        title: 'Svelte 5 Tab Component - Bootstrap 5 | Bootstrap Svelte',
        description: 'Build Bootstrap 5 tabs in Svelte 5 with typed lists, panels, active state, keyboard interaction, and accessible tab markup.'
    },
    '/components/table': {
        title: 'Svelte 5 Table Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Compose Bootstrap 5 tables in Svelte 5 with typed head, body, foot, rows, cells, captions, responsive wrappers, and variant classes.'
    },
    '/components/toast': {
        title: 'Svelte 5 Toast Component - Bootstrap 5 | Bootstrap Svelte',
        description: 'Display Bootstrap 5 toasts in Svelte 5 with typed headers, bodies, autohide timing, live regions, and dismissal behavior.'
    },
    '/components/tooltip': {
        title: 'Svelte 5 Tooltip Component - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Add Bootstrap 5 tooltips in Svelte 5 with typed triggers, placement, Popper positioning, accessible labels, and SSR-safe rendering.'
    },
    '/form/form-controls': {
        title: 'Svelte 5 Form Controls - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Use Bootstrap 5 form controls in Svelte 5 with typed inputs, textarea, select, checks, radios, switches, ranges, and validation classes.'
    },
    '/form/form-input-group': {
        title: 'Svelte 5 Input Groups - Bootstrap 5 | Bootstrap Svelte',
        description:
            'Compose Bootstrap 5 input groups in Svelte 5 with typed addons, buttons, text, sizing, validation feedback, and accessible labels.'
    },
    '/form/form-layout': {
        title: 'Svelte 5 Form Layout - Bootstrap 5 | Bootstrap Svelte',
        description: 'Lay out Bootstrap 5 forms in Svelte 5 with typed rows, columns, floating labels, horizontal forms, gutters, and helper text.'
    },
    '/form/form-validation': {
        title: 'Bootstrap 5 Form Validation with Svelte 5 | Bootstrap Svelte',
        description:
            'Implement Bootstrap 5 form validation in Svelte 5 with typed controls, feedback messages, invalid and valid states, and submit handling.'
    }
};

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
    section.items.map((item) => ({ href: item.href, label: item.label, section: section.section, ...navigationDescriptions[item.href] }))
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
    const noindex = page.href === notFoundPage.href || page.noindex === true;

    if (page.href === homePage.href) {
        return { label: page.label, section: page.section, title: `${site.tagline} | ${site.name}`, description, noindex };
    }

    return { label: page.label, section: page.section, title: page.title ?? `${page.label} | ${site.name}`, description, noindex };
}

export function absoluteUrl(path: string): string {
    return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getBreadcrumbs(pathname: string): Breadcrumb[] {
    const page = findPage(normalizePathname(pathname));
    if (!page || page.href === homePage.href || page.href === notFoundPage.href || page.noindex) return [];
    return [
        { label: site.name, href: homePage.href, section: homePage.section },
        { label: page.label, href: page.href, section: page.section }
    ];
}

export { markdownPath };

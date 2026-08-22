import type { RenderedPage } from './markdown/render-page.js';
import { absoluteUrl, markdownPath, site, type SitePage } from './site.js';

export type PageSummary = SitePage & { lead: string };

export type SitemapEntry = { href: string; lastmod: string };

const INSTALL_COMMAND = 'pnpm add @winkintel/bootstrap-svelte bootstrap';
const CSS_IMPORT = "import 'bootstrap/dist/css/bootstrap.min.css';";

const LLMS_SECTION_TITLES: Record<string, string> = { Home: 'Start here' };

const WHEN_TO_USE = [
    "You are building a Svelte 5 (runes) or SvelteKit application on Bootstrap 5 CSS and want typed, composable components instead of hand-written Bootstrap markup and Bootstrap's JavaScript plugins.",
    "You are porting a Bootstrap-based interface or team to Svelte 5 and want to keep Bootstrap's class names, color variants, grid, and utilities.",
    'You need forms, tables, modals, offcanvas panels, dropdowns, navigation, tabs, toasts, tooltips, and popovers that render safely on the server and hydrate in Svelte 5.'
];

const WHEN_NOT_TO_USE = [
    'Svelte 4 or earlier: the peer dependency is `svelte ^5.29`.',
    "Tailwind, shadcn-style copy-in components, or fully custom design systems: this package follows Bootstrap's design language on purpose.",
    "Pages that also load Bootstrap's own JavaScript bundle: the components replace it, so do not load both."
];

const HOW_TO_USE = [
    `Install the package together with Bootstrap CSS: \`${INSTALL_COMMAND}\`. The package does not bundle CSS, so import Bootstrap once in your app entry (\`${CSS_IMPORT}\`) or include it through your Sass pipeline.`,
    "Import components from the package root: `import { Button, Card, Modal } from '@winkintel/bootstrap-svelte'`. Most components are compound (`<Card.Header>`, `<Modal.Dialog>`, `<Dropdown.Item>`); `Alert`, `Badge`, `Button`, and `Spinner` are standalone.",
    'Props are typed. Import public types such as `ButtonProps` or `ModalProps` from the package, and read each component page for its props table, CSS classes, and accessibility notes.'
];

function groupBySection(pages: PageSummary[]): Map<string, PageSummary[]> {
    const groups = new Map<string, PageSummary[]>();
    for (const page of pages) {
        const group = groups.get(page.section) ?? [];
        group.push(page);
        groups.set(page.section, group);
    }
    return groups;
}

function bulletList(items: string[]): string[] {
    return items.map((item) => `- ${item}`);
}

/** The llms.txt index (https://llmstxt.org): H1, blockquote summary, heading-free guidance, then H2 file lists. */
export function buildLlmsTxt(pages: PageSummary[]): string {
    const lines: string[] = [
        `# ${site.name}`,
        '',
        `> ${site.tagline} with TypeScript support, published on npm as \`${site.packageName}\` (version ${site.version}, ${site.license.name}). This site is the component documentation and live showcase; every page is also available as Markdown.`,
        '',
        `${site.name} is maintained by ${site.organization.name} (${site.organization.alternateName}). Source code and issue tracker: ${site.repositoryUrl}. Package: ${site.npmUrl}.`,
        '',
        `**When to use ${site.name}:**`,
        '',
        ...bulletList(WHEN_TO_USE),
        '',
        '**When not to use it:**',
        '',
        ...bulletList(WHEN_NOT_TO_USE),
        '',
        '**How to use it:**',
        '',
        ...bulletList(HOW_TO_USE),
        '',
        '**How to read this site as an agent:**',
        '',
        ...bulletList([
            `Request any page with \`Accept: text/markdown\` to receive Markdown from the same URL, or append \`.md\` to its path (the home page is ${absoluteUrl('/index.md')}).`,
            `${absoluteUrl('/llms-full.txt')} contains every page in one file, ${absoluteUrl('/agents.md')} contains integration instructions, and ${absoluteUrl('/sitemap.xml')} lists every URL with last-modified dates.`,
            'Paths that do not exist return HTTP 404 with a Markdown body that links back to this index.'
        ]),
        ''
    ];

    for (const [section, sectionPages] of groupBySection(pages)) {
        lines.push(`## ${LLMS_SECTION_TITLES[section] ?? section}`, '');
        for (const page of sectionPages) {
            const note = page.lead || page.description || site.description;
            lines.push(`- [${page.label}](${absoluteUrl(markdownPath(page.href))}): ${note}`);
        }
        lines.push('');
    }

    lines.push(
        '## Optional',
        '',
        `- [Full documentation in one file](${absoluteUrl('/llms-full.txt')}): every page of this site concatenated as Markdown`,
        `- [Agent instructions](${absoluteUrl('/agents.md')}): when to use the library, installation, and composition rules`,
        `- [Sitemap](${absoluteUrl('/sitemap.xml')}): XML sitemap with last-modified dates`,
        `- [README](${site.repositoryUrl}#readme): package README on GitHub`,
        `- [Changelog](${site.repositoryUrl}/blob/main/CHANGELOG.md): release notes`,
        ''
    );

    return lines.join('\n');
}

/** A standalone instruction file for agents that integrate the library into a project. */
export function buildAgentsMd(): string {
    const usageExample = `<script>
    import { Button, Card, Modal } from '@winkintel/bootstrap-svelte';

    let showModal = $state(false);
</script>

<Card>
    <Card.Header>
        <Card.Title>Getting started</Card.Title>
    </Card.Header>
    <Card.Body>
        <Card.Text>Bootstrap markup, Svelte 5 ergonomics.</Card.Text>
        <Button colorVariant="primary" onclick={() => (showModal = true)}>Open modal</Button>
    </Card.Body>
</Card>

<Modal isShown={showModal}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>Modal content goes here.</Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => (showModal = false)}>Close</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal>`;

    return [
        `# ${site.name} — agent instructions`,
        '',
        `> How an AI agent or developer tool should decide whether to use \`${site.packageName}\` and how to integrate it. Documentation index: ${absoluteUrl('/llms.txt')}.`,
        '',
        '## What it is',
        '',
        `${site.name} (\`${site.packageName}\`, version ${site.version}) provides ${site.tagline.toLowerCase()} in runes mode with TypeScript types. It follows Bootstrap's design language and class conventions while exposing Svelte-native component APIs. It is maintained by ${site.organization.name} and licensed under ${site.license.name}.`,
        '',
        '## When to use',
        '',
        ...bulletList(WHEN_TO_USE),
        '',
        '## When not to use',
        '',
        ...bulletList(WHEN_NOT_TO_USE),
        '',
        '## How to use',
        '',
        ...HOW_TO_USE.map((item, index) => `${index + 1}. ${item}`),
        '',
        '```svelte',
        usageExample,
        '```',
        '',
        '## Conventions',
        '',
        ...bulletList([
            'Appearance props follow Bootstrap names: `colorVariant="primary"`, `size="sm"`, `isPill`, `isDismissible`, `isShown`, `isStriped`.',
            'Every component accepts `class` for additional CSS classes and most expose `elementRef` for the underlying DOM element.',
            'Compound components share state through context; keep sub-components inside their `Root` (for example `Dropdown.Toggle` and `Dropdown.Menu` inside `Dropdown.Root`).',
            'Wrap inline `Dropdown.Root` usage with `class="d-inline-block"` so the menu gets a positioning box.',
            'Consumers own Bootstrap CSS: theme with Bootstrap Sass variables, CSS variables, or `data-bs-theme`.'
        ]),
        '',
        '## Documentation for agents',
        '',
        ...bulletList([
            `${absoluteUrl('/llms.txt')}: index of every page with one-line summaries.`,
            `${absoluteUrl('/llms-full.txt')}: every page in a single Markdown file.`,
            `Any page URL with \`Accept: text/markdown\`, or with \`.md\` appended (for example ${absoluteUrl('/components/button.md')}): the Markdown version of that page, including its props table.`,
            `${absoluteUrl('/sitemap.xml')}: XML sitemap with last-modified dates.`
        ]),
        '',
        '## Support',
        '',
        ...bulletList([
            `Bugs, feature requests, and API feedback: ${site.issuesUrl}`,
            `Security reports: ${site.securityPolicyUrl}`,
            `Source code and README: ${site.repositoryUrl}`
        ]),
        ''
    ].join('\n');
}

export function buildRobotsTxt(): string {
    return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`;
}

function escapeXml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/** A sitemaps.org sitemap; `lastmod` values are expected to be W3C datetime strings. */
export function buildSitemapXml(entries: SitemapEntry[]): string {
    const urls = entries.map((entry) => `<url><loc>${escapeXml(absoluteUrl(entry.href))}</loc><lastmod>${escapeXml(entry.lastmod)}</lastmod></url>`);
    return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join(
        '\n'
    );
}

/** Every page concatenated into one Markdown document. */
export function buildLlmsFullTxt(pages: RenderedPage[]): string {
    const header = [
        `# ${site.name} — full documentation`,
        '',
        `> Every page of ${site.url} as Markdown (${site.packageName} ${site.version}). Index with one-line summaries: ${absoluteUrl('/llms.txt')}.`,
        ''
    ];
    const body = pages.map((page) => `---\n\n${page.markdown.trim()}\n`);
    return `${[...header, ...body].join('\n')}`;
}

/** Body of the 406 response for requests whose Accept header lists nothing this site can serve. */
export function buildNotAcceptableTxt(): string {
    return [
        '406 Not Acceptable',
        '',
        'This resource is available in the following representations. Retry with an Accept header that includes one of them:',
        '',
        '- text/html (default for browsers)',
        '- text/markdown (Markdown for AI agents; also available by appending .md to the path)',
        '',
        `Documentation index: ${absoluteUrl('/llms.txt')}`,
        ''
    ].join('\n');
}

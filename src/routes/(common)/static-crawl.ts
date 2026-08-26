import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { markdownPath, site, sitePages } from './site.js';

export type StaticCrawlOptions = {
    buildDir: string;
    routes: string[];
    siteUrl: string;
};

export type StaticCrawlPage = {
    href: string;
    title: string;
    description: string;
};

export type StaticCrawlResult = {
    pages: StaticCrawlPage[];
    errors: string[];
};

type JsonLdObject = Record<string, unknown>;

async function htmlPath(buildDir: string, href: string): Promise<string> {
    if (href === '/') return join(buildDir, 'index.html');
    const directoryPath = join(buildDir, href, 'index.html');
    if (await exists(directoryPath)) return directoryPath;
    return join(buildDir, `${href}.html`);
}

function markdownBuildPath(buildDir: string, href: string): string {
    return join(buildDir, markdownPath(href));
}

function matchContent(html: string, pattern: RegExp): string | undefined {
    return pattern.exec(html)?.[1]?.trim();
}

function allJsonLd(html: string): unknown[] {
    return Array.from(html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)).map((match) =>
        JSON.parse(match[1] ?? '')
    );
}

function countMatches(html: string, pattern: RegExp): number {
    return Array.from(html.matchAll(pattern)).length;
}

function isObject(value: unknown): value is JsonLdObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function jsonLdObjects(values: unknown[]): JsonLdObject[] {
    const queue = [...values];
    const objects: JsonLdObject[] = [];

    while (queue.length > 0) {
        const value = queue.shift();
        if (Array.isArray(value)) {
            queue.push(...value);
            continue;
        }
        if (!isObject(value)) continue;
        objects.push(value);
        if (Array.isArray(value['@graph'])) queue.push(...value['@graph']);
    }

    return objects;
}

function hasType(node: JsonLdObject, type: string): boolean {
    const nodeType = node['@type'];
    return nodeType === type || (Array.isArray(nodeType) && nodeType.includes(type));
}

function displayValue(value: unknown): string {
    if (value === undefined) return 'missing';
    if (typeof value === 'string') return value;
    return JSON.stringify(value) ?? String(value);
}

function attributeValue(attributes: string, name: string): string | undefined {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = new RegExp(`\\b${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(attributes);
    return match?.[1] ?? match?.[2] ?? match?.[3];
}

function isVisiblyHidden(attributes: string): boolean {
    const className = attributeValue(attributes, 'class')?.toLowerCase() ?? '';
    const style = attributeValue(attributes, 'style')?.toLowerCase() ?? '';
    const ariaHidden = attributeValue(attributes, 'aria-hidden')?.toLowerCase() === 'true';

    return (
        /(?:^|\s)hidden(?:\s|=|$)/i.test(attributes) ||
        ariaHidden ||
        /(?:^|\s)(?:d-none|visually-hidden|sr-only)(?:\s|$)/.test(className) ||
        /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden)\b/.test(style)
    );
}

function hasVisibleSemanticBreadcrumbNav(html: string): boolean {
    return Array.from(html.matchAll(/<nav\b([^>]*)>([\s\S]*?)<\/nav>/gi)).some((match) => {
        const attributes = match[1] ?? '';
        const body = match[2] ?? '';
        const ariaLabel = attributeValue(attributes, 'aria-label');

        return (
            !isVisiblyHidden(attributes) &&
            ariaLabel !== undefined &&
            /breadcrumb/i.test(ariaLabel) &&
            /<ol\b/i.test(body) &&
            countMatches(body, /<li\b/gi) >= 2 &&
            /\baria-current\s*=\s*(?:"page"|'page'|page)/i.test(body)
        );
    });
}

function hasVisibleBreadcrumbContainer(html: string): boolean {
    return Array.from(html.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)).some((match) => {
        const attributes = match[2] ?? '';
        const className = attributeValue(attributes, 'class')?.toLowerCase() ?? '';

        return /(?:^|\s)wk-breadcrumbs(?:\s|$)/.test(className) && !isVisiblyHidden(attributes);
    });
}

function isAbsoluteHttpUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
}

function validateBreadcrumbItemUrl(href: string, index: number, value: unknown, siteUrl: string, errors: string[]): void {
    if (typeof value !== 'string') {
        errors.push(`${href} BreadcrumbList item ${index} item URL ${displayValue(value)} must be absolute`);
        return;
    }
    if (!isAbsoluteHttpUrl(value)) {
        errors.push(`${href} BreadcrumbList item ${index} item URL ${value} must be absolute`);
        return;
    }

    const expectedOrigin = new URL(siteUrl).origin;
    if (new URL(value).origin !== expectedOrigin) {
        errors.push(`${href} BreadcrumbList item ${index} item URL ${value} must stay on ${expectedOrigin}`);
    }
}

function validateBreadcrumbList(href: string, expectedUrl: string, siteUrl: string, jsonLd: unknown[], errors: string[]): void {
    const breadcrumbLists = jsonLdObjects(jsonLd).filter((node) => hasType(node, 'BreadcrumbList'));

    if (href === '/') {
        if (breadcrumbLists.length > 0) errors.push('/ must not include BreadcrumbList JSON-LD');
        return;
    }

    if (breadcrumbLists.length === 0) {
        errors.push(`${href} is missing BreadcrumbList JSON-LD`);
        return;
    }

    for (const breadcrumbList of breadcrumbLists) {
        const items = breadcrumbList.itemListElement;
        if (!Array.isArray(items) || items.length < 2) {
            errors.push(`${href} BreadcrumbList itemListElement must contain at least two ListItem entries`);
            continue;
        }

        for (const [index, item] of items.entries()) {
            const position = index + 1;
            if (!isObject(item)) {
                errors.push(`${href} BreadcrumbList item ${position} must be a ListItem object`);
                continue;
            }
            if (!hasType(item, 'ListItem')) {
                errors.push(`${href} BreadcrumbList item ${position} @type ${displayValue(item['@type'])} should be ListItem`);
            }
            if (item.position !== position) {
                errors.push(`${href} BreadcrumbList item ${position} position ${displayValue(item.position)} should be ${position}`);
            }
            if (typeof item.name !== 'string' || item.name.trim().length === 0) {
                errors.push(`${href} BreadcrumbList item ${position} must have a non-empty name`);
            }
            validateBreadcrumbItemUrl(href, position, item.item, siteUrl, errors);
        }

        const firstItem = items[0];
        const lastItem = items[items.length - 1];
        const homeUrl = `${siteUrl}/`;
        if (isObject(firstItem) && firstItem.item !== homeUrl) {
            errors.push(`${href} BreadcrumbList first item should be ${homeUrl}`);
        }
        if (isObject(lastItem) && lastItem.item !== expectedUrl) {
            errors.push(`${href} BreadcrumbList current page item should be ${expectedUrl}`);
        }
    }
}

async function exists(path: string): Promise<boolean> {
    try {
        await readFile(path);
        return true;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
        throw error;
    }
}

export async function crawlStaticBuild(options: StaticCrawlOptions): Promise<StaticCrawlResult> {
    const errors: string[] = [];
    const pages: StaticCrawlPage[] = [];
    const sitemap = await readFile(join(options.buildDir, 'sitemap.xml'), 'utf8').catch(() => {
        errors.push('sitemap.xml is missing');
        return '';
    });
    const sitemapUrls = new Set(Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]));

    for (const href of options.routes) {
        const expectedUrl = `${options.siteUrl}${href}`;
        const path = await htmlPath(options.buildDir, href);
        const html = await readFile(path, 'utf8').catch(() => {
            errors.push(`${href} is missing HTML output at ${path}`);
            return '';
        });
        if (!html) continue;

        const title = matchContent(html, /<title>([\s\S]*?)<\/title>/i) ?? '';
        const description = matchContent(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ?? '';
        const canonical = matchContent(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
        const ogUrl = matchContent(html, /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
        const markdownUrl = matchContent(html, /<link\s+rel=["']alternate["']\s+type=["']text\/markdown["']\s+href=["']([^"']+)["']/i);
        const robots = matchContent(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
        const hasBreadcrumbNav = hasVisibleSemanticBreadcrumbNav(html);
        const hasBreadcrumbContainer = hasVisibleBreadcrumbContainer(html);

        if (!title) errors.push(`${href} is missing a title`);
        if (!description) errors.push(`${href} is missing a meta description`);
        if (countMatches(html, /<h1\b/gi) !== 1) errors.push(`${href} must contain exactly one h1`);
        if (canonical !== expectedUrl) errors.push(`${href} canonical ${canonical || 'missing'} does not match ${expectedUrl}`);
        if (ogUrl !== expectedUrl) errors.push(`${href} og:url ${ogUrl || 'missing'} does not match ${expectedUrl}`);
        if (!sitemapUrls.has(expectedUrl)) errors.push(`${href} is missing from sitemap.xml`);
        if (robots?.toLowerCase().includes('noindex')) errors.push(`${href} has an accidental noindex robots tag`);
        if (markdownUrl !== `${options.siteUrl}${markdownPath(href)}`)
            errors.push(`${href} Markdown alternate ${markdownUrl || 'missing'} is incorrect`);
        if (!(await exists(markdownBuildPath(options.buildDir, href)))) errors.push(`${href} Markdown output is missing`);
        if (href === '/') {
            if (hasBreadcrumbContainer) errors.push('/ must not include visible breadcrumb navigation');
        } else if (!hasBreadcrumbNav) {
            errors.push(`${href} is missing visible breadcrumb navigation`);
        }

        let jsonLd: unknown[] = [];
        try {
            jsonLd = allJsonLd(html);
            if (jsonLd.length === 0) errors.push(`${href} is missing JSON-LD`);
        } catch (error) {
            errors.push(`${href} has invalid JSON-LD: ${(error as Error).message}`);
        }
        validateBreadcrumbList(href, expectedUrl, options.siteUrl, jsonLd, errors);

        pages.push({ href, title, description });
    }

    const duplicateTitles = findDuplicates(pages.map((page) => page.title).filter(Boolean));
    const duplicateDescriptions = findDuplicates(pages.map((page) => page.description).filter(Boolean));
    for (const title of duplicateTitles) errors.push(`duplicate title: ${title}`);
    for (const description of duplicateDescriptions) errors.push(`duplicate meta description: ${description}`);

    return { pages, errors };
}

function findDuplicates(values: string[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const value of values) {
        if (seen.has(value)) duplicates.add(value);
        seen.add(value);
    }
    return [...duplicates];
}

export async function crawlDefaultStaticBuild(buildDir = '.vercel/output/static'): Promise<StaticCrawlResult> {
    return crawlStaticBuild({ buildDir, routes: sitePages().map((page) => page.href), siteUrl: site.url });
}

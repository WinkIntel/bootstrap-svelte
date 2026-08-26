import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function firstExisting(paths) {
    for (const path of paths) {
        try {
            await access(path);
            return path;
        } catch {
            // Try the next adapter-static output location.
        }
    }
    return paths[0];
}

const buildDir = process.argv[2] ?? (await firstExisting(['.vercel/output/static', 'build']));
const siteUrl = 'https://bootstrap-svelte.vercel.app';

const routeJson = JSON.parse(await readFile('src/routes/(common)/routes.json', 'utf8'));
const projectPages = ['/about', '/contact', '/privacy'];
const routes = ['/', ...routeJson.flatMap((section) => section.items.map((item) => item.href)), ...projectPages];
const errors = [];
const pages = [];

async function htmlPath(href) {
    if (href === '/') return join(buildDir, 'index.html');
    const directoryPath = join(buildDir, href, 'index.html');
    if (await readOptional(directoryPath)) return directoryPath;
    return join(buildDir, `${href}.html`);
}

function markdownPath(href) {
    return href === '/' ? '/index.md' : `${href}.md`;
}

function markdownBuildPath(href) {
    return join(buildDir, markdownPath(href));
}

function matchContent(html, pattern) {
    return pattern.exec(html)?.[1]?.trim();
}

function countMatches(html, pattern) {
    return Array.from(html.matchAll(pattern)).length;
}

function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function jsonLdObjects(values) {
    const queue = [...values];
    const objects = [];

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

function hasType(node, type) {
    const nodeType = node['@type'];
    return nodeType === type || (Array.isArray(nodeType) && nodeType.includes(type));
}

function displayValue(value) {
    if (value === undefined) return 'missing';
    if (typeof value === 'string') return value;
    return JSON.stringify(value) ?? String(value);
}

function attributeValue(attributes, name) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = new RegExp(`\\b${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(attributes);
    return match?.[1] ?? match?.[2] ?? match?.[3];
}

function isVisiblyHidden(attributes) {
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

function hasVisibleSemanticBreadcrumbNav(html) {
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

function hasVisibleBreadcrumbContainer(html) {
    return Array.from(html.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)).some((match) => {
        const attributes = match[2] ?? '';
        const className = attributeValue(attributes, 'class')?.toLowerCase() ?? '';

        return /(?:^|\s)wk-breadcrumbs(?:\s|$)/.test(className) && !isVisiblyHidden(attributes);
    });
}

function isAbsoluteHttpUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
}

function validateBreadcrumbItemUrl(href, index, value) {
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

function validateBreadcrumbList(href, expectedUrl, jsonLd) {
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
            validateBreadcrumbItemUrl(href, position, item.item);
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

async function readOptional(path) {
    try {
        return await readFile(path, 'utf8');
    } catch (error) {
        if (error?.code === 'ENOENT') return undefined;
        throw error;
    }
}

function findDuplicates(values) {
    const seen = new Set();
    const duplicates = new Set();
    for (const value of values.filter(Boolean)) {
        if (seen.has(value)) duplicates.add(value);
        seen.add(value);
    }
    return [...duplicates];
}

const sitemap = (await readOptional(join(buildDir, 'sitemap.xml'))) ?? '';
if (!sitemap) errors.push('sitemap.xml is missing');
const sitemapUrls = new Set(Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]));

for (const href of routes) {
    const expectedUrl = `${siteUrl}${href}`;
    const path = await htmlPath(href);
    const html = await readOptional(path);
    if (!html) {
        errors.push(`${href} is missing HTML output at ${path}`);
        continue;
    }

    const title = matchContent(html, /<title>([\s\S]*?)<\/title>/i) ?? '';
    const description = matchContent(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ?? '';
    const canonical = matchContent(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    const ogUrl = matchContent(html, /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
    const alternate = matchContent(html, /<link\s+rel=["']alternate["']\s+type=["']text\/markdown["']\s+href=["']([^"']+)["']/i);
    const robots = matchContent(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
    const jsonLdScripts = Array.from(html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
    const hasBreadcrumbNav = hasVisibleSemanticBreadcrumbNav(html);
    const hasBreadcrumbContainer = hasVisibleBreadcrumbContainer(html);

    if (!title) errors.push(`${href} is missing a title`);
    if (!description) errors.push(`${href} is missing a meta description`);
    if (countMatches(html, /<h1\b/gi) !== 1) errors.push(`${href} must contain exactly one h1`);
    if (canonical !== expectedUrl) errors.push(`${href} canonical ${canonical || 'missing'} does not match ${expectedUrl}`);
    if (ogUrl !== expectedUrl) errors.push(`${href} og:url ${ogUrl || 'missing'} does not match ${expectedUrl}`);
    if (!sitemapUrls.has(expectedUrl)) errors.push(`${href} is missing from sitemap.xml`);
    if (robots?.toLowerCase().includes('noindex')) errors.push(`${href} has an accidental noindex robots tag`);
    if (alternate !== `${siteUrl}${markdownPath(href)}`) errors.push(`${href} Markdown alternate ${alternate || 'missing'} is incorrect`);
    if (!(await readOptional(markdownBuildPath(href)))) errors.push(`${href} Markdown output is missing`);
    if (href === '/') {
        if (hasBreadcrumbContainer) errors.push('/ must not include visible breadcrumb navigation');
    } else if (!hasBreadcrumbNav) {
        errors.push(`${href} is missing visible breadcrumb navigation`);
    }

    if (jsonLdScripts.length === 0) errors.push(`${href} is missing JSON-LD`);
    const jsonLd = [];
    for (const script of jsonLdScripts) {
        try {
            jsonLd.push(JSON.parse(script[1] ?? ''));
        } catch (error) {
            errors.push(`${href} has invalid JSON-LD: ${error.message}`);
        }
    }
    validateBreadcrumbList(href, expectedUrl, jsonLd);

    pages.push({ href, title, description });
}

for (const title of findDuplicates(pages.map((page) => page.title))) errors.push(`duplicate title: ${title}`);
for (const description of findDuplicates(pages.map((page) => page.description))) errors.push(`duplicate meta description: ${description}`);

if (errors.length > 0) {
    console.error(['Static crawl failed:', ...errors.map((error) => `- ${error}`)].join('\n'));
    process.exit(1);
}

console.log(`Static crawl passed for ${pages.length} indexable routes.`);

import type { Component } from 'svelte';
import { render } from 'svelte/server';
import { absoluteUrl, findPage, site } from '../site.js';
import { extractLead, htmlToMarkdown } from './html-to-markdown.js';

export type RenderedPage = {
    href: string;
    title: string;
    lead: string;
    markdown: string;
};

const pageModules = import.meta.glob<{ default: Component }>('/src/routes/**/+page.svelte');

/** Page sections that only make sense interactively and are omitted from the Markdown representation. */
const SKIPPED_SECTIONS = ['#playground'];
const PLAYGROUND_HEADING = /playground/i;

function moduleKey(href: string): string {
    return href === '/' ? '/src/routes/+page.svelte' : `/src/routes${href}/+page.svelte`;
}

function collapseWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}

/** Removes interactive playgrounds, which are recognised by their heading rather than by a stable id. */
function stripPlaygrounds(root: Element): void {
    for (const heading of Array.from(root.querySelectorAll('h1, h2, h3, h4, h5, h6'))) {
        if (!PLAYGROUND_HEADING.test(heading.textContent ?? '')) continue;
        (heading.closest('section, .card, article') ?? heading.parentElement)?.remove();
    }
}

/** Inside an example card the live demo duplicates the code sample, so only prose and the code are kept. */
function stripLiveDemos(root: Element): void {
    for (const body of Array.from(root.querySelectorAll('.card-body'))) {
        if (!body.querySelector('.wk-code-example')) continue;
        for (const child of Array.from(body.children)) {
            if (child.tagName === 'DIV' && !child.classList.contains('wk-code-example') && !child.querySelector('.wk-code-example')) child.remove();
        }
    }
}

/**
 * Server-renders a showcase page (without the docs chrome) and converts it to Markdown.
 * The result is headed by the page title, its lead paragraph, and a pointer back to the canonical HTML page.
 */
export async function renderPageMarkdown(href: string): Promise<RenderedPage> {
    const page = findPage(href);
    const load = pageModules[moduleKey(href)];
    if (!page || !load) throw new Error(`Unknown page: ${href}`);

    const { default: component } = await load();
    const { body } = render(component);
    const { JSDOM } = await import('jsdom');
    const root = new JSDOM(body).window.document.body;

    const canonical = absoluteUrl(href);
    const heading = root.querySelector('[data-page-title], h1');
    const title = collapseWhitespace(heading?.textContent ?? '') || page.label;
    const lead = extractLead(root);
    const leadElement = root.querySelector('p.lead');
    const leadMarkdown = leadElement ? collapseWhitespace(htmlToMarkdown(leadElement, { baseUrl: canonical })) : '';
    const rule = leadElement?.nextElementSibling;

    heading?.remove();
    if (rule?.tagName === 'HR') rule.remove();
    leadElement?.remove();
    stripPlaygrounds(root);
    stripLiveDemos(root);

    const content = htmlToMarkdown(root, { baseUrl: canonical, skip: SKIPPED_SECTIONS });
    const header = [
        `# ${title}`,
        leadMarkdown ? `> ${leadMarkdown}` : '',
        `Source: ${canonical} — part of the ${site.name} documentation (index: ${absoluteUrl('/llms.txt')}).`
    ].filter((part) => part.length > 0);

    return { href, title, lead, markdown: `${header.join('\n\n')}\n\n${content}`.trim() + '\n' };
}

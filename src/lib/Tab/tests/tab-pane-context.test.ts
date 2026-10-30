import type { ComponentProps } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import TabPaneContextTest from './tab-pane-context-test.svelte';

const renderHtml = (props: ComponentProps<typeof TabPaneContextTest>) => render(TabPaneContextTest, { props }).body;
const paneContent = (html: string) => html.slice(html.indexOf('role="tabpanel"'));

describe('server-rendered Tab.Pane content context', () => {
    it.each([
        { scenario: 'bare-tab-nav-link', tag: 'button' },
        { scenario: 'bare-nav-link', tag: 'a' },
        { scenario: 'outer-nav-root', tag: 'a' },
        { scenario: 'strip-wrapped-pane', tag: 'a' }
    ] as const)('renders $scenario in a pane without tab semantics', ({ scenario, tag }) => {
        const content = paneContent(renderHtml({ scenario }));
        expect(content).toMatch(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?Next`));
        expect(content).not.toContain('role="tab"');
        expect(content).not.toContain('role="presentation"');
        expect(content).not.toContain('aria-selected');
        expect(content).not.toContain('aria-controls');
    });

    it.each([undefined, null, 'tablist'] as const)('renders Tab.NavLink under a pane Nav.Root with role %s', (paneNavRole) => {
        const content = paneContent(renderHtml({ paneNavRole, scenario: 'pane-nav-tab-nav-link' }));
        const nav = content.match(/<ul\b[^>]*data-testid="pane-nav"[^>]*>/)?.[0];
        expect(nav).toBeDefined();
        if (paneNavRole) {
            expect(nav).toContain(`role="${paneNavRole}"`);
        } else {
            expect(nav).not.toContain('role=');
        }
        expect(content).toContain('data-tab-pane-id="#step-two"');
        expect(content).not.toContain('role="tab"');
        expect(content).not.toContain('role="presentation"');
        expect(content).not.toContain('aria-selected');
    });

    it('renders Nav.Link under a pane Nav.Root as ordinary navigation', () => {
        const content = paneContent(renderHtml({ scenario: 'pane-nav-link' }));
        expect(content).toContain('Section');
        expect(content).not.toContain('role="tab"');
        expect(content).not.toContain('aria-selected');
        expect(content).not.toContain('aria-controls');
    });

    it('renders a Tab.Pane nested in a Tab.Pane against the real Tab root', () => {
        expect(renderHtml({ scenario: 'nested-pane' })).toContain('First step');
    });

    it('binds nested tabs to their own strip', () => {
        const html = renderHtml({ scenario: 'nested-tab-root' });
        expect(html.match(/role="tablist"/g)).toHaveLength(2);
        expect(html).toContain('Inner next');
    });

    it.each(['opted-out-outer-strip', 'pane-nav-nested-tab-root'] as const)('resets strip semantics for the nested Tab.Root in %s', (scenario) => {
        const html = renderHtml({ scenario });
        const content = html.slice(html.indexOf('<nav'));
        expect(content.slice(0, content.indexOf('>'))).not.toContain('role=');
        expect(content).toMatch(/<li\b[^>]*role="presentation"[^>]*>[\s\S]*?<a\b[^>]*role="tab"/);
    });
});

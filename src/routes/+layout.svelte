<script lang="ts">
    import { page } from '$app/state';
    import { onMount, type Snippet } from 'svelte';
    import routeJson from './(common)/routes.json' with { type: 'json' };
    import type { RouteType } from './(common)/types.js';

    let { children }: { children: Snippet } = $props();

    let sidebarIsShown: boolean = $state(false);
    let routes: RouteType[] = routeJson as RouteType[];
    let activeRoute: string = $derived(page.url.pathname);
    let pageHeadings = $state<{ id: string; text: string }[]>([]);
    let activeRouteLabel: string = $derived(getActiveRouteLabel(activeRoute));

    $effect(() => {
        if (activeRoute) {
            buildPageHeadings();
            sidebarIsShown = false;
        }
    });

    onMount(() => {
        if (import.meta.hot) {
            import.meta.hot.on('vite:afterUpdate', () => {
                buildPageHeadings();
            });
        }
    });

    function getActiveRouteLabel(pathname: string): string {
        if (pathname === '/') return 'Overview';

        for (const route of routes) {
            const item = route.items.find((entry) => entry.href === pathname);
            if (item) return item.label;
        }

        return 'Bootstrap Svelte';
    }

    function buildPageHeadings() {
        setTimeout(() => {
            const headingElements = document.querySelectorAll('h2.wk-quick-link');
            const newHeadings: { id: string; text: string }[] = [];

            headingElements.forEach((heading) => {
                let id = heading.id;
                if (!id) {
                    id =
                        heading.textContent
                            ?.toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w-]/g, '') || `heading-${newHeadings.length}`;
                    heading.id = id;
                }

                newHeadings.push({
                    id,
                    text: heading.textContent || `Heading ${newHeadings.length + 1}`
                });
            });

            pageHeadings = newHeadings;
        }, 100);
    }

    function handleQuickLinkClick(event: MouseEvent): void {
        event.preventDefault();
        const target = event.currentTarget as HTMLAnchorElement;
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
            scrollToHeading(href.slice(1));
        }
    }

    function scrollToHeading(id: string): void {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function handleWindowResize(event: Event): void {
        if ((event.target as Window).innerWidth >= 992) {
            sidebarIsShown = false;
        }
    }

    function handleWindowKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            sidebarIsShown = false;
        }
    }

    function handleWindowClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const sidebar = document.querySelector('.wk-docs-sidebar');
        const toggleButton = document.getElementById('sidebarToggle');
        if (sidebarIsShown && sidebar && !sidebar.contains(target) && toggleButton && !toggleButton.contains(target)) {
            sidebarIsShown = false;
        }
    }
</script>

<svelte:window onresize={handleWindowResize} onkeydown={handleWindowKeyDown} onclick={handleWindowClick} />

<svelte:head>
    <title>Bootstrap Svelte Component Library</title>
    <meta name="description" content="Bootstrap components for Svelte 5 with TypeScript support, live examples, and package-local documentation." />
</svelte:head>

{#snippet routeMenu(route: RouteType)}
    <div class="wk-nav-section">
        <div class="wk-nav-section-label">{route.section}</div>
        <ul class="nav flex-column gap-1">
            {#each route.items as item, itemIndex (`item-${itemIndex}`)}
                <li class="nav-item">
                    <a
                        href={item.href}
                        class="wk-nav-link"
                        class:active={activeRoute === item.href}
                        aria-current={activeRoute === item.href ? 'page' : undefined}>
                        {item.label}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/snippet}

<div class="wk-docs-shell">
    <div class="wk-sidebar-overlay" class:show={sidebarIsShown} onclick={() => (sidebarIsShown = false)} role="presentation"></div>

    <aside id="documentation-sidebar" class="wk-docs-sidebar" class:show={sidebarIsShown} aria-label="Documentation navigation">
        <div class="wk-brand-card">
            <a class="wk-brand-mark" href="/" aria-label="Bootstrap Svelte home">
                <span class="wk-brand-icon">BS</span>
                <span>
                    <span class="wk-brand-title">Bootstrap Svelte</span>
                    <span class="wk-brand-subtitle">Svelte 5 components</span>
                </span>
            </a>
            <button
                class="btn btn-sm btn-outline-secondary d-lg-none"
                type="button"
                onclick={() => (sidebarIsShown = false)}
                aria-label="Close navigation">
                ×
            </button>
        </div>

        <nav class="wk-sidebar-nav">
            {#each routes as route, routeIndex (`route-${routeIndex}`)}
                {@render routeMenu(route)}
            {/each}
        </nav>
    </aside>

    <div class="wk-docs-main">
        <header class="wk-docs-topbar">
            <button
                class="btn btn-outline-secondary wk-sidebar-toggle"
                id="sidebarToggle"
                type="button"
                onclick={() => (sidebarIsShown = !sidebarIsShown)}
                aria-controls="documentation-sidebar"
                aria-expanded={sidebarIsShown}
                aria-label="Open navigation">
                ☰
            </button>
            <div>
                <div class="wk-eyebrow">Documentation</div>
                <div class="wk-current-page">{activeRouteLabel}</div>
            </div>
            <div class="wk-topbar-actions">
                <code class="wk-install-chip">pnpm add @winkintel/bootstrap-svelte</code>
                <a class="btn btn-sm btn-dark" href="https://github.com/WinkIntel/bootstrap-svelte" target="_blank" rel="noreferrer">GitHub</a>
            </div>
        </header>

        <div class="wk-docs-grid">
            <main class="wk-content" tabindex="-1">
                {@render children()}
            </main>

            <aside class="wk-toc" aria-label="On this page">
                <div class="wk-toc-card">
                    <div class="wk-toc-title">On this page</div>
                    <nav>
                        <ul class="nav flex-column gap-1">
                            {#if pageHeadings.length > 0}
                                {#each pageHeadings as heading, headingIndex (`heading-${headingIndex}`)}
                                    <li class="nav-item">
                                        <a href={`#${heading.id}`} class="wk-toc-link" onclick={handleQuickLinkClick}>{heading.text}</a>
                                    </li>
                                {/each}
                            {:else}
                                <li class="wk-toc-empty">Sections appear here.</li>
                            {/if}
                        </ul>
                    </nav>
                    <div class="wk-resource-links">
                        <div class="wk-toc-title">Resources</div>
                        <a href="https://getbootstrap.com/docs/5.3/" target="_blank" rel="noreferrer">Bootstrap docs</a>
                        <a href="https://svelte.dev/docs" target="_blank" rel="noreferrer">Svelte docs</a>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</div>

<style>
    :global(html) {
        scroll-behavior: smooth;
    }

    :global(body) {
        background:
            radial-gradient(circle at top left, rgba(112, 44, 249, 0.12), transparent 30rem), linear-gradient(180deg, #f8f9ff 0%, #ffffff 22rem);
        color: #172033;
    }

    :global(.wk-quick-link) {
        scroll-margin-top: 7rem;
    }

    .wk-docs-shell {
        display: flex;
        min-height: 100vh;
    }

    .wk-docs-sidebar {
        background: rgba(255, 255, 255, 0.88);
        border-right: 1px solid rgba(108, 117, 125, 0.18);
        box-shadow: 0 1rem 3rem rgba(15, 23, 42, 0.06);
        flex: 0 0 19rem;
        height: 100vh;
        overflow-y: auto;
        padding: 1.25rem;
        position: sticky;
        top: 0;
        z-index: 1045;
    }

    .wk-brand-card {
        align-items: center;
        display: flex;
        gap: 0.75rem;
        justify-content: space-between;
        margin-bottom: 1.5rem;
    }

    .wk-brand-mark {
        align-items: center;
        color: inherit;
        display: inline-flex;
        gap: 0.75rem;
        text-decoration: none;
    }

    .wk-brand-icon {
        align-items: center;
        background: linear-gradient(135deg, #6f42c1, #0d6efd);
        border-radius: 1rem;
        box-shadow: 0 0.8rem 1.5rem rgba(111, 66, 193, 0.22);
        color: #fff;
        display: inline-flex;
        font-weight: 800;
        height: 2.75rem;
        justify-content: center;
        letter-spacing: -0.04em;
        width: 2.75rem;
    }

    .wk-brand-title,
    .wk-brand-subtitle {
        display: block;
    }

    .wk-brand-title {
        font-weight: 800;
        letter-spacing: -0.03em;
    }

    .wk-brand-subtitle {
        color: #6c757d;
        font-size: 0.82rem;
    }

    .wk-sidebar-nav {
        display: grid;
        gap: 1.1rem;
    }

    .wk-nav-section-label {
        color: #6f42c1;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        margin-bottom: 0.45rem;
        text-transform: uppercase;
    }

    .wk-nav-link {
        border-radius: 0.75rem;
        color: #495057;
        display: block;
        font-size: 0.94rem;
        padding: 0.45rem 0.65rem;
        text-decoration: none;
        transition:
            background-color 0.16s ease,
            color 0.16s ease,
            transform 0.16s ease;
    }

    .wk-nav-link:hover {
        background: rgba(13, 110, 253, 0.08);
        color: #0d6efd;
        transform: translateX(0.125rem);
    }

    .wk-nav-link.active {
        background: #172033;
        color: #fff;
        font-weight: 700;
    }

    .wk-docs-main {
        flex: 1 1 auto;
        min-width: 0;
    }

    .wk-docs-topbar {
        align-items: center;
        backdrop-filter: blur(18px);
        background: rgba(255, 255, 255, 0.78);
        border-bottom: 1px solid rgba(108, 117, 125, 0.16);
        display: flex;
        gap: 1rem;
        min-height: 4.75rem;
        padding: 0.85rem 2rem;
        position: sticky;
        top: 0;
        z-index: 1030;
    }

    .wk-sidebar-toggle {
        display: none;
    }

    .wk-eyebrow {
        color: #6c757d;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .wk-current-page {
        font-size: 1.05rem;
        font-weight: 800;
        letter-spacing: -0.02em;
    }

    .wk-topbar-actions {
        align-items: center;
        display: flex;
        gap: 0.75rem;
        margin-left: auto;
    }

    .wk-install-chip {
        background: #172033;
        border-radius: 999px;
        color: #f8f9fa;
        font-size: 0.8rem;
        padding: 0.45rem 0.75rem;
    }

    .wk-docs-grid {
        display: grid;
        gap: 2rem;
        grid-template-columns: minmax(0, 1fr) 17rem;
        margin: 0 auto;
        max-width: 96rem;
        padding: 2rem;
    }

    .wk-content {
        min-width: 0;
    }

    .wk-toc {
        display: block;
    }

    .wk-toc-card {
        background: rgba(255, 255, 255, 0.78);
        border: 1px solid rgba(108, 117, 125, 0.16);
        border-radius: 1.25rem;
        box-shadow: 0 1rem 2rem rgba(15, 23, 42, 0.05);
        padding: 1rem;
        position: sticky;
        top: 6rem;
    }

    .wk-toc-title {
        color: #6c757d;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        margin-bottom: 0.65rem;
        text-transform: uppercase;
    }

    .wk-toc-link {
        color: #495057;
        display: block;
        font-size: 0.9rem;
        padding: 0.2rem 0;
        text-decoration: none;
    }

    .wk-toc-link:hover {
        color: #0d6efd;
    }

    .wk-toc-empty {
        color: #8a94a6;
        font-size: 0.9rem;
        list-style: none;
    }

    .wk-resource-links {
        border-top: 1px solid rgba(108, 117, 125, 0.16);
        display: grid;
        gap: 0.4rem;
        margin-top: 1rem;
        padding-top: 1rem;
    }

    .wk-resource-links a {
        color: #495057;
        font-size: 0.9rem;
        text-decoration: none;
    }

    .wk-resource-links a:hover {
        color: #0d6efd;
    }

    .wk-sidebar-overlay {
        background: rgba(15, 23, 42, 0.5);
        inset: 0;
        opacity: 0;
        pointer-events: none;
        position: fixed;
        transition: opacity 0.2s ease;
        z-index: 1040;
    }

    .wk-sidebar-overlay.show {
        opacity: 1;
        pointer-events: auto;
    }

    @media (max-width: 1199.98px) {
        .wk-docs-grid {
            grid-template-columns: minmax(0, 1fr);
        }

        .wk-toc {
            display: none;
        }
    }

    @media (max-width: 991.98px) {
        .wk-docs-sidebar {
            height: 100vh;
            left: 0;
            position: fixed;
            top: 0;
            transform: translateX(-105%);
            transition: transform 0.22s ease;
            width: min(86vw, 21rem);
        }

        .wk-docs-sidebar.show {
            transform: translateX(0);
        }

        .wk-sidebar-toggle {
            display: inline-flex;
        }

        .wk-docs-topbar {
            padding: 0.75rem 1rem;
        }

        .wk-topbar-actions {
            display: none;
        }

        .wk-docs-grid {
            padding: 1rem;
        }
    }
</style>

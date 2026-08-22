<script lang="ts">
    import { page } from '$app/state';
    import { Button, Dropdown } from '$lib/index.js';
    import { onMount, tick, type Snippet } from 'svelte';
    import { buildHeadMeta } from './(common)/head-meta.js';
    import routeJson from './(common)/routes.json' with { type: 'json' };
    import { getPageMeta, site } from './(common)/site.js';
    import type { RouteType } from './(common)/types.js';

    type ColorMode = 'auto' | 'dark' | 'light';

    const installCommand = 'pnpm add @winkintel/bootstrap-svelte';
    const colorModeLabels: Record<ColorMode, string> = {
        auto: 'Auto',
        dark: 'Dark',
        light: 'Light'
    };
    const colorModeIcons: Record<ColorMode, string> = {
        auto: 'bi-circle-half',
        dark: 'bi-moon-stars',
        light: 'bi-sun'
    };
    const colorModeOptions: ColorMode[] = ['dark', 'light', 'auto'];
    const copyrightYear = new Date().getFullYear();

    let { children }: { children: Snippet } = $props();

    let sidebarIsShown: boolean = $state(false);
    let sidebarIsMobile: boolean = $state(false);
    let searchQuery: string = $state('');
    let colorMode: ColorMode = $state('auto');
    let installCopied: boolean = $state(false);
    let sidebarElement: HTMLElement | null = $state(null);
    let sidebarOverlayElement: HTMLDivElement | null = $state(null);
    let sidebarToggleElement: HTMLButtonElement | null = $state(null);
    let sidebarCloseElement: HTMLButtonElement | null = $state(null);
    let previousSidebarIsShown: boolean = $state(false);
    let previousActiveRoute: string = $state('');
    let colorModeMediaQuery: MediaQueryList | null = null;
    let installCopiedTimeout: ReturnType<typeof setTimeout> | undefined;
    let routes: RouteType[] = routeJson as RouteType[];
    let activeRoute: string = $derived(page.url.pathname);
    let pageHeadings = $state<{ id: string; text: string }[]>([]);
    let pageMeta = $derived(getPageMeta(activeRoute));
    let activeRouteLabel: string = $derived(pageMeta.label);
    let activeRouteSection: string = $derived(pageMeta.section);
    let headMeta = $derived(buildHeadMeta(activeRoute));
    let pageTitle: string = $derived(headMeta.title);
    let jsonLdScript: string = $derived(`<script type="application/ld+json">${headMeta.jsonLd}\u003c/script>`);
    let sidebarIsInert: boolean = $derived(sidebarIsMobile && !sidebarIsShown);
    let colorModeLabel: string = $derived(colorModeLabels[colorMode]);
    let colorModeIcon: string = $derived(colorModeIcons[colorMode]);
    let copyInstallLabel: string = $derived(installCopied ? 'Install command copied' : 'Copy install command');
    let filteredRoutes: RouteType[] = $derived.by(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return routes;

        return routes
            .map((route) => ({
                ...route,
                items: route.items.filter((item) => `${route.section} ${item.label}`.toLowerCase().includes(query))
            }))
            .filter((route) => route.items.length > 0);
    });

    $effect(() => {
        if (activeRoute && activeRoute !== previousActiveRoute) {
            buildPageHeadings();
            sidebarIsShown = false;
            previousActiveRoute = activeRoute;
        }
    });

    $effect(() => {
        if (sidebarIsShown && sidebarIsMobile && !previousSidebarIsShown) {
            focusSidebarCloseButton();
        }

        previousSidebarIsShown = sidebarIsShown;
    });

    onMount(() => {
        updateSidebarViewport();
        const savedColorMode = localStorage.getItem('wk-color-mode');
        if (isColorMode(savedColorMode)) colorMode = savedColorMode;

        colorModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        colorModeMediaQuery.addEventListener('change', handleSystemColorModeChange);
        applyColorMode(colorMode);

        if (import.meta.hot) {
            import.meta.hot.on('vite:afterUpdate', () => {
                buildPageHeadings();
            });
        }

        return () => {
            colorModeMediaQuery?.removeEventListener('change', handleSystemColorModeChange);
            if (installCopiedTimeout) clearTimeout(installCopiedTimeout);
        };
    });

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
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
    }

    function updateSidebarViewport(): void {
        sidebarIsMobile = window.innerWidth < 992;
        if (!sidebarIsMobile) {
            sidebarIsShown = false;
        }
    }

    function handleWindowResize(event: Event): void {
        const windowElement = event.target as Window;
        sidebarIsMobile = windowElement.innerWidth < 992;
        if (!sidebarIsMobile) {
            closeSidebar();
        }
    }

    function handleWindowKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && sidebarIsShown) {
            closeSidebar({ returnFocus: true });
            return;
        }

        if (event.key === 'Tab' && sidebarIsShown && sidebarIsMobile) {
            trapSidebarFocus(event);
        }
    }

    function handleWindowClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const placeholderLink = target.closest('a[href="#!"], a[href^="#nav-link-"]');
        if (placeholderLink) {
            event.preventDefault();
        }

        if (target.closest('#sidebarToggle')) return;
        if (sidebarIsShown && sidebarElement && !sidebarElement.contains(target) && sidebarToggleElement && !sidebarToggleElement.contains(target)) {
            closeSidebar();
        }
    }

    async function closeSidebar(options: { returnFocus?: boolean } = {}): Promise<void> {
        if (!sidebarIsShown) return;
        sidebarIsShown = false;
        await tick();
        if (options.returnFocus) sidebarToggleElement?.focus();
    }

    function toggleSidebar(): void {
        sidebarIsShown = !sidebarIsShown;
    }

    function clearSearch(): void {
        searchQuery = '';
    }

    function isColorMode(value: string | null): value is ColorMode {
        return value === 'auto' || value === 'dark' || value === 'light';
    }

    function getSystemColorMode(): Exclude<ColorMode, 'auto'> {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyColorMode(mode: ColorMode): void {
        const resolvedMode = mode === 'auto' ? getSystemColorMode() : mode;
        document.documentElement.setAttribute('data-bs-theme', resolvedMode);
    }

    function handleSystemColorModeChange(): void {
        if (colorMode === 'auto') applyColorMode(colorMode);
    }

    function setColorMode(mode: ColorMode): void {
        colorMode = mode;
        localStorage.setItem('wk-color-mode', mode);
        applyColorMode(mode);
    }

    function cycleColorMode(): void {
        const currentIndex = colorModeOptions.indexOf(colorMode);
        const nextIndex = currentIndex === colorModeOptions.length - 1 ? 0 : currentIndex + 1;
        setColorMode(colorModeOptions[nextIndex] ?? 'auto');
    }

    async function copyInstallCommand(): Promise<void> {
        try {
            await navigator.clipboard.writeText(installCommand);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = installCommand;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.append(textArea);
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }

        installCopied = true;
        if (installCopiedTimeout) clearTimeout(installCopiedTimeout);
        installCopiedTimeout = setTimeout(() => {
            installCopied = false;
        }, 1800);
    }

    function getFocusableElements(container: HTMLElement): HTMLElement[] {
        return Array.from(
            container.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
    }

    function trapSidebarFocus(event: KeyboardEvent): void {
        if (!sidebarElement) return;

        const focusableElements = getFocusableElements(sidebarElement);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) {
            event.preventDefault();
            sidebarElement.focus();
            return;
        }

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    async function focusSidebarCloseButton(): Promise<void> {
        await tick();
        sidebarCloseElement?.focus();
    }
</script>

<svelte:window onresize={handleWindowResize} onkeydown={handleWindowKeyDown} onclick={handleWindowClick} />

<svelte:head>
    <title>{pageTitle}</title>
    <meta name="description" content={headMeta.description} />
    {#if headMeta.robots}
        <meta name="robots" content={headMeta.robots} />
    {/if}
    {#if headMeta.canonical}
        <link rel="canonical" href={headMeta.canonical} />
        <meta property="og:url" content={headMeta.canonical} />
    {/if}
    {#if headMeta.markdownUrl}
        <link rel="alternate" type="text/markdown" href={headMeta.markdownUrl} />
    {/if}
    <meta property="og:type" content={headMeta.ogType} />
    <meta property="og:site_name" content={headMeta.siteName} />
    <meta property="og:title" content={headMeta.title} />
    <meta property="og:description" content={headMeta.description} />
    <meta property="og:image" content={headMeta.ogImage} />
    <meta property="og:image:alt" content={headMeta.ogImageAlt} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content={headMeta.twitterCard} />
    <meta name="twitter:title" content={headMeta.title} />
    <meta name="twitter:description" content={headMeta.description} />
    <meta name="twitter:image" content={headMeta.ogImage} />
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- jsonLdScript is generated from site constants and escapes "<" -->
    {@html jsonLdScript}
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
    <a class="wk-skip-link" href="#main-content">Skip to main content</a>

    <div class="wk-sidebar-overlay" class:show={sidebarIsShown} bind:this={sidebarOverlayElement} role="presentation" onclick={() => closeSidebar()}>
    </div>

    <aside
        id="documentation-sidebar"
        class="wk-docs-sidebar"
        class:show={sidebarIsShown}
        aria-hidden={sidebarIsInert ? 'true' : undefined}
        aria-label="Documentation navigation"
        bind:this={sidebarElement}
        inert={sidebarIsInert ? true : undefined}
        tabindex="-1">
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
                bind:this={sidebarCloseElement}
                onclick={() => closeSidebar({ returnFocus: true })}
                aria-label="Close navigation">
                <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
        </div>

        <div class="wk-docs-search">
            <label class="form-label" for="docsSearch">Search docs</label>
            <div class="input-group input-group-sm">
                <input
                    id="docsSearch"
                    class="form-control"
                    type="search"
                    bind:value={searchQuery}
                    placeholder="Filter components"
                    aria-describedby="docsSearchHelp" />
                {#if searchQuery}
                    <button class="btn btn-outline-secondary" type="button" onclick={clearSearch} aria-label="Clear documentation search"
                        >Clear</button>
                {/if}
            </div>
            <div id="docsSearchHelp" class="form-text">Filters navigation by section and component name.</div>
        </div>

        <nav class="wk-sidebar-nav" aria-label="Primary documentation">
            {#if filteredRoutes.length > 0}
                {#each filteredRoutes as route, routeIndex (`route-${routeIndex}`)}
                    {@render routeMenu(route)}
                {/each}
            {:else}
                <p class="wk-search-empty">No documentation routes match "{searchQuery}".</p>
            {/if}
        </nav>
    </aside>

    <div class="wk-docs-main">
        <header class="wk-docs-topbar">
            <button
                id="sidebarToggle"
                class="btn btn-outline-secondary wk-sidebar-toggle"
                type="button"
                bind:this={sidebarToggleElement}
                onclick={toggleSidebar}
                aria-controls="documentation-sidebar"
                aria-expanded={sidebarIsShown}
                aria-label={sidebarIsShown ? 'Close navigation' : 'Open navigation'}>
                <i class="bi bi-list" aria-hidden="true"></i>
            </button>
            <div class="wk-breadcrumbs">
                <span class="wk-eyebrow">{activeRouteSection}</span>
                <span class="wk-crumb-divider" aria-hidden="true">/</span>
                <span class="wk-current-page">{activeRouteLabel}</span>
            </div>
            <div class="wk-topbar-actions">
                <div class="wk-install-action">
                    <code class="wk-install-chip">{installCommand}</code>
                    <button
                        class="btn btn-sm btn-outline-secondary"
                        type="button"
                        onclick={copyInstallCommand}
                        aria-label={copyInstallLabel}
                        title={copyInstallLabel}>
                        <i class={installCopied ? 'bi bi-check2' : 'bi bi-clipboard'} aria-hidden="true"></i>
                    </button>
                </div>
                <Dropdown.Root isButtonGroup={true}>
                    <Button
                        colorVariant="outline-secondary"
                        size="sm"
                        onclick={cycleColorMode}
                        aria-label={`Cycle color mode. Current mode: ${colorModeLabel}`}
                        title={`Current color mode: ${colorModeLabel}`}>
                        <i class={`bi ${colorModeIcon} me-1`} aria-hidden="true"></i>
                        {colorModeLabel}
                    </Button>
                    <Dropdown.Toggle
                        colorVariant="outline-secondary"
                        size="sm"
                        isSplit={true}
                        aria-label="Change color mode"
                        title="Change color mode" />
                    <Dropdown.Menu isEnd={true}>
                        {#each colorModeOptions as mode (mode)}
                            <Dropdown.Item
                                class="d-flex align-items-center gap-2"
                                isActive={colorMode === mode}
                                onclick={() => setColorMode(mode)}
                                aria-current={colorMode === mode ? 'true' : undefined}>
                                <i class={`bi ${colorModeIcons[mode]}`} aria-hidden="true"></i>
                                {colorModeLabels[mode]}
                            </Dropdown.Item>
                        {/each}
                    </Dropdown.Menu>
                </Dropdown.Root>
                <a class="btn btn-sm wk-github-btn" href="https://github.com/WinkIntel/bootstrap-svelte" target="_blank" rel="noreferrer">
                    <i class="bi bi-github me-1" aria-hidden="true"></i>
                    GitHub
                </a>
            </div>
        </header>

        <div class="wk-docs-grid">
            <main id="main-content" class="wk-content" tabindex="-1">
                {#if pageHeadings.length > 0}
                    <details class="wk-mobile-toc">
                        <summary>On this page</summary>
                        <nav aria-label="Page sections compact">
                            <ul class="nav flex-column gap-1">
                                {#each pageHeadings as heading, headingIndex (`mobile-heading-${headingIndex}`)}
                                    <li class="nav-item">
                                        <a href={`#${heading.id}`} class="wk-toc-link" onclick={handleQuickLinkClick}>{heading.text}</a>
                                    </li>
                                {/each}
                            </ul>
                        </nav>
                    </details>
                {/if}
                {@render children()}

                <footer class="wk-docs-footer">
                    <nav class="wk-footer-links" aria-label="Site">
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/privacy">Privacy</a>
                        <a href={site.repositoryUrl} target="_blank" rel="noreferrer">GitHub</a>
                        <a href={site.npmUrl} target="_blank" rel="noreferrer">npm</a>
                        <a href="/llms.txt">llms.txt</a>
                        <a href="/sitemap.xml">Sitemap</a>
                    </nav>
                    <p class="wk-footer-note">© {copyrightYear} {site.organization.name} · {site.name} {site.version} · {site.license.name}</p>
                </footer>
            </main>

            <aside class="wk-toc" aria-label="On this page">
                <div class="wk-toc-card">
                    <div class="wk-toc-title">On this page</div>
                    <nav aria-label="Page sections">
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

    :global(:root) {
        --wk-font-sans: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        --wk-font-mono: 'JetBrains Mono', SFMono-Regular, Menlo, Consolas, monospace;
        --wk-page-bg: #f6f6fa;
        --wk-page-bg-gradient:
            radial-gradient(60rem 32rem at 85% -8rem, rgba(94, 44, 237, 0.09), transparent 60%),
            radial-gradient(50rem 28rem at -10% 12rem, rgba(13, 148, 255, 0.08), transparent 60%), linear-gradient(180deg, #fbfbfd 0%, #f6f6fa 100%);
        --wk-surface: #ffffff;
        --wk-surface-translucent: rgba(255, 255, 255, 0.82);
        --wk-surface-elevated: #ffffff;
        --wk-surface-soft: #f4f4f9;
        --wk-border: rgba(23, 23, 51, 0.09);
        --wk-border-strong: rgba(23, 23, 51, 0.16);
        --wk-body-color: #35395a;
        --wk-heading-color: #16182f;
        --wk-muted-color: #6a6f8e;
        --wk-muted-color-strong: #4c5170;
        --wk-accent-color: #5e2ced;
        --wk-accent-soft: rgba(94, 44, 237, 0.09);
        --wk-accent-border: rgba(94, 44, 237, 0.22);
        --wk-accent-2: #0d94ff;
        --wk-link-color: #5e2ced;
        --wk-link-hover-color: #4318c9;
        --wk-active-bg: #16182f;
        --wk-active-color: #ffffff;
        --wk-code-bg: #ffffff;
        --wk-code-toolbar-bg: #f4f4f9;
        --wk-code-color: #2b2e4a;
        --wk-shadow-sm: 0 1px 2px rgba(22, 24, 47, 0.05);
        --wk-shadow-md: 0 10px 30px -12px rgba(22, 24, 47, 0.16);
        --wk-shadow-lg: 0 30px 60px -24px rgba(22, 24, 47, 0.24);
        --wk-gradient-brand: linear-gradient(120deg, #5e2ced 0%, #8a4bff 45%, #0d94ff 100%);
    }

    :global([data-bs-theme='dark']) {
        --wk-page-bg: #0b0d18;
        --wk-page-bg-gradient:
            radial-gradient(60rem 32rem at 85% -8rem, rgba(138, 75, 255, 0.14), transparent 60%),
            radial-gradient(50rem 28rem at -10% 12rem, rgba(13, 148, 255, 0.1), transparent 60%), linear-gradient(180deg, #101223 0%, #0b0d18 100%);
        --wk-surface: #131529;
        --wk-surface-translucent: rgba(15, 17, 33, 0.82);
        --wk-surface-elevated: #191c33;
        --wk-surface-soft: #101226;
        --wk-border: rgba(226, 230, 255, 0.1);
        --wk-border-strong: rgba(226, 230, 255, 0.2);
        --wk-body-color: #c8cdec;
        --wk-heading-color: #f2f4ff;
        --wk-muted-color: #9299bf;
        --wk-muted-color-strong: #b7bdde;
        --wk-accent-color: #ab8bff;
        --wk-accent-soft: rgba(171, 139, 255, 0.12);
        --wk-accent-border: rgba(171, 139, 255, 0.32);
        --wk-accent-2: #57b6ff;
        --wk-link-color: #ab8bff;
        --wk-link-hover-color: #cdb8ff;
        --wk-active-bg: #f2f4ff;
        --wk-active-color: #16182f;
        --wk-code-bg: #0e1020;
        --wk-code-toolbar-bg: #131529;
        --wk-code-color: #dbe2ff;
        --wk-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
        --wk-shadow-md: 0 10px 30px -12px rgba(0, 0, 0, 0.5);
        --wk-shadow-lg: 0 30px 60px -24px rgba(0, 0, 0, 0.65);
    }

    :global(body) {
        background: var(--wk-page-bg-gradient) var(--wk-page-bg);
        color: var(--wk-body-color);
        font-family: var(--wk-font-sans);
        font-optical-sizing: auto;
    }

    :global(code),
    :global(pre),
    :global(kbd) {
        font-family: var(--wk-font-mono);
    }

    :global(.wk-quick-link) {
        scroll-margin-top: 7rem;
    }

    .wk-docs-shell {
        display: flex;
        min-height: 100vh;
    }

    .wk-skip-link {
        background: var(--wk-surface-elevated);
        border: 2px solid var(--wk-accent-color);
        border-radius: 0.5rem;
        color: var(--wk-accent-color);
        font-weight: 700;
        left: 1rem;
        padding: 0.65rem 0.85rem;
        position: fixed;
        top: 1rem;
        transform: translateY(-150%);
        transition: transform 0.16s ease;
        z-index: 2000;
    }

    .wk-skip-link:focus {
        transform: translateY(0);
    }

    .wk-docs-sidebar {
        background: var(--wk-surface-translucent);
        backdrop-filter: blur(16px);
        border-right: 1px solid var(--wk-border);
        flex: 0 0 18.5rem;
        height: 100vh;
        overflow-y: auto;
        padding: 1.4rem 1.25rem;
        position: sticky;
        scrollbar-width: thin;
        top: 0;
        z-index: 1045;
    }

    .wk-brand-card {
        align-items: center;
        display: flex;
        gap: 0.75rem;
        justify-content: space-between;
        margin-bottom: 1.4rem;
    }

    .wk-docs-search {
        margin-bottom: 1.25rem;
    }

    .wk-docs-search .form-label {
        color: var(--wk-muted-color);
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        margin-bottom: 0.45rem;
        text-transform: uppercase;
    }

    .wk-docs-search .form-control {
        background: var(--wk-surface-soft);
        border-color: transparent;
        border-radius: 0.65rem;
        color: var(--wk-body-color);
        transition:
            border-color 0.16s ease,
            box-shadow 0.16s ease;
    }

    .wk-docs-search .form-control:focus {
        background: var(--wk-surface);
        border-color: var(--wk-accent-border);
        box-shadow: 0 0 0 0.25rem var(--wk-accent-soft);
    }

    .wk-docs-search .form-control::placeholder {
        color: var(--wk-muted-color);
    }

    .wk-docs-search .form-text,
    .wk-search-empty {
        color: var(--wk-muted-color);
        font-size: 0.78rem;
    }

    .wk-search-empty {
        margin: 0;
    }

    .wk-brand-mark {
        align-items: center;
        color: inherit;
        display: inline-flex;
        gap: 0.7rem;
        text-decoration: none;
    }

    .wk-brand-icon {
        align-items: center;
        background: var(--wk-gradient-brand);
        border-radius: 0.85rem;
        box-shadow: 0 6px 16px -6px rgba(94, 44, 237, 0.55);
        color: #fff;
        display: inline-flex;
        font-size: 0.95rem;
        font-weight: 800;
        height: 2.5rem;
        justify-content: center;
        letter-spacing: -0.05em;
        width: 2.5rem;
    }

    .wk-brand-title,
    .wk-brand-subtitle {
        display: block;
    }

    .wk-brand-title {
        color: var(--wk-heading-color);
        font-size: 0.98rem;
        font-weight: 800;
        letter-spacing: -0.02em;
    }

    .wk-brand-subtitle {
        color: var(--wk-muted-color);
        font-size: 0.76rem;
    }

    .wk-sidebar-nav {
        display: grid;
        gap: 1.35rem;
        padding-bottom: 2rem;
    }

    .wk-nav-section-label {
        color: var(--wk-muted-color);
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        margin-bottom: 0.4rem;
        padding-left: 0.75rem;
        text-transform: uppercase;
    }

    .wk-nav-link {
        border-left: 2px solid transparent;
        border-radius: 0 0.55rem 0.55rem 0;
        color: var(--wk-muted-color-strong);
        display: block;
        font-size: 0.9rem;
        font-weight: 500;
        margin-left: 0.25rem;
        padding: 0.36rem 0.75rem 0.36rem 0.6rem;
        text-decoration: none;
        transition:
            background-color 0.14s ease,
            border-color 0.14s ease,
            color 0.14s ease;
    }

    .wk-nav-link:hover {
        background: var(--wk-accent-soft);
        border-left-color: var(--wk-accent-border);
        color: var(--wk-accent-color);
    }

    .wk-nav-link.active {
        background: var(--wk-accent-soft);
        border-left-color: var(--wk-accent-color);
        color: var(--wk-accent-color);
        font-weight: 700;
    }

    .wk-docs-main {
        flex: 1 1 auto;
        min-width: 0;
    }

    .wk-docs-topbar {
        align-items: center;
        backdrop-filter: blur(16px);
        background: var(--wk-surface-translucent);
        border-bottom: 1px solid var(--wk-border);
        display: flex;
        gap: 1rem;
        min-height: 4.25rem;
        padding: 0.7rem 2rem;
        position: sticky;
        top: 0;
        z-index: 1030;
    }

    .wk-sidebar-toggle {
        display: none;
    }

    .wk-breadcrumbs {
        align-items: baseline;
        display: flex;
        gap: 0.55rem;
    }

    .wk-eyebrow {
        color: var(--wk-muted-color);
        font-size: 0.78rem;
        font-weight: 600;
    }

    .wk-crumb-divider {
        color: var(--wk-border-strong);
        font-size: 0.78rem;
    }

    .wk-current-page {
        color: var(--wk-heading-color);
        font-size: 0.95rem;
        font-weight: 700;
        letter-spacing: -0.01em;
    }

    .wk-topbar-actions {
        align-items: center;
        display: flex;
        gap: 0.6rem;
        margin-left: auto;
    }

    .wk-install-action {
        align-items: center;
        background: var(--wk-surface-soft);
        border: 1px solid var(--wk-border);
        border-radius: 999px;
        display: inline-flex;
        gap: 0.15rem;
        padding: 0.2rem 0.25rem 0.2rem 0.85rem;
    }

    .wk-install-chip {
        background: transparent;
        color: var(--wk-body-color);
        font-size: 0.76rem;
        padding: 0;
    }

    .wk-install-action .btn {
        --bs-btn-border-color: transparent;
        --bs-btn-color: var(--wk-muted-color);
        --bs-btn-hover-bg: var(--wk-accent-soft);
        --bs-btn-hover-border-color: transparent;
        --bs-btn-hover-color: var(--wk-accent-color);
        --bs-btn-active-bg: var(--wk-accent-soft);
        --bs-btn-active-border-color: transparent;
        --bs-btn-active-color: var(--wk-accent-color);
        border-radius: 999px;
    }

    .wk-github-btn {
        --bs-btn-bg: var(--wk-active-bg);
        --bs-btn-border-color: var(--wk-active-bg);
        --bs-btn-color: var(--wk-active-color);
        --bs-btn-hover-bg: var(--wk-accent-color);
        --bs-btn-hover-border-color: var(--wk-accent-color);
        --bs-btn-hover-color: #ffffff;
        --bs-btn-active-bg: var(--wk-accent-color);
        --bs-btn-active-border-color: var(--wk-accent-color);
        --bs-btn-active-color: #ffffff;
        border-radius: 999px;
        font-weight: 600;
    }

    .wk-github-btn:focus-visible {
        box-shadow: none;
        outline: 2px solid var(--wk-accent-color);
        outline-offset: 2px;
    }

    :global([data-bs-theme='dark'] .wk-github-btn) {
        --bs-btn-hover-color: #16182f;
        --bs-btn-active-color: #16182f;
    }

    .wk-docs-grid {
        display: grid;
        gap: 3rem;
        grid-template-columns: minmax(0, 1fr) 15rem;
        margin: 0 auto;
        max-width: 90rem;
        padding: 2.5rem 2.5rem 4rem;
    }

    .wk-content {
        color: var(--wk-body-color);
        min-width: 0;
    }

    :global(.wk-content h1),
    :global(.wk-content h2),
    :global(.wk-content h3),
    :global(.wk-content h4),
    :global(.wk-content h5),
    :global(.wk-content h6) {
        color: var(--wk-heading-color);
    }

    :global(.wk-content > div > h1),
    :global(.wk-content > div > div h1) {
        font-size: clamp(2.1rem, 3.4vw, 2.75rem);
        font-weight: 830;
        letter-spacing: -0.035em;
        margin-bottom: 0.5rem;
    }

    :global(.wk-content .lead) {
        color: var(--wk-muted-color) !important;
        font-size: 1.08rem;
        font-weight: 400;
        line-height: 1.7;
        max-width: 52rem;
    }

    :global(.wk-content .lead + hr) {
        background: linear-gradient(90deg, var(--wk-accent-border), transparent 70%);
        border: 0;
        height: 2px;
        margin: 1.5rem 0;
        opacity: 1;
    }

    :global(.wk-content h2.wk-quick-link) {
        font-size: 1.45rem;
        font-weight: 750;
        letter-spacing: -0.02em;
        margin-bottom: 0.6rem;
        margin-top: 0.5rem;
        position: relative;
    }

    :global(.wk-content h2.wk-quick-link::before) {
        background: var(--wk-gradient-brand);
        border-radius: 999px;
        content: '';
        display: inline-block;
        height: 1.05em;
        margin-right: 0.6rem;
        transform: translateY(0.18em);
        width: 0.28rem;
    }

    :global(.wk-content p),
    :global(.wk-content li) {
        color: var(--wk-body-color);
    }

    :global(.wk-content .text-secondary),
    :global(.wk-content .text-body-secondary),
    :global(.wk-content .text-muted) {
        color: var(--wk-muted-color) !important;
    }

    :global(.wk-content [data-bs-theme] h1),
    :global(.wk-content [data-bs-theme] h2),
    :global(.wk-content [data-bs-theme] h3),
    :global(.wk-content [data-bs-theme] h4),
    :global(.wk-content [data-bs-theme] h5),
    :global(.wk-content [data-bs-theme] h6),
    :global(.wk-content [data-bs-theme] p),
    :global(.wk-content [data-bs-theme] li) {
        color: var(--bs-body-color);
    }

    :global(.wk-content [data-bs-theme] .text-secondary),
    :global(.wk-content [data-bs-theme] .text-body-secondary),
    :global(.wk-content [data-bs-theme] .text-muted) {
        color: var(--bs-secondary-color) !important;
    }

    :global(.wk-content a:not(.btn)) {
        color: var(--wk-link-color);
        text-decoration-color: var(--wk-accent-border);
        text-underline-offset: 0.2em;
    }

    :global(.wk-content a:not(.btn):hover) {
        color: var(--wk-link-hover-color);
    }

    :global(.wk-content section > .card),
    :global(.wk-content .wk-card-example) {
        background: var(--wk-surface);
        border: 1px solid var(--wk-border);
        border-radius: 1rem;
        box-shadow: var(--wk-shadow-sm);
    }

    :global(.wk-content section > .card > .card-body) {
        padding: 1.35rem;
    }

    :global(.wk-content .wk-api-section .table) {
        --bs-table-bg: transparent;
        font-size: 0.92rem;
    }

    :global(.wk-content .wk-api-section .table thead th) {
        color: var(--wk-muted-color);
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .wk-mobile-toc {
        background: var(--wk-surface);
        border: 1px solid var(--wk-border);
        border-radius: 0.85rem;
        box-shadow: var(--wk-shadow-sm);
        display: none;
        margin-bottom: 1.25rem;
        padding: 0;
    }

    .wk-mobile-toc summary {
        color: var(--wk-heading-color);
        cursor: pointer;
        font-weight: 700;
        min-height: 44px;
        padding: 0.85rem 1rem;
    }

    .wk-mobile-toc nav {
        margin-top: 0.25rem;
        padding: 0 1rem 1rem;
    }

    .wk-toc {
        display: block;
    }

    .wk-toc-card {
        padding: 0.25rem 0;
        position: sticky;
        top: 6rem;
    }

    .wk-toc-title {
        color: var(--wk-muted-color);
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        margin-bottom: 0.6rem;
        text-transform: uppercase;
    }

    .wk-toc-card > nav {
        border-left: 1px solid var(--wk-border);
    }

    .wk-toc-link {
        border-left: 2px solid transparent;
        color: var(--wk-muted-color);
        display: block;
        font-size: 0.84rem;
        margin-left: -1px;
        padding: 0.22rem 0 0.22rem 0.85rem;
        text-decoration: none;
        transition:
            border-color 0.14s ease,
            color 0.14s ease;
    }

    .wk-toc-link:hover {
        border-left-color: var(--wk-accent-color);
        color: var(--wk-accent-color);
    }

    .wk-mobile-toc .wk-toc-link {
        border-left: 0;
        margin-left: 0;
        padding-left: 0;
    }

    .wk-toc-empty {
        color: var(--wk-muted-color);
        font-size: 0.84rem;
        list-style: none;
        padding-left: 0.85rem;
    }

    .wk-resource-links {
        display: grid;
        gap: 0.35rem;
        margin-top: 1.5rem;
    }

    .wk-resource-links .wk-toc-title {
        margin-bottom: 0.25rem;
    }

    .wk-resource-links a {
        color: var(--wk-muted-color-strong);
        font-size: 0.84rem;
        text-decoration: none;
    }

    .wk-resource-links a:hover {
        color: var(--wk-accent-color);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell) {
        --bs-body-bg: var(--wk-page-bg);
        --bs-body-color: var(--wk-body-color);
        --bs-border-color: var(--wk-border);
        --bs-heading-color: var(--wk-heading-color);
        --bs-secondary-color: var(--wk-muted-color);
        --bs-tertiary-bg: var(--wk-surface-soft);
        --bs-card-bg: var(--wk-surface-elevated);
        --bs-card-cap-bg: var(--wk-surface-soft);
        --bs-card-color: var(--wk-body-color);
        --bs-card-border-color: var(--wk-border);
        --bs-code-color: #f0abfc;
        --bs-link-color: var(--wk-link-color);
        --bs-link-hover-color: var(--wk-link-hover-color);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .card:not([class*='text-bg-'])),
    :global([data-bs-theme='dark'] .wk-docs-shell .dropdown-menu),
    :global([data-bs-theme='dark'] .wk-docs-shell .list-group),
    :global([data-bs-theme='dark'] .wk-docs-shell .toast) {
        --bs-card-bg: var(--wk-surface-elevated);
        --bs-card-cap-bg: var(--wk-surface-soft);
        --bs-card-color: var(--wk-body-color);
        --bs-card-border-color: var(--wk-border);
        background-color: var(--wk-surface-elevated);
        border-color: var(--wk-border);
        color: var(--wk-body-color);
    }

    :global([data-bs-theme='dark'] .wk-content section > .card:not([class*='text-bg-'])) {
        background-color: var(--wk-surface);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .card:not([class*='text-bg-']) > .card-header),
    :global([data-bs-theme='dark'] .wk-docs-shell .card:not([class*='text-bg-']) > .card-footer),
    :global([data-bs-theme='dark'] .wk-docs-shell .toast-header) {
        background-color: var(--wk-surface-soft);
        border-color: var(--wk-border);
        color: var(--wk-heading-color);
    }

    :global(.wk-docs-shell .card[class*='text-bg-'] > .card-header),
    :global(.wk-docs-shell .card[class*='text-bg-'] > .card-footer) {
        background-color: transparent;
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .bg-light),
    :global([data-bs-theme='dark'] .wk-docs-shell .bg-white),
    :global([data-bs-theme='dark'] .wk-docs-shell .bg-body-secondary) {
        background-color: var(--wk-surface-soft) !important;
        color: var(--wk-body-color) !important;
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .border),
    :global([data-bs-theme='dark'] .wk-docs-shell .border-top),
    :global([data-bs-theme='dark'] .wk-docs-shell .border-bottom) {
        border-color: var(--wk-border) !important;
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .form-control),
    :global([data-bs-theme='dark'] .wk-docs-shell .form-select) {
        background-color: #0e1020;
        border-color: var(--wk-border-strong);
        color: var(--wk-body-color);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .form-control::placeholder) {
        color: #8890b5;
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .form-floating > .form-control::placeholder) {
        color: transparent;
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .wk-docs-search .form-control) {
        background: var(--wk-surface-soft);
        border-color: transparent;
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .wk-docs-search .form-control:focus) {
        border-color: var(--wk-accent-border);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .form-label),
    :global([data-bs-theme='dark'] .wk-docs-shell .form-check-label) {
        color: var(--wk-heading-color);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .wk-docs-search .form-label) {
        color: var(--wk-muted-color);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .form-text) {
        color: var(--wk-muted-color);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .btn-outline-secondary) {
        --bs-btn-color: #b7bdde;
        --bs-btn-border-color: #4c5170;
        --bs-btn-hover-bg: #272b4a;
        --bs-btn-hover-border-color: #6a6f8e;
        --bs-btn-hover-color: #ffffff;
        --bs-btn-active-bg: #32365a;
        --bs-btn-active-border-color: #6a6f8e;
        --bs-btn-active-color: #ffffff;
    }

    .wk-sidebar-overlay {
        backdrop-filter: blur(2px);
        background: rgba(10, 12, 26, 0.55);
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

        .wk-mobile-toc {
            display: block;
        }
    }

    @media (max-width: 991.98px) {
        .wk-docs-sidebar {
            background: var(--wk-surface);
            height: 100vh;
            left: 0;
            position: fixed;
            top: 0;
            transform: translateX(-105%);
            transition: transform 0.22s ease;
            width: min(86vw, 21rem);
        }

        .wk-docs-sidebar.show {
            box-shadow: var(--wk-shadow-lg);
            transform: translateX(0);
        }

        .wk-sidebar-toggle {
            display: inline-flex;
            min-height: 44px;
            min-width: 44px;
        }

        .wk-docs-topbar {
            padding: 0.6rem 1rem;
        }

        .wk-topbar-actions {
            display: none;
        }

        .wk-docs-grid {
            padding: 1.25rem 1rem 3rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(html) {
            scroll-behavior: auto;
        }

        *,
        *::before,
        *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
        }
    }
    .wk-docs-footer {
        align-items: baseline;
        border-top: 1px solid var(--wk-border);
        color: var(--wk-muted-color);
        display: flex;
        flex-wrap: wrap;
        font-size: 0.85rem;
        gap: 0.5rem 1.5rem;
        justify-content: space-between;
        margin-top: 4rem;
        padding-top: 1.25rem;
    }

    .wk-footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem 1.1rem;
    }

    :global(.wk-content .wk-footer-links a) {
        color: var(--wk-muted-color);
        font-weight: 500;
        text-decoration: none;
    }

    :global(.wk-content .wk-footer-links a:hover),
    :global(.wk-content .wk-footer-links a:focus-visible) {
        color: var(--wk-accent-color);
        text-decoration: underline;
    }

    .wk-footer-note {
        margin: 0;
    }
</style>

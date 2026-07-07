<script lang="ts">
    import { page } from '$app/state';
    import { onMount, tick, type Snippet } from 'svelte';
    import routeJson from './(common)/routes.json' with { type: 'json' };
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
    let activeRouteLabel: string = $derived(getActiveRouteLabel(activeRoute));
    let activeRouteSection: string = $derived(getActiveRouteSection(activeRoute));
    let pageTitle: string = $derived(`${activeRouteLabel} | Bootstrap Svelte`);
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

    function getActiveRouteLabel(pathname: string): string {
        if (pathname === '/') return 'Overview';

        for (const route of routes) {
            const item = route.items.find((entry) => entry.href === pathname);
            if (item) return item.label;
        }

        return 'Bootstrap Svelte';
    }

    function getActiveRouteSection(pathname: string): string {
        if (pathname === '/') return 'Home';

        for (const route of routes) {
            const item = route.items.find((entry) => entry.href === pathname);
            if (item) return route.section;
        }

        return 'Documentation';
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
                ×
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
                ☰
            </button>
            <div>
                <div class="wk-eyebrow">{activeRouteSection}</div>
                <div class="wk-current-page">{activeRouteLabel}</div>
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
                <div class="btn-group">
                    <button
                        class="btn btn-sm btn-outline-secondary"
                        type="button"
                        onclick={cycleColorMode}
                        aria-label={`Cycle color mode. Current mode: ${colorModeLabel}`}
                        title={`Current color mode: ${colorModeLabel}`}>
                        <i class={`bi ${colorModeIcon} me-1`} aria-hidden="true"></i>
                        {colorModeLabel}
                    </button>
                    <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary dropdown-toggle dropdown-toggle-split"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        aria-label="Change color mode"
                        title="Change color mode">
                        <span class="visually-hidden">Toggle color mode</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        {#each colorModeOptions as mode (mode)}
                            <li>
                                <button
                                    class="dropdown-item d-flex align-items-center gap-2"
                                    class:active={colorMode === mode}
                                    type="button"
                                    onclick={() => setColorMode(mode)}
                                    aria-current={colorMode === mode ? 'true' : undefined}>
                                    <i class={`bi ${colorModeIcons[mode]}`} aria-hidden="true"></i>
                                    {colorModeLabels[mode]}
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>
                <a class="btn btn-sm btn-dark" href="https://github.com/WinkIntel/bootstrap-svelte" target="_blank" rel="noreferrer">GitHub</a>
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
        --wk-page-bg: #ffffff;
        --wk-page-bg-gradient:
            radial-gradient(circle at top left, rgba(112, 44, 249, 0.12), transparent 30rem), linear-gradient(180deg, #f8f9ff 0%, #ffffff 22rem);
        --wk-surface: rgba(255, 255, 255, 0.88);
        --wk-surface-elevated: rgba(255, 255, 255, 0.96);
        --wk-surface-soft: #f8f9fa;
        --wk-border: rgba(108, 117, 125, 0.18);
        --wk-border-strong: rgba(108, 117, 125, 0.28);
        --wk-body-color: #172033;
        --wk-heading-color: #101827;
        --wk-muted-color: #5f6b7a;
        --wk-muted-color-strong: #495057;
        --wk-accent-color: #6f42c1;
        --wk-link-color: #0d6efd;
        --wk-link-hover-color: #084298;
        --wk-active-bg: #172033;
        --wk-active-color: #ffffff;
        --wk-code-bg: #ffffff;
        --wk-code-toolbar-bg: #f8f9fa;
        --wk-code-color: #172033;
    }

    :global([data-bs-theme='dark']) {
        --wk-page-bg: #0b1020;
        --wk-page-bg-gradient:
            radial-gradient(circle at top left, rgba(112, 44, 249, 0.2), transparent 30rem), linear-gradient(180deg, #111827 0%, #0b1020 22rem);
        --wk-surface: rgba(17, 24, 39, 0.9);
        --wk-surface-elevated: #182235;
        --wk-surface-soft: #111827;
        --wk-border: rgba(226, 232, 240, 0.18);
        --wk-border-strong: rgba(226, 232, 240, 0.28);
        --wk-body-color: #e6edf7;
        --wk-heading-color: #f8fbff;
        --wk-muted-color: #b8c4d4;
        --wk-muted-color-strong: #d5dce8;
        --wk-accent-color: #c4b5fd;
        --wk-link-color: #8bb9fe;
        --wk-link-hover-color: #cfe2ff;
        --wk-active-bg: #f8f9fa;
        --wk-active-color: #111827;
        --wk-code-bg: #0f172a;
        --wk-code-toolbar-bg: #111827;
        --wk-code-color: #dbeafe;
    }

    :global(body) {
        background: var(--wk-page-bg-gradient);
        color: var(--wk-body-color);
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
        border: 2px solid #0d6efd;
        border-radius: 0.5rem;
        color: #0d6efd;
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
        background: var(--wk-surface);
        border-right: 1px solid var(--wk-border);
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

    .wk-docs-search {
        border-bottom: 1px solid var(--wk-border);
        margin-bottom: 1.1rem;
        padding-bottom: 1.1rem;
    }

    .wk-docs-search .form-label {
        color: var(--wk-heading-color);
        font-size: 0.86rem;
        font-weight: 800;
        margin-bottom: 0.4rem;
    }

    .wk-docs-search .form-text,
    .wk-search-empty {
        color: var(--wk-muted-color);
        font-size: 0.82rem;
    }

    .wk-search-empty {
        margin: 0;
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
        color: var(--wk-heading-color);
        font-weight: 800;
        letter-spacing: -0.03em;
    }

    .wk-brand-subtitle {
        color: var(--wk-muted-color);
        font-size: 0.82rem;
    }

    .wk-sidebar-nav {
        display: grid;
        gap: 1.1rem;
    }

    .wk-nav-section-label {
        color: var(--wk-accent-color);
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        margin-bottom: 0.45rem;
        text-transform: uppercase;
    }

    .wk-nav-link {
        border-radius: 0.75rem;
        color: var(--wk-muted-color-strong);
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
        color: var(--wk-link-color);
        transform: translateX(0.125rem);
    }

    .wk-nav-link.active {
        background: var(--wk-active-bg);
        color: var(--wk-active-color);
        font-weight: 700;
    }

    .wk-docs-main {
        flex: 1 1 auto;
        min-width: 0;
    }

    .wk-docs-topbar {
        align-items: center;
        backdrop-filter: blur(18px);
        background: var(--wk-surface);
        border-bottom: 1px solid var(--wk-border);
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
        color: var(--wk-muted-color);
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .wk-current-page {
        color: var(--wk-heading-color);
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

    .wk-install-action {
        align-items: center;
        display: inline-flex;
        gap: 0.35rem;
    }

    .wk-install-chip {
        background: var(--wk-active-bg);
        border-radius: 999px;
        color: var(--wk-active-color);
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

    :global(.wk-content p),
    :global(.wk-content li) {
        color: var(--wk-body-color);
    }

    :global(.wk-content .lead),
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
    }

    :global(.wk-content a:not(.btn):hover) {
        color: var(--wk-link-hover-color);
    }

    .wk-mobile-toc {
        background: var(--wk-surface);
        border: 1px solid var(--wk-border);
        border-radius: 0.75rem;
        box-shadow: 0 0.75rem 1.5rem rgba(15, 23, 42, 0.05);
        display: none;
        margin-bottom: 1.25rem;
        padding: 0;
    }

    .wk-mobile-toc summary {
        color: var(--wk-heading-color);
        cursor: pointer;
        font-weight: 800;
        min-height: 44px;
        padding: 0.85rem 1rem;
    }

    .wk-mobile-toc nav {
        margin-top: 0.75rem;
        padding: 0 1rem 1rem;
    }

    .wk-toc {
        display: block;
    }

    .wk-toc-card {
        background: var(--wk-surface);
        border: 1px solid var(--wk-border);
        border-radius: 1.25rem;
        box-shadow: 0 1rem 2rem rgba(15, 23, 42, 0.05);
        padding: 1rem;
        position: sticky;
        top: 6rem;
    }

    .wk-toc-title {
        color: var(--wk-muted-color);
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        margin-bottom: 0.65rem;
        text-transform: uppercase;
    }

    .wk-toc-link {
        color: var(--wk-muted-color-strong);
        display: block;
        font-size: 0.9rem;
        padding: 0.2rem 0;
        text-decoration: none;
    }

    .wk-toc-link:hover {
        color: var(--wk-link-color);
    }

    .wk-toc-empty {
        color: var(--wk-muted-color);
        font-size: 0.9rem;
        list-style: none;
    }

    .wk-resource-links {
        border-top: 1px solid var(--wk-border);
        display: grid;
        gap: 0.4rem;
        margin-top: 1rem;
        padding-top: 1rem;
    }

    .wk-resource-links a {
        color: var(--wk-muted-color-strong);
        font-size: 0.9rem;
        text-decoration: none;
    }

    .wk-resource-links a:hover {
        color: var(--wk-link-color);
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
        background-color: #0f172a;
        border-color: var(--wk-border-strong);
        color: var(--wk-body-color);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .form-control::placeholder) {
        color: #94a3b8;
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .form-floating > .form-control::placeholder) {
        color: transparent;
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .form-label),
    :global([data-bs-theme='dark'] .wk-docs-shell .form-check-label) {
        color: var(--wk-heading-color);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .form-text) {
        color: var(--wk-muted-color);
    }

    :global([data-bs-theme='dark'] .wk-docs-shell .btn-outline-secondary) {
        --bs-btn-color: #d5dce8;
        --bs-btn-border-color: #64748b;
        --bs-btn-hover-bg: #334155;
        --bs-btn-hover-border-color: #94a3b8;
        --bs-btn-hover-color: #ffffff;
        --bs-btn-active-bg: #475569;
        --bs-btn-active-border-color: #94a3b8;
        --bs-btn-active-color: #ffffff;
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

        .wk-mobile-toc {
            display: block;
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
            min-height: 44px;
            min-width: 44px;
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

        .wk-nav-link:hover {
            transform: none;
        }
    }
</style>

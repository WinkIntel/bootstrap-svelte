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

    // Effect to collect all h2 headings after DOM updates
    $effect(() => {
        // Clear headings when route changes
        if (activeRoute) {
            buildPageHeadings();
        }
    });

    onMount(() => {
        if (import.meta.hot) {
            import.meta.hot.on('vite:afterUpdate', () => {
                buildPageHeadings();
            });
        }
    });

    function buildPageHeadings() {
        // Use setTimeout to ensure DOM is fully updated
        setTimeout(() => {
            const headingElements = document.querySelectorAll('h2.wk-quick-link');
            const newHeadings: { id: string; text: string }[] = [];

            headingElements.forEach((heading) => {
                // Get or create an id for the heading
                let id = heading.id;
                if (!id) {
                    // Create slug from text content
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
        }, 100); // Small delay to ensure DOM is ready
    }

    function handleQuickLinkClick(event: MouseEvent): void {
        event.preventDefault();
        const target = event.currentTarget as HTMLAnchorElement;
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.slice(1);
            scrollToHeading(id);
        }
        // Close sidebar on mobile after clicking a quick link
        sidebarIsShown = false;
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
        const sidebar = document.querySelector('.wk-sidebar');
        const toggleButton = document.getElementById('sidebarToggle');
        if (sidebarIsShown && sidebar && !sidebar.contains(target) && toggleButton && !toggleButton.contains(target)) {
            sidebarIsShown = false;
        }
    }
</script>

<svelte:window onresize={handleWindowResize} onkeydown={handleWindowKeyDown} onclick={handleWindowClick} />

<svelte:head>
    <title>Bootstrap Svelte Component Library</title>
</svelte:head>

{#snippet routeMenu(route: RouteType)}
    <li class="nav-item pt-2">
        <span class="text-muted fw-bold mt-5">{route.section.toLocaleUpperCase()}</span>
    </li>
    {#each route.items as item, itemIndex (`item-${itemIndex}`)}
        <li class="nav-item">
            <a href={item.href} class="nav-link py-0" class:active={activeRoute === item.href}>
                {item.label}
            </a>
        </li>
    {/each}
{/snippet}

<!-- Sidebar Overlay for mobile -->
<div
    class={['wk-sidebar-overlay', { show: sidebarIsShown }]}
    onclick={() => (sidebarIsShown = false)}
    onkeyup={(e) => e.key === 'Escape' && (sidebarIsShown = false)}
    role="button"
    tabindex="0">
</div>

<div class="container-fluid p-0">
    <div class="row g-0">
        <!-- Sidebar Navigation -->
        <div class="col-lg-3 col-xl-2">
            <nav class={['wk-sidebar p-3', { show: sidebarIsShown }]}>
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="navbar-brand mb-0">
                        <a class="link-dark text-decoration-none fs-4" href="/">Bootstrap Svelte</a>
                    </h4>
                    <button class="btn btn-outline-secondary d-lg-none" id="sidebarClose" onclick={() => (sidebarIsShown = false)}>
                        <span>&times;</span>
                    </button>
                </div>

                <ul class="nav flex-column">
                    {#each routes as route, routeIndex (`route-${routeIndex}`)}
                        {@render routeMenu(route)}
                    {/each}
                </ul>
            </nav>
        </div>

        <!-- Main Content Area -->
        <div class="col-lg-9 col-xl-10">
            <div class="wk-content-wrapper">
                <div class="row g-0 h-100">
                    <!-- Main Content -->
                    <div class="col-lg-9 main-content">
                        <!-- Top Navigation Bar -->
                        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3 wk-top-navbar">
                            <button
                                class="btn btn-outline-secondary wk-sidebar-toggle me-3"
                                id="sidebarToggle"
                                onclick={() => (sidebarIsShown = !sidebarIsShown)}>
                                <span>☰</span>
                            </button>
                        </nav>
                        <main class="p-4">
                            {#if activeRoute === '/'}
                                <header class="mt-5 text-center">
                                    <h1 class="display-5">Bootstrap Svelte Component Library</h1>
                                    <p class="lead">A Svelte 5 component library based on Bootstrap</p>
                                    <hr class="mt-5" />
                                </header>
                            {/if}
                            {@render children()}
                        </main>
                    </div>

                    <!-- Aside/Quick Links -->
                    <div class="col-lg-3">
                        <aside class="wk-aside">
                            <div class="p-3 border-start">
                                <h5 class="mb-3">Component Info</h5>
                                <div class="mb-3">
                                    <div class="fw-bold mb-2">Quick Links</div>
                                    <ul class="nav flex-column">
                                        {#if pageHeadings.length > 0}
                                            {#each pageHeadings as heading, headingIndex (`heading-${headingIndex}`)}
                                                <li class="nav-item">
                                                    <a href={`#${heading.id}`} class="nav-link py-0 px-0" onclick={handleQuickLinkClick}>
                                                        {heading.text}
                                                    </a>
                                                </li>
                                            {/each}
                                        {:else}
                                            <li class="nav-item">
                                                <span class="nav-link py-1 px-0 text-muted">No sections found</span>
                                            </li>
                                        {/if}
                                    </ul>
                                </div>
                                <div class="mb-3">
                                    <div class="fw-bold mb-2">Resources</div>
                                    <ul class="nav flex-column">
                                        <li class="nav-item">
                                            <a href="https://getbootstrap.com/docs/5.3/" class="nav-link py-0 px-0" target="_blank"
                                                >Bootstrap Docs <i class="bi bi-arrow-up-right-square"></i></a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="https://svelte.dev/docs" class="nav-link py-0 px-0" target="_blank"
                                                >Svelte Docs <i class="bi bi-arrow-up-right-square"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .wk-sidebar {
        background-color: var(--bs-light);
        height: 100vh;
        margin-left: -0.25rem;
        min-height: 100vh;
        overflow-y: auto;
        padding-left: 0.25rem;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        transition: all 0.3s ease;
    }

    .wk-content-wrapper {
        transition: all 0.3s ease;
        min-height: 100vh;
    }

    .wk-top-navbar {
        padding-bottom: 0px;
        padding-top: 0px;
    }

    .wk-sidebar-toggle {
        display: none;
    }

    .nav-link {
        border-radius: 0.375rem;
        color: #495057;
        margin-bottom: 0.25rem;
        padding: 0.75rem 1rem;
    }

    .nav-link:hover {
        background-color: #e9ecef;
        color: #212529;
    }

    .nav-link.active {
        background-color: #0d6efd;
        color: white;
    }

    /* Responsive behavior */
    @media (max-width: 991.98px) {
        .wk-sidebar {
            left: 0;
            position: fixed;
            top: 0;
            transform: translateX(-100%);
            width: 280px;
            z-index: 1050;
        }

        .wk-sidebar.show {
            transform: translateX(0);
        }

        .wk-sidebar-toggle {
            display: inline-block;
        }

        .wk-top-navbar {
            padding-bottom: 1rem;
            padding-top: 1rem;
        }

        .wk-content-wrapper {
            margin-left: 0 !important;
        }
    }

    /* Overlay for mobile sidebar */
    .wk-sidebar-overlay {
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        height: 100%;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1040;
    }

    .wk-sidebar-overlay.show {
        display: block;
    }

    .wk-aside {
        display: block !important;
        height: 100vh;
        overflow-y: auto;
        position: -webkit-sticky;
        position: sticky;
        top: 0;

        @media screen and (max-width: 992px) {
            border-top: 1px solid var(--bs-border-color);
            height: auto;
            position: relative;
        }
    }
</style>

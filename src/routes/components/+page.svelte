<script lang="ts">
    import routeJson from '../(common)/routes.json' with { type: 'json' };
    import type { RouteType } from '../(common)/types.js';

    const componentRoutes: RouteType['items'] = (routeJson as RouteType[]).find((route) => route.section === 'Components')?.items ?? [];
</script>

<svelte:head>
    <title>Components | Bootstrap Svelte</title>
    <meta name="description" content="Browse Bootstrap Svelte component documentation and live examples." />
</svelte:head>

<section class="wk-docs-section">
    <p class="wk-eyebrow">Components</p>
    <h1>Component library</h1>
    <p class="lead">Browse Bootstrap Svelte components, examples, playgrounds, and API notes.</p>
</section>

<section class="wk-docs-section">
    <h2 class="wk-quick-link" id="components">Components</h2>
    <div class="row g-3">
        {#each componentRoutes as componentRoute (componentRoute.href)}
            <div class="col-sm-6 col-xl-4">
                <a class="card h-100 text-decoration-none" href={componentRoute.href}>
                    <div class="card-body">
                        <h3 class="h5 card-title">{componentRoute.label}</h3>
                        <p class="card-text text-body-secondary mb-0">View {componentRoute.label} documentation and examples.</p>
                    </div>
                </a>
            </div>
        {/each}
    </div>
</section>

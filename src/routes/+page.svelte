<script lang="ts">
    import routeJson from './(common)/routes.json' with { type: 'json' };
    import SyntaxHighlighter from './(common)/SyntaxHighlighter.svelte';
    import type { RouteType } from './(common)/types.js';

    const routes: RouteType[] = routeJson as RouteType[];
    const componentCount = routes.reduce((count, section) => count + section.items.length, 0);
    const componentSection = routes.find((section) => section.section === 'Components');
    const featuredComponents = componentSection?.items.slice(0, 8) ?? [];

    const installExample = `pnpm add @winkintel/bootstrap-svelte
pnpm add svelte@~5.0.0`;
    const importExample = `<script>
  import { Alert, Button, Card, Modal } from '@winkintel/bootstrap-svelte';
\u003c/script>

<Alert colorVariant="primary" isDismissible>
  Ship Bootstrap-native interfaces with Svelte 5.
</Alert>`;

    const principles = [
        {
            title: 'Bootstrap-compatible',
            body: 'Component props and generated markup are designed to stay close to Bootstrap conventions.'
        },
        {
            title: 'Svelte-native',
            body: 'Use Svelte 5 components, snippets, bindings, and TypeScript-friendly public APIs.'
        },
        {
            title: 'Docs as playground',
            body: 'The package-local SvelteKit app is both documentation and a live component showcase.'
        }
    ];
</script>

<section class="wk-hero">
    <div class="wk-hero-copy">
        <div class="wk-pill">Svelte 5 · Bootstrap components</div>
        <h1>Bootstrap components, rebuilt for Svelte.</h1>
        <p>
            Bootstrap Svelte packages a focused set of Bootstrap-compatible UI primitives for Svelte 5 apps, with live examples and package-local
            documentation built into this showcase.
        </p>
        <div class="wk-hero-actions">
            <a class="btn btn-primary btn-lg" href="/components/button">Browse components</a>
            <a class="btn btn-outline-dark btn-lg wk-hero-secondary-action" href="#installation">Install package</a>
        </div>
    </div>

    <div class="wk-hero-panel" aria-hidden="true">
        <div class="wk-window-bar">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="wk-preview-card">
            <div class="alert alert-primary d-flex justify-content-between align-items-center" role="alert">
                <span>Bootstrap styling, Svelte ergonomics.</span>
                <span class="badge text-bg-primary">v1.0.1</span>
            </div>
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start gap-3">
                        <div>
                            <h2 class="h5 mb-2">Typed component APIs</h2>
                            <p class="text-secondary mb-0">Compose forms, overlays, navigation, tables, and feedback patterns.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="wk-stats" aria-label="Package highlights">
    <div>
        <strong>{componentCount}</strong>
        <span>documented routes</span>
    </div>
    <div>
        <strong>Svelte 5</strong>
        <span>peer dependency</span>
    </div>
    <div>
        <strong>TypeScript</strong>
        <span>generated definitions</span>
    </div>
    <div>
        <strong>Bootstrap 5</strong>
        <span>design language</span>
    </div>
</section>

<section class="wk-section" id="installation">
    <div class="wk-section-heading">
        <p class="wk-section-kicker">Start here</p>
        <h2 class="wk-quick-link">Installation</h2>
        <p>Add the package and import Bootstrap CSS from your app entry point or stylesheet pipeline.</p>
    </div>
    <div class="wk-code-grid">
        <div>
            <h3>Install</h3>
            <SyntaxHighlighter code={installExample} />
        </div>
        <div>
            <h3>Use</h3>
            <SyntaxHighlighter code={importExample} />
        </div>
    </div>
</section>

<section class="wk-section">
    <div class="wk-section-heading">
        <p class="wk-section-kicker">Explore</p>
        <h2 class="wk-quick-link">Featured components</h2>
        <p>Jump into the component pages for live examples, usage snippets, and API notes.</p>
    </div>
    <div class="wk-component-grid">
        {#each featuredComponents as component (component.href)}
            <a class="wk-component-card" href={component.href}>
                <span>{component.label}</span>
                <small>View examples →</small>
            </a>
        {/each}
    </div>
</section>

<section class="wk-section">
    <div class="wk-section-heading">
        <p class="wk-section-kicker">Direction</p>
        <h2 class="wk-quick-link">Design principles</h2>
        <p>The showcase is structured to make public package review fast: installation first, examples second, and API details close by.</p>
    </div>
    <div class="wk-principle-grid">
        {#each principles as principle (principle.title)}
            <article>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
            </article>
        {/each}
    </div>
</section>

<section class="wk-section wk-next-steps">
    <div>
        <p class="wk-section-kicker">Next</p>
        <h2 class="wk-quick-link">What to review</h2>
        <p>Review the license, npm package metadata, component API consistency, accessibility notes, and showcase visual direction.</p>
    </div>
    <a class="btn btn-dark" href="/components/accordion">Open first component</a>
</section>

<style>
    .wk-hero {
        align-items: center;
        display: grid;
        gap: 2rem;
        grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.9fr);
        margin-bottom: 2rem;
        min-height: 34rem;
    }

    .wk-hero-copy h1 {
        color: var(--wk-heading-color);
        font-size: 4.75rem;
        font-weight: 850;
        letter-spacing: 0;
        line-height: 1;
        margin: 1rem 0;
        max-width: 14ch;
    }

    .wk-hero-copy p {
        color: var(--wk-muted-color);
        font-size: 1.18rem;
        line-height: 1.65;
        max-width: 46rem;
    }

    .wk-pill,
    .wk-section-kicker {
        color: var(--wk-accent-color);
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.13em;
        text-transform: uppercase;
    }

    .wk-pill {
        background: rgba(111, 66, 193, 0.08);
        border: 1px solid rgba(111, 66, 193, 0.18);
        border-radius: 999px;
        display: inline-flex;
        padding: 0.5rem 0.85rem;
    }

    .wk-hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 2rem;
    }

    .wk-hero-panel {
        background: linear-gradient(135deg, rgba(13, 110, 253, 0.12), rgba(111, 66, 193, 0.14)), var(--wk-surface);
        border: 1px solid var(--wk-border);
        border-radius: 2rem;
        box-shadow: 0 2rem 5rem rgba(15, 23, 42, 0.12);
        overflow: hidden;
        padding: 1rem;
    }

    .wk-window-bar {
        display: flex;
        gap: 0.4rem;
        padding: 0.35rem 0.35rem 1rem;
    }

    .wk-window-bar span {
        background: color-mix(in srgb, var(--wk-body-color) 22%, transparent);
        border-radius: 999px;
        height: 0.75rem;
        width: 0.75rem;
    }

    .wk-preview-card {
        background: var(--wk-surface-elevated);
        border-radius: 1.25rem;
        display: grid;
        gap: 1rem;
        padding: 1rem;
    }

    .wk-stats {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-bottom: 4rem;
    }

    .wk-stats div,
    .wk-component-card,
    .wk-principle-grid article,
    .wk-next-steps,
    .wk-code-grid > div {
        background: var(--wk-surface);
        border: 1px solid var(--wk-border);
        border-radius: 1.25rem;
        box-shadow: 0 1rem 2rem rgba(15, 23, 42, 0.05);
    }

    .wk-stats div {
        padding: 1.1rem;
    }

    .wk-stats strong,
    .wk-stats span {
        display: block;
    }

    .wk-stats strong {
        color: var(--wk-heading-color);
        font-size: 1.35rem;
        letter-spacing: -0.04em;
    }

    .wk-stats span {
        color: var(--wk-muted-color);
        font-size: 0.92rem;
        margin-top: 0.2rem;
    }

    .wk-section {
        margin: 4rem 0;
    }

    .wk-section-heading {
        margin-bottom: 1.25rem;
        max-width: 48rem;
    }

    .wk-section-heading h2,
    .wk-next-steps h2 {
        font-size: clamp(2rem, 4vw, 3.3rem);
        font-weight: 820;
        letter-spacing: -0.06em;
        line-height: 1;
        margin: 0.35rem 0 0.75rem;
    }

    .wk-section-heading p,
    .wk-next-steps p {
        color: var(--wk-muted-color);
        font-size: 1.05rem;
        line-height: 1.7;
    }

    .wk-code-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .wk-code-grid > div {
        min-width: 0;
        padding: 1.1rem;
    }

    .wk-code-grid h3 {
        font-size: 1rem;
        font-weight: 800;
        margin-bottom: 0.85rem;
    }

    .wk-component-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .wk-component-card {
        color: var(--wk-heading-color);
        display: grid;
        min-height: 8rem;
        padding: 1.1rem;
        text-decoration: none;
        transition:
            border-color 0.16s ease,
            transform 0.16s ease,
            box-shadow 0.16s ease;
    }

    .wk-component-card:hover {
        border-color: rgba(13, 110, 253, 0.45);
        box-shadow: 0 1.25rem 2.5rem rgba(13, 110, 253, 0.12);
        transform: translateY(-0.2rem);
    }

    .wk-component-card span {
        font-size: 1.15rem;
        font-weight: 800;
    }

    .wk-component-card small {
        align-self: end;
        color: var(--wk-link-color);
        font-weight: 700;
    }

    .wk-principle-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .wk-principle-grid article {
        padding: 1.25rem;
    }

    .wk-principle-grid h3 {
        font-size: 1.2rem;
        font-weight: 800;
        letter-spacing: -0.03em;
    }

    .wk-principle-grid p {
        color: var(--wk-muted-color);
        line-height: 1.65;
        margin-bottom: 0;
    }

    .wk-next-steps {
        align-items: center;
        display: flex;
        gap: 2rem;
        justify-content: space-between;
        padding: 1.5rem;
    }

    .wk-next-steps p {
        margin-bottom: 0;
        max-width: 58rem;
    }

    :global([data-bs-theme='dark']) .wk-hero-copy h1 {
        color: #f8fbff;
        text-shadow: 0 0.08rem 1.25rem rgba(139, 185, 254, 0.12);
    }

    :global([data-bs-theme='dark']) .wk-hero-copy p {
        color: #cbd5e1;
    }

    :global([data-bs-theme='dark']) .wk-pill {
        background: rgba(196, 181, 253, 0.16);
        border-color: rgba(196, 181, 253, 0.42);
        color: #ddd6fe;
    }

    :global([data-bs-theme='dark']) .wk-hero-secondary-action {
        --bs-btn-color: #f8fbff;
        --bs-btn-border-color: #94a3b8;
        --bs-btn-hover-bg: #f8fbff;
        --bs-btn-hover-border-color: #f8fbff;
        --bs-btn-hover-color: #0b1020;
        --bs-btn-active-bg: #e2e8f0;
        --bs-btn-active-border-color: #e2e8f0;
        --bs-btn-active-color: #0b1020;
    }

    :global([data-bs-theme='dark']) .wk-hero-panel {
        background: linear-gradient(135deg, rgba(13, 110, 253, 0.18), rgba(196, 181, 253, 0.14)), #111827;
        box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.34);
    }

    :global([data-bs-theme='dark']) .wk-preview-card {
        background: #182235;
    }

    @media (max-width: 1199.98px) {
        .wk-hero,
        .wk-code-grid,
        .wk-principle-grid {
            grid-template-columns: 1fr;
        }

        .wk-stats,
        .wk-component-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 575.98px) {
        .wk-hero {
            min-height: auto;
            padding-top: 2rem;
        }

        .wk-hero-copy h1 {
            font-size: 2.75rem;
        }

        .wk-stats,
        .wk-component-grid {
            grid-template-columns: 1fr;
        }

        .wk-next-steps {
            align-items: flex-start;
            flex-direction: column;
        }
    }
</style>

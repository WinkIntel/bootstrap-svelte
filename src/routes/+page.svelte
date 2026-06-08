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
        <div class="wk-pill">Private preview · Svelte 5 · Bootstrap components</div>
        <h1>Bootstrap components, rebuilt for Svelte.</h1>
        <p>
            Bootstrap Svelte packages a focused set of Bootstrap-compatible UI primitives for Svelte 5 apps, with live examples and package-local
            documentation built into this showcase.
        </p>
        <div class="wk-hero-actions">
            <a class="btn btn-primary btn-lg" href="/components/button">Browse components</a>
            <a class="btn btn-outline-dark btn-lg" href="#installation">Install package</a>
        </div>
    </div>

    <div class="wk-hero-panel" aria-label="Package preview">
        <div class="wk-window-bar">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="wk-preview-card">
            <div class="alert alert-primary d-flex justify-content-between align-items-center" role="alert">
                <span>Bootstrap styling, Svelte ergonomics.</span>
                <span class="badge text-bg-primary">v0.0.1</span>
            </div>
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start gap-3">
                        <div>
                            <h2 class="h5 mb-2">Typed component APIs</h2>
                            <p class="text-secondary mb-0">Compose forms, overlays, navigation, tables, and feedback patterns.</p>
                        </div>
                        <button class="btn btn-dark btn-sm" type="button">Preview</button>
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
        <p>
            Before public release, review the placeholder license, npm package metadata, component API consistency, accessibility notes, and the final
            showcase visual direction.
        </p>
    </div>
    <a class="btn btn-dark" href="/components/alert">Open first component</a>
</section>

<style>
    .wk-hero {
        align-items: center;
        display: grid;
        gap: 2rem;
        grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.9fr);
        margin-bottom: 2rem;
        min-height: calc(100vh - 10rem);
    }

    .wk-hero-copy h1 {
        color: #101827;
        font-size: clamp(3rem, 8vw, 6.7rem);
        font-weight: 850;
        letter-spacing: -0.075em;
        line-height: 0.92;
        margin: 1rem 0;
        max-width: 12ch;
    }

    .wk-hero-copy p {
        color: #5f6b7a;
        font-size: clamp(1.1rem, 2vw, 1.35rem);
        line-height: 1.65;
        max-width: 46rem;
    }

    .wk-pill,
    .wk-section-kicker {
        color: #6f42c1;
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
        background: linear-gradient(135deg, rgba(13, 110, 253, 0.12), rgba(111, 66, 193, 0.14)), rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(108, 117, 125, 0.16);
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
        background: rgba(23, 32, 51, 0.22);
        border-radius: 999px;
        height: 0.75rem;
        width: 0.75rem;
    }

    .wk-preview-card {
        background: #fff;
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
        background: rgba(255, 255, 255, 0.82);
        border: 1px solid rgba(108, 117, 125, 0.16);
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
        color: #172033;
        font-size: 1.35rem;
        letter-spacing: -0.04em;
    }

    .wk-stats span {
        color: #6c757d;
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
        color: #5f6b7a;
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
        color: #172033;
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
        color: #0d6efd;
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
        color: #5f6b7a;
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

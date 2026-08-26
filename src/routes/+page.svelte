<script lang="ts">
    import { Alert, Badge, Button } from '$lib/index.js';
    import routeJson from './(common)/routes.json' with { type: 'json' };
    import SyntaxHighlighter from './(common)/SyntaxHighlighter.svelte';
    import type { RouteType } from './(common)/types.js';

    const routes: RouteType[] = routeJson as RouteType[];
    const componentCount = routes.reduce((count, section) => count + section.items.length, 0);

    const sectionIcons: Record<string, string> = {
        Guides: 'bi-compass',
        Layout: 'bi-grid-1x2',
        Components: 'bi-boxes',
        Form: 'bi-ui-checks'
    };

    const installExample = `pnpm add @winkintel/bootstrap-svelte bootstrap`;
    const peerDependencyExample = `svelte: ^5.29.0`;
    const importExample = `<script>
  import { Alert, Button, Card, Modal } from '@winkintel/bootstrap-svelte';
\u003c/script>

<Alert colorVariant="primary" isDismissible>
  Ship Bootstrap-native interfaces with Svelte 5.
</Alert>`;

    const principles = [
        {
            icon: 'bi-bootstrap',
            title: 'Bootstrap-compatible',
            body: 'Component props and generated markup are designed to stay close to Bootstrap conventions.'
        },
        {
            icon: 'bi-lightning-charge',
            title: 'Svelte-native',
            body: 'Use Svelte 5 components, snippets, bindings, and TypeScript-friendly public APIs.'
        },
        {
            icon: 'bi-journal-code',
            title: 'Docs as playground',
            body: 'The package-local SvelteKit app is both documentation and a live component showcase.'
        }
    ];

    let demoProgress: number = $state(72);
</script>

<section class="wk-hero">
    <div class="wk-hero-copy">
        <div class="wk-pill">
            <span class="wk-pill-dot" aria-hidden="true"></span>
            Svelte 5 · Bootstrap 5 · TypeScript
        </div>
        <h1>Bootstrap 5 components <span class="wk-hero-gradient">for Svelte 5</span></h1>
        <p>
            <code>@winkintel/bootstrap-svelte</code> provides Bootstrap 5 components for Svelte 5 and SvelteKit with TypeScript-friendly, runes-ready APIs.
            Add Bootstrap CSS in your app; Bootstrap JavaScript is not required.
        </p>
        <div class="wk-hero-actions">
            <a class="btn btn-lg wk-btn-gradient" href="/components/button">
                Browse components
                <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>
            </a>
            <a class="btn btn-lg wk-btn-ghost" href="#installation">Install package</a>
            <a class="btn btn-lg wk-btn-ghost" href="https://www.npmjs.com/package/@winkintel/bootstrap-svelte" target="_blank" rel="noreferrer">
                npm
                <i class="bi bi-arrow-up-right ms-1" aria-hidden="true"></i>
            </a>
            <a class="btn btn-lg wk-btn-ghost" href="https://github.com/WinkIntel/bootstrap-svelte" target="_blank" rel="noreferrer">
                GitHub
                <i class="bi bi-arrow-up-right ms-1" aria-hidden="true"></i>
            </a>
        </div>
    </div>

    <div class="wk-hero-panel" data-markdown="skip">
        <div class="wk-window-bar">
            <span></span>
            <span></span>
            <span></span>
            <code>+page.svelte</code>
        </div>
        <div class="wk-preview-card">
            <Alert colorVariant="primary" class="d-flex justify-content-between align-items-center mb-0">
                <span>Bootstrap styling, Svelte ergonomics.</span>
                <Badge colorVariant="text-bg-primary">Live</Badge>
            </Alert>
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                        <h2 class="h6 mb-0">Typed component APIs</h2>
                        <Badge colorVariant="text-bg-success" isPill>Runes</Badge>
                    </div>
                    <p class="text-secondary small mb-3">Compose forms, overlays, navigation, tables, and feedback patterns.</p>
                    <div
                        class="progress mb-3"
                        role="progressbar"
                        aria-label="Demo progress"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={demoProgress}
                        style="--bs-progress-bar-bg: var(--wk-accent-color)">
                        <div class="progress-bar" style={`width: ${demoProgress}%`}></div>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <Button colorVariant="primary" size="sm" onclick={() => (demoProgress = Math.min(100, demoProgress + 7))}>Increment</Button>
                        <Button colorVariant="outline-secondary" size="sm" onclick={() => (demoProgress = 72)}>Reset</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="wk-stats" aria-label="Package highlights" data-markdown="skip">
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
        <p class="wk-section-kicker" data-markdown="skip">Start here</p>
        <h2 class="wk-quick-link">Installation</h2>
        <p>
            Add the package with Bootstrap. Svelte <code>^5.29.0</code> is a peer dependency, so keep your app on Svelte 5 separately from the package install
            command.
        </p>
    </div>
    <div class="wk-code-grid">
        <div>
            <h3><span class="wk-step-badge">1</span> Install</h3>
            <SyntaxHighlighter code={installExample} />
            <p class="small text-secondary mt-3 mb-0">Peer dependency: <code>{peerDependencyExample}</code></p>
        </div>
        <div>
            <h3><span class="wk-step-badge">2</span> Use</h3>
            <SyntaxHighlighter code={importExample} />
        </div>
    </div>
</section>

<section class="wk-section">
    <div class="wk-section-heading">
        <p class="wk-section-kicker" data-markdown="skip">Explore</p>
        <h2 class="wk-quick-link">Everything in the box</h2>
        <p>Every route ships live examples, usage snippets, an interactive playground, and API notes.</p>
    </div>
    {#each routes as route (route.section)}
        <div class="wk-index-section">
            <h3>
                <i class={`bi ${sectionIcons[route.section] ?? 'bi-box'}`} aria-hidden="true"></i>
                {route.section}
            </h3>
            <div class="wk-component-grid">
                {#each route.items as item (item.href)}
                    <a class="wk-component-card" href={item.href}>
                        <span>{item.label}</span>
                        <i class="bi bi-arrow-right" aria-hidden="true"></i>
                    </a>
                {/each}
            </div>
        </div>
    {/each}
</section>

<section class="wk-section">
    <div class="wk-section-heading">
        <p class="wk-section-kicker" data-markdown="skip">Direction</p>
        <h2 class="wk-quick-link">Design principles</h2>
        <p>The showcase is structured to make public package review fast: installation first, examples second, and API details close by.</p>
    </div>
    <div class="wk-principle-grid">
        {#each principles as principle (principle.title)}
            <article>
                <span class="wk-principle-icon"><i class={`bi ${principle.icon}`} aria-hidden="true"></i></span>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
            </article>
        {/each}
    </div>
</section>

<section class="wk-section wk-next-steps">
    <div>
        <p class="wk-section-kicker" data-markdown="skip">Next</p>
        <h2 class="wk-quick-link">What to review</h2>
        <p>Review the license, npm package metadata, component API consistency, accessibility notes, and showcase visual direction.</p>
    </div>
    <a class="btn wk-btn-gradient" href="/components/accordion">
        Open first component
        <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>
    </a>
</section>

<style>
    .wk-hero {
        align-items: center;
        display: grid;
        gap: 3rem;
        grid-template-columns: minmax(0, 1.05fr) minmax(20rem, 0.95fr);
        padding: 3rem 0 4rem;
    }

    .wk-hero-copy h1 {
        color: var(--wk-heading-color);
        font-size: clamp(2.7rem, 4.2vw, 3.6rem);
        font-weight: 850;
        letter-spacing: -0.035em;
        line-height: 1.05;
        margin: 1.1rem 0 1.25rem;
        max-width: 21ch;
    }

    .wk-hero-gradient {
        background: var(--wk-gradient-brand);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }

    .wk-hero-copy p {
        color: var(--wk-muted-color);
        font-size: 1.14rem;
        line-height: 1.7;
        max-width: 34rem;
    }

    .wk-pill,
    .wk-section-kicker {
        color: var(--wk-accent-color);
        font-size: 0.74rem;
        font-weight: 800;
        letter-spacing: 0.13em;
        text-transform: uppercase;
    }

    .wk-pill {
        align-items: center;
        background: var(--wk-accent-soft);
        border: 1px solid var(--wk-accent-border);
        border-radius: 999px;
        display: inline-flex;
        gap: 0.5rem;
        padding: 0.45rem 0.85rem;
    }

    .wk-pill-dot {
        animation: wk-pulse 2.2s ease-in-out infinite;
        background: var(--wk-accent-color);
        border-radius: 999px;
        height: 0.45rem;
        width: 0.45rem;
    }

    @keyframes wk-pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.35;
        }
    }

    .wk-hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 2rem;
    }

    :global(.wk-btn-gradient) {
        --bs-btn-color: #ffffff;
        --bs-btn-bg: transparent;
        --bs-btn-border-color: transparent;
        --bs-btn-hover-color: #ffffff;
        --bs-btn-hover-border-color: transparent;
        --bs-btn-active-color: #ffffff;
        --bs-btn-active-border-color: transparent;
        background: var(--wk-gradient-brand);
        border-radius: 999px;
        box-shadow: 0 10px 24px -10px rgba(94, 44, 237, 0.6);
        font-weight: 700;
        transition:
            box-shadow 0.16s ease,
            filter 0.16s ease,
            transform 0.16s ease;
    }

    :global(.wk-btn-gradient:hover) {
        box-shadow: 0 14px 30px -10px rgba(94, 44, 237, 0.7);
        filter: brightness(1.06);
        transform: translateY(-1px);
    }

    :global(.wk-btn-gradient:focus-visible),
    .wk-btn-ghost:focus-visible {
        outline: 2px solid var(--wk-accent-color);
        outline-offset: 2px;
    }

    .wk-btn-ghost {
        --bs-btn-color: var(--wk-heading-color);
        --bs-btn-bg: var(--wk-surface);
        --bs-btn-border-color: var(--wk-border-strong);
        --bs-btn-hover-color: var(--wk-accent-color);
        --bs-btn-hover-bg: var(--wk-surface);
        --bs-btn-hover-border-color: var(--wk-accent-border);
        --bs-btn-active-color: var(--wk-accent-color);
        --bs-btn-active-bg: var(--wk-surface);
        --bs-btn-active-border-color: var(--wk-accent-border);
        border-radius: 999px;
        font-weight: 600;
    }

    .wk-hero-panel {
        background: var(--wk-surface);
        border: 1px solid var(--wk-border);
        border-radius: 1.5rem;
        box-shadow: var(--wk-shadow-lg);
        overflow: hidden;
        padding: 0;
        position: relative;
    }

    .wk-hero-panel::before {
        background: var(--wk-gradient-brand);
        content: '';
        height: 3px;
        inset: 0 0 auto;
        position: absolute;
    }

    .wk-window-bar {
        align-items: center;
        border-bottom: 1px solid var(--wk-border);
        display: flex;
        gap: 0.4rem;
        padding: 0.85rem 1.1rem;
    }

    .wk-window-bar span {
        background: color-mix(in srgb, var(--wk-body-color) 22%, transparent);
        border-radius: 999px;
        height: 0.6rem;
        width: 0.6rem;
    }

    .wk-window-bar code {
        color: var(--wk-muted-color);
        font-size: 0.72rem;
        margin-left: 0.5rem;
    }

    .wk-preview-card {
        display: grid;
        gap: 1rem;
        padding: 1.25rem;
    }

    .wk-stats {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
        margin-bottom: 4rem;
    }

    .wk-stats div,
    .wk-principle-grid article,
    .wk-next-steps,
    .wk-code-grid > div {
        background: var(--wk-surface);
        border: 1px solid var(--wk-border);
        border-radius: 1.1rem;
        box-shadow: var(--wk-shadow-sm);
    }

    .wk-stats div {
        padding: 1.2rem 1.3rem;
    }

    .wk-stats strong,
    .wk-stats span {
        display: block;
    }

    .wk-stats strong {
        color: var(--wk-heading-color);
        font-size: 1.45rem;
        font-weight: 800;
        letter-spacing: -0.03em;
    }

    .wk-stats span {
        color: var(--wk-muted-color);
        font-size: 0.88rem;
        margin-top: 0.15rem;
    }

    .wk-section {
        margin: 4.5rem 0;
    }

    .wk-section-heading {
        margin-bottom: 1.75rem;
        max-width: 48rem;
    }

    .wk-section-heading h2,
    .wk-next-steps h2 {
        font-size: clamp(1.8rem, 3vw, 2.5rem);
        font-weight: 830;
        letter-spacing: -0.04em;
        line-height: 1.05;
        margin: 0.35rem 0 0.75rem;
    }

    .wk-section-heading p,
    .wk-next-steps p {
        color: var(--wk-muted-color);
        font-size: 1.02rem;
        line-height: 1.7;
    }

    .wk-code-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .wk-code-grid > div {
        min-width: 0;
        padding: 1.2rem;
    }

    .wk-code-grid h3 {
        align-items: center;
        display: flex;
        font-size: 0.95rem;
        font-weight: 750;
        gap: 0.5rem;
        margin-bottom: 0.9rem;
    }

    .wk-step-badge {
        align-items: center;
        background: var(--wk-accent-soft);
        border: 1px solid var(--wk-accent-border);
        border-radius: 999px;
        color: var(--wk-accent-color);
        display: inline-flex;
        font-size: 0.72rem;
        font-weight: 800;
        height: 1.4rem;
        justify-content: center;
        width: 1.4rem;
    }

    .wk-index-section {
        margin-bottom: 2rem;
    }

    .wk-index-section h3 {
        align-items: center;
        color: var(--wk-muted-color);
        display: flex;
        font-size: 0.76rem;
        font-weight: 800;
        gap: 0.5rem;
        letter-spacing: 0.13em;
        margin-bottom: 0.85rem;
        text-transform: uppercase;
    }

    .wk-index-section h3 i {
        color: var(--wk-accent-color);
    }

    .wk-component-grid {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
    }

    :global(.wk-content) a.wk-component-card {
        color: var(--wk-heading-color);
    }

    .wk-component-card {
        align-items: center;
        background: var(--wk-surface);
        border: 1px solid var(--wk-border);
        border-radius: 0.85rem;
        box-shadow: var(--wk-shadow-sm);
        color: var(--wk-heading-color);
        display: flex;
        justify-content: space-between;
        padding: 0.85rem 1.05rem;
        text-decoration: none;
        transition:
            border-color 0.16s ease,
            box-shadow 0.16s ease,
            transform 0.16s ease;
    }

    .wk-component-card:hover {
        border-color: var(--wk-accent-border);
        box-shadow: var(--wk-shadow-md);
        transform: translateY(-2px);
    }

    .wk-component-card span {
        font-size: 0.95rem;
        font-weight: 650;
    }

    .wk-component-card i {
        color: var(--wk-accent-color);
        opacity: 0;
        transform: translateX(-0.25rem);
        transition:
            opacity 0.16s ease,
            transform 0.16s ease;
    }

    .wk-component-card:hover i {
        opacity: 1;
        transform: translateX(0);
    }

    .wk-principle-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .wk-principle-grid article {
        padding: 1.5rem;
    }

    .wk-principle-icon {
        align-items: center;
        background: var(--wk-accent-soft);
        border: 1px solid var(--wk-accent-border);
        border-radius: 0.85rem;
        color: var(--wk-accent-color);
        display: inline-flex;
        font-size: 1.15rem;
        height: 2.6rem;
        justify-content: center;
        margin-bottom: 1rem;
        width: 2.6rem;
    }

    .wk-principle-grid h3 {
        font-size: 1.12rem;
        font-weight: 750;
        letter-spacing: -0.02em;
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
        padding: 2rem;
    }

    .wk-next-steps p {
        margin-bottom: 0;
        max-width: 58rem;
    }

    @media (max-width: 1399.98px) {
        .wk-hero {
            grid-template-columns: 1fr;
            padding-top: 1.5rem;
        }

        .wk-hero-panel {
            max-width: 34rem;
        }
    }

    @media (max-width: 1199.98px) {
        .wk-code-grid,
        .wk-principle-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 575.98px) {
        .wk-hero {
            padding-top: 0.5rem;
        }

        .wk-next-steps {
            align-items: flex-start;
            flex-direction: column;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .wk-pill-dot {
            animation: none;
        }

        .wk-component-card:hover,
        :global(.wk-btn-gradient:hover) {
            transform: none;
        }

        .wk-component-card i,
        .wk-component-card:hover i {
            transform: none;
            transition: none;
        }
    }
</style>

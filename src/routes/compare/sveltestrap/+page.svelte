<div>
    <div class="mb-4">
        <h1>Bootstrap Svelte vs Sveltestrap for Svelte 5</h1>
        <p class="lead">
            Both projects provide Bootstrap 5 components for Svelte. The practical difference is whether you want a Svelte 5-first,
            TypeScript-authored API or a library that also supports Svelte 4 and keeps a classic Svelte component style.
        </p>
        <p class="text-secondary">Primary-source review completed August 26, 2026. Recheck package contracts before a migration.</p>
        <hr />
    </div>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Quick Comparison</h2>
        <div class="table-responsive">
            <table class="table table-bordered align-middle">
                <thead>
                    <tr>
                        <th scope="col">Decision point</th>
                        <th scope="col">Bootstrap Svelte</th>
                        <th scope="col">Sveltestrap</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">Svelte support</th>
                        <td>Svelte <code>^5.29.0</code>; designed as a Svelte 5 library.</td>
                        <td>Svelte 4, Svelte 5, and the Svelte 5 prerelease range declared by its package.</td>
                    </tr>
                    <tr>
                        <th scope="row">API and typing</th>
                        <td>TypeScript-authored components, Svelte 5 runes, and composable namespaces such as <code>Modal.Root</code>.</td>
                        <td>Classic Svelte component APIs with flat exports and distributed declaration files.</td>
                    </tr>
                    <tr>
                        <th scope="row">Bootstrap assets</th>
                        <td>Install Bootstrap separately and import Bootstrap CSS or SCSS. Do not add Bootstrap JavaScript plugins.</td>
                        <td>Add Bootstrap CSS separately. Its README says Bootstrap JavaScript and jQuery are not required.</td>
                    </tr>
                    <tr>
                        <th scope="row">Component shape</th>
                        <td>Focused Bootstrap 5 layout, form, and component families with compound subcomponents.</td>
                        <td>A broad Reactstrap-style inventory with granular exports, including additional utility components.</td>
                    </tr>
                    <tr>
                        <th scope="row">SSR and testing evidence</th>
                        <td>Uses browser lifecycle guards and includes unit, interaction, accessibility, and targeted server-rendering tests.</td>
                        <td>Includes unit and SvelteKit integration fixtures; browser-only portal work is deferred to <code>onMount</code>.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Which Should You Choose?</h2>
        <ul>
            <li>
                Choose <strong>Bootstrap Svelte</strong> for a Svelte 5-first codebase that values TypeScript-authored APIs, runes, compound component namespaces,
                and package documentation available as HTML and Markdown.
            </li>
            <li>
                Choose <strong>Sveltestrap</strong> when Svelte 4 compatibility, an existing Sveltestrap integration, or its classic flat component API
                is the stronger constraint.
            </li>
            <li>For overlays, portals, or a large migration, smoke-test SSR and hydration in your own SvelteKit deployment before committing.</li>
        </ul>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Primary Sources</h2>
        <ul>
            <li>
                Bootstrap Svelte:
                <a href="https://github.com/WinkIntel/bootstrap-svelte/blob/main/package.json">package contract</a>,
                <a href="https://github.com/WinkIntel/bootstrap-svelte/blob/main/README.md">installation and API guidance</a>, and
                <a href="https://github.com/WinkIntel/bootstrap-svelte/tree/main/src/lib">component source and tests</a>.
            </li>
            <li>
                Sveltestrap:
                <a href="https://github.com/sveltestrap/sveltestrap/blob/main/package.json">package contract</a>,
                <a href="https://github.com/sveltestrap/sveltestrap/blob/main/README.md">installation guidance</a>,
                <a href="https://github.com/sveltestrap/sveltestrap/tree/main/src">component source</a>, and
                <a href="https://sveltestrap.js.org/">Storybook documentation</a>.
            </li>
        </ul>
    </section>
</div>

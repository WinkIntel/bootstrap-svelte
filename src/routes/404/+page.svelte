<script lang="ts">
    import routeJson from '../(common)/routes.json' with { type: 'json' };
    import type { RouteType } from '../(common)/types.js';

    const routes: RouteType[] = routeJson as RouteType[];
</script>

<div>
    <div class="mb-5">
        <h1>Page not found</h1>
        <p class="lead">
            The address you requested does not exist on this site (HTTP 404). Nothing was moved; the links below cover everything here.
        </p>
        <hr />
    </div>

    <section class="mb-5" id="where-to-look-next">
        <h2 class="wk-quick-link">Where to look next</h2>
        <ul>
            <li><a href="/">Overview</a>: installation, quick start, and the component index.</li>
            <li><a href="/llms.txt">llms.txt</a>: documentation index with one-line summaries of every page.</li>
            <li><a href="/llms-full.txt">llms-full.txt</a>: every page in a single Markdown file.</li>
            <li><a href="/agents.md">agents.md</a>: when to use Bootstrap Svelte and how to integrate it.</li>
            <li><a href="/sitemap.xml">sitemap.xml</a>: every URL with last-modified dates.</li>
        </ul>
        <p>
            Every documentation page is also available as Markdown: request it with <code>Accept: text/markdown</code> or append <code>.md</code> to its
            path.
        </p>
    </section>

    <section class="mb-5" id="documentation">
        <h2 class="wk-quick-link">Documentation</h2>
        {#each routes as route (route.section)}
            <h3 class="h5 mt-4">{route.section}</h3>
            <ul>
                {#each route.items as item (item.href)}
                    <li><a href={item.href}>{item.label}</a></li>
                {/each}
            </ul>
        {/each}
        <h3 class="h5 mt-4">Project</h3>
        <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy</a></li>
        </ul>
    </section>
</div>

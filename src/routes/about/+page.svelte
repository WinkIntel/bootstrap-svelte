<script lang="ts">
    import { site } from '../(common)/site.js';
</script>

<div>
    <div class="mb-5">
        <h1>About Bootstrap Svelte</h1>
        <p class="lead">
            Bootstrap Svelte is an open-source library of Bootstrap 5 components for Svelte 5, built and maintained by {site.organization.name} ({site
                .organization.alternateName}).
        </p>
        <hr />
    </div>

    <section class="mb-5" id="what-it-is">
        <h2 class="wk-quick-link">What it is</h2>
        <p>
            The package, published on npm as <code>{site.packageName}</code>, provides ready-to-use, type-safe Bootstrap components for Svelte 5
            applications written in runes mode. It follows Bootstrap's design language and class conventions while exposing Svelte-native component
            APIs, so teams get Bootstrap's familiar grid, utilities, and UI patterns without copying Bootstrap markup and JavaScript behavior by hand.
        </p>
        <p>
            The library covers layout primitives (Container, Row, Col, Breakpoint), content components (Accordion, Alert, Badge, Card, List Group,
            Placeholder, Progress, Spinner, Table), navigation (Breadcrumb, Nav, Navbar, Pagination, Scrollspy, Tab), interactive components (Button,
            Button Group, Carousel, Close Button, Collapse, Dropdown, Modal, Offcanvas, Popover, Toast, Tooltip), and form controls with input groups,
            layout helpers, and validation feedback.
        </p>
    </section>

    <section class="mb-5" id="why-it-exists">
        <h2 class="wk-quick-link">Why it exists</h2>
        <p>
            Bootstrap remains a practical choice for product, enterprise, and internal applications: it is familiar, well documented, stable, and easy
            for mixed frontend and backend teams to work with. Bootstrap Svelte is for teams that specifically want Bootstrap in a Svelte 5 app but
            would rather use maintained Svelte components than hand-roll Bootstrap's required markup and interactive behavior for every project. It
            does not try to replace Tailwind, shadcn-style workflows, or fully custom design systems.
        </p>
    </section>

    <section class="mb-5" id="who-maintains-it">
        <h2 class="wk-quick-link">Who maintains it</h2>
        <p>
            {site.organization.name} is a software and market-intelligence company based in {site.organization.address.addressLocality}, Iowa, United
            States. It publishes Bootstrap Svelte from the
            <a href={site.organization.githubUrl} target="_blank" rel="noreferrer">WinkIntel organization on GitHub</a>
            and uses the library in its own Svelte applications. Company information is available at
            <a href={site.organization.url} target="_blank" rel="noreferrer">winkintel.com</a>; ways to reach the maintainers are listed on the
            <a href="/contact">contact page</a>.
        </p>
    </section>

    <section class="mb-5" id="license-and-versions">
        <h2 class="wk-quick-link">License and versions</h2>
        <p>
            Bootstrap Svelte is released under the
            <a href={site.license.url} target="_blank" rel="noreferrer">Apache License 2.0</a>. The current published version is
            <code>{site.version}</code>, available from the
            <a href={site.npmUrl} target="_blank" rel="noreferrer">npm registry</a>
            and developed in the
            <a href={site.repositoryUrl} target="_blank" rel="noreferrer">GitHub repository</a>. Release notes are kept in the repository's
            <a href={`${site.repositoryUrl}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer">changelog</a>. The package requires Svelte 5 as
            a peer dependency and expects the consuming application to provide Bootstrap 5 CSS.
        </p>
    </section>

    <section class="mb-5" id="about-this-site">
        <h2 class="wk-quick-link">About this site</h2>
        <p>
            This documentation site is the package-local SvelteKit showcase, prerendered to static HTML and deployed on Vercel. Every component page
            combines live examples, usage snippets, an interactive playground, and an API reference. The same content is published for automated
            readers: each page is available as Markdown by requesting it with <code>Accept: text/markdown</code> or by appending <code>.md</code> to
            its path, <a href="/llms.txt">llms.txt</a> indexes every page, <a href="/llms-full.txt">llms-full.txt</a> bundles them into one file,
            <a href="/agents.md">agents.md</a> explains when and how to use the library, and <a href="/sitemap.xml">sitemap.xml</a> lists every URL.
        </p>
    </section>

    <section class="mb-5" id="contributing">
        <h2 class="wk-quick-link">Contributing</h2>
        <p>
            Bug reports, feature requests, and API or design feedback are welcome through
            <a href={site.issuesUrl} target="_blank" rel="noreferrer">GitHub Issues</a>. Pull requests should follow the repository's
            <a href={`${site.repositoryUrl}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">contributing guide</a>: add or update tests
            for behavior changes, keep components generic, and update this showcase when a public component API changes.
        </p>
    </section>
</div>

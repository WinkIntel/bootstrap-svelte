<script lang="ts">
    import { site } from '../(common)/site.js';

    const { address } = site.organization;
</script>

<div>
    <div class="mb-5">
        <h1>Contact</h1>
        <p class="lead">The fastest way to reach the Bootstrap Svelte maintainers is through the project's GitHub repository.</p>
        <hr />
    </div>

    <section class="mb-5" id="bugs-and-feature-requests">
        <h2 class="wk-quick-link">Bugs, feature requests, and questions</h2>
        <p>
            Use <a href={site.issuesUrl} target="_blank" rel="noreferrer">GitHub Issues<i class="bi bi-box-arrow-up-right ms-1"></i></a> for bugs,
            feature requests, missing Bootstrap components or variants, accessibility problems, SvelteKit or SSR edge cases, and documentation gaps.
            Include the package and Svelte versions you are using and, for bugs, a minimal reproduction. Feedback on component API ergonomics and
            Svelte 5 idioms is just as welcome as bug reports. Pull requests are accepted; see the repository's
            <a href={`${site.repositoryUrl}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer"
                >contributing guide<i class="bi bi-box-arrow-up-right ms-1"></i></a> first.
        </p>
    </section>

    <section class="mb-5" id="security">
        <h2 class="wk-quick-link">Security reports</h2>
        <p>
            Please report suspected vulnerabilities privately through
            <a href={site.securityPolicyUrl} target="_blank" rel="noreferrer"
                >GitHub's security reporting for this repository<i class="bi bi-box-arrow-up-right ms-1"></i></a>
            rather than in a public issue, and allow the maintainers a reasonable amount of time to investigate and coordinate a fix before disclosing.
            The security policy describes what is in scope: published package contents, generated <code>dist</code> files, and component behavior that touches
            the DOM, focus management, portals, overlays, or user-provided HTML.
        </p>
    </section>

    <section class="mb-5" id="organization">
        <h2 class="wk-quick-link">Organization</h2>
        <p>
            Bootstrap Svelte is published by {site.organization.name} ({site.organization.alternateName}). These are the company's general contact
            channels; for anything about the library itself, GitHub is faster.
        </p>
        <address>
            <strong>{site.organization.name}</strong><br />
            {address.streetAddress}<br />
            {address.addressLocality}, {address.addressRegion}
            {address.postalCode}<br />
            United States<br />
            Phone: <a href={`tel:${site.organization.telephone}`}>{site.organization.telephone}</a><br />
            Web: <a href={site.organization.url} target="_blank" rel="noreferrer">{site.organization.url}<i class="bi bi-box-arrow-up-right ms-1"></i></a>
        </address>
    </section>

    <section class="mb-5" id="for-agents">
        <h2 class="wk-quick-link">For automated readers</h2>
        <p>
            Agents and tools can start from <a href="/llms.txt">llms.txt</a>, which indexes every page of this site, and request any page as Markdown
            with <code>Accept: text/markdown</code>. Contact details above are also published as structured data on the home page.
        </p>
    </section>
</div>

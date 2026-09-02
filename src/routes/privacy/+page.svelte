<script lang="ts">
    import { site } from '../(common)/site.js';
</script>

<div>
    <div class="mb-5">
        <h1>Privacy</h1>
        <p class="lead">
            This notice describes what the Bootstrap Svelte documentation site at <code>{site.url.replace('https://', '')}</code> does, and does not, collect
            about its visitors. Last updated 2026-08-21.
        </p>
        <hr />
    </div>

    <section class="mb-5" id="scope">
        <h2 class="wk-quick-link">Scope</h2>
        <p>
            This notice covers only this documentation site. The <code>{site.packageName}</code> npm package runs inside your own applications and
            does not contact this site or {site.organization.name}. GitHub and npm have their own privacy policies for the repository and the package
            registry.
        </p>
    </section>

    <section class="mb-5" id="what-this-site-collects">
        <h2 class="wk-quick-link">What this site collects</h2>
        <p>
            Nothing, directly. The site is a set of static pages: it has no accounts, sign-in, forms, comments, search backend, analytics,
            advertising, or tracking pixels, and it does not build profiles of visitors or automated agents.
        </p>
    </section>

    <section class="mb-5" id="hosting">
        <h2 class="wk-quick-link">Hosting</h2>
        <p>
            The site is served by Vercel. Like any web host, Vercel processes the technical data needed to deliver and protect the site, such as your
            IP address, user agent, the requested URL, and timestamps, under the
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer"
                >Vercel privacy policy<i class="bi bi-box-arrow-up-right ms-1"></i></a
            >. {site.organization.name}
            does not receive that data in a form that identifies individual visitors.
        </p>
    </section>

    <section class="mb-5" id="third-party-resources">
        <h2 class="wk-quick-link">Third-party resources</h2>
        <p>
            Pages load Bootstrap CSS and Bootstrap Icons from the jsDelivr CDN and the Inter and JetBrains Mono typefaces from Google Fonts. Your
            browser requests those files directly, so jsDelivr and Google receive your IP address and user agent for those requests, as described in
            the <a href="https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net" target="_blank" rel="noreferrer"
                >jsDelivr privacy policy<i class="bi bi-box-arrow-up-right ms-1"></i></a>
            and the
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer"
                >Google privacy policy<i class="bi bi-box-arrow-up-right ms-1"></i></a
            >.
        </p>
    </section>

    <section class="mb-5" id="local-storage-and-cookies">
        <h2 class="wk-quick-link">Local storage and cookies</h2>
        <p>
            When you choose a color mode, the site stores that preference in your browser's local storage under the key <code>wk-color-mode</code> so the
            choice persists between visits. That value never leaves your browser, and clearing the site's data removes it. The site does not set cookies.
        </p>
    </section>

    <section class="mb-5" id="automated-access">
        <h2 class="wk-quick-link">Automated access</h2>
        <p>
            Crawlers and AI agents receive the same content as browsers, including Markdown versions of every page, <a href="/llms.txt">llms.txt</a>,
            and <a href="/sitemap.xml">sitemap.xml</a>. Automated requests are not fingerprinted or tracked beyond the hosting logs described above.
        </p>
    </section>

    <section class="mb-5" id="changes-and-contact">
        <h2 class="wk-quick-link">Changes and contact</h2>
        <p>
            Changes to this notice are published on this page with an updated date. Questions about it can be raised through
            <a href={site.issuesUrl} target="_blank" rel="noreferrer">GitHub Issues<i class="bi bi-box-arrow-up-right ms-1"></i></a> or the channels
            listed on the
            <a href="/contact">contact page</a>.
        </p>
    </section>
</div>

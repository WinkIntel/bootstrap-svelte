<script lang="ts">
    import { Breadcrumb } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import BreadcrumbPlayground from './BreadcrumbPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Breadcrumb.Root>
    <Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
    <Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
    <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
</Breadcrumb.Root>`;

    const customDividerExampleCode = `<!-- Using character divider -->
<Breadcrumb.Root divider=">">
    <Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
    <Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
    <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
</Breadcrumb.Root>

<!-- Using SVG divider -->
<Breadcrumb.Root divider="url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E)">
    <Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
    <Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
    <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
</Breadcrumb.Root>`;

    const noDividerExampleCode = `<!-- No divider -->
<Breadcrumb.Root divider="">
    <Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
    <Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
    <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
</Breadcrumb.Root>`;

    const accessibilityExampleCode = `<Breadcrumb.Root ariaLabel="breadcrumb navigation">
    <Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
    <Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
    <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
</Breadcrumb.Root>`;
</script>

<div>
    <div class="mb-5">
        <h1>Breadcrumb</h1>
        <p class="lead">Indicate the current page's location within a navigational hierarchy that automatically adds separators via CSS.</p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Breadcrumb component by adjusting the props below:</p>
        <BreadcrumbPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            Use a breadcrumb to indicate the hierarchical navigation structure for the current page. Breadcrumbs automatically add visual separators
            via CSS, with the active item (usually the current page) being visually distinct and non-linkable.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Breadcrumb.Root>
                        <Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
                        <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
                    </Breadcrumb.Root>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Custom Dividers section -->
    <section class="mb-5" id="custom-dividers">
        <h2 class="wk-quick-link">Custom Dividers</h2>
        <p>
            Breadcrumb dividers are created using CSS through the <code>::before</code> pseudo-element and
            <code>content</code> property. You can modify the divider by changing the <code>divider</code> prop, which sets the CSS custom property
            <code>--bs-breadcrumb-divider</code>. You can use a string character like
            <code>></code> or even an SVG embedded as a data URI.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <h6 class="text-muted">Using character divider</h6>
                    <Breadcrumb.Root divider=">">
                        <Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
                        <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
                    </Breadcrumb.Root>
                </div>

                <div class="mb-3">
                    <h6 class="text-muted">Using SVG divider</h6>
                    <Breadcrumb.Root
                        divider="url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'%3E%3Cpath d='M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z'/%3E%3C/svg%3E)">
                        <Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
                        <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
                    </Breadcrumb.Root>
                </div>

                <SyntaxHighlighter code={customDividerExampleCode} />
            </div>
        </div>
    </section>

    <!-- No Divider section -->
    <section class="mb-5" id="no-divider">
        <h2 class="wk-quick-link">No Divider</h2>
        <p>
            You can also remove the divider by setting <code>divider=""</code> (an empty string).
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Breadcrumb.Root divider="">
                        <Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
                        <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
                    </Breadcrumb.Root>
                </div>

                <SyntaxHighlighter code={noDividerExampleCode} />
            </div>
        </div>
    </section>

    <!-- Accessibility section -->
    <section class="mb-5" id="accessibility">
        <h2 class="wk-quick-link">Accessibility</h2>
        <p>
            Since breadcrumbs provide a navigation, it's good practice to add a meaningful label such as
            <code>ariaLabel="breadcrumb navigation"</code> to describe the type of navigation provided in the
            <code>&lt;nav&gt;</code> element. The Breadcrumb component automatically applies an <code>aria-current="page"</code>
            to the last item of the set to indicate that it represents the current page.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Breadcrumb.Root ariaLabel="breadcrumb navigation">
                        <Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
                        <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
                    </Breadcrumb.Root>
                </div>

                <SyntaxHighlighter code={accessibilityExampleCode} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Breadcrumb.Root Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>ariaLabel</code></td>
                        <td><code>string</code></td>
                        <td><code>'breadcrumb'</code></td>
                        <td>ARIA label for the breadcrumb navigation.</td>
                    </tr>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td><code>undefined</code></td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>divider</code></td>
                        <td><code>string</code></td>
                        <td><code>undefined</code></td>
                        <td>Custom divider to use between breadcrumb items.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element.</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td><code>breadcrumb-{'{'}uid}</code></td>
                        <td>Unique ID for the breadcrumb element.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Breadcrumb.Item Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td><code>undefined</code></td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element.</td>
                    </tr>
                    <tr>
                        <td><code>href</code></td>
                        <td><code>string</code></td>
                        <td><code>'#!'</code></td>
                        <td>URL for the breadcrumb item.</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td><code>breadcrumb-item-{'{'}uid}</code></td>
                        <td>Unique ID for the breadcrumb item element.</td>
                    </tr>
                    <tr>
                        <td><code>isActive</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether the breadcrumb item is active (current page).</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's breadcrumb classes based on the provided props:</p>
        <ul>
            <li><code>breadcrumb</code> - Base class for the Breadcrumb component</li>
            <li><code>breadcrumb-item</code> - Applied to Breadcrumb.Item components</li>
            <li><code>active</code> - Applied to Breadcrumb.Item when isActive=true</li>
        </ul>

        <h3 class="h5 mt-4">CSS Variables</h3>
        <p>The Breadcrumb component uses the following CSS variables:</p>
        <ul>
            <li><code>--bs-breadcrumb-divider</code> - Controls the divider character or content. Default is <code>/</code></li>
            <li><code>--bs-breadcrumb-item-padding-x</code> - Controls the horizontal padding of breadcrumb items</li>
            <li><code>--bs-breadcrumb-margin-bottom</code> - Controls the margin at the bottom of the breadcrumb</li>
        </ul>
    </section>
</div>

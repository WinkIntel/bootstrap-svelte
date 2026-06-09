<script lang="ts">
    import { Badge } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import BadgePlayground from './BadgePlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Badge>Base badge</Badge>`;
    const variantExampleCode = `<Badge colorVariant="text-bg-primary">Primary</Badge>
<Badge colorVariant="text-bg-secondary">Secondary</Badge>
<Badge colorVariant="text-bg-success">Success</Badge>
<Badge colorVariant="text-bg-danger">Danger</Badge>
<Badge colorVariant="text-bg-warning">Warning</Badge>
<Badge colorVariant="text-bg-info">Info</Badge>
<Badge colorVariant="text-bg-light">Light</Badge>
<Badge colorVariant="text-bg-dark">Dark</Badge>`;
    const pillExampleCode = `<Badge isPill={true} colorVariant="text-bg-primary">Primary</Badge>
<Badge isPill={true} colorVariant="text-bg-secondary">Secondary</Badge>
<Badge isPill={true} colorVariant="text-bg-success">Success</Badge>
<Badge isPill={true} colorVariant="text-bg-danger">Danger</Badge>
<Badge isPill={true} colorVariant="text-bg-warning">Warning</Badge>
<Badge isPill={true} colorVariant="text-bg-info">Info</Badge>
<Badge isPill={true} colorVariant="text-bg-light">Light</Badge>
<Badge isPill={true} colorVariant="text-bg-dark">Dark</Badge>`;
    const subtleExampleCode = `<Badge class="text-dark" colorVariant="bg-secondary-subtle">Subtle</Badge>
<Badge class="text-dark" colorVariant="bg-success-subtle">Subtle</Badge>
<Badge class="text-dark" colorVariant="bg-danger-subtle">Subtle</Badge>
<Badge class="text-dark" colorVariant="bg-warning-subtle">Subtle</Badge>
<Badge class="text-dark" colorVariant="bg-info-subtle">Subtle</Badge>
<Badge class="text-dark" colorVariant="bg-light-subtle">Subtle</Badge>
<Badge class="text-dark" colorVariant="bg-dark-subtle">Subtle</Badge>`;
    const positionedExampleCode = `<!-- Positioned badge on button -->
<button type="button" class="btn btn-primary position-relative">
    Inbox
    <Badge position="top-end" colorVariant="text-bg-danger">99+</Badge>
</button>

<!-- With positioning utilities -->
<button type="button" class="btn btn-primary position-relative">
    Profile
    <Badge
        position="top-end"
        colorVariant="text-bg-danger"
        class="border border-light rounded-circle p-2">
        <span class="visually-hidden">New alerts</span>
    </Badge>
</button>`;
    const headingsExampleCode = `<h1>Example heading <Badge colorVariant="text-bg-secondary">New</Badge></h1>
<h2>Example heading <Badge colorVariant="text-bg-secondary">New</Badge></h2>
<h3>Example heading <Badge colorVariant="text-bg-secondary">New</Badge></h3>
<h4>Example heading <Badge colorVariant="text-bg-secondary">New</Badge></h4>
<h5>Example heading <Badge colorVariant="text-bg-secondary">New</Badge></h5>
<h6>Example heading <Badge colorVariant="text-bg-secondary">New</Badge></h6>`;
    const buttonWithBadgeCode = `<button type="button" class="btn btn-primary">
    Notifications <Badge colorVariant="text-bg-light">4</Badge>
</button>`;
</script>

<div>
    <div class="mb-5">
        <h1>Badge</h1>
        <p class="lead">Bootstrap's badge component built with Svelte 5. Use badges to highlight elements, add counts, or display status.</p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Badge component by adjusting the props below:</p>
        <BadgePlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Badge id="baseBadge">Base badge</Badge>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Variants section -->
    <section class="mb-5" id="variants">
        <h2 class="wk-quick-link">Badge Variants</h2>
        <p>Bootstrap includes several predefined badge styles with contextual colors.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Badge id="variantPrimary" colorVariant="text-bg-primary">Primary</Badge>
                    <Badge id="variantSecondary" colorVariant="text-bg-secondary">Secondary</Badge>
                    <Badge id="variantSuccess" colorVariant="text-bg-success">Success</Badge>
                    <Badge id="variantDanger" colorVariant="text-bg-danger">Danger</Badge>
                    <Badge id="variantWarning" colorVariant="text-bg-warning">Warning</Badge>
                    <Badge id="variantInfo" colorVariant="text-bg-info">Info</Badge>
                    <Badge id="variantLight" colorVariant="text-bg-light">Light</Badge>
                    <Badge id="variantDark" colorVariant="text-bg-dark">Dark</Badge>
                </div>

                <SyntaxHighlighter code={variantExampleCode} />
            </div>
        </div>
    </section>

    <!-- Headings with Badges section -->
    <section class="mb-5" id="headings-with-badges">
        <h2 class="wk-quick-link">Badges with Headings</h2>
        <p>Badges can be used with any heading (h1-h6) to add supplemental information or status indicators.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <h1>Example heading <Badge id="headingBadge1" colorVariant="text-bg-secondary">New</Badge></h1>
                    <h2>Example heading <Badge id="headingBadge2" colorVariant="text-bg-secondary">New</Badge></h2>
                    <h3>Example heading <Badge id="headingBadge3" colorVariant="text-bg-secondary">New</Badge></h3>
                    <h4>Example heading <Badge id="headingBadge4" colorVariant="text-bg-secondary">New</Badge></h4>
                    <h5>Example heading <Badge id="headingBadge5" colorVariant="text-bg-secondary">New</Badge></h5>
                    <h6>Example heading <Badge id="headingBadge6" colorVariant="text-bg-secondary">New</Badge></h6>
                </div>

                <SyntaxHighlighter code={headingsExampleCode} />
            </div>
        </div>
    </section>

    <!-- Button with Badge section -->
    <section class="mb-5" id="button-with-badge">
        <h2 class="wk-quick-link">Button with Badge</h2>
        <p>Badges can be embedded inside buttons to show counts or status indicators alongside button text.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <button type="button" class="btn btn-primary">
                        Notifications <Badge id="buttonBadge" colorVariant="text-bg-light">4</Badge>
                    </button>
                </div>

                <SyntaxHighlighter code={buttonWithBadgeCode} />
            </div>
        </div>
    </section>

    <!-- Pill Badges -->
    <section class="mb-5" id="pill-badges">
        <h2 class="wk-quick-link">Pill Badges</h2>
        <p>
            Create badge with more rounded corners using the <code>isPill</code> prop.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Badge id="pillPrimary" isPill={true} colorVariant="text-bg-primary">Primary</Badge>
                    <Badge id="pillSecondary" isPill={true} colorVariant="text-bg-secondary">Secondary</Badge>
                    <Badge id="pillSuccess" isPill={true} colorVariant="text-bg-success">Success</Badge>
                    <Badge id="pillDanger" isPill={true} colorVariant="text-bg-danger">Danger</Badge>
                    <Badge id="pillWarning" isPill={true} colorVariant="text-bg-warning">Warning</Badge>
                    <Badge id="pillInfo" isPill={true} colorVariant="text-bg-info">Info</Badge>
                    <Badge id="pillLight" isPill={true} colorVariant="text-bg-light">Light</Badge>
                    <Badge id="pillDark" isPill={true} colorVariant="text-bg-dark">Dark</Badge>
                </div>

                <SyntaxHighlighter code={pillExampleCode} />
            </div>
        </div>
    </section>

    <!-- Subtle Badges -->
    <section class="mb-5" id="subtle-badges">
        <h2 class="wk-quick-link">Subtle Badges</h2>
        <p>
            Use subtle badges with lighter backgrounds with the <code>subtle</code> variants.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Badge class="text-dark" id="subtleSecondary" colorVariant="bg-secondary-subtle">Subtle</Badge>
                    <Badge class="text-dark" id="subtleSuccess" colorVariant="bg-success-subtle">Subtle</Badge>
                    <Badge class="text-dark" id="subtleDanger" colorVariant="bg-danger-subtle">Subtle</Badge>
                    <Badge class="text-dark" id="subtleWarning" colorVariant="bg-warning-subtle">Subtle</Badge>
                    <Badge class="text-dark" id="subtleInfo" colorVariant="bg-info-subtle">Subtle</Badge>
                    <Badge class="text-dark" id="subtleLight" colorVariant="bg-light-subtle">Subtle</Badge>
                    <Badge class="text-dark" id="subtleDark" colorVariant="bg-dark-subtle">Subtle</Badge>
                </div>

                <SyntaxHighlighter code={subtleExampleCode} />
            </div>
        </div>
    </section>

    <!-- Positioned Badges -->
    <section class="mb-5" id="positioned-badges">
        <h2 class="wk-quick-link">Positioned Badges</h2>
        <p>
            Use the <code>position</code> prop to place badges in the corner of elements.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-4">
                    <button type="button" class="btn btn-primary position-relative">
                        Inbox
                        <Badge id="positionedTopEnd" position="top-end" colorVariant="text-bg-danger">99+</Badge>
                    </button>

                    <button type="button" class="btn btn-primary position-relative">
                        Profile
                        <Badge
                            id="positionedTopEndIndicator"
                            position="top-end"
                            colorVariant="text-bg-danger"
                            class="border border-light rounded-circle p-2">
                            <span class="visually-hidden">New alerts</span>
                        </Badge>
                    </button>
                </div>

                <SyntaxHighlighter code={positionedExampleCode} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Props</h3>
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
                        <td><code>text-bg-primary</code></td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>isPill</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Makes the badge more rounded (pill shaped)</td>
                    </tr>
                    <tr>
                        <td><code>position</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td
                            >Used for positioning the badge. Values: 'positioned', 'positioned-top', 'positioned-end', 'positioned-bottom',
                            'positioned-start'</td>
                    </tr>
                    <tr>
                        <td><code>colorVariant</code></td>
                        <td><code>string</code></td>
                        <td><code>'text-bg-primary'</code></td>
                        <td>
                            Sets the badge's background color. Values: 'text-bg-primary', 'text-bg-secondary', 'text-bg-success', 'text-bg-danger',
                            'text-bg-warning', 'text-bg-info', 'text-bg-light', 'text-bg-dark', or *-subtle variants.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's badge classes based on the provided props:</p>
        <ul>
            <li><code>badge</code> - Always applied as the base class</li>
            <li><code>&#123;variant&#125;</code> - Applied based on the variant prop</li>
            <li><code>rounded-pill</code> - Applied when pill is true</li>
            <li>
                <code>position-absolute top-&#123;0|50|100&#125; start-&#123;0|50|100&#125; translate-middle</code> - Applied based on the position prop
            </li>
        </ul>
    </section>
</div>

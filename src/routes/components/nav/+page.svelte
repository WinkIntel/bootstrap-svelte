<script lang="ts">
    import { Nav } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import NavPlayground from './NavPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Nav.Root>
    <Nav.Item>
        <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Another Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
    </Nav.Item>
</Nav.Root>`;

    const pillsExampleCode = `<Nav.Root itemStyle="pills">
    <Nav.Item>
        <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Another Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
    </Nav.Item>
</Nav.Root>`;

    const tabsExampleCode = `<Nav.Root itemStyle="tabs">
    <Nav.Item>
        <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Another Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
    </Nav.Item>
</Nav.Root>`;

    const verticalNavExampleCode = `<Nav.Root verticalBreakpoint="xs">
    <Nav.Item>
        <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Another Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
    </Nav.Item>
</Nav.Root>`;

    const fillExampleCode = `<Nav.Root itemLayout="fill">
    <Nav.Item>
        <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Another Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
    </Nav.Item>
</Nav.Root>`;

    const justifiedExampleCode = `<Nav.Root itemLayout="justified">
    <Nav.Item>
        <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Another Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
    </Nav.Item>
</Nav.Root>`;

    const alignmentExampleCode = `<!-- Default (start) -->
<Nav.Root>
    <Nav.Item><Nav.Link href="#!">Default</Nav.Link></Nav.Item>
</Nav.Root>

<!-- Center aligned -->
<Nav.Root horizontalAlignment="center">
    <Nav.Item><Nav.Link href="#!">Center</Nav.Link></Nav.Item>
</Nav.Root>

<!-- End aligned -->
<Nav.Root horizontalAlignment="end">
    <Nav.Item><Nav.Link href="#!">End</Nav.Link></Nav.Item>
</Nav.Root>`;

    const differentElementsExampleCode = `<!-- Default (UL) -->
<Nav.Root>
    <Nav.Item><Nav.Link href="#!">Link</Nav.Link></Nav.Item>
</Nav.Root>

<!-- As OL -->
<Nav.Root elementType="ol">
    <Nav.Item><Nav.Link href="#!">Link</Nav.Link></Nav.Item>
</Nav.Root>

<!-- As NAV -->
<Nav.Root elementType="nav">
    <Nav.Link href="#!">Link</Nav.Link>
</Nav.Root>`;

    const activeStateExampleCode = `<!-- Explicit Active State Control -->
<Nav.Root>
    <Nav.Item>
        <Nav.Link href="#!" isActive={true}>Explicitly Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!" isActive={false}>Explicitly Inactive</Nav.Link>
    </Nav.Item>
</Nav.Root>

<!-- Internal Active State Management -->
<Nav.Root>
    <Nav.Item>
        <Nav.Link href="#nav-link-1">Click to Activate</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#nav-link-2">Another Link</Nav.Link>
    </Nav.Item>
</Nav.Root>`;
</script>

<div>
    <div class="mb-5">
        <h1>Nav</h1>
        <p class="lead">Navigation components for building various types of navigation interfaces, including tabs and pills.</p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>
            Experiment with the Nav component by adjusting the props below. Try switching between explicit active state control and internal
            management to see how the component behaves differently.
        </p>
        <NavPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            The default navigation component uses a <code>&lt;ul&gt;</code> with <code>&lt;li&gt;</code> items containing <code>&lt;a&gt;</code> links.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Nav.Root>
                        <Nav.Item>
                            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Another Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Pills Example -->
    <section class="mb-5" id="pills">
        <h2 class="wk-quick-link">Pills</h2>
        <p>Use the <code>itemStyle="pills"</code> prop to create a navigation with pills styling.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Nav.Root itemStyle="pills">
                        <Nav.Item>
                            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Another Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>
                </div>

                <SyntaxHighlighter code={pillsExampleCode} />
            </div>
        </div>
    </section>

    <!-- Tabs Example -->
    <section class="mb-5" id="tabs">
        <h2 class="wk-quick-link">Tabs</h2>
        <p>Use the <code>itemStyle="tabs"</code> prop to create a navigation with tabs styling.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Nav.Root itemStyle="tabs">
                        <Nav.Item>
                            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Another Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>
                </div>

                <SyntaxHighlighter code={tabsExampleCode} />
            </div>
        </div>
    </section>

    <!-- Vertical Example -->
    <section class="mb-5" id="vertical">
        <h2 class="wk-quick-link">Vertical Nav</h2>
        <p>
            Use the <code>verticalBreakpoint</code> prop to create a vertically stacked navigation. Set it to <code>"xs"</code> to make it always vertical.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Nav.Root verticalBreakpoint="xs">
                        <Nav.Item>
                            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Another Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>
                </div>

                <SyntaxHighlighter code={verticalNavExampleCode} />
            </div>
        </div>
    </section>

    <!-- Fill and Justify -->
    <section class="mb-5" id="fill-justify">
        <h2 class="wk-quick-link">Fill and Justify</h2>
        <p>
            Force your <code>.nav</code>'s contents to extend the full available width with one of two options:
        </p>

        <h3 class="h5 mt-4">Fill</h3>
        <p>Use <code>itemLayout="fill"</code> to proportionately fill all available space.</p>
        <div class="card mb-4">
            <div class="card-body">
                <div class="mb-3">
                    <Nav.Root itemLayout="fill">
                        <Nav.Item>
                            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Another Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>
                </div>

                <SyntaxHighlighter code={fillExampleCode} />
            </div>
        </div>

        <h3 class="h5 mt-4">Justified</h3>
        <p>Use <code>itemLayout="justified"</code> for equal-width elements.</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Nav.Root itemLayout="justified">
                        <Nav.Item>
                            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!">Another Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>
                </div>

                <SyntaxHighlighter code={justifiedExampleCode} />
            </div>
        </div>
    </section>

    <!-- Horizontal Alignment -->
    <section class="mb-5" id="horizontal-alignment">
        <h2 class="wk-quick-link">Horizontal Alignment</h2>
        <p>
            Use the <code>horizontalAlignment</code> prop to change the horizontal alignment of your nav. Default is "start", but you can use "center" or
            "end".
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-column gap-2">
                    <Nav.Root>
                        <Nav.Item>
                            <Nav.Link href="#!">Default (start)</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>

                    <Nav.Root horizontalAlignment="center">
                        <Nav.Item>
                            <Nav.Link href="#!">Center aligned</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>

                    <Nav.Root horizontalAlignment="end">
                        <Nav.Item>
                            <Nav.Link href="#!">End aligned</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>
                </div>

                <SyntaxHighlighter code={alignmentExampleCode} />
            </div>
        </div>
    </section>

    <!-- Different Element Types -->
    <section class="mb-5" id="different-elements">
        <h2 class="wk-quick-link">Different Element Types</h2>
        <p>
            The Nav component can be rendered as different HTML elements using the <code>as</code> prop. The default is <code>"ul"</code>, but you can
            also use <code>"ol"</code> or <code>"nav"</code>.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-column gap-3">
                    <div>
                        <small class="text-muted">Default (UL):</small>
                        <Nav.Root>
                            <Nav.Item>
                                <Nav.Link href="#!">Link in UL</Nav.Link>
                            </Nav.Item>
                        </Nav.Root>
                    </div>

                    <div>
                        <small class="text-muted">As OL:</small>
                        <Nav.Root elementType="ol">
                            <Nav.Item>
                                <Nav.Link href="#!">Link in OL</Nav.Link>
                            </Nav.Item>
                        </Nav.Root>
                    </div>

                    <div>
                        <small class="text-muted">As NAV:</small>
                        <Nav.Root elementType="nav">
                            <Nav.Link href="#!">Link directly in NAV</Nav.Link>
                        </Nav.Root>
                    </div>
                </div>

                <SyntaxHighlighter code={differentElementsExampleCode} />
            </div>
        </div>
    </section>

    <!-- Active State Management -->
    <section class="mb-5" id="active-state">
        <h2 class="wk-quick-link">Active State Management</h2>
        <p>The Nav component supports two modes for managing active states:</p>

        <h3 class="h5 mt-4">Explicit Control</h3>
        <p>
            When you provide the <code>isActive</code> prop, you have full control over the active state. This is useful when integrating with routing libraries
            or when you need precise control.
        </p>

        <div class="card mb-4">
            <div class="card-body">
                <div class="mb-3">
                    <Nav.Root>
                        <Nav.Item>
                            <Nav.Link href="#!" isActive={true}>Explicitly Active</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!" isActive={false}>Explicitly Inactive</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>
                </div>
            </div>
        </div>

        <h3 class="h5 mt-4">Internal Management</h3>
        <p>
            When you don't provide the <code>isActive</code> prop (or set it to <code>undefined</code>), the component manages the active state
            internally. Clicking a link will make it active and deactivate others in the same nav.
        </p>

        <p>
            ⚠️ <b>NOTE</b>: In order for the internal state management to work properly, ensure that the <code>href</code> prop is set to a unique value
            for each.
        </p>

        <div class="card mb-4">
            <div class="card-body">
                <div class="mb-3">
                    <Nav.Root>
                        <Nav.Item>
                            <Nav.Link href="#nav-link-1">Click to Activate</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#nav-link-2">Another Link</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#nav-link-3">Third Link</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>
                </div>

                <SyntaxHighlighter code={activeStateExampleCode} />
            </div>
        </div>
    </section>

    <!-- Working with Tab Content -->
    <section class="mb-5" id="tabs-with-content">
        <h2 class="wk-quick-link">Tabs with Content</h2>
        <p>
            For dynamic tabbed interfaces, use the Nav component with the Tab component. See the <a href="/components/tab">Tab documentation</a> for more
            details.
        </p>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Nav.Root Props</h3>
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
                        <td><code>ariaOrientation</code></td>
                        <td><code>'horizontal' | 'vertical'</code></td>
                        <td>-</td>
                        <td>ARIA orientation attribute. Automatically set to 'vertical' when verticalBreakpoint is defined.</td>
                    </tr>
                    <tr>
                        <td><code>as</code></td>
                        <td><code>'nav' | 'ol' | 'ul'</code></td>
                        <td><code>'ul'</code></td>
                        <td>Element type to render</td>
                    </tr>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>horizontalAlignment</code></td>
                        <td><code>'start' | 'center' | 'end'</code></td>
                        <td><code>'start'</code></td>
                        <td>Horizontal alignment for the nav items</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the nav</td>
                    </tr>
                    <tr>
                        <td><code>itemLayout</code></td>
                        <td><code>'fill' | 'justified'</code></td>
                        <td>-</td>
                        <td>Layout strategy for the nav items</td>
                    </tr>
                    <tr>
                        <td><code>itemStyle</code></td>
                        <td><code>'pills' | 'tabs' | 'underline'</code></td>
                        <td>-</td>
                        <td>Visual style for the nav items</td>
                    </tr>
                    <tr>
                        <td><code>role</code></td>
                        <td><code>'navigation' | 'tablist' | null</code></td>
                        <td>Auto-determined</td>
                        <td>ARIA role. Defaults to 'tablist' if itemStyle is 'tabs', 'navigation' for non-nav elements, null otherwise</td>
                    </tr>
                    <tr>
                        <td><code>verticalBreakpoint</code></td>
                        <td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'</code></td>
                        <td>-</td>
                        <td>Breakpoint at which the nav becomes vertical. 'xs' means always vertical.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Nav.Item Props</h3>
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
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Nav.Link Props</h3>
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
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>href</code></td>
                        <td><code>string</code></td>
                        <td><code>'#!'</code></td>
                        <td>URL for the link. The exclamation point is used to prevent auto-scrolling to the top of the page.</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the link</td>
                    </tr>
                    <tr>
                        <td><code>isActive</code></td>
                        <td><code>boolean | undefined</code></td>
                        <td><code>undefined</code></td>
                        <td
                            >Whether the link is active. When provided, overrides internal state management. When undefined, the component manages
                            active state internally based on user interactions.</td>
                    </tr>
                    <tr>
                        <td><code>isDisabled</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether the link is disabled</td>
                    </tr>
                    <tr>
                        <td><code>role</code></td>
                        <td><code>'button' | 'tab'</code></td>
                        <td>Auto-determined</td>
                        <td>ARIA role for the link. Defaults to 'tab' if within tablist context.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's nav classes based on the provided props:</p>
        <ul>
            <li><code>nav</code> - Base class for the Nav component</li>
            <li><code>nav-item</code> - Applied to Nav.Item components</li>
            <li><code>nav-link</code> - Applied to Nav.Link components</li>
            <li><code>nav-pills</code> - Applied when itemStyle="pills"</li>
            <li><code>nav-tabs</code> - Applied when itemStyle="tabs"</li>
            <li><code>nav-underline</code> - Applied when itemStyle="underline"</li>
            <li><code>nav-fill</code> - Applied when itemLayout="fill"</li>
            <li><code>nav-justified</code> - Applied when itemLayout="justified"</li>
            <li><code>flex-column</code> - Applied when verticalBreakpoint="xs"</li>
            <li><code>flex-&#123;breakpoint&#125;-column</code> - Applied for other verticalBreakpoint values</li>
            <li><code>justify-content-center</code> - Applied when horizontalAlignment="center"</li>
            <li><code>justify-content-end</code> - Applied when horizontalAlignment="end"</li>
            <li><code>active</code> - Applied to Nav.Link when isActive=true</li>
            <li><code>disabled</code> - Applied to Nav.Link when isDisabled=true</li>
        </ul>
    </section>
</div>

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

    const landmarkExampleCode = `<nav aria-label="Primary navigation">
    <Nav.Root>
        <Nav.Item><Nav.Link href="/home">Home</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="/about">About</Nav.Link></Nav.Item>
    </Nav.Root>
</nav>`;

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
            The Nav component can be rendered as different HTML elements using the <code>elementType</code> prop. The default is <code>"ul"</code>,
            but you can also use <code>"ol"</code> or <code>"nav"</code>.
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

    <section class="mb-5" id="accessibility">
        <h2 class="wk-quick-link">Accessibility and landmarks</h2>
        <p>
            Ordinary <code>Nav.Root</code> lists retain their native list semantics. Styling with <code>itemStyle="tabs"</code>, <code>"pills"</code>
            or <code>"underline"</code> does not turn navigation links into a tab widget. In the navigation strip of <code>Tab.Root</code>, the root
            defaults to
            <code>role="tablist"</code> for every style. Navigation inside a <code>Tab.Pane</code> retains ordinary semantics, although a
            <code>Tab.NavLink</code> there, or a bare <code>Nav.Link</code> with no <code>Nav.Root</code> inside that pane, still selects a pane of
            its
            <code>Tab.Root</code>. A bare link's click is intercepted and its <code>href</code> is read as a pane ID, so even
            <code>href="/settings"</code> does not navigate; place links that should navigate under a <code>Nav.Root</code> inside the pane. A nested
            <code>Tab.Root</code> creates its own tab widget. Use the Tab components when links switch associated panels.
        </p>
        <p>
            For an ordinary navigation landmark, wrap the list in a named <code>&lt;nav&gt;</code>, or use <code>elementType="nav"</code> with direct
            <code>Nav.Link</code>
            children. Do not put <code>role="navigation"</code> on a <code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code>.
        </p>
        <SyntaxHighlighter code={landmarkExampleCode} />
        <p>
            Migration: selectors or accessibility queries that relied on the old list navigation role should target the native list or its
            <code>&lt;nav&gt;</code> wrapper. Explicit <code>role</code> values remain under your control; <code>{'role={null}'}</code> omits the root
            role attribute, including inside <code>Tab.Root</code>. Root overrides other than <code>tablist</code> also disable inferred child
            tab/presentation roles and tab-specific ARIA attributes; explicit child roles are honored instead. This changes semantics, not panel
            selection behavior. If overriding roles, provide a coherent container and child structure. Selection does change in one case: a
            <code>Nav.Link</code> under a <code>Nav.Root</code> inside a <code>Tab.Pane</code> previously selected a pane and now follows its
            <code>href</code>, whatever the root role. Use <code>Tab.NavLink</code> to select panes from such a container. Automatic vertical
            orientation is emitted only for tablists with <code>verticalBreakpoint="xs"</code>. Responsive layouts do not infer a static orientation;
            use
            <code>ariaOrientation</code> to supply a value that tracks your layout.
        </p>
        <p>
            Custom tab widgets outside <code>Tab.Root</code> must explicitly set <code>role="tablist"</code> on <code>Nav.Root</code>,
            <code>role="presentation"</code>
            on <code>Nav.Item</code> and <code>role="tab"</code> on <code>Nav.Link</code>, with associated panels, selection state and interaction
            behavior managed by the consumer. Styling alone no longer supplies those semantics.
        </p>
    </section>

    <!-- API Reference -->
    <section class="mb-5 wk-api-section" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Nav.Root Props</h3>
        <div class="table-responsive">
            <table data-props-type="NavRootProps" class="table table-sm">
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
                        <td
                            >Explicit ARIA orientation. A tablist infers 'vertical' only for verticalBreakpoint='xs'. Responsive breakpoints require
                            explicit orientation tracking; ordinary navigation does not infer orientation.</td>
                    </tr>
                    <tr>
                        <td><code>elementType</code></td>
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
                        <td
                            >Defaults to 'tablist' in a Tab.Root navigation strip, otherwise omitted. Explicit roles are honored; null omits the role
                            attribute. Use 'navigation' only with elementType='nav', never on a ul or ol.</td>
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
            <table data-props-type="NavItemProps" class="table table-sm">
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
            <table data-props-type="NavLinkProps" class="table table-sm">
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

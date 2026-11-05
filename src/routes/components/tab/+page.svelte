<script lang="ts">
    import { Nav, Tab } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import TabPlayground from './TabPlayground.svelte';

    const controlledTabCode =
        `<script>
    import { Nav, Tab } from '@winkintel/bootstrap-svelte';
    let active = $state('home');
<` +
        `/script>

<Tab.Root>
    <Nav.Root aria-label="Account">
        <Nav.Link href="#home" isActive={active === 'home'} onclick={() => active = 'home'}>Home</Nav.Link>
        <Nav.Link href="#profile" isActive={active === 'profile'} onclick={() => active = 'profile'}>Profile</Nav.Link>
    </Nav.Root>
    <Tab.Pane id="home" isActive={active === 'home'}>Home content</Tab.Pane>
    <Tab.Pane id="profile" isActive={active === 'profile'}>Profile content</Tab.Pane>
</Tab.Root>`;

    // Sample code examples for demonstration
    const basicExampleCode = `<Tab.Root>
    <Nav.Root itemStyle="tabs">
        <Nav.Item>
            <Tab.NavLink targetPaneId="#home" isActive={true}>Home</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink targetPaneId="#profile">Profile</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink targetPaneId="#messages">Messages</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink targetPaneId="#settings" isDisabled={true}>Disabled</Tab.NavLink>
        </Nav.Item>
    </Nav.Root>
    <Tab.Content>
        <Tab.Pane id="home" isActive={true}>
            <h5 class="mt-3">Home Content</h5>
            <p>This is the home content panel.</p>
        </Tab.Pane>
        <Tab.Pane id="profile">
            <h5 class="mt-3">Profile Content</h5>
            <p>This is the profile content panel.</p>
            <Tab.NavLink targetPaneId="#home">Return to Home</Tab.NavLink>
        </Tab.Pane>
        <Tab.Pane id="messages">
            <h5 class="mt-3">Messages Content</h5>
            <p>This is the messages content panel.</p>
        </Tab.Pane>
        <Tab.Pane id="settings">
            <h5 class="mt-3">Settings Content</h5>
            <p>This is the settings content panel.</p>
        </Tab.Pane>
    </Tab.Content>
</Tab.Root>`;

    const fadeEffectCode = `<Tab.Root>
    <Nav.Root itemStyle="tabs">
        <Nav.Item>
            <Tab.NavLink targetPaneId="#home-fade" isActive={true}>Home</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink targetPaneId="#profile-fade">Profile</Tab.NavLink>
        </Nav.Item>
    </Nav.Root>
    <Tab.Content>
        <Tab.Pane id="home-fade" isActive={true} doFade={true}>
            <h5 class="mt-3">Home Content with Fade</h5>
            <p>This tab will fade in and out when switching.</p>
        </Tab.Pane>
        <Tab.Pane id="profile-fade" doFade={true}>
            <h5 class="mt-3">Profile Content with Fade</h5>
            <p>This tab will also fade in and out when switching.</p>
        </Tab.Pane>
    </Tab.Content>
</Tab.Root>`;

    const pillsExampleCode = `<Tab.Root>
    <Nav.Root itemStyle="pills">
        <Nav.Item>
            <Tab.NavLink targetPaneId="#pills-home" isActive={true}>Home</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink targetPaneId="#pills-profile">Profile</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink targetPaneId="#pills-contact">Contact</Tab.NavLink>
        </Nav.Item>
    </Nav.Root>
    <Tab.Content>
        <Tab.Pane id="pills-home" isActive={true}>
            <h5 class="mt-3">Home Pills Content</h5>
            <p>This is the pills-styled home tab content.</p>
        </Tab.Pane>
        <Tab.Pane id="pills-profile">
            <h5 class="mt-3">Profile Pills Content</h5>
            <p>This is the pills-styled profile tab content.</p>
        </Tab.Pane>
        <Tab.Pane id="pills-contact">
            <h5 class="mt-3">Contact Pills Content</h5>
            <p>This is the pills-styled contact tab content.</p>
        </Tab.Pane>
    </Tab.Content>
</Tab.Root>`;

    const verticalPillsExampleCode = `<div class="d-flex align-items-start">
    <Tab.Root>
        <Nav.Root itemStyle="pills" verticalBreakpoint="xs" class="me-3">
            <Nav.Item>
                <Tab.NavLink targetPaneId="#v-pills-home" isActive={true}>Home</Tab.NavLink>
            </Nav.Item>
            <Nav.Item>
                <Tab.NavLink targetPaneId="#v-pills-profile">Profile</Tab.NavLink>
            </Nav.Item>
            <Nav.Item>
                <Tab.NavLink targetPaneId="#v-pills-messages">Messages</Tab.NavLink>
            </Nav.Item>
            <Nav.Item>
                <Tab.NavLink targetPaneId="#v-pills-settings">Settings</Tab.NavLink>
            </Nav.Item>
        </Nav.Root>
        <Tab.Content class="flex-grow-1">
            <Tab.Pane id="v-pills-home" isActive={true}>
                <h5 class="mt-0">Home Content</h5>
                <p>This is the content for the home tab in vertical pills layout.</p>
            </Tab.Pane>
            <Tab.Pane id="v-pills-profile">
                <h5 class="mt-0">Profile Content</h5>
                <p>This is the content for the profile tab in vertical pills layout.</p>
            </Tab.Pane>
            <Tab.Pane id="v-pills-messages">
                <h5 class="mt-0">Messages Content</h5>
                <p>This is the content for the messages tab in vertical pills layout.</p>
            </Tab.Pane>
            <Tab.Pane id="v-pills-settings">
                <h5 class="mt-0">Settings Content</h5>
                <p>This is the content for the settings tab in vertical pills layout.</p>
            </Tab.Pane>
        </Tab.Content>
    </Tab.Root>
</div>`;

    const fillAndJustifiedExampleCode = `<Tab.Root>
    <Nav.Root itemStyle="pills" itemLayout="fill">
        <Nav.Item>
            <Tab.NavLink targetPaneId="#fill-home" isActive={true}>Home</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink targetPaneId="#fill-profile">Profile</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink targetPaneId="#fill-contact">Contact</Tab.NavLink>
        </Nav.Item>
    </Nav.Root>
    <Tab.Content>
        <Tab.Pane id="fill-home" isActive={true}>
            <h5 class="mt-3">Fill Tab Home</h5>
            <p>This content appears with the nav items filling the available width.</p>
        </Tab.Pane>
        <Tab.Pane id="fill-profile">
            <h5 class="mt-3">Fill Tab Profile</h5>
            <p>This content appears with the nav items filling the available width.</p>
        </Tab.Pane>
        <Tab.Pane id="fill-contact">
            <h5 class="mt-3">Fill Tab Contact</h5>
            <p>This content appears with the nav items filling the available width.</p>
        </Tab.Pane>
    </Tab.Content>
</Tab.Root>`;

    const customClassesExampleCode = `<Tab.Root>
    <Nav.Root itemStyle="tabs" class="mb-3 nav-custom">
        <Nav.Item class="custom-item">
            <Tab.NavLink targetPaneId="#custom-home" isActive={true} class="rounded-top">Home</Tab.NavLink>
        </Nav.Item>
        <Nav.Item class="custom-item">
            <Tab.NavLink targetPaneId="#custom-profile" class="rounded-top">Profile</Tab.NavLink>
        </Nav.Item>
    </Nav.Root>
    <Tab.Content class="border p-3 custom-content">
        <Tab.Pane id="custom-home" isActive={true} class="custom-pane">
            <h5>Home with Custom Classes</h5>
            <p>This is the content with custom CSS classes applied.</p>
        </Tab.Pane>
        <Tab.Pane id="custom-profile" class="custom-pane">
            <h5>Profile with Custom Classes</h5>
            <p>This is the content with custom CSS classes applied.</p>
        </Tab.Pane>
    </Tab.Content>
</Tab.Root>`;

    // Active tab management for demo
    let _activeDemo = $state('pills');
</script>

<div>
    <div class="mb-5">
        <h1>Tab</h1>
        <p class="lead">Tab components provide dynamic tabbed interfaces for organizing content into separate views that users can switch between.</p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Tab component by adjusting the props below:</p>
        <TabPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            The Tab component combines <code>Nav</code> components with tab content panes for creating a tabbed interface. The active tab is
            controlled by the <code>isActive</code> prop on both the <code>Tab.NavLink</code> and <code>Tab.Pane</code> components.
        </p>
        <p>
            A <code>Tab.NavLink</code> inside a pane selects its destination and updates the matching strip tab. A bare <code>Nav.Link</code>
            does the same; under a <code>Nav.Root</code> in pane content, use <code>Tab.NavLink</code> to select a pane. If several strip links share
            a target, pane controls keep the selected match or choose the first registered strip link. A pane without a matching strip link leaves the
            strip unselected. Remounted links register last, even if they appear first in the markup. Removing the selected strip link selects a
            remaining match for the visible pane or clears strip selection. An initially active pane control does not change the initial pane or strip
            selection; clicks and later activation transitions still select its destination. Explicit <code>Nav.Link isActive</code> props continue to control
            their rendered active state.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-4">
                    <Tab.Root>
                        <Nav.Root itemStyle="tabs">
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#home-basic" isActive={true}>Home</Tab.NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#profile-basic">Profile</Tab.NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#messages-basic">Messages</Tab.NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#settings-basic" isDisabled={true}>Disabled</Tab.NavLink>
                            </Nav.Item>
                        </Nav.Root>
                        <Tab.Content>
                            <Tab.Pane id="home-basic" isActive={true}>
                                <h5 class="mt-3">Home Content</h5>
                                <p>This is the home content panel.</p>
                            </Tab.Pane>
                            <Tab.Pane id="profile-basic">
                                <h5 class="mt-3">Profile Content</h5>
                                <p>This is the profile content panel.</p>
                                <Tab.NavLink targetPaneId="#home-basic">Return to Home</Tab.NavLink>
                            </Tab.Pane>
                            <Tab.Pane id="messages-basic">
                                <h5 class="mt-3">Messages Content</h5>
                                <p>This is the messages content panel.</p>
                            </Tab.Pane>
                            <Tab.Pane id="settings-basic">
                                <h5 class="mt-3">Settings Content</h5>
                                <p>This is the settings content panel.</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Root>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Fade Effect section -->
    <section class="mb-5" id="fade-effect">
        <h2 class="wk-quick-link">Fade Effect</h2>
        <p>
            Add the <code>doFade</code> prop to your tab panes to enable a fade transition effect when switching between tabs.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-4">
                    <Tab.Root>
                        <Nav.Root itemStyle="tabs">
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#home-fade" isActive={true}>Home</Tab.NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#profile-fade">Profile</Tab.NavLink>
                            </Nav.Item>
                        </Nav.Root>
                        <Tab.Content>
                            <Tab.Pane id="home-fade" isActive={true} doFade={true}>
                                <h5 class="mt-3">Home Content with Fade</h5>
                                <p>This tab will fade in and out when switching.</p>
                            </Tab.Pane>
                            <Tab.Pane id="profile-fade" doFade={true}>
                                <h5 class="mt-3">Profile Content with Fade</h5>
                                <p>This tab will also fade in and out when switching.</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Root>
                </div>
                <SyntaxHighlighter code={fadeEffectCode} />
            </div>
        </div>
    </section>

    <!-- Pills section -->
    <section class="mb-5" id="pills">
        <h2 class="wk-quick-link">Pills</h2>
        <p>
            You can use pills instead of tabs by setting <code>itemStyle="pills"</code> on the <code>Nav.Root</code> component.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-4">
                    <Tab.Root>
                        <Nav.Root itemStyle="pills">
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#home-pills" isActive={true}>Home</Tab.NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#profile-pills">Profile</Tab.NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#contact-pills">Contact</Tab.NavLink>
                            </Nav.Item>
                        </Nav.Root>
                        <Tab.Content>
                            <Tab.Pane id="home-pills" isActive={true}>
                                <h5 class="mt-3">Home Pills Content</h5>
                                <p>This is the pills-styled home tab content.</p>
                            </Tab.Pane>
                            <Tab.Pane id="profile-pills">
                                <h5 class="mt-3">Profile Pills Content</h5>
                                <p>This is the pills-styled profile tab content.</p>
                            </Tab.Pane>
                            <Tab.Pane id="contact-pills">
                                <h5 class="mt-3">Contact Pills Content</h5>
                                <p>This is the pills-styled contact tab content.</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Root>
                </div>
                <SyntaxHighlighter code={pillsExampleCode} />
            </div>
        </div>
    </section>

    <!-- Vertical Pills section -->
    <section class="mb-5" id="vertical-pills">
        <h2 class="wk-quick-link">Vertical Pills</h2>
        <p>
            Stack your navigation by using the <code>verticalBreakpoint="xs"</code> prop on the <code>Nav.Root</code> component.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-4">
                    <div class="d-flex align-items-start">
                        <Tab.Root>
                            <Nav.Root itemStyle="pills" verticalBreakpoint="xs" class="me-3">
                                <Nav.Item>
                                    <Tab.NavLink targetPaneId="#home-v-pills" isActive={true}>Home</Tab.NavLink>
                                </Nav.Item>
                                <Nav.Item>
                                    <Tab.NavLink targetPaneId="#profile-v-pills">Profile</Tab.NavLink>
                                </Nav.Item>
                                <Nav.Item>
                                    <Tab.NavLink targetPaneId="#messages-v-pills">Messages</Tab.NavLink>
                                </Nav.Item>
                                <Nav.Item>
                                    <Tab.NavLink targetPaneId="#settings-v-pills">Settings</Tab.NavLink>
                                </Nav.Item>
                            </Nav.Root>
                            <Tab.Content class="flex-grow-1">
                                <Tab.Pane id="home-v-pills" isActive={true}>
                                    <h5 class="mt-0">Home Content</h5>
                                    <p>This is the content for the home tab in vertical pills layout.</p>
                                </Tab.Pane>
                                <Tab.Pane id="profile-v-pills">
                                    <h5 class="mt-0">Profile Content</h5>
                                    <p>This is the content for the profile tab in vertical pills layout.</p>
                                </Tab.Pane>
                                <Tab.Pane id="messages-v-pills">
                                    <h5 class="mt-0">Messages Content</h5>
                                    <p>This is the content for the messages tab in vertical pills layout.</p>
                                </Tab.Pane>
                                <Tab.Pane id="settings-v-pills">
                                    <h5 class="mt-0">Settings Content</h5>
                                    <p>This is the content for the settings tab in vertical pills layout.</p>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Root>
                    </div>
                </div>
                <SyntaxHighlighter code={verticalPillsExampleCode} />
            </div>
        </div>
    </section>

    <!-- Fill and Justified section -->
    <section class="mb-5" id="fill-and-justified">
        <h2 class="wk-quick-link">Fill and Justify</h2>
        <p>
            To proportionately fill all available space with your nav items, use <code>itemLayout="fill"</code> or <code>itemLayout="justified"</code>
            on the <code>Nav.Root</code> component. The "fill" option gives all nav items equal width, while "justified" gives them equal width but only
            when all horizontal space is occupied.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <h5>Fill Example</h5>
                    <Tab.Root>
                        <Nav.Root itemStyle="pills" itemLayout="fill">
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#home-fill-n-justified" isActive={true}>Home</Tab.NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#profile-fill-n-justified">Profile</Tab.NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <Tab.NavLink targetPaneId="#contact-fill-n-justified">Contact</Tab.NavLink>
                            </Nav.Item>
                        </Nav.Root>
                        <Tab.Content>
                            <Tab.Pane id="home-fill-n-justified" isActive={true}>
                                <h5 class="mt-3">Fill Tab Home</h5>
                                <p>This content appears with the nav items filling the available width.</p>
                            </Tab.Pane>
                            <Tab.Pane id="profile-fill-n-justified">
                                <h5 class="mt-3">Fill Tab Profile</h5>
                                <p>This content appears with the nav items filling the available width.</p>
                            </Tab.Pane>
                            <Tab.Pane id="contact-fill-n-justified">
                                <h5 class="mt-3">Fill Tab Contact</h5>
                                <p>This content appears with the nav items filling the available width.</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Root>
                </div>
                <SyntaxHighlighter code={fillAndJustifiedExampleCode} />
            </div>
        </div>
    </section>

    <!-- Custom Classes section -->
    <section class="mb-5" id="custom-classes">
        <h2 class="wk-quick-link">Custom Classes</h2>
        <p>You can add custom CSS classes to each component in the Tab structure to further customize styling.</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-4">
                    <Tab.Root>
                        <Nav.Root itemStyle="tabs" class="mb-3 border-bottom">
                            <Nav.Item class="ms-1">
                                <Tab.NavLink targetPaneId="#home-custom-classes" isActive={true} class="rounded-top">Home</Tab.NavLink>
                            </Nav.Item>
                            <Nav.Item class="ms-1">
                                <Tab.NavLink targetPaneId="#profile-custom-classes" class="rounded-top">Profile</Tab.NavLink>
                            </Nav.Item>
                        </Nav.Root>
                        <Tab.Content class="border p-3 rounded-bottom">
                            <Tab.Pane id="home-custom-classes" isActive={true}>
                                <h5>Home with Custom Classes</h5>
                                <p>This is the content with custom CSS classes applied.</p>
                            </Tab.Pane>
                            <Tab.Pane id="profile-custom-classes">
                                <h5>Profile with Custom Classes</h5>
                                <p>This is the content with custom CSS classes applied.</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Root>
                </div>
                <SyntaxHighlighter code={customClassesExampleCode} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-5 wk-api-section" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Tab.Root Props</h3>
        <div class="table-responsive">
            <table data-props-type="TabRootProps" class="table table-sm">
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
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the tab container</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Tab.Content Props</h3>
        <div class="table-responsive">
            <table data-props-type="TabContentProps" class="table table-sm">
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

        <h3 class="h5 mt-4">Tab.NavLink Props</h3>
        <div class="table-responsive">
            <table data-props-type="TabNavLinkProps" class="table table-sm">
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
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the link</td>
                    </tr>
                    <tr>
                        <td><code>isActive</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether the link is active</td>
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
                        <td>ARIA role for the link. Defaults to 'tab' in a tab strip; explicit roles and null are honored.</td>
                    </tr>
                    <tr>
                        <td><code>targetPaneId</code></td>
                        <td><code>string</code></td>
                        <td><code>'#!'</code></td>
                        <td>The ID of the tab pane to link to.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Tab.Pane Props</h3>
        <div class="table-responsive">
            <table data-props-type="TabPaneProps" class="table table-sm">
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
                        <td><code>doFade</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether to use fade transition when showing/hiding</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the tab pane</td>
                    </tr>
                    <tr>
                        <td><code>isActive</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether the pane is initially visible</td>
                    </tr>
                    <tr>
                        <td><code>onHide</code></td>
                        <td><code>function</code></td>
                        <td><code>noop</code></td>
                        <td>Callback when the pane is about to be hidden</td>
                    </tr>
                    <tr>
                        <td><code>onHidden</code></td>
                        <td><code>function</code></td>
                        <td><code>noop</code></td>
                        <td>Callback when the pane has been hidden</td>
                    </tr>
                    <tr>
                        <td><code>onShow</code></td>
                        <td><code>function</code></td>
                        <td><code>noop</code></td>
                        <td>Callback when the pane is about to be shown</td>
                    </tr>
                    <tr>
                        <td><code>onShown</code></td>
                        <td><code>function</code></td>
                        <td><code>noop</code></td>
                        <td>Callback when the pane has been shown</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's tab classes based on the provided props:</p>
        <ul>
            <li><code>tab-content</code> - Applied to Tab.Content components</li>
            <li><code>tab-pane</code> - Applied to Tab.Pane components</li>
            <li><code>active</code> - Applied to Tab.Pane when isActive=true</li>
            <li><code>fade</code> - Applied to Tab.Pane when doFade=true</li>
            <li><code>show</code> - Applied to Tab.Pane during transition when doFade=true</li>
        </ul>

        <h3 id="accessibility" class="h5 mt-4">Accessibility</h3>
        <p>
            In a <code>Tab.Root</code> strip with a <code>tablist</code> container, <code>Tab.NavLink</code> and <code>Nav.Link</code> support automatic
            activation: Right/Down Arrow selects and focuses the next enabled tab, and Left/Up Arrow selects and focuses the previous one, wrapping at either
            end. Home and End select and focus the first and last enabled tabs. All four arrows work in either orientation, matching Bootstrap. Keyboard
            order follows the current DOM order within that tablist; nested roots and other tablists stay separate. Modified keys (Alt, Ctrl, Meta or Shift)
            and composition events retain their native behavior.
        </p>
        <p>
            By default, the selected enabled tab has <code>tabindex="0"</code> and the others have <code>tabindex="-1"</code>. If no enabled tab is
            selected, the first enabled tab becomes the entry point after mount; an all-disabled list has no entry point. Removing or disabling tabs
            updates entry without moving focus. Disabled links reject clicks, including synthetic clicks, before selection or consumer click
            callbacks. Strip links outside a tablist retain their native tab stops and do not manage arrow keys. Tabs use <code>aria-selected</code>
            and omit <code>aria-current</code>.
        </p>
        <p>
            Explicit link roles are honored; a non-tab role opts the link out of automatic tab ARIA and keyboard handling. Root role overrides other
            than <code>tablist</code> also opt out. Pane controls retain ordinary button/link behavior. Explicit <code>tabindex</code> values override
            roving defaults on enabled links, so callers supplying them own tab-sequence consistency. Explicit <code>Nav.Link isActive</code>
            props still control rendered selection; synchronize those props in the application when controlling tabs. Keyboard activation invokes the destination
            link’s existing <code>onclick</code> callback, just like a click. Consumer
            <code>onkeydown</code> runs first and may call <code>preventDefault()</code> to cancel a managed key. Use pane lifecycle callbacks such as
            <code>onShow</code> and <code>onShown</code> to observe pane changes from either clicks or keyboard selection.
        </p>
        <p>
            <code>Tab.NavLink</code> preserves explicit <code>aria-controls</code> and <code>aria-selected</code> overrides; callers supplying them
            must keep panel associations and selection coherent. <code>Nav.Link</code> retains its existing managed tab ARIA priority. Omit these overrides
            to use automatic selection and panel associations.
        </p>
        <p>For controlled <code>Nav.Link</code> tabs, update the active value through the existing click callback:</p>
        <SyntaxHighlighter code={controlledTabCode} />
        <p>The Tab component automatically applies proper ARIA attributes:</p>
        <ul>
            <li>
                <code>role="tablist"</code> - Applied by default to the Nav.Root strip in Tab.Root for every visual style; Nav inside Tab.Pane stays ordinary
            </li>
            <li><code>role="tabpanel"</code> - Applied to Tab.Pane components</li>
            <li><code>aria-labelledby</code> - Links the Tab.Pane to its corresponding Tab.NavLink</li>
            <li><code>aria-hidden</code> - Set to "true" for inactive panes, "false" for active panes</li>
            <li><code>hidden</code> - HTML attribute applied to inactive panes</li>
        </ul>
    </section>
</div>

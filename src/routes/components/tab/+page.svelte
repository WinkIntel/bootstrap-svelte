<script lang="ts">
    import { Nav, Tab } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import TabPlayground from './TabPlayground.svelte';

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
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Tab.Root Props</h3>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
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
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
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
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
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
                        <td>ARIA role for the link. Defaults to 'tab' if within tablist context.</td>
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

        <h3 class="h5 mt-4">Tab.NavLink Props</h3>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
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

        <h3 class="h5 mt-4">Accessibility</h3>
        <p>The Tab component automatically applies proper ARIA attributes:</p>
        <ul>
            <li><code>role="tabpanel"</code> - Applied to Tab.Pane components</li>
            <li><code>aria-labelledby</code> - Links the Tab.Pane to its corresponding Tab.NavLink</li>
            <li><code>aria-hidden</code> - Set to "true" for inactive panes, "false" for active panes</li>
            <li><code>hidden</code> - HTML attribute applied to inactive panes</li>
        </ul>
    </section>
</div>

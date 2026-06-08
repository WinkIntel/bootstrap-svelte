<script lang="ts">
    import { Nav, Tab } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Configurable props
    let doFade = $state(true);
    let activeTab = $state('home');
    let tabCount = $state(3);

    // Tab content options
    const tabOptions = [
        { id: 'home', label: 'Home', content: 'This is the home tab content.' },
        { id: 'profile', label: 'Profile', content: 'This is the profile tab content.' },
        { id: 'contact', label: 'Contact', content: 'This is the contact tab content.' },
        { id: 'settings', label: 'Settings', content: 'This is the settings tab content.' },
        { id: 'messages', label: 'Messages', content: 'This is the messages tab content.' },
        { id: 'docs', label: 'Documentation', content: 'This is the documentation tab content.' }
    ];

    // Generate tabs based on count
    let tabs: typeof tabOptions = $derived(tabOptions.slice(0, tabCount));

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<Tab.Root>
  <Nav.Root itemStyle="tabs">`;

        // Add nav items
        tabs.forEach((tab) => {
            code += `\n    <Nav.Item>
        <Tab.NavLink targetPaneId="#${tab.id}" id="tab-${tab.id}" ${tab.id === activeTab ? 'isActive={true}' : ''}>${tab.label}</Tab.NavLink>
    </Nav.Item>`;
        });

        code += `\n  </Nav.Root>
  <Tab.Content>`;

        // Add tab panes
        tabs.forEach((tab) => {
            code += `\n    <Tab.Pane id="${tab.id}" ${tab.id === activeTab ? 'isActive={true}' : ''} doFade={${doFade}}>
        <h5 class="mt-3">${tab.label} Content</h5>
        <p>${tab.content}</p>
    </Tab.Pane>`;
        });

        code += `\n  </Tab.Content>
</Tab.Root>`;

        return code;
    }

    // Track reactivity
    // Initialize codeSnippet
    let codeSnippet: string = $derived(getCodeSnippet());

    // Handle tab change
    function handleTabChange(id: string) {
        activeTab = id;
    }
</script>

<div class="playground">
    <div class="card mb-4">
        <div class="card-header">
            <h3 class="h5 mb-0">Interactive Tab Playground</h3>
        </div>

        <div class="card-body">
            <div class="row">
                <!-- Controls Column -->
                <div class="col-md-4">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <label for="tabCount" class="form-label">Number of Tabs</label>
                        <input type="range" class="form-range" id="tabCount" min="2" max="6" bind:value={tabCount} />
                        <div class="form-text text-center">{tabCount} tab{tabCount > 1 ? 's' : ''}</div>
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="doFade" bind:checked={doFade} />
                            <label class="form-check-label" for="doFade">Enable Fade Animation</label>
                        </div>
                    </div>

                    <div class="mb-3">
                        <span class="form-span">Active Tab</span>
                        <div class="btn-group-vertical d-flex flex-wrap w-50" role="group">
                            {#each tabs as tab, tabIndex (`tab-${tabIndex}`)}
                                <button
                                    type="button"
                                    class="btn btn-sm {activeTab === tab.id ? 'btn-primary' : 'btn-outline-primary'}"
                                    onclick={() => handleTabChange(tab.id)}>
                                    {tab.label}
                                </button>
                            {/each}
                        </div>
                    </div>
                </div>

                <!-- Preview Column -->
                <div class="col-md-8">
                    <h4 class="h6">Preview</h4>

                    <div class="p-3 border rounded bg-light">
                        <Tab.Root>
                            <Nav.Root itemStyle="tabs">
                                {#each tabs as tab2, tab2Index (`tab2-${tab2Index}`)}
                                    <Nav.Item>
                                        <Tab.NavLink
                                            targetPaneId={`#${tab2.id}`}
                                            id={`tab-${tab2.id}`}
                                            isActive={tab2.id === activeTab}
                                            onclick={() => handleTabChange(tab2.id)}>
                                            {tab2.label}
                                        </Tab.NavLink>
                                    </Nav.Item>
                                {/each}
                            </Nav.Root>
                            <Tab.Content>
                                {#each tabs as tab3, tab3Index (`tab3-${tab3Index}`)}
                                    <Tab.Pane id={tab3.id} isActive={tab3.id === activeTab} {doFade}>
                                        <h5 class="mt-3">{tab3.label} Content</h5>
                                        <p>{tab3.content}</p>
                                    </Tab.Pane>
                                {/each}
                            </Tab.Content>
                        </Tab.Root>
                    </div>

                    <div class="mt-3">
                        <h4 class="h6">Code</h4>
                        <SyntaxHighlighter code={codeSnippet} />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .playground {
        margin-bottom: 2rem;
    }
</style>

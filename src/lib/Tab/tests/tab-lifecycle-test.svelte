<script lang="ts">
    import { Nav } from '$lib/index.js';
    import { Tab } from '../index.js';
    let { doFade = false, paneProps = {} }: { doFade?: boolean; paneProps?: Partial<Tab.PaneProps> } = $props();
</script>

<Tab.Root>
    <Nav.Root>
        <Tab.NavLink targetPaneId="#first" isActive data-testid="first-link">First</Tab.NavLink>
        <Tab.NavLink targetPaneId="#second" data-testid="second-link">Second</Tab.NavLink>
    </Nav.Root>
    <Tab.Content>
        <Tab.Pane id="first" isActive {doFade}>First</Tab.Pane>
        <Tab.Pane {...paneProps} id="second" {doFade} data-testid="pane">Second</Tab.Pane>
    </Tab.Content>
</Tab.Root>

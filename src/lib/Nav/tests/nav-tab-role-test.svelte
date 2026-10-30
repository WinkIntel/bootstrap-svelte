<script lang="ts">
    import { Nav, Tab } from '$lib/index.js';

    let props: Nav.RootProps = $props();
</script>

<Tab.Root>
    <Nav.Root {...props} data-testid="role-tab-nav" aria-label="Example panes">
        <Nav.Item>
            <Tab.NavLink id="role-one-tab" targetPaneId="#role-one-pane" isActive>One</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link id="role-two-tab" href="#role-two-pane">Two</Nav.Link>
        </Nav.Item>
    </Nav.Root>
    <Tab.Content>
        <Tab.Pane id="role-one-pane" isActive>First pane</Tab.Pane>
        <Tab.Pane id="role-two-pane">Second pane</Tab.Pane>
    </Tab.Content>
</Tab.Root>

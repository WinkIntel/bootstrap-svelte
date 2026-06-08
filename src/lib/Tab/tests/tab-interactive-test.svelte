<script lang="ts">
    import { Nav } from '$lib/index.js';
    import { Tab } from '../index.js';
</script>

<!-- Interactive Tabs Test Component -->
<Tab.Root>
    <Nav.Root data-testid="interactive-nav-tabs" itemStyle="tabs">
        <Nav.Item>
            <Tab.NavLink data-testid="tab-link-home" targetPaneId="#home-interactive" isActive={true}>Home</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink data-testid="tab-link-profile" targetPaneId="#profile-interactive">Profile</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink data-testid="tab-link-contact" targetPaneId="#contact-interactive">Contact</Tab.NavLink>
        </Nav.Item>
    </Nav.Root>
    <Tab.Content data-testid="interactive-tab-content">
        <Tab.Pane data-testid="pane-home" id="home-interactive" isActive={true}>
            <p>Home Content</p>
        </Tab.Pane>
        <Tab.Pane data-testid="pane-profile" id="profile-interactive">
            <p>Profile Content</p>
        </Tab.Pane>
        <Tab.Pane data-testid="pane-contact" id="contact-interactive">
            <p>Contact Content</p>
        </Tab.Pane>
    </Tab.Content>
</Tab.Root>

<script lang="ts">
    import { Nav } from '$lib/index.js';
    import { Tab } from '../index.js';
</script>

<!-- Tabs with Content Example -->
<div class="mb-5">
    <h4>Tabs with Content Example</h4>
    <Tab.Root>
        <Nav.Root data-testid="nav-tabs" itemStyle="tabs">
            <Nav.Item>
                <Tab.NavLink targetPaneId="#home" isActive={true}>Home</Tab.NavLink>
            </Nav.Item>
            <Nav.Item>
                <Tab.NavLink targetPaneId="#profile">Profile</Tab.NavLink>
            </Nav.Item>
            <Nav.Item>
                <Tab.NavLink targetPaneId="#contact">Contact</Tab.NavLink>
            </Nav.Item>
        </Nav.Root>
        <Tab.Content data-testid="tab-content-container">
            <Tab.Pane data-testid="home-content" id="home" isActive={true}>
                <h5 class="mt-3">Home Content</h5>
                <p>This is the home content panel.</p>
            </Tab.Pane>
            <Tab.Pane data-testid="profile-content" id="profile">
                <h5 class="mt-3">Profile Content</h5>
                <p>This is the profile content panel.</p>
            </Tab.Pane>
            <Tab.Pane data-testid="contact-content" id="contact">
                <h5 class="mt-3">Contact Content</h5>
                <p>This is the contact content panel.</p>
            </Tab.Pane>
        </Tab.Content>
    </Tab.Root>
</div>

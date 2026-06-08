<script lang="ts">
    import { Nav } from '$lib/index.js';
    import { Tab } from '../index.js';

    let homeActive = $state(false);
    let profileActive = $state(false);
    let contactActive = $state(true);

    export function activateHome() {
        homeActive = true;
        profileActive = false;
        contactActive = false;
    }

    export function activateProfile() {
        homeActive = false;
        profileActive = true;
        contactActive = false;
    }

    export function activateContact() {
        homeActive = false;
        profileActive = false;
        contactActive = true;
    }
</script>

<!-- Programmatic Tab Control Test Component -->
<Tab.Root>
    <Nav.Root data-testid="programmatic-nav-tabs" itemStyle="tabs">
        <Nav.Item>
            <Tab.NavLink data-testid="prog-tab-link-home" targetPaneId="#home-prog" isActive={homeActive}>Home</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink data-testid="prog-tab-link-profile" targetPaneId="#profile-prog" isActive={profileActive}>Profile</Tab.NavLink>
        </Nav.Item>
        <Nav.Item>
            <Tab.NavLink data-testid="prog-tab-link-contact" targetPaneId="#contact-prog" isActive={contactActive}>Contact</Tab.NavLink>
        </Nav.Item>
    </Nav.Root>
    <Tab.Content data-testid="programmatic-tab-content">
        <Tab.Pane data-testid="prog-pane-home" id="home-prog" isActive={homeActive}>
            <p>Home Content</p>
        </Tab.Pane>
        <Tab.Pane data-testid="prog-pane-profile" id="profile-prog" isActive={profileActive}>
            <p>Profile Content</p>
        </Tab.Pane>
        <Tab.Pane data-testid="prog-pane-contact" id="contact-prog" isActive={contactActive}>
            <p>Contact Content</p>
        </Tab.Pane>
    </Tab.Content>
</Tab.Root>

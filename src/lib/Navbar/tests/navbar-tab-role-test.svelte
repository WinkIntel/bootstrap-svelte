<script lang="ts">
    import { Nav, Navbar, Tab } from '$lib/index.js';

    type Scenario = 'collapse-strip' | 'nested-strip' | 'nested-tab-root' | 'no-tab-root' | 'pane' | 'strip';

    let { role, scenario = 'strip' }: { role?: Navbar.NavProps['role']; scenario?: Scenario } = $props();
</script>

{#if scenario === 'no-tab-root'}
    <Navbar.Root>
        <Navbar.Nav aria-label="Sections" data-testid="navbar-nav" {role}>
            <Nav.Item><Nav.Link href="/one" isActive>One</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link href="/two">Two</Nav.Link></Nav.Item>
        </Navbar.Nav>
    </Navbar.Root>
{:else if scenario === 'collapse-strip'}
    <Tab.Root>
        <Navbar.Root>
            <Navbar.Collapse transitionDuration={0}>
                <Navbar.Nav aria-label="Sections" data-testid="navbar-nav" {role}>
                    <Nav.Item><Tab.NavLink targetPaneId="#one" isActive>One</Tab.NavLink></Nav.Item>
                    <Nav.Item><Nav.Link href="#two">Two</Nav.Link></Nav.Item>
                </Navbar.Nav>
            </Navbar.Collapse>
        </Navbar.Root>
        <Tab.Pane id="one" isActive>First pane</Tab.Pane>
        <Tab.Pane id="two">Second pane</Tab.Pane>
    </Tab.Root>
{:else if scenario === 'pane'}
    <Tab.Root>
        <Nav.Root aria-label="Steps">
            <Nav.Item><Nav.Link href="#one" isActive>Step one</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link href="#two">Step two</Nav.Link></Nav.Item>
        </Nav.Root>
        <Tab.Pane id="one" isActive>
            First pane
            <Navbar.Root>
                <Navbar.Nav aria-label="Sections" data-testid="navbar-nav" {role}>
                    <Nav.Item><Nav.Link href="#section">Section</Nav.Link></Nav.Item>
                    <Nav.Item><Tab.NavLink targetPaneId="#two">Next</Tab.NavLink></Nav.Item>
                </Navbar.Nav>
            </Navbar.Root>
        </Tab.Pane>
        <Tab.Pane id="two">Second pane</Tab.Pane>
    </Tab.Root>
{:else if scenario === 'nested-tab-root'}
    <Tab.Root>
        <Navbar.Root>
            <Navbar.Nav aria-label="Sections" data-testid="navbar-nav" {role}>
                <Tab.Root>
                    <Nav.Item><Tab.NavLink targetPaneId="#inner-one" isActive>Inner one</Tab.NavLink></Nav.Item>
                    <Nav.Item><Nav.Link href="#inner-two">Inner two</Nav.Link></Nav.Item>
                    <Tab.Pane id="inner-one" isActive>Inner first</Tab.Pane>
                    <Tab.Pane id="inner-two">Inner second</Tab.Pane>
                </Tab.Root>
            </Navbar.Nav>
        </Navbar.Root>
    </Tab.Root>
{:else if scenario === 'nested-strip'}
    <Tab.Root>
        <Tab.Pane id="outer" isActive>
            Outer pane
            <Tab.Root>
                <Navbar.Root>
                    <Navbar.Nav aria-label="Sections" data-testid="navbar-nav" {role}>
                        <Nav.Item><Tab.NavLink targetPaneId="#inner-one" isActive>Inner one</Tab.NavLink></Nav.Item>
                        <Nav.Item><Nav.Link href="#inner-two">Inner two</Nav.Link></Nav.Item>
                    </Navbar.Nav>
                </Navbar.Root>
                <Tab.Pane id="inner-one" isActive>Inner first</Tab.Pane>
                <Tab.Pane id="inner-two">Inner second</Tab.Pane>
            </Tab.Root>
        </Tab.Pane>
    </Tab.Root>
{:else}
    <Tab.Root>
        <Navbar.Root>
            <Navbar.Nav aria-label="Sections" data-testid="navbar-nav" {role}>
                <Nav.Item><Tab.NavLink targetPaneId="#one" isActive>One</Tab.NavLink></Nav.Item>
                <Nav.Item><Nav.Link href="#two">Two</Nav.Link></Nav.Item>
            </Navbar.Nav>
        </Navbar.Root>
        <Tab.Pane id="one" isActive>First pane</Tab.Pane>
        <Tab.Pane id="two">Second pane</Tab.Pane>
    </Tab.Root>
{/if}

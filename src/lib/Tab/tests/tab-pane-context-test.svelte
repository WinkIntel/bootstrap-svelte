<script lang="ts">
    import { Nav, Tab } from '$lib/index.js';

    type Scenario =
        | 'bare-nav-link'
        | 'bare-tab-nav-link'
        | 'nested-pane'
        | 'nested-tab-root'
        | 'opted-out-outer-strip'
        | 'outer-nav-root'
        | 'pane-nav-link'
        | 'pane-nav-nested-tab-root'
        | 'pane-nav-tab-nav-link'
        | 'strip-wrapped-pane';

    let { paneNavRole, scenario }: { paneNavRole?: Nav.RootProps['role']; scenario: Scenario } = $props();
</script>

{#if scenario === 'outer-nav-root'}
    <Nav.Root data-testid="outer-nav" elementType="nav">
        <Tab.Root>
            <Tab.Pane id="step-one" isActive>
                First step
                <Nav.Link href="#step-two">Next</Nav.Link>
            </Tab.Pane>
            <Tab.Pane id="step-two">Second step</Tab.Pane>
        </Tab.Root>
    </Nav.Root>
{:else if scenario === 'strip-wrapped-pane'}
    <Tab.Root>
        <Nav.Root data-testid="strip-nav" elementType="nav">
            <Tab.Pane id="step-one" isActive>
                First step
                <Nav.Link href="#step-two">Next</Nav.Link>
            </Tab.Pane>
            <Tab.Pane id="step-two">Second step</Tab.Pane>
        </Nav.Root>
    </Tab.Root>
{:else if scenario === 'opted-out-outer-strip'}
    <Tab.Root>
        <Nav.Root data-testid="opted-out-nav" elementType="nav" role={null}>
            <Tab.Root>
                <Nav.Item><Nav.Link href="#inner-one" isActive>Inner one</Nav.Link></Nav.Item>
                <Tab.Pane id="inner-one" isActive>Inner first</Tab.Pane>
            </Tab.Root>
        </Nav.Root>
    </Tab.Root>
{:else}
    <Tab.Root>
        <Nav.Root aria-label="Steps">
            <Nav.Item><Nav.Link href="#step-one" isActive>One</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link href="#step-two">Two</Nav.Link></Nav.Item>
        </Nav.Root>
        <Tab.Content>
            <Tab.Pane id="step-one" isActive>
                First step
                {#if scenario === 'bare-tab-nav-link'}
                    <Tab.NavLink targetPaneId="#step-two">Next</Tab.NavLink>
                {:else if scenario === 'bare-nav-link'}
                    <Nav.Item><Nav.Link href="#step-two">Next</Nav.Link></Nav.Item>
                {:else if scenario === 'pane-nav-tab-nav-link'}
                    <Nav.Root data-testid="pane-nav" role={paneNavRole}>
                        <Nav.Item><Tab.NavLink targetPaneId="#step-two">Next</Tab.NavLink></Nav.Item>
                    </Nav.Root>
                {:else if scenario === 'pane-nav-link'}
                    <Nav.Root data-testid="pane-nav" itemStyle="tabs">
                        <Nav.Item><Nav.Link href="#step-two">Section</Nav.Link></Nav.Item>
                    </Nav.Root>
                {:else if scenario === 'nested-pane'}
                    <Tab.Pane id="step-nested">Nested step</Tab.Pane>
                {:else if scenario === 'nested-tab-root'}
                    <Tab.Root>
                        <Nav.Root aria-label="Inner steps">
                            <Nav.Item><Nav.Link href="#inner-one" isActive>Inner one</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link href="#inner-two">Inner two</Nav.Link></Nav.Item>
                        </Nav.Root>
                        <Tab.Pane id="inner-one" isActive>
                            Inner first
                            <Tab.NavLink targetPaneId="#inner-two">Inner next</Tab.NavLink>
                        </Tab.Pane>
                        <Tab.Pane id="inner-two">Inner second</Tab.Pane>
                    </Tab.Root>
                {:else if scenario === 'pane-nav-nested-tab-root'}
                    <Nav.Root data-testid="pane-nav" elementType="nav">
                        <Tab.Root>
                            <Nav.Item><Nav.Link href="#inner-one" isActive>Inner one</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link href="#inner-two">Inner two</Nav.Link></Nav.Item>
                            <Tab.Pane id="inner-one" isActive>Inner first</Tab.Pane>
                            <Tab.Pane id="inner-two">Inner second</Tab.Pane>
                        </Tab.Root>
                    </Nav.Root>
                {/if}
            </Tab.Pane>
            <Tab.Pane id="step-two">Second step</Tab.Pane>
        </Tab.Content>
    </Tab.Root>
{/if}

<script lang="ts">
    import { Nav, Tab } from '$lib/index.js';

    let {
        control = 'tab',
        panesFirst = false,
        duplicates = false,
        nested = false,
        stripRole = 'tablist',
        linkRole,
        controlled = false,
        showFirst = true,
        firstId = 'strip-a',
        firstTarget = '#a',
        returnTarget = '#a',
        firstActive = true,
        paneControlActive
    }: {
        control?: 'tab' | 'nav';
        panesFirst?: boolean;
        duplicates?: boolean;
        nested?: boolean;
        stripRole?: Nav.RootProps['role'];
        linkRole?: Tab.NavLinkProps['role'];
        controlled?: boolean;
        showFirst?: boolean;
        firstId?: string;
        firstTarget?: string;
        returnTarget?: string;
        firstActive?: boolean;
        paneControlActive?: boolean;
    } = $props();
</script>

{#snippet paneControl(target: string, label: string, active: boolean | undefined)}
    {#if control === 'tab'}
        <Tab.NavLink targetPaneId={target} isActive={active}>{label}</Tab.NavLink>
    {:else}
        <Nav.Link href={target} isActive={active}>{label}</Nav.Link>
    {/if}
{/snippet}

{#snippet strip()}
    <Nav.Root aria-label="Outer tabs" role={stripRole}>
        {#if showFirst}
            {#if controlled}
                <Nav.Link id={firstId} href={firstTarget} isActive={firstActive}>A</Nav.Link>
            {:else}
                <Tab.NavLink id={firstId} targetPaneId={firstTarget} isActive={firstActive} {...linkRole === undefined ? {} : { role: linkRole }}
                    >A</Tab.NavLink>
            {/if}
        {/if}
        {#if duplicates}
            <Tab.NavLink id="strip-a-second" targetPaneId="#a" {...linkRole === undefined ? {} : { role: linkRole }}>A second</Tab.NavLink>
        {/if}
        {#if controlled}
            <Nav.Link id="strip-b" href="#b" isActive={false}>B</Nav.Link>
        {:else}
            <Tab.NavLink id="strip-b" targetPaneId="#b" {...linkRole === undefined ? {} : { role: linkRole }}>B</Tab.NavLink>
        {/if}
    </Nav.Root>
{/snippet}

{#snippet panes()}
    <Tab.Pane id="a" isActive={true}>
        Pane A
        {@render paneControl('#a', 'Stay on A', undefined)}
        {@render paneControl('#b', 'Go to B', paneControlActive)}
        {@render paneControl('#unlisted', 'Go unlisted', undefined)}
        {#if nested}
            <Tab.Root>
                <Nav.Root aria-label="Inner tabs">
                    <Tab.NavLink id="inner-strip-a" targetPaneId="#inner-a" isActive>Inner A</Tab.NavLink>
                    <Tab.NavLink id="inner-strip-b" targetPaneId="#inner-b">Inner B</Tab.NavLink>
                </Nav.Root>
                <Tab.Pane id="inner-a" isActive>Inner pane A</Tab.Pane>
                <Tab.Pane id="inner-b">
                    Inner pane B
                    <Tab.NavLink targetPaneId="#inner-a">Return inner A</Tab.NavLink>
                </Tab.Pane>
            </Tab.Root>
        {/if}
    </Tab.Pane>
    <Tab.Pane id="b">
        Pane B
        {@render paneControl(returnTarget, 'Return to A', undefined)}
        {@render paneControl('#unlisted', 'Go unlisted', undefined)}
    </Tab.Pane>
    <Tab.Pane id="unlisted">
        Unlisted pane
        {@render paneControl(returnTarget, 'Return to A', undefined)}
    </Tab.Pane>
{/snippet}

<Tab.Root>
    {#if panesFirst}
        {@render panes()}
        {@render strip()}
    {:else}
        {@render strip()}
        {@render panes()}
    {/if}
</Tab.Root>

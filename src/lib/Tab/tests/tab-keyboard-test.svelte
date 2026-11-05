<script lang="ts">
    import { Nav, Tab } from '$lib/index.js';
    let {
        kind = 'tab',
        order = ['a', 'b', 'c'],
        disabled = ['b'],
        initial = 'a',
        rootRole,
        linkRole,
        controlled = false,
        secondList = false,
        nested = false,
        consumerTabIndex,
        cancelKeys = false,
        ordinary = false,
        corruptRef = false,
        vertical = false,
        rawLists = false,
        tabindexNull = false,
        consumerAria = false,
        nativeDisabled = [],
        bare = false,
        syncControlled = false,
        badge = false
    }: {
        kind?: 'tab' | 'nav';
        order?: string[];
        disabled?: string[];
        initial?: string;
        rootRole?: Nav.RootProps['role'];
        linkRole?: Tab.NavLinkProps['role'];
        controlled?: boolean;
        secondList?: boolean;
        nested?: boolean;
        consumerTabIndex?: number;
        cancelKeys?: boolean;
        ordinary?: boolean;
        corruptRef?: boolean;
        vertical?: boolean;
        rawLists?: boolean;
        tabindexNull?: boolean;
        consumerAria?: boolean;
        nativeDisabled?: string[];
        bare?: boolean;
        syncControlled?: boolean;
        badge?: boolean;
    } = $props();
    export function readRef() {
        return ref;
    }
    let clicks = $state(0);
    let keys = $state(0);
    let lastClick = $state('');
    let ref = $state<HTMLElement | null>(null);
    $effect(() => {
        if (corruptRef) ref = document.createElement('button');
    });
</script>

{#snippet links()}
    {#each order as name (name)}
        {#if kind === 'tab'}
            <Tab.NavLink
                id={`key-${name}`}
                targetPaneId={`#${name}`}
                isActive={initial === name}
                aria-controls={consumerAria ? 'consumer-panel' : undefined}
                aria-selected={consumerAria ? false : undefined}
                isDisabled={disabled.includes(name)}
                disabled={nativeDisabled.includes(name)}
                role={linkRole}
                tabindex={tabindexNull ? null : consumerTabIndex}
                bind:elementRef={ref}
                onclick={(event) => {
                    clicks++;
                    lastClick = `${event.type}:${event.currentTarget instanceof HTMLElement ? event.currentTarget.id : ''}`;
                    if (syncControlled) initial = name;
                }}
                onkeydown={(event) => {
                    keys++;
                    if (cancelKeys) event.preventDefault();
                }}>
                {name.toUpperCase()}{#if badge}<span aria-hidden="true">!</span>{/if}
            </Tab.NavLink>
        {:else}
            <Nav.Link
                id={`key-${name}`}
                href={ordinary ? `/page-${name}` : `#${name}`}
                isActive={controlled ? initial === name : initial === name ? true : undefined}
                isDisabled={disabled.includes(name)}
                role={linkRole as Nav.LinkProps['role']}
                tabindex={tabindexNull ? null : consumerTabIndex}
                bind:elementRef={ref}
                onclick={(event) => {
                    clicks++;
                    lastClick = `${event.type}:${event.currentTarget instanceof HTMLElement ? event.currentTarget.id : ''}`;
                    if (syncControlled) initial = name;
                }}
                onkeydown={(event) => {
                    keys++;
                    if (cancelKeys) event.preventDefault();
                }}>
                {name.toUpperCase()}{#if badge}<span aria-hidden="true">!</span>{/if}
            </Nav.Link>
        {/if}
    {/each}
{/snippet}

{#if ordinary}
    <Nav.Root aria-label="Main" role={rootRole} verticalBreakpoint={vertical ? 'xs' : undefined}>{@render links()}</Nav.Root>
{:else}
    <Tab.Root>
        {#if bare}
            {@render links()}
        {:else if rawLists}
            <div role="tablist" aria-label="Main">
                {@render links()}
                <div role="tablist" aria-label="Raw nested">
                    <Tab.NavLink targetPaneId="#d">Raw D</Tab.NavLink><Tab.NavLink targetPaneId="#e">Raw E</Tab.NavLink>
                </div>
            </div>
        {:else}
            <Nav.Root aria-label="Main" role={rootRole} verticalBreakpoint={vertical ? 'xs' : undefined}>{@render links()}</Nav.Root>
        {/if}
        {#if secondList}
            <Nav.Root aria-label="Second">
                <Tab.NavLink targetPaneId="#d">D</Tab.NavLink><Tab.NavLink targetPaneId="#e">E</Tab.NavLink>
            </Nav.Root>
        {/if}
        <Tab.Pane id="a" isActive={initial === 'a'}>
            Pane A <Tab.NavLink targetPaneId="#c">Pane control</Tab.NavLink>
            {#if nested}
                <Tab.Root>
                    <Nav.Root aria-label="Nested"
                        ><Tab.NavLink targetPaneId="#inner-a" isActive>Inner A</Tab.NavLink><Tab.NavLink targetPaneId="#inner-b">Inner B</Tab.NavLink
                        ></Nav.Root>
                    <Tab.Pane id="inner-a" isActive>Inner pane A</Tab.Pane><Tab.Pane id="inner-b">Inner pane B</Tab.Pane>
                </Tab.Root>
            {/if}
        </Tab.Pane>
        <Tab.Pane id="b" isActive={initial === 'b'}>Pane B</Tab.Pane>
        <Tab.Pane id="c" isActive={initial === 'c'}>Pane C</Tab.Pane>
        <Tab.Pane id="d">Pane D</Tab.Pane><Tab.Pane id="e">Pane E</Tab.Pane>
    </Tab.Root>
{/if}
<output data-testid="callbacks">{clicks}:{keys}</output>

<output data-testid="last-click">{lastClick}</output>

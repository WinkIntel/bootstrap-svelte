<script lang="ts">
    import { Nav, Tab } from '$lib/index.js';

    let { active = true, ordinary = false }: { active?: boolean; ordinary?: boolean } = $props();
</script>

{#snippet links()}
    <Nav.Root>
        <Nav.Link id="controlled-strip" href="#a" isActive={active}>Controlled</Nav.Link>
        <Nav.Link id={ordinary ? 'ordinary-other' : ''} href="#b">Other</Nav.Link>
    </Nav.Root>
{/snippet}

{#if ordinary}
    {@render links()}
{:else}
    <Tab.Root>
        {@render links()}
        <Tab.Pane id="a" isActive>Pane A</Tab.Pane>
        <Tab.Pane id="b">Pane B</Tab.Pane>
    </Tab.Root>
{/if}

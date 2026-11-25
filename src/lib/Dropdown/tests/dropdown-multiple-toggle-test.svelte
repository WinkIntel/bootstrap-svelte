<script lang="ts">
    import { Dropdown } from '$lib/index.js';
    let showFirst = $state(true);
    let showSecond = $state(true);
</script>

<button data-testid="remove-first" onclick={() => (showFirst = false)}>Remove first toggle</button>
<button data-testid="remove-second" onclick={() => (showSecond = false)}>Remove second toggle</button>
<Dropdown.Root isButtonGroup autoClose={false} data-testid="multiple-root">
    {#if showFirst}
        <Dropdown.Toggle id="first-toggle" data-testid="first-toggle">First toggle</Dropdown.Toggle>
    {/if}
    {#if showSecond}
        <Dropdown.Toggle id="second-toggle" data-testid="second-toggle" isSplit>Second toggle</Dropdown.Toggle>
    {/if}
    <Dropdown.Menu data-testid="multiple-menu">
        <Dropdown.Item data-testid="first-item">First item</Dropdown.Item>
        <Dropdown.Item data-testid="last-item">Last item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

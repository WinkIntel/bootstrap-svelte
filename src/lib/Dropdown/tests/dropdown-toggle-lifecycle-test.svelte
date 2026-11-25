<script lang="ts">
    import { Dropdown } from '$lib/index.js';
    let { keyed = false, buttonGroup = false, withOutro = false }: { keyed?: boolean; buttonGroup?: boolean; withOutro?: boolean } = $props();
    const outgoing = (_node: Element) => ({ duration: withOutro ? 25 : 0 });
    let swapped = $state(false);
    let toggleId = $state('original-toggle');
    let showSplit = $state(true);
    let split = $state(true);
</script>

<button data-testid="swap" onclick={() => (swapped = !swapped)}>Swap</button>
<button data-testid="rename" onclick={() => (toggleId = 'renamed-toggle')}>Rename</button>
<button data-testid="remove-split" onclick={() => (showSplit = false)}>Remove split</button>
<button data-testid="unset-split" onclick={() => (split = false)}>Unset split</button>
<Dropdown.Root autoClose={false} data-testid="swap-root">
    {#if keyed}
        {#key swapped}
            <Dropdown.Toggle id={swapped ? 'replacement-toggle' : 'initial-toggle'} data-testid="swap-toggle">Toggle</Dropdown.Toggle>
        {/key}
    {:else if swapped}
        <Dropdown.Toggle id="replacement-toggle" data-testid="swap-toggle">Replacement</Dropdown.Toggle>
    {:else}
        <span out:outgoing><Dropdown.Toggle id="initial-toggle" data-testid="swap-toggle">Initial</Dropdown.Toggle></span>
    {/if}
    <Dropdown.Menu data-testid="swap-menu">
        <Dropdown.Item data-testid="swap-item">Item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>
<Dropdown.Root isButtonGroup={buttonGroup} data-testid="split-root">
    <Dropdown.Toggle id={toggleId} data-testid="dynamic-toggle">Dynamic</Dropdown.Toggle>
    {#if showSplit}
        <Dropdown.Toggle isSplit={split} data-testid="split-toggle">Split</Dropdown.Toggle>
    {/if}
    <Dropdown.Menu data-testid="dynamic-menu"><Dropdown.Item>Item</Dropdown.Item></Dropdown.Menu>
</Dropdown.Root>

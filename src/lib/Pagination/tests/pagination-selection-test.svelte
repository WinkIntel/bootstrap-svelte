<script lang="ts">
    import { Pagination } from '$lib/Pagination/index.js';
    let { isStateful = true, multiple = false, disabled = false }: { isStateful?: boolean; multiple?: boolean; disabled?: boolean } = $props();
    let activeOne = $state(false);
    let activeTwo = $state(true);
    // The fixture intentionally seeds declarative state at mount.
    // svelte-ignore state_referenced_locally
    let activeThree = $state(multiple);
    let oneId = $state('one');
    let showOne = $state(true);
    let showNew = $state(false);
    let reuseOne = $state(false);
    let clicks = $state(0);
</script>

<button
    data-testid="declare-one"
    onclick={() => {
        activeOne = true;
        activeTwo = false;
        activeThree = false;
    }}>Declare one</button>
<button
    data-testid="declare-two"
    onclick={() => {
        activeOne = false;
        activeTwo = true;
        activeThree = false;
    }}>Declare two</button>
<button
    data-testid="declare-none"
    onclick={() => {
        activeOne = false;
        activeTwo = false;
        activeThree = false;
    }}>Declare none</button>
<button data-testid="mount-active" onclick={() => (showNew = true)}>Mount active</button>
<button
    data-testid="change-id"
    onclick={() => {
        oneId = 'changed';
        reuseOne = true;
    }}>Change id</button>
<button
    data-testid="remove-one"
    onclick={() => {
        showOne = false;
        reuseOne = true;
    }}>Remove one</button>
<Pagination.Root {isStateful} data-testid="selection-root">
    {#if showOne}
        <Pagination.Item id={oneId} isActive={activeOne} isDisabled={disabled} data-testid="one-item">
            <Pagination.Link href="#one" data-testid="one-link" onclick={() => clicks++}>One</Pagination.Link>
        </Pagination.Item>
    {/if}
    <Pagination.Item id="two" isActive={activeTwo} data-testid="two-item"
        ><Pagination.Link href="#two" data-testid="two-link">Two</Pagination.Link></Pagination.Item>
    <Pagination.Item id="three" isActive={activeThree} data-testid="three-item"
        ><Pagination.Link href="#three" data-testid="three-link">Three</Pagination.Link></Pagination.Item>
    {#if showNew}<Pagination.Item id="new" isActive data-testid="new-item"><Pagination.Link href="#new">New</Pagination.Link></Pagination.Item>{/if}
    {#if reuseOne}<Pagination.Item id="one" data-testid="reuse-item"
            ><Pagination.Link href="#reuse" data-testid="reuse-link">Reuse</Pagination.Link></Pagination.Item
        >{/if}
</Pagination.Root>
<Pagination.Root data-testid="independent-root">
    <Pagination.Item id="one"><Pagination.Link href="#other-one" data-testid="other-link">Other one</Pagination.Link></Pagination.Item>
    <Pagination.Item id="two" isActive><Pagination.Link href="#other-two">Other two</Pagination.Link></Pagination.Item>
</Pagination.Root>
<output data-testid="clicks">{clicks}</output>

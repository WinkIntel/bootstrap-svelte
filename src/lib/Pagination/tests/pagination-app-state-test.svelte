<script lang="ts">
    import { Pagination } from '$lib/Pagination/index.js';
    let { isStateful = true, emptyIds = false }: { isStateful?: boolean; emptyIds?: boolean } = $props();
    let page = $state(2);
    let generation = $state(0);
    let showSelected = $state(true);
</script>

<button data-testid="external-page" onclick={() => (page = 1)}>External page</button>
<button data-testid="remount-pages" onclick={() => generation++}>Reload pages</button>
<button data-testid="remove-selected" onclick={() => (showSelected = false)}>Remove selected</button>
<Pagination.Root {isStateful} data-testid="app-root">
    <Pagination.Item data-testid="previous-item"
        ><Pagination.Link data-testid="previous-link" onclick={() => page--}>Previous</Pagination.Link></Pagination.Item>
    {#key generation}
        {#each [1, 2, 3, 4] as n (n)}
            {#if showSelected || n !== 3}
                <Pagination.Item isActive={page === n} data-testid={`page-${n}`}
                    ><Pagination.Link data-testid={`link-${n}`} onclick={() => (page = n)}>{n}</Pagination.Link></Pagination.Item>
            {/if}
        {/each}
    {/key}
    <Pagination.Item data-testid="next-item"><Pagination.Link data-testid="next-link" onclick={() => page++}>Next</Pagination.Link></Pagination.Item>
    {#if emptyIds}
        <Pagination.Item id="" data-testid="empty-one"><Pagination.Link>Empty one</Pagination.Link></Pagination.Item>
        <Pagination.Item id={null} data-testid="empty-two"><Pagination.Link>Empty two</Pagination.Link></Pagination.Item>
    {/if}
</Pagination.Root>
<output data-testid="app-page">{page}</output>

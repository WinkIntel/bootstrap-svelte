<script lang="ts">
    import { Pagination } from '$lib/Pagination/index.js';

    let secondItemIsDisabled = $state(true);
    let showReusedItem = $state(true);
    let reusedItemIsDisabled = $state(true);
    let firstDisabledClicks = $state(0);
    let secondDisabledClicks = $state(0);
    let linkDisabledClicks = $state(0);
    let enabledClicks = $state(0);
</script>

<button data-testid="pagination-enable-second" onclick={() => (secondItemIsDisabled = false)}>Enable second</button>
<button data-testid="pagination-disable-second" onclick={() => (secondItemIsDisabled = true)}>Disable second</button>
<button data-testid="pagination-unmount-reused" onclick={() => (showReusedItem = false)}>Unmount reused</button>
<button
    data-testid="pagination-remount-reused-enabled"
    onclick={() => {
        reusedItemIsDisabled = false;
        showReusedItem = true;
    }}>Remount reused enabled</button>

<Pagination.Root data-testid="pagination-interaction-root">
    {#if showReusedItem}
        <Pagination.Item data-testid="pagination-reused-item" id="reused-item" isDisabled={reusedItemIsDisabled}>
            <Pagination.Link data-testid="pagination-reused-link" href="#reused" onclick={() => (firstDisabledClicks += 1)}>Reused</Pagination.Link>
        </Pagination.Item>
    {/if}
    <Pagination.Item data-testid="pagination-second-item" id="second-item" isDisabled={secondItemIsDisabled}>
        <Pagination.Link
            data-testid="pagination-second-link"
            href="#second"
            aria-disabled="false"
            tabindex={4}
            onclick={() => (secondDisabledClicks += 1)}>
            Second
        </Pagination.Link>
    </Pagination.Item>
    <Pagination.Item data-testid="pagination-link-disabled-item" id="link-disabled-item">
        <Pagination.Link
            data-testid="pagination-link-disabled-link"
            href="#link-disabled"
            isDisabled={true}
            onclick={() => (linkDisabledClicks += 1)}>
            Link disabled
        </Pagination.Link>
    </Pagination.Item>
    <Pagination.Item data-testid="pagination-enabled-item" id="enabled-item" aria-current="location">
        <Pagination.Link data-testid="pagination-enabled-link" href="#enabled" onclick={() => (enabledClicks += 1)}>Enabled</Pagination.Link>
    </Pagination.Item>
</Pagination.Root>

<output data-testid="pagination-click-counts">{firstDisabledClicks}:{secondDisabledClicks}:{linkDisabledClicks}:{enabledClicks}</output>

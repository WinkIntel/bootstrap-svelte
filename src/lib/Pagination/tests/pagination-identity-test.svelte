<script lang="ts">
    import { Pagination } from '$lib/Pagination/index.js';

    let activeId = $state('active-old');
    let disabledId = $state('disabled-old');
    let showActive = $state(true);
    let showDisabled = $state(true);
    let showOldActiveReuse = $state(false);
    let showOldDisabledReuse = $state(false);
    let showNewActiveReuse = $state(false);
    let showNewDisabledReuse = $state(false);
    let statefulId = $state('stateful-old');
    let showStateful = $state(true);
    let showOldStatefulReuse = $state(false);
    let showNewStatefulReuse = $state(false);
</script>

<button
    data-testid="change-identities"
    onclick={() => {
        activeId = 'active-new';
        disabledId = 'disabled-new';
        showOldActiveReuse = true;
        showOldDisabledReuse = true;
    }}>Change identities</button>
<button
    data-testid="replace-current-identities"
    onclick={() => {
        showActive = false;
        showDisabled = false;
        showNewActiveReuse = true;
        showNewDisabledReuse = true;
    }}>Replace current identities</button>
<button
    data-testid="change-stateful-identity"
    onclick={() => {
        statefulId = 'stateful-new';
        showOldStatefulReuse = true;
    }}>Change stateful identity</button>
<button
    data-testid="replace-stateful-identity"
    onclick={() => {
        showStateful = false;
        showNewStatefulReuse = true;
    }}>Replace stateful identity</button>

<Pagination.Root>
    {#if showActive}
        <Pagination.Item data-testid="active-item" id={activeId} isActive={true}>
            <Pagination.Link href="#active">Active</Pagination.Link>
        </Pagination.Item>
    {/if}
    {#if showDisabled}
        <Pagination.Item data-testid="disabled-item" id={disabledId} isDisabled={true}>
            <Pagination.Link data-testid="disabled-link" href="#disabled">Disabled</Pagination.Link>
        </Pagination.Item>
    {/if}
    {#if showOldActiveReuse}
        <Pagination.Item data-testid="old-active-reuse" id="active-old">
            <Pagination.Link href="#old-active-reuse">Old active reuse</Pagination.Link>
        </Pagination.Item>
    {/if}
    {#if showOldDisabledReuse}
        <Pagination.Item data-testid="old-disabled-reuse" id="disabled-old">
            <Pagination.Link data-testid="old-disabled-reuse-link" href="#old-disabled-reuse">Old disabled reuse</Pagination.Link>
        </Pagination.Item>
    {/if}
    {#if showNewActiveReuse}
        <Pagination.Item data-testid="new-active-reuse" id="active-new">
            <Pagination.Link href="#new-active-reuse">New active reuse</Pagination.Link>
        </Pagination.Item>
    {/if}
    {#if showNewDisabledReuse}
        <Pagination.Item data-testid="new-disabled-reuse" id="disabled-new">
            <Pagination.Link data-testid="new-disabled-reuse-link" href="#new-disabled-reuse">New disabled reuse</Pagination.Link>
        </Pagination.Item>
    {/if}
</Pagination.Root>

<Pagination.Root isStateful={true}>
    {#if showStateful}
        <Pagination.Item data-testid="stateful-item" id={statefulId}>
            <Pagination.Link data-testid="stateful-link" href="#stateful">Stateful</Pagination.Link>
        </Pagination.Item>
    {/if}
    {#if showOldStatefulReuse}
        <Pagination.Item data-testid="old-stateful-reuse" id="stateful-old">
            <Pagination.Link href="#old-stateful-reuse">Old stateful reuse</Pagination.Link>
        </Pagination.Item>
    {/if}
    {#if showNewStatefulReuse}
        <Pagination.Item data-testid="new-stateful-reuse" id="stateful-new">
            <Pagination.Link href="#new-stateful-reuse">New stateful reuse</Pagination.Link>
        </Pagination.Item>
    {/if}
</Pagination.Root>

<script lang="ts">
    import CheckInput from '../form-check-input.svelte';
    import SwitchInput from '../form-switch-input.svelte';

    let {
        switchInput = false,
        initialGroup,
        withSibling = false
    }: { switchInput?: boolean; initialGroup?: unknown[] | null; withSibling?: boolean } = $props();
    // The fixture intentionally seeds the binding once, including an undefined value.
    // svelte-ignore state_referenced_locally
    let group = $state(initialGroup);
    let checked = $state(false);
</script>

<form>
    {#if switchInput}
        <SwitchInput bind:checked bind:group value="a" />
    {:else}
        <CheckInput bind:checked bind:group value="a" />
    {/if}
    {#if withSibling}
        {#if switchInput}
            <SwitchInput bind:group value="b" />
        {:else}
            <CheckInput bind:group value="b" />
        {/if}
    {/if}
</form>
<button type="button" data-testid="clear-undefined" onclick={() => (group = undefined)}>Use undefined</button>
<button type="button" data-testid="clear-null" onclick={() => (group = null)}>Use null</button>
<button type="button" data-testid="start-group" onclick={() => (group = [])}>Start a group</button>
<output data-testid="checked">{String(checked)}</output>
<output data-testid="group">{group === undefined ? 'undefined' : JSON.stringify(group)}</output>

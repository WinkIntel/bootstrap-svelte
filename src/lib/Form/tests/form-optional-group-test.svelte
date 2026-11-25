<script lang="ts">
    import CheckInput from '../form-check-input.svelte';
    import SwitchInput from '../form-switch-input.svelte';

    let { switchInput = false, initialGroup }: { switchInput?: boolean; initialGroup?: unknown[] | null } = $props();
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
</form>
<output data-testid="checked">{String(checked)}</output>
<output data-testid="group">{group === undefined ? 'undefined' : JSON.stringify(group)}</output>

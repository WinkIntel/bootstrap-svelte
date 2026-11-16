<script lang="ts">
    import CheckInput from '../form-check-input.svelte';
    import SwitchInput from '../form-switch-input.svelte';
    let { initial = [], switchInput = false }: { initial?: unknown[]; switchInput?: boolean } = $props();
    // The fixture intentionally seeds local state once.
    // svelte-ignore state_referenced_locally
    let group = $state(initial);
    let calls = $state(0);
</script>

<form>
    {#if switchInput}
        <SwitchInput bind:group value="a" name="choices" onchange={() => calls++} data-testid="group-input" />
    {:else}
        <CheckInput bind:group value="a" name="choices" onchange={() => calls++} data-testid="group-input" />
    {/if}
</form>
<output data-testid="group">{JSON.stringify(group)}</output>
<output data-testid="calls">{calls}</output>

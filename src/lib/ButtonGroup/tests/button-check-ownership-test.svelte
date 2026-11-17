<script lang="ts">
    import ButtonCheck from '../button-check.svelte';
    let {
        initialGroup,
        initialChecked = true,
        objectGroup = false
    }: { initialGroup?: string; initialChecked?: boolean; objectGroup?: boolean } = $props();
    const raw = { id: 'a' };
    let css = $state('initial');
    // The fixture intentionally seeds ownership once, matching the public component contract.
    // svelte-ignore state_referenced_locally
    let group = $state<unknown>(objectGroup ? raw : initialGroup);
    // svelte-ignore state_referenced_locally
    let checked = $state<boolean | undefined>(initialChecked);
</script>

<ButtonCheck type="radio" name="choices" class={css} value={objectGroup ? raw : 'a'} bind:group bind:checked>A</ButtonCheck>
<ButtonCheck type="radio" name="choices" value="b" bind:group>B</ButtonCheck>
<button onclick={() => (checked = undefined)}>Release checked</button>
<button onclick={() => (checked = true)}>Set checked</button>
<button onclick={() => (group = 'b')}>Select B</button>
<button onclick={() => (css = 'changed')}>Change class</button>
<output>{JSON.stringify(group)}:{checked === undefined ? 'undefined' : checked}</output>

<script lang="ts">
    import ButtonCheck from '../button-check.svelte';
    let { initial, initialChecked }: { initial?: string; initialChecked?: boolean } = $props();
    // The fixture intentionally seeds local state once.
    // svelte-ignore state_referenced_locally
    let group = $state(initial);
    // svelte-ignore state_referenced_locally
    let checked = $state(initialChecked);
    let calls = $state(0);
</script>

<ButtonCheck type="radio" name="choices" value="a" bind:group bind:checked onchange={() => calls++}>A</ButtonCheck>
<ButtonCheck type="radio" name="choices" value="b" bind:group onchange={() => calls++}>B</ButtonCheck>
<button onclick={() => (group = 'a')}>Select A</button>
<button onclick={() => (checked = true)}>Check A</button>
<output>{group ?? 'unset'}:{calls}:{checked ?? 'unset'}</output>

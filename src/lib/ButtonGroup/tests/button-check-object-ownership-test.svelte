<script lang="ts">
    import ButtonCheck from '../button-check.svelte';
    const first = { id: 'a' };
    const next = { id: 'c' };
    const sibling = { id: 'b' };
    let value = $state.raw(first);
    let group = $state<unknown>(undefined);
    let checked = $state(true);
    let calls = $state(0);
    let elementRef = $state<HTMLInputElement | null>(null);
</script>

<form>
    <ButtonCheck type="radio" name="choices" {value} bind:group bind:checked bind:elementRef onchange={() => calls++}>A</ButtonCheck>
    <ButtonCheck type="radio" name="choices" value={sibling} bind:group onchange={() => calls++}>B</ButtonCheck>
</form>
<button onclick={() => (elementRef = null)}>Clear public ref</button>
<button onclick={() => (elementRef = document.createElement('input'))}>Replace public ref</button>
<button onclick={() => (value = next)}>Change value</button>
<button onclick={() => (group = sibling)}>Parent B</button>
<button onclick={() => (group = { id: 'a' })}>Distinct object</button>
<button onclick={() => (group = first)}>Original object</button>
<button onclick={() => (checked = false)}>Uncheck A</button>
<button onclick={() => (group = null)}>Clear group</button>
<button
    onclick={() => {
        value = next;
        group = sibling;
    }}>Parent B and value</button>
<output>{group === undefined ? 'undefined' : JSON.stringify(group)}:{checked}:{calls}</output>

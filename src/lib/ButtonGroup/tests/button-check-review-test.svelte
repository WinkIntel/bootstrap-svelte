<script lang="ts">
    import ButtonCheck from '../button-check.svelte';
    let {
        initialGroup,
        initialChecked = true,
        secondChecked,
        defaultA,
        defaultB,
        cancel = false
    }: {
        initialGroup?: string | null;
        initialChecked?: boolean;
        secondChecked?: boolean;
        defaultA?: boolean;
        defaultB?: boolean;
        cancel?: boolean;
    } = $props();
    // svelte-ignore state_referenced_locally
    let group = $state(initialGroup);
    // svelte-ignore state_referenced_locally
    let checked = $state(initialChecked);
    // svelte-ignore state_referenced_locally
    let checkedB = $state(secondChecked);
    let choice = $state('a');
    let calls = $state(0);
</script>

<form
    onreset={(event) => {
        if (cancel) event.preventDefault();
    }}>
    <ButtonCheck type="radio" name="choices" value={choice} defaultChecked={defaultA} bind:checked bind:group onchange={() => calls++}>A</ButtonCheck>
    <ButtonCheck type="radio" name="choices" value="b" defaultChecked={defaultB} bind:checked={checkedB} bind:group onchange={() => calls++}
        >B</ButtonCheck>
    <button type="reset">Reset</button>
</form>
<button onclick={() => (choice = 'c')}>Change value</button>
<button onclick={() => (choice = 'b')}>Value B</button>
<button onclick={() => (group = 'b')}>Parent B</button>
<button
    onclick={() => {
        choice = 'c';
        group = 'b';
    }}>Parent B and value</button>
<button onclick={() => (group = null)}>Clear group</button>
<output>{group === undefined ? 'undefined' : JSON.stringify(group)}:{checked}:{calls}</output>

<output data-testid="second-checked">{checkedB ?? 'undefined'}</output>

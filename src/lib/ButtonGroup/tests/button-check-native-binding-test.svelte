<script lang="ts">
    import ButtonCheck from '../button-check.svelte';
    let checked = $state(true);
</script>

<form>
    <ButtonCheck type="radio" name="component" value="a" bind:checked>A</ButtonCheck>
    <input type="radio" name="component" value="b" />
</form>
<button
    onclick={() => {
        checked = true;
    }}>Reselect A</button>
<output>{checked}</output>

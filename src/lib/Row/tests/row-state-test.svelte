<script lang="ts">
    import Row from '../row.svelte';

    let useXs = $state(false);
</script>

<button data-testid="toggle-row-cols" onclick={() => (useXs = !useXs)}>Toggle row cols</button>
<Row data-testid="responsive-row" cols={useXs ? { xs: 3 } : { sm: 2 }} />

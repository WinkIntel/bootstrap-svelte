<script lang="ts">
    import Col from '../col.svelte';

    let useXs = $state(false);
</script>

<button data-testid="toggle-xs" onclick={() => (useXs = !useXs)}>Toggle xs</button>
<Col
    data-testid="responsive-col"
    sizing={useXs ? { xs: '*' } : { sm: 6 }}
    offset={useXs ? { xs: 2 } : { sm: 3 }}
    order={useXs ? { xs: 'first' } : { sm: 'last' }} />

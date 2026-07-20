<script lang="ts">
    import Collapse from '../collapse.svelte';

    let isExpanded = $state(false);
</script>

<button data-testid="toggle-collapse" onclick={() => (isExpanded = !isExpanded)}>Toggle</button>

<Collapse
    {isExpanded}
    transitionDuration={100}
    data-testid="reversing-collapse"
    style="transition-duration: 2s !important; transition-delay: 40ms !important;">
    Reversing collapse
</Collapse>

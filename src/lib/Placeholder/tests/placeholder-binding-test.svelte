<script lang="ts">
    import { Placeholder } from '$lib/index.js';

    let rootRef = $state<HTMLDivElement | null>(null);
    let itemRef = $state<HTMLSpanElement | null>(null);
</script>

<Placeholder.Root bind:elementRef={rootRef} data-testid="placeholder-root-ref">
    <Placeholder.Item bind:elementRef={itemRef} data-testid="placeholder-item-ref" />
</Placeholder.Root>
<output data-testid="placeholder-binding-state">{rootRef?.dataset.testid}:{itemRef?.dataset.testid}</output>

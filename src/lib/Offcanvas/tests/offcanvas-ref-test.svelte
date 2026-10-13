<script lang="ts">
    import { Offcanvas } from '$lib/index.js';

    let {
        isShown = true,
        renderPanel = true,
        onReference
    }: { isShown?: boolean; renderPanel?: boolean; onReference: (element: HTMLDivElement | null) => void } = $props();
    let elementRef: HTMLDivElement | null = $state(null);
    $effect(() => onReference(elementRef));
</script>

{#if renderPanel}
    <Offcanvas.Root bind:elementRef {isShown} id="bound-panel" data-testid="bound-panel">
        <Offcanvas.Body>Bound panel</Offcanvas.Body>
    </Offcanvas.Root>
{/if}

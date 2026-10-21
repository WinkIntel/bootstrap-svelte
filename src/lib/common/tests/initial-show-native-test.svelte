<script lang="ts">
    import { fade } from 'svelte/transition';
    import { initialShow } from '../initial-show.js';
    let {
        onShow,
        onShown,
        onDirection
    }: { onShow: (event: Event) => void; onShown: (event: Event) => void; onDirection?: (direction: string | undefined) => void } = $props();
    let element: HTMLDivElement | null = $state(null);
    const showTransition = initialShow(
        () => true,
        () => element,
        (target, params: Parameters<typeof fade>[1], options?: { direction: string }) => {
            onDirection?.(options?.direction);
            return fade(target, params);
        }
    );
</script>

<div bind:this={element} transition:showTransition|global={{ duration: 100 }} onintrostart={onShow} onintroend={onShown}>Native intro</div>

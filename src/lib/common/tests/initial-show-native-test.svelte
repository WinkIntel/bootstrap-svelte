<script lang="ts">
    import { fade } from 'svelte/transition';
    import { initialShow } from '../initial-show.js';
    let { onShow, onShown }: { onShow: (event: Event) => void; onShown: (event: Event) => void } = $props();
    let element: HTMLDivElement | null = $state(null);
    const showTransition = initialShow(
        () => true,
        () => element,
        fade
    );
</script>

<div bind:this={element} transition:showTransition|global={{ duration: 100 }} onintrostart={onShow} onintroend={onShown}>Native intro</div>

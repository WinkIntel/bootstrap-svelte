<script lang="ts">
    import { fade } from 'svelte/transition';
    import { initialShow } from '../initial-show.js';
    let { onShow, onShown }: { onShow: (event: Event) => void; onShown: (event: Event) => void } = $props();
    let element: HTMLDivElement | null = $state(null);
    const lifecycle = initialShow(
        () => true,
        () => element,
        (event) => onShow(event),
        (event) => onShown(event),
        fade
    );
    const showTransition = lifecycle.transition;
</script>

<div bind:this={element} transition:showTransition|global={{ duration: 100 }} onintrostart={lifecycle.start} onintroend={lifecycle.end}>
    Native intro
</div>

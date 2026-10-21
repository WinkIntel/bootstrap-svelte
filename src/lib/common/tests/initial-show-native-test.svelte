<script lang="ts">
    import { fade } from 'svelte/transition';
    import { initialShow } from '../initial-show.js';
    let {
        onShow,
        onShown,
        onDirection,
        deferred = false,
        onResolve
    }: {
        onShow: (event: Event) => void;
        onShown: (event: Event) => void;
        onDirection?: (direction: 'in' | 'out' | 'both') => void;
        deferred?: boolean;
        onResolve?: () => void;
    } = $props();
    let element: HTMLDivElement | null = $state(null);
    const showTransition = initialShow(
        () => true,
        () => element,
        (target, params: Parameters<typeof fade>[1], options) => {
            onDirection?.(options.direction);
            if (deferred)
                return () => {
                    onResolve?.();
                    return fade(target, params);
                };
            return fade(target, params);
        }
    );
</script>

<div bind:this={element} transition:showTransition|global={{ duration: 100 }} onintrostart={onShow} onintroend={onShown}>Native intro</div>

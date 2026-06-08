<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Card } from './index.js';

    // Generate a unique ID for the card element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `card-subtitle-${uid}`,
        level = 6,
        ...restOfProps
    }: Card.SubtitleProps = $props();

    let elementType: string = $derived(`h${level}`);

    let classes: string = $derived(uniqueClsx('card-subtitle', classValues));
</script>

<svelte:element this={elementType} bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</svelte:element>

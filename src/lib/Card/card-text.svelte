<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Card } from './index.js';

    // Generate a unique ID for the card element, in case one is not provided...
    const uid: string = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `card-text-${uid}`, ...restOfProps }: Card.TextProps = $props();

    let classes: string = $derived(uniqueClsx('card-text', classValues));
</script>

<p bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</p>

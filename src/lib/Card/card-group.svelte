<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Card } from './index.js';

    // Generate a unique ID for the card element, in case one is not provided...
    const uid: string = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `card-group-${uid}`, ...restOfProps }: Card.BodyProps = $props();

    let classes: string = $derived(uniqueClsx('card-group', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

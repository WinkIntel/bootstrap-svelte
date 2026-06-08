<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Card } from './index.js';

    // Generate a unique ID for the card element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        href = '#!',
        id = `card-link-${uid}`,
        ...restOfProps
    }: Card.LinkProps = $props();

    let classes: string = $derived(uniqueClsx('card-link', classValues));
</script>

<a bind:this={elementRef} class={classes} {href} {id} {...restOfProps}>
    {@render children?.()}
</a>

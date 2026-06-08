<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Popover } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `popover-header-${uid}`,
        level = 3,
        ...restOfProps
    }: Popover.HeaderProps = $props();

    let elementType: string = $derived(`h${level}`);

    let classes: string = $derived(uniqueClsx('popover-header', classValues));
</script>

<svelte:element this={elementType} bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</svelte:element>

<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Tooltip } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid: string = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `tooltip-inner-${uid}`, ...restOfProps }: Tooltip.InnerProps = $props();

    let classes: string = $derived(uniqueClsx('tooltip-inner', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

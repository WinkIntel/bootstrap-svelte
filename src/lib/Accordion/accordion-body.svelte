<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Accordion } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: Accordion.BodyProps = $props();

    let classes: string = $derived(uniqueClsx('accordion-body', classValues));
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>

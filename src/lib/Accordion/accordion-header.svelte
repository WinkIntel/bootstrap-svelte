<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Accordion } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: Accordion.HeaderProps = $props();

    let classes: string = $derived(uniqueClsx('accordion-header', classValues));
</script>

<h2 bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</h2>

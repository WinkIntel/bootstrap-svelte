<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { Collapse } from '$lib/index.js';
    import { AccordionCollapseState, initAccordionCollapseState } from './accordion.svelte.js';
    import type { Accordion } from './index.js';

    // Generate a unique ID for the collapse element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `accordion-collapse-${uid}`,
        ...restOfProps
    }: Accordion.CollapseProps = $props();

    const collapseState: AccordionCollapseState = initAccordionCollapseState({
        get id() {
            return id;
        }
    });

    let isExpanded = $derived(collapseState.isExpanded);
    let classes: string = $derived(uniqueClsx('accordion-collapse', classValues));
</script>

<Collapse bind:elementRef class={classes} {id} {isExpanded} {...restOfProps}>
    {@render children?.()}
</Collapse>

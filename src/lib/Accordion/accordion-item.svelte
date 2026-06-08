<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { AccordionItemState, initAccordionItemState } from './accordion.svelte.js';
    import type { Accordion } from './index.js';

    // Generate a unique ID for the collapse element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `accordion-item-${uid}`,
        isExpanded = false,
        ...restOfProps
    }: Accordion.ItemProps = $props();

    let classes: string = $derived(uniqueClsx('accordion-item', classValues));
    let previousIsExpanded: boolean | undefined;

    const itemState: AccordionItemState = initAccordionItemState({
        get id() {
            return id;
        },
        get isExpanded() {
            return isExpanded;
        }
    });

    $effect(() => {
        // Update the state when the isExpanded prop changes...
        if (id && previousIsExpanded !== undefined && previousIsExpanded !== isExpanded) {
            const isItemIncluded = itemState.root.isItemExpanded(id);

            if (isExpanded && !isItemIncluded) {
                itemState.root.toggleItem(id);
            } else if (!isExpanded && isItemIncluded) {
                itemState.root.toggleItem(id);
            }
        }

        previousIsExpanded = isExpanded;
    });
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { initAccordionButtonState } from './accordion.svelte.js';
    import type { Accordion } from './index.js';

    // type is intentionally excluded from rest props since we want to default it to "button" and not allow it to be overridden.
    let { children, class: classValues, elementRef = $bindable(null), type: _type, ...restOfProps }: Accordion.ButtonProps = $props();

    const buttonState = initAccordionButtonState({});

    let ariaControls = $derived(buttonState.item.ariaControls);
    let isExpanded = $derived(buttonState.isExpanded);
    let classes: string = $derived(uniqueClsx('accordion-button', classValues));

    const handleClick: EventListener = (_event: Event) => {
        buttonState.onclick();
    };
</script>

<!-- Not using the <Button/> component because we don't want the `btn` class. -->
<button
    aria-controls={ariaControls}
    aria-expanded={isExpanded}
    bind:this={elementRef}
    class={classes}
    class:collapsed={!isExpanded}
    onclick={handleClick}
    type="button"
    {...restOfProps}>
    {@render children?.()}
</button>

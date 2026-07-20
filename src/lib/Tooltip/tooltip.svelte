<!--
@component
## Tooltip
Add small overlay content to any element for housing secondary information or interactive controls.

@example
```svelte
<Button id="tooltip-button">Click for Tooltip</Button>
<Tooltip.Root isShown={true} referenceElementId="tooltip-button">
    <Tooltip.Header>Tooltip Title</Tooltip.Header>
    <Tooltip.Body>
        <p>This is the tooltip content.</p>
    </Tooltip.Body>
</Tooltip.Root>
```

#### Different Triggers
```svelte
<Tooltip.Root trigger="click" referenceElementId="click-button">...</Tooltip.Root>
<Tooltip.Root trigger="hover" referenceElementId="hover-button">...</Tooltip.Root>
<Tooltip.Root trigger="focus" referenceElementId="focus-button">...</Tooltip.Root>
```
#### Placement Options
```svelte
<Tooltip.Root placement="top" referenceElementId="top-button">...</Tooltip.Root>
<Tooltip.Root placement="right" referenceElementId="right-button">...</Tooltip.Root>
<Tooltip.Root placement="bottom" referenceElementId="bottom-button">...</Tooltip.Root>
<Tooltip.Root placement="left" referenceElementId="left-button">...</Tooltip.Root>
```
#### Custom Container
```svelte
<div id="custom-container"></div>
<Tooltip.Root container="#custom-container" referenceElementId="container-button">...</Tooltip.Root>
```
### Props
- `children` (slot): Content to display inside the tooltip.
- `class` (string): Optional. Additional CSS classes.
- `container` (string | HTMLElement | false): Optional. Specifies the container where the tooltip should be appended. Default is 'body'.
- `elementRef` (HTMLElement): Optional. Reference to the tooltip DOM element.
- `id` (string): Optional. ID for the tooltip element.
- `isShown` (boolean): Optional. Controls whether the tooltip is visible.
- `onHide` (function): Optional. Callback to invoke when the tooltip starts hiding.
- `onHidden` (function): Optional. Callback to invoke when the tooltip has been hidden.
- `onShow` (function): Optional. Callback to invoke when the tooltip starts showing.
- `onShown` (function): Optional. Callback to invoke when the tooltip has been shown.
- `placement` (string): Optional. Position of the tooltip relative to the trigger element. Options: 'top', 'right', 'bottom', 'left', 'auto'. Default is 'right'.
- `referenceElementId` (string): Required. ID of the element that triggers the tooltip. It accommodates the id containing a hash or not.
- `trigger` (string): Optional. Event type that triggers the tooltip. Options: 'click', 'hover', 'focus', or space-separated combinations. Default is 'click'.
- `type` (string): Optional. Type of the tooltip. Default is 'tooltip'. Can be 'tooltip' or 'popover'.
- `useFade` (boolean): Optional. Controls whether the tooltip uses a fade transition. Default is true.
-->
<script lang="ts">
    import { hasFocus, noop, uniqueClsx } from '$lib/common/index.js';
    import { Portal } from '$lib/index.js';
    import { createPopper, type Instance } from '@popperjs/core';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import type { Tooltip } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        container = false,
        elementRef = $bindable(null),
        id,
        isShown = false,
        onHide = noop,
        onHidden = noop,
        onShow = noop,
        onShown = noop,
        placement,
        referenceElementId,
        trigger,
        type = 'tooltip',
        useFade = true,
        ...restOfProps
    }: Tooltip.RootProps = $props();

    // Set defaults based on type
    let effectiveId: string = $derived(id || `${type}-${uid}`);
    let effectivePlacement: Tooltip.RootProps['placement'] = $derived(placement || (type === 'tooltip' ? 'top' : 'right'));
    let effectiveTrigger: string = $derived(trigger || (type === 'tooltip' ? 'hover focus' : 'click'));
    const unset = Symbol('unset');
    let previousTrigger: string | typeof unset = unset;

    let popperInstance: Instance | null = null;
    let popperPlacement: string = $state('');
    let referenceElement: HTMLElement | null = $state(null);
    let isHovering = $state(false);
    let isFocusing = $state(false);
    let currentPopperPlacement: string = $derived(popperPlacement || effectivePlacement || 'top');
    let triggers: string[] = $derived.by(() => effectiveTrigger.split(' ')); // support space-delimited list of triggers

    let classes: string = $derived(
        uniqueClsx(
            type,
            {
                [`bs-${type}-auto`]: currentPopperPlacement === 'auto',
                [`bs-${type}-start`]: currentPopperPlacement === 'left',
                [`bs-${type}-end`]: currentPopperPlacement === 'right',
                [`bs-${type}-top`]: currentPopperPlacement === 'top',
                [`bs-${type}-bottom`]: currentPopperPlacement === 'bottom',
                fade: useFade,
                show: isShown
            },
            classValues
        )
    );

    // Operations...

    const show = () => (isShown = true);
    const hide = () => (isShown = false);
    const hideWhenInactive = () => {
        if (!isHovering && !isFocusing) {
            hide();
        }
    };
    const toggle = () => {
        if (triggers.includes('focus') && hasFocus(referenceElement)) {
            // If the reference element is focused, we don't want to toggle the tooltip
            return;
        }
        isShown = !isShown;
    };
    const handleMouseEnter = () => {
        isHovering = true;
        show();
    };
    const handleMouseLeave = () => {
        isHovering = false;
        hideWhenInactive();
    };
    const handleFocusIn = () => {
        isFocusing = true;
        show();
    };
    const handleFocusOut = () => {
        isFocusing = false;
        hideWhenInactive();
    };

    const addEventListeners = () => {
        if (!referenceElement) {
            return;
        }
        if (triggers.length === 0) {
            return;
        }
        if (triggers.includes('click')) {
            referenceElement.addEventListener('click', toggle);
        }
        if (triggers.includes('hover')) {
            referenceElement.addEventListener('mouseenter', handleMouseEnter);
            referenceElement.addEventListener('mouseleave', handleMouseLeave);
        }
        if (triggers.includes('focus')) {
            referenceElement.addEventListener('focusin', handleFocusIn);
            referenceElement.addEventListener('focusout', handleFocusOut);
        }
    };

    const destroyPopper = () => {
        if (!popperInstance) {
            return;
        }
        popperInstance.destroy();
        popperInstance = null;
    };

    const removeEventListeners = () => {
        if (!referenceElement) {
            return;
        }
        referenceElement.removeEventListener('click', toggle);
        referenceElement.removeEventListener('mouseenter', handleMouseEnter);
        referenceElement.removeEventListener('mouseleave', handleMouseLeave);
        referenceElement.removeEventListener('focusin', handleFocusIn);
        referenceElement.removeEventListener('focusout', handleFocusOut);
    };

    const reconcileTriggerActivity = () => {
        isHovering = triggers.includes('hover') && !!referenceElement?.matches(':hover');
        if (triggers.includes('focus')) {
            isFocusing = hasFocus(referenceElement);
        } else {
            isFocusing = false;
        }
        if (isHovering || isFocusing) {
            show();
        } else {
            hide();
        }
    };

    // Event listeners...

    const handleOnHidden: EventListener = (event: Event) => {
        destroyPopper();
        onHidden(event);
    };

    onMount(() => {
        if (typeof window === 'undefined') {
            return;
        }
        if (!referenceElementId) {
            console.warn(`${type.charAt(0).toUpperCase() + type.slice(1)}: Missing referenceElementId. Unable to find the reference element.`);
            return;
        }
        // accommodate the id containing a hash or not...
        const elementId = referenceElementId.startsWith('#') ? referenceElementId.substring(1) : referenceElementId;
        referenceElement = document.getElementById(elementId);
        addEventListeners();

        return () => {
            destroyPopper();
            removeEventListeners();
        };
    });

    // Listen changes to the `trigger` prop and update the state accordingly...
    $effect(() => {
        if (previousTrigger !== unset && previousTrigger !== effectiveTrigger) {
            removeEventListeners();
            reconcileTriggerActivity();
            addEventListeners();
        }

        previousTrigger = effectiveTrigger;
    });

    // Listen changes to the `isShown` prop and update the state accordingly...
    $effect(() => {
        if (!isShown || !elementRef || !referenceElement) {
            return;
        }
        destroyPopper();
        popperInstance = createPopper(referenceElement, elementRef, {
            placement: effectivePlacement,
            modifiers: [
                {
                    name: 'placementUpdated',
                    enabled: true,
                    phase: 'main',
                    fn({ state }) {
                        // Only support the placement of auto, top, right, bottom, left...
                        if (
                            (state.placement === 'auto' && popperPlacement !== 'auto') ||
                            (state.placement === 'top' && popperPlacement !== 'top') ||
                            (state.placement === 'left' && popperPlacement !== 'left') ||
                            (state.placement === 'right' && popperPlacement !== 'right') ||
                            (state.placement === 'bottom' && popperPlacement !== 'bottom')
                        ) {
                            popperPlacement = state.placement;
                        }
                    }
                },
                {
                    name: 'offset',
                    options: {
                        offset: () => {
                            // Different offset for tooltip vs popover
                            return [0, type === 'tooltip' ? 6 : 8];
                        }
                    }
                }
            ]
        });
    });
    let containerElement = $derived(container === false ? 'body' : container);
</script>

<Portal target={containerElement} disabled={container === false}>
    {#if isShown}
        <div
            bind:this={elementRef}
            class={classes}
            data-popper-placement={currentPopperPlacement}
            id={effectiveId}
            onintrostart={onShow}
            onintroend={onShown}
            onoutrostart={onHide}
            onoutroend={handleOnHidden}
            role="tooltip"
            transition:fade={{ duration: useFade ? 150 : 0 }}
            {...restOfProps}>
            <div class={`${type}-arrow`} data-popper-arrow></div>
            {@render children?.()}
        </div>
    {/if}
</Portal>

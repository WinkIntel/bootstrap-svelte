<!--
@component
## Carousel.Item
Represents a slide in the carousel. Should be placed inside a Carousel.Inner.

@example
```svelte
<Carousel.Item isActive={true}>
    <img src="..." class="d-block w-100" alt="...">
    <Carousel.Caption>
        <h5>First slide label</h5>
        <p>Some representative placeholder content for the first slide.</p>
    </Carousel.Caption>
</Carousel.Item>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the component.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element.
- `id` (string): Optional. Unique identifier for the component.
- `isActive` (boolean): Optional. Indicates if the item is active. Default is `false`.
- `interval` (number): Optional. Time in milliseconds before the item is shown. Default is `5000`.
- `onSlide` (function): Optional. Callback function triggered when the item is shown.
- `onSlid` (function): Optional. Callback function triggered after the item is shown.
- `style` (string): Optional. Inline styles to apply to the component.
-->
<script lang="ts">
    import { easeInOut, uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import { linear } from 'svelte/easing';
    import { onDestroy, onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { CarouselItemState, initCarouselItemState } from './carousel.svelte.js';
    import type { Carousel } from './index.js';

    // Generate a unique ID for the carousel-item element, in case one is not provided
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `carousel-item-${uid}`,
        isActive = false,
        interval,
        onmouseenter: onMouseEnter,
        onmouseleave: onMouseLeave,
        onSlide = noop,
        onSlid = noop,
        style,
        ...restOfProps
    }: Carousel.ItemProps = $props();
    let orderElementRef: HTMLSpanElement | null = $state(null);

    // Get the item state after the component is mounted
    const itemState: CarouselItemState = initCarouselItemState({
        get id() {
            return id;
        },
        get elementRef() {
            return elementRef;
        },
        get isActive() {
            return isActive;
        },
        get interval() {
            return interval;
        },
        get orderElementRef() {
            return orderElementRef;
        }
    });

    onMount(() => itemState.root.scheduleRegistrationOrder());
    onDestroy(() => itemState.root.unregisterItem(itemState));

    function handleMouseEnter(event: MouseEvent) {
        itemState.root.handleMouseEnter();
        onMouseEnter?.(event as never);
    }

    function handleMouseLeave(event: MouseEvent) {
        itemState.root.handleMouseLeave();
        onMouseLeave?.(event as never);
    }

    let flyX: string | undefined = $derived.by(() => {
        if (itemState.isNext) {
            return '100%';
        }
        if (itemState.isPrev) {
            return '-100%';
        }
        return undefined;
    });

    let classes: string = $derived(
        uniqueClsx(
            'carousel-item',
            {
                active: itemState.isActive, // Displays the item.
                'carousel-item-next': itemState.isNext, // Displays the item.
                'carousel-item-prev': itemState.isPrev, // Displays the item.
                'carousel-item-end': itemState.isEnd, // Applies the translateX(-100%) transform.
                'carousel-item-start': itemState.isStart // Applies the translateX(100%) transform.
            },
            classValues
        )
    );
    let styles: string = $derived(
        `transition: transform ${itemState.root.transitionDuration / 1000}s ease-in-out !important;` + (style ? style : '')
    );
</script>

<span aria-hidden="true" bind:this={orderElementRef} hidden></span>

<!--
    The slide and crossfade branches use in: (never transition:) — their exit visuals are
    driven by the carousel-item-start/-end CSS classes during the transition window, and
    Svelte freezes class bindings inside an outroing block, so an outro would hold the
    outgoing item in the DOM with a stale 'active' class after the commit.
-->
{#if itemState.doSlideItem}
    <div
        bind:this={elementRef}
        class={classes}
        {id}
        onintrostart={onSlide}
        onintroend={onSlid}
        style={styles}
        in:fly={{
            duration: itemState.root.transitionDuration,
            x: flyX,
            y: undefined,
            opacity: 1,
            easing: easeInOut
        }}
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
        {...restOfProps}>
        {@render children?.()}
    </div>
{/if}
{#if itemState.doFadeItem}
    <div
        bind:this={elementRef}
        class={classes}
        {id}
        onintrostart={onSlide}
        onintroend={onSlid}
        style={styles}
        transition:fade={{
            delay: itemState.order ? itemState.root.transitionDuration / 2 : 0,
            duration: itemState.root.transitionDuration / 2,
            easing: linear
        }}
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
        {...restOfProps}>
        {@render children?.()}
    </div>
{/if}
{#if itemState.doCrossfadeItem}
    <div
        bind:this={elementRef}
        class={classes}
        {id}
        onintrostart={onSlide}
        onintroend={onSlid}
        in:fly={{
            duration: itemState.root.transitionDuration,
            x: '0%',
            y: undefined,
            opacity: 0,
            easing: easeInOut
        }}
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
        {...restOfProps}>
        {@render children?.()}
    </div>
{/if}
{#if itemState.doShowImmediatelyItem}
    <div
        bind:this={elementRef}
        class={classes}
        {id}
        onintrostart={onSlide}
        onintroend={onSlid}
        transition:fade={{ duration: 0 }}
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
        {...restOfProps}>
        {@render children?.()}
    </div>
{/if}

<!--
@component
## Carousel.Indicators
Container for indicator buttons. Place inside Carousel.Root; buttons correspond to slides in DOM order.

@example
```svelte
<Carousel.Root id="myCarousel">
    <Carousel.Indicators>
        <Carousel.IndicatorButton />
        <Carousel.IndicatorButton />
        <Carousel.IndicatorButton />
    </Carousel.Indicators>
    <Carousel.Inner>
        Slides...
    </Carousel.Inner>
</Carousel.Root>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the component.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element.
- `id` (string): Optional. Unique identifier for the component.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Carousel } from './index.js';

    // Generate a unique ID for the carousel-indicators element, in case one is not provided
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `carousel-indicators-${uid}`,
        ...restOfProps
    }: Carousel.IndicatorsProps = $props();

    let classes: string = $derived(uniqueClsx('carousel-indicators', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

<!--
@component
## Carousel.Indicators
Container for indicator buttons. Should be placed inside a Carousel.Root component.

@example
```svelte
<Carousel.Root id="myCarousel">
    <Carousel.Indicators>
        <Carousel.IndicatorButton slideTo={0} ariaLabel="Slide 1" />
        <Carousel.IndicatorButton slideTo={1} ariaLabel="Slide 2" />
        <Carousel.IndicatorButton slideTo={2} ariaLabel="Slide 3" />
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

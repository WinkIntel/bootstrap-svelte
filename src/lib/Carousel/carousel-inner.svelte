<!--
@component
## Carousel.Inner
Container for carousel items. This component should be placed inside a Carousel.Root.

@example
```svelte
<Carousel.Root id="myCarousel">
    <Carousel.Inner>
        <Carousel.Item isActive={true}>
            Slides...
        </Carousel.Item>
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

    // Generate a unique ID for the carousel-inner element, in case one is not provided
    const uid: string = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `carousel-inner-${uid}`, ...restOfProps }: Carousel.InnerProps = $props();

    let classes: string = $derived(uniqueClsx('carousel-inner', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

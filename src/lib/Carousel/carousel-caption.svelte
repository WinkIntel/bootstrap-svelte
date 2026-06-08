<!--
@component
## Carousel.Caption
Adds captions to carousel slides. Should be placed inside a Carousel.Item.

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
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Carousel } from './index.js';

    // Generate a unique ID for the carousel-caption element, in case one is not provided
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `carousel-caption-${uid}`,
        ...restOfProps
    }: Carousel.CaptionProps = $props();

    let classes: string = $derived(uniqueClsx('carousel-caption', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

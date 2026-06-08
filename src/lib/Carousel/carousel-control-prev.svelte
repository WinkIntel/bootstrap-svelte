<!--
@component
## Carousel.ControlPrev
Previous slide control button. Should be placed inside a Carousel.Root.

@example
```svelte
<Carousel.Root id="myCarousel">
    <Carousel.Inner>
        Slides...
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the component.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { CarouselControlPrevState, initCarouselControlPrevState } from './carousel.svelte.js';
    import type { Carousel } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: Carousel.ControlProps = $props();

    // Initialize control state (false means previous control)
    const controlState: CarouselControlPrevState = initCarouselControlPrevState({});

    let classes: string = $derived(uniqueClsx('carousel-control-prev', classValues));

    const handleClick: EventListener = (event: Event) => {
        controlState.onclick(event);
    };
</script>

<button bind:this={elementRef} class={classes} onclick={handleClick} type="button" {...restOfProps}>
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
    {@render children?.()}
</button>

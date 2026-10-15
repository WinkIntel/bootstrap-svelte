<!--
@component
## Carousel.IndicatorButton
Button for carousel indicators. Should be placed inside a Carousel.Indicators component.

@example
```svelte
<Carousel.Indicators>
    <Carousel.IndicatorButton />
    <Carousel.IndicatorButton />
    <Carousel.IndicatorButton />
</Carousel.Indicators>
```
### Props
- `ariaLabel` (string): Optional. Screen reader text; defaults to "Slide N", where N is the one-based slide position.
- `class` (string): Optional. Additional CSS classes to apply to the component.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { onDestroy, onMount } from 'svelte';
    import { CarouselIndicatorButtonState, initCarouselIndicatorButtonState } from './carousel.svelte.js';
    import type { Carousel } from './index.js';

    let { ariaLabel, class: classValues, elementRef = $bindable(null), ...restOfProps }: Carousel.IndicatorButtonProps = $props();

    // Initialize indicator button state
    const indicatorState: CarouselIndicatorButtonState = initCarouselIndicatorButtonState({
        get elementRef() {
            return elementRef;
        }
    });
    onMount(() => indicatorState.root.scheduleRegistrationOrder());
    onDestroy(() => indicatorState.root.unregisterIndicator(indicatorState));

    let classes: string = $derived(
        uniqueClsx(
            {
                active: indicatorState.isActive || indicatorState.isNextActive
            },
            classValues
        )
    );

    let effectiveAriaLabel: string = $derived(ariaLabel || `Slide ${indicatorState.index + 1}`);

    const handleClick: EventListener = (event: Event) => {
        indicatorState.onclick(event);
    };
</script>

<button
    aria-label={effectiveAriaLabel}
    bind:this={elementRef}
    class={classes}
    data-bs-target="true"
    type="button"
    aria-current={indicatorState.isActive ? 'true' : 'false'}
    onclick={handleClick}
    {...restOfProps}></button>

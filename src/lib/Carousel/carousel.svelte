<!--
@component
## Carousel.Root
The main container for a carousel component.

@example
```svelte
<Carousel.Root animation={true} interval={5000} ride="carousel">
    <Carousel.Indicators>
        <Carousel.IndicatorButton ariaLabel="Slide 1" />
        <Carousel.IndicatorButton ariaLabel="Slide 2" />
        <Carousel.IndicatorButton ariaLabel="Slide 3" />
    </Carousel.Indicators>
    <Carousel.Inner>
        <Carousel.Item isActive={true}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1">
            <Carousel.Caption>
            <h5>First slide label</h5>
            <p>Some representative placeholder content for the first slide.</p>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2">
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3">
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>
```
### Props
- `animation` (boolean): Optional. Enables slide animation. Default is `true`.
- `class` (string): Optional. Additional CSS classes to apply to the carousel.
- `elementRef` (HTMLElement): Optional. Reference to the carousel DOM element.
- `id` (string): Optional. Unique ID for the carousel element.
- `interval` (number): Optional. The amount of time in milliseconds to delay between automatically cycling to the next item. Default is `5000`.
- `pause` (boolean | 'hover'): Optional. Sets the pause behavior. `true` pauses on hover, 'hover' pauses on hover, and `false` disables pausing. Default is `false`.
- `ride` (boolean | 'carousel'): Optional. Sets the autoplay behavior. `true` starts after first interaction, 'carousel' auto-plays on load. Default is `false`.
- `style` (string): Optional. Additional inline styles to apply to the carousel.
- `transitionDuration` (number): Optional. The duration of the transition effect in milliseconds. Default is `600`.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { onMount } from 'svelte';
    import { CarouselRootState, initCarouselRootState } from './carousel.svelte.js';
    import type { Carousel } from './index.js';

    // Generate a unique ID for the carousel element, in case one is not provided
    const uid: string = $props.id();

    let {
        animation = CarouselRootState.ANIMATION_DEFAULT,
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `carousel-${uid}`,
        interval = CarouselRootState.INTERNAL_DEFAULT,
        pause = CarouselRootState.PAUSE_DEFAULT,
        ride = CarouselRootState.RIDE_DEFAULT,
        style,
        transitionDuration = CarouselRootState.TRANSITION_DURATION_DEFAULT,
        ...restOfProps
    }: Carousel.RootProps = $props();

    // Initialize the carousel state
    const rootState: CarouselRootState = initCarouselRootState({
        get animation() {
            return animation;
        },
        get interval() {
            return interval;
        },
        get pause() {
            return pause;
        },
        get ride() {
            return ride;
        },
        get transitionDuration() {
            return transitionDuration;
        }
    });

    let classes: string = $derived(
        uniqueClsx(
            'carousel',
            {
                slide: rootState.isSlideAnimation || rootState.isCrossfadeAnimation,
                'carousel-fade': rootState.isFadeAnimation || rootState.isCrossfadeAnimation
            },
            classValues
        )
    );
    let styles: string = $derived('touch-action: pan-y;' + (style ? style : ''));
    const unset = Symbol('unset');

    // Handle touch events for swipe gestures
    function handlePointerDown(pointerEvent: PointerEvent) {
        rootState.handlePointerDown(pointerEvent);
    }

    function handlePointerMove(pointerEvent: PointerEvent) {
        rootState.handlePointerMove(pointerEvent);
    }

    function handlePointerUp(pointerEvent: PointerEvent) {
        rootState.handlePointerUp(pointerEvent);
    }

    onMount(() => {
        // Cleanup when component is destroyed
        return () => {
            rootState.dispose();
        };
    });

    // Track the previously synchronized prop values so rootState side effects
    // only run for genuine external prop transitions.
    let previousAnimation: Carousel.RootProps['animation'] | typeof unset = unset;
    let previousInterval: Carousel.RootProps['interval'] | typeof unset = unset;
    let previousPause: Carousel.RootProps['pause'] | typeof unset = unset;
    let previousRide: Carousel.RootProps['ride'] | typeof unset = unset;
    let previousTransitionDuration: Carousel.RootProps['transitionDuration'] | typeof unset = unset;

    $effect(() => {
        if (previousAnimation !== unset && previousAnimation !== animation) {
            rootState.animation = animation || CarouselRootState.ANIMATION_DEFAULT;
        }

        previousAnimation = animation;
    });

    $effect(() => {
        if (previousInterval !== unset && previousInterval !== interval) {
            rootState.interval = interval || CarouselRootState.INTERNAL_DEFAULT;
        }

        previousInterval = interval;
    });

    $effect(() => {
        if (previousPause !== unset && previousPause !== pause) {
            rootState.pauseInteraction = pause === 'hover' || pause === false ? pause : CarouselRootState.PAUSE_DEFAULT;
        }

        previousPause = pause;
    });

    $effect(() => {
        if (previousRide !== unset && previousRide !== ride) {
            rootState.ride = ride || CarouselRootState.RIDE_DEFAULT;
        }

        previousRide = ride;
    });

    $effect(() => {
        if (previousTransitionDuration !== unset && previousTransitionDuration !== transitionDuration) {
            rootState.transitionDuration = transitionDuration || CarouselRootState.TRANSITION_DURATION_DEFAULT;
        }

        previousTransitionDuration = transitionDuration;
    });
</script>

<div
    bind:this={elementRef}
    class={classes}
    {id}
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}
    style={styles}
    {...restOfProps}>
    {@render children?.()}
</div>

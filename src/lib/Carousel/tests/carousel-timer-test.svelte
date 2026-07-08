<script lang="ts">
    import { Carousel } from '$lib/index.js';
</script>

<!-- Carousel configured so that clicking "next" both starts a transition-commit
     timeout (`to()`) and, because `ride` is truthy after user interaction, arms
     the autoplay timer. Used to verify dispose() cancels every pending timer,
     including ones scheduled mid-transition, instead of only the autoplay one. -->
<Carousel.Root id="timer-carousel" animation="slide" ride={true} interval={5000} data-testid="timer-carousel">
    <Carousel.Inner data-testid="timer-carousel-inner">
        <Carousel.Item isActive={true} data-testid="timer-carousel-item-1">
            <span data-testid="timer-carousel-item-1-content">First slide</span>
        </Carousel.Item>
        <Carousel.Item data-testid="timer-carousel-item-2">
            <span data-testid="timer-carousel-item-2-content">Second slide</span>
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlNext data-testid="timer-carousel-control-next" />
</Carousel.Root>

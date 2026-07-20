<script lang="ts">
    import { Carousel } from '$lib/index.js';
</script>

<Carousel.Root animation="none" interval={20} ride="carousel" transitionDuration={0} data-testid="root-interval-carousel">
    <Carousel.Inner>
        <Carousel.Item isActive={true} data-testid="root-interval-item-1">One</Carousel.Item>
        <Carousel.Item data-testid="root-interval-item-2">Two</Carousel.Item>
        <Carousel.Item data-testid="root-interval-item-3">Three</Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

<Carousel.Root animation="none" interval={100} ride="carousel" transitionDuration={0} data-testid="item-interval-carousel">
    <Carousel.Inner>
        <Carousel.Item isActive={true} interval={20} data-testid="item-interval-item-1">One</Carousel.Item>
        <Carousel.Item data-testid="item-interval-item-2">Two</Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

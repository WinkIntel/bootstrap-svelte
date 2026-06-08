<script lang="ts">
    import { Carousel } from '$lib/index.js';
</script>

<Carousel.Root id="autoplay-carousel" ride="carousel" data-testid="autoplay-carousel">
    <Carousel.Inner data-testid="autoplay-carousel-inner">
        <Carousel.Item isActive={true} data-testid="autoplay-carousel-item-1">
            <div style="background-color: #eee; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>First slide</span>
            </div>
        </Carousel.Item>
        <Carousel.Item data-testid="autoplay-carousel-item-2">
            <div style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>Second slide</span>
            </div>
        </Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

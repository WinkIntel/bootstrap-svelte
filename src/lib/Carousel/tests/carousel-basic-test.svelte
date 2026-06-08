<script lang="ts">
    import { Carousel } from '$lib/index.js';
</script>

<!-- Basic carousel -->
<Carousel.Root id="test-carousel" data-testid="carousel">
    <Carousel.Indicators data-testid="carousel-indicators">
        <Carousel.IndicatorButton data-testid="carousel-indicator-1" />
        <Carousel.IndicatorButton data-testid="carousel-indicator-2" />
        <Carousel.IndicatorButton data-testid="carousel-indicator-3" />
    </Carousel.Indicators>
    <Carousel.Inner data-testid="carousel-inner">
        <Carousel.Item isActive={true} data-testid="carousel-item-1">
            <div style="background-color: #eee; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span data-testid="carousel-item-1-content">First slide</span>
            </div>
            <Carousel.Caption data-testid="carousel-caption-1">
                <h5 data-testid="carousel-caption-1-title">First slide label</h5>
                <p data-testid="carousel-caption-1-text">This is the caption for the first slide.</p>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item data-testid="carousel-item-2">
            <div style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span data-testid="carousel-item-2-content">Second slide</span>
            </div>
        </Carousel.Item>
        <Carousel.Item data-testid="carousel-item-3">
            <div style="background-color: #ccc; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span data-testid="carousel-item-3-content">Third slide</span>
            </div>
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev data-testid="carousel-control-prev" />
    <Carousel.ControlNext data-testid="carousel-control-next" />
</Carousel.Root>

<!-- Carousel with slide animation -->
<Carousel.Root id="slide-carousel" animation="slide" data-testid="slide-carousel">
    <Carousel.Inner data-testid="slide-carousel-inner">
        <Carousel.Item isActive={true} data-testid="slide-carousel-item-1">
            <div style="background-color: #eee; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span data-testid="slide-carousel-item-1-content">First slide</span>
            </div>
        </Carousel.Item>
        <Carousel.Item data-testid="slide-carousel-item-2">
            <div style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>Second slide</span>
            </div>
        </Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

<!-- Carousel with fade animation -->
<Carousel.Root id="fade-carousel" animation="fade" data-testid="fade-carousel">
    <Carousel.Inner data-testid="fade-carousel-inner">
        <Carousel.Item isActive={true} data-testid="fade-carousel-item-1">
            <div style="background-color: #eee; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>First slide</span>
            </div>
        </Carousel.Item>
        <Carousel.Item data-testid="fade-carousel-item-2">
            <div style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>Second slide</span>
            </div>
        </Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

<!-- Carousel with crossfade animation -->
<Carousel.Root id="crossfade-carousel" animation="crossfade" data-testid="crossfade-carousel">
    <Carousel.Inner data-testid="crossfade-carousel-inner">
        <Carousel.Item isActive={true} data-testid="crossfade-carousel-item-1">
            <div style="background-color: #eee; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>First slide</span>
            </div>
        </Carousel.Item>
        <Carousel.Item data-testid="crossfade-carousel-item-2">
            <div style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>Second slide</span>
            </div>
        </Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

<!-- Carousel with custom interval -->
<Carousel.Root id="interval-carousel" interval={2000} data-testid="interval-carousel">
    <Carousel.Inner data-testid="interval-carousel-inner">
        <Carousel.Item isActive={true} data-testid="interval-carousel-item-1">
            <div style="background-color: #eee; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span data-testid="interval-carousel-item-1-content">First slide</span>
            </div>
        </Carousel.Item>
        <Carousel.Item data-testid="interval-carousel-item-2">
            <div style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>Second slide</span>
            </div>
        </Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

<!-- Carousel with custom transition duration -->
<Carousel.Root id="duration-carousel" transitionDuration={1000} data-testid="duration-carousel">
    <Carousel.Inner data-testid="duration-carousel-inner">
        <Carousel.Item isActive={true} data-testid="duration-carousel-item-1">
            <div style="background-color: #eee; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>First slide</span>
            </div>
        </Carousel.Item>
        <Carousel.Item data-testid="duration-carousel-item-2">
            <div style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>Second slide</span>
            </div>
        </Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

<!-- Carousel with ride enabled -->
<Carousel.Root id="ride-carousel" ride={true} data-testid="ride-carousel">
    <Carousel.Inner data-testid="ride-carousel-inner">
        <Carousel.Item isActive={true} data-testid="ride-carousel-item-1">
            <div style="background-color: #eee; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>First slide</span>
            </div>
        </Carousel.Item>
        <Carousel.Item data-testid="ride-carousel-item-2">
            <div style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center;">
                <span>Second slide</span>
            </div>
        </Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

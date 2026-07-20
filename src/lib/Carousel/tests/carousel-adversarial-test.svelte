<script lang="ts">
    import { Carousel } from '$lib/index.js';

    let ride = $state(true);
    let showInserted = $state(false);
    let showMiddle = $state(true);
    let pointerCalls = $state(0);
    let hoverCalls = $state(0);
</script>

<button data-testid="disable-touch-ride" onclick={() => (ride = false)}>Disable ride</button>
<Carousel.Root
    animation="none"
    interval={20}
    {ride}
    transitionDuration={0}
    data-testid="touch-carousel"
    onpointerdown={() => pointerCalls++}
    onpointerup={() => pointerCalls++}
    onpointercancel={() => pointerCalls++}>
    <Carousel.Inner>
        <Carousel.Item isActive={true} data-testid="touch-item-1" onmouseenter={() => hoverCalls++} onmouseleave={() => hoverCalls++}
            >One</Carousel.Item>
        <Carousel.Item data-testid="touch-item-2">Two</Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>
<output data-testid="callback-counts">{pointerCalls}:{hoverCalls}</output>

<Carousel.Root animation="none" interval={20} ride={true} transitionDuration={0} data-testid="indicator-carousel">
    <Carousel.Indicators>
        <Carousel.IndicatorButton data-testid="indicator-1" />
        <Carousel.IndicatorButton data-testid="indicator-2" />
        <Carousel.IndicatorButton data-testid="indicator-3" />
    </Carousel.Indicators>
    <Carousel.Inner>
        <Carousel.Item isActive={true} data-testid="indicator-item-1">One</Carousel.Item>
        <Carousel.Item data-testid="indicator-item-2">Two</Carousel.Item>
        <Carousel.Item data-testid="indicator-item-3">Three</Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

<Carousel.Root animation="fade" transitionDuration={1000} data-testid="fade-boundary-carousel">
    <Carousel.Inner>
        <Carousel.Item isActive={true} data-testid="fade-boundary-item-1">One</Carousel.Item>
        <Carousel.Item data-testid="fade-boundary-item-2">Two</Carousel.Item>
        <Carousel.Item data-testid="fade-boundary-item-3">Three</Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlNext data-testid="fade-boundary-next" />
</Carousel.Root>

<button data-testid="remove-middle" onclick={() => (showMiddle = false)}>Remove middle</button>
<button data-testid="insert-middle" onclick={() => (showInserted = true)}>Insert middle</button>
<Carousel.Root animation="none" transitionDuration={0} data-testid="removal-carousel">
    <Carousel.Indicators>
        <Carousel.IndicatorButton data-testid="removal-indicator-1" />
        {#if showInserted}
            <Carousel.IndicatorButton data-testid="inserted-indicator" />
        {/if}
        {#if showMiddle}
            <Carousel.IndicatorButton data-testid="removal-indicator-2" />
        {/if}
        <Carousel.IndicatorButton data-testid="removal-indicator-3" />
    </Carousel.Indicators>
    <Carousel.Inner data-testid="removal-inner">
        <Carousel.Item id="removal-item-id-1" isActive={true} data-testid="removal-item-1">One</Carousel.Item>
        {#if showInserted}
            <Carousel.Item id="inserted-item-id" data-testid="inserted-item">Inserted</Carousel.Item>
        {/if}
        {#if showMiddle}
            <Carousel.Item id="removal-item-id-2" data-testid="removal-item-2">Two</Carousel.Item>
        {/if}
        <Carousel.Item id="removal-item-id-3" data-testid="removal-item-3">Three</Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlNext data-testid="removal-next" />
</Carousel.Root>

<Carousel.Root animation="none" data-testid="cancel-carousel">
    <Carousel.Inner>
        <Carousel.Item isActive={true} data-testid="cancel-item-1">One</Carousel.Item>
        <Carousel.Item data-testid="cancel-item-2">Two</Carousel.Item>
    </Carousel.Inner>
</Carousel.Root>

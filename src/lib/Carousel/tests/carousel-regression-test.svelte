<script lang="ts">
    import { Carousel } from '$lib/index.js';

    type Animation = 'crossfade' | 'fade' | 'none' | 'slide';
    type Ride = boolean | 'carousel';

    let {
        animation = 'none',
        interval = 40,
        itemInterval,
        ride = false,
        transitionDuration = 0
    }: {
        animation?: Animation;
        interval?: number;
        itemInterval?: number;
        ride?: Ride;
        transitionDuration?: number;
    } = $props();

    let items = $state([
        { id: 'one', label: 'One' },
        { id: 'two', label: 'Two' },
        { id: 'three', label: 'Three' }
    ]);

    function remove(id: string): void {
        items = items.filter((item) => item.id !== id);
    }
</script>

<button data-testid="remove-one" onclick={() => remove('one')}>Remove one</button>
<button data-testid="remove-two" onclick={() => remove('two')}>Remove two</button>

<Carousel.Root {animation} {interval} pause={false} {ride} {transitionDuration} data-testid="regression-carousel">
    <Carousel.Indicators data-testid="regression-indicators">
        {#each items as item (item.id)}
            <Carousel.IndicatorButton data-testid={`indicator-${item.id}`} />
        {/each}
    </Carousel.Indicators>
    <Carousel.Inner data-testid="regression-inner">
        {#each items as item, index (item.id)}
            <Carousel.Item isActive={index === 0} interval={index === 0 ? itemInterval : undefined} data-testid={`item-${item.id}`}>
                {item.label}
            </Carousel.Item>
        {/each}
    </Carousel.Inner>
    <Carousel.ControlNext data-testid="regression-next" />
</Carousel.Root>

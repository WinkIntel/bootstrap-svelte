<script lang="ts">
    import { Carousel } from '../../Carousel/index.js';
    let {
        animation,
        itemProps = {}
    }: {
        animation: Carousel.RootProps['animation'];
        itemProps?: Pick<Carousel.ItemProps, 'onSlide' | 'onSlid' | 'onintrostart' | 'onintroend'>;
    } = $props();
</script>

<Carousel.Root {animation} ride={false} transitionDuration={100}>
    <Carousel.Inner>
        <Carousel.Item isActive data-testid="first">First</Carousel.Item>
        <Carousel.Item {...itemProps} data-testid="second">Second</Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlNext data-testid="next" />
</Carousel.Root>

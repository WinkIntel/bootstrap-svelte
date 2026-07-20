<script lang="ts">
    import { Carousel } from '$lib/index.js';
    import { onMount } from 'svelte';

    let hasSecondItem = $state(false);

    onMount(() => {
        const timeoutId = window.setTimeout(() => {
            hasSecondItem = true;
        }, 10);

        return () => window.clearTimeout(timeoutId);
    });
</script>

<Carousel.Root animation="none" interval={20} pause={false} ride="carousel" transitionDuration={0}>
    <Carousel.Inner>
        <Carousel.Item isActive={true} data-testid="async-autoplay-item-1">One</Carousel.Item>
        {#if hasSecondItem}
            <Carousel.Item data-testid="async-autoplay-item-2">Two</Carousel.Item>
        {/if}
    </Carousel.Inner>
</Carousel.Root>

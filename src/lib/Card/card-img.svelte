<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Card } from './index.js';

    // Generate a unique ID for the card element, in case one is not provided...
    const uid: string = $props.id();

    let {
        class: classValues,
        elementRef = $bindable(null),
        id = `card-img-${uid}`,
        position,
        src = '',
        alt = '',
        ...restOfProps
    }: Card.ImgProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            {
                'card-img': !position,
                'card-img-top': position === 'top',
                'card-img-bottom': position === 'bottom'
            },
            classValues
        )
    );
</script>

<img bind:this={elementRef} class={classes} {id} {src} {alt} {...restOfProps} />

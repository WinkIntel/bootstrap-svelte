<!--
@component
## Card
A flexible and extensible content container with multiple variants and options.

@example
```svelte
<Card.Root>
    <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Subtitle>Card Subtitle</Card.Subtitle>
        <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
        <Card.Link href="#!">Card Link</Card.Link>
        <Card.Link href="#!">Another Link</Card.Link>
    </Card.Body>
</Card.Root>
```

@example
```svelte
<Card.Root>
    <Card.Img src="https://placehold.co/300x180/000000/FFF" alt="Card image" />
    <Card.ImgOverlay>
        <Card.Title>Card title</Card.Title>
        <Card.Text>This is a wider card with supporting text below as a natural lead-in to additional content.</Card.Text>
        <Card.Text><small>Last updated 3 mins ago</small></Card.Text>
    </Card.ImgOverlay>
</Card.Root>
```

### Props
- `class` (string): Optional. Additional CSS classes to apply to the card.
- `elementRef` (HTMLElement): Optional. Reference to the card DOM element.
- `id` (string): Optional. Unique ID for the card element. Defaults to `card-{uid}`.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Card } from './index.js';

    // Generate a unique ID for the card element, in case one is not provided...
    const uid: string = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `card-${uid}`, ...restOfProps }: Card.RootProps = $props();

    let classes: string = $derived(uniqueClsx('card', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

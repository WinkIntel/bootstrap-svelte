<!--
@component
## ListGroup.Root
A component that serves as a container for list group items. It can be used to create a list of items with various styles and behaviors.

@example
```svelte
<ListGroup.Root>
    <ListGroup.Item>Basic list item 1</ListGroup.Item>
    <ListGroup.Item>Basic list item 2</ListGroup.Item>
</ListGroup.Root>
```

#### Standard list group
```svelte
<ListGroup.Root>
    <ListGroup.Item>First item</ListGroup.Item>
    <ListGroup.Item>Second item</ListGroup.Item>
    <ListGroup.Item>Third item</ListGroup.Item>
</ListGroup.Root>
```

#### Flush list group (without outer borders)
```svelte
<ListGroup.Root isFlush={true}>
    <ListGroup.Item>Flush list item 1</ListGroup.Item>
    <ListGroup.Item>Flush list item 2</ListGroup.Item>
    <ListGroup.Item>Flush list item 3</ListGroup.Item>
</ListGroup.Root>
```

#### Horizontal list group
```svelte
<ListGroup.Root isHorizontal={true}>
    <ListGroup.Item>Horizontal item 1</ListGroup.Item>
    <ListGroup.Item>Horizontal item 2</ListGroup.Item>
    <ListGroup.Item>Horizontal item 3</ListGroup.Item>
</ListGroup.Root>
```

#### Numbered list group
```svelte
<ListGroup.Root isNumbered={true}>
    <ListGroup.Item>Numbered item 1</ListGroup.Item>
    <ListGroup.Item>Numbered item 2</ListGroup.Item>
    <ListGroup.Item>Numbered item 3</ListGroup.Item>
</ListGroup.Root>
```

#### Combined properties
```svelte
<ListGroup.Root isFlush={true} isNumbered={true}>
    <ListGroup.Item>Flush and numbered item 1</ListGroup.Item>
    <ListGroup.Item>Flush and numbered item 2</ListGroup.Item>
</ListGroup.Root>
```

### Props
- `class` (string): Optional. CSS classes for styling the list group
- `elementRef` (HTMLElement): Optional. Reference to the list group DOM element
- `id` (string): Optional. ID for the list group element
- `isFlush` (boolean): Optional. Removes outer borders and rounded corners
- `isHorizontal` (boolean): Optional. Changes list group direction to horizontal
- `isNumbered` (boolean): Optional. Creates a numbered list with `<ol>` instead of `<ul>`
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { ListGroup } from './index.js';

    // Generate a unique ID for the card element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        horizontalOnBreakpoint,
        id = `list-group-${uid}`,
        isFlush,
        isNumbered,
        ...restOfProps
    }: ListGroup.RootProps = $props();

    let elementType: string = $derived(isNumbered ? 'ol' : 'ul');

    let hasHorizontalOnBreakpoint = $derived(!!horizontalOnBreakpoint); // !! to convert to boolean
    let isAlwaysHorizontal = $derived(hasHorizontalOnBreakpoint && horizontalOnBreakpoint === 'xs'); // Check if always horizontal
    let classes: string = $derived(
        uniqueClsx(
            'list-group',
            {
                'list-group-flush': isFlush,
                'list-group-horizontal': isAlwaysHorizontal,
                [`list-group-horizontal-${horizontalOnBreakpoint}`]: hasHorizontalOnBreakpoint && !isAlwaysHorizontal,
                'list-group-numbered': isNumbered
            },
            classValues
        )
    );
</script>

<svelte:element this={elementType} bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</svelte:element>

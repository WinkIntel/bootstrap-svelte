<!--
@component
## ListGroup.Item
A component that represents an item in a list group. It can be used as a standalone item or as part of a list group.

@example
```svelte
<ListGroup.Item>Basic list item</ListGroup.Item>
```

#### Standard list items
```svelte
<ListGroup.Item>Default item</ListGroup.Item>
<ListGroup.Item isActive={true}>Active item</ListGroup.Item>
<ListGroup.Item isDisabled={true}>Disabled item</ListGroup.Item>
```

#### Actionable items
```svelte
<ListGroup.Item isActionable={true}>Clickable item</ListGroup.Item>
<ListGroup.Item isActionable={true} isActive={true}>Active and clickable</ListGroup.Item>
```

#### Item color variants
```svelte
<ListGroup.Item colorVariant="primary">Primary</ListGroup.Item>
<ListGroup.Item colorVariant="secondary">Secondary</ListGroup.Item>
<ListGroup.Item colorVariant="success">Success</ListGroup.Item>
<ListGroup.Item colorVariant="danger">Danger</ListGroup.Item>
<ListGroup.Item colorVariant="warning">Warning</ListGroup.Item>
<ListGroup.Item colorVariant="info">Info</ListGroup.Item>
<ListGroup.Item colorVariant="light">Light</ListGroup.Item>
<ListGroup.Item colorVariant="dark">Dark</ListGroup.Item>
```

#### Combined properties
```svelte
<ListGroup.Item colorVariant="success" isActive={true}>Active success item</ListGroup.Item>
<ListGroup.Item colorVariant="danger" isDisabled={true}>Disabled danger item</ListGroup.Item>
```

### Props
- `class` (string): Optional. CSS classes for styling the item.
- `colorVariant` (string): Optional. Color variant for the item ('primary', 'success', etc.).
- `elementRef` (HTMLElement): Optional. Reference to the list item DOM element.
- `id` (string): Optional. ID for the list item element.
- `isActive` (boolean): Optional. Applies active styling to the item.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { ListGroup } from './index.js';

    // Generate a unique ID for the card element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        colorVariant,
        elementRef = $bindable(null),
        id = `list-group-item-${uid}`,
        isActive = false,
        ...restOfProps
    }: ListGroup.ItemProps = $props();

    let classes: string = $derived(
        uniqueClsx('list-group-item', { active: isActive }, colorVariant && `list-group-item-${colorVariant}`, classValues)
    );
</script>

<li aria-current={isActive} bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</li>

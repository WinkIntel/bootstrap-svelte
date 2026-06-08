<!--
@component
## Pagination.Item
Pagination item component to wrap Pagination.Link components.

@example
```svelte
<Pagination.Item>
    <Pagination.Link href="#!">1</Pagination.Link>
</Pagination.Item>
```

@example
```svelte
<Pagination.Item isActive={true}>
    <Pagination.Link href="#!">2</Pagination.Link>
</Pagination.Item>
```

@example
```svelte
<Pagination.Item isDisabled={true}>
    <Pagination.Link href="#!">Next</Pagination.Link>
</Pagination.Item>
```

### Props
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the item DOM element.
- `isActive` (boolean): Optional. Whether the pagination item is active. Defaults to false.
- `isDisabled` (boolean): Optional. Whether the pagination item is disabled. Defaults to false.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Pagination } from './index.js';
    import { initPaginationItemState, PaginationItemState } from './pagination.svelte.js';

    // Generate a unique ID for the collapse element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `page-item-${uid}`,
        isActive = false,
        isDisabled = false,
        ...restOfProps
    }: Pagination.ItemProps = $props();

    const itemState: PaginationItemState = initPaginationItemState({
        get id() {
            return id;
        },
        get isActive() {
            return isActive;
        },
        get isDisabled() {
            return isDisabled;
        }
    });

    let classes = $derived(
        uniqueClsx(
            'page-item',
            {
                active: itemState.isActive,
                disabled: itemState.isDisabled
            },
            classValues
        )
    );

    $effect(() => {
        // Update the state when the isActive prop changes...
        if (id && itemState.isActive !== isActive) {
            const isItemActive = itemState.root.isPaginationItemActive(id);

            if (isActive && !isItemActive) {
                itemState.root.setPaginationItemActive(id);
            } else if (!isActive && isItemActive) {
                itemState.root.setPaginationItemActive('');
            }
        }
    });

    $effect(() => {
        // Update the state when the isDisabled prop changes...
        if (id && itemState.isDisabled !== isDisabled) {
            const isItemDisabled = itemState.root.isPaginationItemDisabled(id);

            if (isDisabled && !isItemDisabled) {
                itemState.root.setPaginationItemDisabled(id);
            } else if (!isDisabled && isItemDisabled) {
                itemState.root.setPaginationItemDisabled('');
            }
        }
    });
</script>

<li aria-current={isActive ? 'page' : undefined} bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</li>

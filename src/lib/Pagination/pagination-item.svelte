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
        'aria-current': ariaCurrent,
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
        const itemId = id;
        const itemIsActive = isActive;

        if (!itemId) {
            return;
        }

        if (itemIsActive) {
            itemState.root.setPaginationItemActive(itemId);
        } else {
            itemState.root.removePaginationItemActive(itemId);
        }

        return () => {
            // The root may have activated this identity through a stateful link
            // click even when the declarative isActive prop is false.
            itemState.root.removePaginationItemActive(itemId);
        };
    });

    $effect(() => {
        const itemId = id;

        if (!itemId) {
            return;
        }

        if (isDisabled) {
            itemState.root.setPaginationItemDisabled(itemId);
        } else {
            itemState.root.removePaginationItemDisabled(itemId);
        }

        return () => itemState.root.removePaginationItemDisabled(itemId);
    });
</script>

<li {...restOfProps} aria-current={itemState.isActive ? 'page' : ariaCurrent} bind:this={elementRef} class={classes} {id}>
    {@render children?.()}
</li>

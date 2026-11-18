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
<Pagination.Item isControl isDisabled={true}>
    <Pagination.Link href="#!">Next</Pagination.Link>
</Pagination.Item>
```

### Props
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the item DOM element.
- `isActive` (boolean): Optional. Declarative active state. Stateful clicks override unchanged flags; later flag changes, selected-item removal or leaving stateful mode restore declarative control. Defaults to false.
- `isControl` (boolean): Optional. Prevents link clicks from selecting this item as the active page. Use for Previous, Next and ellipsis items. Defaults to false.
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
        isControl = false,
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
        get isControl() {
            return isControl;
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

    // Observe only the declarative flag: selecting an item must not rerun this
    // effect and immediately surrender the click selection.
    let previousIsActive: boolean | undefined;
    $effect(() => {
        const currentIsActive = isActive;
        if (previousIsActive !== undefined && currentIsActive !== previousIsActive) {
            itemState.root.clearPaginationItemActive();
        }
        previousIsActive = currentIsActive;
    });

    $effect(() => {
        const itemId = id;

        if (!itemId) {
            return;
        }

        return () => {
            // Release the click selection when its identity changes or unmounts.
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

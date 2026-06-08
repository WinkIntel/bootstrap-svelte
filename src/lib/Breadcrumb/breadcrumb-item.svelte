<!--
@component
## Breadcrumb.Item
Breadcrumb item component for use within a Breadcrumb.Root.

@example
```svelte
<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
```

@example
```svelte
<Breadcrumb.Item href="/library">Library</Breadcrumb.Item>
```

@example
```svelte
<Breadcrumb.Item isActive={true}>Current Page</Breadcrumb.Item>
```

### Props
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element.
- `href` (string): Optional. URL for the breadcrumb item. Defaults to "#!".
- `id` (string): Optional. Unique ID for the breadcrumb item element.
- `isActive` (boolean): Optional. Whether the breadcrumb item is active (current page). Defaults to false.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { BreadcrumbItemState, initBreadcrumbItemState } from './breadcrumb.svelte.js';
    import type { Breadcrumb } from './index.js';

    // Generate a unique ID for the component, in case one is not provided
    const uid = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        href = '#!',
        id = `breadcrumb-item-${uid}`,
        isActive = false,
        ...restOfProps
    }: Breadcrumb.ItemProps = $props();

    const itemState: BreadcrumbItemState = initBreadcrumbItemState({
        get id() {
            return id;
        },
        get isActive() {
            return isActive;
        }
    });

    let previousIsActive: boolean | undefined;

    let classes = $derived(
        uniqueClsx(
            'breadcrumb-item',
            {
                active: itemState.isActive
            },
            classValues
        )
    );

    $effect(() => {
        // Update the state when the isActive prop changes
        if (id && previousIsActive !== undefined && previousIsActive !== isActive) {
            const isItemActive = itemState.root.isBreadcrumbItemActive(id);

            if (isActive && !isItemActive) {
                itemState.root.setBreadcrumbItemActive(id);
            } else if (!isActive && isItemActive) {
                itemState.root.setBreadcrumbItemActive('');
            }
        }

        previousIsActive = isActive;
    });
</script>

<li aria-current={isActive ? 'page' : undefined} bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {#if isActive}
        {@render children?.()}
    {:else}
        <a {href}>{@render children?.()}</a>
    {/if}
</li>

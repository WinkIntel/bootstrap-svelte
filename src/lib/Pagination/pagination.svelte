<!--
@component
## Pagination.Root
Root pagination component that contains pagination items and links.

@example
```svelte
<Pagination.Root>
    <Pagination.Item isControl>
        <Pagination.Link href="#!">Previous</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#!">1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item isActive={true}>
        <Pagination.Link href="#!">2</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#!">3</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item isControl>
        <Pagination.Link href="#!">Next</Pagination.Link>
    </Pagination.Item>
</Pagination.Root>
```
### Props
- `alignment` (string): Optional. Horizontal alignment, one of: 'start', 'center', 'end'.
- `aria-label` (string): Optional. ARIA label for the pagination navigation. Defaults to "Pagination navigation".
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element.
- `id` (string): Optional. Unique ID for the pagination element.
- `isStateful` (boolean): Optional. Defaults to true. A page click overrides earlier unchanged `isActive` flags; later flag changes restore declarative selection. Use false for purely application-controlled flags.
- `size` (string): Optional. Size of pagination component, one of: 'sm', 'lg'.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Pagination as PaginationTypes } from './index.js';
    import { initPaginationRootState, PaginationRootState } from './pagination.svelte.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid = $props.id();

    let {
        alignment,
        'aria-label': ariaLabel = 'Pagination navigation',
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `pagination-${uid}`,
        isStateful = true,
        size,
        ...restOfProps
    }: PaginationTypes.RootProps = $props();

    const _rootState: PaginationRootState = initPaginationRootState({
        get id() {
            return id;
        },
        get isStateful() {
            return isStateful;
        }
    });

    let classes = $derived(
        uniqueClsx(
            'pagination',
            {
                'justify-content-center': alignment === 'center',
                'justify-content-end': alignment === 'end',
                'pagination-sm': size === 'sm',
                'pagination-lg': size === 'lg'
            },
            classValues
        )
    );
</script>

<nav aria-label={ariaLabel}>
    <ul bind:this={elementRef} class={classes} {id} {...restOfProps}>
        {@render children?.()}
    </ul>
</nav>

<!--
@component
## Pagination.Link
Pagination link component that is typically used inside a Pagination.Item.

@example
```svelte
<Pagination.Link href="#!">1</Pagination.Link>
```

@example
```svelte
<Pagination.Link href="#!" ariaLabel="Go to previous page">Previous</Pagination.Link>
```

### Props
- `ariaLabel` (string): Optional. ARIA label for the link.
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the link DOM element.
- `href` (string): Optional. The URL to link to. Defaults to "#".
- `isDisabled` (boolean): Optional. Whether the link is disabled (pagination item should also be set to disabled). Defaults to false.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import type { Pagination } from './index.js';
    import { initPaginationLinkState, PaginationLinkState } from './pagination.svelte.js';

    // Generate a unique ID for the collapse element, in case one is not provided...
    const uid: string = $props.id();

    let {
        'aria-label': ariaLabel,
        children,
        class: classValues,
        elementRef = $bindable(null),
        href = '#!',
        id = `page-link-${uid}`,
        onclick = noop,
        ...restOfProps
    }: Pagination.LinkProps = $props();

    const linkState: PaginationLinkState = initPaginationLinkState({
        get id() {
            return id;
        }
    });

    let classes = $derived(uniqueClsx('page-link', classValues));
    let isDisabled: boolean = $derived(linkState.item.isDisabled);
    let tabIndex: number = $derived(isDisabled ? -1 : 0);

    const handleClick: EventListener = (event: Event) => {
        linkState.onclick();
        onclick(event);
    };
</script>

<a aria-label={ariaLabel} bind:this={elementRef} class={classes} {href} {id} onclick={handleClick} tabindex={tabIndex} {...restOfProps}>
    {@render children?.()}
</a>

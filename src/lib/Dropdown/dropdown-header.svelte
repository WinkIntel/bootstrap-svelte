<!--
@component
## Dropdown.Header
A header for grouping dropdown items.

@example
```svelte
<Dropdown.Header>Group Title</Dropdown.Header>
```

### Props
- `class` (string): Optional. Additional CSS classes to apply to the header.
- `elementRef` (HTMLElement): Optional. Reference to the header DOM element.
- `level` (number): Optional. Heading level for the header (default is 6).
- `listItemProps` (object): Optional. Additional properties to apply to the `<li>` element that wraps the header.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Dropdown } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), level = 6, listItemProps, ...restOfProps }: Dropdown.HeaderProps = $props();

    let elementType: string = $derived(`h${level}`);

    let classes: string = $derived(uniqueClsx('dropdown-header', classValues));
</script>

<li {...listItemProps}>
    <svelte:element this={elementType} bind:this={elementRef} class={classes} {...restOfProps}>
        {@render children?.()}
    </svelte:element>
</li>

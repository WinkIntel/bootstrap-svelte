<!--
@component
## Dropdown.Divider
A horizontal divider for separating dropdown items.

@example
```svelte
<Dropdown.Divider />
```

### Props
- `class` (string): Optional. Additional CSS classes to apply to the divider.
- `elementRef` (HTMLElement): Optional. Reference to the divider DOM element.
- `listItemProps` (object): Optional. Additional properties to apply to the `<li>` element that wraps the divider.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Dropdown } from './index.js';

    let { class: classValues, elementRef = $bindable(null), listItemProps, ...restOfProps }: Dropdown.DividerProps = $props();

    let classes: string = $derived(uniqueClsx('dropdown-divider', classValues));
</script>

<li {...listItemProps}>
    <hr bind:this={elementRef} class={classes} {...restOfProps} />
</li>

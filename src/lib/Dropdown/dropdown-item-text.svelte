<!--
@component
## Dropdown.Text
Text content within a dropdown menu.

@example
```svelte
<Dropdown.Text>Some text here</Dropdown.Text>
```

### Props
- `class` (string): Optional. Additional CSS classes to apply to the text.
- `elementRef` (HTMLElement): Optional. Reference to the text DOM element.
- `listItemProps` (object): Optional. Additional properties for the list item element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Dropdown } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), listItemProps, ...restOfProps }: Dropdown.ItemTextProps = $props();

    // Compute text classes
    let classes: string = $derived(uniqueClsx('dropdown-item-text', classValues));
</script>

<li {...listItemProps}>
    <span bind:this={elementRef} class={classes} {...restOfProps}>
        {@render children?.()}
    </span>
</li>

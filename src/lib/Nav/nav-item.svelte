<!--
@component
## Nav.Item
Nav item component to wrap Nav.Link components.

@example
```svelte
<Nav.Item>
    <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
</Nav.Item>
```
### Props
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the item DOM element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { doesTabRootContextExists } from '$lib/common/nav-tab.svelte.js';
    import type { Nav } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), role, ...restOfProps }: Nav.ItemProps = $props();

    let defaultRole: string | null | undefined = $derived(doesTabRootContextExists() ? 'presentation' : role);
    let classes: string = $derived(uniqueClsx('nav-item', classValues));
</script>

<li bind:this={elementRef} class={classes} role={defaultRole} {...restOfProps}>
    {@render children?.()}
</li>

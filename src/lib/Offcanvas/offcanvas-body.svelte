<!--
@component
## Offcanvas.Body
Body component for the Offcanvas content.

@example
```svelte
<Offcanvas.Body>
    Content for the offcanvas goes here. You can place just about any Bootstrap component or custom elements here.
</Offcanvas.Body>
```

### Props
- `children` (slot): Content to display inside the body
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the body DOM element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Offcanvas } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: Offcanvas.BodyProps = $props();

    let classes: string = $derived(uniqueClsx('offcanvas-body', classValues));
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>

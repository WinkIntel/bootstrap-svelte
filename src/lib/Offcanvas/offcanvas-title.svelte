<!--
@component
## Offcanvas.Title
Title component for the Offcanvas.Header.

@example
```svelte
<Offcanvas.Title>Offcanvas Title</Offcanvas.Title>
```

#### Custom heading level
```svelte
<Offcanvas.Title level={1}>H1 Title</Offcanvas.Title>
<Offcanvas.Title level={2}>H2 Title</Offcanvas.Title>
```

### Props
- `children` (slot): Content to display inside the title
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the title DOM element
- `level` (number): Optional. Heading level (1-6) for the title element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Offcanvas } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), level = 5, ...restOfProps }: Offcanvas.TitleProps = $props();

    let elementType: string = $derived(`h${level}`);

    let classes: string = $derived(uniqueClsx('offcanvas-title', classValues));
</script>

<svelte:element this={elementType} bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</svelte:element>

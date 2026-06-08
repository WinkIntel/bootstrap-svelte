<!--
@component
## Placeholder.Root
A container for placeholder items with optional animation effects.

@example
```svelte
<Placeholder.Root>
    <Placeholder.Item width="col-12" />
    <Placeholder.Item width="col-8" />
</Placeholder.Root>
```

#### Animation types
```svelte
<Placeholder.Root type="glow">
    <Placeholder.Item width="col-12" />
</Placeholder.Root>

<Placeholder.Root type="wave">
    <Placeholder.Item width="col-12" />
</Placeholder.Root>
```

### Props
- `class` (string): Optional. CSS classes for styling the placeholder container
- `elementRef` (HTMLDivElement): Optional. Reference to the placeholder container DOM element
- `type` ('glow' | 'wave'): Optional. Animation type for the placeholders, defaults to 'glow'
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Placeholder } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), type = 'glow', ...restOfProps }: Placeholder.RootProps = $props();

    let classes: string = $derived(uniqueClsx(`placeholder-${type}`, classValues));
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>

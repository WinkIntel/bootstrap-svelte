<!--
@component
## Spinner
A component that indicates a loading state using Bootstrap's spinner styling.

@example
```svelte
<Spinner />
```

#### Border spinner (default)
```svelte
<Spinner>
    <span class="visually-hidden">Loading...</span>
</Spinner>
```

#### Growing spinner
```svelte
<Spinner type="grow">
    <span class="visually-hidden">Loading...</span>
</Spinner>
```

#### Colors variants
```svelte
<Spinner colorVariant="primary">
    <span class="visually-hidden">Loading primary...</span>
</Spinner>
<Spinner colorVariant="secondary">
    <span class="visually-hidden">Loading secondary...</span>
</Spinner>
<Spinner colorVariant="success">
    <span class="visually-hidden">Loading success...</span>
</Spinner>
<Spinner colorVariant="danger">
    <span class="visually-hidden">Loading danger...</span>
</Spinner>
<Spinner colorVariant="warning">
    <span class="visually-hidden">Loading warning...</span>
</Spinner>
<Spinner colorVariant="info">
    <span class="visually-hidden">Loading info...</span>
</Spinner>
<Spinner colorVariant="light">
    <span class="visually-hidden">Loading light...</span>
</Spinner>
<Spinner colorVariant="dark">
    <span class="visually-hidden">Loading dark...</span>
</Spinner>
```

#### Sizes
```svelte
<Spinner size="sm">
    <span class="visually-hidden">Loading...</span>
</Spinner>
```

### Props
- `class` (string): Optional. Additional CSS classes.
- `colorVariant` (string): Optional. Color variant of the spinner ('primary', 'secondary', etc.).
- `elementRef` (HTMLElement): Optional. Reference to the spinner DOM element.
- `id` (string): Optional. ID for the spinner. If not provided, a unique ID will be generated.
- `size` (string): Optional. Size of the spinner ('sm').
- `type` (string): Optional. Type of spinner ('border' or 'grow'), defaults to 'border'.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { SpinnerRootProps } from './types.js';

    // Generate a unique ID for the spinner element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        colorVariant,
        elementRef = $bindable(null),
        id = `spinner-${uid}`,
        size,
        type = 'border',
        ...restOfProps
    }: SpinnerRootProps = $props();

    let classes: string = $derived(
        uniqueClsx(`spinner-${type}`, size && `spinner-${type}-${size}`, colorVariant && `text-${colorVariant}`, classValues)
    );
</script>

<div bind:this={elementRef} class={classes} {id} role="status" {...restOfProps}>
    {@render children?.()}
</div>

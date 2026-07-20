<!--
@component
## Placeholder.Item
A component that represents an individual placeholder element.

@example
```svelte
<Placeholder.Item class="col-12" />
```

#### Width options
```svelte
<Placeholder.Item class="col-6" />
<Placeholder.Item class="w-75" />
<Placeholder.Item style="width: 25%;" />
```

#### Size variants
```svelte
<Placeholder.Item class="col-12" size="lg" />
<Placeholder.Item class="col-12" />
<Placeholder.Item class="col-12" size="sm" />
<Placeholder.Item class="col-12" size="xs" />
```

#### Color variants
```svelte
<Placeholder.Item class="col-12" colorVariant="primary" />
<Placeholder.Item class="col-12" colorVariant="secondary" />
<Placeholder.Item class="col-12" colorVariant="success" />
<Placeholder.Item class="col-12" colorVariant="danger" />
<Placeholder.Item class="col-12" colorVariant="warning" />
<Placeholder.Item class="col-12" colorVariant="info" />
<Placeholder.Item class="col-12" colorVariant="light" />
<Placeholder.Item class="col-12" colorVariant="dark" />
```

### Props
- `class` (string): Optional. CSS classes for styling the placeholder item.
- `colorVariant` (string): Optional. Color variant for the placeholder ('primary', 'success', etc.).
- `elementRef` (HTMLSpanElement): Optional. Reference to the placeholder item DOM element.
- `id` (string): Optional. ID for the placeholder item element.
- `isAnimated` (boolean): Deprecated compatibility no-op. Set `type` on `Placeholder.Root` to animate a placeholder group.
- `size` ('xs' | 'sm' | 'lg'): Optional. Size of the placeholder.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Placeholder } from './index.js';

    let { children, class: classValues, colorVariant, elementRef = $bindable(null), size, ...restOfProps }: Placeholder.ItemProps = $props();

    let sanitizedRestOfProps = $derived.by(() => {
        // Keep accepting the legacy no-op without forwarding it as an invalid DOM attribute.
        const { isAnimated: _isAnimated, ...sanitizedProps } = restOfProps;
        return sanitizedProps;
    });

    let classes: string = $derived(uniqueClsx('placeholder', size && `placeholder-${size}`, colorVariant && `bg-${colorVariant}`, classValues));
</script>

<span bind:this={elementRef} class={classes} {...sanitizedRestOfProps}>
    {@render children?.()}
</span>

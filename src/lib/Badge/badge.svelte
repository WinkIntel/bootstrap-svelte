<!--
@component
## Badge
A small count and labeling component that can be used to add context or notifications.

@example
```svelte
<Badge>New</Badge>
```

#### Basic badge
```svelte
<Badge>Primary</Badge>
<Badge class="text-bg-secondary">Secondary</Badge>
```

#### Pill badges
```svelte
<Badge isPill={true}>Rounded badge</Badge>
```

#### Positioned badges
```svelte
<Badge position="top-end">99+</Badge>
```

Layout classes retain the default primary color. Recognized Bootstrap color classes override it. String, array and object class values are supported. For custom themes, use `colorVariant="none"` to omit library color classes; null and empty values retain fallback behavior.

### Props
- `class` (string | array | object): Optional. Additional CSS classes; default color selection is handled separately.
- `elementRef` (HTMLElement): Optional. Reference to the badge DOM element
- `isPill` (boolean): Optional. Makes the badge more rounded with pill styling
- `position` (string): Optional logical position from `top-start` through `bottom-end`.
- `colorVariant` (string): Optional. The badge variant style; `none` omits library color classes
-->
<script lang="ts">
    import { hasBootstrapColorClass, uniqueClsx } from '$lib/common/css.js';
    import { transformBadgePosition, type BadgeRootProps } from './types.js';

    let {
        children,
        class: classValues,
        colorVariant,
        elementRef = $bindable(null),
        isPill = false,
        position,
        ...restOfProps
    }: BadgeRootProps = $props();

    let hasColorVariant = $derived(typeof colorVariant === 'string' && colorVariant.trim().length > 0);
    let normalizedClassValues = $derived(uniqueClsx(classValues));
    let hasColorClasses = $derived(hasBootstrapColorClass(normalizedClassValues, 'badge'));

    let classes: string = $derived(
        uniqueClsx(
            'badge',
            colorVariant === 'none' ? false : hasColorVariant ? colorVariant : !hasColorClasses && 'text-bg-primary',
            { 'rounded-pill': isPill },
            position && transformBadgePosition(position),
            normalizedClassValues
        )
    );
</script>

<span bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</span>

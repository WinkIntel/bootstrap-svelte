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

### Props
- `class` (string): Optional. CSS classes for styling the badge (default: 'text-bg-primary')
- `elementRef` (HTMLElement): Optional. Reference to the badge DOM element
- `isPill` (boolean): Optional. Makes the badge more rounded with pill styling
- `position` (string): Optional logical position from `top-start` through `bottom-end`.
- `colorVariant` (string): Optional. The badge variant style
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
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
    let hasClassValues = $derived(typeof classValues === 'string' && classValues.trim().length > 0);

    let classes: string = $derived(
        uniqueClsx(
            'badge',
            hasColorVariant ? colorVariant : !hasClassValues && 'text-bg-primary',
            { 'rounded-pill': isPill },
            position && transformBadgePosition(position),
            classValues
        )
    );
</script>

<span bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</span>

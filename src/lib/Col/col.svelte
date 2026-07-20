<!--
@component
## Col
A component that implements Bootstrap's grid column functionality.

@example
```svelte
<Row>
    <Col>Content</Col>
</Row>
```

#### With responsive sizing
```svelte
<Row>
    <Col sizing={{ xs: 12, sm: 6, md: 4 }}>Content</Col>
</Row>
```

#### With breakpoint-only sizing (using asterisk)
```svelte
<Row>
    <Col sizing={{ sm: '*', md: '*' }}>Content</Col>
</Row>
```

#### With simple numeric sizing
```svelte
<Row>
    <Col sizing={6}>Content</Col>
</Row>
```

#### With column offsets
```svelte
<Row>
    <Col offset={2}>Offset by 2</Col>
    <Col offset={{ md: 3, lg: 4 }}>Responsive offset</Col>
</Row>
```

#### With column ordering
```svelte
<Row>
    <Col order="first">First in order</Col>
    <Col order={2}>Second in order</Col>
    <Col order={{ xs: 'last', lg: 3 }}>Responsive order</Col>
</Row>
```

### Props
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the column DOM element.
- `offset` (ColOffsetMap | ZeroToEleven): Optional. Column offset configuration. Can be a number between 0-11 or a breakpoint map.
- `order` (ColOrderMap | ZeroToFive | FirstOrLast): Optional. Column order configuration. Can be a number between 0-5, 'first', 'last', or a breakpoint map.
- `sizing` (ColSizingMap | OneToTwelve | 'auto'): Optional. Grid sizing configuration. Can be a number between 1-12, 'auto', or a breakpoint map. When using a breakpoint map, you can use '*' to generate a breakpoint-only class (e.g., `col-sm` instead of `col-sm-*`).
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { ColRootProps } from './types.js';

    let { children, class: classValues, elementRef = $bindable(null), offset, order, sizing, ...restOfProps }: ColRootProps = $props();

    const breakpoints = new Set(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']);
    const isIntegerInRange = (value: unknown, min: number, max: number): value is number =>
        typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
    const isSizingValue = (value: unknown): boolean => value === 'auto' || value === '*' || isIntegerInRange(value, 1, 12);
    const isOffsetValue = (value: unknown): boolean => isIntegerInRange(value, 0, 11);
    const isOrderValue = (value: unknown): boolean => value === 'first' || value === 'last' || isIntegerInRange(value, 0, 5);

    // Generate sizing classes based on the sizing prop
    let sizingClasses: string[] = $derived.by(() => {
        // If sizing is a string and is 'auto', return a single col-auto class
        if (sizing === 'auto') {
            return [`col-${sizing}`];
        }
        // If sizing is a number (OneToTwelve type), generate a simple col-n class
        if (isIntegerInRange(sizing, 1, 12)) {
            return [`col-${sizing}`];
        }
        // If sizing is an object (BreakpointSizingMap type), generate breakpoint-specific classes
        else if (sizing && typeof sizing === 'object') {
            return Object.entries(sizing).flatMap(([breakpoint, value]) => {
                if (!breakpoints.has(breakpoint) || !isSizingValue(value)) {
                    return [];
                }
                // If the value is '*', return just 'col-{breakpoint}'
                if (value === '*') {
                    return [breakpoint === 'xs' ? 'col' : `col-${breakpoint}`];
                }
                // If the breakpoint is 'xs', return 'col-{value}'
                if (breakpoint === 'xs') {
                    return [`col-${value}`];
                }
                // Otherwise, return 'col-{breakpoint}-{value}'
                return [`col-${breakpoint}-${value}`];
            });
        }
        // Default: no sizing classes
        return [];
    });

    // Generate offset classes if provided
    let offsetClasses: string[] = $derived.by(() => {
        // If offset is a number (ZeroToEleven type), generate a simple offset-n class
        if (isOffsetValue(offset)) {
            return [`offset-${offset}`];
        }
        // If offset is an object (ColOffsetMap type), generate breakpoint-specific classes
        else if (offset && typeof offset === 'object') {
            return Object.entries(offset).flatMap(([breakpoint, value]) => {
                if (!breakpoints.has(breakpoint) || !isOffsetValue(value)) {
                    return [];
                }
                return [breakpoint === 'xs' ? `offset-${value}` : `offset-${breakpoint}-${value}`];
            });
        }
        // Default: no offset classes
        return [];
    });

    // Generate order classes if provided
    let orderClasses: string[] = $derived.by(() => {
        // If order is a string (e.g., 'first' or 'last'), return a single order-first or order-last class
        if (order === 'first' || order === 'last') {
            return [`order-${order}`];
        }
        // If order is a number (ZeroToEleven type), generate a simple order-n class
        if (isIntegerInRange(order, 0, 5)) {
            return [`order-${order}`];
        }
        // If order is an object (ColOrderMap type), generate breakpoint-specific classes
        else if (order && typeof order === 'object') {
            return Object.entries(order).flatMap(([breakpoint, value]) => {
                if (!breakpoints.has(breakpoint) || !isOrderValue(value)) {
                    return [];
                }
                return [breakpoint === 'xs' ? `order-${value}` : `order-${breakpoint}-${value}`];
            });
        }
        // Default: no order classes
        return [];
    });

    let classes: string = $derived(uniqueClsx({ col: sizingClasses.length === 0 }, ...sizingClasses, ...offsetClasses, ...orderClasses, classValues));
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>

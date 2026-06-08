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

    // Generate sizing classes based on the sizing prop
    let sizingClasses: string[] = $derived.by(() => {
        // If sizing is a string and is 'auto', return a single col-auto class
        if (typeof sizing === 'string' && sizing === 'auto') {
            return [`col-${sizing}`];
        }
        // If sizing is a number (OneToTwelve type), generate a simple col-n class
        if (typeof sizing === 'number') {
            return [`col-${sizing}`];
        }
        // If sizing is an object (BreakpointSizingMap type), generate breakpoint-specific classes
        else if (sizing && typeof sizing === 'object') {
            return Object.entries(sizing).map(([breakpoint, value]) => {
                // If the breakpoint is 'xs', return 'col-{value}'
                if (breakpoint === 'xs') {
                    return `col-${value}`;
                }
                // If the value is '*', return just 'col-{breakpoint}'
                if (value === '*') {
                    return `col-${breakpoint}`;
                }
                // Otherwise, return 'col-{breakpoint}-{value}'
                return `col-${breakpoint}-${value}`;
            });
        }
        // Default: no sizing classes
        return [];
    });

    // Generate offset classes if provided
    let offsetClasses: string[] = $derived.by(() => {
        // If offset is a number (ZeroToEleven type), generate a simple offset-n class
        if (typeof offset === 'number') {
            return [`offset-${offset}`];
        }
        // If offset is an object (ColOffsetMap type), generate breakpoint-specific classes
        else if (offset && typeof offset === 'object') {
            return Object.entries(offset).map(([breakpoint, value]) => {
                // If the value is '*', return just 'offset-{breakpoint}'
                // if (value === '*') {
                //     return `offset-${breakpoint}`;
                // }
                // Otherwise, return 'offset-{breakpoint}-{value}'
                return `offset-${breakpoint}-${value}`;
            });
        }
        // Default: no offset classes
        return [];
    });

    // Generate order classes if provided
    let orderClasses: string[] = $derived.by(() => {
        // If order is a string (e.g., 'first' or 'last'), return a single order-first or order-last class
        if (typeof order === 'string' && (order === 'first' || order === 'last')) {
            return [`order-${order}`];
        }
        // If order is a number (ZeroToEleven type), generate a simple order-n class
        if (typeof order === 'number') {
            return [`order-${order}`];
        }
        // If order is an object (ColOrderMap type), generate breakpoint-specific classes
        else if (order && typeof order === 'object') {
            return Object.entries(order).map(([breakpoint, value]) => {
                // return 'order-{breakpoint}-{value}'
                return `order-${breakpoint}-${value}`;
            });
        }
        // Default: no order classes
        return [];
    });

    let classes: string = $derived(uniqueClsx({ col: sizing === undefined }, ...sizingClasses, ...offsetClasses, ...orderClasses, classValues));
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>

<!--
@component
## Row
A component that implements Bootstrap's grid row functionality.

@example
```svelte
<Row>
    <Col>Content</Col>
</Row>
```

#### With column count
```svelte
<Row cols={3}>
    <Col>Content</Col>
    <Col>Content</Col>
    <Col>Content</Col>
</Row>
```

#### With responsive column count
```svelte
<Row cols={{ xs: 1, sm: 2, md: 3 }}>
    <Col>Content</Col>
    <Col>Content</Col>
    <Col>Content</Col>
</Row>
```

#### With auto column count
```svelte
<Row cols="auto">
    <Col>Content</Col>
    <Col>Content</Col>
</Row>
```

### Props
- `class` (string): Optional. Additional CSS classes.
- `cols` (RowColsMap | OneToSix | 'auto'): Optional. Define the number of equal-width columns in the row. Can be a number between 1 and 6, 'auto', or a breakpoint map.
- `elementRef` (HTMLElement): Optional. Reference to the row DOM element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { RowRootProps } from './types.js';

    let { children, class: classValues, cols, elementRef = $bindable(null), ...restOfProps }: RowRootProps = $props();

    // Generate cols classes based on the cols prop
    let colsClasses: string[] = $derived.by(() => {
        // If cols is  a string (e.g., 'auto'), return a single row-cols-auto class
        if (typeof cols === 'string' && cols === 'auto') {
            return [`row-cols-${cols}`];
        }
        // If cols is a number (OneToSix type), generate a simple row-cols-n class
        if (typeof cols === 'number') {
            return [`row-cols-${cols}`];
        }
        // If cols is an object (RowColsMap type), generate breakpoint-specific classes
        else if (cols && typeof cols === 'object') {
            return Object.entries(cols).map(([breakpoint, value]) => {
                // If the breakpoint is 'xs', return 'row-col-{value}'
                if (breakpoint === 'xs') {
                    return `row-col-${value}`;
                }
                // Otherwise, return 'row-cols-{breakpoint}-{value}'
                return `row-cols-${breakpoint}-${value}`;
            });
        }
        // Default: no row-cols classes
        return [];
    });

    let classes: string = $derived(uniqueClsx('row', ...colsClasses, classValues));
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>

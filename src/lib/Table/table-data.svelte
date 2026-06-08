<!--
@component
## Table.Data
A component to render a Bootstrap table data cell.

@example
```svelte
<Table.Data>Mark</Table.Data>
```

### Props
- `class` (string): Additional classes to apply to the data cell.
- `colorVariant` (string): Applies contextual color variant to the data cell.
- `isActive` (boolean): Applies active state styling to the data cell.
- `verticalAlign` ('top' | 'middle' | 'bottom'): Sets vertical alignment of the data cell content.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Table } from './index.js';
    import { initTableDataState, TableDataState } from './table.svelte.js';

    let { children, class: classValues, colorVariant, isActive = false, verticalAlign, ...restOfProps }: Table.DataProps = $props();

    const _dataState: TableDataState = initTableDataState({});

    let classes: string = $derived(
        uniqueClsx(
            {
                [`align-${verticalAlign}`]: !!verticalAlign,
                'table-active': isActive,
                [`table-${colorVariant}`]: !!colorVariant
            },
            classValues
        )
    );
</script>

<td class={classes} {...restOfProps}>
    {@render children?.()}
</td>

<!--
@component
## Table.Row
A component to render a Bootstrap table row.

@example
```svelte
<Table.Row isActive verticalAlign="middle" colorVariant="dark">
    <Table.Header>1</Table.Header>
    <Table.Data>Mark</Table.Data>
    <Table.Data>Otto</Table.Data>
    <Table.Data>@mdo</Table.Data>
</Table.Row>
```

### Props
- `colorVariant` (string): Applies contextual color variant to the row.
- `isActive` (boolean): Applies active state styling to the row.
- `verticalAlign` ('top' | 'middle' | 'bottom'): Sets vertical alignment of the row content.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Table } from './index.js';
    import { initTableRowState, TableRowState } from './table.svelte.js';

    let { children, class: classValues, colorVariant, isActive = false, verticalAlign, ...restOfProps }: Table.RowProps = $props();

    const _rowState: TableRowState = initTableRowState({});

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

<tr class={classes} {...restOfProps}>
    {@render children?.()}
</tr>

<!--
@component
## Table.Body
A component to render a Bootstrap table body.

@example
```svelte
<Table.Body hasGroupDivider>
    <Table.Row>
        <Table.Data>Mark</Table.Data>
        <Table.Data>Otto</Table.Data>
        <Table.Data>@mdo</Table.Data>
    </Table.Row>
</Table.Body>
```

### Props
- `class` (string): Additional classes to apply to the table body.
- `hasGroupDivider` (boolean): Applies a group divider style to the body.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Table } from './index.js';
    import { initTableBodyState, type TableBodyState } from './table.svelte.js';

    let { children, class: classValues, hasGroupDivider = false, ...restOfProps }: Table.BodyProps = $props();

    const _bodyState: TableBodyState = initTableBodyState({});

    let classes: string = $derived(uniqueClsx({ 'table-group-divider': hasGroupDivider }, classValues));
</script>

<tbody class={classes} {...restOfProps}>
    {@render children?.()}
</tbody>

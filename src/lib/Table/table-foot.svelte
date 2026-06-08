<!--
@component
## Table.Foot
A component to render a Bootstrap table foot.

@example
```svelte
<Table.Foot hasGroupDivider>
    <Table.Row>
        <Table.Data>Footer</Table.Data>
        <Table.Data>Footer</Table.Data>
        <Table.Data>Footer</Table.Data>
        <Table.Data>Footer</Table.Data>
    </Table.Row>
</Table.Foot>
```

### Props
- `hasGroupDivider` (boolean): Applies a group divider style to the foot.
- `class` (string): Additional classes to apply to the table foot.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Table } from './index.js';
    import { initTableFootState, TableFootState } from './table.svelte.js';

    let { children, class: classValues, hasGroupDivider = false, ...restOfProps }: Table.FootProps = $props();

    const _footState: TableFootState = initTableFootState({});

    let classes: string = $derived(uniqueClsx({ 'table-group-divider': hasGroupDivider }, classValues));
</script>

<tfoot class={classes} {...restOfProps}>
    {@render children?.()}
</tfoot>

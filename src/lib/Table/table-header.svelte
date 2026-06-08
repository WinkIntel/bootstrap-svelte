<!--
@component
## Table.Header
A component to render a Bootstrap table header cell.

@example
```svelte
<Table.Header scope="col">Name</Table.Header>
```

### Props
- `scope` (string): Defines the scope of the header cell. If not provided, it defaults to "col" when inside a `<thead>` and "row" when inside a `<tbody>`.
- `class` (string): Additional classes to apply to the header cell.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { HTMLThAttributes } from 'svelte/elements';
    import type { Table } from './index.js';
    import { doesTableBodyContextExists, doesTableHeadContextExists, initTableHeaderState, TableHeaderState } from './table.svelte.js';

    let { children, class: classValues, scope, ...restOfProps }: Table.HeaderProps = $props();

    const _headerState: TableHeaderState = initTableHeaderState({});
    const isInHeadContext: boolean = doesTableHeadContextExists();
    const isInBodyContext: boolean = doesTableBodyContextExists();

    let classes: string = $derived(uniqueClsx(classValues));
    let scopeValue: HTMLThAttributes['scope'] = $derived.by(() => {
        if (scope) {
            return scope;
        }
        if (isInHeadContext) {
            return 'col';
        }
        if (isInBodyContext) {
            return 'row';
        }
        return undefined;
    });
</script>

<th class={classes} scope={scopeValue} {...restOfProps}>
    {@render children?.()}
</th>

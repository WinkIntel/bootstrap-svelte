<!--
@component
## Table.Head
A component to render a Bootstrap table head.

@example
```svelte
<Table.Head colorScheme="dark">
    <Table.Row>
        <Table.Header>#</Table.Header>
        <Table.Header>First Name</Table.Header>
        <Table.Header>Last Name</Table.Header>
        <Table.Header>Username</Table.Header>
    </Table.Row>
</Table.Head>
```

### Props
- `colorScheme` (string): Applies a color scheme to the table head.
- `class` (string): Additional classes to apply to the table head.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Table } from './index.js';
    import { initTableHeadState, type TableHeadState } from './table.svelte.js';

    let { children, class: classValues, colorScheme, ...restOfProps }: Table.HeadProps = $props();

    const _headState: TableHeadState = initTableHeadState({});

    let classes: string = $derived(uniqueClsx({ [`table-${colorScheme}`]: !!colorScheme }, classValues));
</script>

<thead class={classes} {...restOfProps}>
    {@render children?.()}
</thead>

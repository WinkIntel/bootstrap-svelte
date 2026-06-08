<!--
@component
## Table
A component to render a Bootstrap table.

@example
```svelte
<Table.Root isBordered isStriped isHoverable>
    <Table.Head>
        <Table.Row>
            <Table.Header>#</Table.Header>
            <Table.Header>First Name</Table.Header>
            <Table.Header>Last Name</Table.Header>
            <Table.Header>Username</Table.Header>
        </Table.Row>
    </Table.Head>
    <Table.Body>
        <Table.Row>
            <Table.Header>1</Table.Header>
            <Table.Cell>Mark</Table.Cell>
            <Table.Cell>Otto</Table.Cell>
            <Table.Cell>@mdo</Table.Cell>
        </Table.Row>
    </Table.Body>
</Table.Root>
```
#### Responsive Table
```svelte
<Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'md' }}>
    ...
</Table.Root>
```
#### Caption Example
```svelte
<Table.Root isBordered isCaptionTop>
    <Table.Caption>List of users</Table.Caption>
    ...
</Table.Root>
```
#### Striped Columns Example
```svelte
<Table.Root isBordered isStripedColumns>
    ...
</Table.Root>
```
#### Vertical Alignment Example
```svelte
<Table.Root isBordered verticalAlign="middle">
    ...
</Table.Root>
```
#### Color Variants
```svelte
<Table.Root isBordered colorVariant="dark">
    ...
</Table.Root>
```
#### Border Color Variants
```svelte
<Table.Root isBordered borderColorVariant="border-primary">
    ...
</Table.Root>
```
#### Size Variants
```svelte
<Table.Root isBordered size="sm">
    ...
</Table.Root>
```
### Sub-components
- `Table.Caption`: Component to render a table caption.
- `Table.Head`: Component to render the table head section.
- `Table.Body`: Component to render the table body section.
- `Table.Row`: Component to render a table row.
- `Table.Header`: Component to render a table header cell.
- `Table.Data`: Component to render a table data cell.

### Props
- `borderColorVariant` (string): Optional. Border color variant class (e.g., 'border-primary').
- `colorVariant` (string): Optional. Color variant for the table (e.g., 'dark', 'light').
- `containerProps` (object): Optional. Props for the container div when `isContained` is true.
- `elementRef` (HTMLTableElement): Optional. Reference to the table element.
- `isBordered` (boolean): Optional. If true, adds borders to all table cells. Default is false.
- `isBorderless` (boolean): Optional. If true, removes borders from the table. Default is false.
- `isCaptionTop` (boolean): Optional. If true, places the caption at the top of the table. Default is false.
- `isContained` (boolean): Optional. If true, wraps the table in a container div. Default is false.
- `isHoverable` (boolean): Optional. If true, enables hover state on table rows. Default is false.
- `isResponsive` (boolean): Optional. If true, makes the table responsive. Default is false.
- `isStriped` (boolean): Optional. If true, adds zebra-striping to the table rows. Default is false.
- `isStripedColumns` (boolean): Optional. If true, adds zebra-striping to the table columns. Default is false.
- `responsiveProps` (object): Optional. Props for responsive behavior, including:
  - `breakpoint` (string): Breakpoint for responsive table. Options: 'sm', 'md', 'lg', 'xl', 'xxl'. Default is 'md'.
- `size` (string): Optional. Size variant for the table. Options: 'sm'. Default is undefined.
- `verticalAlign` (string): Optional. Vertical alignment for table cells. Options: 'top', 'middle', 'bottom'. Default is undefined.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Table } from './index.js';
    import { initTableRootState, TableRootState } from './table.svelte.js';

    let {
        borderColorVariant,
        children,
        class: classValues,
        containerProps = {},
        colorVariant,
        elementRef = $bindable(null),
        isBordered = false,
        isBorderless = false,
        isCaptionTop = false,
        isHoverable = false,
        isResponsive = false,
        isStriped = false,
        isStripedColumns = false,
        responsiveProps = {},
        size,
        tableContainerFooter,
        verticalAlign,
        ...restOfProps
    }: Table.RootProps = $props();

    let containerClassValues: Table.ContainerProps['class'] = $derived(containerProps.class);
    let restOfContainerProps: Omit<Table.ContainerProps, 'class'> = $derived.by(() => {
        const { class: _classValues, ...rest } = containerProps;
        return rest;
    });
    let breakpoint: Table.ResponsiveProps['breakpoint'] = $derived(responsiveProps.breakpoint);
    let responsiveClassValues: Table.ResponsiveProps['class'] = $derived(responsiveProps.class);
    let restOfResponsiveProps: Omit<Table.ResponsiveProps, 'class' | 'breakpoint'> = $derived.by(() => {
        const { breakpoint: _breakpoint, class: _classValues, ...rest } = responsiveProps;
        return rest;
    });

    const _rootState: TableRootState = initTableRootState({});

    let hasResponsiveBreakpoint: boolean = $derived(!!breakpoint && breakpoint !== 'xs');
    let classes: string = $derived(
        uniqueClsx(
            'table',
            {
                [`align-${verticalAlign}`]: !!verticalAlign,
                'caption-top': isCaptionTop,
                [`table-${colorVariant}`]: !!colorVariant,
                'table-bordered': isBordered && !isBorderless,
                [`${borderColorVariant}`]: !!borderColorVariant && isBordered,
                'table-borderless': isBorderless && !isBordered,
                'table-hover': isHoverable,
                [`table-${size}`]: !!size,
                'table-striped': isStriped,
                'table-striped-columns': isStripedColumns
            },
            classValues
        )
    );
    let containerClasses: string = $derived(uniqueClsx('table-container', containerClassValues));
    let responsiveClasses: string = $derived(
        uniqueClsx(
            {
                'table-responsive': isResponsive && !hasResponsiveBreakpoint,
                [`table-responsive-${breakpoint}`]: hasResponsiveBreakpoint
            },
            responsiveClassValues
        )
    );
</script>

{#snippet tableElement()}
    <table bind:this={elementRef} class={classes} {...restOfProps}>
        {@render children?.()}
    </table>
{/snippet}

{#snippet responsiveElement()}
    {#if isResponsive}
        <div class={responsiveClasses} {...restOfResponsiveProps}>
            {@render tableElement()}
        </div>
    {:else}
        {@render tableElement()}
    {/if}
    {@render tableContainerFooter?.()}
{/snippet}

{#snippet containerElement()}
    <div class={containerClasses} {...restOfContainerProps}>
        {@render responsiveElement()}
    </div>
{/snippet}

{@render containerElement()}

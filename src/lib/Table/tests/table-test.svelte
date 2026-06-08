<script lang="ts">
    import type { BaseColorVariant, BorderColorVariant, VerticalAlign } from '$lib/common/index.js';
    import { Table } from '$lib/index.js';
    import type { Snippet } from 'svelte';

    interface Props {
        ariaLabel?: string;
        bodyHasGroupDivider?: boolean;
        borderColorVariant?: BorderColorVariant;
        captionText?: string;
        cellColorVariant?: BaseColorVariant;
        cellIsActive?: boolean;
        cellVerticalAlign?: VerticalAlign;
        children?: Snippet;
        colorVariant?: BaseColorVariant;
        containerClass?: string;
        customStyle?: string;
        dataTestId?: string;
        footHasGroupDivider?: boolean;
        headColorScheme?: 'dark' | 'light';
        isBordered?: boolean;
        isBorderless?: boolean;
        isCaptionTop?: boolean;
        isEmpty?: boolean;
        isHoverable?: boolean;
        isResponsive?: boolean;
        isStriped?: boolean;
        isStripedColumns?: boolean;
        responsiveBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
        responsiveClass?: string;
        rowColorVariant?: BaseColorVariant;
        rowIsActive?: boolean;
        rowVerticalAlign?: VerticalAlign;
        showCaption?: boolean;
        showFoot?: boolean;
        size?: 'sm';
        tableClass?: string;
        tableContainerFooter?: Snippet;
        tableId?: string;
        verticalAlign?: VerticalAlign;
    }

    let {
        ariaLabel,
        bodyHasGroupDivider = false,
        borderColorVariant,
        captionText = 'List of users',
        cellColorVariant,
        cellIsActive = false,
        cellVerticalAlign,
        children,
        colorVariant,
        containerClass,
        customStyle,
        dataTestId,
        footHasGroupDivider = false,
        headColorScheme,
        isBordered = false,
        isBorderless = false,
        isCaptionTop = false,
        isEmpty = false,
        isHoverable = false,
        isResponsive = false,
        isStriped = false,
        isStripedColumns = false,
        responsiveBreakpoint,
        responsiveClass,
        rowColorVariant,
        rowIsActive = false,
        rowVerticalAlign,
        showCaption = false,
        showFoot = false,
        size,
        tableClass,
        tableContainerFooter,
        tableId,
        verticalAlign
    }: Props = $props();

    let tableRef: HTMLTableElement | null = $state(null);
    let responsiveProps = $derived(responsiveBreakpoint ? { breakpoint: responsiveBreakpoint, class: responsiveClass } : { class: responsiveClass });
    let containerProps = $derived(containerClass ? { class: containerClass } : {});

    // Export function to get table ref for testing
    export function getTableRef() {
        return tableRef;
    }
</script>

<Table.Root
    aria-label={ariaLabel}
    bind:elementRef={tableRef}
    {borderColorVariant}
    class={tableClass}
    {colorVariant}
    {containerProps}
    data-testid={dataTestId}
    id={tableId}
    {isBordered}
    {isBorderless}
    {isCaptionTop}
    {isHoverable}
    {isResponsive}
    {isStriped}
    {isStripedColumns}
    {responsiveProps}
    {size}
    style={customStyle}
    {tableContainerFooter}
    {verticalAlign}>
    {#if showCaption}
        <Table.Caption>{captionText}</Table.Caption>
    {/if}
    {#if !isEmpty}
        <Table.Head colorScheme={headColorScheme}>
            <Table.Row>
                <Table.Header>#</Table.Header>
                <Table.Header>First Name</Table.Header>
                <Table.Header>Last Name</Table.Header>
                <Table.Header>Username</Table.Header>
            </Table.Row>
        </Table.Head>
        <Table.Body hasGroupDivider={bodyHasGroupDivider}>
            <Table.Row colorVariant={rowColorVariant} isActive={rowIsActive} verticalAlign={rowVerticalAlign}>
                <Table.Header>1</Table.Header>
                <Table.Data>Mark</Table.Data>
                <Table.Data>Otto</Table.Data>
                <Table.Data>@mdo</Table.Data>
            </Table.Row>
            <Table.Row>
                <Table.Header>2</Table.Header>
                <Table.Data>Jacob</Table.Data>
                <Table.Data>Thornton</Table.Data>
                <Table.Data>@fat</Table.Data>
            </Table.Row>
            <Table.Row>
                <Table.Header>3</Table.Header>
                <Table.Data>Larry</Table.Data>
                <Table.Data>the Bird</Table.Data>
                <Table.Data colorVariant={cellColorVariant} isActive={cellIsActive} verticalAlign={cellVerticalAlign}>@twitter</Table.Data>
            </Table.Row>
        </Table.Body>
        {#if showFoot}
            <Table.Foot hasGroupDivider={footHasGroupDivider}>
                <Table.Row>
                    <Table.Header>Footer</Table.Header>
                    <Table.Data>Footer</Table.Data>
                    <Table.Data>Footer</Table.Data>
                    <Table.Data>Footer</Table.Data>
                </Table.Row>
            </Table.Foot>
        {/if}
    {/if}
    {#if children}
        {@render children()}
    {/if}
</Table.Root>

import type {
    BaseBreakpoint,
    BaseColorVariant,
    BorderColorVariant,
    CaptionElement,
    DivElement,
    TableBodyElement,
    TableDataElement,
    TableElement,
    TableFootElement,
    TableHeadElement,
    TableHeaderElement,
    TableRowElement,
    VerticalAlign
} from '$lib/common/index.js';
import type { Snippet } from 'svelte';

export type TableBodyProps = TableBodyElement & {
    hasGroupDivider?: boolean;
};

export type TableCaptionProps = CaptionElement;

export type TableContainerProps = DivElement;

export type TableDataProps = TableDataElement & {
    colorVariant?: BaseColorVariant;
    isActive?: boolean;
    verticalAlign?: VerticalAlign;
};

export type TableFootProps = TableFootElement & {
    hasGroupDivider?: boolean;
};

export type TableHeadProps = TableHeadElement & {
    colorScheme?: 'dark' | 'light';
};

export type TableHeaderProps = TableHeaderElement & {};

export type TableResponsiveProps = DivElement & {
    breakpoint?: BaseBreakpoint;
};

export type TableRootProps = TableElement & {
    borderColorVariant?: BorderColorVariant;
    colorVariant?: BaseColorVariant;
    containerProps?: TableContainerProps;
    isBordered?: boolean;
    isBorderless?: boolean;
    isCaptionTop?: boolean;
    isHoverable?: boolean;
    isResponsive?: boolean;
    isStriped?: boolean;
    isStripedColumns?: boolean;
    responsiveProps?: TableResponsiveProps;
    size?: 'sm';
    tableContainerFooter?: Snippet;
    verticalAlign?: VerticalAlign;
};

export type TableRowProps = TableRowElement & {
    colorVariant?: BaseColorVariant;
    isActive?: boolean;
    verticalAlign?: VerticalAlign;
};

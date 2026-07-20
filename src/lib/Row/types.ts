import type { DivElement, OneToSix } from '$lib/common/types.js';

export type RowColsValue = OneToSix | 'auto';

export type RowColsMap = {
    xs?: RowColsValue;
    sm?: RowColsValue;
    md?: RowColsValue;
    lg?: RowColsValue;
    xl?: RowColsValue;
    xxl?: RowColsValue;
};

export type RowRootProps = DivElement & {
    cols?: RowColsMap | RowColsValue;
};

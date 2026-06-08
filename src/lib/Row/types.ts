import type { DivElement, OneToSix } from '$lib/common/types.js';

export type RowColsMap = {
    xs?: OneToSix;
    sm?: OneToSix;
    md?: OneToSix;
    lg?: OneToSix;
    xl?: OneToSix;
    xxl?: OneToSix;
};

export type RowRootProps = DivElement & {
    cols?: RowColsMap | OneToSix | 'auto';
};

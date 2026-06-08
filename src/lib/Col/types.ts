import type { AutoOrAsterisk, DivElement, FirstOrLast, OneToTwelve, ZeroToEleven, ZeroToFive } from '$lib/common/types.js';

export type ColSizingMap = {
    xs?: OneToTwelve | AutoOrAsterisk;
    sm?: OneToTwelve | AutoOrAsterisk;
    md?: OneToTwelve | AutoOrAsterisk;
    lg?: OneToTwelve | AutoOrAsterisk;
    xl?: OneToTwelve | AutoOrAsterisk;
    xxl?: OneToTwelve | AutoOrAsterisk;
};

export type ColOffsetMap = {
    xs?: ZeroToEleven;
    sm?: ZeroToEleven;
    md?: ZeroToEleven;
    lg?: ZeroToEleven;
    xl?: ZeroToEleven;
    xxl?: ZeroToEleven;
};

export type ColOrderMap = {
    xs?: ZeroToFive | FirstOrLast;
    sm?: ZeroToFive | FirstOrLast;
    md?: ZeroToFive | FirstOrLast;
    lg?: ZeroToFive | FirstOrLast;
    xl?: ZeroToFive | FirstOrLast;
    xxl?: ZeroToFive | FirstOrLast;
};

export type ColRootProps = DivElement & {
    sizing?: ColSizingMap | OneToTwelve | 'auto';
    offset?: ColOffsetMap | ZeroToEleven;
    order?: ColOrderMap | ZeroToFive | FirstOrLast;
};

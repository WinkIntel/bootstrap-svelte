import type { Snippet } from 'svelte';

export type BreakEvent = {
    from: BreakpointEnum | null;
    to: BreakpointEnum;
};

/**
 * Enum for breakpoints using numbers to facilitate comparisons.
 */
export enum BreakpointEnum {
    XS = 0,
    SM = 1,
    MD = 2,
    LG = 3,
    XL = 4,
    XXL = 5
}

export type BreakpointListenerRootProps = {
    children?: Snippet;
    currentBreakpoint?: BreakpointEnum;
    isDisabled?: boolean;
    onChange?: (changeEvent: ChangeEvent) => void;
    onBreakUp?: (breakEvent: BreakEvent) => void;
    onBreakDown?: (breakEvent: BreakEvent) => void;
    renderOn?: BreakpointEnum | BreakpointEnum[];
};

export type ChangeEvent = {
    current: BreakpointEnum;
    previous: BreakpointEnum | null;
};

export const MediaQueryStringsByBreakpointEnum: Record<BreakpointEnum, string> = {
    [BreakpointEnum.XS]: '(max-width: 575.98px)',
    [BreakpointEnum.SM]: '(min-width: 576px) and (max-width: 767.98px)',
    [BreakpointEnum.MD]: '(min-width: 768px) and (max-width: 991.98px)',
    [BreakpointEnum.LG]: '(min-width: 992px) and (max-width: 1199.98px)',
    [BreakpointEnum.XL]: '(min-width: 1200px) and (max-width: 1399.98px)',
    [BreakpointEnum.XXL]: '(min-width: 1400px)'
};

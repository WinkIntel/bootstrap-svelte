import type { DivElement, HeadingElement, HeadingLevels, PopperPlacement } from '$lib/common/types.js';

export type PopoverContainer = string | HTMLElement | false;
export type PopoverPlacement = PopperPlacement;
export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual';

export type PopoverRootProps = DivElement & {
    container?: PopoverContainer;
    isShown?: boolean;
    onHide?: EventListener;
    onHidden?: EventListener;
    onShow?: EventListener;
    onShown?: EventListener;
    placement?: PopoverPlacement;
    referenceElementId?: string;
    trigger?: PopoverTrigger | string; // allow for space-separated values
    useFade?: boolean;
};

export type PopoverHeaderProps = HeadingElement & {
    level?: HeadingLevels;
};

export type PopoverBodyProps = DivElement;

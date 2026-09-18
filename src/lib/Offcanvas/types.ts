import type { BaseBreakpoint, DivElement, HeadingElement, HeadingLevels, TextDirection } from '$lib/common/types.js';

export type OffcanvasBackdrop = 'static' | boolean;
/** Bootstrap responsive Offcanvas sizes. xs has no corresponding Bootstrap class. */
export type OffcanvasBreakpoint = Exclude<BaseBreakpoint, 'xs'>;
export type OffcanvasPlacement = 'start' | 'end' | 'top' | 'bottom';

export type OffcanvasRootProps = DivElement & {
    dir?: TextDirection;
    isBodyScrollable?: boolean;
    isKeyboardDismissible?: boolean;
    isShown?: boolean;
    onHide?: EventListener;
    onHidePrevented?: EventListener;
    onHidden?: EventListener;
    onShow?: EventListener;
    onShown?: EventListener;
    placement?: OffcanvasPlacement;
    /** Inline at or above this breakpoint; omitted inherits Navbar mode when nested. Runtime xs is treated as omitted. */
    showOnBreakpoint?: OffcanvasBreakpoint;
    useBackdrop?: OffcanvasBackdrop;
};

export type OffcanvasHeaderProps = DivElement & {
    isDismissible?: boolean;
};

export type OffcanvasTitleProps = HeadingElement & {
    level?: HeadingLevels;
};

export type OffcanvasBodyProps = DivElement;

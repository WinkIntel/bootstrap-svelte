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
    /**
     * Elements whose click handlers control this panel. Enabled primary presses are not outside dismissals.
     * Bind DOM references with bind:this (or bind:elementRef on Button); null/undefined and detached nodes are ignored.
     * Remove a reference to revoke ownership. No listeners or registrations outlive this prop or component.
     * This does not install click handlers, manage ARIA, or change trigger stacking above the backdrop.
     */
    triggerElements?: readonly (HTMLElement | null | undefined)[];
    useBackdrop?: OffcanvasBackdrop;
};

export type OffcanvasHeaderProps = DivElement & {
    isDismissible?: boolean;
};

export type OffcanvasTitleProps = HeadingElement & {
    level?: HeadingLevels;
};

export type OffcanvasBodyProps = DivElement;

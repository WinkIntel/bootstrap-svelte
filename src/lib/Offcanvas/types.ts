import type { BaseBreakpoint, DivElement, HeadingElement, HeadingLevels, TextDirection } from '$lib/common/types.js';

export type OffcanvasBackdrop = 'static' | boolean;
export type OffcanvasBreakpoint = BaseBreakpoint;
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
    showOnBreakpoint?: OffcanvasBreakpoint;
    /**
     * Elements whose click handlers control this panel. Enabled primary presses are not outside dismissals.
     * Bind HTML or SVG references with bind:this (or bind:elementRef on Button).
     * A null list means no triggers; null/undefined entries and detached nodes are ignored.
     * Remove a reference to revoke ownership. No listeners or registrations outlive this prop or component.
     * This does not install click handlers, manage ARIA, or change trigger stacking above the backdrop.
     */
    triggerElements?: readonly (Element | null | undefined)[] | null;
    useBackdrop?: OffcanvasBackdrop;
};

export type OffcanvasHeaderProps = DivElement & {
    isDismissible?: boolean;
};

export type OffcanvasTitleProps = HeadingElement & {
    level?: HeadingLevels;
};

export type OffcanvasBodyProps = DivElement;

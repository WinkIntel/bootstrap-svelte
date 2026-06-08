import type { BaseBreakpoint, DivElement, HeadingElement, HeadingLevels } from '$lib/common/types.js';

export type ModalBackdrop = 'static' | boolean;
export type ModalFullscreenBreakpoint = BaseBreakpoint | 'always';
export type ModalSize = 'sm' | 'lg' | 'xl';

export type ModalRootProps = DivElement & {
    isFocusable?: boolean;
    isKeyboardDismissible?: boolean;
    isShown?: boolean;
    onHide?: EventListener;
    onHidePrevented?: EventListener;
    onHidden?: EventListener;
    onShow?: EventListener;
    onShown?: EventListener;
    useBackdrop?: ModalBackdrop;
    useFade?: boolean;
};

export type ModalDialogProps = DivElement & {
    fullscreenOnBreakpoint?: ModalFullscreenBreakpoint;
    isScrollable?: boolean;
    isVerticallyCentered?: boolean;
    size?: ModalSize;
};

export type ModalContentProps = DivElement;

export type ModalHeaderProps = DivElement & {
    isDismissible?: boolean;
};

export type ModalTitleProps = HeadingElement & {
    level?: HeadingLevels;
};

export type ModalBodyProps = DivElement;

export type ModalFooterProps = DivElement;

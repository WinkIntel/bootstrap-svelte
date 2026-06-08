import type { BaseColorVariant, DivElement } from '$lib/common/types.js';

export type AlertColorVariant = BaseColorVariant;

export type AlertDismissEvent = CustomEvent<void>;

export type AlertRootProps = DivElement & {
    colorVariant?: AlertColorVariant;
    isDismissible?: boolean;
    isAnimated?: boolean;
    isOpen?: boolean;
    onClose?: EventListener;
    onClosed?: EventListener;
};

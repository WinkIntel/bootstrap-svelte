import type { ButtonElement, DivElement } from '$lib/common/types.js';

export type TabRootProps = DivElement;

export type TabContentProps = DivElement;

export type TabNavLinkProps = ButtonElement & {
    isActive?: boolean;
    isDisabled?: boolean;
    onclick?: EventListener;
    targetPaneId?: string;
};

export type TabPaneProps = DivElement & {
    doFade?: boolean;
    id?: string;
    isActive?: boolean;
    onHide?: EventListener;
    onHidden?: EventListener;
    onShow?: EventListener;
    onShown?: EventListener;
};

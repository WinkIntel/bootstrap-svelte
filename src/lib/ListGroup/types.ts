import type { AnchorElement, BaseBreakpoint, BaseColorVariant, ListElement, ListItemElement } from '$lib/common/types.js';
import type { HTMLAnchorAttributes } from 'svelte/elements';

export type ListGroupItemColorVariant = BaseColorVariant;
export type ListGroupHorizontalBreakpoint = BaseBreakpoint;

export type ListGroupRootProps = ListElement & {
    horizontalOnBreakpoint?: ListGroupHorizontalBreakpoint;
    isFlush?: boolean;
    isNumbered?: boolean;
};

export type ListGroupItemProps = ListItemElement & {
    colorVariant?: ListGroupItemColorVariant;
    isActive?: boolean;
};

export type ListGroupItemActionProps = AnchorElement & {
    colorVariant?: ListGroupItemColorVariant;
    href?: HTMLAnchorAttributes['href'];
    isActive?: boolean;
    isDisabled?: boolean;
    onclick?: EventListener;
};

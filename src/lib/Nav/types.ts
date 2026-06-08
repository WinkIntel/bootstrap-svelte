import type { AnchorElement, BaseBreakpoint, ListItemElement, UListElement } from '$lib/common/types.js';

// Nav
export type NavElementType = 'nav' | 'ol' | 'ul';
export type NavHorizontalAlignment = 'start' | 'center' | 'end';
export type NavOrientationType = 'horizontal' | 'vertical';
export type NavRole = 'navigation' | 'tablist';
export type NavVerticalBreakpoint = BaseBreakpoint;

// NavItem
export type NavItemLayout = 'fill' | 'justified';
export type NavItemStyle = 'pills' | 'tabs' | 'underline';

// NavLink
export type NavLinkRole = 'button' | 'tab';

export type NavRootProps = UListElement & {
    ariaOrientation?: NavOrientationType;
    elementType?: NavElementType;
    horizontalAlignment?: NavHorizontalAlignment;
    itemLayout?: NavItemLayout;
    itemStyle?: NavItemStyle;
    role?: NavRole | null;
    verticalBreakpoint?: NavVerticalBreakpoint;
};

export type NavItemProps = ListItemElement & {};

export type NavLinkProps = AnchorElement & {
    href?: HTMLAnchorElement['href'];
    isActive?: boolean;
    isDisabled?: boolean;
    onclick?: EventListener;
    role?: NavLinkRole;
};

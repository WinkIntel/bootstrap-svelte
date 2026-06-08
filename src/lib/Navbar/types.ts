import type { CollapseRootProps } from '$lib/Collapse/types.js';
import type {
    AnchorElement,
    BaseBreakpoint,
    BaseColorVariant,
    ButtonElement,
    DivElement,
    NavElement,
    SpanElement,
    UListElement
} from '$lib/common/types.js';

export type NavbarColorVariant = BaseColorVariant;
export type NavbarExpandBreakpoint = BaseBreakpoint;
export type NavbarPlacement = 'fixed-top' | 'fixed-bottom' | 'sticky-top' | 'sticky-bottom';

export type NavbarRootProps = NavElement & {
    colorVariant?: NavbarColorVariant;
    expandOnBreakpoint?: NavbarExpandBreakpoint;
    placement?: NavbarPlacement;
};
export type NavbarBrandProps = AnchorElement & {
    href?: HTMLAnchorElement['href'];
};
export type NavbarCollapseProps = Omit<CollapseRootProps, 'isExpanded' | 'isHorizontal'>;
export type NavbarNavProps = UListElement & {
    isVerticalScrolling?: boolean;
};
export type NavbarTextProps = DivElement;
export type NavbarTogglerIconProps = SpanElement;
export type NavbarTogglerProps = ButtonElement & {
    ariaLabel?: string;
    type?: HTMLButtonElement['type'];
};

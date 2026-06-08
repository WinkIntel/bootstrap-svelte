import type { ButtonRootProps } from '$lib/Button/index.js';
import type {
    AnchorElement,
    DivElement,
    HeadingElement,
    HeadingLevels,
    ListItemElement,
    PopperOffset,
    SpanElement,
    UListElement
} from '$lib/common/types.js';
import type { HTMLAnchorAttributes } from 'svelte/elements';

export type DropdownAutoClose = boolean | 'inside' | 'outside';
export type DropdownDisplay = 'dynamic' | 'static';
export type DropdownDirection = 'dropdown' | 'dropdown-center' | 'dropdown-end' | 'dropup' | 'dropup-center' | 'dropup-end' | 'dropend' | 'dropstart';
export type DropdownMenuContainer = string | HTMLElement | false;

export type DropdownRootProps = DivElement & {
    autoClose?: DropdownAutoClose;
    direction?: DropdownDirection;
    display?: DropdownDisplay;
    isButtonGroup?: boolean;
    onHide?: EventListener;
    onHidden?: EventListener;
    onShow?: EventListener;
    onShown?: EventListener;
};

export type DropdownToggleProps = ButtonRootProps & {
    isSplit?: boolean;
    onclick?: EventListener;
    onkeydown?: EventListener;
};

export type DropdownMenuProps = UListElement & {
    container?: DropdownMenuContainer;
    isDark?: boolean;
    isEnd?: boolean;
    offset?: PopperOffset;
};

export type DropdownItemProps = AnchorElement & {
    href?: HTMLAnchorAttributes['href'];
    isActive?: boolean;
    isDisabled?: boolean;
    listItemProps?: ListItemElement;
    onclick?: EventListener;
    onfocus?: EventListener;
    onkeydown?: EventListener;
};

export type DropdownHeaderProps = HeadingElement & {
    level?: HeadingLevels;
    listItemProps?: ListItemElement;
};

export type DropdownDividerProps = DivElement & {
    listItemProps?: ListItemElement;
};

export type DropdownTextProps = SpanElement & {
    listItemProps?: ListItemElement;
};

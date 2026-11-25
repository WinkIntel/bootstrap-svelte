import type { AnchorElement, ListItemElement, OListElement } from '$lib/common/types.js';

export type BreadcrumbRootProps = OListElement & {
    ariaLabel?: string;
    divider?: string;
};

export type BreadcrumbItemProps = ListItemElement & {
    isActive?: boolean;
    href?: string;
    /** Attributes and handlers for the anchor, ignored when active. The top-level href always wins. */
    anchorProps?: Omit<AnchorElement, 'href'>;
};

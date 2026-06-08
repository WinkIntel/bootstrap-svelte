import type { ListItemElement, OListElement } from '$lib/common/types.js';

export type BreadcrumbRootProps = OListElement & {
    ariaLabel?: string;
    divider?: string;
};

export type BreadcrumbItemProps = ListItemElement & {
    isActive?: boolean;
    href?: string;
};

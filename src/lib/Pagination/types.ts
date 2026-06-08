import type { AnchorElement, ListItemElement, UListElement } from '$lib/common/types.js';

export type PaginationAlignment = 'start' | 'center' | 'end';
export type PaginationSize = 'sm' | 'lg';

export type PaginationRootProps = UListElement & {
    alignment?: PaginationAlignment;
    'aria-label'?: string;
    isStateful?: boolean;
    size?: PaginationSize;
};

export type PaginationItemProps = ListItemElement & {
    isActive?: boolean;
    isDisabled?: boolean;
};

export type PaginationLinkProps = AnchorElement & {
    'aria-label'?: string;
    href?: HTMLAnchorElement['href'];
    isDisabled?: boolean;
    onclick?: EventListener;
};

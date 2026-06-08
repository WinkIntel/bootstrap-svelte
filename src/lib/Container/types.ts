import type { BaseBreakpoint, DivElement } from '$lib/common/types.js';

export type ContainerBreakpoint = BaseBreakpoint;
export type ContainerElementType = 'article' | 'aside' | 'div' | 'footer' | 'header' | 'main' | 'section';

export type ContainerRootProps = DivElement & {
    breakpoint?: ContainerBreakpoint;
    elementType?: ContainerElementType;
    isFluid?: boolean;
};

import type { DivElement } from '$lib/common/types.js';

export type CollapseTransitionStylePropName = 'width' | 'height';

export type CollapseTransitionParams = {
    isHorizontal?: boolean;
};

export type CollapseRootProps = DivElement & {
    isHorizontal?: boolean;
    isExpanded?: boolean;
    onCollapse?: EventListener;
    onCollapsed?: EventListener;
    onExpand?: EventListener;
    onExpanded?: EventListener;
    transitionDuration?: number;
};

export type CollapseAriaOptions = {
    ariaControls: string;
    ariaExpanded: boolean;
};

import type { BaseColorVariant, DivElement, SpanElement } from '$lib/common/types.js';

export type PlaceholderAnimationType = 'glow' | 'wave';
export type PlaceholderItemColorVariant = BaseColorVariant;
export type PlaceholderItemSize = 'xs' | 'sm' | 'lg';

export type PlaceholderRootProps = DivElement & {
    type?: PlaceholderAnimationType;
};

export type PlaceholderItemProps = SpanElement & {
    colorVariant?: PlaceholderItemColorVariant;
    isAnimated?: boolean;
    size?: PlaceholderItemSize;
};

import type { BaseColorVariant, DivElement } from '$lib/common/types.js';

export type SpinnerColorVariant = BaseColorVariant;
export type SpinnerType = 'border' | 'grow';
export type SpinnerSize = 'sm' | '';

export type SpinnerRootProps = DivElement & {
    colorVariant?: SpinnerColorVariant;
    size?: SpinnerSize;
    type?: SpinnerType;
};

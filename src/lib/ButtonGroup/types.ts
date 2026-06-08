import type { DivElement } from '$lib/common/types.js';
import type { ButtonColorVariant } from '../Button/types.js';
import type { HTMLInputAttributes } from 'svelte/elements';

export type ButtonGroupSize = 'sm' | 'lg' | '';
export type ButtonCheckType = 'checkbox' | 'radio';

export type ButtonCheckRootProps = Omit<HTMLInputAttributes, 'class' | 'size' | 'type'> & {
    class?: string;
    colorVariant?: ButtonColorVariant;
    elementRef?: HTMLInputElement | null;
    labelClass?: string;
    labelElementRef?: HTMLLabelElement | null;
    type?: ButtonCheckType;
};

export type ButtonGroupRootProps = DivElement & {
    ariaLabel?: string;
    isVertical?: boolean;
    size?: ButtonGroupSize;
};

export type ButtonToolbarRootProps = DivElement & {
    ariaLabel?: string;
};

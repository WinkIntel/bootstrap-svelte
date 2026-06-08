import type { BaseColorVariant, WithElementRef } from '$lib/common/types.js';
import type { HTMLAnchorAttributes, HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';

export type ButtonAsAnchorElement = WithElementRef<Omit<HTMLAnchorAttributes, 'href' | 'type' | 'value'>> & {
    disabled?: HTMLButtonAttributes['disabled'];
    href: HTMLAnchorAttributes['href'];
    type?: never;
    value?: never;
};
export type ButtonAsButtonElement = WithElementRef<Omit<HTMLButtonAttributes, 'href' | 'type' | 'value'>> & {
    disabled?: HTMLButtonAttributes['disabled'];
    type?: HTMLButtonAttributes['type'];
    href?: never;
    value?: never;
};
export type ButtonAsInputElement = WithElementRef<Omit<HTMLInputAttributes, 'href' | 'size' | 'type' | 'value'>> & {
    disabled?: HTMLInputAttributes['disabled'];
    type?: HTMLInputAttributes['type'];
    href?: never;
    value?: string;
};
export type ButtonRootProps = (ButtonAsAnchorElement | ButtonAsButtonElement | ButtonAsInputElement) & {
    colorVariant?: ButtonColorVariant;
    size?: ButtonSize;
};

export type ButtonColorVariant =
    | BaseColorVariant
    | 'link'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-light'
    | 'outline-dark';

export type ButtonSize = 'sm' | 'lg' | '';

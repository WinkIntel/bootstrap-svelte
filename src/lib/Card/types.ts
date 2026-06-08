import type { AnchorElement, DivElement, HeadingElement, HeadingLevels, ImgElement } from '$lib/common/types.js';

export type CardRootProps = DivElement;

export type CardGroupProps = DivElement;

export type CardHeaderProps = DivElement;

export type CardBodyProps = DivElement;

export type CardFooterProps = DivElement;

export type CardImgOverlayProps = DivElement;

export type CardImgProps = ImgElement & {
    alt?: string;
    src?: string;
    position?: 'top' | 'bottom';
};

export type CardTitleProps = HeadingElement & {
    level?: HeadingLevels;
};

export type CardSubtitleProps = HeadingElement & {
    level?: HeadingLevels;
};

export type CardTextProps = DivElement;

export type CardLinkProps = AnchorElement & {
    href?: string;
};

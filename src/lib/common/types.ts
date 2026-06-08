import type {
    HTMLAnchorAttributes,
    HTMLAttributes,
    HTMLButtonAttributes,
    HTMLFormAttributes,
    HTMLImgAttributes,
    HTMLInputAttributes,
    HTMLLabelAttributes,
    HTMLLiAttributes,
    HTMLSelectAttributes,
    HTMLTableAttributes,
    HTMLTdAttributes,
    HTMLTextareaAttributes,
    HTMLThAttributes
} from 'svelte/elements';

/**
 * Represents the background color variants available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/utilities/background/#background-color
 */
export type BackgroundColorVariant =
    | 'bg-primary'
    | 'bg-secondary'
    | 'bg-success'
    | 'bg-danger'
    | 'bg-warning'
    | 'bg-info'
    | 'bg-light'
    | 'bg-dark'
    | 'bg-body'
    | 'bg-body-secondary'
    | 'bg-body-tertiary'
    | 'bg-white'
    | 'bg-black'
    | 'bg-transparent';

/**
 * Represents the subtle background color variants available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/utilities/background/#background-color
 */
export type BackgroundSubtleColorVariant =
    | 'bg-primary-subtle'
    | 'bg-secondary-subtle'
    | 'bg-success-subtle'
    | 'bg-danger-subtle'
    | 'bg-warning-subtle'
    | 'bg-info-subtle'
    | 'bg-light-subtle'
    | 'bg-dark-subtle';

/**
 * Represents the theme colors available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/customize/color/
 */
export type BaseColorVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

/**
 * Represents the breakpoints available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/layout/breakpoints/
 */
export type BaseBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Represents the border color variants available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/utilities/borders/#border-color
 */
export type BorderColorVariant =
    | 'border-primary'
    | 'border-primary-subtle'
    | 'border-secondary'
    | 'border-secondary-subtle'
    | 'border-success'
    | 'border-success-subtle'
    | 'border-danger'
    | 'border-danger-subtle'
    | 'border-warning'
    | 'border-warning-subtle'
    | 'border-info'
    | 'border-info-subtle'
    | 'border-light'
    | 'border-light-subtle'
    | 'border-dark'
    | 'border-dark-subtle'
    | 'border-white'
    | 'border-black';

/**
 * Represents the media queries available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/layout/breakpoints/
 * The reason for using *.98px is to ensure that the media query is inclusive of the breakpoint.
 * See https://stackoverflow.com/a/54596322/22025584
 */
export const BreakpointBoxedMediaQuery: { [index: string]: string } = {
    xs: '(max-width: 575.98px)',
    sm: '(min-width: 576px) and (max-width: 767.98px)',
    md: '(min-width: 768px) and (max-width: 991.98px)',
    lg: '(min-width: 992px) and (max-width: 1199.98px)',
    xl: '(min-width: 1200px) and (max-width: 1399.98px)',
    xxl: '(min-width: 1400px)'
};

/**
 * Represents the media queries available in Bootstrap 5.
 * Only the maximum media queries are used.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/layout/breakpoints/
 */
export const BreakpointMaximumMediaQuery: { [index: string]: string } = {
    xs: '(max-width: 575.98px)',
    sm: '(max-width: 576px)',
    md: '(max-width: 768px)',
    lg: '(max-width: 992px)',
    xl: '(max-width: 1200px)',
    xxl: '(max-width: 1400px)'
};

/**
 * Represents the media queries available in Bootstrap 5.
 * Only the minimum media queries are used.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/layout/breakpoints/
 */
export const BreakpointMinimumMediaQuery: { [index: string]: string } = {
    xs: '(max-width: 575.98px)',
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 992px)',
    xl: '(min-width: 1200px)',
    xxl: '(min-width: 1400px)'
};

/**
 * Represents the row-col options for bootstrap grid system.
 * Values should be numbers between 1 and 6.
 */
export type OneToSix = 1 | 2 | 3 | 4 | 5 | 6;
export type ZeroToFive = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Represents the sizing options for bootstrap grid system.
 * Values should be numbers between 1 and 12.
 */
export type OneToTwelve = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type ZeroToEleven = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * Represents the options for auto or asterisk in Bootstrap.
 */
export type AutoOrAsterisk = 'auto' | '*';
export type FirstOrLast = 'first' | 'last';

/**
 * Represents the form control sizing options available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/forms/form-control/#sizing
 */
export type FormControlSize = 'sm' | 'lg';

/**
 * Represents the input group sizing options available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/forms/input-group/#sizing
 */
export type FormInputGroupSize = 'sm' | 'lg';

/**
 * Represents the levels of headings available in HTML's h1 to h6.
 * See HTML documentation: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements
 */
export type HeadingLevels = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Represents the placement options available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/components/popovers/#four-directions
 */
export type PopperPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right';

/**
 * Represents the offset options available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/components/popovers/#offsets
 * See Popper.js documentation: https://popper.js.org/docs/v2/modifiers/offset/#options
 * The basic offset accepts an array with two numbers in the form [skidding, distance].
 */
export type PopperOffset = [number, number];

/**
 * Represents the background color variants available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/helpers/color-background/#overview
 */
export type TextBackgroundColorVariant =
    | 'text-bg-primary'
    | 'text-bg-secondary'
    | 'text-bg-success'
    | 'text-bg-danger'
    | 'text-bg-warning'
    | 'text-bg-info'
    | 'text-bg-light'
    | 'text-bg-dark';

export type TextColorVariant =
    | 'text-primary'
    | 'text-secondary'
    | 'text-success'
    | 'text-danger'
    | 'text-warning'
    | 'text-info'
    | 'text-light'
    | 'text-dark'
    | 'text-black'
    | 'text-white'
    | 'text-body'
    | 'text-body-secondary'
    | 'text-body-tertiary'
    | 'text-muted';

export type TextDirection = 'ltr' | 'rtl';

export type TextEmphasisColorVariant =
    | 'text-primary-emphasis'
    | 'text-secondary-emphasis'
    | 'text-success-emphasis'
    | 'text-danger-emphasis'
    | 'text-warning-emphasis'
    | 'text-info-emphasis'
    | 'text-light-emphasis'
    | 'text-dark-emphasis';

export type TextDecoration = 'underline' | 'line-through' | 'none';

/**
 * Represents the text decoration options available in Bootstrap 5.
 * See Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/utilities/vertical-align/
 */
export type VerticalAlign = 'baseline' | 'top' | 'middle' | 'bottom' | 'text-top' | 'text-bottom';

/**
 * The `WithElementRef` type is a utility type that extends a given type `T` with an optional `ref` property.
 */
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { elementRef?: U | null };

/**
 * Represents the HTML elements that can be used in Bootstrap components.
 * These elements are typically used as props in Svelte components to specify the type of element to render.
 */
export type AnchorElement = WithElementRef<HTMLAnchorAttributes>;
export type ButtonElement = WithElementRef<HTMLButtonAttributes>;
export type CaptionElement = WithElementRef<HTMLAttributes<HTMLElement>>;
export type DivElement = WithElementRef<HTMLAttributes<HTMLDivElement>>;
export type FormElement = WithElementRef<HTMLFormAttributes>;
export type HeadingElement = WithElementRef<HTMLAttributes<HTMLHeadingElement>>;
export type ImgElement = WithElementRef<HTMLImgAttributes>;
export type InputElement = WithElementRef<HTMLInputAttributes>;
export type LabelElement = WithElementRef<HTMLLabelAttributes>;
export type ListElement = OListElement | UListElement;
export type ListItemElement = WithElementRef<HTMLLiAttributes>;
export type NavElement = WithElementRef<HTMLAttributes<HTMLElement>>; // This is a generic type for navigation elements
export type OListElement = WithElementRef<HTMLAttributes<HTMLOListElement>>;
export type SelectElement = WithElementRef<HTMLSelectAttributes>;
export type SpanElement = WithElementRef<HTMLAttributes<HTMLSpanElement>>;
export type TableDataElement = WithElementRef<HTMLTdAttributes>;
export type TableElement = WithElementRef<HTMLTableAttributes>;
export type TableFootElement = WithElementRef<HTMLAttributes<HTMLTableSectionElement>>;
export type TableHeadElement = WithElementRef<HTMLAttributes<HTMLTableSectionElement>>;
export type TableHeaderElement = WithElementRef<HTMLThAttributes>;
export type TableBodyElement = WithElementRef<HTMLAttributes<HTMLTableSectionElement>>;
export type TableRowElement = WithElementRef<HTMLAttributes<HTMLTableRowElement>>;
export type TextAreaElement = WithElementRef<HTMLTextareaAttributes>;
export type UListElement = WithElementRef<HTMLAttributes<HTMLUListElement>>;

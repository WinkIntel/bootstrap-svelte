import type { CollapseRootProps } from '$lib/Collapse/types.js';
import type { ButtonElement, DivElement, HeadingElement } from '$lib/common/types.js';

// Prop types for Accordion components
export type AccordionRootProps = DivElement & {
    isMultiple?: boolean; // Allows multiple items to be open at the same time
    isFlush?: boolean; // Removes borders between accordion items
};

export type AccordionBodyProps = DivElement & {};

export type AccordionButtonProps = ButtonElement & {
    type?: HTMLButtonElement['type'];
};

export type AccordionCollapseProps = CollapseRootProps & {};

export type AccordionHeaderProps = HeadingElement & {};

export type AccordionItemProps = DivElement & {
    isExpanded?: boolean; // Indicates if the item is currently visible
};

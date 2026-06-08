import { Context } from '$lib/common/index.js';
import { SvelteSet } from 'svelte/reactivity';
import type { Accordion } from './index.js';

/**
 * Manages the state for the Accordion root component.
 * Handles the tracking of expanded accordion items and provides methods to toggle them.
 * Supports both single and multiple expanded items based on the `isMultiple` prop.
 */
export class AccordionRootState {
    #expandedItemIds: SvelteSet<string>;
    isMultiple = $derived.by(() => this.props.isMultiple);

    constructor(readonly props: Accordion.RootProps) {
        this.#expandedItemIds = new SvelteSet<string>();
        this.isItemExpanded = this.isItemExpanded.bind(this);
        this.toggleItem = this.toggleItem.bind(this);
    }

    isItemExpanded(itemId: string) {
        return this.#expandedItemIds.has(itemId);
    }

    toggleItem(itemId: string) {
        if (this.isItemExpanded(itemId)) {
            this.#expandedItemIds.delete(itemId);
        } else {
            if (!this.isMultiple) {
                this.#expandedItemIds.clear();
            }
            this.#expandedItemIds.add(itemId);
        }
    }
}

/**
 * Manages the state for an individual Accordion item.
 * Tracks expansion state and provides methods to toggle the item.
 * Initializes its expanded state based on the `isExpanded` prop.
 * Maintains the relationship between the item and its ARIA controls.
 */
export class AccordionItemState {
    ariaControls: string | undefined = $state(undefined);
    isExpanded = $derived.by(() => this.root.isItemExpanded(this.props.id || ''));

    constructor(
        readonly props: Accordion.ItemProps,
        readonly root: AccordionRootState
    ) {
        this.toggle = this.toggle.bind(this);
        if (this.props.isExpanded) {
            this.root.toggleItem(this.props.id || '');
        }
    }

    toggle() {
        this.root.toggleItem(this.props.id || '');
    }
}

/**
 * Manages the state for an Accordion button component.
 * Provides interaction logic for the clickable header that toggles the accordion item.
 * Derives its expanded state from the parent accordion item state.
 */
export class AccordionButtonState {
    isExpanded = $derived.by(() => this.root.isItemExpanded(this.item.props.id || ''));

    constructor(
        readonly props: Accordion.ButtonProps,
        readonly root: AccordionRootState,
        readonly item: AccordionItemState
    ) {
        this.onclick = this.onclick.bind(this);
    }

    onclick() {
        this.root.toggleItem(this.item.props.id || '');
    }
}

/**
 * Manages the state for an Accordion collapse component.
 * Represents the collapsible content section of an accordion item.
 * Tracks expansion state and sets up proper ARIA relationships with the button.
 */
export class AccordionCollapseState {
    isExpanded = $derived.by(() => this.root.isItemExpanded(this.item.props.id || ''));

    constructor(
        readonly props: Accordion.CollapseProps,
        readonly root: AccordionRootState,
        readonly item: AccordionItemState
    ) {
        if (!this.props.id) {
            console.warn('props.id is required for the Accordion.Collapse to set accessibility correctly');
        }
        this.item.ariaControls = this.props.id || undefined;
    }
}

const AccordionRootContext = new Context<AccordionRootState>('accordion-root');
const AccordionItemContext = new Context<AccordionItemState>('accordion-item');

/**
 * Creates and provides the Accordion root state through context.
 * This function should be called in the root Accordion component.
 * @param props - The properties for the Accordion root component
 * @returns The created AccordionRootState instance
 */
export function initAccordionRootState(props: Accordion.RootProps): AccordionRootState {
    const rootState = new AccordionRootState(props);
    return AccordionRootContext.set(rootState);
}

/**
 * Creates and provides an Accordion item state through context.
 * This function should be called in each Accordion item component.
 * @param props - The properties for the Accordion item component
 * @returns The created AccordionItemState instance
 */
export function initAccordionItemState(props: Accordion.ItemProps): AccordionItemState {
    const rootState = AccordionRootContext.get();
    return AccordionItemContext.set(new AccordionItemState(props, rootState));
}

/**
 * Creates state for an Accordion button component.
 * This function should be called in each button component that toggles an Accordion item.
 * @param props - The properties for the Accordion button component
 * @returns The created AccordionButtonState instance
 */
export function initAccordionButtonState(props: Accordion.ButtonProps): AccordionButtonState {
    const rootState = AccordionRootContext.get();
    const itemState = AccordionItemContext.get();
    return new AccordionButtonState(props, rootState, itemState);
}

/**
 * Creates state for an Accordion collapse component.
 * This function should be called in each collapsible content section of an Accordion item.
 * @param props - The properties for the Accordion collapse component
 * @returns The created AccordionCollapseState instance
 */
export function initAccordionCollapseState(props: Accordion.CollapseProps): AccordionCollapseState {
    const rootState = AccordionRootContext.get();
    const itemState = AccordionItemContext.get();
    return new AccordionCollapseState(props, rootState, itemState);
}

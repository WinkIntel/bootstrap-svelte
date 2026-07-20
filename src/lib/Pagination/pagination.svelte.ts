import { Context } from '$lib/common/index.js';
import { untrack } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import { Pagination } from './index.js';

/**
 * Manages the state for the Pagination root component.
 * Handles the tracking of active and disabled pagination items.
 * Provides methods to check and set the active and disabled states.
 */
export class PaginationRootState {
    #activePaginationItemId: string = $state('');
    #disabledPaginationItemIds = new SvelteSet<string>();

    constructor(readonly props: Pagination.RootProps) {
        this.isPaginationItemActive = this.isPaginationItemActive.bind(this);
        this.setPaginationItemActive = this.setPaginationItemActive.bind(this);
        this.removePaginationItemActive = this.removePaginationItemActive.bind(this);
        this.isPaginationItemDisabled = this.isPaginationItemDisabled.bind(this);
        this.setPaginationItemDisabled = this.setPaginationItemDisabled.bind(this);
        this.removePaginationItemDisabled = this.removePaginationItemDisabled.bind(this);
    }

    isPaginationItemActive(itemId: string): boolean {
        return this.#activePaginationItemId === itemId;
    }
    setPaginationItemActive(itemId: string): void {
        this.#activePaginationItemId = itemId;
    }
    removePaginationItemActive(itemId: string): void {
        untrack(() => {
            if (this.#activePaginationItemId === itemId) {
                this.#activePaginationItemId = '';
            }
        });
    }

    isPaginationItemDisabled(itemId: string): boolean {
        return this.#disabledPaginationItemIds.has(itemId);
    }
    setPaginationItemDisabled(itemId: string): void {
        untrack(() => {
            if (itemId && !this.#disabledPaginationItemIds.has(itemId)) {
                this.#disabledPaginationItemIds.add(itemId);
            }
        });
    }
    removePaginationItemDisabled(itemId: string): void {
        untrack(() => {
            if (itemId && this.#disabledPaginationItemIds.has(itemId)) {
                this.#disabledPaginationItemIds.delete(itemId);
            }
        });
    }
}

/**
 * Manages the state for an individual Pagination item.
 * Tracks active and disabled states and provides methods to check and set these states.
 * Initializes its active and disabled states based on the `isActive` and `isDisabled` props.
 */
export class PaginationItemState {
    isActive = $derived.by(() => this.props.isActive || this.root.isPaginationItemActive(this.props.id || ''));
    isDisabled = $derived.by(() => this.props.isDisabled || this.root.isPaginationItemDisabled(this.props.id || ''));

    constructor(
        readonly props: Pagination.ItemProps,
        readonly root: PaginationRootState
    ) {
        if (this.props.isActive) {
            this.root.setPaginationItemActive(this.props.id || '');
        }
    }
}

/**
 * Manages the state for the Pagination.Link component.
 * Tracks the active state of the link and provides a method to handle click events.
 * The click event sets the active state of the corresponding Pagination item.
 */
export class PaginationLinkState {
    isDisabled = $derived.by(() => this.item.isDisabled || this.props.isDisabled);

    constructor(
        readonly props: Pagination.LinkProps,
        readonly root: PaginationRootState,
        readonly item: PaginationItemState
    ) {
        this.onclick = this.onclick.bind(this);
    }

    onclick() {
        if (this.root.props.isStateful) {
            this.root.setPaginationItemActive(this.item.props.id || '');
        }
    }
}

const PaginationRootContext = new Context<PaginationRootState>('pagination-root');
const PaginationItemContext = new Context<PaginationItemState>('pagination-item');

/**
 * Creates a new PaginationRootState and sets it in the PaginationRootContext.
 * This function initializes the root state for the Pagination component.
 * @param props The props of the Pagination component.
 * @returns The created PaginationRootState instance.
 */
export function initPaginationRootState(props: Pagination.RootProps): PaginationRootState {
    const rootState = new PaginationRootState(props);
    return PaginationRootContext.set(rootState);
}

/**
 * Creates a new PaginationItemState and sets it in the PaginationItemContext.
 * This function initializes the state for an individual Pagination item.
 * @param props The props of the Pagination.Item component.
 * @returns The created PaginationItemState instance.
 * @throws Will throw an error if PaginationRootContext is not set.
 */
export function initPaginationItemState(props: Pagination.ItemProps): PaginationItemState {
    if (!PaginationRootContext.exists()) {
        throw new Error('PaginationRootContext is not set. Please initialize it first.');
    }
    const rootState = PaginationRootContext.get();
    return PaginationItemContext.set(new PaginationItemState(props, rootState));
}

/**
 * Creates a new PaginationLinkState and sets it in the PaginationItemContext.
 * This function initializes the state for the Pagination.Link component.
 * @param props The props of the Pagination.Link component.
 * @returns The created PaginationLinkState instance.
 * @throws Error if PaginationRootContext or PaginationItemContext is not set.
 */
export function initPaginationLinkState(props: Pagination.LinkProps): PaginationLinkState {
    if (!PaginationRootContext.exists()) {
        throw new Error('PaginationRootContext is not set. Please initialize it first.');
    }
    if (!PaginationItemContext.exists()) {
        throw new Error('PaginationItemContext is not set. Please initialize it first.');
    }
    const rootState = PaginationRootContext.get();
    const itemState = PaginationItemContext.get();
    return new PaginationLinkState(props, rootState, itemState);
}

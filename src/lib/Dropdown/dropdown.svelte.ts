import { isRTL } from '$lib/common/dom.js';
import { Context } from '$lib/common/index.js';
import type { PopperOffset } from '$lib/common/types.js';
import { createPopper, type Instance, type Placement } from '@popperjs/core';
import { tick } from 'svelte';
import type { Dropdown } from './index.js';
import type { DropdownAutoClose, DropdownDirection, DropdownDisplay } from './types.js';

export class DropdownRootState {
    #activeItemIndex: number = $state(-1); // Zero-based index for active item
    #autoClose: DropdownAutoClose = $state(true); // Determines how the dropdown should close (default is true, meaning it closes on any click outside).
    #direction: DropdownDirection = $state('dropdown');
    #display: DropdownDisplay = $state('dynamic');
    #elementRef: HTMLElement | null = $state(null);
    #isButtonGroup: boolean = $state(false);
    #isNavItem: boolean = $state(false);
    #isShown: boolean = $state(false);
    #items: DropdownItemState[] = $state([]);

    ariaLabelledBy: string | undefined = $state(undefined); // Used for accessibility, linking the dropdown to a label.

    constructor(readonly props: Dropdown.RootProps) {
        this.#autoClose = this.props.autoClose !== undefined ? this.props.autoClose : true; // Default to true if not specified.
        this.#direction = this.props.direction || 'dropdown';
        this.#display = this.props.display || 'dynamic';
        this.#elementRef = this.props.elementRef || null;
        this.#isButtonGroup = this.props.isButtonGroup || false;
        // Bind the method to ensure `this` context is correct when passed as a callback.
        this.focusOnNextItem = this.focusOnNextItem.bind(this);
        this.focusOnPreviousItem = this.focusOnPreviousItem.bind(this);
        this.registerItem = this.registerItem.bind(this);
        this.reorderItems = this.reorderItems.bind(this);
        this.toggleIsShown = this.toggleIsShown.bind(this);
        this.unregisterItem = this.unregisterItem.bind(this);
    }

    get activeItemIndex(): number {
        return this.#activeItemIndex;
    }
    set activeItemIndex(index: number) {
        this.#activeItemIndex = index;
    }

    get autoClose(): DropdownAutoClose {
        return this.#autoClose;
    }
    set autoClose(autoClose: DropdownAutoClose) {
        this.#autoClose = autoClose;
    }

    get direction(): DropdownDirection {
        return this.#direction;
    }
    set direction(direction: DropdownDirection) {
        this.#direction = direction;
    }

    get display(): DropdownDisplay {
        return this.#display;
    }
    set display(display: DropdownDisplay) {
        this.#display = display;
    }

    get elementRef(): HTMLElement | null {
        return this.#elementRef;
    }
    set elementRef(element: HTMLElement | null) {
        // The root element reference, typically the dropdown toggle button or a wrapper.
        // This is used by Popper.js to position the dropdown menu.
        this.#elementRef = element;
        if (this.#elementRef) {
            const parentElement: HTMLElement | null = this.#elementRef.parentElement;
            this.#isNavItem = parentElement ? parentElement.classList.contains('navbar-nav') : false;
        }
    }

    get hasItems(): boolean {
        return this.#items.length > 0;
    }

    get isButtonGroup(): boolean {
        return this.#isButtonGroup;
    }
    set isButtonGroup(isButtonGroup: boolean) {
        this.#isButtonGroup = isButtonGroup;
    }

    get isNavItem(): boolean {
        return this.#isNavItem;
    }

    get isShown(): boolean {
        return this.#isShown;
    }

    focusOnNextItem(): void {
        this.focusOnItemInDirection(1);
    }

    focusOnPreviousItem(): void {
        this.focusOnItemInDirection(-1);
    }

    registerItem(item: DropdownItemState): void {
        item.itemIndex = this.#items.length; // Set the item's index based on current length.
        this.#items = [...this.#items, item];
    }

    unregisterItem(item: DropdownItemState): void {
        const removedIndex = this.#items.indexOf(item);
        if (removedIndex === -1) {
            return;
        }

        const activeItem = this.#items[this.#activeItemIndex];
        const remainingItems = this.#items.filter((registeredItem) => registeredItem !== item);
        remainingItems.forEach((registeredItem, index) => (registeredItem.itemIndex = index));
        this.#items = remainingItems;
        this.#activeItemIndex = activeItem && activeItem !== item ? remainingItems.indexOf(activeItem) : -1;
    }

    reorderItems(): void {
        const activeItem = this.#items[this.#activeItemIndex];
        const orderedItems = [...this.#items].sort((first, second) => {
            const firstElement = first.props.elementRef;
            const secondElement = second.props.elementRef;
            if (!firstElement || !secondElement || firstElement === secondElement) {
                return firstElement ? -1 : secondElement ? 1 : 0;
            }

            const position = firstElement.compareDocumentPosition(secondElement);
            return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : position & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
        });
        orderedItems.forEach((item, index) => (item.itemIndex = index));
        this.#items = orderedItems;
        this.#activeItemIndex = activeItem ? orderedItems.indexOf(activeItem) : -1;
    }

    toggleIsShown(event: Event) {
        if (!this.#isShown) {
            this.props.onShow?.(event);
        }
        if (this.#isShown) {
            this.props.onHide?.(event);
        }
        this.#isShown = !this.#isShown;
        this.#activeItemIndex = -1; // Reset active item index when toggling visibility.
        if (this.#isShown) {
            this.props.onShown?.(event);
        }
        if (!this.#isShown) {
            this.props.onHidden?.(event);
        }
    }

    private focusOnItemInDirection(direction: 1 | -1): void {
        this.reorderItems();
        let itemIndex =
            this.#activeItemIndex === -1
                ? direction === 1
                    ? 0
                    : this.#items.length - 1
                : (this.#activeItemIndex + direction + this.#items.length) % this.#items.length;

        for (let count = 0; count < this.#items.length; count += 1) {
            const item = this.#items[itemIndex];
            if (item && !item.props.isDisabled) {
                this.#activeItemIndex = itemIndex;
                item.props.elementRef?.focus();
                return;
            }
            itemIndex = (itemIndex + direction + this.#items.length) % this.#items.length;
        }

        this.#activeItemIndex = -1;
    }
}

export class DropdownToggleState {
    // Derives its shown state directly from the root state.
    isShown = $derived.by(() => this.root.isShown);

    constructor(
        readonly props: Dropdown.ToggleProps,
        readonly root: DropdownRootState
    ) {
        // Bind the method to ensure `this` context is correct when used as an event handler.
        this.onclick = this.onclick.bind(this);
        this.onkeydown = this.onkeydown.bind(this);
        if (this.props.isSplit && !this.root.isButtonGroup) {
            // If the toggle is a split button, the root must be treated as a button group
            // to ensure correct Bootstrap styling and layout.
            this.root.isButtonGroup = true;
        }
        this.root.ariaLabelledBy = this.props.id || undefined; // Set the aria-labelledby attribute for accessibility.
    }

    onclick(event: Event) {
        event.preventDefault();
        this.root.toggleIsShown(event);
    }

    onkeydown(event: KeyboardEvent) {
        handleKeydown(event, this.root);
    }
}

export class DropdownMenuState {
    // Private
    #autoClose: DropdownAutoClose = $derived.by(() => this.root?.autoClose);
    #elementRef: HTMLElement | null = $state(null); // Reference to the dropdown menu element itself.
    #isEnd: boolean = $state(false);
    #popperInstance: Instance | null = null;
    #popperOffset: PopperOffset = $state([0, 2]);
    #popperPlacement: Placement | undefined = $state(undefined);
    #rootElementRef: HTMLElement | null = $derived.by(() => this.root?.elementRef); // Reference to the root dropdown element, used for Popper.js positioning.
    // Public
    isShown = $derived.by(() => this.root.isShown); // Derives its shown state directly from the root state.
    ariaLabelledBy: string | undefined = $derived.by(() => this.root.ariaLabelledBy);

    constructor(
        readonly props: Dropdown.MenuProps,
        readonly root: DropdownRootState
    ) {
        this.#elementRef = this.props.elementRef || null;
        this.#isEnd = this.props.isEnd || false;
        this.#popperOffset = this.props.offset || [0, 2];
        // Bind methods to ensure `this` context is correct when passed as callbacks or event handlers.
        this.bodyOnclick = this.bodyOnclick.bind(this);
        this.createPopperInstance = this.createPopperInstance.bind(this);
        this.destroyPopper = this.destroyPopper.bind(this);
        this.determinePopperPlacement = this.determinePopperPlacement.bind(this);
        this.dispose = this.dispose.bind(this);
        this.syncIsEndWithRoot = this.syncIsEndWithRoot.bind(this);
        // Ensure the dropdown menu's end alignment is consistent with the root's direction.
        this.syncIsEndWithRoot();
        // Effect to manage the Popper.js instance lifecycle.
        // It creates the instance when the menu is shown and elements are available,
        // and implicitly handles destruction/recreation if dependencies change.
        $effect(() => {
            if (this.#rootElementRef && this.#elementRef && this.isShown) {
                this.createPopperInstance();
            }
        });
    }

    get autoClose(): DropdownAutoClose {
        return this.#autoClose;
    }

    get elementRef(): HTMLElement | null {
        return this.#elementRef;
    }
    set elementRef(element: HTMLElement | null) {
        this.#elementRef = element;
    }

    get isEnd(): boolean {
        return this.#isEnd;
    }
    set isEnd(isEnd: boolean) {
        this.#isEnd = isEnd;
        // Ensure the dropdown menu's end alignment is consistent with the root's direction.
        this.syncIsEndWithRoot();
    }

    get popperOffset(): PopperOffset {
        return this.#popperOffset;
    }
    set popperOffset(offset: PopperOffset) {
        this.#popperOffset = offset;
        // Recreate the Popper instance to apply the new offset.
        this.createPopperInstance();
    }

    get popperPlacement(): Placement | undefined {
        return this.#popperPlacement;
    }

    // Handles clicks on the document body to close the dropdown when clicking outside.
    bodyOnclick(event: Event): void {
        if (!this.isShown) {
            return;
        }
        const target = event.target as HTMLElement;
        if (this.#elementRef?.contains(target) || this.#rootElementRef?.contains(target)) {
            // The click is within this menu or its toggle/root, so do nothing.
            return;
        }
        // Only close on outside clicks if autoClose is true or 'outside'
        // false: only close on toggle click (ignore body clicks)
        // 'inside': only close on item/toggle clicks (ignore body clicks)
        // 'outside': close on toggle/body clicks (ignore item clicks)
        // true: close on any click (toggle, item, or body)
        if (this.autoClose === true || this.autoClose === 'outside') {
            this.root.toggleIsShown(event);
        }
    }

    // Cleans up resources, particularly the Popper.js instance and element references.
    dispose() {
        this.destroyPopper();
        this.#elementRef = null;
        this.#rootElementRef = null; // Clearing derived state source if it were directly settable.
        this.#popperInstance = null;
    }

    private createPopperInstance() {
        this.destroyPopper();

        if (!this.#elementRef || !this.#rootElementRef) {
            return;
        }

        this.#popperPlacement = this.determinePopperPlacement();

        const popperConfig = {
            placement: this.#popperPlacement,
            modifiers: this.determinePopperModifiers()
        };

        this.#popperInstance = createPopper(this.#rootElementRef, this.#elementRef, popperConfig);
    }

    private determinePopperModifiers() {
        const isStaticDisplay = this.root.isNavItem || this.root.display === 'static';

        if (isStaticDisplay) {
            return [
                {
                    name: 'applyStyles', // Disables Popper.js styles, allowing Bootstrap to handle positioning.
                    enabled: false
                }
            ];
        }

        return [
            {
                name: 'preventOverflow',
                enabled: true,
                options: {
                    boundary: 'clippingParents' // Ensures the dropdown stays within viewport boundaries
                }
            },
            {
                name: 'offset', // Adds a small offset between the toggle and the menu
                enabled: true,
                options: {
                    offset: this.#popperOffset
                }
            }
        ];
    }

    // Determines the appropriate Popper.js placement based on the dropdown's direction
    // and whether the UI is in Right-To-Left (RTL) mode.
    private determinePopperPlacement(): Placement {
        const _isRTL = isRTL();

        // Define placement mappings for better maintainability
        const placementMap: Record<string, { ltr: Placement; rtl: Placement }> = {
            dropend: { ltr: 'right-start', rtl: 'left-start' },
            dropstart: { ltr: 'left-start', rtl: 'right-start' },
            'dropup-center': { ltr: 'top', rtl: 'top' },
            'dropup-end': { ltr: 'top-end', rtl: 'top-start' },
            dropup: { ltr: 'top-start', rtl: 'top-end' },
            'dropdown-center': { ltr: 'bottom', rtl: 'bottom' },
            'dropdown-end': { ltr: 'bottom-end', rtl: 'bottom-start' }
        };

        const direction = this.root.direction;
        const mapping = placementMap[direction];

        if (mapping) {
            return _isRTL ? mapping.rtl : mapping.ltr;
        }

        // Default placement if the direction is not in the map (e.g., 'dropdown').
        // For 'dropdown', the default is 'bottom-start' (LTR) or 'bottom-end' (RTL).
        return _isRTL ? 'bottom-end' : 'bottom-start';
    }

    private destroyPopper() {
        if (!this.#popperInstance) {
            return;
        }
        this.#popperInstance.destroy();
        this.#popperInstance = null;
    }

    private syncIsEndWithRoot() {
        const currentDirection = this.root.direction;
        const configuredDirection = this.root.props.direction ?? 'dropdown';
        const hasCompatibleDirection = currentDirection.endsWith('-end') || configuredDirection.endsWith('-end');

        // If the menu is aligned to the end, but the root direction doesn't reflect this,
        // update the root direction to ensure consistent behavior and styling.
        if (this.#isEnd && !hasCompatibleDirection) {
            const direction = currentDirection;
            if (direction === 'dropdown' || direction === 'dropdown-center') {
                this.root.direction = 'dropdown-end';
            } else if (direction === 'dropup' || direction === 'dropup-center') {
                this.root.direction = 'dropup-end';
            } else {
                // Default to dropdown-end if the current direction is unusual (e.g., dropstart/dropend with isEnd).
                this.root.direction = 'dropdown-end';
            }
        }
    }
}

export class DropdownItemState {
    #autoClose: DropdownAutoClose = $derived.by(() => this.root?.autoClose);
    #itemIndex: number = $state(-1); // The index of this item within the dropdown, set when registered with the root.

    constructor(
        readonly props: Dropdown.ItemProps,
        readonly root: DropdownRootState
    ) {
        // Bind the method to ensure `this` context is correct when used as an event handler.
        this.onclick = this.onclick.bind(this);
        this.onfocus = this.onfocus.bind(this);
        this.onkeydown = this.onkeydown.bind(this);
    }

    get autoClose(): DropdownAutoClose {
        return this.#autoClose;
    }

    get itemIndex(): number {
        return this.#itemIndex;
    }
    set itemIndex(index: number) {
        this.#itemIndex = index;
    }

    // When a dropdown item is clicked, it should typically close the dropdown.
    onclick(event: Event) {
        if (this.props.isDisabled) {
            return;
        }
        // Only close on item clicks if autoClose is true or 'inside'
        // false: only close on toggle click (ignore item clicks)
        // 'inside': close on item/toggle clicks (ignore body clicks)
        // 'outside': only close on toggle/body clicks (ignore item clicks)
        // true: close on any click (toggle, item, or body)
        if (this.autoClose === true || this.autoClose === 'inside') {
            this.root.toggleIsShown(event);
        }
    }

    onfocus(_event: FocusEvent) {
        this.root.activeItemIndex = this.#itemIndex;
    }

    onkeydown(event: KeyboardEvent) {
        handleKeydown(event, this.root);
    }
}

// Svelte Context key for sharing the DropdownRootState.
const DropdownRootContext = new Context<DropdownRootState>('dropdown-root');

// Initializes and provides the DropdownRootState via Svelte Context.
// This allows child components (Toggle, Menu, Item) to access and interact with the root state.
export function initDropdownRootState(props: Dropdown.RootProps): DropdownRootState {
    const rootState = new DropdownRootState(props);
    return DropdownRootContext.set(rootState);
}

// Initializes DropdownToggleState, ensuring it has access to the DropdownRootState from context.
export function initDropdownToggleState(props: Dropdown.ToggleProps): DropdownToggleState {
    if (!DropdownRootContext.exists()) {
        throw new Error('DropdownRootState must be initialized before DropdownToggleState');
    }
    const rootState = DropdownRootContext.get();
    return new DropdownToggleState(props, rootState);
}

// Initializes DropdownMenuState, ensuring it has access to the DropdownRootState from context.
export function initDropdownMenuState(props: Dropdown.MenuProps): DropdownMenuState {
    if (!DropdownRootContext.exists()) {
        // Changed error message to reflect DropdownMenuState dependency
        throw new Error('DropdownRootState must be initialized before DropdownMenuState');
    }
    const rootState = DropdownRootContext.get();
    return new DropdownMenuState(props, rootState);
}

// Initializes DropdownItemState, ensuring it has access to the DropdownRootState from context.
export function initDropdownItemState(props: Dropdown.ItemProps): DropdownItemState {
    if (!DropdownRootContext.exists()) {
        throw new Error('DropdownRootState must be initialized before DropdownItemState');
    }
    const rootState = DropdownRootContext.get();
    const itemState = new DropdownItemState(props, rootState);
    rootState.registerItem(itemState);
    return itemState;
}

/**
 * Handles keyboard navigation for the toggle and items within the dropdown.
 * Supports opening the dropdown with ArrowUp/ArrowDown and navigating between items.
 *
 * @param event KeyboardEvent
 * @param root DropdownRootState
 */
function handleKeydown(event: KeyboardEvent, root: DropdownRootState) {
    const { key } = event;
    const isUpOrDownEvent = ['ArrowUp', 'ArrowDown'].includes(event.key);
    if (isUpOrDownEvent && !root.isShown) {
        event.preventDefault();
        root.toggleIsShown(event);
        // Wait for the dropdown to be shown and items to be rendered before focusing.
        tick().then(() => {
            if (key === 'ArrowDown') {
                root.focusOnNextItem();
            } else if (key === 'ArrowUp') {
                root.focusOnPreviousItem();
            }
        });
    } else {
        if (key === 'ArrowDown') {
            event.preventDefault();
            root.focusOnNextItem();
        } else if (key === 'ArrowUp') {
            event.preventDefault();
            root.focusOnPreviousItem();
        }
    }
}

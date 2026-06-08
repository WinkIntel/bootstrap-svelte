import { Context } from '$lib/common/index.js';
import type { Toast } from './index.js';

/**
 * ToastRootState is the state of the Toast component.
 * It is used to manage the state of the Toast and its children.
 */
export class ToastRootState {
    // Default values for toast configuration
    static readonly DELAY_DEFAULT: number = 5000;
    static readonly DO_AUTOHIDE_DEFAULT: boolean = true;
    static readonly IS_SHOWN_DEFAULT: boolean = false;
    static readonly USE_FADE_DEFAULT: boolean = true;

    // Using private field with getter to prevent external mutation without using the toggle method
    #isShown: boolean = $state(ToastRootState.IS_SHOWN_DEFAULT);

    constructor(readonly props: Toast.RootProps) {
        this.#isShown = this.props.isShown ?? ToastRootState.IS_SHOWN_DEFAULT;
    }

    get isShown(): boolean {
        return this.#isShown;
    }

    /**
     * Toggles the visibility state of the toast
     * This is the only way to change the isShown state externally
     */
    toggleIsShown() {
        this.#isShown = !this.#isShown;
    }
}

/**
 * ToastHeaderState is the state of the Toast.Header component.
 * It is used to manage the state of the Toast.Header and its children.
 */
export class ToastHeaderState {
    static readonly IS_DISMISSIBLE_DEFAULT: boolean = true;

    /**
     * Derived state that depends on parent toast's visibility
     * When the toast root's visibility changes, this will automatically update
     */
    isShown: boolean = $derived.by(() => this.root.isShown);

    // Controls whether the close button is displayed in the header
    isDismissible: boolean = $state(ToastHeaderState.IS_DISMISSIBLE_DEFAULT);

    constructor(
        readonly props: Toast.HeaderProps,
        readonly root: ToastRootState
    ) {
        this.isDismissible = this.props.isDismissible ?? ToastHeaderState.IS_DISMISSIBLE_DEFAULT;
    }

    /**
     * Event handler for the close button
     * Delegates to the parent toast's toggle method to maintain a single source of truth
     */
    onclick(): void {
        this.root.toggleIsShown();
    }
}

/**
 * Context for sharing toast state across component hierarchy
 * Uses a unique key to prevent collisions with other contexts
 */
const ToastRootContext = new Context<ToastRootState>('toast-root');

/**
 * Creates a new ToastRootState and sets it in the context.
 * @param props The props of the Toast component.
 * @returns The created ToastRootState.
 */
export function initToastRootState(props: Toast.RootProps): ToastRootState {
    const rootState = new ToastRootState(props);
    return ToastRootContext.set(rootState);
}

/**
 * Creates a new ToastHeaderState and sets it in the context.
 * @param props The props of the Toast.Header component.
 * @returns The created ToastHeaderState.
 */
export function initToastHeaderState(props: Toast.HeaderProps): ToastHeaderState {
    if (!ToastRootContext.exists()) {
        throw new Error('Toast.Header requires Toast.Root context. Please ensure Toast.Root is initialized before Toast.Header.');
    }
    const rootState = ToastRootContext.get();
    return new ToastHeaderState(props, rootState);
}

import { Context } from '$lib/common/index.js';
import type { Modal } from './index.js';
import type { ModalBackdrop } from './types.js';

/**
 * ModalRootState is the state of the Modal component.
 * It is used to manage the state of the Modal and its children.
 */
export class ModalRootState {
    // Private
    #isShown: boolean = $state(false);
    #useBackdrop: ModalBackdrop = $state(true);
    // Plain (non-reactive) ordered registry of mounted Modal.Title ids; the
    // first registered title labels the dialog...
    #titleIds: string[] = [];
    titleId: string | undefined = $state(undefined);

    constructor(readonly props: Modal.RootProps) {
        this.toggleIsShown = this.toggleIsShown.bind(this);
        this.#isShown = this.props.isShown ?? false;
        this.#useBackdrop = this.props.useBackdrop ?? true;
    }

    get isBackdropShown(): boolean {
        return this.isShown && this.#useBackdrop !== false;
    }

    get isShown(): boolean {
        return this.#isShown;
    }

    get useBackdrop(): ModalBackdrop {
        return this.#useBackdrop;
    }
    set useBackdrop(value: ModalBackdrop) {
        this.#useBackdrop = value;
    }

    toggleIsShown() {
        this.#isShown = !this.#isShown;
    }

    // Both methods are called from Modal.Title's `$effect`. They must never
    // read `titleId` (reactive state) there, or the effect would depend on the
    // state it writes and Svelte >= 5.56.5 loops with "Maximum update depth
    // exceeded". The registry is a plain array, and `titleId` is only written...
    registerTitleId(id: string) {
        if (!this.#titleIds.includes(id)) {
            this.#titleIds.push(id);
        }
        this.titleId = this.#titleIds[0];
    }

    unregisterTitleId(id: string) {
        this.#titleIds = this.#titleIds.filter((titleId) => titleId !== id);
        this.titleId = this.#titleIds[0];
    }
}

/**
 * ModalHeaderState is the state of the Modal.Header component.
 * It is used to manage the state of the Modal.Header and its children.
 */
export class ModalHeaderState {
    isShown = $derived.by(() => this.root.isShown);
    isDismissible: boolean = $state(false);

    constructor(
        readonly props: Modal.HeaderProps,
        readonly root: ModalRootState
    ) {
        this.isDismissible = this.props.isDismissible ?? false;
    }

    onclick() {
        this.root.toggleIsShown();
    }
}

const ModalRootContext = new Context<ModalRootState>('modal-root');
const modalOpenCounts = new WeakMap<HTMLElement, number>();

export function acquireModalOpenClass(bodyElement: HTMLElement): void {
    const count = (modalOpenCounts.get(bodyElement) ?? 0) + 1;
    modalOpenCounts.set(bodyElement, count);
    bodyElement.classList.add('modal-open');
}

export function releaseModalOpenClass(bodyElement: HTMLElement): void {
    const count = modalOpenCounts.get(bodyElement) ?? 0;
    if (count <= 1) {
        modalOpenCounts.delete(bodyElement);
        bodyElement.classList.remove('modal-open');
        return;
    }

    modalOpenCounts.set(bodyElement, count - 1);
}

/**
 * Creates a new ModalRootState and sets it in the ModalRootContext.
 * This is used to manage the state of the Modal component and its children.
 * @param props The props of the Modal component.
 * @returns The created ModalRootState.
 */
export function initModalRootState(props: Modal.RootProps): ModalRootState {
    const rootState = new ModalRootState(props);
    return ModalRootContext.set(rootState);
}

/**
 * Creates a new ModalHeaderState and sets it in the ModalHeaderContext.
 * This is used to manage the state of the Modal.Header component and its children.
 * @param props The props of the Modal.Header component.
 * @returns The created ModalHeaderState.
 */
export function initModalHeaderState(props: Modal.HeaderProps): ModalHeaderState {
    const rootState = ModalRootContext.get();
    return new ModalHeaderState(props, rootState);
}

export function getModalRootState(): ModalRootState {
    return ModalRootContext.get();
}

export function getOptionalModalRootState(): ModalRootState | undefined {
    return ModalRootContext.getOr(undefined);
}

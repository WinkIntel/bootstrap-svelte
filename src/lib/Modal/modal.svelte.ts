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

    registerTitleId(id: string) {
        this.titleId ??= id;
    }

    unregisterTitleId(id: string) {
        if (this.titleId === id) {
            this.titleId = undefined;
        }
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

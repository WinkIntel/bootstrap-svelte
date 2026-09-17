import { Context } from '$lib/common/index.js';
import { BreakpointMinimumMediaQuery } from '$lib/common/types.js';
import { tick } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';
import type { Navbar, Offcanvas } from '../index.js';
import type { OffcanvasBackdrop } from '../Offcanvas/types.js';

/**
 * NavbarRootState is the state of the Navbar component.
 * It is used to manage the state of the Navbar and its children.
 */
export class NavbarRootState {
    // Private
    #isExpanded: boolean = $state(false);
    #resetExpandedOnCollapse = false;
    readonly expandOnBreakpoint = $derived.by(() => this.props.expandOnBreakpoint ?? 'xs');
    #mediaQuery = $derived.by(() => {
        // xs is unconditional, including during SSR. Only viewport-dependent modes need a query.
        if (typeof window === 'undefined' || this.expandOnBreakpoint === 'xs') return undefined;
        return new MediaQuery(BreakpointMinimumMediaQuery[this.expandOnBreakpoint]!);
    });
    readonly isMediaQueryMatched = $derived(this.expandOnBreakpoint === 'xs' || (this.#mediaQuery?.current ?? false));
    #togglers: HTMLButtonElement[] = [];
    // Plain registry: effects may write ariaControls, but must not read it (or a
    // reactive registry) and subscribe to their own writes. Every target is controlled.
    #controlledIds: { key: symbol; id: string | undefined }[] = [];
    // Public
    ariaControls: string | undefined = $state(undefined);
    transitionDuration = $state(0);

    constructor(readonly props: Navbar.RootProps) {
        this.toggleIsExpanded = this.toggleIsExpanded.bind(this);
        // Reset a toggler-opened menu when we cross from inline mode
        // (media query matched) back into collapsed/offcanvas mode. Without
        // this, a previous toggle keeps the offcanvas appearing pre-opened on
        // the next downward cross.
        let previousMediaQueryMatched: boolean | undefined = undefined;
        $effect(() => {
            const matched = this.isMediaQueryMatched;
            if (previousMediaQueryMatched === true && !matched && this.#resetExpandedOnCollapse) {
                this.#isExpanded = false;
            }
            previousMediaQueryMatched = matched;
        });
    }

    get isExpanded(): boolean {
        return this.#isExpanded || this.isMediaQueryMatched;
    }
    set isExpanded(value: boolean) {
        // Explicit visibility updates survive responsive changes; toggler state resets below the breakpoint.
        this.#resetExpandedOnCollapse = false;
        this.#isExpanded = value;
    }

    get defaultCollapseId(): string {
        return `${this.props.id || 'navbar'}-collapse`;
    }

    registerControlledId(key: symbol, id: string | undefined) {
        const entry = this.#controlledIds.find((target) => target.key === key);
        if (entry) {
            entry.id = id;
        } else {
            this.#controlledIds.push({ key, id });
        }
        this.ariaControls =
            this.#controlledIds
                .map((target) => target.id)
                .filter(Boolean)
                .join(' ') || undefined;
    }

    unregisterControlledId(key: symbol) {
        this.#controlledIds = this.#controlledIds.filter((target) => target.key !== key);
        this.ariaControls =
            this.#controlledIds
                .map((target) => target.id)
                .filter(Boolean)
                .join(' ') || undefined;
    }

    // Attach to a rendered panel. Keep one entry through ID changes and remove
    // it when the element leaves the DOM, including after its outro.
    registerControlledPanel(getId: () => string | undefined) {
        const key = Symbol('navbar-panel');
        $effect(() => {
            this.registerControlledId(key, getId());
        });
        return () => this.unregisterControlledId(key);
    }

    registerToggler(element: HTMLButtonElement) {
        this.#togglers.push(element);
        return () => {
            this.#togglers = this.#togglers.filter((toggler) => toggler !== element);
        };
    }

    isTogglerEvent(event: MouseEvent): boolean {
        if (event.button !== 0) return false;
        const path = event.composedPath();
        return this.#togglers.some((toggler) => !toggler.matches(':disabled') && path.includes(toggler));
    }

    toggleIsExpanded() {
        this.#resetExpandedOnCollapse = true;
        this.#isExpanded = !this.#isExpanded;
    }
}

/**
 * NavbarTogglerState is the state of the Navbar.Toggler component.
 * It is used to manage the state of the Navbar.Toggler and its children.
 */
export class NavbarTogglerState {
    isExpanded = $derived.by(() => this.root.isExpanded);

    constructor(
        readonly props: Navbar.TogglerProps,
        readonly root: NavbarRootState
    ) {
        this.onclick = this.onclick.bind(this);
    }

    onclick() {
        // When the Navbar is collapsed, we need to set the `transitionDuration` prop to 350 before we toggle the collapse
        // to ensure that the transition is smooth. Otherwise, the transition will be instant.
        if (this.isExpanded === false) {
            this.root.transitionDuration = 350;
            // We need to allow the `transitionDuration` reactivity to be complete before we toggle the collapse...
            tick().then(() => {
                this.root.toggleIsExpanded();
            });
        } else {
            this.root.toggleIsExpanded();
        }
    }
}

/**
 * NavbarCollapseState is the state of the Navbar.Collapse component.
 * It is used to manage the state of the Navbar.Collapse and its children.
 */
export class NavbarCollapseState {
    isExpanded = $derived.by(() => this.root.isExpanded);
    id = $derived.by(() => this.props.id || this.root.defaultCollapseId);

    constructor(
        readonly props: Navbar.CollapseProps,
        readonly root: NavbarRootState
    ) {}
}

/**
 * OffcanvasRootState is the state of the Offcanvas component.
 * It is used to manage the state of the Offcanvas and its children.
 */
export class OffcanvasRootState {
    // Private
    #isShown: boolean = $state(false);
    #useBackdrop: OffcanvasBackdrop = $state(true);
    #navbarRootState: NavbarRootState | undefined;
    #mediaQuery = $derived.by(() => {
        // An inheriting panel shares Navbar's responsive mode, including its always-inline xs mode.
        const breakpoint = this.props.showOnBreakpoint;
        if (typeof window === 'undefined' || !breakpoint) return undefined;
        return new MediaQuery(BreakpointMinimumMediaQuery[breakpoint]!);
    });
    // Public
    readonly isMediaQueryMatched: boolean = $derived.by(() =>
        this.props.showOnBreakpoint ? (this.#mediaQuery?.current ?? false) : (this.#navbarRootState?.isMediaQueryMatched ?? false)
    );
    readonly transitionDuration: number = $derived(this.isMediaQueryMatched ? 0 : 350);

    constructor(readonly props: Offcanvas.RootProps) {
        this.toggleIsShown = this.toggleIsShown.bind(this);
        this.#isShown = this.props.isShown ?? false;
        this.#useBackdrop = this.props.useBackdrop ?? true;
        if (NavbarRootContext.exists()) {
            this.#navbarRootState = NavbarRootContext.get();
            if (this.#isShown) this.#navbarRootState.isExpanded = true;
        }
    }

    get isShown(): boolean {
        return (this.#navbarRootState?.isExpanded ?? this.#isShown) || this.isMediaQueryMatched;
    }
    set isShown(value: boolean) {
        if (this.#navbarRootState) {
            this.#navbarRootState.isExpanded = value;
        } else {
            this.#isShown = value;
        }
    }

    get useBackdrop(): OffcanvasBackdrop {
        return this.#useBackdrop;
    }
    set useBackdrop(value: OffcanvasBackdrop) {
        this.#useBackdrop = value;
    }

    get isBackdropShown(): boolean {
        return this.isShown && this.#useBackdrop && !this.isMediaQueryMatched;
    }

    isControllingTogglerEvent(event: MouseEvent): boolean {
        return this.#navbarRootState?.isTogglerEvent(event) ?? false;
    }

    registerControlledPanel() {
        return this.#navbarRootState?.registerControlledPanel(() => this.props.id ?? undefined);
    }

    toggleIsShown() {
        if (this.#navbarRootState) {
            this.#navbarRootState.toggleIsExpanded();
        } else {
            this.#isShown = !this.#isShown;
        }
    }
}

/**
 * OffcanvasHeaderState is the state of the Offcanvas.Header component.
 * It is used to manage the state of the Offcanvas.Header and its children.
 */
export class OffcanvasHeaderState {
    isShown: boolean = $derived.by(() => this.root.isShown);
    isDismissible: boolean = $state(false);

    constructor(
        readonly props: Offcanvas.HeaderProps,
        readonly root: OffcanvasRootState
    ) {
        this.isDismissible = this.props.isDismissible ?? false;
    }

    onclick(): void {
        this.root.toggleIsShown();
    }
}

const NavbarRootContext = new Context<NavbarRootState>('navbar-root');
const OffcanvasRootContext = new Context<OffcanvasRootState>('offcanvas-root');

/**
 * Creates a new NavbarRootState and sets it in the NavbarRootContext.
 * It should be called in the root Navbar component.
 * @param props The props of the Navbar component.
 * @returns The created NavbarRootState instance.
 */
export function initNavbarRootState(props: Navbar.RootProps): NavbarRootState {
    const rootState = new NavbarRootState(props);
    return NavbarRootContext.set(rootState);
}

/**
 * Creates a new NavbarItemState and sets it in the NavbarItemContext.
 * It should be called in the NavbarItem component.
 * @param props The props of the Navbar.Toggler component.
 * @returns The created NavbarTogglerState instance.
 */
export function initNavbarTogglerState(props: Navbar.TogglerProps): NavbarTogglerState {
    const rootState = NavbarRootContext.get();
    return new NavbarTogglerState(props, rootState);
}

/**
 * Creates a new NavbarCollapseState and sets it in the NavbarCollapseContext.
 * It should be called in the Navbar.Collapse component.
 * @param props The props of the Navbar.Collapse component.
 * @returns The created NavbarCollapseState instance.
 */
export function initNavbarCollapseState(props: Navbar.CollapseProps): NavbarCollapseState {
    const rootState = NavbarRootContext.get();
    return new NavbarCollapseState(props, rootState);
}

/**
 * Creates a new OffcanvasRootState and sets it in the OffcanvasRootContext.
 * This is used to manage the state of the Offcanvas component and its children.
 * @param props The props of the Offcanvas component.
 * @returns The created OffcanvasRootState.
 */
export function initOffcanvasRootState(props: Offcanvas.RootProps): OffcanvasRootState {
    const rootState = new OffcanvasRootState(props);
    return OffcanvasRootContext.set(rootState);
}

/**
 * Creates a new OffcanvasHeaderState and sets it in the OffcanvasHeaderContext.
 * This is used to manage the state of the Offcanvas.Header component and its children.
 * @param props The props of the Offcanvas.Header component.
 * @returns The created OffcanvasHeaderState.
 */
export function initOffcanvasHeaderState(props: Offcanvas.HeaderProps): OffcanvasHeaderState {
    const rootState = OffcanvasRootContext.get();
    return new OffcanvasHeaderState(props, rootState);
}

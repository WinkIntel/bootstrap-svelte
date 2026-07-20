import { Context } from '$lib/common/index.js';
import { BreakpointMinimumMediaQuery } from '$lib/common/types.js';
import { tick } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';
import type { Navbar, Offcanvas } from '../index.js';
import type { OffcanvasBackdrop, OffcanvasBreakpoint } from '../Offcanvas/types.js';

/**
 * NavbarRootState is the state of the Navbar component.
 * It is used to manage the state of the Navbar and its children.
 */
export class NavbarRootState {
    // Private
    #isExpanded: boolean = $state(false);
    #expandOnBreakpoint: string = $state('xs');
    #mediaQuery: MediaQuery | undefined = $state(undefined);
    // Public
    ariaControls: string | undefined = $state(undefined);
    transitionDuration = $state(0);

    constructor(readonly props: Navbar.RootProps) {
        this.toggleIsExpanded = this.toggleIsExpanded.bind(this);
        this.#expandOnBreakpoint = this.props.expandOnBreakpoint || 'xs';
        if (typeof window !== 'undefined' && this.#expandOnBreakpoint) {
            const query: string | undefined = BreakpointMinimumMediaQuery[this.#expandOnBreakpoint];
            this.#mediaQuery = new MediaQuery(query || '');
        }
        // Reset the explicit-expanded flag when we cross from inline mode
        // (media query matched) back into collapsed/offcanvas mode. Without
        // this, a previous toggle keeps the offcanvas appearing pre-opened on
        // the next downward cross.
        let previousMediaQueryMatched: boolean | undefined = undefined;
        $effect(() => {
            const matched = this.#mediaQuery?.current;
            if (previousMediaQueryMatched === true && matched === false && this.#isExpanded) {
                this.#isExpanded = false;
            }
            previousMediaQueryMatched = matched;
        });
    }

    get isExpanded(): boolean {
        return this.#isExpanded || this.#mediaQuery?.current || false;
    }

    get defaultCollapseId(): string {
        return `${this.props.id || 'navbar'}-collapse`;
    }

    toggleIsExpanded() {
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
    ) {
        this.root.ariaControls = this.props.id || this.root.defaultCollapseId;
    }
}

/**
 * OffcanvasRootState is the state of the Offcanvas component.
 * It is used to manage the state of the Offcanvas and its children.
 */
export class OffcanvasRootState {
    // Private
    #isShown: boolean = $state(false);
    #useBackdrop: OffcanvasBackdrop = $state(true);
    #mediaQuery: MediaQuery | undefined = $state(undefined);
    #showOnBreakpoint: OffcanvasBreakpoint | undefined = $state(undefined);
    #navbarRootState: NavbarRootState | undefined = $state(undefined);
    // Public
    readonly isMediaQueryMatched: boolean = $derived(this.#mediaQuery?.current || false);
    readonly transitionDuration: number = $derived(this.#mediaQuery?.current ? 0 : 350);

    constructor(readonly props: Offcanvas.RootProps) {
        this.toggleIsShown = this.toggleIsShown.bind(this);
        this.#isShown = this.props.isShown ?? false;
        this.#useBackdrop = this.props.useBackdrop ?? true;
        if (NavbarRootContext.exists()) {
            this.#navbarRootState = NavbarRootContext.get();
            this.showOnBreakpoint = this.#navbarRootState.props.expandOnBreakpoint;
            $effect(() => {
                if (this.#navbarRootState && this.#isShown !== this.#navbarRootState.isExpanded) {
                    const navbarIsExpanded = this.#navbarRootState.isExpanded;
                    // Because the transition is asynchronous, we need to wait for the next tick before toggling the state...
                    tick().then(() => {
                        this.#isShown = navbarIsExpanded;
                    });
                }
            });
        } else {
            this.showOnBreakpoint = this.props.showOnBreakpoint;
        }
    }

    get isShown(): boolean {
        return this.#isShown || this.#mediaQuery?.current || false;
    }

    get useBackdrop(): OffcanvasBackdrop {
        return this.#useBackdrop;
    }
    set useBackdrop(value: OffcanvasBackdrop) {
        this.#useBackdrop = value;
    }

    get showOnBreakpoint(): OffcanvasBreakpoint | undefined {
        return this.#showOnBreakpoint;
    }
    set showOnBreakpoint(value: OffcanvasBreakpoint | undefined) {
        this.#showOnBreakpoint = value;
        if (typeof window !== 'undefined' && this.#showOnBreakpoint) {
            const query: string | undefined = BreakpointMinimumMediaQuery[this.#showOnBreakpoint];
            this.#mediaQuery = new MediaQuery(query || '');
        }
    }

    get isBackdropShown(): boolean {
        return this.isShown && this.#useBackdrop && !this.isMediaQueryMatched;
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

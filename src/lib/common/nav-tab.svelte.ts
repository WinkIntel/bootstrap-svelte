import { Context } from '$lib/common/index.js';
import type { Nav } from '../Nav/index.js';
import type { Tab } from '../Tab/index.js';

/**
 * Manages the state for the Nav root component.
 * Handles the tracking of active nav links and provides methods to set them.
 * Supports both tab and non-tab navigation.
 */
export class NavRootState {
    #activeNavLinkId: string = $state('');
    #navLinkStates: NavLinkState[] = [];

    get isTablist(): boolean {
        return this.props.role === 'tablist';
    }

    constructor(
        readonly props: Nav.RootProps,
        readonly tabRoot: TabRootState | null = null
    ) {
        this.isNavLinkActive = this.isNavLinkActive.bind(this);
        this.registerNavLinkState = this.registerNavLinkState.bind(this);
        this.setNavLinkActive = this.setNavLinkActive.bind(this);
    }

    isNavLinkActive(navLinkId: string): boolean {
        return this.#activeNavLinkId === navLinkId;
    }
    registerNavLinkState(linkState: NavLinkState): void {
        this.#navLinkStates.push(linkState);
    }
    setNavLinkActive(navLinkId: string): void {
        this.#activeNavLinkId = navLinkId;
    }
}

/**
 * Manages the state for an individual Nav link.
 * Tracks active state and provides methods to handle clicks.
 */
export class NavLinkState {
    isActive = $derived.by(() => this.root.isNavLinkActive(this.props.id || ''));
    hasTabRole = $derived.by(() => this.isTab && (this.tabRoles?.isTablist ?? true));
    ariaControls = $derived.by(() => (this.hasTabRole ? this.props.href?.replace('#', '') : undefined));
    readonly isTab: boolean;

    constructor(
        readonly props: Nav.LinkProps,
        readonly root: TabRootState | NavRootState,
        readonly tabRoles?: { readonly isTablist: boolean }
    ) {
        this.onclick = this.onclick.bind(this);
        this.isTab = root instanceof TabRootState;
        if (this.props.isActive) {
            this.root.setNavLinkActive(this.props.id || '');
        }
    }

    onclick(event: Event) {
        if (this.isTab && this.root instanceof TabRootState) {
            event.preventDefault();
            event.stopImmediatePropagation();
            const tabPaneId = this.props.href?.replace('#', '');
            if (tabPaneId) {
                this.root.setNavLinkActive(this.props.id || '');
                this.root.setTabPaneActive(tabPaneId);
            }
        } else if (this.props.href === '#' || this.props.href === '#!') {
            event.preventDefault();
            event.stopImmediatePropagation();
        } else {
            this.root.setNavLinkActive(this.props.id || '');
        }
    }
}

/**
 * Manages the state for the Tab root component.
 * Handles the tracking of active tab panes and provides methods to set them.
 */
export class TabRootState {
    #activeNavLinkId: string = $state('');
    #activeTabPaneId: string = $state('');
    #navLinkStates: NavLinkState[] = [];
    #tabPaneStates: TabPaneState[] = [];

    constructor(readonly props: Tab.RootProps) {
        this.isNavLinkActive = this.isNavLinkActive.bind(this);
        this.isTabPaneActive = this.isTabPaneActive.bind(this);
        this.registerNavLinkState = this.registerNavLinkState.bind(this);
        this.registerTabPaneState = this.registerTabPaneState.bind(this);
        this.setNavLinkActive = this.setNavLinkActive.bind(this);
        this.setTabPaneActive = this.setTabPaneActive.bind(this);
    }

    isNavLinkActive(navLinkId: string): boolean {
        return this.#activeNavLinkId === navLinkId;
    }
    isTabPaneActive(tabPaneId: string): boolean {
        return this.#activeTabPaneId === tabPaneId;
    }
    registerNavLinkState(linkState: NavLinkState): void {
        this.#navLinkStates.push(linkState);
    }
    registerTabPaneState(paneState: TabPaneState): void {
        this.#tabPaneStates.push(paneState);
    }
    setNavLinkActive(navLinkId: string): void {
        this.#activeNavLinkId = navLinkId;
    }
    setTabPaneActive(tabPaneId: string): void {
        this.#activeTabPaneId = tabPaneId;
    }
    getAriaLabelledBy(tabPaneId: string): string | undefined {
        const navLink = this.#navLinkStates.find((link) => link.props.href === `#${tabPaneId}`);
        return navLink ? navLink.props.id || undefined : undefined;
    }
}

/**
 * Manages the state for an individual Tab pane.
 * Tracks active state and provides methods to handle clicks.
 */
export class TabPaneState {
    isActive = $derived.by(() => this.root.isTabPaneActive(this.props.id || ''));
    ariaLabelledBy = $derived.by(() => this.root.getAriaLabelledBy(this.props.id || ''));
    constructor(
        readonly props: Tab.PaneProps,
        readonly root: TabRootState
    ) {
        if (this.props.isActive) {
            this.root.setTabPaneActive(this.props.id || '');
        }
    }
}

const NavRootContext = new Context<NavRootState>('nav-root');
const TabRootContext = new Context<TabRootState | null>('tab-root');

/**
 * Checks if the Tab root context exists.
 * @returns True if the Tab root context exists, false otherwise.
 */
export const doesTabRootContextExists = () => TabRootContext.getOr(null) !== null;

/** Prevent navigation in pane content from acting as the enclosing tab strip. */
export const clearTabRootContext = () => TabRootContext.set(null);

/** Capture contexts during initialization; read the resolved root role reactively. */
export function getTabRoleState(): { readonly isTablist: boolean } {
    const tabRoot = TabRootContext.getOr(null);
    const navRoot = NavRootContext.getOr(null);
    return {
        get isTablist() {
            return tabRoot !== null && (navRoot?.tabRoot === tabRoot ? navRoot.isTablist : true);
        }
    };
}

/**
 * Creates and initializes the Nav root state.
 * This function is used to set up the context for the Nav component.
 * @param props - The props for the Nav root component.
 * @returns The created NavRootState instance.
 */
export function initNavRootState(props: Nav.RootProps): NavRootState {
    const rootState = new NavRootState(props, TabRootContext.getOr(null));
    return NavRootContext.set(rootState);
}

/**
 * Creates and initializes the Tab root state.
 * This function is used to set up the context for the Tab component.
 * @param props - The props for the Tab root component.
 * @returns The created TabRootState instance.
 */
export function initTabRootState(props: Tab.RootProps): TabRootState {
    const rootState = new TabRootState(props);
    TabRootContext.set(rootState);
    return rootState;
}

/**
 * Creates and initializes the Nav link state.
 * This function is used to set up the context for the Nav link component.
 * @param props - The props for the Nav link component.
 * @returns The created NavLinkState instance.
 */
export function initNavLinkState(props: Nav.LinkProps): NavLinkState {
    const rootState = TabRootContext.getOr(null);
    if (rootState) {
        const linkState = new NavLinkState(props, rootState, getTabRoleState());
        rootState.registerNavLinkState(linkState);
        return linkState;
    } else if (!NavRootContext.exists()) {
        throw new Error(
            'Nav.Link requires Nav.Root or Tab.Root context. Please ensure either the Nav.Root or Tab.Root is initialized before Nav.Link.'
        );
    } else {
        const rootState = NavRootContext.get();
        const linkState = new NavLinkState(props, rootState);
        rootState.registerNavLinkState(linkState);
        return linkState;
    }
}

/**
 * Creates and initializes the Tab pane state.
 * This function is used to set up the context for the Tab pane component.
 * @param props - The props for the Tab pane component.
 * @returns The created TabPaneState instance.
 */
export function initTabPaneState(props: Tab.PaneProps): TabPaneState {
    const rootState = TabRootContext.getOr(null);
    if (!rootState) {
        throw new Error('Tab.Pane requires Tab.Root context. Please ensure Tab.Root is initialized before Tab.Pane.');
    }
    const paneState = new TabPaneState(props, rootState);
    rootState.registerTabPaneState(paneState);
    return paneState;
}

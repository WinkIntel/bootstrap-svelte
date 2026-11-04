import { Context } from '$lib/common/index.js';
import { onDestroy } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
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

    constructor(readonly props: Nav.RootProps) {
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
    isActive = $derived.by(() =>
        this.root instanceof TabRootState ? this.root.isNavLinkActive(this) : this.root.isNavLinkActive(this.props.id || '')
    );
    targetPaneId = $derived.by(() => this.props.href?.replace('#', ''));
    ariaControls = $derived.by(() => (this.isTab ? this.targetPaneId : undefined));
    readonly isTab: boolean;

    constructor(
        readonly props: Nav.LinkProps,
        readonly root: TabRootState | NavRootState,
        readonly isTabStrip = false
    ) {
        this.onclick = this.onclick.bind(this);
        this.isTab = root instanceof TabRootState;
        if (this.props.isActive) {
            if (this.root instanceof TabRootState) {
                if (this.isTabStrip) this.root.setNavLinkActive(this);
            } else {
                this.root.setNavLinkActive(this.props.id || '');
            }
        }
    }

    onclick(event: Event) {
        if (this.root instanceof TabRootState) {
            event.preventDefault();
            event.stopImmediatePropagation();
            const tabPaneId = this.targetPaneId;
            if (tabPaneId) {
                this.root.selectTabPane(tabPaneId, this);
            }
        } else if (this.props.href === '#' || this.props.href === '#!') {
            event.preventDefault();
            event.stopImmediatePropagation();
        } else {
            this.root.setNavLinkActive(this.props.id || '');
        }
    }
    deactivate(): void {
        if (this.root instanceof TabRootState) this.root.setNavLinkActive(null);
        else this.root.setNavLinkActive('');
    }
}

/**
 * Manages the state for the Tab root component.
 * Handles the tracking of active tab panes and provides methods to set them.
 */
export class TabRootState {
    #activeNavLink = $state<NavLinkState | null>(null);
    #activeTabPaneId: string = $state('');
    #navLinkStates = new SvelteSet<NavLinkState>();
    #tabPaneStates: TabPaneState[] = [];

    constructor(readonly props: Tab.RootProps) {
        this.isNavLinkActive = this.isNavLinkActive.bind(this);
        this.isTabPaneActive = this.isTabPaneActive.bind(this);
        this.registerNavLinkState = this.registerNavLinkState.bind(this);
        this.registerTabPaneState = this.registerTabPaneState.bind(this);
        this.setNavLinkActive = this.setNavLinkActive.bind(this);
        this.setTabPaneActive = this.setTabPaneActive.bind(this);
    }

    isNavLinkActive(navLink: NavLinkState): boolean {
        return this.#activeNavLink === navLink;
    }
    isTabPaneActive(tabPaneId: string): boolean {
        return this.#activeTabPaneId === tabPaneId;
    }
    registerNavLinkState(linkState: NavLinkState): () => void {
        this.#navLinkStates.add(linkState);
        return () => {
            if (!this.#navLinkStates.delete(linkState)) return;
            if (this.isNavLinkActive(linkState)) {
                this.setNavLinkActive(this.#getTabStripLink(this.#activeTabPaneId) ?? null);
            }
        };
    }
    registerTabPaneState(paneState: TabPaneState): void {
        this.#tabPaneStates.push(paneState);
    }
    setNavLinkActive(navLink: NavLinkState | null): void {
        this.#activeNavLink = navLink;
    }
    setTabPaneActive(tabPaneId: string): void {
        this.#activeTabPaneId = tabPaneId;
    }
    /** Prefer a clicked strip link, then the current matching strip link, then registration order. */
    #getTabStripLink(tabPaneId: string, preferred?: NavLinkState): NavLinkState | undefined {
        const matches = (link: NavLinkState) => link.isTabStrip && link.targetPaneId === tabPaneId;
        if (preferred && this.#navLinkStates.has(preferred) && matches(preferred)) return preferred;
        let first: NavLinkState | undefined;
        for (const link of this.#navLinkStates) {
            if (!matches(link)) continue;
            if (this.isNavLinkActive(link)) return link;
            first ??= link;
        }
        return first;
    }
    selectTabPane(tabPaneId: string, source: NavLinkState): void {
        this.setNavLinkActive(this.#getTabStripLink(tabPaneId, source) ?? null);
        this.setTabPaneActive(tabPaneId);
    }
    getAriaLabelledBy(tabPaneId: string): string | undefined {
        return this.#getTabStripLink(tabPaneId)?.props.id || undefined;
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
const TabRootContext = new Context<TabRootState>('tab-root');
// Selection eligibility only: this marker does not change legacy tab roles or link routing.
const TabPaneSelectionRootContext = new Context<TabRootState>('tab-pane-selection-root');

/**
 * Checks if the Tab root context exists.
 * @returns True if the Tab root context exists, false otherwise.
 */
export const doesTabRootContextExists = () => TabRootContext.exists();

/**
 * Creates and initializes the Nav root state.
 * This function is used to set up the context for the Nav component.
 * @param props - The props for the Nav root component.
 * @returns The created NavRootState instance.
 */
export function initNavRootState(props: Nav.RootProps): NavRootState {
    const rootState = new NavRootState(props);
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
    return TabRootContext.set(rootState);
}

/**
 * Creates and initializes the Nav link state.
 * This function is used to set up the context for the Nav link component.
 * @param props - The props for the Nav link component.
 * @returns The created NavLinkState instance.
 */
export function initNavLinkState(props: Nav.LinkProps): NavLinkState {
    if (TabRootContext.exists()) {
        const rootState = TabRootContext.get();
        // A nested Tab.Root differs from the enclosing pane's root and starts its own strip.
        const linkState = new NavLinkState(props, rootState, TabPaneSelectionRootContext.getOr(null) !== rootState);
        onDestroy(rootState.registerNavLinkState(linkState));
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
    if (!TabRootContext.exists()) {
        throw new Error('Tab.Pane requires Tab.Root context. Please ensure Tab.Root is initialized before Tab.Pane.');
    }
    const rootState = TabRootContext.get();
    const paneState = new TabPaneState(props, rootState);
    rootState.registerTabPaneState(paneState);
    TabPaneSelectionRootContext.set(rootState);
    return paneState;
}

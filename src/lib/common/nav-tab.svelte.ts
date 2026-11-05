import { Context } from '$lib/common/index.js';
import { onDestroy } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import type { Nav } from '../Nav/index.js';
import type { Navbar } from '../Navbar/index.js';
import type { Tab } from '../Tab/index.js';

/**
 * Manages the state for the Nav root component.
 * Handles the tracking of active nav links and provides methods to set them.
 * Supports both tab and non-tab navigation.
 */
export class NavRootState {
    #activeNavLinkId: string = $state('');

    get isTablist(): boolean {
        return this.props.role === 'tablist';
    }

    constructor(
        readonly props: Nav.RootProps | Navbar.NavProps,
        readonly tabRoot: TabRootState | null = null,
        readonly tabPaneRoot: TabRootState | null = null
    ) {
        this.isNavLinkActive = this.isNavLinkActive.bind(this);
        this.setNavLinkActive = this.setNavLinkActive.bind(this);
    }

    isNavLinkActive(navLinkId: string): boolean {
        return this.#activeNavLinkId === navLinkId;
    }
    setNavLinkActive(navLinkId: string): void {
        this.#activeNavLinkId = navLinkId;
    }
}

type NavLinkStateProps = Omit<Nav.LinkProps, 'role'> & { role?: Tab.NavLinkProps['role'] };

/**
 * Manages the state for an individual Nav link.
 * Tracks active state and provides methods to handle clicks.
 */
export class NavLinkState {
    isActive = $derived.by(() =>
        this.root instanceof TabRootState ? this.root.isNavLinkActive(this) : this.root.isNavLinkActive(this.props.id || '')
    );
    // The explicit role (including null) wins over inferred semantics.
    role = $derived.by(() => (this.props.role !== undefined ? this.props.role : this.isTab && this.tabRoles?.isTablist ? 'tab' : undefined));
    hasTabRole = $derived.by(() => this.isTab && !!this.tabRoles?.isTablist && this.role === 'tab');
    element = $state<HTMLElement | null>(null);
    renderedActive = $derived.by(() => (this.controlledActive && this.props.isActive !== undefined ? this.props.isActive : this.isActive));
    tabIndex = $derived.by(() => (this.root instanceof TabRootState && this.isTabStrip && this.hasTabRole ? this.root.getTabIndex(this) : undefined));
    targetPaneId = $derived.by(() => this.props.href?.replace('#', ''));
    ariaControls = $derived.by(() => (this.hasTabRole ? this.targetPaneId : undefined));
    readonly isTab: boolean;

    constructor(
        readonly props: NavLinkStateProps,
        readonly root: TabRootState | NavRootState,
        readonly tabRoles?: { readonly isTablist: boolean; readonly hasTablistContext: boolean; readonly group: object },
        readonly isTabStrip = false,
        readonly controlledActive = false
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
    onkeydown(event: KeyboardEvent): void {
        if (event.defaultPrevented || this.props.isDisabled || event.target !== this.element) return;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) return;
        if (this.root instanceof TabRootState && this.isTabStrip && this.hasTabRole) this.root.onkeydown(event, this);
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
    #domOrder = $state(0);
    #flushTabOrder: (() => void) | undefined;
    #orderedStripLinks = $derived.by(() => {
        // Share ordering across all tab stops; selection and current DOM groups
        // are resolved separately and do not need another sort.
        void this.#domOrder;
        const links = this.#eligibleStripLinks();
        // Track every binding even if sort skips its comparator for a singleton
        // or short-circuits on another link's null element during mount/SSR.
        for (const link of links) void link.element;
        return links.sort((a, b) => {
            const elementA = a.element;
            const elementB = b.element;
            if (!elementA) return elementB ? 1 : 0;
            if (!elementB) return -1;
            const position = elementA.compareDocumentPosition(elementB);
            return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : position & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
        });
    });

    constructor(readonly props: Tab.RootProps) {
        this.isNavLinkActive = this.isNavLinkActive.bind(this);
        this.isTabPaneActive = this.isTabPaneActive.bind(this);
        this.registerNavLinkState = this.registerNavLinkState.bind(this);
        this.setNavLinkActive = this.setNavLinkActive.bind(this);
        this.setTabPaneActive = this.setTabPaneActive.bind(this);
        this.observeTabOrder = this.observeTabOrder.bind(this);
    }

    /** Observe only this root, including temporarily empty or bare tab groups. */
    observeTabOrder(element: HTMLElement): () => void {
        const updateOrder = (records: MutationRecord[]) => {
            if (records.length === 0) return;
            const elements = [...this.#navLinkStates].flatMap((link) => (link.isTabStrip && link.element ? [link.element] : []));
            const membershipChanged = records.some((record) =>
                record.type === 'attributes'
                    ? elements.some((element) => record.target.contains(element))
                    : [...record.addedNodes, ...record.removedNodes].some((node) => elements.some((element) => node.contains(element)))
            );
            // Label-only changes cannot affect link order or ancestor tablist roles.
            if (membershipChanged) this.#domOrder++;
        };
        const observer = new MutationObserver(updateOrder);
        const flush = () => updateOrder(observer.takeRecords());
        this.#flushTabOrder = flush;
        observer.observe(element, { childList: true, subtree: true, attributes: true, attributeFilter: ['role'] });
        return () => {
            observer.disconnect();
            if (this.#flushTabOrder === flush) this.#flushTabOrder = undefined;
        };
    }

    #eligibleStripLinks(): NavLinkState[] {
        return [...this.#navLinkStates].filter((link) => link.isTabStrip && link.hasTabRole && !link.props.isDisabled);
    }

    #keyboardLinks(source: NavLinkState): NavLinkState[] {
        const group = (link: NavLinkState) => link.element?.closest('[role="tablist"]') ?? link.tabRoles?.group;
        const sourceGroup = group(source);
        // Read the scoped DOM revision so reactive tabindex also follows keyed moves.
        void this.#domOrder;
        // SSR registers siblings sequentially without reactive set invalidation.
        // Unbound sources need fresh insertion order, not cached DOM ordering.
        const links = source.element ? this.#orderedStripLinks : this.#eligibleStripLinks();
        return links.filter((link) => group(link) === sourceGroup);
    }
    getTabIndex(source: NavLinkState): number | undefined {
        // Bare strip links retain native tab stops. Before mount, only a real
        // Nav.Root context can establish a tablist; authored lists opt in on mount.
        void this.#domOrder;
        if (source.element ? !source.element.closest('[role="tablist"]') : !source.tabRoles?.hasTablistContext) return undefined;
        const links = this.#keyboardLinks(source);
        const selected = links.find((link) => link.renderedActive);
        // During SSR later siblings are not registered yet. Only selected links
        // receive an entry point; the no-selection fallback is set after mount.
        const entry = selected ?? (source.element ? links[0] : undefined);
        return source === entry ? 0 : -1;
    }
    onkeydown(event: KeyboardEvent, source: NavLinkState): void {
        if (!source.element?.closest('[role="tablist"]')) return;
        const { key } = event;
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;
        // An earlier keydown listener may move links before observer delivery.
        this.#flushTabOrder?.();
        const links = this.#keyboardLinks(source);
        const index = links.indexOf(source);
        if (index === -1) return;
        const next =
            key === 'Home'
                ? 0
                : key === 'End'
                  ? links.length - 1
                  : (index + (key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        event.preventDefault();
        event.stopPropagation();
        const destination = links[next]!;
        destination.element?.click();
        destination.element?.focus({ preventScroll: true });
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
// Set by Tab.Pane to its root: descendants keep that real Tab root but are outside its navigation strip.
const TabPaneRootContext = new Context<TabRootState>('tab-pane-root');

/** A nested Tab.Root differs from the enclosing pane's root, so it starts its own strip. */
function getTabStripRoot(): TabRootState | null {
    const tabRoot = TabRootContext.getOr(null);
    return tabRoot === TabPaneRootContext.getOr(null) ? null : tabRoot;
}

/**
 * Checks if the current component is in a Tab root's navigation strip.
 * @returns True if a Tab root exists and the component is outside its panes, false otherwise.
 */
export const isInTabStrip = () => getTabStripRoot() !== null;

/** Capture contexts during initialization; read the resolved root role reactively. */
export function getTabRoleState(): { readonly isTablist: boolean; readonly hasTablistContext: boolean; readonly group: object } {
    const tabRoot = getTabStripRoot();
    const navRoot = NavRootContext.getOr(null);
    return {
        group: navRoot?.tabRoot === tabRoot ? navRoot : (tabRoot ?? {}),
        get hasTablistContext() {
            return tabRoot !== null && navRoot?.tabRoot === tabRoot && navRoot.isTablist;
        },
        get isTablist() {
            return tabRoot !== null && (navRoot?.tabRoot === tabRoot ? navRoot.isTablist : true);
        }
    };
}

/**
 * Creates and initializes the Nav root state.
 * This function is used to set up the context for the Nav component.
 * @param props - The props for the Nav.Root or Navbar.Nav component.
 * @returns The created NavRootState instance.
 */
export function initNavRootState(props: Nav.RootProps | Navbar.NavProps): NavRootState {
    const rootState = new NavRootState(props, TabRootContext.getOr(null), TabPaneRootContext.getOr(null));
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
 * @param isTabNavLink - Whether the link is a Tab.NavLink, which always targets the nearest Tab root if there is one.
 * @returns The created NavLinkState instance.
 */
export function initNavLinkState(props: NavLinkStateProps, isTabNavLink = false): NavLinkState {
    const rootState = TabRootContext.getOr(null);
    // A Nav.Link under a Nav.Root in this Tab root's pane content is ordinary navigation.
    if (rootState && (isTabNavLink || NavRootContext.getOr(null)?.tabPaneRoot !== rootState)) {
        const linkState = new NavLinkState(props, rootState, getTabRoleState(), getTabStripRoot() === rootState, !isTabNavLink);
        onDestroy(rootState.registerNavLinkState(linkState));
        return linkState;
    } else if (!NavRootContext.exists()) {
        throw new Error(
            'Nav.Link requires Nav.Root or Tab.Root context. Please ensure either the Nav.Root or Tab.Root is initialized before Nav.Link.'
        );
    } else {
        const rootState = NavRootContext.get();
        const linkState = new NavLinkState(props, rootState, undefined, false, true);
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
    TabPaneRootContext.set(rootState);
    return paneState;
}

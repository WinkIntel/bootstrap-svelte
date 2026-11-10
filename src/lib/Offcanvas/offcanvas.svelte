<!--
@component
## Offcanvas
Build hidden sidebars into your project for navigation, shopping carts, and more with the Bootstrap Offcanvas component.

@example
```svelte
<Offcanvas.Root placement="start" isShown={true}>
    <Offcanvas.Header>
        <Offcanvas.Title>Offcanvas Title</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
        Content for the offcanvas goes here. You can place just about any Bootstrap component or custom elements here.
    </Offcanvas.Body>
</Offcanvas.Root>
```

#### Placement options
```svelte
<Offcanvas.Root placement="start">...</Offcanvas.Root>
<Offcanvas.Root placement="end">...</Offcanvas.Root>
<Offcanvas.Root placement="top">...</Offcanvas.Root>
<Offcanvas.Root placement="bottom">...</Offcanvas.Root>
```

#### Body scrolling
```svelte
<Offcanvas.Root isBodyScrollable={true}>...</Offcanvas.Root>
```

#### Static backdrop
```svelte
<Offcanvas.Root useBackdrop="static">...</Offcanvas.Root>
```

#### Responsive offcanvas
```svelte
<Offcanvas.Root showOnBreakpoint="lg">...</Offcanvas.Root>
```

### Lifecycle callbacks and accessibility
Use `onShow`, `onShown`, `onHide`, and `onHidden` for component lifecycle notifications.
These are the recommended callbacks for responding when the component starts or finishes showing or hiding.
The component owns `role="dialog"` in overlay mode and omits it when shown inline at its responsive breakpoint.
Modal overlays own `aria-modal`, enter focus, contain Tab/Shift+Tab, and restore focus on dismissal or removal.
A scrollable panel with `useBackdrop={false}` is nonmodal and leaves page focus usable without entry, trapping or restoration.
Inline crossings stop focus management without moving focus out of the still-visible panel, unless a surviving modal overlay needs focus. Entry preserves available
consumer-placed focus and otherwise prefers an available explicit autofocus target (including programmatic tabindex=-1)
before the first sequential control or the panel itself.
The first mounted `Offcanvas.Title` supplies an overlay panel's accessible name unless an explicit `aria-label` or
`aria-labelledby` is provided (including null or empty opt-outs). Generated inline names are omitted; explicit attributes remain configurable.
Provide a Title or an explicit name; a panel without either remains unnamed. Supply an explicit `aria-label` or `aria-labelledby`
if an initially shown panel must be named in server-rendered markup before hydration.
Open shadow focus scopes remain traversable; embedded sequential escapes are recovered when focus returns to the
containing document. Closed-shadow internals, complex slots, cross-origin internals, browser-chrome exits and other-browser keyboard settings remain unverified.

### Props
- `children` (slot): Content to display inside the offcanvas.
- `class` (string): Optional. Additional CSS classes.
- `dir` (string): Optional. Text direction ('ltr' or 'rtl').
- `elementRef` (HTMLElement): Optional. Reference to the offcanvas DOM element.
- `id` (string): Optional. ID for the offcanvas element.
- `isBodyScrollable` (boolean): Optional. Enables body scrolling when offcanvas is open.
- `isKeyboardDismissible` (boolean): Optional. Enables dismissing the offcanvas on Escape key press.
- `isShown` (boolean): Optional. Controls whether the offcanvas is visible.
- `placement` (string): Optional. Position of the offcanvas ('start', 'end', 'top', 'bottom').
- `showOnBreakpoint` (string): Optional. Show inline at or above 'sm', 'md', 'lg', 'xl', or 'xxl'. When omitted, inherit the parent Navbar's mode or remain a standalone overlay. Legacy runtime 'xs' is treated as omitted; Bootstrap has no offcanvas-xs class.
- `triggerElements` (readonly Element array | null): Optional. DOM references to consumer-controlled triggers; null/undefined entries are allowed. A null list means no triggers. Enabled primary presses leave visibility to the consumer click handler. Remove a reference to revoke ownership; detached nodes are ignored. Does not set ARIA or stacking styles.
- `useBackdrop` (boolean): Optional. Controls whether to show a backdrop when the offcanvas is open.
- `onHide` (function): Optional. Callback function when the offcanvas is hidden.
- `onHidePrevented` (function): Optional. Callback function when the offcanvas hide is prevented.
- `onHidden` (function): Optional. Callback function when the offcanvas is completely hidden.
- `onShow` (function): Optional. Callback function when the offcanvas is shown.
- `onShown` (function): Optional. Callback function when the offcanvas is completely shown.
-->
<script lang="ts">
    import { initialShow } from '$lib/common/initial-show.js';
    import { noop, uniqueClsx } from '$lib/common/index.js';
    import { initOffcanvasRootState, OffcanvasRootState } from '$lib/common/navbar-offcanvas.svelte.js';
    import {
        focusTopOverlay,
        isFocusInTopOverlay,
        isTopOverlay,
        registerOverlay,
        unregisterOverlay,
        type OverlayStackEntry
    } from '$lib/common/overlay-stack.js';
    import { acquireBodyScrollLock, releaseBodyScrollLock } from '$lib/common/scrollbar.js';
    import { onDestroy, onMount, tick } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import type { Offcanvas } from './index.js';

    // Generate a unique ID for the offcanvas element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        dir = 'ltr',
        elementRef = $bindable(null),
        id = `offcanvas-${uid}`,
        isBodyScrollable = false,
        isKeyboardDismissible = true,
        isShown = false,
        placement = 'start',
        showOnBreakpoint,
        triggerElements = [],
        useBackdrop = true,
        onintrostart: onIntroStart,
        onintroend: onIntroEnd,
        onoutrostart: onOutroStart,
        onoutroend: onOutroEnd,
        onHide = noop,
        onHidePrevented = noop,
        onHidden = noop,
        onShow = noop,
        onShown = noop,
        ...restOfProps
    }: Offcanvas.RootProps = $props();

    // Initialize the root state of the offcanvas component...
    let bodyElement: HTMLElement | null = $state(null);
    let panelElement: HTMLDivElement | null = $state(null);
    let backdropElement: HTMLDivElement | null = $state(null);
    // Keep containment private while preserving the public ref, including bind:this cleanup.
    function setPanelElement(element: HTMLDivElement | null) {
        panelElement = element;
        if (elementRef !== element) elementRef = element;
    }
    let holdsScrollLock = false;
    let mounted = false;
    let focusGeneration = 0;
    let pendingTab: { reverse: boolean; generation: number } | null = null;
    let tabFrame: number | undefined;
    let embeddedFocus: { element: HTMLElement; generation: number } | null = null;
    let previouslyFocusedElement: HTMLElement | null = null;
    let overlayZIndex: number | undefined = $state(undefined);
    let backdropZIndex: number | undefined = $state(undefined);
    const unset = Symbol('unset');
    let previousIsShown: Offcanvas.RootProps['isShown'] | typeof unset = unset;
    let previousRootIsOverlayShown = false;
    let previousRootFocusManaged = false;
    let previousUseBackdrop: Offcanvas.RootProps['useBackdrop'] | typeof unset = unset;
    const rootState: OffcanvasRootState = initOffcanvasRootState({
        get id() {
            return id;
        },
        get isShown() {
            return isShown;
        },
        get showOnBreakpoint() {
            return showOnBreakpoint;
        },
        get useBackdrop() {
            return useBackdrop;
        }
    });
    const isFocusModal = $derived(!isBodyScrollable || rootState.useBackdrop !== false);
    const overlayEntry: OverlayStackEntry = {
        baseBackdropZIndex: 1040,
        baseOverlayZIndex: 1045,
        containsActiveElement: () => !!panelElement?.contains(document.activeElement),
        focus: focusPanel,
        onKeydown: handleKeydown,
        setLayers: (nextOverlayZIndex, nextBackdropZIndex) => {
            overlayZIndex = nextOverlayZIndex;
            backdropZIndex = nextBackdropZIndex;
        }
    };

    // Set up the derived state for the offcanvas component...
    let flyX: string | undefined = $derived.by(() => {
        if (placement === 'start' && dir === 'ltr') return '-100%';
        if (placement === 'end' && dir === 'ltr') return '100%';
        if (placement === 'start' && dir === 'rtl') return '100%';
        if (placement === 'end' && dir === 'rtl') return '-100%';
        return undefined;
    });
    let flyY: string | undefined = $derived.by(() => {
        if (placement === 'top') return '-100%';
        if (placement === 'bottom') return '100%';
        return undefined;
    });
    let hasShownOnBreakpoint = $derived(!!rootState.showOnBreakpoint); // !! to convert to boolean
    let hasPlacement = $derived(!!placement); // !! to convert to boolean

    // Derived classes for the offcanvas component...
    let backDropClasses: string = $derived(uniqueClsx('offcanvas-backdrop', 'fade', { show: rootState.isShown }));
    let classes: string = $derived(
        uniqueClsx(
            {
                offcanvas: !hasShownOnBreakpoint,
                [`offcanvas-${rootState.showOnBreakpoint}`]: hasShownOnBreakpoint,
                [`offcanvas-${placement}`]: hasPlacement,
                show: rootState.isShown
            },
            classValues
        )
    );

    // Listen changes to the isShown prop and update the root state accordingly...
    $effect(() => {
        if (previousIsShown !== unset && previousIsShown !== isShown) {
            // Sync the explicit value, even when a matching breakpoint already makes the panel visible.
            rootState.isShown = isShown;
        }

        previousIsShown = isShown;
    });

    // Listen changes to the useBackdrop prop and update the root state accordingly...
    $effect(() => {
        if (previousUseBackdrop !== unset && previousUseBackdrop !== useBackdrop) {
            if (useBackdrop !== rootState.useBackdrop) {
                rootState.useBackdrop = useBackdrop;
            }
        }

        previousUseBackdrop = useBackdrop;
    });

    $effect(() => {
        const isOverlayShown = rootState.isShown && !rootState.isMediaQueryMatched;
        const shouldManageFocus = isOverlayShown && isFocusModal;
        if (isOverlayShown && !previousRootIsOverlayShown) {
            registerOverlay(overlayEntry);
        } else if (!isOverlayShown && previousRootIsOverlayShown) {
            leaveOverlay(!rootState.isMediaQueryMatched);
        }
        if (shouldManageFocus && !previousRootFocusManaged) {
            focusGeneration++;
            const active = document.activeElement;
            previouslyFocusedElement = active && 'focus' in active ? (active as HTMLElement) : null;
            void focusPanel();
        } else if (!shouldManageFocus && previousRootFocusManaged && isOverlayShown) {
            // A scrollable, backdrop-free panel remains in the stack but leaves the page keyboard-accessible.
            cancelFocusSession();
        }
        previousRootIsOverlayShown = isOverlayShown;
        previousRootFocusManaged = shouldManageFocus;
    });

    function isHtmlTag<K extends keyof HTMLElementTagNameMap>(element: Element | null, tag: K): element is HTMLElementTagNameMap[K] {
        return element?.namespaceURI === 'http://www.w3.org/1999/xhtml' && element.localName === tag;
    }

    // Reject unavailable candidates without relying on geometry (which differs in SSR/test DOMs).
    function isAvailable(element: HTMLElement, nativeOwnership = false): boolean {
        if (!element.isConnected || element.matches(':disabled, [disabled], input[type="hidden"]')) return false;
        const elementStyle = (element.ownerDocument.defaultView ?? window).getComputedStyle(element);
        if (elementStyle.display === 'contents' || elementStyle.visibility === 'hidden' || elementStyle.visibility === 'collapse') return false;
        for (let ancestor: HTMLElement | null = element; ancestor; ancestor = getComposedParent(ancestor)) {
            if (ancestor.matches('[hidden], [inert]') || (!nativeOwnership && ancestor.matches('[aria-hidden="true"]'))) return false;
            // Closed details expose only their first summary (and its descendants).
            if (isHtmlTag(ancestor, 'details') && !ancestor.open && ancestor !== element) {
                const summary: Element | undefined = Array.from(ancestor.children).find((child) => child.tagName === 'SUMMARY');
                if (!summary?.contains(element)) return false;
            }
            const style = (ancestor.ownerDocument.defaultView ?? window).getComputedStyle(ancestor);
            // Visibility is inherited but can be overridden by a child; display/content suppression cannot.
            if (style.display === 'none' || (ancestor !== element && style.contentVisibility === 'hidden')) return false;
        }
        return true;
    }

    function getComposedParent(element: HTMLElement): HTMLElement | null {
        const root = element.getRootNode();
        return (
            element.assignedSlot ??
            element.parentElement ??
            (root.nodeType === 11 && 'host' in root ? ((root as ShadowRoot).host as HTMLElement) : null)
        );
    }

    function isSequentiallyFocusable(element: HTMLElement): boolean {
        // A resource-less object can accept programmatic focus while native Tab skips it.
        if (isHtmlTag(element, 'object') && !element.data) return false;
        if (isHtmlTag(element, 'a') && !element.hasAttribute('href') && !element.hasAttribute('tabindex')) return false;
        if (element.tagName === 'SUMMARY' && isHtmlTag(element.parentElement, 'details')) {
            const firstSummary = Array.from(element.parentElement.children).find((child) => child.tagName === 'SUMMARY');
            if (element !== firstSummary && !element.hasAttribute('tabindex')) return false;
        }
        if (element.tabIndex >= 0) return true;
        if (element.hasAttribute('tabindex')) return false;
        // Browsers report -1 for default contenteditable tabIndex, despite it being a native Tab stop.
        const editable = element.getAttribute('contenteditable')?.toLowerCase();
        if (editable !== '' && editable !== 'true' && editable !== 'plaintext-only') return false;
        for (let parent = element.parentElement; parent; parent = getComposedParent(parent)) {
            const value = parent.getAttribute('contenteditable')?.toLowerCase();
            if (value === 'false') return true;
            if (value === '' || value === 'true' || value === 'plaintext-only') return false;
        }
        return true;
    }

    // Preserve native focus scopes: each shadow host/slot keeps its own ordered descendants together.
    function collectFocusScope(scope: ParentNode): HTMLElement[] {
        const items: { element: HTMLElement; targets: HTMLElement[] }[] = [];
        function visit(node: Element): void {
            const element = node as HTMLElement;
            if (element.shadowRoot) {
                if (element.hasAttribute('tabindex') && element.tabIndex < 0) return;
                const children = collectFocusScope(element.shadowRoot);
                const own = isSequentiallyFocusable(element) && isAvailable(element) ? [element] : [];
                if (own.length || children.length) items.push({ element, targets: [...own, ...children] });
                return;
            }
            if (isHtmlTag(element, 'slot')) {
                const assigned = element.assignedElements({ flatten: true });
                const children = assigned.length ? assigned : Array.from(element.children);
                // Assigned nodes form a nested focus scope rather than joining the outer positive-tabindex sort.
                const targets = collectElements(children);
                if (targets.length) items.push({ element, targets });
                return;
            }
            if (isSequentiallyFocusable(element) && isAvailable(element)) items.push({ element, targets: [element] });
            Array.from(element.children).forEach(visit);
        }
        function collectElements(elements: Element[]): HTMLElement[] {
            const previous = items.splice(0);
            elements.forEach(visit);
            const result = orderedTargets();
            items.splice(0, items.length, ...previous);
            return result;
        }
        function orderedTargets(): HTMLElement[] {
            return items
                .sort((a, b) => {
                    const aOrder = a.element.tabIndex > 0 ? a.element.tabIndex : Number.POSITIVE_INFINITY;
                    const bOrder = b.element.tabIndex > 0 ? b.element.tabIndex : Number.POSITIVE_INFINITY;
                    return aOrder === bOrder ? 0 : aOrder - bOrder;
                })
                .flatMap((item) => item.targets);
        }
        Array.from(scope.children).forEach(visit);
        return orderedTargets();
    }

    function getFocusableElements(reverse = false, activeElement: Element | null = null, scope: ParentNode | null = panelElement): HTMLElement[] {
        const candidates = scope ? collectFocusScope(scope) : [];
        return candidates.filter((element) => {
            if (!isHtmlTag(element, 'input') || element.type !== 'radio' || !element.name) return true;
            const sameGroup = (candidate: HTMLElement): candidate is HTMLInputElement =>
                isHtmlTag(candidate, 'input') &&
                candidate.type === 'radio' &&
                candidate.name === element.name &&
                candidate.form === element.form &&
                candidate.getRootNode() === element.getRootNode();
            const tree = element.getRootNode() as Document | ShadowRoot;
            const checked = Array.from(tree.querySelectorAll<HTMLInputElement>('input[type="radio"]')).find(
                // ARIA exclusion does not erase native group ownership, even when the owner is outside the panel.
                (radio) => sameGroup(radio) && radio.checked && isSequentiallyFocusable(radio) && isAvailable(radio, true)
            );
            if (checked) return element === checked;
            const group = candidates.filter(sameGroup);
            const current = group.find((radio) => radio === activeElement);
            return element === (current ?? (reverse ? group.at(-1) : group[0]));
        });
    }

    function getDeepActiveElement(ownerDocument: Document = document): Element | null {
        let active = ownerDocument.activeElement;
        while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
        return active;
    }

    function focusBoundary(reverse: boolean): void {
        const candidates = getFocusableElements(reverse);
        if (reverse) candidates.reverse();
        for (const candidate of candidates) {
            let target = candidate;
            // Same-origin contexts can use their actual edge; opaque contexts remain native browsing-context stops.
            try {
                const childDocument = isHtmlTag(candidate, 'iframe') || isHtmlTag(candidate, 'object') ? candidate.contentDocument : null;
                if (childDocument) {
                    const children = getFocusableElements(reverse, null, childDocument);
                    target = (reverse ? children.at(-1) : children[0]) ?? candidate;
                }
            } catch {
                /* Cross-origin documents do not need inspection for outer containment. */
            }
            if (target !== candidate) candidate.focus({ preventScroll: true });
            target.focus({ preventScroll: true });
            if (panelElement?.contains(document.activeElement) && getDeepActiveElement(target.ownerDocument) === target) return;
        }
        panelElement?.focus({ preventScroll: true });
    }

    function isOverlayActive(): boolean {
        return mounted && isFocusModal && rootState.isShown && !rootState.isMediaQueryMatched && isTopOverlay(overlayEntry);
    }

    function clearNativeFocusTracking(): void {
        pendingTab = null;
        embeddedFocus = null;
        if (tabFrame !== undefined) cancelAnimationFrame(tabFrame);
        tabFrame = undefined;
    }

    function trackNativeTab(event: KeyboardEvent): void {
        const token = { reverse: event.shiftKey, generation: focusGeneration };
        pendingTab = token;
        if (tabFrame !== undefined) cancelAnimationFrame(tabFrame);
        tabFrame = requestAnimationFrame(() => {
            if (pendingTab === token) pendingTab = null;
            tabFrame = undefined;
        });
    }

    function trackEmbeddedFocus(): void {
        const active = document.activeElement;
        if (isOverlayActive() && panelElement?.contains(active) && (isHtmlTag(active, 'iframe') || isHtmlTag(active, 'object'))) {
            embeddedFocus = { element: active, generation: focusGeneration };
        }
    }

    function handleFocusIn(event: FocusEvent): void {
        if (!isOverlayActive() || (event.target as Node | null)?.nodeType !== 1 || !panelElement) return;
        const target = event.target as Element;
        if (panelElement.contains(target)) {
            embeddedFocus = null;
            trackEmbeddedFocus();
            return;
        }
        const tab = pendingTab?.generation === focusGeneration ? pendingTab : null;
        const fromContext = embeddedFocus?.generation === focusGeneration && panelElement.contains(embeddedFocus.element);
        if (!tab && !fromContext) return;
        const reverse = tab?.reverse ?? !!(panelElement.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_PRECEDING);
        clearNativeFocusTracking();
        focusBoundary(reverse);
    }

    async function focusPanel(): Promise<void> {
        const generation = focusGeneration;
        await tick();
        // A settled task belongs to one overlay session, never to a subsequent open or another top overlay.
        if (generation !== focusGeneration || !isOverlayActive()) return;
        const active = getDeepActiveElement();
        if (panelElement?.contains(document.activeElement) && active && isAvailable(active as HTMLElement)) return;
        // Explicit entry focus can be programmatic (for example a heading with tabindex=-1).
        for (const autofocus of panelElement?.querySelectorAll<HTMLElement>('[autofocus]') ?? []) {
            if (!isAvailable(autofocus)) continue;
            autofocus.focus({ preventScroll: true });
            if (getDeepActiveElement(autofocus.ownerDocument) === autofocus) return;
        }
        focusBoundary(false);
    }

    function cancelFocusSession(): HTMLElement | null {
        clearNativeFocusTracking();
        focusGeneration++;
        const opener = previouslyFocusedElement;
        previouslyFocusedElement = null;
        return opener;
    }

    function leaveOverlay(restoreFocus = !rootState.isMediaQueryMatched && isFocusModal): void {
        const opener = cancelFocusSession();
        const wasTopOverlay = isTopOverlay(overlayEntry);
        unregisterOverlay(overlayEntry);
        if (!wasTopOverlay || isFocusInTopOverlay()) return;
        if (restoreFocus && previousRootFocusManaged && opener && isAvailable(opener)) opener.focus({ preventScroll: true });
        if (!isFocusInTopOverlay()) focusTopOverlay();
    }

    function trapFocus(event: KeyboardEvent): void {
        const active = getDeepActiveElement();
        const candidates = getFocusableElements(event.shiftKey, active);
        const first = candidates[0] ?? panelElement;
        const last = candidates.at(-1) ?? panelElement;
        // Internal programmatic/native noncandidates retain their native next position; escape recovery handles their outer boundary.
        const isInside = panelElement?.contains(document.activeElement);
        const isEmptyPanel = active === panelElement && candidates.length === 0;
        if (!isInside || isEmptyPanel || (candidates.includes(active as HTMLElement) && (event.shiftKey ? active === first : active === last))) {
            event.preventDefault();
            focusBoundary(event.shiftKey);
        }
    }

    // Get the body element when the component is mounted...
    onMount(() => {
        mounted = true;
        if (typeof window !== 'undefined') {
            bodyElement = document.querySelector('body');
        }
        document.addEventListener('focusin', handleFocusIn, true);
        window.addEventListener('blur', trackEmbeddedFocus);
        document.addEventListener('pointerdown', clearNativeFocusTracking, true);
        document.addEventListener('mousedown', clearNativeFocusTracking, true);
        return () => {
            document.removeEventListener('focusin', handleFocusIn, true);
            window.removeEventListener('blur', trackEmbeddedFocus);
            document.removeEventListener('pointerdown', clearNativeFocusTracking, true);
            document.removeEventListener('mousedown', clearNativeFocusTracking, true);
        };
    });

    // Breakpoint and scrolling-option changes can enter or leave overlay mode without an intro/outro.
    $effect(() => {
        const isMediaQueryMatched = rootState.isMediaQueryMatched;
        const shouldLockScroll = rootState.isShown && !isMediaQueryMatched && !isBodyScrollable;
        if (!bodyElement) return;

        if (shouldLockScroll && !holdsScrollLock) {
            acquireBodyScrollLock(bodyElement);
            holdsScrollLock = true;
        } else if (holdsScrollLock && (isMediaQueryMatched || isBodyScrollable)) {
            releaseBodyScrollLock(bodyElement);
            holdsScrollLock = false;
        }
        // A normal dismissal keeps its lock until handleOnHidden completes the outro.
    });

    // Listen to the transition events to properly manage the body scrollbar...
    const handleOnHidden: EventListener = (event: Event) => {
        if (holdsScrollLock && bodyElement) {
            releaseBodyScrollLock(bodyElement);
            holdsScrollLock = false;
        }
        onHidden.call(event.currentTarget, event);
    };

    // Release a held scroll lock if the offcanvas is destroyed while shown,
    // so a removed-while-open offcanvas doesn't permanently disable body
    // scrolling...
    onDestroy(() => {
        mounted = false;
        leaveOverlay();
        if (holdsScrollLock && bodyElement) {
            releaseBodyScrollLock(bodyElement);
            holdsScrollLock = false;
        }
    });

    // Dismiss the offcanvas when the backdrop is clicked...
    const handleBackdropMouseDown = (event: MouseEvent) => {
        if (!isTopOverlay(overlayEntry) || useBackdrop === false) return;
        const path = event.composedPath();
        // Read current refs for each press; there are no registrations or deferred toggles to clean up.
        if (event.button === 0) {
            if (
                triggerElements?.some(
                    (trigger) => trigger?.isConnected && path.includes(trigger) && !trigger.matches(':disabled, [aria-disabled="true"]')
                )
            )
                return;
        }
        // Its click handler owns this state change; mousedown must not dismiss it first.
        if (rootState.isControllingTogglerEvent(event)) return;

        if (panelElement && path.includes(panelElement)) {
            event.stopPropagation();
            return;
        }
        if (rootState.isShown && useBackdrop === 'static') {
            event.stopPropagation();
            onHidePrevented(event);
            return;
        }
        if (rootState.isShown && useBackdrop !== 'static') {
            // Cancel only the actual backdrop surface's default blur, preserving pointer defaults on consumer controls.
            if (backdropElement && path.includes(backdropElement)) event.preventDefault();
            event.stopPropagation();
            rootState.toggleIsShown();
        }
    };

    // Dismiss the offcanvas on Escape key press
    function handleKeydown(event: KeyboardEvent): void {
        if (!rootState.isShown || rootState.isMediaQueryMatched) return;
        if (event.key === 'Tab') {
            if (event.defaultPrevented || !isOverlayActive()) return;
            trackNativeTab(event);
            trapFocus(event);
            return;
        }
        if (rootState.isShown && !isKeyboardDismissible && useBackdrop === 'static' && event.key === 'Escape') {
            onHidePrevented(event);
            return;
        }
        if (rootState.isShown && isKeyboardDismissible && event.key === 'Escape') {
            rootState.toggleIsShown();
        }
    }
    const showTransition = initialShow(
        () => rootState.isShown && !rootState.isMediaQueryMatched,
        () => panelElement,
        fly
    );
</script>

<svelte:body on:mousedown={handleBackdropMouseDown} />

{#if rootState.isShown}
    <div
        {@attach () => rootState.registerControlledPanel()}
        bind:this={() => panelElement, setPanelElement}
        class={classes}
        {id}
        style:z-index={overlayZIndex}
        tabindex="-1"
        transition:showTransition={{ duration: rootState.transitionDuration, x: flyX, y: flyY, opacity: 1 }}
        {...restOfProps}
        aria-labelledby={restOfProps['aria-labelledby'] !== undefined
            ? restOfProps['aria-labelledby']
            : restOfProps['aria-label'] !== undefined
              ? undefined
              : rootState.isShown && !rootState.isMediaQueryMatched
                ? rootState.titleId
                : undefined}
        aria-modal={rootState.isShown && !rootState.isMediaQueryMatched && isFocusModal ? true : undefined}
        onintrostart={(event) => {
            onShow.call(event.currentTarget, event);
            onIntroStart?.call(event.currentTarget, event);
        }}
        onintroend={(event) => {
            onShown.call(event.currentTarget, event);
            onIntroEnd?.call(event.currentTarget, event);
        }}
        onoutrostart={(event) => {
            onHide.call(event.currentTarget, event);
            onOutroStart?.call(event.currentTarget, event);
        }}
        onoutroend={(event) => {
            handleOnHidden(event);
            onOutroEnd?.call(event.currentTarget, event);
        }}
        role={rootState.isShown && !rootState.isMediaQueryMatched ? 'dialog' : undefined}>
        {@render children?.()}
    </div>
{/if}

{#if rootState.isBackdropShown}
    <div
        bind:this={backdropElement}
        class={backDropClasses}
        onmousedown={handleBackdropMouseDown}
        role="presentation"
        style:z-index={backdropZIndex}
        transition:fade={{ duration: 150 }}>
    </div>
{/if}

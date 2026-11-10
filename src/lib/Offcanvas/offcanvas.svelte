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
The component owns `role="dialog"` and `aria-modal` in overlay mode and omits them when shown inline
at its responsive breakpoint. Overlay panels move focus inside, contain Tab/Shift+Tab, and restore focus
on dismissal or removal, respecting other open overlays. Inline panels do not manage focus.
The first mounted `Offcanvas.Title` supplies the accessible name unless an explicit `aria-label` or
`aria-labelledby` is provided (including null or empty opt-outs). Provide a Title or an explicit name;
a panel without either remains unnamed. Other consumer attributes remain configurable.

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
    // Keep containment private while preserving the public ref, including bind:this cleanup.
    function setPanelElement(element: HTMLDivElement | null) {
        panelElement = element;
        if (elementRef !== element) elementRef = element;
    }
    let holdsScrollLock = false;
    let mounted = false;
    let focusGeneration = 0;
    let previouslyFocusedElement: HTMLElement | null = null;
    let overlayZIndex: number | undefined = $state(undefined);
    let backdropZIndex: number | undefined = $state(undefined);
    const unset = Symbol('unset');
    let previousIsShown: Offcanvas.RootProps['isShown'] | typeof unset = unset;
    let previousRootIsOverlayShown = false;
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
        if (isOverlayShown && !previousRootIsOverlayShown) {
            focusGeneration++;
            previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            registerOverlay(overlayEntry);
            void focusPanel();
        } else if (!isOverlayShown && previousRootIsOverlayShown) {
            leaveOverlay();
        }

        previousRootIsOverlayShown = isOverlayShown;
    });

    // Reject unavailable candidates without relying on geometry (which differs in SSR/test DOMs).
    function isAvailable(element: HTMLElement): boolean {
        if (!element.isConnected || element.matches(':disabled, [disabled], input[type="hidden"]')) return false;
        for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
            if (ancestor.matches('[hidden], [inert], [aria-hidden="true"]')) return false;
            // Closed details expose only their first summary (and its descendants).
            if (ancestor instanceof HTMLDetailsElement && !ancestor.open && ancestor !== element) {
                const summary = Array.from(ancestor.children).find((child) => child.tagName === 'SUMMARY');
                if (!summary?.contains(element)) return false;
            }
            const style = getComputedStyle(ancestor);
            if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false;
        }
        return true;
    }

    function isSequentiallyFocusable(element: HTMLElement): boolean {
        if (element.tagName === 'SUMMARY' && element.parentElement instanceof HTMLDetailsElement) {
            const firstSummary = Array.from(element.parentElement.children).find((child) => child.tagName === 'SUMMARY');
            if (element !== firstSummary && !element.hasAttribute('tabindex')) return false;
        }
        if (element.tabIndex >= 0) return true;
        if (element.hasAttribute('tabindex')) return false;
        // Browsers report -1 for default contenteditable tabIndex, despite it being a native Tab stop.
        const editable = element.getAttribute('contenteditable');
        if (editable !== '' && editable !== 'true' && editable !== 'plaintext-only') return false;
        const parentEditable = element.parentElement?.closest('[contenteditable]');
        return !parentEditable || parentEditable.getAttribute('contenteditable') === 'false';
    }

    function getFocusableElements(): HTMLElement[] {
        const candidates = Array.from(
            panelElement?.querySelectorAll<HTMLElement>(
                'a[href], area[href], button, input, select, textarea, iframe, object, embed, audio[controls], video[controls], summary, [contenteditable], [tabindex]'
            ) ?? []
        ).filter((element) => isSequentiallyFocusable(element) && isAvailable(element));
        return candidates
            .filter((element) => {
                if (!(element instanceof HTMLInputElement) || element.type !== 'radio' || !element.name) return true;
                // One sequential stop per available radio group; form-associated radios can be outside their form.
                const group = candidates.filter(
                    (candidate): candidate is HTMLInputElement =>
                        candidate instanceof HTMLInputElement &&
                        candidate.type === 'radio' &&
                        candidate.name === element.name &&
                        candidate.form === element.form &&
                        candidate.getRootNode() === element.getRootNode()
                );
                return element === (group.find((radio) => radio.checked) ?? group[0]);
            })
            .sort((a, b) => {
                // Positive tabindex precedes the ordinary DOM sequence; stable sorting retains live DOM order for ties.
                const aOrder = a.tabIndex > 0 ? a.tabIndex : Number.POSITIVE_INFINITY;
                const bOrder = b.tabIndex > 0 ? b.tabIndex : Number.POSITIVE_INFINITY;
                return aOrder === bOrder ? 0 : aOrder - bOrder;
            });
    }

    async function focusPanel(): Promise<void> {
        const generation = focusGeneration;
        await tick();
        // A settled task belongs to one overlay session, never to a subsequent open or another top overlay.
        if (!mounted || generation !== focusGeneration || !rootState.isShown || rootState.isMediaQueryMatched || !isTopOverlay(overlayEntry)) return;
        (getFocusableElements()[0] ?? panelElement)?.focus({ preventScroll: true });
    }

    function leaveOverlay(): void {
        focusGeneration++;
        const wasTopOverlay = isTopOverlay(overlayEntry);
        unregisterOverlay(overlayEntry);
        const opener = previouslyFocusedElement;
        previouslyFocusedElement = null;
        if (!wasTopOverlay || isFocusInTopOverlay()) return;
        if (opener && isAvailable(opener)) opener.focus({ preventScroll: true });
        if (!isFocusInTopOverlay()) focusTopOverlay();
    }

    function trapFocus(event: KeyboardEvent): void {
        const candidates = getFocusableElements();
        const first = candidates[0] ?? panelElement;
        const last = candidates.at(-1) ?? panelElement;
        const active = document.activeElement;
        // Also recover from focus on the panel itself or an element that became unavailable.
        if (!candidates.includes(active as HTMLElement) || (event.shiftKey ? active === first : active === last)) {
            event.preventDefault();
            (event.shiftKey ? last : first)?.focus({ preventScroll: true });
        }
    }

    // Get the body element when the component is mounted...
    onMount(() => {
        mounted = true;
        if (typeof window !== 'undefined') {
            bodyElement = document.querySelector('body');
        }
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
            event.stopPropagation();
            rootState.toggleIsShown();
        }
    };

    // Dismiss the offcanvas on Escape key press
    function handleKeydown(event: KeyboardEvent): void {
        if (!rootState.isShown || rootState.isMediaQueryMatched) return;
        if (event.key === 'Tab') {
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
              : rootState.titleId}
        aria-modal={rootState.isShown && !rootState.isMediaQueryMatched ? true : undefined}
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
        class={backDropClasses}
        onmousedown={handleBackdropMouseDown}
        role="presentation"
        style:z-index={backdropZIndex}
        transition:fade={{ duration: 150 }}>
    </div>
{/if}

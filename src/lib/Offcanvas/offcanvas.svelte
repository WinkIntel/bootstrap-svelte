<!--
@component
## Offcanvas
Build hidden sidebars into your project for navigation, shopping carts, and more with the Bootstrap Offcanvas component.

@example
```svelte
<Offcanvas placement="start" isVisible={true}>
    <Offcanvas.Header>
        <Offcanvas.Title>Offcanvas Title</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
        Content for the offcanvas goes here. You can place just about any Bootstrap component or custom elements here.
    </Offcanvas.Body>
</Offcanvas>
```

#### Placement options
```svelte
<Offcanvas placement="start">...</Offcanvas>
<Offcanvas placement="end">...</Offcanvas>
<Offcanvas placement="top">...</Offcanvas>
<Offcanvas placement="bottom">...</Offcanvas>
```

#### Body scrolling
```svelte
<Offcanvas bodyScrolling={true}>...</Offcanvas>
```

#### Static backdrop
```svelte
<Offcanvas isStatic={true}>...</Offcanvas>
```

#### Responsive offcanvas
```svelte
<Offcanvas breakpoint="lg">...</Offcanvas>
```

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
- `showOnBreakpoint` (string): Optional. Show the offcanvas on a specific breakpoint ('sm', 'md', 'lg', 'xl', 'xxl').
- `useBackdrop` (boolean): Optional. Controls whether to show a backdrop when the offcanvas is open.
- `onHide` (function): Optional. Callback function when the offcanvas is hidden.
- `onHidePrevented` (function): Optional. Callback function when the offcanvas hide is prevented.
- `onHidden` (function): Optional. Callback function when the offcanvas is completely hidden.
- `onShow` (function): Optional. Callback function when the offcanvas is shown.
- `onShown` (function): Optional. Callback function when the offcanvas is completely shown.
-->
<script lang="ts">
    import { noop, uniqueClsx } from '$lib/common/index.js';
    import { initOffcanvasRootState, OffcanvasRootState } from '$lib/common/navbar-offcanvas.svelte.js';
    import { isTopOverlay, registerOverlay, unregisterOverlay, type OverlayStackEntry } from '$lib/common/overlay-stack.js';
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
        useBackdrop = true,
        onHide = noop,
        onHidePrevented = noop,
        onHidden = noop,
        onShow = noop,
        onShown = noop,
        ...restOfProps
    }: Offcanvas.RootProps = $props();

    // Initialize the root state of the offcanvas component...
    let bodyElement: HTMLElement | null = $state(null);
    let holdsScrollLock = false;
    let overlayZIndex: number | undefined = $state(undefined);
    let backdropZIndex: number | undefined = $state(undefined);
    const unset = Symbol('unset');
    let previousIsShown: Offcanvas.RootProps['isShown'] | typeof unset = unset;
    let previousRootIsOverlayShown = false;
    let previousShowOnBreakpoint: Offcanvas.RootProps['showOnBreakpoint'] | typeof unset = unset;
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
    let hasShownOnBreakpoint = $derived(!!showOnBreakpoint); // !! to convert to boolean
    let hasPlacement = $derived(!!placement); // !! to convert to boolean

    // Derived classes for the offcanvas component...
    let backDropClasses: string = $derived(uniqueClsx('offcanvas-backdrop', 'fade', { show: rootState.isShown }));
    let classes: string = $derived(
        uniqueClsx(
            {
                offcanvas: !hasShownOnBreakpoint,
                [`offcanvas-${showOnBreakpoint}`]: hasShownOnBreakpoint,
                [`offcanvas-${placement}`]: hasPlacement,
                show: rootState.isShown
            },
            classValues
        )
    );

    // Listen changes to the isShown prop and update the root state accordingly...
    $effect(() => {
        if (previousIsShown !== unset && previousIsShown !== isShown) {
            if (isShown !== rootState.isShown) {
                // Because the transition is asynchronous, we need to wait for the next tick before toggling the state...
                tick().then(() => {
                    rootState.toggleIsShown();
                });
            }
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

    // Listen changes to the showOnBreakpoint prop and update the root state accordingly...
    $effect(() => {
        if (previousShowOnBreakpoint !== unset && previousShowOnBreakpoint !== showOnBreakpoint) {
            if (showOnBreakpoint !== rootState.showOnBreakpoint) {
                rootState.showOnBreakpoint = showOnBreakpoint;
            }
        }

        previousShowOnBreakpoint = showOnBreakpoint;
    });

    $effect(() => {
        const isOverlayShown = rootState.isShown && !rootState.isMediaQueryMatched;
        if (isOverlayShown && !previousRootIsOverlayShown) {
            registerOverlay(overlayEntry);
        } else if (!isOverlayShown && previousRootIsOverlayShown) {
            unregisterOverlay(overlayEntry);
        }

        previousRootIsOverlayShown = isOverlayShown;
    });

    // Get the body element when the component is mounted...
    onMount(() => {
        if (typeof window !== 'undefined') {
            bodyElement = document.querySelector('body');
        }
    });

    // Listen to the transition events to properly manage the body scrollbar...
    const handleOnShow: EventListener = (event: Event) => {
        if (bodyElement && !isBodyScrollable && !rootState.isMediaQueryMatched && !holdsScrollLock) {
            acquireBodyScrollLock(bodyElement);
            holdsScrollLock = true;
        }
        onShow(event);
    };

    // Listen to the transition events to properly manage the body scrollbar...
    const handleOnHidden: EventListener = (event: Event) => {
        if (holdsScrollLock && bodyElement) {
            releaseBodyScrollLock(bodyElement);
            holdsScrollLock = false;
        }
        onHidden(event);
    };

    // Release a held scroll lock if the offcanvas is destroyed while shown,
    // so a removed-while-open offcanvas doesn't permanently disable body
    // scrolling...
    onDestroy(() => {
        unregisterOverlay(overlayEntry);
        if (holdsScrollLock && bodyElement) {
            releaseBodyScrollLock(bodyElement);
            holdsScrollLock = false;
        }
    });

    // Dismiss the offcanvas when the backdrop is clicked...
    const handleBackdropMouseDown: EventListener = (event: Event) => {
        if (!isTopOverlay(overlayEntry)) return;

        const target = event.target as HTMLElement;
        const nearestOffcanvas = target.closest('.offcanvas');
        if (nearestOffcanvas && nearestOffcanvas.id === id) {
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
        if (rootState.isShown && !isKeyboardDismissible && useBackdrop === 'static' && event.key === 'Escape') {
            onHidePrevented(event);
            return;
        }
        if (rootState.isShown && isKeyboardDismissible && event.key === 'Escape') {
            rootState.toggleIsShown();
        }
    }
</script>

<svelte:body on:mousedown={handleBackdropMouseDown} />

{#if rootState.isShown}
    <div
        aria-modal={rootState.isShown}
        bind:this={elementRef}
        class={classes}
        {id}
        onintrostart={handleOnShow}
        onintroend={onShown}
        onoutrostart={onHide}
        onoutroend={handleOnHidden}
        role={rootState.isShown ? 'dialog' : undefined}
        style:z-index={overlayZIndex}
        tabindex="-1"
        transition:fly={{ duration: rootState.transitionDuration, x: flyX, y: flyY, opacity: 1 }}
        {...restOfProps}>
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

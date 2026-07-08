<!--
@component
## Modal
Add dialogs to your site for lightboxes, user notifications, or completely custom content.

@example
```svelte
<Modal isShown={true}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title>Modal Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Modal content goes here.
            </Modal.Body>
            <Modal.Footer>
                <Button onclick={() => setIsShown(false)}>Close</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal>
```

#### Static backdrop
```svelte
<Modal useBackdrop="static">...</Modal>
```

#### Keyboard dismissible
```svelte
<Modal isKeyboardDismissible={true}>...</Modal>
```

### Props
- `children` (slot): Content to display inside the modal.
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the modal DOM element.
- `id` (string): Optional. ID for the modal element.
- `isFocusable` (boolean): Optional. Controls whether the modal can receive focus.
- `isKeyboardDismissible` (boolean): Optional. Controls whether the modal can be dismissed with the Escape key.
- `isShown` (boolean): Optional. Controls whether the modal is visible.
- `onHide` (function): Optional. Callback to invoke when the modal starts hiding.
- `onHidden` (function): Optional. Callback to invoke when the modal has been hidden.
- `onShow` (function): Optional. Callback to invoke when the modal starts showing.
- `onShown` (function): Optional. Callback to invoke when the modal has been shown.
- `useBackdrop` (boolean | 'static'): Optional. Controls whether the modal has a backdrop and if it's static (non-dismissible).
- `useFade` (boolean): Optional. Controls whether the modal uses a fade transition.
-->
<script lang="ts">
    import { acquireBodyScrollLock, noop, releaseBodyScrollLock, uniqueClsx } from '$lib/common/index.js';
    import { Portal } from '$lib/index.js';
    import { onDestroy, onMount, tick } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import type { Modal } from './index.js';
    import { initModalRootState, ModalRootState } from './modal.svelte.js';

    // Generate a unique ID for the modal element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `modal-${uid}`,
        isShown = false,
        isKeyboardDismissible = true,
        isFocusable = true,
        onHide = noop,
        onHidePrevented = noop,
        onHidden = noop,
        onShow = noop,
        onShown = noop,
        useBackdrop = true,
        useFade = true,
        ...restOfProps
    }: Modal.RootProps = $props();

    // Initialize the root state of the modal component...
    let bodyElement: HTMLElement | null = $state(null);
    let holdsScrollLock = false;
    let previouslyFocusedElement: HTMLElement | null = null;
    const unset = Symbol('unset');
    let previousIsShown: Modal.RootProps['isShown'] | typeof unset = unset;
    let previousRootIsShown = false;
    let previousUseBackdrop: Modal.RootProps['useBackdrop'] | typeof unset = unset;
    const rootState: ModalRootState = initModalRootState({
        get isShown() {
            return isShown;
        },
        get useBackdrop() {
            return useBackdrop;
        }
    });

    // Derived classes for the modal component...
    let isHidePrevented: boolean = $state(false);
    let backDropClasses: string = $derived(uniqueClsx('modal-backdrop', { fade: useFade, show: rootState.isShown }));
    let classes: string = $derived(
        uniqueClsx(
            'modal',
            {
                fade: useFade,
                show: rootState.isShown,
                'd-block': rootState.isShown,
                'modal-static': isHidePrevented
            },
            classValues
        )
    );

    // Listen changes to the isShown prop and update the root state accordingly...
    $effect(() => {
        if (previousIsShown !== unset && previousIsShown !== isShown) {
            if (isShown && !rootState.isShown) {
                rootState.toggleIsShown();
            } else if (!isShown && rootState.isShown) {
                rootState.toggleIsShown();
            }
        }

        previousIsShown = isShown;
    });

    // Listen changes to the useBackdrop prop and update the root state accordingly...
    $effect(() => {
        if (previousUseBackdrop !== unset && previousUseBackdrop !== useBackdrop) {
            if (useBackdrop && !rootState.useBackdrop) {
                rootState.useBackdrop = useBackdrop;
            } else if (!useBackdrop && rootState.useBackdrop) {
                rootState.useBackdrop = useBackdrop;
            }
        }

        previousUseBackdrop = useBackdrop;
    });

    $effect(() => {
        if (rootState.isShown && !previousRootIsShown) {
            previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            focusModal();
        } else if (!rootState.isShown && previousRootIsShown) {
            restoreFocus();
        }

        previousRootIsShown = rootState.isShown;
    });

    const handleOnShow: EventListener = (event: Event) => {
        if (bodyElement) {
            acquireBodyScrollLock(bodyElement);
            holdsScrollLock = true;
            bodyElement.classList.add('modal-open');
        }
        onShow(event);
    };

    const handleOnHidden: EventListener = (event: Event) => {
        if (bodyElement) {
            const remainingLocks = releaseBodyScrollLock(bodyElement);
            holdsScrollLock = false;
            if (remainingLocks === 0) {
                bodyElement.classList.remove('modal-open');
            }
        }
        onHidden(event);
    };

    async function focusModal(): Promise<void> {
        if (!isFocusable) return;

        await tick();

        const focusTarget = getFocusableElements()[0] ?? elementRef;
        focusTarget?.focus({ preventScroll: true });
    }

    function restoreFocus(): void {
        if (previouslyFocusedElement?.isConnected) {
            previouslyFocusedElement.focus({ preventScroll: true });
        }
        previouslyFocusedElement = null;
    }

    function getFocusableElements(): HTMLElement[] {
        if (!elementRef) return [];

        return Array.from(
            elementRef.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
    }

    function trapFocus(event: KeyboardEvent): void {
        const focusableElements = getFocusableElements();
        const firstElement = focusableElements[0] ?? elementRef;
        const lastElement = focusableElements[focusableElements.length - 1] ?? elementRef;

        if (!firstElement || !lastElement) return;

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    // Get the body element when the component is mounted...
    onMount(() => {
        if (typeof window !== 'undefined') {
            bodyElement = document.querySelector('body');
        }
    });

    // Release a held scroll lock if the modal is destroyed while shown, so a
    // removed-while-open modal doesn't permanently disable body scrolling...
    onDestroy(() => {
        if (holdsScrollLock && bodyElement) {
            const remainingLocks = releaseBodyScrollLock(bodyElement);
            holdsScrollLock = false;
            if (remainingLocks === 0) {
                bodyElement.classList.remove('modal-open');
            }
        }
    });

    // Dismiss the modal when the backdrop is clicked...
    const handleBackdropMouseDown: EventListener = (event: Event) => {
        const target = event.target as HTMLElement;
        const closestModal = target.closest('.modal-dialog');
        if (closestModal) {
            event.stopPropagation();
            return;
        }
        if (rootState.isShown && useBackdrop === 'static') {
            event.stopPropagation();
            onHidePrevented(event);
            isHidePrevented = true;
            setTimeout(() => {
                isHidePrevented = false;
            }, 300);
            return;
        }
        if (rootState.isShown && useBackdrop !== 'static') {
            event.stopPropagation();
            rootState.toggleIsShown();
        }
    };

    // Handle keyboard events to dismiss modal on Escape key press
    const handleKeydown: EventListener = (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (!rootState.isShown) return;

        if (keyboardEvent.key === 'Tab') {
            trapFocus(keyboardEvent);
            return;
        }

        if (rootState.isShown && isKeyboardDismissible && keyboardEvent.key === 'Escape') {
            rootState.toggleIsShown();
        }
    };
</script>

<svelte:window on:keydown={handleKeydown} />

{#if rootState.isShown}
    <div
        aria-labelledby={rootState.titleId}
        aria-modal={rootState.isShown}
        bind:this={elementRef}
        class={classes}
        {id}
        role="dialog"
        tabindex={isFocusable ? -1 : undefined}
        onmousedown={handleBackdropMouseDown}
        onintrostart={handleOnShow}
        onintroend={onShown}
        onoutrostart={onHide}
        onoutroend={handleOnHidden}
        transition:fly={{ duration: useFade ? 300 : 0, y: '-50px', opacity: 0 }}
        {...restOfProps}>
        {@render children?.()}
    </div>
{/if}

<Portal target="body">
    {#if rootState.isBackdropShown}
        <div class={backDropClasses} onmousedown={handleBackdropMouseDown} role="presentation" transition:fade={{ duration: useFade ? 150 : 0 }}>
        </div>
    {/if}
</Portal>

<!--
@component
## Tab.NavLink
A tab navigation link component specifically used inside a Tab.Root component. Inside Tab.Pane content, it selects a pane of its Tab.Root and synchronizes the matching strip selection, without tab semantics.
When strip links share a target, a pane control preserves the selected match or chooses the first registered strip link. A remounted link registers last, even if it appears first in the markup. Removing the selected strip link selects a remaining match for the visible pane or clears strip selection. A pane without a strip match leaves the strip unselected.
An initially true isActive on a pane control does not change the initial pane or strip selection. Clicks and later false-to-true isActive transitions select its destination.

In a Tab.Root tablist strip, tab-role links activate and focus with all four arrows and Home/End, wrapping and skipping disabled links in DOM order. Roving tabindex defaults to the selected enabled tab, or the first enabled tab after mount if none is selected. Explicit roles and enabled-link tabindex overrides are honored. Consumer onkeydown runs first and can preventDefault to cancel a managed key. Disabled clicks do not select or call onclick. Use pane lifecycle callbacks to observe pane changes.

@example
```svelte
<Tab.NavLink targetPaneId="#!" isActive={true}>Active Link</Tab.NavLink>
```

### Props
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the link DOM element.
- `id` (string): Optional. Unique ID for the navigation element. Defaults to `tab-nav-link-{uid}`, where `uid` is a unique identifier.
- `isActive` (boolean): Optional. Whether the link is active.
- `isDisabled` (boolean): Optional. Whether the link is disabled.
- `role` (string): Optional. The ARIA role of the link. If not provided, it will be set to "tab" if the link is a tab.
- `targetPaneId` (string): Optional. The ID of the tab pane to link to.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { initNavLinkState, NavLinkState } from '$lib/common/nav-tab.svelte.js';
    import { noop } from '$lib/common/noop.js';
    import type { Tab } from './index.js';

    // Generate a unique ID for the link, in case one is not provided...
    const uid: string = $props.id();

    let {
        'aria-controls': ariaControls,
        'aria-current': ariaCurrent,
        'aria-disabled': ariaDisabled,
        'aria-selected': ariaSelected,
        children,
        class: classValues,
        elementRef = $bindable(null),
        targetPaneId = '#',
        id = `tab-nav-link-${uid}`,
        isActive = false,
        isDisabled = false,
        onclick = noop,
        onkeydown,
        role,
        tabindex: consumerTabIndex,
        ...restOfProps
    }: Tab.NavLinkProps = $props();

    const linkState: NavLinkState = initNavLinkState(
        {
            get href() {
                return targetPaneId;
            },
            get role() {
                return role;
            },
            get isDisabled() {
                return isDisabled || !!restOfProps.disabled;
            },
            get id() {
                return id;
            },
            get isActive() {
                return isActive;
            }
        },
        true
    );

    let isActiveState = $derived(linkState.isActive);
    let classes: string = $derived(uniqueClsx('nav-link', { active: isActiveState, disabled: isDisabled }, classValues));

    const handleClick: EventListener = (event: Event) => {
        if (isDisabled || restOfProps.disabled) {
            event.preventDefault();
            return;
        }
        linkState.onclick(event);
        onclick(event);
    };

    const handleKeydown = (event: KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
        onkeydown?.call(event.currentTarget, event);
        linkState.onkeydown(event);
    };

    // Track the previously synchronized isActive value so we only react to
    // genuine prop transitions (not to reads of the live linkState.props.isActive).
    let previousIsActive: boolean | undefined;

    $effect(() => {
        if (previousIsActive !== undefined && previousIsActive !== isActive && isActive) {
            linkState.onclick(new MouseEvent('click'));
        }

        previousIsActive = isActive;
    });
</script>

<button
    aria-controls={ariaControls !== undefined ? ariaControls : linkState.ariaControls}
    aria-current={linkState.hasTabRole ? undefined : isActiveState ? 'page' : ariaCurrent}
    aria-disabled={isDisabled ? 'true' : ariaDisabled}
    aria-selected={ariaSelected !== undefined ? ariaSelected : linkState.hasTabRole ? isActiveState : undefined}
    bind:this={
        () => linkState.element,
        (element) => {
            const previous = linkState.element;
            linkState.element = element;
            // Clear only a public ref still owned by this link on unmount.
            if (element !== null || elementRef === previous) elementRef = element;
        }
    }
    class={classes}
    data-tab-pane-id={targetPaneId}
    {id}
    onclick={handleClick}
    onkeydown={handleKeydown}
    tabindex={isDisabled ? -1 : consumerTabIndex !== undefined ? consumerTabIndex : linkState.tabIndex}
    type="button"
    role={linkState.role}
    {...restOfProps}>
    {@render children?.()}
</button>

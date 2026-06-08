<!--
@component
## Tab.NavLink
A tab navigation link component specifically used inside a Tab.Root component.

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
        children,
        class: classValues,
        elementRef = $bindable(null),
        targetPaneId = '#',
        id = `tab-nav-link-${uid}`,
        isActive = false,
        isDisabled = false,
        onclick = noop,
        ...restOfProps
    }: Tab.NavLinkProps = $props();

    const linkState: NavLinkState = initNavLinkState({
        get href() {
            return targetPaneId;
        },
        get id() {
            return id;
        },
        get isActive() {
            return isActive;
        }
    });

    let isActiveState = $derived(linkState.isActive);
    let classes: string = $derived(uniqueClsx('nav-link', { active: isActiveState, disabled: isDisabled }, classValues));

    const handleClick: EventListener = (event: Event) => {
        linkState.onclick(event);
        onclick(event);
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
    aria-controls={linkState.ariaControls}
    aria-current={isActiveState ? 'page' : undefined}
    aria-disabled={isDisabled ? 'true' : undefined}
    aria-selected={linkState.isTab ? isActiveState : undefined}
    bind:this={elementRef}
    class={classes}
    data-tab-pane-id={targetPaneId}
    {id}
    onclick={handleClick}
    tabindex={isDisabled ? -1 : undefined}
    type="button"
    role="tab"
    {...restOfProps}>
    {@render children?.()}
</button>

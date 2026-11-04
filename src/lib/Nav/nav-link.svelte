<!--
@component
## Nav.Link
Navigation link component typically used inside a Nav.Item. A bare Nav.Link inside Tab.Pane selects a pane and synchronizes its strip selection. Under a Nav.Root in pane content, it follows its href as ordinary navigation. Explicit isActive props continue to control the rendered active state. An initially active pane control does not replace the initial strip selection or pane; clicks and later activation transitions still select its destination.

In a Tab.Root tablist strip, tab-role links activate and focus with all four arrows and Home/End, wrapping and skipping disabled links in DOM order. Roving tabindex defaults to the selected enabled tab, or the first enabled tab after mount if none is selected. Explicit roles and enabled-link tabindex overrides are honored. Consumer onkeydown runs first and can preventDefault to cancel a managed key. Disabled clicks do not select or call onclick. Use pane lifecycle callbacks to observe pane changes.

@example
```svelte
<Nav.Link href="#!" isActive={true}>Active Link</Nav.Link>
```

### Props
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the link DOM element.
- `href` (string): Optional. The URL to link to.
- `id` (string): Optional. Unique ID for the navigation element. Defaults to `nav-{uid}`, where `uid` is a unique identifier.
- `isActive` (boolean): Optional. Whether the link is active. If not supplied, the active state will be managed internally.
- `isDisabled` (boolean): Optional. Whether the link is disabled.
- `role` (string): Optional. The ARIA role of the link. If not provided, it will be set to "tab" if the link is a tab.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { initNavLinkState, NavLinkState } from '$lib/common/nav-tab.svelte.js';
    import { noop } from '$lib/common/noop.js';
    import type { Nav } from './index.js';

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
        href = '#!',
        id = `nav-link-${uid}`,
        isActive,
        isDisabled = false,
        onclick = noop,
        onkeydown,
        role,
        tabindex: consumerTabIndex,
        ...restOfProps
    }: Nav.LinkProps = $props();

    const linkState: NavLinkState = initNavLinkState({
        get href() {
            return href;
        },
        get role() {
            return role;
        },
        get isDisabled() {
            return isDisabled;
        },
        get id() {
            return id;
        },
        get isActive() {
            return isActive;
        }
    });

    // Explicit roles override tab-role inference.
    let defaultRole = $derived(linkState.role);
    // If isActive is not provided, use the state from the linkState.
    let isActiveState = $derived(linkState.renderedActive);
    let classes: string = $derived(uniqueClsx('nav-link', { active: isActiveState, disabled: isDisabled }, classValues));

    const handleClick: EventListener = (event: Event) => {
        if (isDisabled) {
            event.preventDefault();
            return;
        }

        linkState.onclick(event);
        onclick(event);
    };

    const handleKeydown = (event: KeyboardEvent & { currentTarget: EventTarget & HTMLAnchorElement }) => {
        onkeydown?.call(event.currentTarget, event);
        linkState.onkeydown(event);
    };

    // Track the previously synchronized isActive value so we only react to
    // genuine prop transitions (not to reads of the live linkState.props.isActive).
    const unset = Symbol('unset');
    let previousIsActive: Nav.LinkProps['isActive'] | typeof unset = unset;

    $effect(() => {
        if (previousIsActive !== unset && previousIsActive !== isActive) {
            if (linkState.isActive && !isActive) {
                linkState.deactivate();
            } else if (!linkState.isActive && isActive) {
                linkState.onclick(new MouseEvent('click'));
            }
        }

        previousIsActive = isActive;
    });
</script>

<a
    {...restOfProps}
    aria-controls={linkState.ariaControls ?? ariaControls}
    aria-current={linkState.hasTabRole ? undefined : isActiveState ? 'page' : ariaCurrent}
    aria-disabled={isDisabled ? 'true' : ariaDisabled}
    aria-selected={linkState.hasTabRole ? isActiveState : ariaSelected}
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
    {href}
    {id}
    onclick={handleClick}
    onkeydown={handleKeydown}
    tabindex={isDisabled ? -1 : consumerTabIndex !== undefined ? consumerTabIndex : linkState.tabIndex}
    role={defaultRole}>
    {@render children?.()}
</a>

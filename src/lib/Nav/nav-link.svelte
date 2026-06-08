<!--
@component
## Nav.Link
Navigation link component typically used inside a Nav.Item.

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
        children,
        class: classValues,
        elementRef = $bindable(null),
        href = '#!',
        id = `nav-link-${uid}`,
        isActive,
        isDisabled = false,
        onclick = noop,
        role,
        ...restOfProps
    }: Nav.LinkProps = $props();

    const linkState: NavLinkState = initNavLinkState({
        get href() {
            return href;
        },
        get id() {
            return id;
        },
        get isActive() {
            return isActive;
        }
    });

    // If the link is a tab, we need to set the role to "tab", otherwise use the provided role.
    let defaultRole = $derived(linkState.isTab ? 'tab' : role);
    // If isActive is not provided, use the state from the linkState.
    let isActiveState = $derived(isActive !== undefined ? isActive : linkState.isActive);
    let classes: string = $derived(uniqueClsx('nav-link', { active: isActiveState, disabled: isDisabled }, classValues));

    const handleClick: EventListener = (event: Event) => {
        linkState.onclick(event);
        onclick(event);
    };

    // Track the previously synchronized isActive value so we only react to
    // genuine prop transitions (not to reads of the live linkState.props.isActive).
    const unset = Symbol('unset');
    let previousIsActive: Nav.LinkProps['isActive'] | typeof unset = unset;

    $effect(() => {
        if (previousIsActive !== unset && previousIsActive !== isActive) {
            if (linkState.isActive && !isActive) {
                linkState.root.setNavLinkActive('');
            } else if (!linkState.isActive && isActive) {
                linkState.onclick(new MouseEvent('click'));
            }
        }

        previousIsActive = isActive;
    });
</script>

<a
    aria-controls={linkState.ariaControls}
    aria-current={isActiveState ? 'page' : undefined}
    aria-disabled={isDisabled ? 'true' : undefined}
    aria-selected={linkState.isTab ? isActiveState : undefined}
    bind:this={elementRef}
    class={classes}
    {href}
    {id}
    onclick={handleClick}
    tabindex={isDisabled ? -1 : undefined}
    role={defaultRole}
    {...restOfProps}>
    {@render children?.()}
</a>

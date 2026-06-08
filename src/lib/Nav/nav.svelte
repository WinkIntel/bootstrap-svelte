<!--
@component
## Nav.Root
Root navigation component that contains navigation items and links.

@example
```svelte
<Nav.Root>
    <Nav.Item>
        <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Link</Nav.Link>
    </Nav.Item>
</Nav.Root>
```

#### Basic pills example
```svelte
<Nav.Root itemStyle="pills">
    <Nav.Item>
        <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Link</Nav.Link>
    </Nav.Item>
</Nav.Root>
```

#### Basic tabs example
```svelte
<Nav.Root itemStyle="tabs">
    <Nav.Item>
        <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link href="#!">Link</Nav.Link>
    </Nav.Item>
</Nav.Root>
```

### Props
- `ariaOrientation` (string | null): Optional. Orientation for ARIA (horizontal or vertical). Defaults to `null`, which means no specific orientation is set.
- `class` (string): Optional. Additional CSS classes. Defaults to an empty string.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element. Defaults to `null`.
- `elementType` (string): Optional. Element type to render, one of: 'nav', 'ol', 'ul'. Defaults to 'ul'.
- `horizontalAlignment` (string): Optional. Horizontal alignment, one of: 'start', 'center', 'end'. Defaults to 'start'.
- `id` (string): Optional. Unique ID for the navigation element. Defaults to `nav-{uid}`, where `uid` is a unique identifier.
- `itemLayout` (string): Optional. Item layout, one of: 'none', 'fill', 'justified'. Defaults to 'none'.
- `itemStyle` (string): Optional. Item style, one of: 'none', 'pills', 'tabs', 'underline'. Defaults to 'none'.
- `role` (string): Optional. ARIA role. If not set, defaults to 'navigation' for non-nav elements and 'tablist' for tabs.
- `verticalBreakpoint` (string): Optional. Breakpoint for vertical orientation, one of: 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'. Defaults to `null`, which means no vertical orientation is applied.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { initNavRootState, NavRootState } from '$lib/common/nav-tab.svelte.js';
    import type { Nav } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid: string = $props.id();

    let {
        ariaOrientation,
        children,
        class: classValues,
        elementRef = $bindable(null),
        elementType = 'ul',
        horizontalAlignment = 'start',
        id = `nav-${uid}`,
        itemLayout,
        itemStyle,
        role,
        verticalBreakpoint,
        ...restOfProps
    }: Nav.RootProps = $props();

    let isVertical = $derived(!!verticalBreakpoint); // !! to convert to boolean
    // If role is not explicitly set and element type is not 'nav', default to navigation role
    let defaultRole = $derived(role ? role : itemStyle === 'tabs' ? 'tablist' : elementType !== 'nav' ? 'navigation' : undefined);
    // If ariaOrientation is not provided and verticalBreakpoint is defined, set it to 'vertical'. Otherwise, use the provided ariaOrientation.
    let ariaOrientationDerived = $derived(!ariaOrientation && isVertical ? 'vertical' : ariaOrientation);

    const _rootState: NavRootState = initNavRootState({
        get id() {
            return id;
        }
    });

    // Build class string
    let classes = $derived(
        uniqueClsx(
            'nav',
            {
                'flex-column': verticalBreakpoint === 'xs',
                [`flex-${verticalBreakpoint}-column`]: isVertical && verticalBreakpoint !== 'xs',
                'justify-content-start': horizontalAlignment === 'start',
                'justify-content-center': horizontalAlignment === 'center',
                'justify-content-end': horizontalAlignment === 'end',
                'nav-fill': itemLayout === 'fill',
                'nav-justified': itemLayout === 'justified',
                'nav-pills': itemStyle === 'pills',
                'nav-tabs': itemStyle === 'tabs',
                'nav-underline': itemStyle === 'underline'
            },
            classValues
        )
    );
</script>

<svelte:element
    this={elementType}
    aria-orientation={ariaOrientationDerived}
    bind:this={elementRef}
    class={classes}
    {id}
    role={defaultRole}
    {...restOfProps}>
    {@render children?.()}
</svelte:element>

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
- `ariaOrientation` (string): Optional. Explicit ARIA orientation (horizontal or vertical). Always-vertical tablists (verticalBreakpoint='xs') infer 'vertical' when this prop is omitted; ordinary navigation does not infer an orientation.
- `class` (string): Optional. Additional CSS classes. Defaults to an empty string.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element. Defaults to `null`.
- `elementType` (string): Optional. Element type to render, one of: 'nav', 'ol', 'ul'. Defaults to 'ul'.
- `horizontalAlignment` (string): Optional. Horizontal alignment, one of: 'start', 'center', 'end'. Defaults to 'start'.
- `id` (string): Optional. Unique ID for the navigation element. Defaults to `nav-{uid}`, where `uid` is a unique identifier.
- `itemLayout` (string): Optional. Item layout, one of: 'none', 'fill', 'justified'. Defaults to 'none'.
- `itemStyle` (string): Optional. Item style, one of: 'none', 'pills', 'tabs', 'underline'. Defaults to 'none'.
- `role` (string | null): Optional. Defaults to 'tablist' in a Tab.Root navigation strip, regardless of itemStyle; navigation inside Tab.Pane stays ordinary. Otherwise no role attribute is added. Explicit roles are preserved; null opts out of the default. Use a nav wrapper or elementType='nav' for an ordinary navigation landmark.
- `verticalBreakpoint` (string): Optional. Breakpoint for vertical orientation, one of: 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'. Defaults to `null`, which means no vertical orientation is applied.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { initNavRootState, isInTabStrip, NavRootState } from '$lib/common/nav-tab.svelte.js';
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
    // Svelte context is read during initialization, not when reactive props update.
    const isTabNavigation = isInTabStrip();
    let defaultRole = $derived(role !== undefined ? role : isTabNavigation ? 'tablist' : undefined);
    let ariaOrientationDerived = $derived(ariaOrientation || (defaultRole === 'tablist' && verticalBreakpoint === 'xs' ? 'vertical' : undefined));

    const _rootState: NavRootState = initNavRootState({
        get id() {
            return id;
        },
        get role() {
            return defaultRole;
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

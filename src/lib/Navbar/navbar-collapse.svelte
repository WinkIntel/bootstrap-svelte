<!--
@component
## Navbar.Collapse
Collapsible container for navbar content that toggles when the navbar toggler is clicked.

@example
```svelte
<Navbar.Root>
    <Navbar.Brand href="/">My Brand</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
        <Navbar.Nav>
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/about">About</Nav.Link>
            </Nav.Item>
        </Navbar.Nav>
    </Navbar.Collapse>
</Navbar.Root>
```

#### With event handlers
```svelte
<Navbar.Root>
    <Navbar.Brand href="/">My Brand</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse
        onExpand={() => console.log('Expanding')}
        onExpanded={() => console.log('Expanded')}
        onCollapse={() => console.log('Collapsing')}
        onCollapsed={() => console.log('Collapsed')}>
        <Navbar.Nav>
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
        </Navbar.Nav>
    </Navbar.Collapse>
</Navbar.Root>
```

### Props
- `children`: Optional. Content to render inside the collapsible container.
- `class` (string): Optional. Additional CSS classes to apply to the container.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element.
- `id` (string): Optional. Unique ID for the container. Defaults to `{navbar-id}-collapse`.
- `onCollapse` (function): Optional. Handler called when the container starts collapsing.
- `onCollapsed` (function): Optional. Handler called when the container has finished collapsing.
- `onExpand` (function): Optional. Handler called when the container starts expanding.
- `onExpanded` (function): Optional. Handler called when the container has finished expanding.
-->
<script lang="ts">
    import { noop, uniqueClsx } from '$lib/common/index.js';
    import { initNavbarCollapseState, NavbarCollapseState } from '$lib/common/navbar-offcanvas.svelte.js';
    import { Collapse } from '$lib/index.js';
    import type { Navbar } from './index.js';

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id: providedId,
        onCollapse = noop,
        onCollapsed = noop,
        onExpand = noop,
        onExpanded = noop,
        transitionDuration: transitionDurationOverride,
        ...restOfProps
    }: Navbar.CollapseProps = $props();

    const collapseState: NavbarCollapseState = initNavbarCollapseState({
        get id() {
            return providedId;
        }
    });

    let classes = $derived(uniqueClsx('navbar-collapse', classValues));
    let transitionDuration = $derived(transitionDurationOverride ?? collapseState.root.transitionDuration);
    let isExpandedState = $derived(collapseState.isExpanded);

    $effect(() => {
        collapseState.root.ariaControls = collapseState.id;
    });

    function handleOnCollapsed(event: Event) {
        // This will ensure that not transition animation will occur when the Navbar is expanded...
        collapseState.root.transitionDuration = 0;
        onCollapsed(event);
    }
</script>

<Collapse
    {...restOfProps}
    bind:elementRef
    class={classes}
    id={collapseState.id}
    isExpanded={isExpandedState}
    {transitionDuration}
    {onCollapse}
    onCollapsed={handleOnCollapsed}
    {onExpand}
    {onExpanded}>
    {@render children?.()}
</Collapse>

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
- `id` (string): Optional. Unique ID for the container. Defaults to `navbar-collapse-{uid}`.
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

    // Generate a unique ID for the component, in case one is not provided...
    const uid = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `navbar-collapse-${uid}`,
        onCollapse: _onCollapse = noop,
        onCollapsed = noop,
        onExpand: _onExpand = noop,
        onExpanded: _onExpanded = noop,
        ...restOfProps
    }: Navbar.CollapseProps = $props();

    const collapseState: NavbarCollapseState = initNavbarCollapseState({
        get id() {
            return id;
        }
    });

    let classes = $derived(uniqueClsx('navbar-collapse', classValues));
    let transitionDuration = $derived(collapseState.root.transitionDuration);
    let isExpandedState = $derived(collapseState.isExpanded);

    function handleOnCollapsed(event: Event) {
        // This will ensure that not transition animation will occur when the Navbar is expanded...
        collapseState.root.transitionDuration = 0;
        onCollapsed(event);
    }
</script>

<Collapse bind:elementRef class={classes} {id} isExpanded={isExpandedState} {transitionDuration} onCollapsed={handleOnCollapsed} {...restOfProps}>
    {@render children?.()}
</Collapse>

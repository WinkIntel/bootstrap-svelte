<!--
@component
## Navbar.Nav
Container for navigation items within a navbar, providing proper styling and spacing.

@example
```svelte
<Navbar.Root>
    <Navbar.Brand href="/">My Brand</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
        <Navbar.Nav>
            <Nav.Item>
                <Nav.Link href="/" isActive={true}>Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/about">About</Nav.Link>
            </Nav.Item>
        </Navbar.Nav>
        <Navbar.Nav class="ms-auto">
            <Nav.Item>
                <Nav.Link href="/login">Login</Nav.Link>
            </Nav.Item>
        </Navbar.Nav>
    </Navbar.Collapse>
</Navbar.Root>
```

#### With vertical scrolling
```svelte
<Navbar.Root>
    <Navbar.Brand href="/">My Brand</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
        <Navbar.Nav isVerticalScrolling={true} style="max-height:200px;">
            <Nav.Item>
                <Nav.Link href="/">Item 1</Nav.Link>
            </Nav.Item>
        </Navbar.Nav>
    </Navbar.Collapse>
</Navbar.Root>
```

### Props
- `children`: Optional. Content to render inside the navigation container.
- `class` (string): Optional. Additional CSS classes to apply to the navigation container.
- `elementRef` (HTMLUListElement): Optional. Reference to the DOM ul element.
- `id` (string): Optional. Unique ID for the navigation container. Defaults to `navbar-{uid}`.
- `isVerticalScrolling` (boolean): Optional. Enables vertical scrolling for the navigation items. Defaults to false.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import { initNavRootState, NavRootState } from '$lib/common/nav-tab.svelte.js';
    import type { Navbar } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `navbar-${uid}`,
        isVerticalScrolling = false,
        ...restOfProps
    }: Navbar.NavProps = $props();

    const _rootState: NavRootState = initNavRootState({
        get id() {
            return id;
        }
    });

    let classes = $derived(uniqueClsx('navbar-nav', { 'navbar-scrolling': isVerticalScrolling }, classValues));
</script>

<ul bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</ul>

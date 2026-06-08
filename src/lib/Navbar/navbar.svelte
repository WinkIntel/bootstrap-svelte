<!--
@component
## Navbar.Root
Root navigation bar component that provides responsive navigation header functionality.

@example
```svelte
<Navbar.Root>
    <Navbar.Brand href="/">
        My Brand
    </Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
        <Nav.Root horizontalAlignment="end">
            <Nav.Item>
                <Nav.Link href="/" isActive={true}>Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/about">About</Nav.Link>
            </Nav.Item>
        </Nav.Root>
    </Navbar.Collapse>
</Navbar.Root>
```

#### With color variant
```svelte
<Navbar.Root colorVariant="bg-primary">
    <Navbar.Brand href="/">
        My Brand
    </Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
        <Nav.Root horizontalAlignment="end">
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
        </Nav.Root>
    </Navbar.Collapse>
</Navbar.Root>
```

#### With colored background (manual class)
```svelte
<Navbar.Root class="bg-dark navbar-dark">
    <Navbar.Brand href="/">
        My Brand
    </Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
        <Nav.Root horizontalAlignment="end">
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
        </Nav.Root>
    </Navbar.Collapse>
</Navbar.Root>
```

#### Fixed to top
```svelte
<Navbar.Root placement="fixed-top">
    <Navbar.Brand href="/">
        My Brand
    </Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
        <Nav.Root horizontalAlignment="end">
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
        </Nav.Root>
    </Navbar.Collapse>
</Navbar.Root>
```

### Props
- `children`: Optional. Content to render inside the navbar.
- `class` (string): Optional. Additional CSS classes to apply to the navbar.
- `colorVariant` (NavbarColorVariant): Optional. Background color variant for the navbar, one of: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element.
- `expandOnBreakpoint` (string): Optional. Breakpoint at which navbar will expand, one of: 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'. Defaults to 'xs'.
- `id` (string): Optional. Unique ID for the navbar element. Defaults to `navbar-{uid}`, where `uid` is a unique identifier.
- `placement` (string): Optional. Navbar positioning, one of: 'fixed-top', 'fixed-bottom', 'sticky-top', 'sticky-bottom'.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import { initNavbarRootState, NavbarRootState } from '$lib/common/navbar-offcanvas.svelte.js';
    import type { Navbar } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid = $props.id();

    let {
        children,
        class: classValues,
        colorVariant,
        elementRef = $bindable(null),
        expandOnBreakpoint = 'xs',
        id = `navbar-${uid}`,
        placement,
        ...restOfProps
    }: Navbar.RootProps = $props();

    const _rootState: NavbarRootState = initNavbarRootState({
        get expandOnBreakpoint() {
            return expandOnBreakpoint;
        },
        get id() {
            return id;
        }
    });

    let hasExpandedOnBreakpoint = $derived(!!expandOnBreakpoint); // !! to convert to boolean
    let classes = $derived(
        uniqueClsx(
            'navbar',
            { [`navbar-expand-${expandOnBreakpoint}`]: hasExpandedOnBreakpoint && expandOnBreakpoint !== 'xs' },
            {
                'fixed-top': placement === 'fixed-top',
                'fixed-bottom': placement === 'fixed-bottom',
                'sticky-top': placement === 'sticky-top',
                'sticky-bottom': placement === 'sticky-bottom'
            },
            colorVariant && `bg-${colorVariant}`,
            classValues
        )
    );

    // Determines the Bootstrap data-bs-theme attribute for dark backgrounds
    // to ensure proper text contrast as per Bootstrap documentation
    let theme = $derived.by(() => {
        const darkVariants = ['dark', 'primary', 'secondary', 'success', 'danger'];
        return darkVariants.includes(colorVariant ?? '') ? 'dark' : undefined;
    });
</script>

<nav bind:this={elementRef} class={classes} {id} data-bs-theme={theme} {...restOfProps}>
    {@render children?.()}
</nav>

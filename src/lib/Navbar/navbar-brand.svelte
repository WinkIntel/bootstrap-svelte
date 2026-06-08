<!--
@component
## Navbar.Brand
Component for displaying the company, product, or project name/logo in the navbar.

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
        </Navbar.Nav>
    </Navbar.Collapse>
</Navbar.Root>
```

#### With image logo
```svelte
<Navbar.Root>
    <Navbar.Brand href="/">
        <img src="/logo.svg" alt="Brand Logo" height="30" class="d-inline-block align-text-top me-2" />
        My Brand
    </Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
        <Navbar.Nav>
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
        </Navbar.Nav>
    </Navbar.Collapse>
</Navbar.Root>
```

### Props
- `children`: Optional. Content to render inside the brand link.
- `class` (string): Optional. Additional CSS classes to apply to the brand link.
- `elementRef` (HTMLAnchorElement): Optional. Reference to the DOM anchor element.
- `href` (string): Optional. URL that the brand links to. Defaults to '#!'.
- `id` (string): Optional. Unique ID for the brand element. Defaults to `navbar-brand-{uid}`.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Navbar } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        href = '#!',
        id = `navbar-brand-${uid}`,
        ...restOfProps
    }: Navbar.BrandProps = $props();

    let classes = $derived(uniqueClsx('navbar-brand', classValues));
</script>

<a bind:this={elementRef} class={classes} {href} {id} {...restOfProps}>
    {@render children?.()}
</a>

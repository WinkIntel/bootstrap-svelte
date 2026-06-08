<!--
@component
## Navbar.Text
Component for displaying text content within a navbar with proper vertical alignment.

@example
```svelte
<Navbar.Root>
    <Navbar.Brand href="/">My Brand</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
        <Navbar.Nav class="me-auto">
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
        </Navbar.Nav>
        <Navbar.Text>Logged in as: User</Navbar.Text>
    </Navbar.Collapse>
</Navbar.Root>
```
### Props
- `children`: Optional. Content to render inside the text container.
- `class` (string): Optional. Additional CSS classes to apply to the text container.
- `elementRef` (HTMLDivElement): Optional. Reference to the DOM div element.
- `id` (string): Optional. Unique ID for the text container. Defaults to `navbar-{uid}`.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Navbar } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `navbar-${uid}`, ...restOfProps }: Navbar.TextProps = $props();

    let classes = $derived(uniqueClsx('navbar-text', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

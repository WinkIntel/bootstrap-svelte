<!--
@component
## Navbar.TogglerIcon
Default hamburger icon for the navbar toggle button.

@example
```svelte
<Navbar.Root>
    <Navbar.Brand href="/">My Brand</Navbar.Brand>
    <Navbar.Toggler>
        <Navbar.TogglerIcon />
    </Navbar.Toggler>
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
- `children`: Optional. Custom content to render inside the icon span (rarely used).
- `class` (string): Optional. Additional CSS classes to apply to the icon.
- `elementRef` (HTMLSpanElement): Optional. Reference to the DOM span element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import type { Navbar } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: Navbar.TogglerIconProps = $props();

    let classes = $derived(uniqueClsx('navbar-toggler-icon', classValues));
</script>

<span bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</span>

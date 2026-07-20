<!--
@component
## Navbar.Toggler
Toggle button for collapsible navbar content. Controls the expansion/collapse of Navbar.Collapse component.

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

#### Custom toggle button text
```svelte
<Navbar.Root>
    <Navbar.Brand href="/">My Brand</Navbar.Brand>
    <Navbar.Toggler>Menu</Navbar.Toggler>
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
- `ariaLabel` (string): Optional. Accessibility label for the toggle button. Defaults to 'Toggle navigation'.
- `children`: Optional. Content to render inside the toggle button.
- `class` (string): Optional. Additional CSS classes to apply to the toggle button.
- `elementRef` (HTMLButtonElement): Optional. Reference to the DOM button element.
- `id` (string): Optional. Unique ID for the toggle button. Defaults to `navbar-toggler-{uid}`.
- `type` ('button'): Optional compatibility prop. The toggler always renders `type="button"`.
-->
<script lang="ts">
    import { noop, uniqueClsx } from '$lib/common/index.js';
    import { initNavbarTogglerState, NavbarTogglerState } from '$lib/common/navbar-offcanvas.svelte.js';
    import type { Navbar } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid = $props.id();

    let {
        'aria-controls': consumerAriaControls,
        'aria-expanded': _consumerAriaExpanded,
        'aria-label': nativeAriaLabel,
        ariaLabel,
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `navbar-toggler-${uid}`,
        onclick = noop,
        type: _type,
        ...restOfProps
    }: Navbar.TogglerProps = $props();

    const togglerState: NavbarTogglerState = initNavbarTogglerState({
        get id() {
            return id;
        }
    });

    let ariaControls = $derived(consumerAriaControls ?? togglerState.root.ariaControls);
    let resolvedAriaLabel = $derived(ariaLabel ?? nativeAriaLabel ?? 'Toggle navigation');
    let isExpanded = $derived(togglerState.isExpanded);
    let classes = $derived(uniqueClsx('navbar-toggler', { collapsed: !isExpanded }, classValues));

    const handleClick: EventListener = (_event: Event) => {
        togglerState.onclick();
        (onclick as EventListener | null)?.(_event);
    };
</script>

<button
    {...restOfProps}
    aria-controls={ariaControls}
    aria-expanded={isExpanded}
    aria-label={resolvedAriaLabel}
    bind:this={elementRef}
    class={classes}
    {id}
    onclick={handleClick}
    type="button">
    {@render children?.()}
</button>

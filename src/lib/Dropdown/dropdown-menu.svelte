<!--
@component
## Dropdown.Menu
The container for dropdown items.

@example
```svelte
<Dropdown.Menu>
    <Dropdown.Item href="#!">Action</Dropdown.Item>
    <Dropdown.Item href="#!">Another action</Dropdown.Item>
    <Dropdown.Divider/>
    <Dropdown.Item href="#!">Something else here</Dropdown.Item>
</Dropdown.Menu>
```

### Props
- `class` (string): Optional. Additional CSS classes to apply to the dropdown menu.
- `container` (string | HTMLElement | false): Optional. Specifies the container where the dropdown menu should be appended. Default is `false`.
- `elementRef` (HTMLElement): Optional. Reference to the dropdown menu DOM element.
- `id` (string): Optional. Unique identifier for the dropdown menu, default is `dropdown-menu-{uid}`.
- `isDark` (boolean): Optional. Makes the dropdown menu dark-themed, default is false.
- `isEnd` (boolean): Optional. Aligns the dropdown menu to the end of its parent, default is false.
- `offset` (number[]): Optional. Offset for the dropdown menu position, default is `[0, 2]`.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { Portal } from '$lib/index.js';
    import { onMount } from 'svelte';
    import { DropdownMenuState, initDropdownMenuState } from './dropdown.svelte.js';
    import type { Dropdown } from './index.js';

    // Generate a unique ID for the dropdown menu
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        container = false,
        elementRef = $bindable(null),
        id = `dropdown-menu-${uid}`,
        isDark = false,
        isEnd = false,
        offset = [0, 2],
        ...restOfProps
    }: Dropdown.MenuProps = $props();

    let containerElement = $derived(container === false ? 'body' : container);
    const menuState: DropdownMenuState = initDropdownMenuState({
        get elementRef() {
            return elementRef;
        },
        get id() {
            return id;
        },
        get isEnd() {
            return isEnd;
        },
        get offset() {
            return offset;
        }
    });

    // Compute menu classes
    let classes: string = $derived(
        uniqueClsx(
            'dropdown-menu',
            {
                'dropdown-menu-dark': isDark,
                'dropdown-menu-end': isEnd,
                show: menuState.isShown
            },
            classValues
        )
    );

    onMount(() => {
        return () => {
            menuState.dispose();
        };
    });

    // Forward prop changes to the matching menuState setters so their side effects
    // run on every transition. The setters are idempotent.
    $effect(() => {
        menuState.elementRef = elementRef;
    });

    $effect(() => {
        menuState.isEnd = isEnd;
    });
</script>

<svelte:body onclick={menuState.bodyOnclick} />

<Portal target={containerElement} disabled={container === false}>
    <ul
        aria-labelledby={menuState.ariaLabelledBy}
        bind:this={elementRef}
        class={classes}
        data-bs-popper={menuState.isShown && menuState.root.isNavItem ? 'static' : undefined}
        data-popper-placement={menuState.popperPlacement}
        {id}
        role={menuState.root.hasItems ? 'menu' : undefined}
        {...restOfProps}>
        {@render children?.()}
    </ul>
</Portal>

<!--
@component
## Dropdown.Toggle
The button that triggers the dropdown menu.

@example
```svelte
<Dropdown.Toggle colorVariant="success">Dropdown Button</Dropdown.Toggle>
```

### Props
- `class` (string): Optional. Additional CSS classes to apply to the toggle button.
- `colorVariant` (string): Optional. Button color variant, default is 'primary'.
- `disabled` (boolean): Optional. Disables the button if true, default is false.
- `elementRef` (HTMLElement): Optional. Reference to the button DOM element.
- `href` (string): Optional. If provided, the button will render as an anchor tag.
- `id` (string): Optional. Unique identifier for the button, default is `dropdown-toggle-{uid}`.
- `isSplit` (boolean): Optional. Displays the button as a split button, default is false.
- `size` (string): Optional. Button size: 'sm' or 'lg'.
- `type` (string): Optional. Button type, default is 'button'.
-->
<script lang="ts">
    /* eslint-disable @typescript-eslint/no-explicit-any -- restOfProps spread targets a union element type that is not spreadable without as any */
    import { Button } from '$lib/Button/index.js';
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import { DropdownToggleState, initDropdownToggleState } from './dropdown.svelte.js';
    import type { Dropdown } from './index.js';

    // Generate a unique ID for the dropdown toggle
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        colorVariant,
        disabled = false,
        elementRef = $bindable(null),
        href,
        id = `dropdown-toggle-${uid}`,
        isSplit = false,
        onclick = noop,
        onkeydown = noop,
        size,
        type,
        ...restOfProps
    }: Dropdown.ToggleProps = $props();

    const toggleState: DropdownToggleState = initDropdownToggleState({
        get id() {
            return id;
        },
        get isSplit() {
            return isSplit;
        }
    });

    let classes: string = $derived(uniqueClsx('dropdown-toggle', { 'dropdown-toggle-split': isSplit }, classValues));

    const handleClick = (event: MouseEvent) => {
        toggleState.onclick(event);
        onclick(event);
    };

    const handleKeydown = (event: KeyboardEvent) => {
        toggleState.onkeydown(event);
        onkeydown(event);
    };
</script>

<Button
    aria-expanded={toggleState.isShown}
    bind:elementRef
    class={classes}
    {colorVariant}
    {disabled}
    {href}
    {id}
    onclick={handleClick}
    onkeydown={handleKeydown}
    {size}
    {type}
    {...restOfProps as any}>
    {#if isSplit}
        <span class="visually-hidden">Toggle Dropdown</span>
    {:else}
        {@render children?.()}
    {/if}
</Button>

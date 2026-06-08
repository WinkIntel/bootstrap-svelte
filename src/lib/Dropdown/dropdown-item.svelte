<!--
@component
## Dropdown.Item
A clickable item within a dropdown menu.

@example
```svelte
<Dropdown.Item href="#!">Action</Dropdown.Item>
<Dropdown.Item>Another action</Dropdown.Item>
```

### Props
- `class` (string): Optional. Additional CSS classes to apply to the item.
- `elementRef` (HTMLElement): Optional. Reference to the item DOM element.
- `href` (string): Optional. URL for the item if it's a link, default is '#'.
- `id` (string): Optional. Unique identifier for the item, default is `dropdown-item-{uid}`.
- `isActive` (boolean): Optional. Makes the item appear active, default is false.
- `isDisabled` (boolean): Optional. Disables the item, default is false.
- `listItemProps` (object): Optional. Additional properties for the list item element.
- `onclick` (EventListener): Optional. Click event handler for the item.
-->
<script lang="ts">
    /* eslint-disable @typescript-eslint/no-explicit-any -- restOfProps spread targets a union element type that is not spreadable without as any */
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import { DropdownItemState, initDropdownItemState } from './dropdown.svelte.js';
    import type { Dropdown } from './index.js';

    // Generate a unique ID for the dropdown item
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        href,
        id = `dropdown-item-${uid}`,
        isActive = false,
        isDisabled = false,
        listItemProps,
        onclick = noop,
        onfocus = noop,
        onkeydown = noop,
        ...restOfProps
    }: Dropdown.ItemProps = $props();

    const itemState: DropdownItemState = initDropdownItemState({
        get id() {
            return id;
        },
        get elementRef() {
            return elementRef;
        },
        get isActive() {
            return isActive;
        },
        get isDisabled() {
            return isDisabled;
        }
    });

    let isAnchor: boolean = $derived(Boolean(href));
    let elementType: string = $derived(isAnchor ? 'a' : 'button');

    let classes: string = $derived(
        uniqueClsx(
            'dropdown-item',
            {
                active: isActive,
                disabled: isDisabled
            },
            classValues
        )
    );

    const handleClick: EventListener = (event: Event): void => {
        if (href && href === '#!') {
            event.preventDefault();
        }
        itemState.onclick(event);
        onclick(event);
    };

    const handleKeydown = (event: KeyboardEvent) => {
        itemState.onkeydown(event);
        onkeydown(event);
    };

    const handleFocus = (event: FocusEvent) => {
        itemState.onfocus(event);
        onfocus(event);
    };

    // Note: itemState reads elementRef, isActive, and isDisabled reactively via the
    // getter-based props object passed to initDropdownItemState above — no manual
    // mirroring needed.
</script>

<li {...listItemProps}>
    <svelte:element
        this={elementType}
        aria-disabled={isDisabled ? true : undefined}
        bind:this={elementRef}
        class={classes}
        {href}
        {id}
        onclick={handleClick}
        onfocus={handleFocus}
        onkeydown={handleKeydown}
        role="menuitem"
        tabindex={isDisabled ? -1 : undefined}
        type={isAnchor ? undefined : 'button'}
        {...restOfProps as any}>
        {@render children?.()}
    </svelte:element>
</li>

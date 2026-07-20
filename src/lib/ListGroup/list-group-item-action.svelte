<!--
@component
## ListGroup.ItemAction
An action item within a list group, typically used for navigation or triggering actions.

@example
```svelte
<ListGroup.ItemAction href="#!">Action</ListGroup.ItemAction>
<ListGroup.ItemAction>Another action</ListGroup.ItemAction>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the item.
- `colorVariant` (string): Optional. Color variant for the item ('primary', 'success', etc.).
- `elementRef` (HTMLElement): Optional. Reference to the item DOM element.
- `href` (string): Optional. If provided, the item will be rendered as an anchor (`<a>`). If not, it will be a button (`<button>`).
- `id` (string): Optional. Unique identifier for the item. Defaults to a generated ID.
- `onclick` (EventListener): Optional. Click event handler for the item.
- `isActive` (boolean): Optional. Applies active styling to the item.
- `isDisabled` (boolean): Optional. Applies disabled styling to the item.
-->
<script lang="ts">
    /* eslint-disable @typescript-eslint/no-explicit-any -- restOfProps spread targets a union element type that is not spreadable without as any */
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import type { ListGroup } from './index.js';

    // Generate a unique ID for the element, in case one is not provided...
    const uid: string = $props.id();

    let {
        'aria-current': ariaCurrent,
        'aria-disabled': ariaDisabled,
        children,
        class: classValues,
        colorVariant,
        elementRef = $bindable(null),
        href,
        id = `list-group-item-action-${uid}`,
        isActive = false,
        isDisabled = false,
        onclick = noop,
        role: consumerRole,
        tabindex: consumerTabIndex,
        type: consumerType,
        ...restOfProps
    }: ListGroup.ItemActionProps = $props();

    const isAnchor: boolean = $derived(href !== undefined);
    const elementType: string = $derived(isAnchor ? 'a' : 'button');

    let classes: string = $derived(
        uniqueClsx(
            'list-group-item',
            'list-group-item-action',
            {
                active: isActive,
                disabled: isDisabled
            },
            colorVariant && `list-group-item-${colorVariant}`,
            classValues
        )
    );

    const handleClick: EventListener = (event: Event): void => {
        if (isDisabled) {
            event.preventDefault();
            return;
        }

        onclick(event);
    };
</script>

<svelte:element
    this={elementType}
    {...restOfProps as any}
    aria-current={isActive ? 'page' : ariaCurrent}
    aria-disabled={isDisabled ? 'true' : ariaDisabled}
    bind:this={elementRef}
    class={classes}
    href={isAnchor ? href : undefined}
    {id}
    disabled={isAnchor ? undefined : isDisabled}
    onclick={handleClick}
    role={consumerRole}
    tabindex={isDisabled ? -1 : consumerTabIndex}
    type={isAnchor ? consumerType : 'button'}>
    {@render children?.()}
</svelte:element>

<!--
@component
## Popover
Add small overlay content to any element for housing secondary information or interactive controls.

@example
```svelte
<Button id="popover-button">Click for Popover</Button>
<Popover.Root isShown={true} referenceElementId="popover-button">
    <Popover.Header>Popover Title</Popover.Header>
    <Popover.Body>
        <p>This is the popover content.</p>
    </Popover.Body>
</Popover.Root>
```

#### Different Triggers
```svelte
<Popover.Root trigger="click" referenceElementId="click-button">...</Popover.Root>
<Popover.Root trigger="hover" referenceElementId="hover-button">...</Popover.Root>
<Popover.Root trigger="focus" referenceElementId="focus-button">...</Popover.Root>
```
#### Placement Options
```svelte
<Popover.Root placement="top" referenceElementId="top-button">...</Popover.Root>
<Popover.Root placement="right" referenceElementId="right-button">...</Popover.Root>
<Popover.Root placement="bottom" referenceElementId="bottom-button">...</Popover.Root>
<Popover.Root placement="left" referenceElementId="left-button">...</Popover.Root>
```
#### Custom Container
```svelte
<div id="custom-container"></div>
<Popover.Root container="#custom-container" referenceElementId="container-button">...</Popover.Root>
```
### Props
- `children` (slot): Content to display inside the popover.
- `class` (string): Optional. Additional CSS classes.
- `container` (string | HTMLElement | false): Optional. Specifies the container where the popover should be appended. Default is 'body'.
- `elementRef` (HTMLElement): Optional. Reference to the popover DOM element.
- `id` (string): Optional. ID for the popover element.
- `isShown` (boolean): Optional. Controls whether the popover is visible.
- `onHide` (function): Optional. Callback to invoke when the popover starts hiding.
- `onHidden` (function): Optional. Callback to invoke when the popover has been hidden.
- `onShow` (function): Optional. Callback to invoke when the popover starts showing.
- `onShown` (function): Optional. Callback to invoke when the popover has been shown.
- `placement` (string): Optional. Position of the popover relative to the trigger element. Options: 'top', 'right', 'bottom', 'left', 'auto'. Default is 'right'.
- `referenceElementId` (string): Required. ID of the element that triggers the popover. It accommodates the id containing a hash or not.
- `trigger` (string): Optional. Event type that triggers the popover. Options: 'click', 'hover', 'focus', or space-separated combinations. Default is 'click'.
- `useFade` (boolean): Optional. Controls whether the popover uses a fade transition. Default is true.
-->
<script lang="ts">
    import { Tooltip } from '$lib/index.js';
    import type { Popover } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        container = false,
        elementRef = $bindable(null),
        id = `popover-${uid}`,
        isShown = false,
        onHide,
        onHidden,
        onShow,
        onShown,
        placement = 'right',
        referenceElementId,
        trigger = 'click',
        useFade = true,
        ...restOfProps
    }: Popover.RootProps = $props();
</script>

<Tooltip.Root
    bind:elementRef
    class={classValues}
    {container}
    {id}
    {isShown}
    {onHide}
    {onHidden}
    {onShow}
    {onShown}
    {placement}
    {referenceElementId}
    {trigger}
    type="popover"
    {useFade}
    {...restOfProps}>
    {@render children?.()}
</Tooltip.Root>

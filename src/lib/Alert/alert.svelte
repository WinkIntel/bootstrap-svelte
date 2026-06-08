<!--
@component
## Alert
Bootstrap-styled alert component for displaying messages.

@example
```svelte
// Default alert
<Alert>
    This is a default alert message.
</Alert>
// Success alert
<Alert colorVariant="success">
    This is a success alert message.
</Alert>
// Warning alert
<Alert colorVariant="warning">
    This is a warning alert message.
</Alert>
// Dismissible alert
<Alert isDismissible={true}>
    This is a dismissible alert message.
    <CloseButton />
</Alert>
// Animated alert
<Alert isAnimated={true}>
    This is an animated alert message.
</Alert>
// Open alert
<Alert isOpen={true}>
    This alert is open.
</Alert>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the alert.
- `elementRef` (HTMLDivElement): Optional. Reference to the alert DOM element.
- `colorVariant` ('primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'): Optional. Sets the color variant of the alert.
- `isDismissible` (boolean): Optional. If true, adds a close button to the alert.
- `isAnimated` (boolean): Optional. If true, applies fade transition to the alert.
- `isOpen` (boolean): Optional. Controls the visibility of the alert.
- `onClose` (function): Optional. Callback function when the alert is closed.
- `onClosed` (function): Optional. Callback function when the alert has finished closing.
-->
<script lang="ts">
    import CloseButton from '$lib/CloseButton/close-button.svelte';
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import { fade } from 'svelte/transition';
    import type { AlertRootProps } from './types.js';

    let {
        children,
        class: classValues = 'alert-primary',
        colorVariant,
        elementRef = $bindable(null),
        isDismissible = false,
        isAnimated = true,
        isOpen = $bindable(true),
        onClose = noop,
        onClosed = noop,
        ...restOfProps
    }: AlertRootProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            'alert',
            colorVariant && `alert-${colorVariant}`,
            {
                'alert-dismissible': isDismissible,
                fade: isAnimated,
                show: isOpen
            },
            classValues
        )
    );

    const handleClick: EventListener = (_event: Event) => {
        isOpen = false;
    };
</script>

{#if isOpen}
    <div
        bind:this={elementRef}
        class={classes}
        onoutrostart={onClose}
        onoutroend={onClosed}
        role="alert"
        transition:fade={{ duration: isAnimated ? 150 : 0 }}
        {...restOfProps}>
        {@render children?.()}
        {#if isDismissible}
            <CloseButton onclick={handleClick}></CloseButton>
        {/if}
    </div>
{/if}

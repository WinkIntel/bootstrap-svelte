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
Layout classes retain the default primary color. Recognized Bootstrap color classes override it. String, array and object class values are supported. For custom themes, use `colorVariant="none"` to omit library color classes; null and empty values retain fallback behavior.

### Props
- `class` (string | array | object): Optional. Additional CSS classes; default color selection is handled separately.
- `elementRef` (HTMLDivElement): Optional. Reference to the alert DOM element.
- `colorVariant` ('primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'none'): Optional. Sets the color variant of the alert.
- `isDismissible` (boolean): Optional. If true, adds a close button to the alert.
- `isAnimated` (boolean): Optional. If true, applies fade transition to the alert.
- `isOpen` (boolean): Optional. Controls the visibility of the alert.
- `onClose` (function): Optional. Callback function when the alert is closed.
- `onClosed` (function): Optional. Callback function when the alert has finished closing.
-->
<script lang="ts">
    import CloseButton from '$lib/CloseButton/close-button.svelte';
    import { hasBootstrapColorClass, uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import { fade } from 'svelte/transition';
    import type { AlertRootProps } from './types.js';

    let {
        children,
        class: classValues,
        colorVariant,
        elementRef = $bindable(null),
        isDismissible = false,
        isAnimated = true,
        isOpen = $bindable(true),
        onClose = noop,
        onClosed = noop,
        onoutrostart: onOutroStart,
        onoutroend: onOutroEnd,
        ...restOfProps
    }: AlertRootProps = $props();

    let hasColorVariant = $derived(typeof colorVariant === 'string' && colorVariant.trim().length > 0);
    let normalizedClassValues = $derived(uniqueClsx(classValues));
    let hasColorClasses = $derived(hasBootstrapColorClass(normalizedClassValues, 'alert'));

    let classes: string = $derived(
        uniqueClsx(
            'alert',
            colorVariant === 'none' ? false : hasColorVariant ? `alert-${colorVariant}` : !hasColorClasses && 'alert-primary',
            {
                'alert-dismissible': isDismissible,
                fade: isAnimated,
                show: isOpen
            },
            normalizedClassValues
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
        onoutrostart={(event) => {
            onClose?.call(event.currentTarget, event);
            onOutroStart?.call(event.currentTarget, event);
        }}
        onoutroend={(event) => {
            onClosed?.call(event.currentTarget, event);
            onOutroEnd?.call(event.currentTarget, event);
        }}
        role="alert"
        transition:fade={{ duration: isAnimated ? 150 : 0 }}
        {...restOfProps}>
        {@render children?.()}
        {#if isDismissible}
            <CloseButton onclick={handleClick}></CloseButton>
        {/if}
    </div>
{/if}

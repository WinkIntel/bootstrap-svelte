<!--
@component
## CloseButton
A button component that provides a standardized close button functionality.
Typically used in alerts, modals, and other dismissible components.

@example
```svelte
<CloseButton />
```

#### Basic close button
```svelte
<CloseButton />
```

#### Disabled state
```svelte
<CloseButton disabled={true} />
```
### Props
- `ariaLabel` (string): Optional. Customizes the aria-label attribute for accessibility (defaults to "Close")
- `class` (string): Optional. Additional CSS classes to apply to the close button
- `disabled` (boolean): Optional. Disables the close button when set to true
- `elementRef` (HTMLElement): Optional. Reference to the button DOM element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { CloseButtonRootProps } from './types.js';

    let { ariaLabel = 'Close', class: classValues, disabled = false, elementRef = $bindable(null), ...restOfProps }: CloseButtonRootProps = $props();

    let classes: string = $derived(uniqueClsx('btn-close', classValues));
</script>

<button aria-label={ariaLabel} bind:this={elementRef} class={classes} {disabled} type="button" {...restOfProps}></button>

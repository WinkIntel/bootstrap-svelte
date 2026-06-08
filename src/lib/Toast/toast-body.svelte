<!--
@component
## Toast.Body
Body component for the Toast. Contains the main content/message of the toast notification.

@example
```svelte
<Toast.Body>This is a toast message.</Toast.Body>
```

### Props
- `children` (slot): Content to display inside the body
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the body DOM element
- `id` (string): Optional. ID for the body element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Toast } from './index.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid: string = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `toast-body-${uid}`, ...restOfProps }: Toast.BodyProps = $props();

    let classes: string = $derived(uniqueClsx('toast-body', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

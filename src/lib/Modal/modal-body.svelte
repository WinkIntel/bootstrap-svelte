<!--
@component
## Modal.Body
Body component for the Modal content.

@example
```svelte
<Modal.Body>
    Content for the modal goes here. You can place just about any Bootstrap component or custom elements here.
</Modal.Body>
```
### Props
- `children` (slot): Content to display inside the body
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the body DOM element
- `id` (string): Optional. ID for the body element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Modal } from './index.js';

    // Generate a unique ID for the modal body element, in case one is not provided...
    const uid: string = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `modal-body-${uid}`, ...restOfProps }: Modal.BodyProps = $props();

    let classes: string = $derived(uniqueClsx('modal-body', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

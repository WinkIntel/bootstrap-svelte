<!--
@component
## Modal.Footer
Footer component for the Modal content.

@example
```svelte
<Modal.Footer>
    <Button colorVariant="secondary" onclick={() => setIsShown(false)}>Close</Button>
    <Button colorVariant="primary" onclick={() => handleSave()}>Save changes</Button>
</Modal.Footer>
```
### Props
- `children` (slot): Content to display inside the footer
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the footer DOM element
- `id` (string): Optional. ID for the footer element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Modal } from './index.js';

    // Generate a unique ID for the modal footer element, in case one is not provided...
    const uid: string = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `modal-footer-${uid}`, ...restOfProps }: Modal.FooterProps = $props();

    let classes: string = $derived(uniqueClsx('modal-footer', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

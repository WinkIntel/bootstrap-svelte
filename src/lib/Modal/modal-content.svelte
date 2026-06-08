<!--
@component
## Modal.Content
Content component that wraps the modal's header, body, and footer.

@example
```svelte
<Modal.Content>
    <Modal.Header>
        <Modal.Title>Modal Title</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        Content for the modal goes here.
    </Modal.Body>
    <Modal.Footer>
        <Button>Close</Button>
    </Modal.Footer>
</Modal.Content>
```
### Props
- `children` (slot): Content to display inside the modal content
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the content DOM element
- `id` (string): Optional. ID for the content element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Modal } from './index.js';

    // Generate a unique ID for the modal content element, in case one is not provided...
    const uid: string = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `modal-content-${uid}`, ...restOfProps }: Modal.ContentProps = $props();

    let classes: string = $derived(uniqueClsx('modal-content', classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

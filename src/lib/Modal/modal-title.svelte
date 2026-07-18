<!--
@component
## Modal.Title
Title component for the Modal.Header.

@example
```svelte
<Modal.Title>Modal Title</Modal.Title>
```

#### Custom heading level
```svelte
<Modal.Title level={1}>H1 Title</Modal.Title>
<Modal.Title level={2}>H2 Title</Modal.Title>
```

### Props
- `children` (slot): Content to display inside the title
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the title DOM element
- `id` (string): Optional. ID for the title element
- `level` (number): Optional. Heading level (1-6) for the title element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Modal } from './index.js';
    import { getOptionalModalRootState } from './modal.svelte.js';

    // Generate a unique ID for the modal title element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `modal-title-${uid}`,
        level = 5,
        ...restOfProps
    }: Modal.TitleProps = $props();

    let elementType: string = $derived(`h${level}`);

    let classes: string = $derived(uniqueClsx('modal-title', classValues));
    const rootState = getOptionalModalRootState();

    $effect(() => {
        const registeredId = id;
        if (!registeredId) return;

        rootState?.registerTitleId(registeredId);

        return () => {
            rootState?.unregisterTitleId(registeredId);
        };
    });
</script>

<svelte:element this={elementType} bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</svelte:element>

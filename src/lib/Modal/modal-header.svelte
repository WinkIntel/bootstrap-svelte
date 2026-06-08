<!--
@component
## Modal.Header
Header component for the Modal. Usually contains the Modal.Title and a close button.

@example
```svelte
<Modal.Header>
    <Modal.Title>Modal Title</Modal.Title>
</Modal.Header>
```

#### Without close button
```svelte
<Modal.Header isDismissible={false}>
    <Modal.Title>Modal Title</Modal.Title>
</Modal.Header>
```

### Props
- `children` (slot): Content to display inside the header
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the header DOM element
- `id` (string): Optional. ID for the header element
- `isDismissible` (boolean): Optional. Controls whether the header has a close button
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { CloseButton } from '$lib/index.js';
    import { Modal } from './index.js';
    import { initModalHeaderState, ModalHeaderState } from './modal.svelte.js';

    // Generate a unique ID for the modal header element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `modal-header-${uid}`,
        isDismissible = true,
        ...restOfProps
    }: Modal.HeaderProps = $props();

    const headerState: ModalHeaderState = initModalHeaderState({
        get isDismissible() {
            return isDismissible;
        }
    });

    let classes: string = $derived(uniqueClsx('modal-header', classValues));

    const handleClick: EventListener = (_event: Event) => {
        headerState.onclick();
    };
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
    {#if isDismissible}
        <CloseButton onclick={handleClick}></CloseButton>
    {/if}
</div>

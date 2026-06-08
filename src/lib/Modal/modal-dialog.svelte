<!--
@component
## Modal.Dialog
Dialog component that wraps the modal content.

@example
```svelte
<Modal.Dialog>
    <Modal.Content>...</Modal.Content>
</Modal.Dialog>
```

#### Different sizes
```svelte
<Modal.Dialog size="sm">...</Modal.Dialog>
<Modal.Dialog size="lg">...</Modal.Dialog>
<Modal.Dialog size="xl">...</Modal.Dialog>
```

#### Scrollable
```svelte
<Modal.Dialog isScrollable={true}>...</Modal.Dialog>
```

#### Vertically centered
```svelte
<Modal.Dialog isVerticallyCentered={true}>...</Modal.Dialog>
```

#### Fullscreen
```svelte
<Modal.Dialog fullscreenOnBreakpoint="always">...</Modal.Dialog>
<Modal.Dialog fullscreenOnBreakpoint="sm">...</Modal.Dialog>
<Modal.Dialog fullscreenOnBreakpoint="md">...</Modal.Dialog>
<Modal.Dialog fullscreenOnBreakpoint="lg">...</Modal.Dialog>
<Modal.Dialog fullscreenOnBreakpoint="xl">...</Modal.Dialog>
<Modal.Dialog fullscreenOnBreakpoint="xxl">...</Modal.Dialog>
```

### Props
- `children` (slot): Content to display inside the dialog.
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the dialog DOM element.
- `fullscreenOnBreakpoint` (string): Optional. Makes the modal fullscreen at a breakpoint ('always', 'sm', 'md', 'lg', 'xl', 'xxl').
- `id` (string): Optional. ID for the dialog element.
- `isScrollable` (boolean): Optional. Makes the modal body scrollable.
- `isVerticallyCentered` (boolean): Optional. Centers the modal vertically.
- `size` (string): Optional. Size of the modal ('sm', 'lg', 'xl').
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Modal } from './index.js';

    // Generate a unique ID for the modal dialog element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        fullscreenOnBreakpoint,
        id = `modal-dialog-${uid}`,
        isScrollable = false,
        isVerticallyCentered = false,
        size,
        ...restOfProps
    }: Modal.DialogProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            'modal-dialog',
            {
                [`modal-${size}`]: !!size,
                'modal-dialog-scrollable': isScrollable,
                'modal-dialog-centered': isVerticallyCentered,
                'modal-fullscreen': fullscreenOnBreakpoint === 'always',
                [`modal-fullscreen-${fullscreenOnBreakpoint}-down`]: fullscreenOnBreakpoint && fullscreenOnBreakpoint !== 'always'
            },
            classValues
        )
    );
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

<!--
@component
## Toast.Container
Container component for multiple toasts. Properly placements toasts within the viewport.

@example
```svelte
<Toast.Container placement="bottom-end">
    <Toast.Root>...</Toast.Root>
    <Toast.Root>...</Toast.Root>
</Toast.Container>
```

#### Different placements
```svelte
<Toast.Container placement="top-start">...</Toast.Container>
<Toast.Container placement="top-center">...</Toast.Container>
<Toast.Container placement="top-end">...</Toast.Container>
<Toast.Container placement="middle-start">...</Toast.Container>
<Toast.Container placement="middle-center">...</Toast.Container>
<Toast.Container placement="middle-end">...</Toast.Container>
<Toast.Container placement="bottom-start">...</Toast.Container>
<Toast.Container placement="bottom-center">...</Toast.Container>
<Toast.Container placement="bottom-end">...</Toast.Container>
```

### Props
- `children` (slot): Toast components to display inside the container.
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the container DOM element.
- `id` (string): Optional. ID for the container element.
- `placement` (ToastPlacement): Optional. Placement of the container in the viewport. Default is 'bottom-end'.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Toast } from './index.js';
    import { transformToastPlacement } from './types.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `toast-container-${uid}`,
        isFixed = true,
        placement = 'bottom-end',
        ...restOfProps
    }: Toast.ContainerProps = $props();

    let classes: string = $derived(
        uniqueClsx('toast-container', { 'position-fixed': isFixed }, 'p-3', transformToastPlacement(placement), classValues)
    );
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>

<!--
@component
## Toast.Header
Header component for the Toast. Usually contains a title, optional subtext (like a timestamp), and a close button.

@example
```svelte
<Toast.Header>This is a toast header text.</Toast.Header>
```

#### Custom header content
```svelte
<Toast.Header>
    <img src="..." class="rounded me-2" alt="...">
    <strong class="me-auto">Bootstrap</strong>
    <small>11 mins ago</small>
</Toast.Header>
```

#### Without close button
```svelte
<Toast.Header isDismissible={false}>
    <strong>No close button here</strong>
</Toast.Header>
```

### Props
- `children` (slot): Content to display inside the header.
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the header DOM element.
- `id` (string): Optional. ID for the header element.
- `isDismissible` (boolean): Optional. Whether to show a close button. Default is true.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { CloseButton } from '$lib/index.js';
    import type { Toast } from './index.js';
    import { initToastHeaderState, ToastHeaderState } from './toast.svelte.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `toast-header-${uid}`,
        isDismissible = ToastHeaderState.IS_DISMISSIBLE_DEFAULT,
        ...restOfProps
    }: Toast.HeaderProps = $props();

    const headerState: ToastHeaderState = initToastHeaderState({
        get isDismissible() {
            return isDismissible;
        }
    });

    let classes: string = $derived(uniqueClsx('toast-header', classValues));

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

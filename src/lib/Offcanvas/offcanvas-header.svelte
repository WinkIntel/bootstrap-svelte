<!--
@component
## Offcanvas.Header
Header component for the Offcanvas. Usually contains the Offcanvas.Title and a close button.

@example
```svelte
<Offcanvas.Header>
    <Offcanvas.Title>Offcanvas Title</Offcanvas.Title>
</Offcanvas.Header>
```

### Props
- `children` (slot): Content to display inside the header
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the header DOM element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import { initOffcanvasHeaderState, OffcanvasHeaderState } from '$lib/common/navbar-offcanvas.svelte.js';
    import { CloseButton } from '$lib/index.js';
    import { Offcanvas } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), isDismissible = false, ...restOfProps }: Offcanvas.HeaderProps = $props();

    const headerState: OffcanvasHeaderState = initOffcanvasHeaderState({
        get isDismissible() {
            return isDismissible;
        }
    });

    let classes: string = $derived(uniqueClsx('offcanvas-header', classValues));

    const handleClick: EventListener = (_event: Event) => {
        headerState.onclick();
    };
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
    {#if isDismissible}
        <CloseButton onclick={handleClick}></CloseButton>
    {/if}
</div>

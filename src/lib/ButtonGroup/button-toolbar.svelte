<!--
@component
## ButtonToolbar
Combine sets of button groups into button toolbars for more complex components.

@example
```svelte
<ButtonToolbar ariaLabel="Toolbar with button groups">
    <ButtonGroup class="me-2">
        <Button>1</Button>
        <Button>2</Button>
        <Button>3</Button>
    </ButtonGroup>
    <ButtonGroup class="me-2">
        <Button>4</Button>
        <Button>5</Button>
    </ButtonGroup>
</ButtonToolbar>
```
### Props
- `ariaLabel` (string): Optional. Accessibility label for the button group.
- `class` (string): Optional. CSS classes for styling the button group.
- `elementRef` (HTMLElement): Optional. Reference to the button group DOM element.
- `id` (string): Optional. ID for the button group.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { type ButtonToolbarRootProps } from './types.js';

    // Generate a unique ID for the collapse element, in case one is not provided...
    const uid: string = $props.id();

    let {
        ariaLabel = 'Button toolbar ${uid}',
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `btn-toolbar-${uid}`,
        ...restOfProps
    }: ButtonToolbarRootProps = $props();

    let classes: string = $derived(uniqueClsx('btn-toolbar', classValues));
</script>

<div aria-label={ariaLabel} bind:this={elementRef} class={classes} {id} role="toolbar" {...restOfProps}>
    {@render children?.()}
</div>

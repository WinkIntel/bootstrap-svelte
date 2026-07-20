<!--
@component
## ButtonGroup
A component that groups a series of buttons together on a single line or stacked vertically.

@example
```svelte
<ButtonGroup>
    <Button>Left</Button>
    <Button>Middle</Button>
    <Button>Right</Button>
</ButtonGroup>
```

#### Basic button group
```svelte
<ButtonGroup>
    <Button colorVariant="primary">Primary</Button>
    <Button colorVariant="secondary">Secondary</Button>
    <Button colorVariant="success">Success</Button>
</ButtonGroup>
```

#### Vertical button group
```svelte
<ButtonGroup isVertical={true}>
    <Button>Top</Button>
    <Button>Middle</Button>
    <Button>Bottom</Button>
</ButtonGroup>
```

### Props
- `ariaLabel` (string): Optional. Accessibility label for the button group
- `class` (string): Optional. CSS classes for styling the button group
- `elementRef` (HTMLElement): Optional. Reference to the button group DOM element
- `id` (string): Optional. ID for the button group
- `isVertical` (boolean): Optional. Makes the button group stack vertically\
- `size` (string): Optional. Size of the button group ('sm' or 'lg')
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { type ButtonGroupRootProps } from './types.js';

    // Generate a unique ID for the collapse element, in case one is not provided...
    const uid: string = $props.id();

    let {
        'aria-label': nativeAriaLabel,
        ariaLabel,
        children,
        class: classValues,
        elementRef = $bindable(null),
        id = `btn-group-${uid}`,
        isVertical = false,
        size,
        ...restOfProps
    }: ButtonGroupRootProps = $props();

    let classes: string = $derived(
        uniqueClsx({ 'btn-group-vertical': isVertical }, { 'btn-group': !isVertical }, size && `btn-group-${size}`, classValues)
    );
    let resolvedAriaLabel = $derived(ariaLabel ?? nativeAriaLabel ?? `Button group ${uid}`);
</script>

<div {...restOfProps} aria-label={resolvedAriaLabel} bind:this={elementRef} class={classes} {id} role="group">
    {@render children?.()}
</div>

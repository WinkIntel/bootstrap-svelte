<!--
@component
## Container
Container component that sets a max-width at various breakpoints.

@example
```svelte
<Container>
    Content goes here
</Container>
```

#### Fluid container example
```svelte
<Container isFluid={true}>
    Content goes here, spanning the entire width of viewport
</Container>
```

#### Responsive container example
```svelte
<Container breakpoint="md">
    Content has a max-width up to the md breakpoint
</Container>
```

### Props
- `breakpoint` (string): Optional. Breakpoint at which the container becomes responsive ('sm', 'md', 'lg', 'xl', 'xxl')
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the DOM element
- `elementType` (string): Optional. HTML element type to render as (default is 'div'). Can be 'article', 'aside', 'footer', etc.
- `isFluid` (boolean): Optional. Makes the container full-width, spanning the entire viewport width
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { ContainerRootProps } from './types.js';

    let {
        breakpoint,
        children,
        class: classValues,
        elementRef = $bindable(null),
        elementType = 'div',
        isFluid = false,
        ...restOfProps
    }: ContainerRootProps = $props();

    // Build class string based on props
    let classes: string = $derived(
        uniqueClsx(
            {
                'container-fluid': isFluid,
                [`container-${breakpoint}`]: !isFluid && breakpoint && breakpoint !== 'xs',
                container: !isFluid && (!breakpoint || breakpoint === 'xs')
            },
            classValues
        )
    );
</script>

<svelte:element this={elementType} bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</svelte:element>

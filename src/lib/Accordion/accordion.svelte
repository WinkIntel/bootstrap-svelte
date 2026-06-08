<!--
@component
## Accordion
A component for displaying collapsible content panels for presenting information in a limited amount of space.
Supports multiple items and allows one or all items to be expanded.

@example
```svelte
<Accordion.Root>
    <Accordion.Item>
        <Accordion.Header>Accordion Item #1</AccordionHeader>
        <Accordion.Body>
            Content for first accordion item
        </Accordion.Body>
    </Accordion.Item>
</Accordion.Root>
```

#### Basic accordion
```svelte
<Accordion.Root>
    <Accordion.Item>
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
            First item content
        </Accordion.Body>
    </Accordion.Item>
    <Accordion.Item>
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
            Second item content
        </Accordion.Body>
    </Accordion.Item>
</Accordion.Root>
```

#### Always open accordion
```svelte
<Accordion.Root isMultiple={true}>
</Accordion.Root>
```

### Props
- `class` (string): Optional. Additional CSS classes to apply to the accordion
- `elementRef` (HTMLElement): Optional. Reference to the accordion DOM element
- `isMultiple` (boolean): Optional. When true, allows multiple accordion items to be expanded at the same time
- `isFlush` (boolean): Optional. Removes the default background color, border, and rounded corners
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { AccordionRootState, initAccordionRootState } from './accordion.svelte.js';
    import type { Accordion } from './index.js';

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        isMultiple = false,
        isFlush = false,
        ...restOfProps
    }: Accordion.RootProps = $props();

    const rootState: AccordionRootState = initAccordionRootState({
        get isMultiple() {
            return isMultiple;
        }
    });

    let classes: string = $derived(uniqueClsx('accordion', { 'accordion-flush': isFlush }, classValues));

    $effect(() => {
        rootState.isMultiple = isMultiple;
    });
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>

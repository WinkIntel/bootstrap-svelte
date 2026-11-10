<!--
@component
## Offcanvas.Title
Title component for the Offcanvas.Header. The first mounted title with a nonempty ID labels its
nearest Offcanvas.Root unless the root supplies an explicit accessible name. A stable ID is generated
when omitted; explicit IDs update the association when changed. Titles also work standalone.

@example
```svelte
<Offcanvas.Title>Offcanvas Title</Offcanvas.Title>
```

#### Custom heading level
```svelte
<Offcanvas.Title level={1}>H1 Title</Offcanvas.Title>
<Offcanvas.Title level={2}>H2 Title</Offcanvas.Title>
```

### Props
- `children` (slot): Content to display inside the title
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the title DOM element
- `id` (string): Optional. Title ID; generated when omitted
- `level` (number): Optional. Heading level (1-6) for the title element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/index.js';
    import { getOptionalOffcanvasRootState } from '$lib/common/navbar-offcanvas.svelte.js';
    import { onDestroy } from 'svelte';
    import type { Offcanvas } from './index.js';

    const uid = $props.id();
    let {
        id = `offcanvas-title-${uid}`,
        children,
        class: classValues,
        elementRef = $bindable(null),
        level = 5,
        ...restOfProps
    }: Offcanvas.TitleProps = $props();

    const rootState = getOptionalOffcanvasRootState();
    const titleKey = Symbol('offcanvas-title');
    $effect(() => {
        rootState?.registerTitleId(titleKey, id);
    });
    onDestroy(() => rootState?.unregisterTitleId(titleKey));

    let elementType: string = $derived(`h${level}`);

    let classes: string = $derived(uniqueClsx('offcanvas-title', classValues));
</script>

<svelte:element this={elementType} bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</svelte:element>

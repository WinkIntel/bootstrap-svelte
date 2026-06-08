<!--
@component
## Breadcrumb.Root
Root breadcrumb component that contains breadcrumb items.

@example
```svelte
<Breadcrumb.Root>
    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    <Breadcrumb.Item href="/library">Library</Breadcrumb.Item>
    <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
</Breadcrumb.Root>
```

@example
```svelte
<Breadcrumb.Root divider="›">
    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    <Breadcrumb.Item href="/library">Library</Breadcrumb.Item>
    <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
</Breadcrumb.Root>
```

### Props
- `ariaLabel` (string): Optional. ARIA label for the breadcrumb navigation. Defaults to "breadcrumb".
- `class` (string): Optional. Additional CSS classes.
- `divider` (string): Optional. Custom divider character or string.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element.
- `id` (string): Optional. Unique ID for the breadcrumb element.
- `style` (string): Optional. Additional inline styles.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { BreadcrumbRootState, initBreadcrumbRootState } from './breadcrumb.svelte.js';
    import type { Breadcrumb } from './index.js';

    // Generate a unique ID for the component, in case one is not provided
    const uid = $props.id();

    let {
        ariaLabel = 'breadcrumb',
        children,
        class: classValues,
        divider,
        elementRef = $bindable(null),
        id = `breadcrumb-${uid}`,
        style,
        ...restOfProps
    }: Breadcrumb.RootProps = $props();

    const _rootState: BreadcrumbRootState = initBreadcrumbRootState({
        get id() {
            return id;
        }
    });

    let classes = $derived(uniqueClsx('breadcrumb', classValues));
    let styles: string | undefined = $derived.by(() => {
        if (divider === undefined && style === undefined) {
            return undefined;
        }
        return divider !== undefined
            ? `--bs-breadcrumb-divider: ${divider.startsWith('url') ? divider : `'${divider}';${style || ''}`}`
            : style || undefined;
    });
</script>

<nav aria-label={ariaLabel} style={styles}>
    <ol bind:this={elementRef} class={classes} {id} {...restOfProps}>
        {@render children?.()}
    </ol>
</nav>

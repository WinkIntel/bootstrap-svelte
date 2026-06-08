<!--
@component
## Tab.Content
Content container for tab content. Used with tabs navigation.

@example
```svelte
<Tab.Content>
    <Tab.Pane id="home-tab-pane" isActive={true}>
        Content for home tab
    </Tab.Pane>
    <Tab.Pane id="contact-tab-pane">
        Content for contact tab
    </Tab.Pane>
</Tab.Content>
```

### Props
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the DOM element
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Tab } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: Tab.ContentProps = $props();

    let classes: string = $derived(uniqueClsx('tab-content', classValues));
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>

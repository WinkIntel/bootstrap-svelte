<!--
@component
## ProgressStacked
A container component that enables multiple progress bars to be stacked horizontally in a single visual element.
When progress bars are placed within this component, they automatically adapt their styling to function as part
of a stacked group rather than individual progress elements.

Note: This component provides visual grouping without requiring manual style adjustments or explicit parent-child prop
passing - child ProgressBar components automatically detect they're within a stacked context.

@example
```svelte
<ProgressStacked>
    <ProgressBar value={30} colorVariant="success" striped />
    <ProgressBar value={20} colorVariant="warning" />
    <ProgressBar value={10} colorVariant="danger" animated />
</ProgressStacked>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the container.
- `elementRef` (HTMLDivElement): Optional. Reference to the underlying DOM element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { ProgressStackedProps } from './index.js';
    import { initProgressStackedState } from './progress.svelte.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: ProgressStackedProps = $props();

    let classes: string = $derived(uniqueClsx('progress-stacked', classValues));

    // Initialize context for child ProgressBar components to detect they're within a stacked container
    // This enables automatic layout adjustments without requiring explicit parent-child prop passing
    initProgressStackedState({});
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>

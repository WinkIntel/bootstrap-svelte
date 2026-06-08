<!--
@component
## Collapse
A collapsible component that can toggle content visibility with a smooth animation.
Supports both vertical and horizontal collapse directions.

@example
```svelte
<Collapse isExpanded={true}>
    Content that can be toggled
</Collapse>
```

#### Basic collapse
```svelte
<Collapse isExpanded={showContent}>
    <div class="card card-body">
        Some collapsible content
    </div>
</Collapse>
```

#### Horizontal collapse
```svelte
<Collapse isExpanded={showContent} isHorizontal={true}>
    <div class="card card-body" style="width: 200px;">
        Horizontally collapsing content
    </div>
</Collapse>
```

### Props
- `class` (string): Optional. Additional CSS classes to apply to the collapse
- `transitionDuration` (number): Optional. Duration of the collapse transition in milliseconds. Default is 350ms.
- `elementRef` (HTMLElement): Optional. Reference to the collapse DOM element
- `isExpanded` (boolean): Optional. Controls the visibility state of the collapse
- `isHorizontal` (boolean): Optional. Enables horizontal collapse animation instead of vertical. Only the `width` style on the child element is required.
- `onCollapse` (function): Optional. Callback triggered when the collapse starts hiding
- `onCollapsed` (function): Optional. Callback triggered when the collapse has finished hiding
- `onExpand` (function): Optional. Callback triggered when the collapse starts showing
- `onExpanded` (function): Optional. Callback triggered when the collapse has finished showing
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import type { CollapseRootProps } from './index.js';
    import { collapseIn, collapseOut } from './transition.js';

    let {
        children,
        class: classValues,
        transitionDuration: _transitionDuration = 350,
        elementRef = $bindable(null),
        isHorizontal = false,
        isExpanded = false,
        onCollapse = noop,
        onCollapsed = noop,
        onExpand = noop,
        onExpanded = noop,
        ...restOfProps
    }: CollapseRootProps = $props();

    let classes: string = $derived(uniqueClsx('collapse', { 'collapse-horizontal': isHorizontal }, { show: isExpanded }, classValues));
</script>

{#if isExpanded}
    <div
        bind:this={elementRef}
        class={classes}
        onintrostart={onExpand}
        onintroend={onExpanded}
        onoutrostart={onCollapse}
        onoutroend={onCollapsed}
        in:collapseIn={{ isHorizontal }}
        out:collapseOut={{ isHorizontal }}
        {...restOfProps}>
        {@render children?.()}
    </div>
{/if}

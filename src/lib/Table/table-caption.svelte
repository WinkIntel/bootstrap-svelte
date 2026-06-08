<!--
@component
## Table.Caption
A component to render a Bootstrap table caption.

@example
```svelte
<Table.Caption>Table Caption</Table.Caption>
```

### Props
None
-->
<script lang="ts">
    import type { Table } from './index.js';

    let { children, ...restOfProps }: Table.CaptionProps = $props();
</script>

<caption {...restOfProps}>
    {@render children?.()}
</caption>

<!--
@component
## Table.Caption
A component to render a Bootstrap table caption.

@example
```svelte
<Table.Caption>Table Caption</Table.Caption>
```

### Props
- `children` (Snippet): Optional. Content to display inside the caption. Standard caption HTML attributes are also accepted.
-->
<script lang="ts">
    import type { Table } from './index.js';

    let { children, ...restOfProps }: Table.CaptionProps = $props();
</script>

<caption {...restOfProps}>
    {@render children?.()}
</caption>

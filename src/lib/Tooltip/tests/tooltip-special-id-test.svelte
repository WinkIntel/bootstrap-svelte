<script lang="ts">
    import { Button, Tooltip } from '$lib/index.js';
</script>

<!-- Reference element whose id contains a dot, which is a CSS class-selector delimiter.
     `document.querySelector('#' + id)` misinterprets it as an id+class compound selector
     and silently fails to bind, leaving the tooltip's reference element null. -->
<Button id="info.icon" data-testid="dotted-id-trigger">Info</Button>

<Tooltip.Root id="dotted-id-tooltip" trigger="click" referenceElementId="info.icon" data-testid="dotted-id-tooltip">
    <Tooltip.Inner data-testid="dotted-id-tooltip-inner">Dotted id tooltip content</Tooltip.Inner>
</Tooltip.Root>

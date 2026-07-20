<script lang="ts">
    import { Button, Popover } from '$lib/index.js';
</script>

<Button id="popover-delegation-trigger" data-testid="popover-delegation-trigger">Popover trigger</Button>
<Popover.Root
    id="popover-delegation"
    trigger="hover"
    referenceElementId="popover-delegation-trigger"
    data-testid="popover-delegation"
    useFade={false}>
    <Popover.Body>Delegated popover</Popover.Body>
</Popover.Root>

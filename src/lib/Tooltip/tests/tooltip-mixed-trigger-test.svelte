<script lang="ts">
    import { Button, Tooltip } from '$lib/index.js';

    let tooltipTrigger = $state('hover focus');
</script>

<button data-testid="set-tooltip-focus-trigger" onclick={() => (tooltipTrigger = 'focus')}>Use focus only</button>
<button data-testid="set-tooltip-hover-trigger" onclick={() => (tooltipTrigger = 'hover')}>Use hover only</button>
<button data-testid="add-tooltip-focus-trigger" onclick={() => (tooltipTrigger = 'hover focus')}>Add focus</button>

<Button id="default-tooltip-trigger" data-testid="default-tooltip-trigger">Default tooltip trigger</Button>
<Tooltip.Root id="default-tooltip" referenceElementId="default-tooltip-trigger" data-testid="default-tooltip" useFade={false}>
    <Tooltip.Inner>Default tooltip</Tooltip.Inner>
</Tooltip.Root>

<Button id="mixed-tooltip-trigger" data-testid="mixed-tooltip-trigger">Mixed tooltip trigger</Button>
<Tooltip.Root id="mixed-tooltip" trigger={tooltipTrigger} referenceElementId="mixed-tooltip-trigger" data-testid="mixed-tooltip" useFade={false}>
    <Tooltip.Inner>Mixed tooltip</Tooltip.Inner>
</Tooltip.Root>

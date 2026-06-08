<script lang="ts">
    import { Button, Tooltip } from '$lib/index.js';
</script>

<!-- Reference elements that the tooltips will be attached to -->
<Button id="test-tooltip-button" data-testid="trigger-button">Hover for Tooltip</Button>
<Button id="click-tooltip-button" data-testid="click-trigger">Click for Tooltip</Button>
<Button id="focus-tooltip-button" data-testid="focus-trigger">Focus for Tooltip</Button>
<Button id="top-tooltip-button" data-testid="top-trigger">Top Tooltip</Button>
<Button id="bottom-tooltip-button" data-testid="bottom-trigger">Bottom Tooltip</Button>
<Button id="left-tooltip-button" data-testid="left-trigger">Left Tooltip</Button>
<Button id="no-fade-button" data-testid="no-fade-trigger">No Fade Tooltip</Button>
<Button id="container-tooltip-button" data-testid="container-trigger">Container Tooltip</Button>

<!-- Custom container for testing container property -->
<div id="custom-container" data-testid="custom-container"></div>

<!-- Basic tooltip -->
<Tooltip.Root isShown={true} id="test-tooltip" referenceElementId="test-tooltip-button" data-testid="tooltip">
    <Tooltip.Inner data-testid="tooltip-inner">This is a tooltip</Tooltip.Inner>
</Tooltip.Root>

<!-- Test different trigger types -->
<Tooltip.Root isShown={true} id="click-tooltip" trigger="click" referenceElementId="click-tooltip-button" data-testid="click-tooltip">
    <Tooltip.Inner data-testid="click-tooltip-inner">This tooltip appears on click</Tooltip.Inner>
</Tooltip.Root>

<Tooltip.Root isShown={true} id="focus-tooltip" trigger="focus" referenceElementId="focus-tooltip-button" data-testid="focus-tooltip">
    <Tooltip.Inner data-testid="focus-tooltip-inner">This tooltip appears on focus</Tooltip.Inner>
</Tooltip.Root>

<!-- Test different placements -->
<Tooltip.Root isShown={true} id="top-tooltip" placement="top" referenceElementId="top-tooltip-button" data-testid="top-tooltip">
    <Tooltip.Inner data-testid="top-tooltip-inner">This tooltip appears on top</Tooltip.Inner>
</Tooltip.Root>

<Tooltip.Root isShown={true} id="bottom-tooltip" placement="bottom" referenceElementId="bottom-tooltip-button" data-testid="bottom-tooltip">
    <Tooltip.Inner data-testid="bottom-tooltip-inner">This tooltip appears on bottom</Tooltip.Inner>
</Tooltip.Root>

<Tooltip.Root isShown={true} id="left-tooltip" placement="left" referenceElementId="left-tooltip-button" data-testid="left-tooltip">
    <Tooltip.Inner data-testid="left-tooltip-inner">This tooltip appears on left</Tooltip.Inner>
</Tooltip.Root>

<!-- Test without fade effect -->
<Tooltip.Root isShown={true} id="no-fade-tooltip" useFade={false} referenceElementId="no-fade-button" data-testid="no-fade-tooltip">
    <Tooltip.Inner data-testid="no-fade-tooltip-inner">This tooltip appears without fade transition</Tooltip.Inner>
</Tooltip.Root>

<!-- Test with container property -->
<Tooltip.Root
    isShown={true}
    id="container-tooltip"
    container="#custom-container"
    referenceElementId="container-tooltip-button"
    data-testid="container-tooltip">
    <Tooltip.Inner data-testid="container-tooltip-inner">This tooltip is rendered in a custom container</Tooltip.Inner>
</Tooltip.Root>

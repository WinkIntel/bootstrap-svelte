<script lang="ts">
    import { Button, Popover } from '$lib/index.js';
</script>

<!-- Reference elements that the popovers will be attached to -->
<Button id="test-popover-button" data-testid="trigger-button">Click for Popover</Button>
<Button id="hover-popover-button" data-testid="hover-trigger">Hover for Popover</Button>
<Button id="focus-popover-button" data-testid="focus-trigger">Focus for Popover</Button>
<Button id="top-popover-button" data-testid="top-trigger">Top Popover</Button>
<Button id="bottom-popover-button" data-testid="bottom-trigger">Bottom Popover</Button>
<Button id="left-popover-button" data-testid="left-trigger">Left Popover</Button>
<Button id="no-fade-button" data-testid="no-fade-trigger">No Fade Popover</Button>
<Button id="container-popover-button" data-testid="container-trigger">Container Popover</Button>

<!-- Custom container for testing container property -->
<div id="custom-container" data-testid="custom-container"></div>

<!-- Basic popover with header and body -->
<Popover.Root isShown={true} id="test-popover" referenceElementId="test-popover-button" data-testid="popover">
    <Popover.Header data-testid="popover-header">Popover Title</Popover.Header>
    <Popover.Body data-testid="popover-body">
        <p data-testid="popover-content-text">This is the popover content.</p>
    </Popover.Body>
</Popover.Root>

<!-- Test different trigger types -->
<Popover.Root isShown={true} id="hover-popover" trigger="hover" referenceElementId="hover-popover-button" data-testid="hover-popover">
    <Popover.Header data-testid="hover-popover-header">Hover Popover</Popover.Header>
    <Popover.Body data-testid="hover-popover-body">This popover appears on hover.</Popover.Body>
</Popover.Root>

<Popover.Root isShown={true} id="focus-popover" trigger="focus" referenceElementId="focus-popover-button" data-testid="focus-popover">
    <Popover.Header data-testid="focus-popover-header">Focus Popover</Popover.Header>
    <Popover.Body data-testid="focus-popover-body">This popover appears on focus.</Popover.Body>
</Popover.Root>

<!-- Test different placements -->
<Popover.Root isShown={true} id="top-popover" placement="top" referenceElementId="top-popover-button" data-testid="top-popover">
    <Popover.Header data-testid="top-popover-header">Top Popover</Popover.Header>
    <Popover.Body data-testid="top-popover-body">This popover appears on top.</Popover.Body>
</Popover.Root>

<Popover.Root isShown={true} id="bottom-popover" placement="bottom" referenceElementId="bottom-popover-button" data-testid="bottom-popover">
    <Popover.Header data-testid="bottom-popover-header">Bottom Popover</Popover.Header>
    <Popover.Body data-testid="bottom-popover-body">This popover appears on bottom.</Popover.Body>
</Popover.Root>

<Popover.Root isShown={true} id="left-popover" placement="left" referenceElementId="left-popover-button" data-testid="left-popover">
    <Popover.Header data-testid="left-popover-header">Left Popover</Popover.Header>
    <Popover.Body data-testid="left-popover-body">This popover appears on left.</Popover.Body>
</Popover.Root>

<!-- Test without fade effect -->
<Popover.Root isShown={true} id="no-fade-popover" useFade={false} referenceElementId="no-fade-button" data-testid="no-fade-popover">
    <Popover.Header data-testid="no-fade-popover-header">No Fade Popover</Popover.Header>
    <Popover.Body data-testid="no-fade-popover-body">This popover appears without fade transition.</Popover.Body>
</Popover.Root>

<!-- Test with custom header level -->
<Popover.Root isShown={true} id="custom-heading-popover" referenceElementId="test-popover-button" data-testid="custom-heading-popover">
    <Popover.Header level={2} data-testid="custom-heading-header">H2 Heading</Popover.Header>
    <Popover.Body data-testid="custom-heading-body">This popover has an H2 heading.</Popover.Body>
</Popover.Root>

<!-- Test with container property -->
<Popover.Root
    isShown={true}
    id="container-popover"
    container="#custom-container"
    referenceElementId="container-popover-button"
    data-testid="container-popover">
    <Popover.Header data-testid="container-popover-header">Container Popover</Popover.Header>
    <Popover.Body data-testid="container-popover-body">This popover is rendered in a custom container.</Popover.Body>
</Popover.Root>

<script lang="ts">
    import { Button, Offcanvas } from '$lib/index.js';
</script>

<Offcanvas.Root isShown={true} id="test-offcanvas" placement="start" class="test-class" data-testid="offcanvas">
    <Offcanvas.Header isDismissible={true} data-testid="offcanvas-header">
        <Offcanvas.Title data-testid="offcanvas-title">Offcanvas Title</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body data-testid="offcanvas-body">
        <p data-testid="offcanvas-content">This is the offcanvas body content.</p>
        <Button colorVariant="secondary" data-testid="close-button">Close</Button>
    </Offcanvas.Body>
</Offcanvas.Root>

<!-- Test different placements -->
<Offcanvas.Root isShown={true} id="end-offcanvas" placement="end" data-testid="end-offcanvas">
    <Offcanvas.Header data-testid="end-header">
        <Offcanvas.Title data-testid="end-title">End Offcanvas</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body data-testid="end-body">End content</Offcanvas.Body>
</Offcanvas.Root>

<Offcanvas.Root isShown={true} id="top-offcanvas" placement="top" data-testid="top-offcanvas">
    <Offcanvas.Header data-testid="top-header">
        <Offcanvas.Title data-testid="top-title">Top Offcanvas</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body data-testid="top-body">Top content</Offcanvas.Body>
</Offcanvas.Root>

<Offcanvas.Root isShown={true} id="bottom-offcanvas" placement="bottom" data-testid="bottom-offcanvas">
    <Offcanvas.Header data-testid="bottom-header">
        <Offcanvas.Title data-testid="bottom-title">Bottom Offcanvas</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body data-testid="bottom-body">Bottom content</Offcanvas.Body>
</Offcanvas.Root>

<!-- Test with static backdrop -->
<Offcanvas.Root isShown={true} id="static-backdrop" useBackdrop="static" data-testid="static-backdrop">
    <Offcanvas.Header data-testid="static-header">
        <Offcanvas.Title data-testid="static-title">Static Backdrop</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body data-testid="static-body">Static backdrop content</Offcanvas.Body>
</Offcanvas.Root>

<!-- Test with no backdrop -->
<Offcanvas.Root isShown={true} id="no-backdrop" useBackdrop={false} data-testid="no-backdrop">
    <Offcanvas.Header data-testid="no-backdrop-header">
        <Offcanvas.Title data-testid="no-backdrop-title">No Backdrop</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body data-testid="no-backdrop-body">No backdrop content</Offcanvas.Body>
</Offcanvas.Root>

<!-- Test with body scrollable -->
<Offcanvas.Root isShown={true} id="scrollable" isBodyScrollable={true} data-testid="scrollable">
    <Offcanvas.Header data-testid="scrollable-header">
        <Offcanvas.Title data-testid="scrollable-title">Scrollable Offcanvas</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body data-testid="scrollable-body">Scrollable content</Offcanvas.Body>
</Offcanvas.Root>

<!-- Test responsive offcanvas -->
<Offcanvas.Root isShown={true} id="responsive" showOnBreakpoint="lg" data-testid="responsive">
    <Offcanvas.Header data-testid="responsive-header">
        <Offcanvas.Title data-testid="responsive-title">Responsive Offcanvas</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body data-testid="responsive-body">Responsive content</Offcanvas.Body>
</Offcanvas.Root>

<script lang="ts">
    import { Button, Modal } from '$lib/index.js';
</script>

<Modal.Root isShown={true} id="test-modal" data-testid="modal">
    <Modal.Dialog data-testid="modal-dialog">
        <Modal.Content data-testid="modal-content">
            <Modal.Header isDismissible={true} data-testid="modal-header">
                <Modal.Title data-testid="modal-title">Modal Title</Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="modal-body">
                <p data-testid="modal-content-text">This is the modal body content.</p>
                <Button colorVariant="secondary" data-testid="close-button">Close</Button>
            </Modal.Body>
            <Modal.Footer data-testid="modal-footer">
                <Button colorVariant="secondary" data-testid="secondary-button">Cancel</Button>
                <Button colorVariant="primary" data-testid="primary-button">Save changes</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<!-- Test different sizes -->
<Modal.Root isShown={true} id="sm-modal" data-testid="sm-modal">
    <Modal.Dialog size="sm" data-testid="sm-dialog">
        <Modal.Content data-testid="sm-content">
            <Modal.Header data-testid="sm-header">
                <Modal.Title data-testid="sm-title">Small Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="sm-body">Small modal content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<Modal.Root isShown={true} id="lg-modal" data-testid="lg-modal">
    <Modal.Dialog size="lg" data-testid="lg-dialog">
        <Modal.Content data-testid="lg-content">
            <Modal.Header data-testid="lg-header">
                <Modal.Title data-testid="lg-title">Large Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="lg-body">Large modal content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<Modal.Root isShown={true} id="xl-modal" data-testid="xl-modal">
    <Modal.Dialog size="xl" data-testid="xl-dialog">
        <Modal.Content data-testid="xl-content">
            <Modal.Header data-testid="xl-header">
                <Modal.Title data-testid="xl-title">Extra Large Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="xl-body">Extra large modal content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<!-- Test with static backdrop -->
<Modal.Root isShown={true} id="static-backdrop" useBackdrop="static" data-testid="static-backdrop">
    <Modal.Dialog data-testid="static-dialog">
        <Modal.Content data-testid="static-content">
            <Modal.Header data-testid="static-header">
                <Modal.Title data-testid="static-title">Static Backdrop</Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="static-body">Static backdrop content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<!-- Test with no backdrop -->
<Modal.Root isShown={true} id="no-backdrop" useBackdrop={false} data-testid="no-backdrop">
    <Modal.Dialog data-testid="no-backdrop-dialog">
        <Modal.Content data-testid="no-backdrop-content">
            <Modal.Header data-testid="no-backdrop-header">
                <Modal.Title data-testid="no-backdrop-title">No Backdrop</Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="no-backdrop-body">No backdrop content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<!-- Test dialog options -->
<Modal.Root isShown={true} id="centered-modal" data-testid="centered-modal">
    <Modal.Dialog isVerticallyCentered={true} data-testid="centered-dialog">
        <Modal.Content data-testid="centered-content">
            <Modal.Header data-testid="centered-header">
                <Modal.Title data-testid="centered-title">Centered Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="centered-body">Centered content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<Modal.Root isShown={true} id="scrollable-modal" data-testid="scrollable-modal">
    <Modal.Dialog isScrollable={true} data-testid="scrollable-dialog">
        <Modal.Content data-testid="scrollable-content">
            <Modal.Header data-testid="scrollable-header">
                <Modal.Title data-testid="scrollable-title">Scrollable Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="scrollable-body">Scrollable content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<!-- Test fullscreen -->
<Modal.Root isShown={true} id="fullscreen-modal" data-testid="fullscreen-modal">
    <Modal.Dialog fullscreenOnBreakpoint="always" data-testid="fullscreen-dialog">
        <Modal.Content data-testid="fullscreen-content">
            <Modal.Header data-testid="fullscreen-header">
                <Modal.Title data-testid="fullscreen-title">Fullscreen Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="fullscreen-body">Fullscreen content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<Modal.Root isShown={true} id="fullscreen-sm-modal" data-testid="fullscreen-sm-modal">
    <Modal.Dialog fullscreenOnBreakpoint="sm" data-testid="fullscreen-sm-dialog">
        <Modal.Content data-testid="fullscreen-sm-content">
            <Modal.Header data-testid="fullscreen-sm-header">
                <Modal.Title data-testid="fullscreen-sm-title">SM Fullscreen Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body data-testid="fullscreen-sm-body">SM Fullscreen content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

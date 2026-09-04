<script lang="ts">
    import { Button, Modal } from '$lib/index.js';

    let showModal = $state(false);
</script>

<Button colorVariant="primary" data-testid="open" onclick={() => (showModal = true)}>Open Modal</Button>

<Modal.Root isShown={showModal} data-testid="modal">
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title>Modal Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>Modal content goes here.</Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" data-testid="close" onclick={() => (showModal = false)}>Close</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<script lang="ts">
    import { Button, Modal } from '$lib/index.js';

    let isShown = $state(false);
</script>

<Button data-testid="modal-opener" onclick={() => (isShown = true)}>Open modal</Button>

<Modal.Root id="accessible-modal" {isShown} useFade={false} onHidden={() => (isShown = false)}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title>Accessible modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button data-testid="modal-action" onclick={() => (isShown = false)}>Close modal</Button>
            </Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

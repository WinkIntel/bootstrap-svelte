<script lang="ts">
    import { Button, Modal } from '$lib/index.js';

    let titleId = $state('initial-modal-title');
</script>

<Button data-testid="change-title-id" onclick={() => (titleId = 'updated-modal-title')}>Change title ID</Button>

<Modal.Root isShown={true} useFade={false}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title id={titleId}>Dynamic modal title</Modal.Title>
            </Modal.Header>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

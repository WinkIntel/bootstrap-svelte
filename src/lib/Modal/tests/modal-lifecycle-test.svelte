<script lang="ts">
    import { Button, Modal } from '$lib/index.js';
    import type { Modal as ModalTypes } from '$lib/index.js';

    let {
        isShown = $bindable(false),
        onShow,
        onShown,
        onHide,
        onHidden
    }: {
        isShown?: boolean;
        onShow?: ModalTypes.RootProps['onShow'];
        onShown?: ModalTypes.RootProps['onShown'];
        onHide?: ModalTypes.RootProps['onHide'];
        onHidden?: ModalTypes.RootProps['onHidden'];
    } = $props();
</script>

<button data-testid="lifecycle-open" onclick={() => (isShown = true)}>Open</button>
<button data-testid="lifecycle-close" onclick={() => (isShown = false)}>Close</button>

<Modal.Root id="lifecycle-modal" data-testid="lifecycle-modal" {isShown} {onShow} {onShown} {onHide} {onHidden}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title>Lifecycle modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button data-testid="lifecycle-secondary-button">Cancel</Button>
                <Button data-testid="lifecycle-primary-button">Save</Button>
            </Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

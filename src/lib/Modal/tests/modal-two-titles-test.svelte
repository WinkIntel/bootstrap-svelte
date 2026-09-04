<script lang="ts">
    import { Modal } from '$lib/index.js';

    let showFirstTitle = $state(true);
</script>

<button data-testid="remove-first" onclick={() => (showFirstTitle = false)}>Remove first title</button>

<Modal.Root isShown={true} useFade={false} data-testid="modal">
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header>
                {#if showFirstTitle}
                    <Modal.Title id="first-title">First Title</Modal.Title>
                {/if}
                <Modal.Title id="second-title">Second Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>Body</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

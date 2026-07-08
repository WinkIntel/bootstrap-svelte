<script lang="ts">
    import { Modal } from '$lib/index.js';

    let isAShown = $state(false);
    let isBShown = $state(false);
</script>

<button data-testid="open-a" onclick={() => (isAShown = true)}>Open A</button>
<button data-testid="close-a" onclick={() => (isAShown = false)}>Close A</button>
<button data-testid="open-b" onclick={() => (isBShown = true)}>Open B</button>
<button data-testid="close-b" onclick={() => (isBShown = false)}>Close B</button>

<Modal.Root id="stacked-modal-a" data-testid="stacked-modal-a" isShown={isAShown} useFade={false}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Body>Modal A content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<Modal.Root id="stacked-modal-b" data-testid="stacked-modal-b" isShown={isBShown} useFade={false}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Body>Modal B content</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

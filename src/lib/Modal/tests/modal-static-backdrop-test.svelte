<script lang="ts">
    import { Modal } from '$lib/index.js';

    let isMounted = $state(true);
    let isShown = $state(false);
</script>

<button data-testid="open-static-modal" onclick={() => (isShown = true)}>Open</button>
<button data-testid="unmount-static-modal" onclick={() => (isMounted = false)}>Unmount</button>

{#if isMounted}
    <Modal.Root data-testid="static-modal" id="static-modal" {isShown} useBackdrop="static" useFade={false}>
        <Modal.Dialog>
            <Modal.Content>
                <Modal.Body>Static modal</Modal.Body>
            </Modal.Content>
        </Modal.Dialog>
    </Modal.Root>
{/if}

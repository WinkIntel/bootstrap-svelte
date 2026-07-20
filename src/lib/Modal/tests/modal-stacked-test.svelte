<script lang="ts">
    import { Modal } from '$lib/index.js';

    let isAShown = $state(false);
    let isBShown = $state(false);
    let isBMounted = $state(true);
</script>

<button data-testid="open-a" onclick={() => (isAShown = true)}>Open A</button>
<button data-testid="close-a" onclick={() => (isAShown = false)}>Close A</button>
<button data-testid="open-b" onclick={() => (isBShown = true)}>Open B</button>
<button data-testid="close-b" onclick={() => (isBShown = false)}>Close B</button>
<button data-testid="unmount-b" onclick={() => (isBMounted = false)}>Unmount B</button>

<Modal.Root id="stacked-modal-a" data-testid="stacked-modal-a" isShown={isAShown} useFade={false}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Body>
                Modal A content
                <button data-testid="a-first">A first</button>
                <button data-testid="a-last">A last</button>
                <button data-testid="open-b-inside-a" onclick={() => (isBShown = true)}>Open B inside A</button>
            </Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

{#if isBMounted}
    <Modal.Root id="stacked-modal-b" data-testid="stacked-modal-b" isShown={isBShown} useFade={false}>
        <Modal.Dialog>
            <Modal.Content>
                <Modal.Body>
                    Modal B content
                    <button data-testid="b-first">B first</button>
                    <button data-testid="b-last">B last</button>
                </Modal.Body>
            </Modal.Content>
        </Modal.Dialog>
    </Modal.Root>
{/if}

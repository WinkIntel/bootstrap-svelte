<script lang="ts">
    import { Modal, Offcanvas } from '$lib/index.js';

    let isModalShown = $state(false);
    let isOffcanvasShown = $state(false);
</script>

<button data-testid="open-mixed-overlays" onclick={() => ((isModalShown = true), (isOffcanvasShown = true))}>Open overlays</button>
<button data-testid="open-mixed-modal" onclick={() => (isModalShown = true)}>Open modal</button>
<button data-testid="open-mixed-offcanvas" onclick={() => (isOffcanvasShown = true)}>Open offcanvas</button>
<button data-testid="close-mixed-modal" onclick={() => (isModalShown = false)}>Close modal</button>
<button data-testid="close-mixed-offcanvas" onclick={() => (isOffcanvasShown = false)}>Close offcanvas</button>

<Modal.Root id="mixed-modal" data-testid="mixed-modal" isShown={isModalShown} useBackdrop={false} useFade={false}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Body>Mixed modal</Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<Offcanvas.Root id="mixed-offcanvas" data-testid="mixed-offcanvas" isShown={isOffcanvasShown} useBackdrop={false}>
    <Offcanvas.Body>Mixed offcanvas</Offcanvas.Body>
</Offcanvas.Root>

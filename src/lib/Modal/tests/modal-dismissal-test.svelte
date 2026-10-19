<script lang="ts">
    import { Modal } from '../index.js';
    let props: Modal.RootProps = $props();
</script>

<Modal.Root {...props}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header><Modal.Title>Dismissal modal</Modal.Title></Modal.Header>
            <Modal.Body><button>Inside action</button></Modal.Body>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

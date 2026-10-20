<script lang="ts">
    import { Toast } from '$lib/index.js';
</script>

<!-- Basic toast -->
<Toast.Root isShown={true} id="test-toast" data-testid="toast">
    <Toast.Header data-testid="toast-header">
        <span data-testid="toast-header-content">Toast Title</span>
    </Toast.Header>
    <Toast.Body data-testid="toast-body">This is a toast message</Toast.Body>
</Toast.Root>

<!-- Toast without fade effect -->
<Toast.Root isShown={true} id="no-fade-toast" useFade={false} data-testid="no-fade-toast">
    <Toast.Header data-testid="no-fade-header">
        <span>No Fade Toast</span>
    </Toast.Header>
    <Toast.Body data-testid="no-fade-body">This toast appears without fade transition</Toast.Body>
</Toast.Root>

<!-- Toast with header that has no dismiss button -->
<Toast.Root isShown={true} id="no-dismiss-toast" data-testid="no-dismiss-toast">
    <Toast.Header isDismissible={false} data-testid="no-dismiss-header">
        <span>No Dismiss Button Toast</span>
    </Toast.Header>
    <Toast.Body data-testid="no-dismiss-body">This toast header has no dismiss button</Toast.Body>
</Toast.Root>

<!-- Toast inside a container with specific placement -->
<Toast.Container id="custom-container" placement="top-end" data-testid="toast-container">
    <Toast.Root isShown={true} id="container-toast" data-testid="container-toast">
        <Toast.Header data-testid="container-header">
            <span>Container Toast</span>
        </Toast.Header>
        <Toast.Body data-testid="container-body">This toast is rendered in a container at top-end</Toast.Body>
    </Toast.Root>
</Toast.Container>

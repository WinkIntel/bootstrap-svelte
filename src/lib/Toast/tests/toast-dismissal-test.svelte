<script lang="ts">
    import { Toast } from '../index.js';
    let props: Toast.RootProps = $props();
</script>

<Toast.Root {...props}>
    <Toast.Header>Notification</Toast.Header>
    <Toast.Body>Dismissal test</Toast.Body>
</Toast.Root>

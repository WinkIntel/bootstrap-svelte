<script lang="ts">
    import { Offcanvas } from '$lib/index.js';

    let { showOnBreakpoint, isShown = false }: Pick<Offcanvas.RootProps, 'showOnBreakpoint' | 'isShown'> = $props();
</script>

<Offcanvas.Root {showOnBreakpoint} {isShown}>
    <Offcanvas.Header isDismissible><Offcanvas.Title>Panel</Offcanvas.Title></Offcanvas.Header>
    <Offcanvas.Body>Panel content</Offcanvas.Body>
</Offcanvas.Root>

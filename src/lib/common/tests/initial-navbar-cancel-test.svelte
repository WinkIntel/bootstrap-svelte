<script lang="ts">
    import { Navbar, Offcanvas } from '$lib/index.js';
    let { mounted = false, onShow, onShown }: { mounted?: boolean; onShow: (event: Event) => void; onShown: (event: Event) => void } = $props();
    let isShown = $state(true);
</script>

<Navbar.Root expandOnBreakpoint="lg">
    <Navbar.Toggler data-testid="expand-navbar">Expand</Navbar.Toggler>
    {#if mounted}
        <Offcanvas.Root
            {isShown}
            onShow={(event) => {
                onShow(event);
                isShown = false;
            }}
            {onShown}
            data-testid="conditional-panel">
            <Offcanvas.Body>Panel</Offcanvas.Body>
        </Offcanvas.Root>
    {/if}
</Navbar.Root>

<script lang="ts">
    import { Navbar, Offcanvas } from '$lib/index.js';

    let {
        expandOnBreakpoint,
        isShown,
        showOnBreakpoint,
        withOffcanvas = true
    }: Pick<Navbar.RootProps, 'expandOnBreakpoint'> &
        Pick<Offcanvas.RootProps, 'showOnBreakpoint'> & {
            isShown?: boolean;
            withOffcanvas?: boolean;
        } = $props();
</script>

<Navbar.Root {expandOnBreakpoint} data-testid="responsive-navbar">
    <Navbar.Toggler data-testid="responsive-toggler"><Navbar.TogglerIcon /></Navbar.Toggler>
    <Navbar.Collapse transitionDuration={0} data-testid="responsive-collapse">Navigation</Navbar.Collapse>
    {#if withOffcanvas}
        <Offcanvas.Root {isShown} {showOnBreakpoint} data-testid="responsive-offcanvas">
            <Offcanvas.Header isDismissible><Offcanvas.Title>Navigation</Offcanvas.Title></Offcanvas.Header>
            <Offcanvas.Body>Links</Offcanvas.Body>
        </Offcanvas.Root>
    {/if}
</Navbar.Root>

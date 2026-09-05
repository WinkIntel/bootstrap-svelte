<script lang="ts">
    import { Container, Navbar, Offcanvas } from '$lib/index.js';

    let {
        onShown,
        onHidden,
        useBackdrop = false,
        showOnBreakpoint,
        isShown
    }: Pick<Offcanvas.RootProps, 'onShown' | 'onHidden' | 'useBackdrop' | 'showOnBreakpoint' | 'isShown'> = $props();
</script>

<Navbar.Root expandOnBreakpoint="lg">
    <Container>
        <Navbar.Toggler data-testid="navbar-toggler"><Navbar.TogglerIcon /></Navbar.Toggler>
        <Offcanvas.Root {isShown} {useBackdrop} {showOnBreakpoint} {onShown} {onHidden} data-testid="navbar-offcanvas">
            <Offcanvas.Header isDismissible={true}><Offcanvas.Title>Menu</Offcanvas.Title></Offcanvas.Header>
            <Offcanvas.Body>Body</Offcanvas.Body>
        </Offcanvas.Root>
    </Container>
</Navbar.Root>

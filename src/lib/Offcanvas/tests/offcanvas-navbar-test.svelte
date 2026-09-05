<script lang="ts">
    import { Container, Navbar, Offcanvas } from '$lib/index.js';

    let { onShown, onHidden }: Pick<Offcanvas.RootProps, 'onShown' | 'onHidden'> = $props();
    let isShown = $state(false);
</script>

<Navbar.Root expandOnBreakpoint="lg">
    <Container>
        <Navbar.Toggler data-testid="navbar-toggler"><Navbar.TogglerIcon /></Navbar.Toggler>
        <Offcanvas.Root
            {isShown}
            useBackdrop={false}
            {onShown}
            onHidden={(event) => {
                isShown = false;
                onHidden?.(event);
            }}
            data-testid="navbar-offcanvas">
            <Offcanvas.Header isDismissible={true}><Offcanvas.Title>Menu</Offcanvas.Title></Offcanvas.Header>
            <Offcanvas.Body>Body</Offcanvas.Body>
        </Offcanvas.Root>
    </Container>
</Navbar.Root>

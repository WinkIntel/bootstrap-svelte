<script lang="ts">
    import { Container, Navbar, Offcanvas } from '$lib/index.js';

    let {
        onShown,
        onHidden,
        onHidePrevented,
        onInsideClick,
        useBackdrop = false,
        showOnBreakpoint,
        isShown
    }: Pick<Offcanvas.RootProps, 'onShown' | 'onHidden' | 'onHidePrevented' | 'useBackdrop' | 'showOnBreakpoint' | 'isShown'> & {
        onInsideClick?: () => void;
    } = $props();
</script>

<Navbar.Root expandOnBreakpoint="lg">
    <Container>
        <Navbar.Toggler data-testid="navbar-toggler"><Navbar.TogglerIcon /></Navbar.Toggler>
        <Offcanvas.Root {isShown} {useBackdrop} {showOnBreakpoint} {onShown} {onHidden} {onHidePrevented} data-testid="navbar-offcanvas">
            <Offcanvas.Header isDismissible={true}><Offcanvas.Title>Menu</Offcanvas.Title></Offcanvas.Header>
            <Offcanvas.Body><button onclick={onInsideClick} data-testid="navbar-inside-action">Inside action</button></Offcanvas.Body>
        </Offcanvas.Root>
    </Container>
</Navbar.Root>

<script lang="ts">
    import { Container, Navbar, Offcanvas } from '$lib/index.js';

    let {
        onShown,
        onHidden,
        onHidePrevented,
        useBackdrop = false,
        showOnBreakpoint,
        isShown,
        id,
        ariaControls,
        togglerDisabled = false,
        fieldsetDisabled = false,
        renderOffcanvas = true,
        renderToggler = true,
        renderCollapse = false,
        renderFollowingCollapse = false
    }: Pick<Offcanvas.RootProps, 'id' | 'onShown' | 'onHidden' | 'onHidePrevented' | 'useBackdrop' | 'showOnBreakpoint' | 'isShown'> & {
        ariaControls?: string;
        togglerDisabled?: boolean;
        fieldsetDisabled?: boolean;
        renderOffcanvas?: boolean;
        renderToggler?: boolean;
        renderCollapse?: boolean;
        renderFollowingCollapse?: boolean;
    } = $props();
</script>

<Navbar.Root expandOnBreakpoint="lg">
    <Container>
        {#if renderToggler}
            <fieldset disabled={fieldsetDisabled}>
                <Navbar.Toggler disabled={togglerDisabled} aria-controls={ariaControls} data-testid="navbar-toggler"
                    ><Navbar.TogglerIcon /></Navbar.Toggler>
            </fieldset>
        {/if}
        {#if renderCollapse}
            <Navbar.Collapse id="fallback-collapse">Fallback</Navbar.Collapse>
        {/if}
        {#if renderOffcanvas}
            <Offcanvas.Root {id} {isShown} {useBackdrop} {showOnBreakpoint} {onShown} {onHidden} {onHidePrevented} data-testid="navbar-offcanvas">
                <Offcanvas.Header isDismissible={true}><Offcanvas.Title>Menu</Offcanvas.Title></Offcanvas.Header>
                <Offcanvas.Body>Body</Offcanvas.Body>
            </Offcanvas.Root>
        {/if}
        {#if renderFollowingCollapse}
            <Navbar.Collapse id="following-collapse">Following</Navbar.Collapse>
        {/if}
    </Container>
</Navbar.Root>

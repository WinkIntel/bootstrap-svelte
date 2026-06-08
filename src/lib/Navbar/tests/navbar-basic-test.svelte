<script lang="ts">
    import { Container, Nav, Navbar } from '$lib/index.js';
</script>

<!-- Test with undefined expandOnBreakpoint to completely disable media queries -->
<Navbar.Root expandOnBreakpoint={undefined} class="bg-body-tertiary" data-testid="navbar">
    <Container isFluid={true} data-testid="container">
        <Navbar.Brand href="#!" data-testid="navbar-brand">Navbar Brand</Navbar.Brand>
        <Navbar.Text data-testid="navbar-text">Some navbar text</Navbar.Text>
        <Navbar.Toggler ariaLabel="Toggle navigation" data-testid="navbar-toggler">
            <Navbar.TogglerIcon data-testid="navbar-toggler-icon" />
        </Navbar.Toggler>
        <Navbar.Collapse data-testid="navbar-collapse">
            <Navbar.Nav class="me-auto mb-2 mb-lg-0" data-testid="navbar-nav">
                <Nav.Item data-testid="nav-item-active">
                    <Nav.Link isActive={true} href="#!" data-testid="nav-link-active">Active Link</Nav.Link>
                </Nav.Item>
                <Nav.Item data-testid="nav-item-normal">
                    <Nav.Link href="#!" data-testid="nav-link-normal">Normal Link</Nav.Link>
                </Nav.Item>
                <Nav.Item data-testid="nav-item-disabled">
                    <Nav.Link isDisabled={true} href="#!" data-testid="nav-link-disabled">Disabled Link</Nav.Link>
                </Nav.Item>
            </Navbar.Nav>
        </Navbar.Collapse>
    </Container>
</Navbar.Root>

<script lang="ts">
    import { Navbar } from '$lib/index.js';
</script>

<Navbar.Root>
    <Navbar.Toggler ariaLabel="Custom label" aria-label="Native label" data-testid="custom-toggler" />
    <Navbar.Toggler aria-label="Native label" data-testid="native-toggler" />
    <Navbar.Toggler data-testid="default-toggler" />
    <Navbar.Toggler onclick={null} data-testid="null-handler-toggler" />
</Navbar.Root>

<Navbar.Root>
    <Navbar.Toggler data-testid="registered-controls-toggler" />
    <Navbar.Collapse id="registered-navbar-collapse">Registered collapse</Navbar.Collapse>
</Navbar.Root>

<div id="external-navbar-target"></div>
<Navbar.Root>
    <Navbar.Toggler aria-controls="external-navbar-target" data-testid="explicit-controls-toggler" />
    <Navbar.Collapse id="internal-navbar-collapse">Internal collapse</Navbar.Collapse>
</Navbar.Root>

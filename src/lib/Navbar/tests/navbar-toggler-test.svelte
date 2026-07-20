<script lang="ts">
    import { Navbar } from '$lib/index.js';
</script>

<Navbar.Root>
    <Navbar.Toggler ariaLabel="Custom label" aria-label="Native label" data-testid="custom-toggler" />
    <Navbar.Toggler aria-label="Native label" data-testid="native-toggler" />
    <Navbar.Toggler data-testid="default-toggler" />
    <Navbar.Toggler onclick={null} data-testid="null-handler-toggler" />
</Navbar.Root>

<script lang="ts">
    import { Navbar } from '$lib/Navbar/index.js';
</script>

<div id="consumer-collapse"></div>
<Navbar.Root>
    <Navbar.Toggler aria-controls="consumer-collapse">Menu</Navbar.Toggler>
    <Navbar.Collapse id="generated-collapse">Content</Navbar.Collapse>
</Navbar.Root>

<Navbar.Root id="default-navbar">
    <Navbar.Toggler>Default menu</Navbar.Toggler>
    <Navbar.Collapse>Default content</Navbar.Collapse>
</Navbar.Root>

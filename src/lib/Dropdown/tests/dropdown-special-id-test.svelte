<script lang="ts">
    import { Dropdown } from '$lib/index.js';
</script>

<!-- Dropdown with a consumer-supplied id starting with a digit, which is invalid as a
     CSS identifier and throws `SyntaxError: '#1-dropdown' is not a valid selector` when
     interpolated unescaped into a `closest()`/`querySelector()` call. -->
<Dropdown.Root id="1-dropdown" data-testid="special-id-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="special-id-toggle">Special Id Dropdown</Dropdown.Toggle>
    <Dropdown.Menu data-testid="special-id-menu">
        <Dropdown.Item href="#!" data-testid="special-id-item-1">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

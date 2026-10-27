<script lang="ts">
    import { Dropdown } from '../index.js';
    let {
        display = 'dynamic',
        offset = [0, 2],
        inNavbar = false
    }: { display?: Dropdown.RootProps['display']; offset?: Dropdown.MenuProps['offset']; inNavbar?: boolean } = $props();
</script>

<div class:navbar-nav={inNavbar}>
    <Dropdown.Root {display}>
        <Dropdown.Toggle data-testid="toggle">Toggle</Dropdown.Toggle>
        <Dropdown.Menu {offset} data-testid="menu"><Dropdown.Item>Item</Dropdown.Item></Dropdown.Menu>
    </Dropdown.Root>
</div>

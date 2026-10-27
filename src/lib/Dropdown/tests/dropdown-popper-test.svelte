<script lang="ts">
    import { Dropdown } from '../index.js';
    let { display = 'dynamic', offset = [0, 2] }: { display?: Dropdown.RootProps['display']; offset?: Dropdown.MenuProps['offset'] } = $props();
</script>

<Dropdown.Root {display}>
    <Dropdown.Toggle data-testid="toggle">Toggle</Dropdown.Toggle>
    <Dropdown.Menu {offset} data-testid="menu"><Dropdown.Item>Item</Dropdown.Item></Dropdown.Menu>
</Dropdown.Root>

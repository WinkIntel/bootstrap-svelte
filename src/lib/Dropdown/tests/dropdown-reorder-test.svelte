<script lang="ts">
    import { Dropdown } from '$lib/index.js';

    const items = Array.from({ length: 8 }, (_, index) => index + 1);
</script>

<Dropdown.Root>
    <Dropdown.Toggle>Menu</Dropdown.Toggle>
    <Dropdown.Menu>
        {#each items as item (item)}
            <Dropdown.Item>Item {item}</Dropdown.Item>
        {/each}
    </Dropdown.Menu>
</Dropdown.Root>

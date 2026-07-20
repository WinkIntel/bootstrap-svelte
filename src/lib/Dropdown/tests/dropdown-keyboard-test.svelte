<script lang="ts">
    import { Dropdown } from '$lib/index.js';

    let disabledActivations = $state(0);
    let showDynamicSecond = $state(true);
</script>

<!-- Basic keyboard navigation test -->
<Dropdown.Root data-testid="keyboard-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="keyboard-toggle">Keyboard Test</Dropdown.Toggle>
    <Dropdown.Menu data-testid="keyboard-menu">
        <Dropdown.Item href="#!" data-testid="keyboard-item-1">First Item</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="keyboard-item-2">Second Item</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="keyboard-item-3">Third Item</Dropdown.Item>
        <Dropdown.Item href="#!" isDisabled={true} data-testid="keyboard-item-4" onclick={() => (disabledActivations += 1)}
            >Disabled Item</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="keyboard-item-5">Fifth Item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<output data-testid="disabled-activation-count">{disabledActivations}</output>

<button data-testid="remove-dynamic-item" onclick={() => (showDynamicSecond = false)}>Remove dynamic item</button>
<button data-testid="restore-dynamic-item" onclick={() => (showDynamicSecond = true)}>Restore dynamic item</button>
<Dropdown.Root autoClose={false} data-testid="keyboard-dynamic-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="keyboard-dynamic-toggle">Dynamic Items</Dropdown.Toggle>
    <Dropdown.Menu data-testid="keyboard-dynamic-menu">
        <Dropdown.Item href="#!" data-testid="keyboard-dynamic-item-1">First dynamic item</Dropdown.Item>
        {#if showDynamicSecond}
            <Dropdown.Item href="#!" data-testid="keyboard-dynamic-item-2">Second dynamic item</Dropdown.Item>
        {/if}
        <Dropdown.Item href="#!" data-testid="keyboard-dynamic-item-3">Third dynamic item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Test with button items (no href) -->
<Dropdown.Root data-testid="keyboard-button-dropdown">
    <Dropdown.Toggle colorVariant="primary" data-testid="keyboard-button-toggle">Button Items</Dropdown.Toggle>
    <Dropdown.Menu data-testid="keyboard-button-menu">
        <Dropdown.Item data-testid="keyboard-button-item-1">Button Item 1</Dropdown.Item>
        <Dropdown.Item data-testid="keyboard-button-item-2">Button Item 2</Dropdown.Item>
        <Dropdown.Item data-testid="keyboard-button-item-3">Button Item 3</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Test with mixed item types -->
<Dropdown.Root data-testid="keyboard-mixed-dropdown">
    <Dropdown.Toggle colorVariant="success" data-testid="keyboard-mixed-toggle">Mixed Items</Dropdown.Toggle>
    <Dropdown.Menu data-testid="keyboard-mixed-menu">
        <Dropdown.Item href="#!" data-testid="keyboard-mixed-item-1">Link Item</Dropdown.Item>
        <Dropdown.Item data-testid="keyboard-mixed-item-2">Button Item</Dropdown.Item>
        <Dropdown.Item href="#!" isActive={true} data-testid="keyboard-mixed-item-3">Active Link</Dropdown.Item>
        <Dropdown.Item isDisabled={true} data-testid="keyboard-mixed-item-4">Disabled Button</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Test with single item -->
<Dropdown.Root data-testid="keyboard-single-dropdown">
    <Dropdown.Toggle colorVariant="info" data-testid="keyboard-single-toggle">Single Item</Dropdown.Toggle>
    <Dropdown.Menu data-testid="keyboard-single-menu">
        <Dropdown.Item href="#!" data-testid="keyboard-single-item">Only Item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Test with empty dropdown -->
<Dropdown.Root data-testid="keyboard-empty-dropdown">
    <Dropdown.Toggle colorVariant="warning" data-testid="keyboard-empty-toggle">Empty Dropdown</Dropdown.Toggle>
    <Dropdown.Menu data-testid="keyboard-empty-menu">
        <!-- No items -->
    </Dropdown.Menu>
</Dropdown.Root>

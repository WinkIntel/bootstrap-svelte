<script lang="ts">
    import { Dropdown } from '$lib/index.js';
    import { onMount } from 'svelte';

    let customContainerElement: HTMLElement | null = $state(null);
    let customContainerReady = $state(false);

    onMount(() => {
        // Create a custom container element for testing
        const container = document.createElement('div');
        container.id = 'custom-dropdown-container';
        container.setAttribute('data-testid', 'custom-container');
        document.body.appendChild(container);
        customContainerElement = container;
        customContainerReady = true;

        return () => {
            // Cleanup
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        };
    });
</script>

<!-- Default container behavior (container=false) -->
<Dropdown.Root data-testid="default-container-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="default-container-toggle">Default Container</Dropdown.Toggle>
    <Dropdown.Menu data-testid="default-container-menu">
        <Dropdown.Item href="#!" data-testid="default-container-item">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Container as body string -->
<Dropdown.Root data-testid="body-container-dropdown">
    <Dropdown.Toggle colorVariant="primary" data-testid="body-container-toggle">Body Container</Dropdown.Toggle>
    <Dropdown.Menu container="body" data-testid="body-container-menu">
        <Dropdown.Item href="#!" data-testid="body-container-item">Action in Body</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Container as custom string selector -->
{#if customContainerReady}
    <Dropdown.Root data-testid="custom-selector-dropdown">
        <Dropdown.Toggle colorVariant="success" data-testid="custom-selector-toggle">Custom Selector</Dropdown.Toggle>
        <Dropdown.Menu container="#custom-dropdown-container" data-testid="custom-selector-menu">
            <Dropdown.Item href="#!" data-testid="custom-selector-item">Action in Custom Container</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown.Root>
{/if}

<!-- Container as HTMLElement -->
{#if customContainerElement}
    <Dropdown.Root data-testid="element-container-dropdown">
        <Dropdown.Toggle colorVariant="info" data-testid="element-container-toggle">Element Container</Dropdown.Toggle>
        <Dropdown.Menu container={customContainerElement} data-testid="element-container-menu">
            <Dropdown.Item href="#!" data-testid="element-container-item">Action in Element Container</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown.Root>
{/if}

<!-- Container disabled explicitly -->
<Dropdown.Root data-testid="disabled-container-dropdown">
    <Dropdown.Toggle colorVariant="warning" data-testid="disabled-container-toggle">Disabled Container</Dropdown.Toggle>
    <Dropdown.Menu container={false} data-testid="disabled-container-menu">
        <Dropdown.Item href="#!" data-testid="disabled-container-item">Action Inline</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Portaled menu with outside-only auto-close behavior -->
<Dropdown.Root autoClose="outside" data-testid="outside-autoclose-container-dropdown">
    <Dropdown.Toggle colorVariant="dark" data-testid="outside-autoclose-container-toggle">Outside Auto Close</Dropdown.Toggle>
    <Dropdown.Menu container="body" data-testid="outside-autoclose-container-menu">
        <Dropdown.Item href="#!" data-testid="outside-autoclose-container-item">Portaled action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<script lang="ts">
    import { Dropdown } from '$lib/index.js';

    let ancestorKeydowns = $state(0);
</script>

<!-- The wrapper stands in for an app-level container that also dismisses on Escape.
     It must not see the Escape that a dropdown has already consumed. -->
<div data-testid="dismiss-ancestor" onkeydown={() => (ancestorKeydowns += 1)} role="presentation">
    <Dropdown.Root data-testid="dismiss-dropdown">
        <Dropdown.Toggle colorVariant="secondary" data-testid="dismiss-toggle">Dismiss Test</Dropdown.Toggle>
        <Dropdown.Menu data-testid="dismiss-menu">
            <Dropdown.Item href="#!" data-testid="dismiss-item-1">First Item</Dropdown.Item>
            <Dropdown.Item href="#!" data-testid="dismiss-item-2">Second Item</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown.Root>
</div>

<output data-testid="ancestor-keydown-count">{ancestorKeydowns}</output>

<!-- Escape ignores autoClose; Tab respects it the same way an outside click does. -->
<Dropdown.Root autoClose={false} data-testid="dismiss-noautoclose-dropdown">
    <Dropdown.Toggle colorVariant="primary" data-testid="dismiss-noautoclose-toggle">No Auto Close</Dropdown.Toggle>
    <Dropdown.Menu data-testid="dismiss-noautoclose-menu">
        <Dropdown.Item href="#!" data-testid="dismiss-noautoclose-item">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root autoClose="inside" data-testid="dismiss-inside-dropdown">
    <Dropdown.Toggle colorVariant="success" data-testid="dismiss-inside-toggle">Inside Auto Close</Dropdown.Toggle>
    <Dropdown.Menu data-testid="dismiss-inside-menu">
        <Dropdown.Item href="#!" data-testid="dismiss-inside-item">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- A portaled menu lives outside the root element, so containment has to consider it. -->
<Dropdown.Root data-testid="dismiss-portal-dropdown">
    <Dropdown.Toggle colorVariant="info" data-testid="dismiss-portal-toggle">Portaled Menu</Dropdown.Toggle>
    <Dropdown.Menu container="body" data-testid="dismiss-portal-menu">
        <Dropdown.Item href="#!" data-testid="dismiss-portal-item-1">First Item</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="dismiss-portal-item-2">Second Item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Somewhere for focus to land when tabbing out of a dropdown. -->
<button data-testid="dismiss-outside-button" type="button">Outside</button>

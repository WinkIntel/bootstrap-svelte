<script lang="ts">
    import { Dropdown } from '$lib/index.js';

    let ancestorKeydowns = $state(0);
    let menuKeydowns = $state(0);
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

<!-- Focusable content that is not a Dropdown.Item. Escape has to reach the menu boundary
     for these, since they carry no dropdown keydown handler of their own. -->
<Dropdown.Root data-testid="dismiss-custom-dropdown">
    <Dropdown.Toggle colorVariant="warning" data-testid="dismiss-custom-toggle">Custom Content</Dropdown.Toggle>
    <Dropdown.Menu data-testid="dismiss-custom-menu" onkeydown={() => (menuKeydowns += 1)}>
        <form class="px-4 py-3">
            <input type="email" data-testid="dismiss-custom-input" aria-label="Email" />
            <input type="checkbox" data-testid="dismiss-custom-checkbox" aria-label="Remember me" />
            <a href="#!" data-testid="dismiss-custom-link">A plain link</a>
            <button type="button" data-testid="dismiss-custom-button">A plain button</button>
        </form>
        <Dropdown.Item href="#!" data-testid="dismiss-custom-item">A real item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<output data-testid="menu-keydown-count">{menuKeydowns}</output>

<!-- Same, but portaled out of the root so containment cannot rely on the root element. -->
<Dropdown.Root data-testid="dismiss-custom-portal-dropdown">
    <Dropdown.Toggle colorVariant="dark" data-testid="dismiss-custom-portal-toggle">Portaled Custom Content</Dropdown.Toggle>
    <Dropdown.Menu container="body" data-testid="dismiss-custom-portal-menu">
        <input type="text" data-testid="dismiss-custom-portal-input" aria-label="Search" />
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Somewhere for focus to land when tabbing out of a dropdown. -->
<button data-testid="dismiss-outside-button" type="button">Outside</button>

<script lang="ts">
    import { Button, Dropdown, Navbar } from '$lib/index.js';
</script>

<!-- Basic dropdown -->
<Dropdown.Root data-testid="basic-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="basic-toggle">Basic Dropdown</Dropdown.Toggle>
    <Dropdown.Menu data-testid="basic-menu">
        <Dropdown.Item href="#!" data-testid="basic-item-1">Action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="basic-item-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="basic-item-3">Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Dropdown with different color variants -->
<Dropdown.Root isButtonGroup={true} data-testid="primary-dropdown">
    <Dropdown.Toggle colorVariant="primary" data-testid="primary-toggle">Primary</Dropdown.Toggle>
    <Dropdown.Menu data-testid="primary-menu">
        <Dropdown.Item href="#!" data-testid="primary-item-1">Action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="primary-item-2">Another action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root isButtonGroup={true} data-testid="success-dropdown">
    <Dropdown.Toggle colorVariant="success" data-testid="success-toggle">Success</Dropdown.Toggle>
    <Dropdown.Menu data-testid="success-menu">
        <Dropdown.Item href="#!" data-testid="success-item-1">Action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="success-item-2">Another action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Split button dropdown -->
<Dropdown.Root isButtonGroup={true} data-testid="split-dropdown">
    <Button colorVariant="primary" data-testid="split-button">Primary</Button>
    <Dropdown.Toggle colorVariant="primary" isSplit={true} data-testid="split-toggle"></Dropdown.Toggle>
    <Dropdown.Menu data-testid="split-menu">
        <Dropdown.Item href="#!" data-testid="split-item-1">Action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="split-item-2">Another action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Dropdown with different sizes -->
<Dropdown.Root isButtonGroup={true} data-testid="small-dropdown">
    <Dropdown.Toggle colorVariant="primary" size="sm" data-testid="small-toggle">Small</Dropdown.Toggle>
    <Dropdown.Menu data-testid="small-menu">
        <Dropdown.Item href="#!" data-testid="small-item-1">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root isButtonGroup={true} data-testid="large-dropdown">
    <Dropdown.Toggle colorVariant="success" size="lg" data-testid="large-toggle">Large</Dropdown.Toggle>
    <Dropdown.Menu data-testid="large-menu">
        <Dropdown.Item href="#!" data-testid="large-item-1">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Dark dropdown -->
<Dropdown.Root isButtonGroup={true} data-testid="dark-dropdown">
    <Dropdown.Toggle colorVariant="dark" data-testid="dark-toggle">Dark Dropdown</Dropdown.Toggle>
    <Dropdown.Menu isDark={true} data-testid="dark-menu">
        <Dropdown.Item href="#!" data-testid="dark-item-1">Action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="dark-item-2">Another action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Dropdown directions -->
<Dropdown.Root direction="dropup" isButtonGroup={true} data-testid="dropup-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="dropup-toggle">Dropup</Dropdown.Toggle>
    <Dropdown.Menu data-testid="dropup-menu">
        <Dropdown.Item href="#!" data-testid="dropup-item-1">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root direction="dropend" isButtonGroup={true} data-testid="dropend-dropdown">
    <Dropdown.Toggle colorVariant="success" data-testid="dropend-toggle">Dropend</Dropdown.Toggle>
    <Dropdown.Menu data-testid="dropend-menu">
        <Dropdown.Item href="#!" data-testid="dropend-item-1">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root direction="dropstart" isButtonGroup={true} data-testid="dropstart-dropdown">
    <Dropdown.Toggle colorVariant="info" data-testid="dropstart-toggle">Dropstart</Dropdown.Toggle>
    <Dropdown.Menu data-testid="dropstart-menu">
        <Dropdown.Item href="#!" data-testid="dropstart-item-1">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Menu items as buttons (no href) -->
<Dropdown.Root data-testid="button-items-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="button-items-toggle">Button Items</Dropdown.Toggle>
    <Dropdown.Menu data-testid="button-items-menu">
        <Dropdown.Item data-testid="button-item-1">Action</Dropdown.Item>
        <Dropdown.Item data-testid="button-item-2">Another action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Menu item with real href (should not call preventDefault) -->
<Dropdown.Root data-testid="real-href-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="real-href-toggle">Real Href</Dropdown.Toggle>
    <Dropdown.Menu data-testid="real-href-menu">
        <Dropdown.Item href="https://example.com" data-testid="real-href-item">External</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Menu items with text only -->
<Dropdown.Root data-testid="text-items-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="text-items-toggle">Text Items</Dropdown.Toggle>
    <Dropdown.Menu data-testid="text-items-menu">
        <Dropdown.ItemText data-testid="text-item-1">Dropdown item text</Dropdown.ItemText>
        <Dropdown.ItemText data-testid="text-item-2">Another dropdown item text</Dropdown.ItemText>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Menu items with active state -->
<Dropdown.Root data-testid="active-items-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="active-items-toggle">Active Items</Dropdown.Toggle>
    <Dropdown.Menu data-testid="active-items-menu">
        <Dropdown.Item isActive={true} data-testid="active-item">Active item</Dropdown.Item>
        <Dropdown.Item data-testid="regular-item">Regular item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Menu items with disabled state -->
<Dropdown.Root data-testid="disabled-items-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="disabled-items-toggle">Disabled Items</Dropdown.Toggle>
    <Dropdown.Menu data-testid="disabled-items-menu">
        <Dropdown.Item href="#!" isDisabled={true} data-testid="disabled-item">Disabled item</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="enabled-item">Enabled item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Menu with right alignment -->
<Dropdown.Root isButtonGroup={true} direction="dropdown-end" data-testid="right-aligned-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="right-aligned-toggle">Right-aligned</Dropdown.Toggle>
    <Dropdown.Menu isEnd={true} data-testid="right-aligned-menu">
        <Dropdown.Item href="#!" data-testid="right-aligned-item-1">Action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="right-aligned-item-2">Another action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Menu with header -->
<Dropdown.Root data-testid="header-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="header-toggle">With Header</Dropdown.Toggle>
    <Dropdown.Menu data-testid="header-menu">
        <Dropdown.Header data-testid="header-element">Header</Dropdown.Header>
        <Dropdown.Item href="#!" data-testid="header-item-1">Action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="header-item-2">Another action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Menu with divider -->
<Dropdown.Root data-testid="divider-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="divider-toggle">With Divider</Dropdown.Toggle>
    <Dropdown.Menu data-testid="divider-menu">
        <Dropdown.Item href="#!" data-testid="divider-item-1">Action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="divider-item-2">Another action</Dropdown.Item>
        <Dropdown.Divider data-testid="divider-element" />
        <Dropdown.Item href="#!" data-testid="divider-item-3">Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Menu with offset -->
<Dropdown.Root data-testid="offset-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="offset-toggle">With Offset</Dropdown.Toggle>
    <Dropdown.Menu offset={[10, 20]} data-testid="offset-menu">
        <Dropdown.Item href="#!" data-testid="offset-item-1">Action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="offset-item-2">Another action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Auto close behavior -->
<Dropdown.Root isButtonGroup={true} autoClose={true} data-testid="autoclose-true-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="autoclose-true-toggle">Auto Close True</Dropdown.Toggle>
    <Dropdown.Menu data-testid="autoclose-true-menu">
        <Dropdown.Item href="#!" data-testid="autoclose-true-item">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root isButtonGroup={true} autoClose="inside" data-testid="autoclose-inside-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="autoclose-inside-toggle">Auto Close Inside</Dropdown.Toggle>
    <Dropdown.Menu data-testid="autoclose-inside-menu">
        <Dropdown.Item href="#!" data-testid="autoclose-inside-item">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root isButtonGroup={true} autoClose="outside" data-testid="autoclose-outside-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="autoclose-outside-toggle">Auto Close Outside</Dropdown.Toggle>
    <Dropdown.Menu data-testid="autoclose-outside-menu">
        <Dropdown.Item href="#!" data-testid="autoclose-outside-item">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root isButtonGroup={true} autoClose={false} data-testid="autoclose-false-dropdown">
    <Dropdown.Toggle colorVariant="secondary" data-testid="autoclose-false-toggle">Auto Close False</Dropdown.Toggle>
    <Dropdown.Menu data-testid="autoclose-false-menu">
        <Dropdown.Item href="#!" data-testid="autoclose-false-item">Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Dropdown as link -->
<Dropdown.Root data-testid="link-dropdown">
    <Dropdown.Toggle colorVariant="secondary" href="#!" data-testid="link-toggle">Link Toggle</Dropdown.Toggle>
    <Dropdown.Menu data-testid="link-menu">
        <Dropdown.Item href="#!" data-testid="link-item-1">Action</Dropdown.Item>
        <Dropdown.Item href="#!" data-testid="link-item-2">Another action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<!-- Dropdown inside a navbar -->
<Navbar.Nav class="me-auto mb-2 mb-lg-0" data-testid="navbar-nav">
    <Dropdown.Root data-testid="navbar-dropdown">
        <Dropdown.Toggle colorVariant="secondary" data-testid="navbar-toggle">Navbar Dropdown</Dropdown.Toggle>
        <Dropdown.Menu data-testid="navbar-menu">
            <Dropdown.Item href="#!" data-testid="navbar-item-1">Action</Dropdown.Item>
            <Dropdown.Item href="#!" data-testid="navbar-item-2">Another action</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown.Root>
</Navbar.Nav>

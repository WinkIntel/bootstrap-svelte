<script lang="ts">
    import { Button, Container, Dropdown, Navbar } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import DropdownPlayground from './DropdownPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Dropdown button</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`;

    const dropdownWithLinksCode = `<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary" href="#dropdown-demo-link">Dropdown button</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`;

    const colorVariantCode = `<Dropdown.Root isButtonGroup={true}>
    <Dropdown.Toggle colorVariant="primary">Primary</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`;

    const splitButtonCode = `<Dropdown.Root isButtonGroup={true}>
    <Button colorVariant="primary">Primary</Button>
    <Dropdown.Toggle colorVariant="primary" isSplit={true}></Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`;

    const sizingCode = `<Dropdown.Root isButtonGroup={true}>
    <Dropdown.Toggle colorVariant="primary" size="sm">Small</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`;

    const darkDropdownCode = `<Dropdown.Root isButtonGroup={true}>
    <Dropdown.Toggle colorVariant="dark">Dark Dropdown</Dropdown.Toggle>
    <Dropdown.Menu isDark={true}>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`;

    const navbarExampleCode = `<Navbar.Root colorVariant="dark" expandOnBreakpoint="lg" class="bg-dark">
    <Container isFluid={true}>
        <Navbar.Brand href="#dropdown-demo-link">Navbar</Navbar.Brand>
        <Navbar.Toggler ariaLabel="Toggle navigation">
            <Navbar.TogglerIcon />
        </Navbar.Toggler>
        <Navbar.Collapse id="navbarNavDarkDropdown">
            <Navbar.Nav class="me-auto mb-2 mb-lg-0">
                <Dropdown.Root direction="dropdown">
                    <Dropdown.Toggle colorVariant="dark">Dropdown</Dropdown.Toggle>
                    <Dropdown.Menu isDark={true}>
                        <Dropdown.Item>Action</Dropdown.Item>
                        <Dropdown.Item>Another action</Dropdown.Item>
                        <Dropdown.Item>Something else here</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Root>
            </Navbar.Nav>
        </Navbar.Collapse>
    </Container>
</Navbar.Root>`;

    const directionsCode = `<Dropdown.Root direction="dropdown" isButtonGroup={true}>
    <Dropdown.Toggle colorVariant="primary">Dropdown</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root direction="dropup" isButtonGroup={true}>
    <Dropdown.Toggle colorVariant="secondary">Dropup</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root direction="dropend" isButtonGroup={true}>
    <Dropdown.Toggle colorVariant="success">Dropend</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root direction="dropstart" isButtonGroup={true}>
    <Dropdown.Toggle colorVariant="info">Dropstart</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`;

    const keyboardNavigationCode = `<Dropdown.Root>
    <Dropdown.Toggle colorVariant="primary">Navigate with Arrow Keys</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>First Item</Dropdown.Item>
        <Dropdown.Item>Second Item</Dropdown.Item>
        <Dropdown.Item>Third Item</Dropdown.Item>
        <Dropdown.Item isDisabled={true}>Disabled Item</Dropdown.Item>
        <Dropdown.Item>Fifth Item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>

<Dropdown.Root>
    <Dropdown.Toggle colorVariant="success">Button Items Navigation</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Button Item 1</Dropdown.Item>
        <Dropdown.Item>Button Item 2</Dropdown.Item>
        <Dropdown.Item>Button Item 3</Dropdown.Item>
        <Dropdown.Item isActive={true}>Active Button Item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`;
</script>

<div>
    <div class="mb-5">
        <h1>Dropdown</h1>
        <span id="dropdown-demo-link" class="visually-hidden">Dropdown demo link target</span>
        <p class="lead">
            Bootstrap's dropdown component built with Svelte 5. Use it to toggle contextual overlays for displaying lists, links, and more.
        </p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Dropdown component by adjusting the props below:</p>
        <DropdownPlayground />
    </section>

    <!-- Dropdown Single button Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Dropdown Single Button</h2>
        <p>
            Any single <code>Dropdown.Toggle</code> component within a <code>Dropdown.Root</code> will automatically be rendered as a dropdown toggle button.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Dropdown button</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>
    <!-- Dropdown with links Example section -->
    <section class="mb-5" id="dropdown-links">
        <h2 class="wk-quick-link">Dropdown with Links</h2>
        <p>
            You can use the <code>href</code> attribute on a <code>Dropdown.Toggle</code> to make the toggle component a link.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary" href="#dropdown-demo-link">Dropdown button</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter code={dropdownWithLinksCode} />
            </div>
        </div>
    </section>
    <!-- Dropdown color variants section -->
    <section class="mb-5" id="color-variants">
        <h2 class="wk-quick-link">Dropdown Color Variants</h2>
        <p>
            Use the <code>colorVariant</code> prop to change the appearance of dropdowns. You can use any of the Bootstrap theme colors.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="primary">Primary</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="secondary">Secondary</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="success">Success</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="info">Info</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="warning">Warning</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="danger">Danger</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter code={colorVariantCode} />
            </div>
        </div>
    </section>

    <!-- Dropdown with split button section -->
    <section class="mb-5" id="split-button">
        <h2 class="wk-quick-link">Split Button Dropdowns</h2>
        <p>
            Create split button dropdowns by using a regular <code>Button</code> component next to a <code>Dropdown.Toggle</code> with the
            <code>isSplit</code>
            prop. Make sure to set <code>isButtonGroup</code> to <code>true</code> on the <code>Dropdown.Root</code>.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Dropdown.Root isButtonGroup={true}>
                        <Button colorVariant="primary">Primary</Button>
                        <Dropdown.Toggle colorVariant="primary" isSplit={true}></Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true}>
                        <Button colorVariant="secondary">Secondary</Button>
                        <Dropdown.Toggle colorVariant="secondary" isSplit={true}></Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true}>
                        <Button colorVariant="success">Success</Button>
                        <Dropdown.Toggle colorVariant="success" isSplit={true}></Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter code={splitButtonCode} />
            </div>
        </div>
    </section>

    <!-- Sizing section -->
    <section class="mb-5" id="sizing">
        <h2 class="wk-quick-link">Dropdown Sizing</h2>
        <p>
            Button dropdowns work with buttons of all sizes, including default and split dropdown buttons. Use the <code>size</code> prop on the
            <code>Dropdown.Toggle</code> component to change its size.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2 align-items-center">
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="primary" size="sm">Small</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="secondary">Default</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="success" size="lg">Large</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter code={sizingCode} />
            </div>
        </div>
    </section>

    <!-- Dark dropdowns section -->
    <section class="mb-5" id="dark-dropdowns">
        <h2 class="wk-quick-link">Dark Dropdowns</h2>
        <p>
            Opt into darker dropdowns to match a dark navbar or custom style by adding <code>isDark={true}</code> to the <code>Dropdown.Menu</code> component.
            No changes are required to the dropdown items.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="dark">Dark Dropdown</Dropdown.Toggle>
                        <Dropdown.Menu isDark={true}>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter code={darkDropdownCode} />
            </div>
        </div>
    </section>

    <!-- Navbar Example section -->
    <section class="mb-5" id="navbar-example">
        <h2 class="wk-quick-link">Navbar Dropdown Example</h2>
        <p>Dropdowns are commonly used within navigation components. Here's an example of how to implement a dropdown in a navbar.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Navbar.Root colorVariant="dark" expandOnBreakpoint="lg" class="bg-dark">
                        <Container isFluid={true}>
                            <Navbar.Brand href="#dropdown-demo-link">Navbar</Navbar.Brand>
                            <Navbar.Toggler ariaLabel="Toggle navigation">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                            <Navbar.Collapse id="navbarNavDarkDropdown">
                                <Navbar.Nav class="me-auto mb-2 mb-lg-0">
                                    <Dropdown.Root direction="dropdown">
                                        <Dropdown.Toggle colorVariant="dark">Dropdown</Dropdown.Toggle>
                                        <Dropdown.Menu isDark={true}>
                                            <Dropdown.Item>Action</Dropdown.Item>
                                            <Dropdown.Item>Another action</Dropdown.Item>
                                            <Dropdown.Item>Something else here</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown.Root>
                                </Navbar.Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar.Root>
                </div>
                <SyntaxHighlighter code={navbarExampleCode} />
            </div>
        </div>
    </section>

    <!-- Directions section -->
    <section class="mb-5" id="directions">
        <h2 class="wk-quick-link">Dropdown Directions</h2>
        <p>
            Control the direction of the dropdown menu with the <code>direction</code> prop. Options include <code>dropdown</code> (default),
            <code>dropdown-center</code>, <code>dropdown-end</code>, <code>dropup</code>,
            <code>dropup-center</code>, <code>dropup-end</code>, <code>dropend</code>, and <code>dropstart</code>.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Dropdown.Root direction="dropdown" isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="primary">Dropdown</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root direction="dropup" isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="secondary">Dropup</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root direction="dropend" isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="success">Dropend</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root direction="dropstart" isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="info">Dropstart</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter code={directionsCode} />
            </div>
        </div>
    </section>

    <!-- Keyboard Navigation section -->
    <section class="mb-5" id="keyboard-navigation">
        <h2 class="wk-quick-link">Using Arrow Keys</h2>
        <p>The Dropdown component provides full keyboard navigation support using arrow keys for accessibility and improved user experience.</p>

        <h3 class="h5 mt-4">How Arrow Key Navigation Works</h3>
        <ul>
            <li>
                <strong>Opening the Dropdown:</strong> When the toggle button has focus, pressing <kbd>↓</kbd> (ArrowDown) or <kbd>↑</kbd> (ArrowUp) will
                open the dropdown menu and focus the appropriate item.
            </li>
            <li>
                <strong>Navigating Items:</strong> Once the dropdown is open, use <kbd>↓</kbd> (ArrowDown) to move to the next item and <kbd>↑</kbd> (ArrowUp)
                to move to the previous item.
            </li>
            <li>
                <strong>Cyclical Navigation:</strong> When you reach the last item and press <kbd>↓</kbd>, focus wraps to the first item. Similarly,
                when at the first item and pressing <kbd>↑</kbd>, focus wraps to the last item.
            </li>
            <li><strong>Disabled Items:</strong> Navigation includes disabled items (they receive focus but cannot be activated).</li>
        </ul>

        <div class="alert alert-info">
            <h6 class="alert-heading">Try it yourself:</h6>
            <p class="mb-0">
                Click on one of the dropdown toggles below, then use your keyboard arrow keys (<kbd>↓</kbd> and <kbd>↑</kbd>) to navigate through the
                menu items. You can also tab to the toggle button and press arrow keys to open the dropdown and start navigating.
            </p>
        </div>

        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="primary">Navigate with Arrow Keys</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>First Item</Dropdown.Item>
                            <Dropdown.Item>Second Item</Dropdown.Item>
                            <Dropdown.Item>Third Item</Dropdown.Item>
                            <Dropdown.Item isDisabled={true}>Disabled Item</Dropdown.Item>
                            <Dropdown.Item>Fifth Item</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>

                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="success">Button Items Navigation</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Button Item 1</Dropdown.Item>
                            <Dropdown.Item>Button Item 2</Dropdown.Item>
                            <Dropdown.Item>Button Item 3</Dropdown.Item>
                            <Dropdown.Item isActive={true}>Active Button Item</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter code={keyboardNavigationCode} />
            </div>
        </div>

        <h3 class="h5 mt-4">Keyboard Navigation Features</h3>
        <div class="row">
            <div class="col-md-6">
                <h6>Toggle Button Behavior</h6>
                <ul>
                    <li><kbd>↓</kbd> - Opens dropdown and focuses first item</li>
                    <li><kbd>↑</kbd> - Opens dropdown and focuses last item</li>
                    <li><kbd>Enter</kbd> or <kbd>Space</kbd> - Toggles dropdown</li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Menu Item Behavior</h6>
                <ul>
                    <li><kbd>↓</kbd> - Moves focus to next item (wraps to first)</li>
                    <li><kbd>↑</kbd> - Moves focus to previous item (wraps to last)</li>
                    <li><kbd>Enter</kbd> or <kbd>Space</kbd> - Activates focused item</li>
                    <li><kbd>Esc</kbd> - Closes dropdown and returns focus to toggle</li>
                </ul>
            </div>
        </div>

        <div class="alert alert-success mt-3">
            <h6 class="alert-heading">Accessibility Benefits</h6>
            <p class="mb-0">
                This keyboard navigation implementation follows ARIA patterns for dropdowns and menus, making the component fully accessible to users
                who rely on keyboard navigation or assistive technologies like screen readers.
            </p>
        </div>
    </section>

    <!-- Menu items section -->
    <section class="mb-5" id="menu-content">
        <h2 class="wk-quick-link">Menu Content</h2>

        <h3 class="h5 mt-4">Menu Items</h3>
        <p>
            Dropdown menu items can be buttons or links. Use the <code>Dropdown.Item</code> component without an <code>href</code> prop to create a button
            item.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Dropdown with Buttons</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Dropdown with Buttons</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>

        <h3 class="h5 mt-4">Menu Items as Links</h3>
        <p>
            Add the <code>href</code> attribute to a <code>Dropdown.Item</code> to create a link item.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Dropdown with Links</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Dropdown with Links</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>

        <h3 class="h5 mt-4">Text Content</h3>
        <p>
            Use <code>Dropdown.ItemText</code> to add non-interactive text inside a dropdown menu.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Dropdown with Text</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.ItemText>Dropdown item text</Dropdown.ItemText>
                            <Dropdown.ItemText>Another dropdown item text</Dropdown.ItemText>
                            <Dropdown.Item>Action</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Dropdown with Text</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.ItemText>Dropdown item text</Dropdown.ItemText>
        <Dropdown.ItemText>Another dropdown item text</Dropdown.ItemText>
        <Dropdown.Item>Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>

        <h3 class="h5 mt-4">Active State</h3>
        <p>
            Add <code>isActive={true}</code> to a <code>Dropdown.Item</code> to make it appear active.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Active Item</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item isActive={true}>Active item</Dropdown.Item>
                            <Dropdown.Item>Another item</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Active Item</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item isActive={true}>Active item</Dropdown.Item>
        <Dropdown.Item>Another item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>

        <h3 class="h5 mt-4">Disabled State</h3>
        <p>
            Add <code>isDisabled={true}</code> to a <code>Dropdown.Item</code> to make it appear disabled.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Disabled Item</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item isDisabled={true}>Disabled item</Dropdown.Item>
                            <Dropdown.Item>Another item</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Disabled Item</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item isDisabled={true}>Disabled item</Dropdown.Item>
        <Dropdown.Item>Another item</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>
    </section>

    <!-- Menu structure section -->
    <section class="mb-5" id="menu-structure">
        <h2 class="wk-quick-link">Menu Structure</h2>

        <h3 class="h5 mt-4">Menu Headers</h3>
        <p>
            Add a header to label sections of actions in a dropdown menu using the <code>Dropdown.Header</code> component.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Dropdown with Header</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Header>Header</Dropdown.Header>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Dropdown with Header</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Header>Header</Dropdown.Header>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>

        <h3 class="h5 mt-4">Menu Dividers</h3>
        <p>
            Separate groups of related menu items with a divider using the <code>Dropdown.Divider</code> component.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Dropdown with Divider</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Dropdown with Divider</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>

        <h3 class="h5 mt-4">Menu Alignment</h3>
        <p>
            By default, a dropdown menu is automatically positioned 100% from the top and along the left side of its parent. Add <code
                >isEnd={true}</code>
            to a <code>Dropdown.Menu</code> to right-align the dropdown menu.
        </p>
        <p>
            If the menu is aligned to the end (using <code>isEnd={true}</code>), but the Root's <code>direction</code> property is not compatible, the
            Menu component will update the Root's <code>direction</code> property to ensure consistent behavior and styling.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root isButtonGroup={true}>
                        <Dropdown.Toggle colorVariant="secondary">Right-aligned Menu using the isEnd property</Dropdown.Toggle>
                        <Dropdown.Menu isEnd={true}>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root isButtonGroup={true}>
    <Dropdown.Toggle colorVariant="secondary">Right-aligned Menu</Dropdown.Toggle>
    <Dropdown.Menu isEnd={true}>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>
    </section>

    <!-- Custom content section -->
    <section class="mb-5" id="custom-content">
        <h2 class="wk-quick-link">Custom Content</h2>

        <h3 class="h5 mt-4">Custom Text</h3>
        <p>
            You can place any content within a dropdown menu, such as text or forms. Just add the content as a child of the <code>Dropdown.Menu</code>
            component.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Dropdown with Text</Dropdown.Toggle>
                        <Dropdown.Menu class="p-4 text-body-secondary" style="max-width: 200px;">
                            <p>Some example text that's free-flowing within the dropdown menu.</p>
                            <p class="mb-0">And this is more example text.</p>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Dropdown with Text</Dropdown.Toggle>
    <Dropdown.Menu class="p-4 text-body-secondary" style="max-width: 200px;">
        <p>Some example text that's free-flowing within the dropdown menu.</p>
        <p class="mb-0">And this is more example text.</p>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>

        <h3 class="h5 mt-4">Forms</h3>
        <p>Put a form within a dropdown menu to provide an inline form that appears in the dropdown when clicked.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Dropdown with Form</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <form class="px-4 py-3">
                                <div class="mb-3">
                                    <label for="exampleDropdownFormEmail1" class="form-label">Email address</label>
                                    <input
                                        type="email"
                                        class="form-control"
                                        id="exampleDropdownFormEmail1"
                                        placeholder=""
                                        aria-label="Email"
                                        autocomplete="email" />
                                </div>
                                <div class="mb-3">
                                    <label for="exampleDropdownFormPassword1" class="form-label">Password</label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        id="exampleDropdownFormPassword1"
                                        placeholder=""
                                        aria-label="Password"
                                        autocomplete="new-password" />
                                </div>
                                <div class="mb-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="dropdownCheck" />
                                        <label class="form-check-label" for="dropdownCheck"> Remember me </label>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Sign in</button>
                            </form>
                            <Dropdown.Divider />
                            <Dropdown.Item>New around here? Sign-up</Dropdown.Item>
                            <Dropdown.Item>Forgot password?</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Dropdown with Form</Dropdown.Toggle>
    <Dropdown.Menu>
        <form class="px-4 py-3">
            <div class="mb-3">
                <label for="exampleDropdownFormEmail1" class="form-label">Email address</label>
                <input type="email" class="form-control" id="exampleDropdownFormEmail1" placeholder="" aria-label="Email" />
            </div>
            <div class="mb-3">
                <label for="exampleDropdownFormPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleDropdownFormPassword1" placeholder="" aria-label="Password" />
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="dropdownCheck" />
                    <label class="form-check-label" for="dropdownCheck"> Remember me </label>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Sign in</button>
        </form>
        <Dropdown.Divider />
        <Dropdown.Item>New around here? Sign-up</Dropdown.Item>
        <Dropdown.Item>Forgot password?</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>
    </section>

    <!-- Advanced options section -->
    <section class="mb-5" id="advanced-options">
        <h2 class="wk-quick-link">Advanced Options</h2>

        <h3 class="h5 mt-4">Menu Offset</h3>
        <p>
            Use the <code>offset</code> prop on the <code>Dropdown.Menu</code> component to change the position of the dropdown menu. The offset is
            specified as an array of two numbers: <code>[skidding, distance]</code>.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Dropdown.Root>
                        <Dropdown.Toggle colorVariant="secondary">Dropdown with Offset</Dropdown.Toggle>
                        <Dropdown.Menu offset={[10, 20]}>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Dropdown.Root>
    <Dropdown.Toggle colorVariant="secondary">Dropdown with Offset</Dropdown.Toggle>
    <Dropdown.Menu offset={[10, 20]}>
        <Dropdown.Item>Action</Dropdown.Item>
        <Dropdown.Item>Another action</Dropdown.Item>
        <Dropdown.Item>Something else here</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>

        <h3 class="h5 mt-4">Auto Close Behavior</h3>
        <p>
            By default, the dropdown menu closes when clicking inside or outside the dropdown menu. You can control this behavior with the <code
                >autoClose</code>
            prop on the <code>Dropdown.Root</code> component.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Dropdown.Root isButtonGroup={true} autoClose={true}>
                        <Dropdown.Toggle colorVariant="secondary">Default (true)</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true} autoClose="inside">
                        <Dropdown.Toggle colorVariant="secondary">Inside Only</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true} autoClose="outside">
                        <Dropdown.Toggle colorVariant="secondary">Outside Only</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                    <Dropdown.Root isButtonGroup={true} autoClose={false}>
                        <Dropdown.Toggle colorVariant="secondary">Manual (false)</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Root>
                </div>
                <SyntaxHighlighter
                    code={`// Default behavior (closes on both inside and outside clicks)
<Dropdown.Root isButtonGroup={true} autoClose={true}>
    <Dropdown.Toggle colorVariant="secondary">Default (true)</Dropdown.Toggle>
    <Dropdown.Menu>...</Dropdown.Menu>
</Dropdown.Root>

// Only closes when clicking inside the dropdown menu
<Dropdown.Root isButtonGroup={true} autoClose="inside">
    <Dropdown.Toggle colorVariant="secondary">Inside Only</Dropdown.Toggle>
    <Dropdown.Menu>...</Dropdown.Menu>
</Dropdown.Root>

// Only closes when clicking outside the dropdown menu
<Dropdown.Root isButtonGroup={true} autoClose="outside">
    <Dropdown.Toggle colorVariant="secondary">Outside Only</Dropdown.Toggle>
    <Dropdown.Menu>...</Dropdown.Menu>
</Dropdown.Root>

// Manual closing (doesn't close on click)
<Dropdown.Root isButtonGroup={true} autoClose={false}>
    <Dropdown.Toggle colorVariant="secondary">Manual (false)</Dropdown.Toggle>
    <Dropdown.Menu>...</Dropdown.Menu>
</Dropdown.Root>`} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Dropdown.Root Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>autoClose</code></td>
                        <td><code>boolean | 'inside' | 'outside'</code></td>
                        <td><code>true</code></td>
                        <td>Configure the auto close behavior of the dropdown.</td>
                    </tr>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>direction</code></td>
                        <td><code>string</code></td>
                        <td><code>'dropdown'</code></td>
                        <td
                            >Controls the direction where the dropdown menu expands. Values: 'dropdown', 'dropdown-center', 'dropdown-end', 'dropup',
                            'dropup-center', 'dropup-end', 'dropend', 'dropstart'</td>
                    </tr>
                    <tr>
                        <td><code>display</code></td>
                        <td><code>string</code></td>
                        <td><code>'dynamic'</code></td>
                        <td>Controls the display behavior of the dropdown. Values: 'dynamic', 'static'</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the element</td>
                    </tr>
                    <tr>
                        <td><code>isButtonGroup</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether the dropdown should be rendered as a button group.</td>
                    </tr>
                    <tr>
                        <td><code>onHide</code></td>
                        <td><code>EventListener</code></td>
                        <td>-</td>
                        <td>Callback function to execute when the modal begins to hide.</td>
                    </tr>
                    <tr>
                        <td><code>onHidden</code></td>
                        <td><code>EventListener</code></td>
                        <td>-</td>
                        <td>Callback function to execute when the dropdown has been hidden.</td>
                    </tr>
                    <tr>
                        <td><code>onShow</code></td>
                        <td><code>EventListener</code></td>
                        <td>-</td>
                        <td>Callback function to execute when the dropdown begins to show.</td>
                    </tr>
                    <tr>
                        <td><code>onShown</code></td>
                        <td><code>EventListener</code></td>
                        <td>-</td>
                        <td>Callback function to execute when the dropdown has been shown.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Dropdown.Toggle Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>colorVariant</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td
                            >Sets the button's color. Values: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'</td>
                    </tr>
                    <tr>
                        <td><code>disabled</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Makes the button appear inactive and prevents interactions</td>
                    </tr>
                    <tr>
                        <td><code>href</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>When provided, renders the toggle as an anchor (<code>&lt;a&gt;</code>) with the given href.</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the element</td>
                    </tr>
                    <tr>
                        <td><code>isSplit</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether the toggle is part of a split button dropdown.</td>
                    </tr>
                    <tr>
                        <td><code>size</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Sets the size of the toggle button. Values: 'sm', 'lg'</td>
                    </tr>
                    <tr>
                        <td><code>type</code></td>
                        <td><code>string</code></td>
                        <td><code>'button'</code></td>
                        <td>Button type attribute ('button', 'submit', 'reset')</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Dropdown.Menu Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>container</code></td>
                        <td><code>string | HTMLElement | false</code></td>
                        <td>false</td>
                        <td
                            >Specifies the container element to append the dropdown menu to. Can be a CSS selector, an HTMLElement, or false for the
                            default behavior.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the element</td>
                    </tr>
                    <tr>
                        <td><code>isDark</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether to use dark styles for the dropdown menu.</td>
                    </tr>
                    <tr>
                        <td><code>isEnd</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether to align the dropdown menu to the right.</td>
                    </tr>
                    <tr>
                        <td><code>offset</code></td>
                        <td><code>[number, number]</code></td>
                        <td>—</td>
                        <td>The offset of the dropdown menu. Format: [skidding, distance]</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Dropdown.Item Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>href</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>When provided, renders the item as an anchor (<code>&lt;a&gt;</code>) with the given href.</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the element</td>
                    </tr>
                    <tr>
                        <td><code>isActive</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether the item should appear as active.</td>
                    </tr>
                    <tr>
                        <td><code>isDisabled</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether the item should appear as disabled.</td>
                    </tr>
                    <tr>
                        <td><code>listItemProps</code></td>
                        <td><code>ListItemElement</code></td>
                        <td>-</td>
                        <td>Props to pass to the parent list item element.</td>
                    </tr>
                    <tr>
                        <td><code>onclick</code></td>
                        <td><code>function</code></td>
                        <td>—</td>
                        <td>Function to execute when the item is clicked.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Dropdown.ItemText Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>listItemProps</code></td>
                        <td><code>ListItemElement</code></td>
                        <td>—</td>
                        <td>Props to pass to the parent list item element.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Dropdown.Header Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>level</code></td>
                        <td><code>HeadingLevels</code></td>
                        <td><code>'h6'</code></td>
                        <td>The heading level to use for the header. Values: 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'</td>
                    </tr>
                    <tr>
                        <td><code>listItemProps</code></td>
                        <td><code>ListItemElement</code></td>
                        <td>—</td>
                        <td>Props to pass to the parent list item element.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Dropdown.Divider Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>listItemProps</code></td>
                        <td><code>ListItemElement</code></td>
                        <td>—</td>
                        <td>Props to pass to the parent list item element.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <!-- CSS Classes -->
    <section class="mb-5" id="css-classes">
        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's dropdown classes based on the provided props:</p>
        <ul>
            <li><code>dropdown</code> - Base class for the container</li>
            <li><code>btn-group</code> - Applied when using split button dropdowns</li>
            <li><code>dropup</code> - Applied when direction="up"</li>
            <li><code>dropend</code> - Applied when direction="end"</li>
            <li><code>dropstart</code> - Applied when direction="start"</li>
            <li><code>dropdown-center</code> - Applied when isCentered=true and direction="down"</li>
            <li><code>dropup-center</code> - Applied when isCentered=true and direction="up"</li>
            <li><code>dropdown-toggle</code> - Applied to toggle buttons</li>
            <li><code>dropdown-toggle-split</code> - Applied to toggle buttons in split button dropdowns</li>
            <li><code>dropdown-menu</code> - Base class for dropdown menus</li>
            <li><code>dropdown-menu-dark</code> - Applied when isDark=true on the menu</li>
            <li><code>dropdown-menu-end</code> - Applied when isEnd=true on the menu</li>
            <li><code>dropdown-item</code> - Applied to dropdown items</li>
            <li><code>dropdown-item-text</code> - Applied to non-interactive text items</li>
            <li><code>dropdown-header</code> - Applied to header elements</li>
            <li><code>dropdown-divider</code> - Applied to divider elements</li>
            <li><code>active</code> - Applied to active dropdown items</li>
            <li><code>disabled</code> - Applied to disabled dropdown items</li>
        </ul>

        <h3 class="h5 mt-4">Button Size Classes</h3>
        <p>When size is specified on the Dropdown.Toggle:</p>
        <ul>
            <li><code>btn-sm</code> - Applied when size="sm"</li>
            <li><code>btn-lg</code> - Applied when size="lg"</li>
        </ul>
    </section>
</div>

<style>
    section {
        margin-bottom: 3rem;
    }
</style>

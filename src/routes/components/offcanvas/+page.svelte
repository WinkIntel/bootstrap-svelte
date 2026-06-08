<script lang="ts">
    import { Button, Offcanvas } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import OffcanvasPlayground from './OffcanvasPlayground.svelte';

    // Toggle states for examples
    let showBasic = $state(false);
    let showStaticBackdrop = $state(false);
    let showTrueBackdrop = $state(false);
    let showFalseBackdrop = $state(false);
    let showScrollable = $state(false);
    let showPlacementStart = $state(false);
    let showPlacementEnd = $state(false);
    let showPlacementTop = $state(false);
    let showPlacementBottom = $state(false);
    let showResponsive = $state(false);

    // Sample code examples for demonstration
    const basicExampleCode = `<Button onclick={toggleOffcanvas}>
  Launch Basic Offcanvas
</Button>

<Offcanvas.Root isShown={showOffcanvas} onHidden={() => showOffcanvas = false}>
    <Offcanvas.Header>
        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
        <p>Some text as placeholder. Content can be virtually anything.</p>
        <Button colorVariant="secondary" onclick={() => showOffcanvas = false}>Close</Button>
    </Offcanvas.Body>
</Offcanvas.Root>`;

    const placementExampleCode = `<Button onclick={() => showPlacementStart = true}>
    Offcanvas Start
</Button>
<Offcanvas.Root placement="start" isShown={showPlacementStart} onHidden={() => showPlacementStart = false}>
    <Offcanvas.Header>
        <Offcanvas.Title>Offcanvas Start</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>Positioned from the left of the screen (or right in RTL languages)</Offcanvas.Body>
</Offcanvas.Root>

<Button onclick={() => showPlacementEnd = true}>
    Offcanvas End
</Button>
<Offcanvas.Root placement="end" isShown={showPlacementEnd} onHidden={() => showPlacementEnd = false}>
    <Offcanvas.Header>
        <Offcanvas.Title>Offcanvas End</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>Positioned from the right of the screen (or left in RTL languages)</Offcanvas.Body>
</Offcanvas.Root>

<Button onclick={() => showPlacementTop = true}>
    Offcanvas Top
</Button>
<Offcanvas.Root placement="top" isShown={showPlacementTop} onHidden={() => showPlacementTop = false}>
    <Offcanvas.Header>
        <Offcanvas.Title>Offcanvas Top</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>Positioned from the top of the screen</Offcanvas.Body>
</Offcanvas.Root>

<Button onclick={() => showPlacementBottom = true}>
    Offcanvas Bottom
</Button>
<Offcanvas.Root placement="bottom" isShown={showPlacementBottom} onHidden={() => showPlacementBottom = false}>
    <Offcanvas.Header>
        <Offcanvas.Title>Offcanvas Bottom</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>Positioned from the bottom of the screen</Offcanvas.Body>
</Offcanvas.Root>`;

    const backdropExampleCode = `<Offcanvas.Root useBackdrop="static" isShown={showStaticBackdrop} onHidden={() => showStaticBackdrop = false}>
    <Offcanvas.Header>
        <Offcanvas.Title>Static Backdrop</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
        <p>Click the close button or press escape to close this offcanvas. Clicking outside won't close it.</p>
        <Button colorVariant="secondary" onclick={() => showStaticBackdrop = false}>Close</Button>
    </Offcanvas.Body>
</Offcanvas.Root>

<Offcanvas.Root useBackdrop={true} isShown={showTrueBackdrop} onHidden={() => showTrueBackdrop = false}>
    <Offcanvas.Header>
        <Offcanvas.Title>True Backdrop</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
        <p>This offcanvas has a backdrop that you can click outside to close it.</p>
    </Offcanvas.Body>
</Offcanvas.Root>

<Offcanvas.Root useBackdrop={false} isShown={showFalseBackdrop} onHidden={() => showFalseBackdrop = false}>
    <Offcanvas.Header>
        <Offcanvas.Title>False Backdrop</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
        <p>There is no backdrop for this offcanvas. You can still interact with the page content.</p>
        <Button colorVariant="secondary" onclick={() => showFalseBackdrop = false}>Close</Button>
    </Offcanvas.Body>
</Offcanvas.Root>`;

    const scrollableExampleCode = `<Offcanvas.Root isBodyScrollable={true} isShown={showScrollable} onHidden={() => showScrollable = false}>
    <Offcanvas.Header>
        <Offcanvas.Title>Scrollable Offcanvas</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
        <p>The page body remains scrollable when this offcanvas is open.</p>
        <p>Try scrolling the page while this offcanvas is open.</p>
        <Button colorVariant="secondary" onclick={() => showScrollable = false}>Close</Button>
    </Offcanvas.Body>
</Offcanvas.Root>`;

    const responsiveExampleCode = `<Button colorVariant="primary" class="d-lg-none" onclick={() => showResponsive = !showResponsive}>
    Toggle Responsive Offcanvas
</Button>

<Offcanvas.Root showOnBreakpoint="lg" placement="start">
    <Offcanvas.Header>
        <Offcanvas.Title>Responsive Offcanvas</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
        <p>This is always visible on lg screens and above, but behaves like a regular offcanvas below lg breakpoint.</p>
        <Button colorVariant="secondary" class="d-lg-none" onclick={() => showResponsive = false}>Close</Button>
    </Offcanvas.Body>
</Offcanvas.Root>`;
</script>

<div class="container-fluid">
    <h1>Offcanvas</h1>
    <p class="lead">Build hidden sidebars into your project for navigation, shopping carts, and more with the offcanvas component.</p>

    <hr class="my-5" />

    <!-- Playground Component -->
    <OffcanvasPlayground />

    <hr class="my-5" />

    <section class="mb-5">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            The Offcanvas component is a sidebar that can be toggled to appear from any edge of the viewport. By default, it appears from the left
            side (start position).
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <Button colorVariant="primary" onclick={() => (showBasic = true)}>Launch Basic Offcanvas</Button>

                <Offcanvas.Root isShown={showBasic} onHidden={() => (showBasic = false)}>
                    <Offcanvas.Header>
                        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <p>Some text as placeholder. Content can be virtually anything.</p>
                        <Button colorVariant="secondary" onclick={() => (showBasic = false)}>Close</Button>
                    </Offcanvas.Body>
                </Offcanvas.Root>
            </div>
        </div>

        <SyntaxHighlighter code={basicExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Placement Options</h2>
        <p>
            Offcanvas supports four different placement options: <code>start</code> (default, left side),
            <code>end</code> (right side), <code>top</code>, and <code>bottom</code>.
        </p>

        <div class="card mb-3">
            <div class="card-body d-flex flex-wrap gap-2">
                <Button colorVariant="primary" class="me-2 mb-2" onclick={() => (showPlacementStart = true)}>Offcanvas Start</Button>
                <Button colorVariant="primary" class="me-2 mb-2" onclick={() => (showPlacementEnd = true)}>Offcanvas End</Button>
                <Button colorVariant="primary" class="me-2 mb-2" onclick={() => (showPlacementTop = true)}>Offcanvas Top</Button>
                <Button colorVariant="primary" class="me-2 mb-2" onclick={() => (showPlacementBottom = true)}>Offcanvas Bottom</Button>

                <Offcanvas.Root placement="start" isShown={showPlacementStart} onHidden={() => (showPlacementStart = false)}>
                    <Offcanvas.Header>
                        <Offcanvas.Title>Offcanvas Start</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>Positioned from the left of the screen (or right in RTL languages)</Offcanvas.Body>
                </Offcanvas.Root>

                <Offcanvas.Root placement="end" isShown={showPlacementEnd} onHidden={() => (showPlacementEnd = false)}>
                    <Offcanvas.Header>
                        <Offcanvas.Title>Offcanvas End</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <p>This offcanvas slides in from the right (or left in RTL languages).</p>
                        <button class="btn btn-secondary" onclick={() => (showPlacementEnd = false)}>Close</button>
                    </Offcanvas.Body>
                </Offcanvas.Root>

                <Offcanvas.Root placement="top" isShown={showPlacementTop} onHidden={() => (showPlacementTop = false)}>
                    <Offcanvas.Header>
                        <Offcanvas.Title>Offcanvas Top</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <p>This offcanvas slides in from the top of the screen.</p>
                        <Button colorVariant="secondary" onclick={() => (showPlacementTop = false)}>Close</Button>
                    </Offcanvas.Body>
                </Offcanvas.Root>

                <Offcanvas.Root placement="bottom" isShown={showPlacementBottom} onHidden={() => (showPlacementBottom = false)}>
                    <Offcanvas.Header>
                        <Offcanvas.Title>Offcanvas Bottom</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <p>This offcanvas slides in from the bottom of the screen.</p>
                        <Button colorVariant="secondary" onclick={() => (showPlacementBottom = false)}>Close</Button>
                    </Offcanvas.Body>
                </Offcanvas.Root>
            </div>
        </div>

        <SyntaxHighlighter code={placementExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Backdrop Options</h2>
        <p>
            You can control the behavior of the backdrop with the <code>useBackdrop</code> prop. It accepts three values:
            <code>true</code> (default, clickable backdrop), <code>"static"</code> (backdrop present but not clickable), or <code>false</code> (no backdrop).
        </p>

        <div class="card mb-3">
            <div class="card-body d-flex flex-wrap gap-2">
                <Button colorVariant="primary" onclick={() => (showStaticBackdrop = true)} class="me-2 mb-2">Static Backdrop</Button>
                <Button colorVariant="primary" onclick={() => (showTrueBackdrop = true)} class="me-2 mb-2">True Backdrop</Button>
                <Button colorVariant="primary" onclick={() => (showFalseBackdrop = true)} class="me-2 mb-2">False Backdrop</Button>

                <Offcanvas.Root useBackdrop="static" isShown={showStaticBackdrop} onHidden={() => (showStaticBackdrop = false)}>
                    <Offcanvas.Header>
                        <Offcanvas.Title>Static Backdrop</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <p>Click the close button or press escape to close this offcanvas. Clicking outside won't close it.</p>
                        <Button colorVariant="secondary" onclick={() => (showStaticBackdrop = false)}>Close</Button>
                    </Offcanvas.Body>
                </Offcanvas.Root>

                <Offcanvas.Root useBackdrop={true} isShown={showTrueBackdrop} onHidden={() => (showTrueBackdrop = false)}>
                    <Offcanvas.Header>
                        <Offcanvas.Title>True Backdrop</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <p>This offcanvas has a backdrop that you can click outside to close it.</p>
                    </Offcanvas.Body>
                </Offcanvas.Root>

                <Offcanvas.Root useBackdrop={false} isShown={showFalseBackdrop} onHidden={() => (showFalseBackdrop = false)}>
                    <Offcanvas.Header>
                        <Offcanvas.Title>False Backdrop</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <p>There is no backdrop for this offcanvas. You can still interact with the page content.</p>
                        <Button colorVariant="secondary" onclick={() => (showFalseBackdrop = false)}>Close</Button>
                    </Offcanvas.Body>
                </Offcanvas.Root>
            </div>
        </div>

        <SyntaxHighlighter code={backdropExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Scrollable Body</h2>
        <p>
            By default, the Offcanvas component prevents scrolling of the main body when it's open. You can allow body scrolling by setting the <code
                >isBodyScrollable</code>
            prop to <code>true</code>.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <Button colorVariant="primary" onclick={() => (showScrollable = true)}>Scrollable Offcanvas</Button>

                <Offcanvas.Root isBodyScrollable={true} isShown={showScrollable} onHidden={() => (showScrollable = false)}>
                    <Offcanvas.Header>
                        <Offcanvas.Title>Scrollable Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <p>The page body remains scrollable when this offcanvas is open.</p>
                        <p>Try scrolling the page while this offcanvas is open.</p>
                        <Button colorVariant="secondary" onclick={() => (showScrollable = false)}>Close</Button>
                    </Offcanvas.Body>
                </Offcanvas.Root>
            </div>
        </div>

        <SyntaxHighlighter code={scrollableExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Responsive Behaviors</h2>
        <p>
            The Offcanvas component can be configured to behave responsively using the <code>showOnBreakpoint</code> prop. When set, the component will
            be visible as a regular element above the specified breakpoint, and will behave as an offcanvas below it.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <p>This example will show as a regular sidebar on screens lg and up, but as an offcanvas on smaller screens.</p>

                <div class="mt-4">
                    <div class="border p-2 rounded">
                        <div class="alert alert-info d-none d-lg-block">Resize your browser to show the responsive offcanvas toggle.</div>
                        <Button colorVariant="primary" class="d-lg-none" onclick={() => (showResponsive = !showResponsive)}
                            >Toggle Responsive Offcanvas</Button>
                        <Offcanvas.Root isShown={showResponsive} showOnBreakpoint="lg" placement="start">
                            <Offcanvas.Header>
                                <Offcanvas.Title>Responsive Offcanvas</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <p>This is always visible on lg screens and above, but behaves like a regular offcanvas below lg breakpoint.</p>
                                <Button colorVariant="secondary" class="d-lg-none" onclick={() => (showResponsive = false)}>Close</Button>
                            </Offcanvas.Body>
                        </Offcanvas.Root>
                    </div>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={responsiveExampleCode} />
    </section>

    <hr class="my-5" />

    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Offcanvas.Root Props</h3>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>dir</code></td>
                        <td><code>'ltr' | 'rtl'</code></td>
                        <td><code>'ltr'</code></td>
                        <td>Text direction, affects the side from which the offcanvas appears</td>
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
                        <td>Unique identifier for the offcanvas</td>
                    </tr>
                    <tr>
                        <td><code>isBodyScrollable</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>When true, allows scrolling the main page body when offcanvas is open</td>
                    </tr>
                    <tr>
                        <td><code>isKeyboardDismissible</code></td>
                        <td><code>boolean</code></td>
                        <td><code>true</code></td>
                        <td>When true, allows closing the offcanvas with the Escape key</td>
                    </tr>
                    <tr>
                        <td><code>isShown</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Controls the visibility of the offcanvas</td>
                    </tr>
                    <tr>
                        <td><code>placement</code></td>
                        <td><code>'start' | 'end' | 'top' | 'bottom'</code></td>
                        <td><code>'start'</code></td>
                        <td>Determines the edge of the screen from which the offcanvas appears</td>
                    </tr>
                    <tr>
                        <td><code>showOnBreakpoint</code></td>
                        <td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'</code></td>
                        <td><code>undefined</code></td>
                        <td>Makes the offcanvas visible as a regular element above the specified breakpoint</td>
                    </tr>
                    <tr>
                        <td><code>useBackdrop</code></td>
                        <td><code>'static' | boolean</code></td>
                        <td><code>true</code></td>
                        <td>Controls backdrop behavior: true (default, clickable), "static" (not clickable), false (no backdrop)</td>
                    </tr>
                    <tr>
                        <td><code>onHide</code></td>
                        <td><code>EventListener</code></td>
                        <td>-</td>
                        <td>Callback when the offcanvas begins hiding</td>
                    </tr>
                    <tr>
                        <td><code>onHidePrevented</code></td>
                        <td><code>EventListener</code></td>
                        <td>-</td>
                        <td
                            >Callback when the offcanvas is shown, its backdrop is static and a click outside of the offcanvas is performed. The event
                            is also fired when the escape key is pressed and the keyboard option is set to false.</td>
                    </tr>
                    <tr>
                        <td><code>onHidden</code></td>
                        <td><code>EventListener</code></td>
                        <td>-</td>
                        <td>Callback when the offcanvas has finished hiding</td>
                    </tr>
                    <tr>
                        <td><code>onShow</code></td>
                        <td><code>EventListener</code></td>
                        <td>-</td>
                        <td>Callback when the offcanvas begins showing</td>
                    </tr>
                    <tr>
                        <td><code>onShown</code></td>
                        <td><code>EventListener</code></td>
                        <td>-</td>
                        <td>Callback when the offcanvas has finished showing</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Offcanvas.Header Props</h3>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>isDismissible</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>When true, displays a close button in the header</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Offcanvas.Title Props</h3>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>level</code></td>
                        <td><code>1 | 2 | 3 | 4 | 5 | 6</code></td>
                        <td><code>5</code></td>
                        <td>Heading level to use for the title (h1-h6)</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Offcanvas.Body Props</h3>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's offcanvas classes based on the provided props:</p>
        <ul>
            <li><code>offcanvas</code> - Base class for the Offcanvas component</li>
            <li><code>offcanvas-[breakpoint]</code> - Applied when showOnBreakpoint is set</li>
            <li><code>offcanvas-[placement]</code> - Position classes (start, end, top, bottom)</li>
            <li><code>show</code> - Applied when the offcanvas is visible</li>
            <li><code>offcanvas-header</code> - Applied to Offcanvas.Header components</li>
            <li><code>offcanvas-title</code> - Applied to Offcanvas.Title components</li>
            <li><code>offcanvas-body</code> - Applied to Offcanvas.Body components</li>
            <li><code>offcanvas-backdrop</code> - Applied to the backdrop when enabled</li>
        </ul>

        <h3 class="h5 mt-4">Responsive Behavior</h3>
        <p>The Offcanvas component can be configured for responsive behavior:</p>
        <ul>
            <li>
                When <code>showOnBreakpoint</code> is set, the component appears as a regular element on screens at or above the specified breakpoint
            </li>
            <li>On screens below the breakpoint, it behaves as a regular offcanvas that must be toggled to appear</li>
            <li>This enables creating responsive sidebar-like layouts that collapse into an offcanvas on smaller screens</li>
        </ul>
    </section>
</div>

<script lang="ts">
    import { Button, Popover } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import PopoverPlayground from './PopoverPlayground.svelte';

    // Toggle states for examples
    let isBasicPopoverShown = $state(false);
    let isHoverPopoverShown = $state(false);
    let isNoFadePopoverShown = $state(false);
    let isDismissiblePopoverShown = $state(false);
    let isHtmlContentShown = $state(false);
    let isDisabledButtonPopoverShown = $state(false);

    // Sample code examples for demonstration
    const basicExampleCode = `<Button id="basic-popover-button" colorVariant="primary">
    Click for Popover
</Button>

<Popover.Root isShown={isPopoverShown} referenceElementId="basic-popover-button">
    <Popover.Header>Popover Title</Popover.Header>
    <Popover.Body>
        <p>This is the popover body content. It can contain various elements.</p>
    </Popover.Body>
</Popover.Root>`;

    const triggerExampleCode = `<!-- Click trigger (default) -->
<Button id="click-popover-button" colorVariant="secondary">
    Click me
</Button>

<Popover.Root referenceElementId="click-popover-button" trigger="click">
    <Popover.Header>Click Triggered</Popover.Header>
    <Popover.Body>
        <p>This popover is activated by clicking on the button.</p>
    </Popover.Body>
</Popover.Root>

<!-- Hover trigger -->
<Button id="hover-popover-button" colorVariant="secondary">
    Hover me
</Button>

<Popover.Root referenceElementId="hover-popover-button" trigger="hover">
    <Popover.Header>Hover Triggered</Popover.Header>
    <Popover.Body>
        <p>This popover is activated by hovering over the button.</p>
    </Popover.Body>
</Popover.Root>

<!-- Focus trigger -->
<Button id="focus-popover-button" colorVariant="secondary">
    Focus me
</Button>

<Popover.Root referenceElementId="focus-popover-button" trigger="focus">
    <Popover.Header>Focus Triggered</Popover.Header>
    <Popover.Body>
        <p>This popover is activated by focusing on the button.</p>
    </Popover.Body>
</Popover.Root>

<!-- Multiple triggers -->
<Button id="multi-trigger-popover-button" colorVariant="secondary">
    Hover or focus me
</Button>

<Popover.Root referenceElementId="multi-trigger-popover-button" trigger="hover focus">
    <Popover.Header>Multiple Triggers</Popover.Header>
    <Popover.Body>
        <p>This popover is triggered by either hovering or focusing.</p>
    </Popover.Body>
</Popover.Root>`;

    const placementExampleCode = `<!-- Top placement -->
<Button id="top-popover-button" colorVariant="secondary">
    Popover on top
</Button>

<Popover.Root referenceElementId="top-popover-button" placement="top">
    <Popover.Header>Top Placed</Popover.Header>
    <Popover.Body>
        <p>This popover appears at the top.</p>
    </Popover.Body>
</Popover.Root>

<!-- Right placement (default) -->
<Button id="right-popover-button" colorVariant="secondary">
    Popover on right
</Button>

<Popover.Root referenceElementId="right-popover-button" placement="right">
    <Popover.Header>Right Placed</Popover.Header>
    <Popover.Body>
        <p>This popover appears on the right.</p>
    </Popover.Body>
</Popover.Root>

<!-- Bottom placement -->
<Button id="bottom-popover-button" colorVariant="secondary">
    Popover on bottom
</Button>

<Popover.Root referenceElementId="bottom-popover-button" placement="bottom">
    <Popover.Header>Bottom Placed</Popover.Header>
    <Popover.Body>
        <p>This popover appears at the bottom.</p>
    </Popover.Body>
</Popover.Root>

<!-- Left placement -->
<Button id="left-popover-button" colorVariant="secondary">
    Popover on left
</Button>

<Popover.Root referenceElementId="left-popover-button" placement="left">
    <Popover.Header>Left Placed</Popover.Header>
    <Popover.Body>
        <p>This popover appears on the left.</p>
    </Popover.Body>
</Popover.Root>

<!-- Auto placement -->
<Button id="auto-popover-button" colorVariant="secondary">
    Popover with auto placement
</Button>

<Popover.Root referenceElementId="auto-popover-button" placement="auto">
    <Popover.Header>Auto Placed</Popover.Header>
    <Popover.Body>
        <p>This popover uses automatic placement based on available space.</p>
    </Popover.Body>
</Popover.Root>`;

    const dismissibleExampleCode = `<Button id="dismissible-popover-button" colorVariant="primary" onclick={() => isDismissiblePopoverShown = true}>
    Click for Dismissible Popover
</Button>

<Popover.Root isShown={isDismissiblePopoverShown} referenceElementId="dismissible-popover-button" onHidden={() => isDismissiblePopoverShown = false}>
    <Popover.Header>Dismissible Popover</Popover.Header>
    <Popover.Body>
        <p>This popover can be closed by clicking the button below.</p>
        <div class="mt-2 d-flex justify-content-end">
            <Button colorVariant="secondary" size="sm" onclick={() => isDismissiblePopoverShown = false}>Close</Button>
        </div>
    </Popover.Body>
</Popover.Root>`;

    const noFadeExampleCode = `<Button id="no-fade-popover-button" colorVariant="primary" onclick={() => isNoFadePopoverShown = true}>
    Popover without fade
</Button>

<Popover.Root isShown={isNoFadePopoverShown} useFade={false} referenceElementId="no-fade-popover-button" onHidden={() => isNoFadePopoverShown = false}>
    <Popover.Header>No Fade Effect</Popover.Header>
    <Popover.Body>
        <p>This popover appears and disappears without a fade animation.</p>
        <div class="mt-2 d-flex justify-content-end">
            <Button colorVariant="secondary" size="sm" onclick={() => isNoFadePopoverShown = false}>Close</Button>
        </div>
    </Popover.Body>
</Popover.Root>`;

    const customHeaderExampleCode = `<Button id="custom-header-popover-button" colorVariant="secondary">
    Custom Header Level
</Button>

<Popover.Root referenceElementId="custom-header-popover-button">
    <Popover.Header level={1}>H1 Title</Popover.Header>
    <Popover.Body>
        <p>This popover uses an h1 for the header instead of the default h3.</p>
    </Popover.Body>
</Popover.Root>

<!-- With custom styling -->
<Button id="custom-styled-header-popover-button" colorVariant="secondary">
    Custom Styled Header
</Button>

<Popover.Root referenceElementId="custom-styled-header-popover-button">
    <Popover.Header class="text-danger">Red Title</Popover.Header>
    <Popover.Body>
        <p>This popover has a red header.</p>
    </Popover.Body>
</Popover.Root>`;

    const htmlContentExampleCode = `<Button id="html-content-popover-button" colorVariant="primary" onclick={() => isHtmlContentShown = true}>
    Popover with HTML content
</Button>

<Popover.Root isShown={isHtmlContentShown} referenceElementId="html-content-popover-button" onHidden={() => isHtmlContentShown = false}>
    <Popover.Header>Rich Content</Popover.Header>
    <Popover.Body>
        <p>Popovers can contain <strong>rich</strong> <em>HTML</em> content.</p>
        <ul class="mb-0">
            <li>List items</li>
            <li>Form elements</li>
            <li>And more!</li>
        </ul>
        <div class="mt-2 d-flex justify-content-between">
            <Button colorVariant="outline-primary" size="sm">Action</Button>
            <Button colorVariant="outline-secondary" size="sm" onclick={() => isHtmlContentShown = false}>Close</Button>
        </div>
    </Popover.Body>
</Popover.Root>`;

    const disabledElementsExampleCode = `<!-- Using a span wrapper with tabindex to enable popover on disabled button -->
<span id="disabled-button-wrapper" tabindex="0" style="display: inline-block; cursor: not-allowed;">
    <Button disabled>Disabled Button</Button>
</span>

<Popover.Root referenceElementId="disabled-button-wrapper" trigger="hover focus">
    <Popover.Header>Disabled Button Popover</Popover.Header>
    <Popover.Body>
        <p>This popover works with a disabled button by using a span wrapper with tabindex="0".</p>
    </Popover.Body>
</Popover.Root>`;
</script>

<div class="container-fluid">
    <h1>Popover</h1>
    <p class="lead">Documentation and examples for adding custom Bootstrap popovers with content and positioning.</p>

    <hr class="my-5" />

    <!-- Interactive Playground -->
    <PopoverPlayground />

    <hr class="my-5" />

    <section class="mb-5">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            The Popover component creates a small overlay that appears when a user clicks, hovers, or focuses on an element. It consists of several
            components that work together: <code>Popover.Root</code>, <code>Popover.Header</code>, and <code>Popover.Body</code>.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-center mb-3">
                    <Button id="basic-popover-button" colorVariant="primary" onclick={() => (isBasicPopoverShown = true)}>Click for Popover</Button>

                    <Popover.Root
                        isShown={isBasicPopoverShown}
                        referenceElementId="basic-popover-button"
                        onHidden={() => (isBasicPopoverShown = false)}>
                        <Popover.Header>Popover Title</Popover.Header>
                        <Popover.Body>
                            <p>This is the popover body content. It can contain various elements.</p>
                            <div class="mt-2 d-flex justify-content-end">
                                <Button colorVariant="secondary" size="sm" onclick={() => (isBasicPopoverShown = false)}>Close</Button>
                            </div>
                        </Popover.Body>
                    </Popover.Root>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={basicExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Triggers</h2>
        <p>
            Popovers can be triggered in different ways: <code>click</code>, <code>hover</code>, <code>focus</code>, or a combination of them. The
            default trigger is <code>click</code>.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex flex-wrap gap-2">
                    <!-- Click trigger example -->
                    <div class="me-2">
                        <Button id="click-popover-button" colorVariant="secondary">Click me</Button>
                        <Popover.Root referenceElementId="click-popover-button" trigger="click" isShown={false}>
                            <Popover.Header>Click Triggered</Popover.Header>
                            <Popover.Body>This popover is activated by clicking on the button.</Popover.Body>
                        </Popover.Root>
                    </div>

                    <!-- Hover trigger example -->
                    <div class="me-2">
                        <Button id="hover-popover-button" colorVariant="secondary">Hover me</Button>
                        <Popover.Root referenceElementId="hover-popover-button" trigger="hover" isShown={isHoverPopoverShown}>
                            <Popover.Header>Hover Triggered</Popover.Header>
                            <Popover.Body>This popover is activated by hovering over the button.</Popover.Body>
                        </Popover.Root>
                    </div>

                    <!-- Focus trigger example -->
                    <div class="me-2">
                        <Button id="focus-popover-button" colorVariant="secondary">Focus me</Button>
                        <Popover.Root referenceElementId="focus-popover-button" trigger="focus" isShown={false}>
                            <Popover.Header>Focus Triggered</Popover.Header>
                            <Popover.Body>This popover is activated by focusing on the button.</Popover.Body>
                        </Popover.Root>
                    </div>

                    <!-- Multiple triggers example -->
                    <div>
                        <Button id="multi-trigger-popover-button" colorVariant="secondary">Hover or focus me</Button>
                        <Popover.Root referenceElementId="multi-trigger-popover-button" trigger="hover focus" isShown={false}>
                            <Popover.Header>Multiple Triggers</Popover.Header>
                            <Popover.Body>This popover is triggered by either hovering or focusing.</Popover.Body>
                        </Popover.Root>
                    </div>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={triggerExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Placement Options</h2>
        <p>
            Popovers can be placed in various positions relative to their reference element: <code>top</code>, <code>right</code>,
            <code>bottom</code>, <code>left</code>, or <code>auto</code>. The default placement is <code>right</code>.
        </p>

        <div class="card mb-3" style="max-width: 75%;">
            <div class="card-body">
                <div class="d-flex justify-content-center flex-wrap gap-2 mb-3">
                    <div style="min-width: 140px; margin-bottom: 1rem;">
                        <Button id="top-popover-button" colorVariant="secondary" class="w-100">Popover on top</Button>
                        <Popover.Root referenceElementId="top-popover-button" placement="top" isShown={false}>
                            <Popover.Header>Top Placed</Popover.Header>
                            <Popover.Body>This popover appears at the top.</Popover.Body>
                        </Popover.Root>
                    </div>
                </div>

                <div class="d-flex justify-content-between mb-3">
                    <div style="min-width: 140px;">
                        <Button id="left-popover-button" colorVariant="secondary" class="w-100">Popover on left</Button>
                        <Popover.Root referenceElementId="left-popover-button" placement="left" isShown={false}>
                            <Popover.Header>Left Placed</Popover.Header>
                            <Popover.Body>This popover appears on the left.</Popover.Body>
                        </Popover.Root>
                    </div>

                    <div style="min-width: 140px;">
                        <Button id="right-popover-button" colorVariant="secondary" class="w-100">Popover on right</Button>
                        <Popover.Root referenceElementId="right-popover-button" placement="right" isShown={false}>
                            <Popover.Header>Right Placed</Popover.Header>
                            <Popover.Body>This popover appears on the right.</Popover.Body>
                        </Popover.Root>
                    </div>
                </div>

                <div class="d-flex justify-content-center flex-wrap gap-2">
                    <div style="min-width: 140px; margin-bottom: 1rem;">
                        <Button id="bottom-popover-button" colorVariant="secondary" class="w-100">Popover on bottom</Button>
                        <Popover.Root referenceElementId="bottom-popover-button" placement="bottom" isShown={false}>
                            <Popover.Header>Bottom Placed</Popover.Header>
                            <Popover.Body>This popover appears at the bottom.</Popover.Body>
                        </Popover.Root>
                    </div>
                </div>

                <div class="d-flex justify-content-center mt-4">
                    <div style="min-width: 180px;">
                        <Button id="auto-popover-button" colorVariant="secondary" class="w-100">Auto placement</Button>
                        <Popover.Root referenceElementId="auto-popover-button" placement="auto" isShown={false}>
                            <Popover.Header>Auto Placed</Popover.Header>
                            <Popover.Body>This popover uses automatic placement based on available space.</Popover.Body>
                        </Popover.Root>
                    </div>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={placementExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Dismissible Popover</h2>
        <p>
            You can make popovers dismissible by adding a close button or other interactive element inside the popover body. Use the <code
                >onHidden</code> event to update your state when the popover is dismissed.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-center">
                    <Button id="dismissible-popover-button" colorVariant="primary" onclick={() => (isDismissiblePopoverShown = true)}>
                        Click for Dismissible Popover
                    </Button>

                    <Popover.Root
                        isShown={isDismissiblePopoverShown}
                        referenceElementId="dismissible-popover-button"
                        onHidden={() => (isDismissiblePopoverShown = false)}>
                        <Popover.Header>Dismissible Popover</Popover.Header>
                        <Popover.Body>
                            <p>This popover can be closed by clicking the button below.</p>
                            <div class="mt-2 d-flex justify-content-end">
                                <Button colorVariant="secondary" size="sm" onclick={() => (isDismissiblePopoverShown = false)}>Close</Button>
                            </div>
                        </Popover.Body>
                    </Popover.Root>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={dismissibleExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Remove Animation</h2>
        <p>
            For popovers that should appear and disappear without a fade animation, set the <code>useFade</code> property to <code>false</code>.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-center">
                    <Button id="no-fade-popover-button" colorVariant="primary" onclick={() => (isNoFadePopoverShown = true)}
                        >Popover without fade</Button>

                    <Popover.Root
                        isShown={isNoFadePopoverShown}
                        useFade={false}
                        referenceElementId="no-fade-popover-button"
                        onHidden={() => (isNoFadePopoverShown = false)}>
                        <Popover.Header>No Fade Effect</Popover.Header>
                        <Popover.Body>
                            <p>This popover appears and disappears without a fade animation.</p>
                            <div class="mt-2 d-flex justify-content-end">
                                <Button colorVariant="secondary" size="sm" onclick={() => (isNoFadePopoverShown = false)}>Close</Button>
                            </div>
                        </Popover.Body>
                    </Popover.Root>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={noFadeExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Custom Header</h2>
        <p>
            You can customize the header element by changing its level (h1-h6) using the <code>level</code> prop or by adding CSS classes.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex flex-wrap gap-4 justify-content-center">
                    <div>
                        <Button id="custom-header-popover-button" colorVariant="secondary">Custom Header Level</Button>
                        <Popover.Root referenceElementId="custom-header-popover-button" isShown={false}>
                            <Popover.Header level={1}>H1 Title</Popover.Header>
                            <Popover.Body>
                                <p>This popover uses an h1 for the header instead of the default h3.</p>
                            </Popover.Body>
                        </Popover.Root>
                    </div>

                    <div>
                        <Button id="custom-styled-header-popover-button" colorVariant="secondary">Custom Styled Header</Button>
                        <Popover.Root referenceElementId="custom-styled-header-popover-button" isShown={false}>
                            <Popover.Header class="text-danger">Red Title</Popover.Header>
                            <Popover.Body>
                                <p>This popover has a red header.</p>
                            </Popover.Body>
                        </Popover.Root>
                    </div>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={customHeaderExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">HTML Content</h2>
        <p>Popovers can contain rich HTML content, including lists, form elements, or interactive components.</p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-center">
                    <Button id="html-content-popover-button" colorVariant="primary" onclick={() => (isHtmlContentShown = true)}>
                        Popover with HTML content
                    </Button>

                    <Popover.Root
                        isShown={isHtmlContentShown}
                        referenceElementId="html-content-popover-button"
                        onHidden={() => (isHtmlContentShown = false)}>
                        <Popover.Header>Rich Content</Popover.Header>
                        <Popover.Body>
                            <p>Popovers can contain <strong>rich</strong> <em>HTML</em> content.</p>
                            <ul class="mb-0">
                                <li>List items</li>
                                <li>Form elements</li>
                                <li>And more!</li>
                            </ul>
                            <div class="mt-2 d-flex justify-content-between">
                                <Button colorVariant="outline-primary" size="sm">Action</Button>
                                <Button colorVariant="outline-secondary" size="sm" onclick={() => (isHtmlContentShown = false)}>Close</Button>
                            </div>
                        </Popover.Body>
                    </Popover.Root>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={htmlContentExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Disabled Elements</h2>
        <p>
            When you need to show a popover on a disabled button, you'll encounter an issue: disabled buttons don't trigger mouse or keyboard events.
            To work around this, wrap the disabled button in a <code>&lt;span&gt;</code> element with <code>tabindex="0"</code> to make it focusable, then
            attach the popover to the span instead.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-center">
                    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                    <span id="disabled-button-wrapper" tabindex="0" style="display: inline-block; cursor: not-allowed;">
                        <Button colorVariant="primary" disabled>Disabled Button</Button>
                    </span>

                    <Popover.Root isShown={isDisabledButtonPopoverShown} referenceElementId="disabled-button-wrapper" trigger="hover focus">
                        <Popover.Header>Disabled Button Popover</Popover.Header>
                        <Popover.Body>
                            <p>This popover works with a disabled button by using a span wrapper with tabindex="0".</p>
                        </Popover.Body>
                    </Popover.Root>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={disabledElementsExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Component API</h2>

        <section class="mb-4">
            <h3>Popover.Root Props</h3>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Prop</th>
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
                            <td><code>container</code></td>
                            <td><code>string | HTMLElement | false</code></td>
                            <td><code>false</code></td>
                            <td>Specifies where to append the popover in the DOM. Default is <code>false</code> (appends to body).</td>
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
                            <td><code>isShown</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Controls whether the popover is visible.</td>
                        </tr>
                        <tr>
                            <td><code>onHide</code></td>
                            <td><code>function</code></td>
                            <td></td>
                            <td>Callback to invoke when the popover starts hiding.</td>
                        </tr>
                        <tr>
                            <td><code>onHidden</code></td>
                            <td><code>function</code></td>
                            <td></td>
                            <td>Callback to invoke when the popover has been hidden.</td>
                        </tr>
                        <tr>
                            <td><code>onShow</code></td>
                            <td><code>function</code></td>
                            <td></td>
                            <td>Callback to invoke when the popover starts showing.</td>
                        </tr>
                        <tr>
                            <td><code>onShown</code></td>
                            <td><code>function</code></td>
                            <td></td>
                            <td>Callback to invoke when the popover has been shown.</td>
                        </tr>
                        <tr>
                            <td><code>placement</code></td>
                            <td><code>'top' | 'right' | 'bottom' | 'left' | 'auto'</code></td>
                            <td><code>'right'</code></td>
                            <td>Where to position the popover relative to the reference element.</td>
                        </tr>
                        <tr>
                            <td><code>referenceElementId</code></td>
                            <td><code>string</code></td>
                            <td></td>
                            <td
                                >The ID of the element that the popover should be positioned relative to. It accommodates the id containing a hash or
                                not.</td>
                        </tr>
                        <tr>
                            <td><code>trigger</code></td>
                            <td><code>'click' | 'hover' | 'focus' | 'manual'</code></td>
                            <td><code>'click'</code></td>
                            <td
                                >How the popover is triggered. Can be space-separated for multiple triggers. The use of <code>'manual'</code>
                                indicates that the popover will be triggered programmatically via the <code>isShown</code> property.</td>
                        </tr>
                        <tr>
                            <td><code>useFade</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Controls whether the popover uses a fade transition.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h3>Popover.Header Props</h3>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>level</code></td>
                            <td><code>1 | 2 | 3 | 4 | 5 | 6</code></td>
                            <td><code>3</code></td>
                            <td>The heading level to use (h1-h6).</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h3>CSS Classes</h3>
            <p>These classes can be used to customize the popover components:</p>

            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Applied to</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>.popover</code></td>
                            <td>Popover.Root</td>
                            <td>Main container for the popover.</td>
                        </tr>
                        <tr>
                            <td><code>.popover-header</code></td>
                            <td>Popover.Header</td>
                            <td>Styles the popover title.</td>
                        </tr>
                        <tr>
                            <td><code>.popover-body</code></td>
                            <td>Popover.Body</td>
                            <td>Styles the popover content.</td>
                        </tr>
                        <tr>
                            <td><code>.bs-popover-top</code></td>
                            <td>Popover.Root</td>
                            <td>Applied when the popover is placed at the top.</td>
                        </tr>
                        <tr>
                            <td><code>.bs-popover-end</code></td>
                            <td>Popover.Root</td>
                            <td>Applied when the popover is placed on the right.</td>
                        </tr>
                        <tr>
                            <td><code>.bs-popover-bottom</code></td>
                            <td>Popover.Root</td>
                            <td>Applied when the popover is placed at the bottom.</td>
                        </tr>
                        <tr>
                            <td><code>.bs-popover-start</code></td>
                            <td>Popover.Root</td>
                            <td>Applied when the popover is placed on the left.</td>
                        </tr>
                        <tr>
                            <td><code>.fade</code></td>
                            <td>Popover.Root</td>
                            <td>Applies fade transition effect.</td>
                        </tr>
                        <tr>
                            <td><code>.show</code></td>
                            <td>Popover.Root</td>
                            <td>Makes the popover visible.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </section>
</div>

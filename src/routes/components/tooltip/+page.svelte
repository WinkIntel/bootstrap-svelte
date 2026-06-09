<script lang="ts">
    import { Button, Tooltip } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import TooltipPlayground from './TooltipPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Button id="basic-tooltip-example" colorVariant="primary">Hover over me</Button>

<Tooltip.Root trigger="hover" referenceElementId="basic-tooltip-example">
    <Tooltip.Inner>This is a simple tooltip</Tooltip.Inner>
</Tooltip.Root>`;

    const tooltipDirectionsCode = `<Button id="tooltip-top" colorVariant="secondary" class="me-2">Tooltip on top</Button>
<Tooltip.Root placement="top" referenceElementId="tooltip-top">
    <Tooltip.Inner>Tooltip on top</Tooltip.Inner>
</Tooltip.Root>

<Button id="tooltip-right" colorVariant="secondary" class="me-2">Tooltip on right</Button>
<Tooltip.Root placement="right" referenceElementId="tooltip-right">
    <Tooltip.Inner>Tooltip on right</Tooltip.Inner>
</Tooltip.Root>

<Button id="tooltip-bottom" colorVariant="secondary" class="me-2">Tooltip on bottom</Button>
<Tooltip.Root placement="bottom" referenceElementId="tooltip-bottom">
    <Tooltip.Inner>Tooltip on bottom</Tooltip.Inner>
</Tooltip.Root>

<Button id="tooltip-left" colorVariant="secondary">Tooltip on left</Button>
<Tooltip.Root placement="left" referenceElementId="tooltip-left">
    <Tooltip.Inner>Tooltip on left</Tooltip.Inner>
</Tooltip.Root>`;

    const disabledButtonTooltipCode = `<span class="d-inline-block" tabindex="0" id="disabled-wrapper-example">
    <Button disabled colorVariant="primary">Disabled button</Button>
</span>

<Tooltip.Root referenceElementId="disabled-wrapper-example">
    <Tooltip.Inner>Tooltip for disabled button</Tooltip.Inner>
</Tooltip.Root>`;

    const customTriggerCode = `<Button id="click-tooltip-example" colorVariant="info">Click me</Button>
<Tooltip.Root trigger="click" referenceElementId="click-tooltip-example">
    <Tooltip.Inner>Click-triggered tooltip</Tooltip.Inner>
</Tooltip.Root>

<Button id="focus-tooltip-example" colorVariant="info">Focus me</Button>
<Tooltip.Root trigger="focus" referenceElementId="focus-tooltip-example">
    <Tooltip.Inner>Focus-triggered tooltip</Tooltip.Inner>
</Tooltip.Root>

<Button id="hover-tooltip-example" colorVariant="info">Hover me</Button>
<Tooltip.Root trigger="hover" referenceElementId="hover-tooltip-example">
    <Tooltip.Inner>Hover-triggered tooltip</Tooltip.Inner>
</Tooltip.Root>

<Button id="focus-hover-tooltip-example" colorVariant="info">Focus &amp; Hover trigger</Button>
<Tooltip.Root trigger="focus hover" referenceElementId="focus-hover-tooltip-example">
    <Tooltip.Inner>Focus &amp; Hover-triggered tooltip</Tooltip.Inner>
</Tooltip.Root>`;

    const htmlContentCode = `<Button id="html-tooltip-example" colorVariant="warning">HTML Content</Button>

<Tooltip.Root referenceElementId="html-tooltip-example">
    <Tooltip.Inner>
        <strong>Bold text</strong> and <em>italic text</em>
    </Tooltip.Inner>
</Tooltip.Root>`;

    const noFadeCode = `<Button id="no-fade-example" colorVariant="danger">No Fade Effect</Button>

<Tooltip.Root useFade={false} referenceElementId="no-fade-example">
    <Tooltip.Inner>This tooltip appears without fade transition</Tooltip.Inner>
</Tooltip.Root>`;

    const tooltipCustomCssCode = `<Button id="custom-tooltip-example1" colorVariant="warning">Custom Tooltip using "style" attribute</Button>

<Tooltip.Root referenceElementId="custom-tooltip-example1" style="--bs-tooltip-bg: #712cf9; --bs-tooltip-color: #fff;">
    <Tooltip.Inner>
        <strong>Custom tooltip</strong> with <em>HTML content</em>
    </Tooltip.Inner>
</Tooltip.Root>

<Button id="custom-tooltip-example2" colorVariant="danger">Custom Tooltip using "class" attribute</Button>

<Tooltip.Root referenceElementId="custom-tooltip-example2" class="custom-tooltip-colors">
    <Tooltip.Inner>
        <strong>Custom tooltip</strong> with <em>HTML content</em>
    </Tooltip.Inner>
</Tooltip.Root>

<style global>
    .custom-tooltip-colors {
        --bs-tooltip-bg: #db178c;
        --bs-tooltip-color: #fff;
    }
</style>`;
</script>

<div class="container-fluid">
    <h1>Tooltips</h1>
    <p class="lead">Documentation and examples for adding custom Bootstrap tooltips with CSS and JavaScript using Svelte components.</p>

    <hr class="my-5" />

    <!-- Interactive Playground -->
    <TooltipPlayground />

    <hr class="my-5" />

    <section class="mb-5">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>The simplest way to add a tooltip to an element.</p>

        <div class="card mb-3">
            <div class="card-body">
                <Button id="basic-tooltip-example" colorVariant="primary">Hover over me</Button>
                <Tooltip.Root trigger="hover" referenceElementId="basic-tooltip-example">
                    <Tooltip.Inner>This is a simple tooltip</Tooltip.Inner>
                </Tooltip.Root>
            </div>
        </div>

        <SyntaxHighlighter code={basicExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Custom tooltips</h2>
        <p>Tooltips can be customized with different colors and styles.</p>
        <div class="card mb-3">
            <div class="card-body">
                <Button id="custom-tooltip-example1" colorVariant="warning">Custom Tooltip using "style" attribute</Button>
                <Tooltip.Root referenceElementId="custom-tooltip-example1" style="--bs-tooltip-bg: #712cf9; --bs-tooltip-color: #fff;">
                    <Tooltip.Inner>
                        <strong>Custom tooltip</strong> with <em>HTML content</em>
                    </Tooltip.Inner>
                </Tooltip.Root>
                <Button id="custom-tooltip-example2" colorVariant="danger">Custom Tooltip using "class" attribute</Button>
                <Tooltip.Root referenceElementId="custom-tooltip-example2" class="custom-tooltip-colors">
                    <Tooltip.Inner>
                        <strong>Custom tooltip</strong> with <em>HTML content</em>
                    </Tooltip.Inner>
                </Tooltip.Root>
            </div>
        </div>
        <SyntaxHighlighter code={tooltipCustomCssCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Placement Options</h2>
        <p>Tooltips can be positioned in four different directions: top, right, bottom, and left.</p>

        <div class="card mb-3" style="max-width: 75%;">
            <div class="card-body">
                <div class="d-flex flex-wrap gap-2 mb-3">
                    <Button id="tooltip-top-example" colorVariant="secondary">Tooltip on top</Button>
                    <Tooltip.Root placement="top" referenceElementId="tooltip-top-example">
                        <Tooltip.Inner>Tooltip on top</Tooltip.Inner>
                    </Tooltip.Root>

                    <Button id="tooltip-right-example" colorVariant="secondary">Tooltip on right</Button>
                    <Tooltip.Root placement="right" referenceElementId="tooltip-right-example">
                        <Tooltip.Inner>Tooltip on right</Tooltip.Inner>
                    </Tooltip.Root>

                    <Button id="tooltip-bottom-example" colorVariant="secondary">Tooltip on bottom</Button>
                    <Tooltip.Root placement="bottom" referenceElementId="tooltip-bottom-example">
                        <Tooltip.Inner>Tooltip on bottom</Tooltip.Inner>
                    </Tooltip.Root>

                    <Button id="tooltip-left-example" colorVariant="secondary">Tooltip on left</Button>
                    <Tooltip.Root placement="left" referenceElementId="tooltip-left-example">
                        <Tooltip.Inner>Tooltip on left</Tooltip.Inner>
                    </Tooltip.Root>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={tooltipDirectionsCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Triggers</h2>
        <p>Tooltips can be triggered by various events like hover, click, or focus.</p>
        <ul>
            <li>Click: Tooltip appears on click</li>
            <li>Focus: Tooltip appears on focus</li>
            <li>Hover: Tooltip appears on mouse enter</li>
            <li>
                Manual: Tooltip is shown/hidden programmatically using the <code>isShown</code> property. Use playground above to see it in action.
            </li>
        </ul>

        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex flex-wrap gap-2 mb-3">
                    <Button id="click-tooltip-example" colorVariant="info">Click me</Button>
                    <Tooltip.Root trigger="click" referenceElementId="click-tooltip-example">
                        <Tooltip.Inner>Click-triggered tooltip</Tooltip.Inner>
                    </Tooltip.Root>

                    <Button id="focus-tooltip-example" colorVariant="info">Focus me</Button>
                    <Tooltip.Root trigger="focus" referenceElementId="focus-tooltip-example">
                        <Tooltip.Inner>Focus-triggered tooltip</Tooltip.Inner>
                    </Tooltip.Root>

                    <Button id="hover-tooltip-example" colorVariant="info">Hover me</Button>
                    <Tooltip.Root trigger="hover" referenceElementId="hover-tooltip-example">
                        <Tooltip.Inner>Hover-triggered tooltip</Tooltip.Inner>
                    </Tooltip.Root>

                    <Button id="focus-hover-tooltip-example" colorVariant="info">Focus &amp; Hover trigger</Button>
                    <Tooltip.Root trigger="focus hover" referenceElementId="focus-hover-tooltip-example">
                        <Tooltip.Inner>Focus &amp; Hover-triggered tooltip</Tooltip.Inner>
                    </Tooltip.Root>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={customTriggerCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">HTML Content</h2>
        <p>Tooltips can contain HTML content for rich formatting.</p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Button id="html-tooltip-example" colorVariant="warning">HTML Content</Button>
                    <Tooltip.Root referenceElementId="html-tooltip-example">
                        <Tooltip.Inner>
                            <strong>Bold text</strong> and <em>italic text</em>
                        </Tooltip.Inner>
                    </Tooltip.Root>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={htmlContentCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">No Fade Effect</h2>
        <p>Tooltips can appear without the fade transition effect.</p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Button id="no-fade-example" colorVariant="danger">No Fade Effect</Button>
                    <Tooltip.Root useFade={false} referenceElementId="no-fade-example">
                        <Tooltip.Inner>This tooltip appears without fade transition</Tooltip.Inner>
                    </Tooltip.Root>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={noFadeCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Tooltips on Disabled Elements</h2>
        <p>To add tooltips to disabled elements, wrap them in a container element.</p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                    <span class="d-inline-block" tabindex="0" id="disabled-wrapper-example">
                        <Button disabled colorVariant="primary">Disabled button</Button>
                    </span>
                    <Tooltip.Root referenceElementId="disabled-wrapper-example">
                        <Tooltip.Inner>Tooltip for disabled button</Tooltip.Inner>
                    </Tooltip.Root>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={disabledButtonTooltipCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Accessibility</h2>
        <p>
            Do not rely on hover-only tooltips for essential information. Hover does not work for keyboard-only users, many touch interfaces, or users
            who need more time to read content.
        </p>
        <ul>
            <li>Pair hover triggers with focus behavior, or provide the same information in visible page text.</li>
            <li>Make the trigger element keyboard focusable and ensure the tooltip appears when the trigger receives focus.</li>
            <li>For touch interfaces, prefer click or manual control so users can intentionally open and dismiss the tooltip.</li>
            <li>Keep tooltip content short and non-interactive. Use a popover or dialog when the content needs links, buttons, or form controls.</li>
            <li>Persistent or manually opened tooltip-like UI should have an obvious dismissal path, including keyboard dismissal.</li>
        </ul>
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">API Reference</h2>

        <div class="card mb-4">
            <div class="card-header">
                <h3 class="h5 mb-0">Tooltip.Root Props</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm table-striped mb-0">
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
                                <td><code>container</code></td>
                                <td><code>string | HTMLElement | false</code></td>
                                <td><code>false</code></td>
                                <td>Appends the tooltip to a specific element. Useful for positioning tooltips in the flow of the document.</td>
                            </tr>
                            <tr>
                                <td><code>isShown</code></td>
                                <td><code>boolean</code></td>
                                <td><code>false</code></td>
                                <td>Controls whether the tooltip is visible.</td>
                            </tr>
                            <tr>
                                <td><code>placement</code></td>
                                <td><code>string</code></td>
                                <td><code>'top'</code></td>
                                <td
                                    >Position of the tooltip relative to its target: <code>'top'</code>, <code>'bottom'</code>, <code>'left'</code>,
                                    <code>'right'</code>.</td>
                            </tr>
                            <tr>
                                <td><code>referenceElementId</code></td>
                                <td><code>string</code></td>
                                <td><code>undefined</code></td>
                                <td>ID of the element that the tooltip is attached to.</td>
                            </tr>
                            <tr>
                                <td><code>trigger</code></td>
                                <td><code>string</code></td>
                                <td><code>'hover focus'</code></td>
                                <td
                                    >How tooltip is triggered: <code>'click'</code>, <code>'hover'</code>, <code>'focus'</code>,
                                    <code>'manual'</code>, or a space-separated combination.</td>
                            </tr>
                            <tr>
                                <td><code>useFade</code></td>
                                <td><code>boolean</code></td>
                                <td><code>true</code></td>
                                <td>Whether to apply a fade transition effect to the tooltip.</td>
                            </tr>
                            <tr>
                                <td><code>onShow</code></td>
                                <td><code>Function</code></td>
                                <td><code>noop</code></td>
                                <td>Function called when the tooltip is shown.</td>
                            </tr>
                            <tr>
                                <td><code>onShown</code></td>
                                <td><code>Function</code></td>
                                <td><code>noop</code></td>
                                <td>Function called after the tooltip is fully shown.</td>
                            </tr>
                            <tr>
                                <td><code>onHide</code></td>
                                <td><code>Function</code></td>
                                <td><code>noop</code></td>
                                <td>Function called when the tooltip begins to hide.</td>
                            </tr>
                            <tr>
                                <td><code>onHidden</code></td>
                                <td><code>Function</code></td>
                                <td><code>noop</code></td>
                                <td>Function called after the tooltip is fully hidden.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h3 class="h5 mb-0">Tooltip.Inner Props</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm table-striped mb-0">
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
                                <td>All <code>div</code> element props</td>
                                <td>Various</td>
                                <td>-</td>
                                <td>The Inner component accepts all standard HTML div element attributes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h3 class="h5 mb-0">CSS Classes</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm table-striped mb-0">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr>
                                <td><code>.tooltip</code></td>
                                <td>Main container class for the tooltip</td>
                            </tr>
                            <tr>
                                <td><code>.tooltip-inner</code></td>
                                <td>Styles the inner content area of the tooltip</td>
                            </tr>
                            <tr>
                                <td><code>.tooltip-arrow</code></td>
                                <td>Styles the arrow element that points to the reference element</td>
                            </tr>
                            <tr>
                                <td><code>.bs-tooltip-top</code></td>
                                <td>Applied when the tooltip is positioned above the target</td>
                            </tr>
                            <tr>
                                <td><code>.bs-tooltip-end</code></td>
                                <td>Applied when the tooltip is positioned to the right of the target</td>
                            </tr>
                            <tr>
                                <td><code>.bs-tooltip-bottom</code></td>
                                <td>Applied when the tooltip is positioned below the target</td>
                            </tr>
                            <tr>
                                <td><code>.bs-tooltip-start</code></td>
                                <td>Applied when the tooltip is positioned to the left of the target</td>
                            </tr>
                            <tr>
                                <td><code>.fade</code></td>
                                <td>Applied to enable the fade transition effect</td>
                            </tr>
                            <tr>
                                <td><code>.show</code></td>
                                <td>Applied when the tooltip is visible</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</div>

<style global>
    .custom-tooltip-colors {
        --bs-tooltip-bg: #db178c;
        --bs-tooltip-color: #fff;
    }
</style>

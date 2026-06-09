<script lang="ts">
    import { Button, Collapse, collapseAria } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import CollapsePlayground from './CollapsePlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<script>
    import { collapseAria } from '@winkintel/bootstrap-svelte';

    let isBasicExpanded = $state(false);
\u003c/script>

<Button
    {@attach collapseAria({
        ariaControls: 'basicExample',
        ariaExpanded: isBasicExpanded
    })}
    colorVariant="primary"
    isExpanded={isBasicExpanded}
    onclick={() => (isBasicExpanded = !isBasicExpanded)}>
    {isBasicExpanded ? 'Collapse Content' : 'Expand Content'}
</Button>

<Collapse id="basicExample" isExpanded={isBasicExpanded}>
    This is some placeholder content for a collapsible element.
    Click the button to toggle visibility.
</Collapse>`;

    const horizontalExampleCode = `<script>
    import { collapseAria } from '@winkintel/bootstrap-svelte';

    let isHorizontalCollapsed = $state(false);
\u003c/script>

<Button
    {@attach collapseAria({
        ariaControls: 'horizontalExample',
        ariaExpanded: isHorizontalCollapsed
    })}
    colorVariant="primary"
    isExpanded={isHorizontalCollapsed}
    onclick={() => isHorizontalCollapsed = !isHorizontalCollapsed}>
    {isHorizontalCollapsed ? 'Collapse Content' : 'Expand Content'}
</Button>

<div class="p-4">
    <Collapse id="horizontalExample" isExpanded={isHorizontalCollapsed} isHorizontal={true}>
        <div style="width: 300px;">
            This content collapses horizontally instead of vertically.
        </div>
    </Collapse>
</div>`;

    const multipleTargetsExampleCode = `<script>
    import { collapseAria } from '@winkintel/bootstrap-svelte';

    let isMultiCollapseExpanded1 = $state(false);
    let isMultiCollapseExpanded2 = $state(false);

    function toggleMultiCollapse(target: string) {
        if (target === 'multiCollapse1') {
            isMultiCollapseExpanded1 = !isMultiCollapseExpanded1;
        } else if (target === 'multiCollapse2') {
            isMultiCollapseExpanded2 = !isMultiCollapseExpanded2;
        } else if (target === 'both') {
            isMultiCollapseExpanded1 = !isMultiCollapseExpanded1;
            isMultiCollapseExpanded2 = !isMultiCollapseExpanded2;
        }
    }
\u003c/script>

<p>
    <Button
        {@attach collapseAria({
            ariaControls: 'multiCollapse1',
            ariaExpanded: isMultiCollapseExpanded1
        })}
        colorVariant="primary"
        onclick={() => toggleMultiCollapse('multiCollapse1')}>
        Toggle First Element
    </Button>
    <Button
        {@attach collapseAria({
            ariaControls: 'multiCollapse2',
            ariaExpanded: isMultiCollapseExpanded2
        })}
        colorVariant="secondary"
        onclick={() => toggleMultiCollapse('multiCollapse2')}>
        Toggle Second Element
    </Button>
    <Button
        {@attach collapseAria({
            ariaControls: 'multiCollapse1 multiCollapse2',
            ariaExpanded: isMultiCollapseExpanded1 && isMultiCollapseExpanded2
        })}
        colorVariant="info"
        onclick={() => toggleMultiCollapse('both')}>
        Toggle Both Elements
    </Button>
</p>

<div class="row">
    <div class="col">
        <Collapse id="multiCollapse1" isExpanded={isMultiCollapseExpanded1}>
            <div class="card card-body">
            First collapsible element content
            </div>
        </Collapse>
    </div>
    <div class="col">
        <Collapse id="multiCollapse2" isExpanded={isMultiCollapseExpanded2}>
            <div class="card card-body">
            Second collapsible element content
            </div>
        </Collapse>
    </div>
</div>`;

    const eventsExampleCode = `<script>
    import { collapseAria } from '@winkintel/bootstrap-svelte';

    let isEventsExpanded = $state(false);
\u003c/script>

<Button
    {@attach collapseAria({
        ariaControls: 'eventsExample',
        ariaExpanded: isEventsExpanded
    })}
    colorVariant="primary"
    onclick={() => isEventsExpanded = !isEventsExpanded}>
    {isEventsExpanded ? 'Collapse Content' : 'Expand Content'}
</Button>

<Collapse
    id="eventsExample"
    isExpanded={isEventsExpanded}
    onExpand={e => console.log('onExpand event fired', e)}
    onExpanded={e => console.log('onExpanded event fired', e)}
    onCollapse={e => console.log('onCollapse event fired', e)}
    onCollapsed={e => console.log('onCollapsed event fired', e)}>
    <div class="card card-body">
        This collapse component has event handlers attached.
        Check the console to see the events as they fire.
    </div>
</Collapse>`;

    // For basic example
    let isBasicExpanded = $state(false);

    // For horizontal example
    let isHorizontalExpanded = $state(false);

    // For multiple targets example
    let isMultiCollapseExpanded1 = $state(false);
    let isMultiCollapseExpanded2 = $state(false);

    function toggleMultiCollapse(target: string) {
        if (target === 'multiCollapse1') {
            isMultiCollapseExpanded1 = !isMultiCollapseExpanded1;
        } else if (target === 'multiCollapse2') {
            isMultiCollapseExpanded2 = !isMultiCollapseExpanded2;
        } else if (target === 'both') {
            isMultiCollapseExpanded1 = !isMultiCollapseExpanded1;
            isMultiCollapseExpanded2 = !isMultiCollapseExpanded2;
        }
    }

    // For events example
    let isEventsExpanded = $state(false);
    let eventMessages: string[] = $state([]);

    function handleExpand() {
        eventMessages = [...eventMessages, 'onExpand event fired'];
    }

    function handleExpanded() {
        eventMessages = [...eventMessages, 'onExpanded event fired'];
    }

    function handleCollapse() {
        eventMessages = [...eventMessages, 'onCollapse event fired'];
    }

    function handleCollapsed() {
        eventMessages = [...eventMessages, 'onCollapsed event fired'];
    }

    function clearEventMessages() {
        eventMessages = [];
    }
</script>

<div>
    <div class="mb-5">
        <h1>Collapse</h1>
        <p class="lead">
            Bootstrap's collapse component built with Svelte 5. Toggle the visibility of content across your project with the Collapse component.
        </p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Collapse component by adjusting the props below:</p>
        <CollapsePlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            Click the button below to expand and collapse the collapsible content. The <code>isExpanded</code> prop controls the visibility of the content.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Button
                        {@attach collapseAria({
                            ariaControls: 'basicExample',
                            ariaExpanded: isBasicExpanded
                        })}
                        colorVariant="primary"
                        onclick={() => (isBasicExpanded = !isBasicExpanded)}>
                        {isBasicExpanded ? 'Collapse Content' : 'Expand Content'}
                    </Button>
                    <div class="mt-2">
                        <Collapse id="basicExample" isExpanded={isBasicExpanded}>
                            <div class="card card-body">
                                This is some placeholder content for a collapsible element. Click the button above to toggle visibility.
                            </div>
                        </Collapse>
                    </div>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Horizontal Collapse -->
    <section class="mb-5" id="horizontal-collapse">
        <h2 class="wk-quick-link">Horizontal Collapse</h2>
        <p>
            The Collapse component can collapse content horizontally instead of vertically by setting the <code>isHorizontal</code> prop to
            <code>true</code>.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Button
                        {@attach collapseAria({
                            ariaControls: 'horizontalExample',
                            ariaExpanded: isHorizontalExpanded
                        })}
                        colorVariant="primary"
                        onclick={() => (isHorizontalExpanded = !isHorizontalExpanded)}>
                        {isHorizontalExpanded ? 'Collapse Content' : 'Expand Content'}
                    </Button>
                    <div class="mt-2 p-4">
                        <Collapse id="horizontalExample" isExpanded={isHorizontalExpanded} isHorizontal={true}>
                            <div style="width: 300px;" class="p-3 border bg-light">This content collapses horizontally instead of vertically.</div>
                        </Collapse>
                    </div>
                </div>
                <SyntaxHighlighter code={horizontalExampleCode} />
            </div>
        </div>
    </section>

    <!-- Multiple Targets -->
    <section class="mb-5" id="multiple-targets">
        <h2 class="wk-quick-link">Multiple Targets</h2>
        <p>
            A button can expand and collapse multiple collapsible elements by controlling the <code>isExpanded</code> prop of multiple Collapse components.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <p>
                        <Button
                            {@attach collapseAria({
                                ariaControls: 'multiCollapse1',
                                ariaExpanded: isMultiCollapseExpanded1
                            })}
                            colorVariant="primary"
                            class="me-2"
                            onclick={() => toggleMultiCollapse('multiCollapse1')}>
                            Toggle First Element
                        </Button>
                        <Button
                            {@attach collapseAria({
                                ariaControls: 'multiCollapse2',
                                ariaExpanded: isMultiCollapseExpanded2
                            })}
                            colorVariant="secondary"
                            class="me-2"
                            onclick={() => toggleMultiCollapse('multiCollapse2')}>
                            Toggle Second Element
                        </Button>
                        <Button
                            {@attach collapseAria({
                                ariaControls: 'multiCollapse1 multiCollapse2',
                                ariaExpanded: isMultiCollapseExpanded1 && isMultiCollapseExpanded2
                            })}
                            colorVariant="info"
                            onclick={() => toggleMultiCollapse('both')}>
                            Toggle Both Elements
                        </Button>
                    </p>
                    <div class="row">
                        <div class="col">
                            <Collapse id="multiCollapse1" isExpanded={isMultiCollapseExpanded1}>
                                <div class="card card-body">First collapsible element content</div>
                            </Collapse>
                        </div>
                        <div class="col">
                            <Collapse id="multiCollapse2" isExpanded={isMultiCollapseExpanded2}>
                                <div class="card card-body">Second collapsible element content</div>
                            </Collapse>
                        </div>
                    </div>
                </div>
                <SyntaxHighlighter code={multipleTargetsExampleCode} />
            </div>
        </div>
    </section>

    <!-- Events section -->
    <section class="mb-5" id="events">
        <h2 class="wk-quick-link">Events</h2>
        <p>
            The Collapse component emits events when it shows and hides. You can attach event handlers with the
            <code>onExpand</code>, <code>onExpanded</code>, <code>onCollapse</code>, and <code>onCollapsed</code> props.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Button
                        {@attach collapseAria({
                            ariaControls: 'eventsExample',
                            ariaExpanded: isEventsExpanded
                        })}
                        colorVariant="primary"
                        onclick={() => (isEventsExpanded = !isEventsExpanded)}>
                        {isEventsExpanded ? 'Collapse Content' : 'Expand Content'}
                    </Button>
                    <div class="mt-2">
                        <Collapse
                            id="eventsExample"
                            isExpanded={isEventsExpanded}
                            onExpand={handleExpand}
                            onExpanded={handleExpanded}
                            onCollapse={handleCollapse}
                            onCollapsed={handleCollapsed}>
                            <div class="card card-body">
                                This collapse component has event handlers attached. The events will be displayed below as they fire.
                            </div>
                        </Collapse>
                    </div>

                    <div class="mt-3 p-3 border rounded">
                        <div class="d-flex justify-content-between align-items-center">
                            <h4 class="h6 mb-0">Event Log</h4>
                            <button class="btn btn-sm btn-outline-secondary" onclick={clearEventMessages}>Clear</button>
                        </div>
                        <div class="mt-2">
                            <ul class="list-group">
                                {#each eventMessages as message, messageIndex (`message-${messageIndex}`)}
                                    <li class="list-group-item py-1">{message}</li>
                                {:else}
                                    <li class="list-group-item py-1">No events logged</li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                </div>
                <SyntaxHighlighter code={eventsExampleCode} />
            </div>
        </div>
    </section>

    <!-- Accessibility section -->
    <section class="mb-5" id="events">
        <h2 class="wk-quick-link">Accessibility</h2>
        <p>
            Be sure to add <code>aria-expanded</code> to the control element. This attribute explicitly conveys the current state of the collapsible
            element tied to the control to screen readers and similar assistive technologies. If the collapsible element is closed by default, the
            attribute on the control element should have a value of <code>aria-expanded="false"</code>. If you’ve set the collapsible element to be
            open by default using the show class, set <code>aria-expanded="true"</code> on the control instead.
        </p>
        <p>
            The control element that targets the collapsible element should add the <code>aria-controls</code> attribute to the control element,
            containing the <code>id</code> of the collapsible element. Multiple collapsible elements are simply space delimited. Modern screen readers and
            similar assistive technologies make use of this attribute to provide users with additional shortcuts to navigate directly to the collapsible
            element itself.
        </p>
        <p>
            The Collapse component provides a <code>collapseAria</code> attachment to easily add the necessary ARIA attributes to any control element. See
            the examples above for usage details.
        </p>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3>Scrollspy Attachment</h3>
        <p>
            The <code>collapseAria</code> function creates an attachment that can be applied to an element with the <code>{`{@attach ...}`}</code> directive.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <SyntaxHighlighter
                    code={`// Type definition for CollapseAriaOptions
export type CollapseAriaOptions = {
    ariaControls: string;
    ariaExpanded: boolean;
};

// Usage example
<Button
    {@attach collapseAria({
        ariaControls: 'collapseExample',    // Single or space delimited list of the Collapse component IDs being controlled
        ariaExpanded: isExpanded            // Boolean indicating if the Collapse component is expanded (true) or collapsed (false)
    })}
    colorVariant="primary"
    onclick={() => isExpanded = !isExpanded}>
    {isExpanded ? 'Collapse Content' : 'Expand Content'}
</Button>`} />
            </div>
        </div>

        <h3 class="h5 mt-4">Props</h3>
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
                        <td><code>undefined</code></td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>isHorizontal</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Makes the collapse transition horizontally instead of vertically.</td>
                    </tr>
                    <tr>
                        <td><code>isExpanded</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Controls whether the collapse content is visible.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Events</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>onExpand</code></td>
                        <td><code>EventListener</code></td>
                        <td>Fired when the collapse is about to expand (at the start of the transition).</td>
                    </tr>
                    <tr>
                        <td><code>onExpanded</code></td>
                        <td><code>EventListener</code></td>
                        <td>Fired when the collapse has been fully expanded (after the transition is complete).</td>
                    </tr>
                    <tr>
                        <td><code>onCollapse</code></td>
                        <td><code>EventListener</code></td>
                        <td>Fired when the collapse is about to collapse (at the start of the transition).</td>
                    </tr>
                    <tr>
                        <td><code>onCollapsed</code></td>
                        <td><code>EventListener</code></td>
                        <td>Fired when the collapse has been fully collapsed (after the transition is complete).</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's collapse classes based on the provided props:</p>
        <ul>
            <li><code>collapse</code> - Always applied as the base class</li>
            <li><code>collapse-horizontal</code> - Applied when isHorizontal is true</li>
            <li><code>show</code> - Applied when isExpanded is true</li>
        </ul>
    </section>
</div>

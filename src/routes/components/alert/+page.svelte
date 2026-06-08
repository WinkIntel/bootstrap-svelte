<script lang="ts">
    import { Alert } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import AlertPlayground from './AlertPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Alert colorVariant="primary">
  A simple primary alert—check it out!
</Alert>`;
    const variantExampleCode = `<Alert colorVariant="primary">A simple primary alert—check it out!</Alert>
<Alert colorVariant="secondary">A simple secondary alert—check it out!</Alert>
<Alert colorVariant="success">A simple success alert—check it out!</Alert>
<Alert colorVariant="danger">A simple danger alert—check it out!</Alert>
<Alert colorVariant="warning">A simple warning alert—check it out!</Alert>
<Alert colorVariant="info">A simple info alert—check it out!</Alert>
<Alert colorVariant="light">A simple light alert—check it out!</Alert>
<Alert colorVariant="dark">A simple dark alert—check it out!</Alert>`;
    const dismissibleExampleCode = `<Alert colorVariant="warning" isDismissible={true}>
  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
</Alert>`;
    const additionalContentExampleCode = `<Alert colorVariant="success">
  <h4 class="alert-heading">Well done!</h4>
  <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
  <hr>
  <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
</Alert>`;
    const iconExampleCode = `<Alert colorVariant="primary">
  <i class="bi bi-info-circle-fill me-2"></i>
  An example alert with an icon
</Alert>`;
</script>

<div>
    <div class="mb-5">
        <h1>Alert</h1>
        <p class="lead">
            Bootstrap's alert component built with Svelte 5. Use alerts to provide contextual feedback messages for typical user actions.
        </p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Alert component by adjusting the props below:</p>
        <AlertPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Alert id="baseAlert" colorVariant="primary">A simple primary alert—check it out!</Alert>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Alert Variants section -->
    <section class="mb-5" id="variants">
        <h2 class="wk-quick-link">Alert Variants</h2>
        <p>Bootstrap includes several predefined alert styles for different contexts.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Alert id="variantPrimary" colorVariant="primary">A simple primary alert—check it out!</Alert>
                    <Alert id="variantSecondary" colorVariant="secondary">A simple secondary alert—check it out!</Alert>
                    <Alert id="variantSuccess" colorVariant="success">A simple success alert—check it out!</Alert>
                    <Alert id="variantDanger" colorVariant="danger">A simple danger alert—check it out!</Alert>
                    <Alert id="variantWarning" colorVariant="warning">A simple warning alert—check it out!</Alert>
                    <Alert id="variantInfo" colorVariant="info">A simple info alert—check it out!</Alert>
                    <Alert id="variantLight" colorVariant="light">A simple light alert—check it out!</Alert>
                    <Alert id="variantDark" colorVariant="dark">A simple dark alert—check it out!</Alert>
                </div>

                <SyntaxHighlighter code={variantExampleCode} />
            </div>
        </div>
    </section>

    <!-- Dismissible Alerts section -->
    <section class="mb-5" id="dismissible-alerts">
        <h2 class="wk-quick-link">Dismissible Alerts</h2>
        <p>
            Make alerts dismissible by adding the <code>isDismissible</code> prop. This adds a close button to the alert and allows it to be closed by users.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Alert id="dismissibleAlert" colorVariant="warning" isDismissible={true}>
                        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
                    </Alert>
                </div>

                <SyntaxHighlighter code={dismissibleExampleCode} />
            </div>
        </div>
    </section>

    <!-- Additional Content section -->
    <section class="mb-5" id="additional-content">
        <h2 class="wk-quick-link">Additional Content</h2>
        <p>Alerts can contain additional HTML elements like headings, paragraphs and dividers.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Alert id="additionalContentAlert" colorVariant="success">
                        <h4 class="alert-heading">Well done!</h4>
                        <p>
                            Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you
                            can see how spacing within an alert works with this kind of content.
                        </p>
                        <hr />
                        <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
                    </Alert>
                </div>

                <SyntaxHighlighter code={additionalContentExampleCode} />
            </div>
        </div>
    </section>

    <!-- Icons section -->
    <section class="mb-5" id="icons">
        <h2 class="wk-quick-link">Icons</h2>
        <p>Add icons to your alerts to enhance visual appearance. You can use any icon library like Bootstrap Icons.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Alert id="iconAlert" colorVariant="primary">
                        <i class="bi bi-info-circle-fill me-2"></i>
                        An example alert with an icon
                    </Alert>
                </div>

                <SyntaxHighlighter code={iconExampleCode} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Props</h3>
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
                        <td><code>colorVariant</code></td>
                        <td><code>string</code></td>
                        <td><code>'primary'</code></td>
                        <td>
                            Sets the alert's background color. Values: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light',
                            'dark'.
                        </td>
                    </tr>
                    <tr>
                        <td><code>isDismissible</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Adds a close button that allows users to dismiss the alert.</td>
                    </tr>
                    <tr>
                        <td><code>isAnimated</code></td>
                        <td><code>boolean</code></td>
                        <td><code>true</code></td>
                        <td>Enables the fade animation when the alert is shown or hidden.</td>
                    </tr>
                    <tr>
                        <td><code>isOpen</code></td>
                        <td><code>boolean</code></td>
                        <td><code>true</code></td>
                        <td>Controls the visibility of the alert. Can be bound using <code>bind:isOpen</code>.</td>
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

        <h3 class="h5 mt-4">Events</h3>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>onClose</code></td>
                        <td><code>EventListener</code></td>
                        <td>Fired when the alert is about to Close (at the start of the transition).</td>
                    </tr>
                    <tr>
                        <td><code>onClosed</code></td>
                        <td><code>EventListener</code></td>
                        <td>Fired when the alert has been fully Closed (after the transition is complete).</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's alert classes based on the provided props:</p>
        <ul>
            <li><code>alert</code> - Always applied as the base class</li>
            <li><code>&#123;variant&#125;</code> - Applied based on the variant prop</li>
            <li><code>alert-dismissible</code> - Applied when isDismissible is true</li>
            <li><code>fade</code> - Applied when isAnimated is true</li>
            <li><code>show</code> - Applied when isOpen is true and isAnimated is true</li>
        </ul>
    </section>
</div>

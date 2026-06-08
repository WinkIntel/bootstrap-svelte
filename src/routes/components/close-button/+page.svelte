<script lang="ts">
    import { CloseButton } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import CloseButtonPlayground from './CloseButtonPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<CloseButton />`;
    const darkModeExampleCode = `<div class="bg-dark p-3 w-100" data-bs-theme="dark">
  <CloseButton />
  <CloseButton disabled />
</div>`;
    const _sizesExampleCode = `<CloseButton size="sm" />
<CloseButton />
<CloseButton size="lg" />`;
    const disabledExampleCode = `<CloseButton disabled />`;
    const ariaLabelExampleCode = `<CloseButton aria-label="Dismiss notification" />`;
</script>

<div>
    <div class="mb-5">
        <h1>Close Button</h1>
        <p class="lead">Bootstrap's close button component built with Svelte 5. Use it to dismiss components like alerts, modals, and toasts.</p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the CloseButton component by adjusting the props below:</p>
        <CloseButtonPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <CloseButton id="baseCloseButton" />
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- White variant section -->
    <section class="mb-5" id="white-variant">
        <h2 class="wk-quick-link">Dark Variant</h2>
        <p>This uses the filter property to invert the background-image without overriding its value.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 bg-dark p-3 d-inline-block w-100" data-bs-theme="dark">
                    <CloseButton id="darkModeCloseButton" />
                    <CloseButton id="darkModeDisabledCloseButton" disabled />
                </div>
                <SyntaxHighlighter code={darkModeExampleCode} />
            </div>
        </div>
    </section>

    <!-- Disabled state -->
    <section class="mb-5" id="disabled">
        <h2 class="wk-quick-link">Disabled State</h2>
        <p>
            Make close buttons look inactive by adding the <code>disabled</code> prop.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <CloseButton id="disabledCloseButton" disabled />
                </div>

                <SyntaxHighlighter code={disabledExampleCode} />
            </div>
        </div>
    </section>

    <!-- Aria Label section -->
    <section class="mb-5" id="aria-label">
        <h2 class="wk-quick-link">Accessibility</h2>
        <p>
            Close buttons have a default <code>aria-label</code> of "Close" for screen readers. You can customize this with the <code>ariaLabel</code>
            prop.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <CloseButton id="ariaLabelCloseButton" ariaLabel="Dismiss notification" />
                </div>

                <SyntaxHighlighter code={ariaLabelExampleCode} />
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
                        <td><code>ariaLabel</code></td>
                        <td><code>string</code></td>
                        <td><code>'Close'</code></td>
                        <td>Sets the aria-label attribute for screen readers</td>
                    </tr>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td><code>undefined</code></td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>disabled</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Makes the button appear inactive and prevents interactions</td>
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
        <p>The component applies Bootstrap's close button classes based on the provided props:</p>
        <ul>
            <li><code>btn-close</code> - Always applied as the base class</li>
        </ul>
    </section>
</div>

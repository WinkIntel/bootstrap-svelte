<script lang="ts">
    import { Button, Spinner } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import ButtonPlayground from './ButtonPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Button>Base button</Button>`;
    const colorVariantExampleCode = `<Button colorVariant="primary">Primary</Button>
<Button colorVariant="secondary">Secondary</Button>
<Button colorVariant="success">Success</Button>
<Button colorVariant="danger">Danger</Button>
<Button colorVariant="warning">Warning</Button>
<Button colorVariant="info">Info</Button>
<Button colorVariant="light">Light</Button>
<Button colorVariant="dark">Dark</Button>
<Button colorVariant="link">Link</Button>`;
    const sizeExampleCode = `<Button size="lg" colorVariant="primary">Large Button</Button>
<Button colorVariant="primary">Default Button</Button>
<Button size="sm" colorVariant="primary">Small Button</Button>`;
    const disabledExampleCode = `<Button colorVariant="primary" disabled>Primary</Button>
<Button colorVariant="secondary" disabled>Secondary</Button>
<Button colorVariant="success" disabled>Success</Button>
<Button colorVariant="danger" disabled>Danger</Button>
<Button colorVariant="warning" disabled>Warning</Button>
<Button colorVariant="info" disabled>Info</Button>
<Button colorVariant="light" disabled>Light</Button>
<Button colorVariant="dark" disabled>Dark</Button>
<Button colorVariant="link" disabled>Link</Button>`;
    const outlineExampleCode = `<Button colorVariant="outline-primary">Primary</Button>
<Button colorVariant="outline-secondary">Secondary</Button>
<Button colorVariant="outline-success">Success</Button>
<Button colorVariant="outline-danger">Danger</Button>
<Button colorVariant="outline-warning">Warning</Button>
<Button colorVariant="outline-info">Info</Button>
<Button colorVariant="outline-light">Light</Button>
<Button colorVariant="outline-dark">Dark</Button>`;

    let isSubmitting: boolean = $state(false);
</script>

<div>
    <div class="mb-5">
        <h1>Button</h1>
        <p class="lead">Bootstrap's button component built with Svelte 5. Use it for actions in forms, dialogs, and more.</p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Button component by adjusting the props below:</p>
        <ButtonPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Button id="baseButton">Base button</Button>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Variants section -->
    <section class="mb-5" id="variants">
        <h2 class="wk-quick-link">Button Color Variants</h2>
        <p>Bootstrap includes several predefined button styles, each serving its own semantic purpose.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Button id="variantPrimary" colorVariant="primary">Primary</Button>
                    <Button id="variantSecondary" colorVariant="secondary">Secondary</Button>
                    <Button id="variantSuccess" colorVariant="success">Success</Button>
                    <Button id="variantDanger" colorVariant="danger">Danger</Button>
                    <Button id="variantWarning" colorVariant="warning">Warning</Button>
                    <Button id="variantInfo" colorVariant="info">Info</Button>
                    <Button id="variantLight" colorVariant="light">Light</Button>
                    <Button id="variantDark" colorVariant="dark">Dark</Button>
                    <Button id="variantLink" colorVariant="link">Link</Button>
                </div>

                <SyntaxHighlighter code={colorVariantExampleCode} />
            </div>
        </div>
    </section>

    <!-- Sizes section -->
    <section class="mb-5" id="sizes">
        <h2 class="wk-quick-link">Sizing</h2>
        <p>
            Create larger or smaller buttons with the <code>size</code> prop.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap align-items-center gap-2">
                    <Button id="sizeLargePrimary" size="lg" colorVariant="primary">Large Button</Button>
                    <Button id="sizeDefaultPrimary" colorVariant="primary">Default Button</Button>
                    <Button id="sizeSmallPrimary" size="sm" colorVariant="primary">Small Button</Button>
                </div>

                <SyntaxHighlighter code={sizeExampleCode} />
            </div>
        </div>
    </section>

    <!-- Disabled state -->
    <section class="mb-5" id="disabled">
        <h2 class="wk-quick-link">Disabled State</h2>
        <p>
            Make buttons look inactive by adding the <code>disabled</code> prop.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Button id="disabledPrimary" colorVariant="primary" disabled>Primary</Button>
                    <Button id="disabledSecondary" colorVariant="secondary" disabled>Secondary</Button>
                    <Button id="disabledSuccess" colorVariant="success" disabled>Success</Button>
                    <Button id="disabledDanger" colorVariant="danger" disabled>Danger</Button>
                    <Button id="disabledWarning" colorVariant="warning" disabled>Warning</Button>
                    <Button id="disabledInfo" colorVariant="info" disabled>Info</Button>
                    <Button id="disabledLight" colorVariant="light" disabled>Light</Button>
                    <Button id="disabledDark" colorVariant="dark" disabled>Dark</Button>
                    <Button id="disabledLink" colorVariant="link" disabled>Link</Button>
                </div>

                <SyntaxHighlighter code={disabledExampleCode} />
            </div>
        </div>
    </section>

    <!-- Outline buttons -->
    <section class="mb-5" id="outline">
        <h2 class="wk-quick-link">Outline Buttons</h2>
        <p>
            Create outline buttons with <code>colorVariant="outline-*"</code>. The warning, info, and light examples use docs-only contrast treatment
            so their text remains readable on a white preview surface.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Button id="outlinePrimary" colorVariant="outline-primary">Primary</Button>
                    <Button id="outlineSecondary" colorVariant="outline-secondary">Secondary</Button>
                    <Button id="outlineSuccess" colorVariant="outline-success">Success</Button>
                    <Button id="outlineDanger" colorVariant="outline-danger">Danger</Button>
                    <Button id="outlineWarning" class="wk-outline-warning-demo" colorVariant="outline-warning">Warning</Button>
                    <Button id="outlineInfo" class="wk-outline-info-demo" colorVariant="outline-info">Info</Button>
                    <Button id="outlineLight" class="wk-outline-light-demo" colorVariant="outline-light">Light</Button>
                    <Button id="outlineDark" colorVariant="outline-dark">Dark</Button>
                </div>

                <SyntaxHighlighter code={outlineExampleCode} />
            </div>
        </div>
    </section>

    <!-- With Spinner -->
    <section class="mb-5" id="spinner">
        <h2 class="wk-quick-link">Using with the Spinner component</h2>
        <p>Use a Spinner inside a button to indicate loading state. The Spinner will automatically adjust its size based on the button size.</p>
        <p>⚠️ Note: This will not work for <code>&lt;input /&gt;</code> buttons.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <Button colorVariant="primary" type="submit" disabled={isSubmitting} onclick={() => (isSubmitting = true)}>
                        {#if isSubmitting}
                            <Spinner size="sm"><span class="visually-hidden">Subscribing...</span></Spinner>
                            Submitting...
                        {:else}
                            Submit
                        {/if}
                    </Button>
                    {#if isSubmitting}
                        <Button colorVariant="outline-secondary" type="reset" onclick={() => (isSubmitting = false)}>Reset</Button>
                    {/if}
                </div>

                <SyntaxHighlighter
                    code={`<script lang="ts">
    let isSubmitting: boolean = $state(false);
\u003c/script>
<Button colorVariant="primary" type="submit" disabled={isSubmitting} onclick={() => (isSubmitting = true)}>
    {#if isSubmitting}
        <Spinner size="sm"><span class="visually-hidden">Subscribing...</span></Spinner>
        Submitting...
    {:else}
        Submit
    {/if}
</Button>
{#if isSubmitting}
    <Button colorVariant="outline-secondary" type="reset" onclick={() => (isSubmitting = false)}>Reset</Button>
{/if}`} />
            </div>
        </div>
    </section>

    <section class="mb-5" id="accessibility">
        <h2 class="wk-quick-link">Accessibility</h2>
        <ul>
            <li>Use clear action text; avoid icon-only buttons unless you provide an accessible label.</li>
            <li>
                Set <code>type="button"</code>, <code>type="submit"</code>, or <code>type="reset"</code> intentionally when buttons live inside forms.
            </li>
            <li>Check contrast when using Bootstrap outline warning, info, and light variants on light backgrounds.</li>
            <li>For loading states, keep the button text meaningful and include visually hidden text for spinner-only indicators.</li>
        </ul>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Props</h3>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div class="table-responsive" tabindex="0" role="region" aria-label="Button props API table">
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
                    <tr>
                        <td><code>href</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>If specified, button will be rendered as an anchor tag</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Unique identifier for the button. If not specified, it will be auto-generated.</td>
                    </tr>
                    <tr>
                        <td><code>size</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td> Sets the button size. Values: 'sm', 'lg' </td>
                    </tr>
                    <tr>
                        <td><code>type</code></td>
                        <td><code>string</code></td>
                        <td><code>'button'</code></td>
                        <td>Button type attribute ('button', 'submit', 'reset')</td>
                    </tr>
                    <tr>
                        <td><code>value</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>If specified, button will be rendered as input element</td>
                    </tr>
                    <tr>
                        <td><code>colorVariant</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>
                            Sets the button's appearance. Values: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
                            'link', 'outline-primary', 'outline-secondary', etc.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's button classes based on the provided props:</p>
        <ul>
            <li><code>btn</code> - Always applied as the base class</li>
            <li><code>btn-&#123;variant&#125;</code> - Applied based on the variant prop</li>
            <li><code>btn-&#123;size&#125;</code> - Applied based on the size prop</li>
            <li><code>disabled</code> - Applied for anchor buttons when disabled</li>
        </ul>
    </section>
</div>

<style>
    :global(.wk-outline-warning-demo.btn-outline-warning) {
        --bs-btn-color: #664d03;
    }

    :global(.wk-outline-info-demo.btn-outline-info) {
        --bs-btn-color: #055160;
    }

    :global(.wk-outline-light-demo.btn-outline-light) {
        --bs-btn-border-color: #6c757d;
        --bs-btn-color: #495057;
    }
</style>

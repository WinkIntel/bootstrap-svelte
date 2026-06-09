<script lang="ts">
    import { Spinner } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import SpinnerPlayground from './SpinnerPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Spinner>
  <span class="visually-hidden">Loading...</span>
</Spinner>`;
    const colorExampleCode = `<Spinner colorVariant="primary">
  <span class="visually-hidden">Loading primary...</span>
</Spinner>
<Spinner colorVariant="secondary">
  <span class="visually-hidden">Loading secondary...</span>
</Spinner>
<Spinner colorVariant="success">
  <span class="visually-hidden">Loading success...</span>
</Spinner>
<Spinner colorVariant="danger">
  <span class="visually-hidden">Loading danger...</span>
</Spinner>
<Spinner colorVariant="warning">
  <span class="visually-hidden">Loading warning...</span>
</Spinner>
<Spinner colorVariant="info">
  <span class="visually-hidden">Loading info...</span>
</Spinner>
<Spinner colorVariant="light">
  <span class="visually-hidden">Loading light...</span>
</Spinner>
<Spinner colorVariant="dark">
  <span class="visually-hidden">Loading dark...</span>
</Spinner>`;
    const growingSpinnerCode = `<Spinner type="grow">
  <span class="visually-hidden">Loading...</span>
</Spinner>`;
    const growingColorCode = `<Spinner type="grow" colorVariant="primary">
  <span class="visually-hidden">Loading primary...</span>
</Spinner>
<Spinner type="grow" colorVariant="secondary">
  <span class="visually-hidden">Loading secondary...</span>
</Spinner>
<Spinner type="grow" colorVariant="success">
  <span class="visually-hidden">Loading success...</span>
</Spinner>
<Spinner type="grow" colorVariant="danger">
  <span class="visually-hidden">Loading danger...</span>
</Spinner>
<Spinner type="grow" colorVariant="warning">
  <span class="visually-hidden">Loading warning...</span>
</Spinner>
<Spinner type="grow" colorVariant="info">
  <span class="visually-hidden">Loading info...</span>
</Spinner>
<Spinner type="grow" colorVariant="light">
  <span class="visually-hidden">Loading light...</span>
</Spinner>
<Spinner type="grow" colorVariant="dark">
  <span class="visually-hidden">Loading dark...</span>
</Spinner>`;
    const sizeExampleCode = `<Spinner size="sm">
  <span class="visually-hidden">Loading...</span>
</Spinner>
<Spinner>
  <span class="visually-hidden">Loading...</span>
</Spinner>
<Spinner style="width: 3rem; height: 3rem;">
  <span class="visually-hidden">Loading...</span>
</Spinner>`;
    const buttonSpinnerCode = `<button class="btn btn-primary" type="button" disabled>
  <Spinner size="sm" colorVariant="light">
    <span class="visually-hidden">Loading...</span>
  </Spinner>
  Loading...
</button>`;
    const buttonCenteredSpinnerCode = `<button class="btn btn-primary" type="button" disabled>
  <Spinner size="sm" colorVariant="light">
    <span class="visually-hidden">Loading...</span>
  </Spinner>
  <span class="ms-2">Loading...</span>
</button>`;
    const buttonGrowSpinnerCode = `<button class="btn btn-primary" type="button" disabled>
  <Spinner size="sm" type="grow" colorVariant="light">
    <span class="visually-hidden">Loading...</span>
  </Spinner>
  <span class="ms-2">Loading...</span>
</button>`;
</script>

<div>
    <div class="mb-5">
        <h1>Spinner</h1>
        <p class="lead">Bootstrap's spinner component built with Svelte 5. Use it to indicate a loading state in your projects.</p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Spinner component by adjusting the props below:</p>
        <SpinnerPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            Bootstrap's spinners are designed to be used as loading indicators, primarily for asynchronous operations. The default style is a border
            spinner.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Spinner>
                        <span class="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Growing Spinner section -->
    <section class="mb-5" id="growing-spinner">
        <h2 class="wk-quick-link">Growing Spinner</h2>
        <p>
            If you prefer a different style, you can use the growing spinner with the <code>type="grow"</code> prop.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Spinner type="grow">
                        <span class="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
                <SyntaxHighlighter code={growingSpinnerCode} />
            </div>
        </div>
    </section>

    <!-- Color Variants section -->
    <section class="mb-5" id="color-variants">
        <h2 class="wk-quick-link">Color Variants</h2>
        <p>
            Customize the spinner by using the <code>colorVariant</code> prop to match your project's color theme.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-3">
                    <Spinner colorVariant="primary">
                        <span class="visually-hidden">Loading primary...</span>
                    </Spinner>
                    <Spinner colorVariant="secondary">
                        <span class="visually-hidden">Loading secondary...</span>
                    </Spinner>
                    <Spinner colorVariant="success">
                        <span class="visually-hidden">Loading success...</span>
                    </Spinner>
                    <Spinner colorVariant="danger">
                        <span class="visually-hidden">Loading danger...</span>
                    </Spinner>
                    <Spinner colorVariant="warning">
                        <span class="visually-hidden">Loading warning...</span>
                    </Spinner>
                    <Spinner colorVariant="info">
                        <span class="visually-hidden">Loading info...</span>
                    </Spinner>
                    <Spinner colorVariant="light">
                        <span class="visually-hidden">Loading light...</span>
                    </Spinner>
                    <Spinner colorVariant="dark">
                        <span class="visually-hidden">Loading dark...</span>
                    </Spinner>
                </div>
                <SyntaxHighlighter code={colorExampleCode} />
            </div>
        </div>
    </section>

    <!-- Growing Color Variants section -->
    <section class="mb-5" id="growing-color-variants">
        <h2 class="wk-quick-link">Growing Color Variants</h2>
        <p>The growing spinner also supports all color variants.</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap gap-3">
                    <Spinner type="grow" colorVariant="primary">
                        <span class="visually-hidden">Loading primary...</span>
                    </Spinner>
                    <Spinner type="grow" colorVariant="secondary">
                        <span class="visually-hidden">Loading secondary...</span>
                    </Spinner>
                    <Spinner type="grow" colorVariant="success">
                        <span class="visually-hidden">Loading success...</span>
                    </Spinner>
                    <Spinner type="grow" colorVariant="danger">
                        <span class="visually-hidden">Loading danger...</span>
                    </Spinner>
                    <Spinner type="grow" colorVariant="warning">
                        <span class="visually-hidden">Loading warning...</span>
                    </Spinner>
                    <Spinner type="grow" colorVariant="info">
                        <span class="visually-hidden">Loading info...</span>
                    </Spinner>
                    <Spinner type="grow" colorVariant="light">
                        <span class="visually-hidden">Loading light...</span>
                    </Spinner>
                    <Spinner type="grow" colorVariant="dark">
                        <span class="visually-hidden">Loading dark...</span>
                    </Spinner>
                </div>
                <SyntaxHighlighter code={growingColorCode} />
            </div>
        </div>
    </section>

    <!-- Placement section -->
    <section class="mb-5" id="placement">
        <h2 class="wk-quick-link">Placement</h2>
        <p>
            You can place the spinner in various locations within your layout. The spinner will automatically adjust its position based on the
            surrounding elements.
        </p>
        <h4>Flex</h4>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <div class="d-flex justify-content-center">
                        <Spinner>
                            <span class="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                </div>
                <SyntaxHighlighter
                    code={`<div class="d-flex justify-content-center">
    <Spinner>
        <span class="visually-hidden">Loading...</span>
    </Spinner>
</div>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <div class="d-flex align-items-center">
                        <strong role="status">Loading...</strong>
                        <Spinner class="ms-auto"></Spinner>
                    </div>
                </div>
                <SyntaxHighlighter
                    code={`<div class="d-flex align-items-center">
    <strong role="status">Loading...</strong>
    <Spinner class="ms-auto"></Spinner>
</div>`} />
            </div>
        </div>
        <h4>Floats</h4>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <div class="clearfix">
                        <Spinner class="float-end">
                            <span class="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                </div>
                <SyntaxHighlighter
                    code={`<div class="clearfix">
    <Spinner class="float-end">
        <span class="visually-hidden">Loading...</span>
    </Spinner>
</div>`} />
            </div>
        </div>
        <h4>Text align</h4>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <div class="text-center">
                        <Spinner>
                            <span class="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                </div>
                <SyntaxHighlighter
                    code={`<div class="text-center">
    <Spinner>
        <span class="visually-hidden">Loading...</span>
    </Spinner>
</div>`} />
            </div>
        </div>
    </section>

    <!-- Sizing section -->
    <section class="mb-5" id="sizing">
        <h2 class="wk-quick-link">Sizing</h2>
        <p>
            You can use the <code>size</code> prop to make the spinner smaller. By default, the spinner uses the standard size. Set
            <code>size="sm"</code> for the small variant.
        </p>
        <p>Or, use custom CSS or inline styles to change the dimensions as needed.</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-wrap align-items-center gap-3">
                    <Spinner size="sm">
                        <span class="visually-hidden">Loading...</span>
                    </Spinner>
                    <Spinner>
                        <span class="visually-hidden">Loading...</span>
                    </Spinner>
                    <Spinner style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
                <SyntaxHighlighter code={sizeExampleCode} />
            </div>
        </div>
    </section>

    <!-- Button Spinners section -->
    <section class="mb-5" id="button-spinners">
        <h2 class="wk-quick-link">Button Spinners</h2>
        <p>Spinners can be used inside buttons to indicate an action is currently processing or taking place.</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <button class="btn btn-primary" type="button" disabled>
                        <Spinner size="sm" colorVariant="light">
                            <span class="visually-hidden">Loading...</span>
                        </Spinner>
                        Loading...
                    </button>
                </div>
                <SyntaxHighlighter code={buttonSpinnerCode} />
            </div>
        </div>

        <h3 class="mt-4 h5">Centered Button Spinner</h3>
        <p>You can also center the spinner in a button and add margin for better alignment:</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <button class="btn btn-primary" type="button" disabled>
                        <Spinner size="sm" colorVariant="light">
                            <span class="visually-hidden">Loading...</span>
                        </Spinner>
                        <span class="ms-2">Loading...</span>
                    </button>
                </div>
                <SyntaxHighlighter code={buttonCenteredSpinnerCode} />
            </div>
        </div>

        <h3 class="mt-4 h5">Growing Button Spinner</h3>
        <p>You can also use the growing spinner inside buttons:</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <button class="btn btn-primary" type="button" disabled>
                        <Spinner size="sm" type="grow" colorVariant="light">
                            <span class="visually-hidden">Loading...</span>
                        </Spinner>
                        <span class="ms-2">Loading...</span>
                    </button>
                </div>
                <SyntaxHighlighter code={buttonGrowSpinnerCode} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

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
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Unique identifier for the spinner. If not specified, it will be auto-generated.</td>
                    </tr>
                    <tr>
                        <td><code>size</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Sets the spinner size. Values: 'sm'</td>
                    </tr>
                    <tr>
                        <td><code>type</code></td>
                        <td><code>string</code></td>
                        <td><code>'border'</code></td>
                        <td>Spinner type. Values: 'border', 'grow'</td>
                    </tr>
                    <tr>
                        <td><code>colorVariant</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td> Sets the spinner's color. Values: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark' </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Accessibility</h3>
        <p>
            For improved accessibility, it's important to include screen reader text within the spinner to indicate its purpose. This can be done by
            adding a <code>&lt;span class="visually-hidden"&gt;Loading...&lt;/span&gt;</code> inside the Spinner component.
        </p>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's spinner classes based on the provided props:</p>
        <ul>
            <li><code>spinner-border</code> or <code>spinner-grow</code> - Applied as the base class depending on type</li>
            <li><code>spinner-border-sm</code> or <code>spinner-grow-sm</code> - Applied when size="sm"</li>
            <li><code>text-&#123;variant&#125;</code> - Applied based on the variant prop</li>
        </ul>
    </section>
</div>

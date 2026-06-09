<script lang="ts">
    import { Container } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import ContainerPlayground from './ContainerPlayground.svelte';

    // Sample code examples for documentation
    const basicExampleCode = `<Container>
  <p>This is content inside the default container.</p>
</Container>`;

    const fluidExampleCode = `<Container isFluid={true}>
  <p>This container is fluid and spans the full width of the viewport.</p>
</Container>`;

    const breakpointExampleCode = `<!-- Extra small (up to 575px) - full width, no gutters -->
<Container breakpoint="sm">
  <!-- Small (576px and up) - max-width: 540px -->
</Container>

<Container breakpoint="md">
  <!-- Medium (768px and up) - max-width: 720px -->
</Container>

<Container breakpoint="lg">
  <!-- Large (992px and up) - max-width: 960px -->
</Container>

<Container breakpoint="xl">
  <!-- Extra large (1200px and up) - max-width: 1140px -->
</Container>

<Container breakpoint="xxl">
  <!-- Extra extra large (1400px and up) - max-width: 1320px -->
</Container>`;

    const responsiveExampleCode = `<Container>
  <div class="row">
    <div class="col-sm-8">col-sm-8</div>
    <div class="col-sm-4">col-sm-4</div>
  </div>
  <div class="row">
    <div class="col-sm">col-sm</div>
    <div class="col-sm">col-sm</div>
    <div class="col-sm">col-sm</div>
  </div>
</Container>`;
</script>

<div>
    <div class="mb-5">
        <h1>Container</h1>
        <p class="lead">
            Bootstrap's basic container component built with Svelte 5. Containers are used to contain, pad, and center content within a given
            viewport.
        </p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Container component by adjusting the props below:</p>
        <ContainerPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            Containers are the most basic layout element in Bootstrap and are required when using the grid system. Choose from a responsive
            fixed-width container or a fluid-width container.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="p-3 border bg-light">
                    <Container id="basicContainer" class="p-3 border border-primary border-opacity-25 bg-primary bg-opacity-10">
                        <p class="mb-0">This is content inside the default container.</p>
                    </Container>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Fluid Container section -->
    <section class="mb-5" id="fluid-container">
        <h2 class="wk-quick-link">Fluid Container</h2>
        <p>
            Use <code>isFluid={'{'}true}</code> to create a full-width container that spans the entire width of the viewport.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="p-3 border bg-light">
                    <Container id="fluidContainer" isFluid={true} class="p-3 border border-primary border-opacity-25 bg-primary bg-opacity-10">
                        <p class="mb-0">This container is fluid and spans the full width of the viewport.</p>
                    </Container>
                </div>
                <SyntaxHighlighter code={fluidExampleCode} />
            </div>
        </div>
    </section>

    <!-- Responsive Containers section -->
    <section class="mb-5" id="responsive-containers">
        <h2 class="wk-quick-link">Responsive Containers</h2>
        <p>
            Responsive containers allow you to specify a container that is 100% wide until a specified breakpoint is reached, after which a max-width
            is applied for each of the higher breakpoints. Use the <code>breakpoint</code> prop to set the breakpoint.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="p-3 border bg-light mb-3">
                    <Container id="smContainer" breakpoint="sm" class="p-3 mb-3 border border-primary border-opacity-25 bg-primary bg-opacity-10">
                        <p class="mb-0 text-center"><code>container-sm</code> (100% wide until small breakpoint - 576px)</p>
                    </Container>

                    <Container id="mdContainer" breakpoint="md" class="p-3 mb-3 border border-success border-opacity-25 bg-success bg-opacity-10">
                        <p class="mb-0 text-center"><code>container-md</code> (100% wide until medium breakpoint - 768px)</p>
                    </Container>

                    <Container id="lgContainer" breakpoint="lg" class="p-3 mb-3 border border-info border-opacity-25 bg-info bg-opacity-10">
                        <p class="mb-0 text-center"><code>container-lg</code> (100% wide until large breakpoint - 992px)</p>
                    </Container>

                    <Container id="xlContainer" breakpoint="xl" class="p-3 mb-3 border border-warning border-opacity-25 bg-warning bg-opacity-10">
                        <p class="mb-0 text-center"><code>container-xl</code> (100% wide until extra large breakpoint - 1200px)</p>
                    </Container>

                    <Container id="xxlContainer" breakpoint="xxl" class="p-3 border border-danger border-opacity-25 bg-danger bg-opacity-10">
                        <p class="mb-0 text-center"><code>container-xxl</code> (100% wide until extra extra large breakpoint - 1400px)</p>
                    </Container>
                </div>
                <SyntaxHighlighter code={breakpointExampleCode} />
            </div>
        </div>
    </section>

    <!-- Container with Grid section -->
    <section class="mb-5" id="container-with-grid">
        <h2 class="wk-quick-link">Container with Grid</h2>
        <p>Containers are the foundation of Bootstrap's grid system. Here's an example of using a container with Bootstrap's grid system:</p>

        <div class="card">
            <div class="card-body">
                <div class="p-3 border bg-light">
                    <Container id="gridContainer" class="p-3 border border-primary border-opacity-25 bg-primary bg-opacity-10">
                        <div class="row mb-3">
                            <div class="col-sm-8 p-2 border border-primary border-opacity-25 bg-primary bg-opacity-10">col-sm-8</div>
                            <div class="col-sm-4 p-2 border border-primary border-opacity-25 bg-primary bg-opacity-10">col-sm-4</div>
                        </div>
                        <div class="row">
                            <div class="col-sm p-2 border border-primary border-opacity-25 bg-primary bg-opacity-10">col-sm</div>
                            <div class="col-sm p-2 border border-primary border-opacity-25 bg-primary bg-opacity-10">col-sm</div>
                            <div class="col-sm p-2 border border-primary border-opacity-25 bg-primary bg-opacity-10">col-sm</div>
                        </div>
                    </Container>
                </div>
                <SyntaxHighlighter code={responsiveExampleCode} />
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
                        <td><code>breakpoint</code></td>
                        <td><code>string</code></td>
                        <td><code>undefined</code></td>
                        <td>
                            Sets the breakpoint at which the container becomes responsive. Values: 'sm', 'md', 'lg', 'xl', 'xxl'. When undefined, uses
                            the default 'container' class.
                        </td>
                    </tr>
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
                        <td><code>isFluid</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Makes the container full-width spanning the entire viewport width</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's container classes based on the provided props:</p>
        <ul>
            <li><code>container</code> - Applied when breakpoint is not provided and isFluid is false</li>
            <li><code>container-fluid</code> - Applied when isFluid is true</li>
            <li>
                <code>container-{'{'}breakpoint}</code> - Applied based on the breakpoint prop (sm, md, lg, xl, xxl)
            </li>
        </ul>
    </section>
</div>

<style>
</style>

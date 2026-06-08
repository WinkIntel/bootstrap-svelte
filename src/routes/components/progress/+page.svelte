<script lang="ts">
    import { ProgressBar, ProgressStacked } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import ProgressPlayground from './ProgressPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<ProgressBar valueNow={25} />`;

    const heightsExampleCode = `<ProgressBar valueNow={25} style="height: 1px;" />
<ProgressBar valueNow={25} style="height: 20px;" />`;

    const labelsExampleCode = `<ProgressBar valueNow={25}>
  25%
</ProgressBar>`;

    const backgroundsExampleCode = `<ProgressBar valueNow={25} backgroundColorVariant="success" />
<ProgressBar valueNow={50} backgroundColorVariant="info" />
<ProgressBar valueNow={75} backgroundColorVariant="warning" />
<ProgressBar valueNow={100} backgroundColorVariant="danger" />`;

    const backgroundsWithLabelsCode = `<ProgressBar valueNow={25} backgroundColorVariant="success">25%</ProgressBar>
<ProgressBar valueNow={50} backgroundColorVariant="info">50%</ProgressBar>
<ProgressBar valueNow={75} backgroundColorVariant="warning">75%</ProgressBar>
<ProgressBar valueNow={100} backgroundColorVariant="danger">100%</ProgressBar>`;

    const multipleProgressCode = `<ProgressStacked>
  <ProgressBar valueNow={15} />
  <ProgressBar valueNow={30} backgroundColorVariant="success" />
  <ProgressBar valueNow={20} backgroundColorVariant="info" />
</ProgressStacked>`;

    const stripedProgressCode = `<ProgressBar valueNow={10} barProps={{ isStriped: true }} />
<ProgressBar valueNow={25} backgroundColorVariant="success" barProps={{ isStriped: true }} />
<ProgressBar valueNow={50} backgroundColorVariant="info" barProps={{ isStriped: true }} />
<ProgressBar valueNow={75} backgroundColorVariant="warning" barProps={{ isStriped: true }} />
<ProgressBar valueNow={100} backgroundColorVariant="danger" barProps={{ isStriped: true }} />`;

    const animatedStripedCode = `<ProgressBar
  valueNow={75}
  barProps={{ isStriped: true, isAnimated: true }}
/>`;
</script>

<div>
    <div class="mb-5">
        <h1>Progress</h1>
        <p class="lead">
            Bootstrap's progress component built with Svelte 5. Use it to display progress indicators with support for stacked bars, animated
            backgrounds, and text labels.
        </p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Progress component by adjusting the props below:</p>
        <ProgressPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            Progress components are built with two HTML elements, some CSS to set the width, and a few attributes. The component is fully accessible
            with the proper ARIA attributes.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ProgressBar valueNow={25} />
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Bar Sizing section -->
    <section class="mb-5" id="bar-sizing">
        <h2 class="wk-quick-link">Bar Sizing</h2>
        <h3 class="h5">Height</h3>
        <p>
            You can specify a custom height for the progress bar by setting the <code>style</code> property. The inner progress bar will automatically resize
            accordingly.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ProgressBar valueNow={25} style="height: 1px;" />
                    <div class="mt-4">
                        <ProgressBar valueNow={25} style="height: 20px;" />
                    </div>
                </div>
                <SyntaxHighlighter code={heightsExampleCode} />
            </div>
        </div>
    </section>

    <!-- Labels section -->
    <section class="mb-5" id="labels">
        <h2 class="wk-quick-link">Labels</h2>
        <p>
            Add labels to your progress bars by placing text within the <code>ProgressBar</code> component.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ProgressBar valueNow={25}>25%</ProgressBar>
                </div>
                <SyntaxHighlighter code={labelsExampleCode} />
            </div>
        </div>
    </section>

    <!-- Backgrounds section -->
    <section class="mb-5" id="backgrounds">
        <h2 class="wk-quick-link">Backgrounds</h2>
        <p>
            Use <code>backgroundColorVariant</code> property to change the appearance of individual progress bars.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ProgressBar valueNow={25} backgroundColorVariant="success" />
                    <div class="mt-2">
                        <ProgressBar valueNow={50} backgroundColorVariant="info" />
                    </div>
                    <div class="mt-2">
                        <ProgressBar valueNow={75} backgroundColorVariant="warning" />
                    </div>
                    <div class="mt-2">
                        <ProgressBar valueNow={100} backgroundColorVariant="danger" />
                    </div>
                </div>
                <SyntaxHighlighter code={backgroundsExampleCode} />
            </div>
        </div>

        <p class="mt-4">
            For progress bars with a custom background color and labels, the component will automatically adjust the text color to ensure sufficient
            contrast.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ProgressBar valueNow={25} backgroundColorVariant="success">25%</ProgressBar>
                    <div class="mt-2">
                        <ProgressBar valueNow={50} backgroundColorVariant="info">50%</ProgressBar>
                    </div>
                    <div class="mt-2">
                        <ProgressBar valueNow={75} backgroundColorVariant="warning">75%</ProgressBar>
                    </div>
                    <div class="mt-2">
                        <ProgressBar valueNow={100} backgroundColorVariant="danger">100%</ProgressBar>
                    </div>
                </div>
                <SyntaxHighlighter code={backgroundsWithLabelsCode} />
            </div>
        </div>
    </section>

    <!-- Multiple bars section -->
    <section class="mb-5" id="multiple-bars">
        <h2 class="wk-quick-link">Multiple Bars</h2>
        <p>
            You can include multiple progress components inside a <code>ProgressStacked</code> container to create a single stacked progress bar.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ProgressStacked>
                        <ProgressBar valueNow={15} />
                        <ProgressBar valueNow={30} backgroundColorVariant="success" />
                        <ProgressBar valueNow={20} backgroundColorVariant="info" />
                    </ProgressStacked>
                </div>
                <SyntaxHighlighter code={multipleProgressCode} />
            </div>
        </div>
    </section>

    <!-- Striped section -->
    <section class="mb-5" id="striped">
        <h2 class="wk-quick-link">Striped</h2>
        <p>
            Add <code>{'barProps={{ isStriped: true }}'}</code> to apply a stripe via CSS gradient over the progress bar's background color.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ProgressBar valueNow={10} barProps={{ isStriped: true }} />
                    <div class="mt-2">
                        <ProgressBar valueNow={25} backgroundColorVariant="success" barProps={{ isStriped: true }} />
                    </div>
                    <div class="mt-2">
                        <ProgressBar valueNow={50} backgroundColorVariant="info" barProps={{ isStriped: true }} />
                    </div>
                    <div class="mt-2">
                        <ProgressBar valueNow={75} backgroundColorVariant="warning" barProps={{ isStriped: true }} />
                    </div>
                    <div class="mt-2">
                        <ProgressBar valueNow={100} backgroundColorVariant="danger" barProps={{ isStriped: true }} />
                    </div>
                </div>
                <SyntaxHighlighter code={stripedProgressCode} />
            </div>
        </div>
    </section>

    <!-- Animated stripes section -->
    <section class="mb-5" id="animated-stripes">
        <h2 class="wk-quick-link">Animated Stripes</h2>
        <p>
            The striped gradient can also be animated. Add <code>barProps=&#123;&#123; isStriped: true, isAnimated: true &#125;&#125;</code>
            to animate the stripes right to left via CSS3 animations.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ProgressBar
                        valueNow={75}
                        barProps={{
                            isStriped: true,
                            isAnimated: true
                        }} />
                </div>
                <SyntaxHighlighter code={animatedStripedCode} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">ProgressBar Props</h3>
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
                        <td><code>'Progress Bar'</code></td>
                        <td>Accessible label for screen readers describing the progress bar.</td>
                    </tr>
                    <tr>
                        <td><code>backgroundColorVariant</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>
                            Bootstrap color variant for the progress bar. Values: 'primary', 'secondary', 'success', 'danger', 'warning', 'info',
                            'light', 'dark'.
                        </td>
                    </tr>
                    <tr>
                        <td><code>barProps</code></td>
                        <td><code>object</code></td>
                        <td><code>&#123;&#125;</code></td>
                        <td>Additional props to pass to the inner progress bar element.</td>
                    </tr>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Additional CSS classes to apply to the component.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLDivElement</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element.</td>
                    </tr>
                    <tr>
                        <td><code>style</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Inline styles to apply to the progress container.</td>
                    </tr>
                    <tr>
                        <td><code>valueMax</code></td>
                        <td><code>number</code></td>
                        <td><code>100</code></td>
                        <td>Maximum value for the progress bar.</td>
                    </tr>
                    <tr>
                        <td><code>valueMin</code></td>
                        <td><code>number</code></td>
                        <td><code>0</code></td>
                        <td>Minimum value for the progress bar.</td>
                    </tr>
                    <tr>
                        <td><code>valueNow</code></td>
                        <td><code>number</code></td>
                        <td><code>0</code></td>
                        <td>Current progress value, used to calculate the percentage completion.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">barProps Object</h3>
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
                        <td><code>isStriped</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Apply a striped pattern to the progress bar.</td>
                    </tr>
                    <tr>
                        <td><code>isAnimated</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Apply an animated effect to the striped progress bar. Only works when <code>isStriped</code> is true.</td>
                    </tr>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Additional CSS classes to apply to the inner progress bar element.</td>
                    </tr>
                    <tr>
                        <td><code>style</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>Inline styles to apply to the inner progress bar element.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">ProgressStacked Props</h3>
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
                        <td>—</td>
                        <td>Additional CSS classes to apply to the stacked progress container.</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLDivElement</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The components apply Bootstrap's progress classes based on the provided props:</p>
        <ul>
            <li><code>progress</code> - Base container class for the progress component</li>
            <li><code>progress-bar</code> - Applied to the inner progress bar element</li>
            <li><code>progress-stacked</code> - Applied to the container when using multiple progress bars</li>
            <li><code>bg-&#123;variant&#125;</code> - Applied based on the backgroundColorVariant prop</li>
            <li><code>progress-bar-striped</code> - Applied when barProps.isStriped is true</li>
            <li><code>progress-bar-animated</code> - Applied when barProps.isAnimated is true</li>
        </ul>

        <h3 class="h5 mt-4">Accessibility</h3>
        <p>
            The progress component follows WAI-ARIA patterns for progress indicators, including the proper
            <code>role="progressbar"</code> and ARIA attributes (<code>aria-valuenow</code>,
            <code>aria-valuemin</code>, <code>aria-valuemax</code>, and <code>aria-label</code>).
        </p>
    </section>
</div>

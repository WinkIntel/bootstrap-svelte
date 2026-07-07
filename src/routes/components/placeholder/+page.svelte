<script lang="ts">
    import { Placeholder } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import PlaceholderPlayground from './PlaceholderPlayground.svelte';

    // Sample code examples for demonstration
    const widthExampleCode = `<p>
    <Placeholder.Item class="col-6" />
</p>
<p>
    <Placeholder.Item class="w-75" />
</p>
<p>
    <Placeholder.Item style="width: 25%;" />
</p>`;

    const colorExampleCode = `<p>
    <Placeholder.Item class="col-12" colorVariant="primary" />
</p>
<p>
    <Placeholder.Item class="col-12" colorVariant="secondary" />
</p>
<p>
    <Placeholder.Item class="col-12" colorVariant="success" />
</p>
<p>
    <Placeholder.Item class="col-12" colorVariant="danger" />
</p>
<p>
    <Placeholder.Item class="col-12" colorVariant="warning" />
</p>
<p>
    <Placeholder.Item class="col-12" colorVariant="info" />
</p>
<p>
    <Placeholder.Item class="col-12" colorVariant="light" />
</p>
<p>
    <Placeholder.Item class="col-12" colorVariant="dark" />
</p>`;

    const sizingExampleCode = `<p>
    <Placeholder.Item class="col-12" size="lg" />
</p>
<p>
    <Placeholder.Item class="col-12" />
</p>
<p>
    <Placeholder.Item class="col-12" size="sm" />
</p>
<p>
    <Placeholder.Item class="col-12" size="xs" />
</p>`;

    const animationGlowExampleCode = `<Placeholder.Root type="glow">
    <Placeholder.Item class="col-12" />
</Placeholder.Root>`;

    const animationWaveExampleCode = `<Placeholder.Root type="wave">
    <Placeholder.Item class="col-12" />
</Placeholder.Root>`;

    const cardExampleCode = `<div class="d-flex justify-content-around gap-3">
    <div class="card" style="width: 18rem;">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <button type="button" class="btn btn-primary">Go somewhere</button>
        </div>
    </div>

    <div class="card" style="width: 18rem;" aria-hidden="true">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">
                <Placeholder.Root type="glow">
                    <Placeholder.Item class="col-6" />
                </Placeholder.Root>
            </h5>
            <p class="card-text">
                <Placeholder.Root type="glow">
                    <Placeholder.Item class="col-7" />
                    <Placeholder.Item class="col-4" />
                    <Placeholder.Item class="col-4" />
                    <Placeholder.Item class="col-6" />
                    <Placeholder.Item class="col-8" />
                </Placeholder.Root>
            </p>
            <a class="btn btn-primary disabled placeholder col-6"></a>
        </div>
    </div>
</div>`;
</script>

<div>
    <h1 class="mb-4">Placeholder</h1>

    <p class="lead">Use loading placeholders for your components or pages to indicate something may still be loading.</p>

    <div class="mb-5">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Placeholder component by adjusting the options below:</p>
        <PlaceholderPlayground />
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">About</h2>
            <p>
                Placeholders can be used to enhance the experience of your application. They're built only with HTML and CSS, meaning you don't need
                any JavaScript to create them.
            </p>
            <p>Their appearance, color, and sizing can be easily customized using the provided props or utility classes.</p>
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Example</h2>
            <p>
                In the example below, we take a typical card component and recreate it with placeholders applied to create a "loading card". Size and
                proportions are the same between the two.
            </p>

            <div class="wk-placeholder-example p-4 border rounded">
                <div class="d-flex justify-content-around gap-3">
                    <div class="card" style="width: 18rem;">
                        <img src="https://placehold.co/300x180" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <button type="button" class="btn btn-primary">Go somewhere</button>
                        </div>
                    </div>

                    <div class="card" style="width: 18rem;" aria-hidden="true">
                        <img src="https://placehold.co/300x180" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">
                                <Placeholder.Root type="glow">
                                    <Placeholder.Item class="col-6" />
                                </Placeholder.Root>
                            </h5>
                            <p class="card-text">
                                <Placeholder.Root type="glow">
                                    <Placeholder.Item class="col-7" />
                                    <Placeholder.Item class="col-4" />
                                    <Placeholder.Item class="col-4" />
                                    <Placeholder.Item class="col-6" />
                                    <Placeholder.Item class="col-8" />
                                </Placeholder.Root>
                            </p>
                            <button
                                type="button"
                                class="btn btn-primary disabled placeholder col-6"
                                disabled
                                aria-label="Example button with placeholder"></button>
                        </div>
                    </div>
                </div>
            </div>

            <SyntaxHighlighter code={cardExampleCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">How it works</h2>
            <p>
                Placeholders are created using the <code>Placeholder.Item</code> component. If you desire to use the animation, then use the
                <code>Placeholder.Root</code> component as a container. The width can be set using a grid column class (e.g., <code>col-6</code>),
                width utility class, or inline styles.
            </p>

            <div class="wk-placeholder-example p-4 border rounded">
                <p aria-hidden="true">
                    <Placeholder.Item class="col-6" />
                </p>
                <button type="button" class="btn btn-primary disabled placeholder col-4" disabled aria-label="Example button with placeholder"
                ></button>
            </div>

            <p class="mt-3">
                The <code>aria-hidden="true"</code> attribute and <code>aria-disabled="true"</code> are used to indicate that elements are not interactive
                and should be hidden from screen readers.
            </p>
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Width</h2>
            <p>You can change the width of placeholders using grid column classes, width utilities, or inline styles.</p>

            <div class="wk-placeholder-example p-4 border rounded">
                <p>
                    <Placeholder.Item class="col-6" />
                </p>
                <p>
                    <Placeholder.Item class="w-75" />
                </p>
                <p>
                    <Placeholder.Item style="width: 25%;" />
                </p>
            </div>

            <SyntaxHighlighter code={widthExampleCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Color</h2>
            <p>
                By default, the placeholder uses <code>currentColor</code>. Use the <code>colorVariant</code> prop to change this to contextual colors.
            </p>

            <div class="wk-placeholder-example p-4 border rounded">
                <p>
                    <Placeholder.Item class="col-12" colorVariant="primary" />
                </p>
                <p>
                    <Placeholder.Item class="col-12" colorVariant="secondary" />
                </p>
                <p>
                    <Placeholder.Item class="col-12" colorVariant="success" />
                </p>
                <p>
                    <Placeholder.Item class="col-12" colorVariant="danger" />
                </p>
                <p>
                    <Placeholder.Item class="col-12" colorVariant="warning" />
                </p>
                <p>
                    <Placeholder.Item class="col-12" colorVariant="info" />
                </p>
                <p>
                    <Placeholder.Item class="col-12" colorVariant="light" />
                </p>
                <p>
                    <Placeholder.Item class="col-12" colorVariant="dark" />
                </p>
            </div>

            <SyntaxHighlighter code={colorExampleCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Sizing</h2>
            <p>
                The size of placeholders can be customized by setting the <code>size</code> prop to <code>xs</code>, <code>sm</code>, or
                <code>lg</code>.
            </p>

            <div class="wk-placeholder-example p-4 border rounded">
                <p>
                    <Placeholder.Item class="col-12" size="lg" />
                </p>
                <p>
                    <Placeholder.Item class="col-12" />
                </p>
                <p>
                    <Placeholder.Item class="col-12" size="sm" />
                </p>
                <p>
                    <Placeholder.Item class="col-12" size="xs" />
                </p>
            </div>

            <SyntaxHighlighter code={sizingExampleCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Animation</h2>
            <p>
                Animate placeholders by setting the <code>type</code> prop on <code>Placeholder.Root</code> to either <code>glow</code> (default) or
                <code>wave</code>
                to better convey the perception of something being actively loaded.
            </p>

            <h3 class="h5">Glow</h3>
            <div class="wk-placeholder-example p-4 border rounded">
                <Placeholder.Root type="glow">
                    <Placeholder.Item class="col-12" />
                </Placeholder.Root>
            </div>
            <SyntaxHighlighter code={animationGlowExampleCode} />

            <h3 class="h5 mt-4">Wave</h3>
            <div class="wk-placeholder-example p-4 border rounded">
                <Placeholder.Root type="wave">
                    <Placeholder.Item class="col-12" />
                </Placeholder.Root>
            </div>
            <SyntaxHighlighter code={animationWaveExampleCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="h3" id="api">API Reference</h2>

            <h3 class="h5 mt-4">Placeholder.Root Props</h3>
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
                            <td><code>type</code></td>
                            <td><code>'glow' | 'wave' | undefined</code></td>
                            <td><code>'glow'</code></td>
                            <td>Animation type for the placeholder. Use 'glow' or 'wave' for animated placeholders.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Placeholder.Item Props</h3>
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
                            <td><code>size</code></td>
                            <td><code>'xs' | 'sm' | 'lg' | undefined</code></td>
                            <td>-</td>
                            <td>Size of the placeholder</td>
                        </tr>
                        <tr>
                            <td><code>colorVariant</code></td>
                            <td><code>'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | undefined</code></td>
                            <td>-</td>
                            <td>Contextual color variant for the placeholder</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">CSS Classes</h3>
            <p>The component applies Bootstrap's placeholder classes based on the provided props:</p>
            <ul>
                <li><code>placeholder</code> - Applied to Placeholder.Item</li>
                <li><code>placeholder-&#123;size&#125;</code> - Applied when size prop is set (xs, sm, lg)</li>
                <li><code>placeholder-&#123;variant&#125;</code> - Applied when variant prop is set (primary, secondary, etc.)</li>
                <li><code>placeholder-glow</code> - Applied to Placeholder.Root when type="glow"</li>
                <li><code>placeholder-wave</code> - Applied to Placeholder.Root when type="wave"</li>
                <li><code>col-*</code> - Bootstrap grid column classes can be applied to control width</li>
                <li><code>w-*</code> - Bootstrap width utility classes can be applied to control width</li>
            </ul>
        </div>
    </div>
</div>

<style>
    .wk-placeholder-example {
        background-color: var(--bs-tertiary-bg);
    }
    p {
        margin-bottom: 0.5rem;
    }
</style>

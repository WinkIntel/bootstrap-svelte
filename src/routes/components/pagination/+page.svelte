<script lang="ts">
    import { Pagination } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import PaginationPlayground from './PaginationPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Pagination.Root>
    <Pagination.Item isDisabled={true}>
        <Pagination.Link href="#pagination-demo-link" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item isActive={true}>
        <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </Pagination.Link>
    </Pagination.Item>
</Pagination.Root>`;

    const sizesExampleCode = `<!-- Small pagination -->
<Pagination.Root size="sm">
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item isActive={true}>
        <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
    </Pagination.Item>
</Pagination.Root>

<!-- Default pagination -->
<Pagination.Root>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item isActive={true}>
        <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
    </Pagination.Item>
</Pagination.Root>

<!-- Large pagination -->
<Pagination.Root size="lg">
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item isActive={true}>
        <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
    </Pagination.Item>
</Pagination.Root>`;

    const alignmentExampleCode = `<!-- Default (start) alignment -->
<Pagination.Root>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item isActive={true}>
        <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
    </Pagination.Item>
</Pagination.Root>

<!-- Center alignment -->
<Pagination.Root alignment="center">
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item isActive={true}>
        <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
    </Pagination.Item>
</Pagination.Root>

<!-- End alignment -->
<Pagination.Root alignment="end">
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item isActive={true}>
        <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
    </Pagination.Item>
</Pagination.Root>`;

    const disabledExampleCode = `<Pagination.Root>
    <Pagination.Item isDisabled={true}>
        <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item isActive={true}>
        <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
        <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
    </Pagination.Item>
</Pagination.Root>`;
</script>

<div>
    <div class="mb-5">
        <h1>Pagination</h1>
        <span id="pagination-demo-link" class="visually-hidden">Pagination demo link target</span>
        <p class="lead">Pagination component for indicating a series of related content exists across multiple pages.</p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Pagination component by adjusting the props below:</p>
        <PaginationPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>A simple pagination component consists of pagination items with links, with special styling for the active state and disabled state.</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Pagination.Root>
                        <Pagination.Item isDisabled={true}>
                            <Pagination.Link href="#pagination-demo-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item isActive={true}>
                            <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="#pagination-demo-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </Pagination.Link>
                        </Pagination.Item>
                    </Pagination.Root>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Sizing section -->
    <section class="mb-5" id="sizing">
        <h2 class="wk-quick-link">Sizing</h2>
        <p>
            You can use the <code>size</code> prop to change the size of the pagination component. Available options are <code>"sm"</code> for small,
            <code>"lg"</code> for large, or undefined for the default size.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <div class="mb-3">
                        <small class="text-muted">Small pagination</small>
                        <Pagination.Root size="sm">
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item isActive={true}>
                                <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
                            </Pagination.Item>
                        </Pagination.Root>
                    </div>

                    <div class="mb-3">
                        <small class="text-muted">Default pagination</small>
                        <Pagination.Root>
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item isActive={true}>
                                <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
                            </Pagination.Item>
                        </Pagination.Root>
                    </div>

                    <div class="mb-3">
                        <small class="text-muted">Large pagination</small>
                        <Pagination.Root size="lg">
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item isActive={true}>
                                <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
                            </Pagination.Item>
                        </Pagination.Root>
                    </div>
                </div>

                <SyntaxHighlighter code={sizesExampleCode} />
            </div>
        </div>
    </section>

    <!-- Alignment section -->
    <section class="mb-5" id="alignment">
        <h2 class="wk-quick-link">Alignment</h2>
        <p>
            You can use the <code>alignment</code> prop to change the alignment of the pagination component. Available options are
            <code>"center"</code>,
            <code>"end"</code>, or undefined for the default left alignment.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <div class="mb-3">
                        <small class="text-muted">Default (start) alignment</small>
                        <Pagination.Root>
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item isActive={true}>
                                <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
                            </Pagination.Item>
                        </Pagination.Root>
                    </div>

                    <div class="mb-3">
                        <small class="text-muted">Center alignment</small>
                        <Pagination.Root alignment="center">
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item isActive={true}>
                                <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
                            </Pagination.Item>
                        </Pagination.Root>
                    </div>

                    <div class="mb-3">
                        <small class="text-muted">End alignment</small>
                        <Pagination.Root alignment="end">
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item isActive={true}>
                                <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
                            </Pagination.Item>
                            <Pagination.Item>
                                <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
                            </Pagination.Item>
                        </Pagination.Root>
                    </div>
                </div>

                <SyntaxHighlighter code={alignmentExampleCode} />
            </div>
        </div>
    </section>

    <!-- Disabled State section -->
    <section class="mb-5" id="disabled-state">
        <h2 class="wk-quick-link">Disabled State</h2>
        <p>
            You can disable the entire pagination component by setting the <code>disabled</code> prop to <code>true</code>. You can also disable
            individual pagination items by using the <code>isDisabled</code> prop on the Pagination.Item.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Pagination.Root>
                        <Pagination.Item isDisabled={true}>
                            <Pagination.Link href="#pagination-demo-link">1</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item isActive={true}>
                            <Pagination.Link href="#pagination-demo-link">2</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="#pagination-demo-link">3</Pagination.Link>
                        </Pagination.Item>
                    </Pagination.Root>
                </div>

                <SyntaxHighlighter code={disabledExampleCode} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Pagination.Root Props</h3>
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
                        <td><code>alignment</code></td>
                        <td><code>'start' | 'center' | 'end'</code></td>
                        <td><code>undefined</code> (start)</td>
                        <td>Horizontal alignment of the pagination component.</td>
                    </tr>
                    <tr>
                        <td><code>ariaLabel</code></td>
                        <td><code>string</code></td>
                        <td><code>'pagination'</code></td>
                        <td>ARIA label for the pagination navigation.</td>
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
                        <td>Reference to the DOM element.</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td><code>pagination-{'{'}uid}</code></td>
                        <td>Unique ID for the pagination element.</td>
                    </tr>
                    <tr>
                        <td><code>size</code></td>
                        <td><code>'sm' | 'lg'</code></td>
                        <td><code>undefined</code></td>
                        <td>Size of the pagination component.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Pagination.Item Props</h3>
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
                        <td>Reference to the DOM element.</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td><code>page-item-{'{'}uid}</code></td>
                        <td>Unique ID for the pagination item element.</td>
                    </tr>
                    <tr>
                        <td><code>isActive</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether the pagination item is active.</td>
                    </tr>
                    <tr>
                        <td><code>isDisabled</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Whether the pagination item is disabled.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Pagination.Link Props</h3>
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
                        <td><code>ariaLabel</code></td>
                        <td><code>string</code></td>
                        <td><code>undefined</code></td>
                        <td>ARIA label for the link.</td>
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
                        <td>Reference to the DOM element.</td>
                    </tr>
                    <tr>
                        <td><code>href</code></td>
                        <td><code>string</code></td>
                        <td><code>'#!'</code></td>
                        <td>URL for the link.</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td><code>page-link-{'{'}uid}</code></td>
                        <td>Unique ID for the pagination link element.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's pagination classes based on the provided props:</p>
        <ul>
            <li><code>pagination</code> - Base class for the Pagination component</li>
            <li><code>page-item</code> - Applied to Pagination.Item components</li>
            <li><code>page-link</code> - Applied to Pagination.Link components</li>
            <li><code>pagination-sm</code> - Applied when size="sm"</li>
            <li><code>pagination-lg</code> - Applied when size="lg"</li>
            <li><code>justify-content-center</code> - Applied when alignment="center"</li>
            <li><code>justify-content-end</code> - Applied when alignment="end"</li>
            <li><code>active</code> - Applied to Pagination.Item when isActive=true</li>
            <li><code>disabled</code> - Applied to Pagination.Item when isDisabled=true or parent Pagination.Root has isDisabled=true</li>
        </ul>
    </section>
</div>

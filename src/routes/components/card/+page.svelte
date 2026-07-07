<script lang="ts">
    import { Card } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import CardPlayground from './CardPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Card.Root class="w-18rem">
    <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
    <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
        <button class="btn btn-primary">Go somewhere</button>
    </Card.Body>
</Card.Root>`;

    const simpleBodyCode = `<Card.Root>
    <Card.Body>
        This is some text within a card body.
    </Card.Body>
</Card.Root>`;

    const titlesTextLinksCode = `<Card.Root class="w-18rem">
    <Card.Body>
        <Card.Title>Card title</Card.Title>
        <Card.Subtitle class="mb-2 text-body-secondary">Card subtitle</Card.Subtitle>
        <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
        <Card.Link href="#card-demo-link">Card link</Card.Link>
        <Card.Link href="#card-demo-link">Another link</Card.Link>
    </Card.Body>
</Card.Root>`;

    const imagesCode = `<!-- Top image -->
<Card.Root class="w-18rem">
    <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
    <Card.Body>
        <Card.Title>Top image</Card.Title>
        <Card.Text>This card has an image at the top.</Card.Text>
    </Card.Body>
</Card.Root>

<!-- Bottom image -->
<Card.Root class="w-18rem">
    <Card.Body>
        <Card.Title>Bottom image</Card.Title>
        <Card.Text>This card has an image at the bottom.</Card.Text>
    </Card.Body>
    <Card.Img position="bottom" src="https://placehold.co/300x180" alt="Card image cap" />
</Card.Root>`;

    const listGroupsCode = `<Card.Root class="w-18rem">
    <ul class="list-group list-group-flush">
        <li class="list-group-item">An item</li>
        <li class="list-group-item">A second item</li>
        <li class="list-group-item">A third item</li>
    </ul>
</Card.Root>`;

    const kitchenSinkCode = `<Card.Root class="w-18rem">
    <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
    <Card.Body>
        <Card.Title>Card title</Card.Title>
        <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
    </Card.Body>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">An item</li>
        <li class="list-group-item">A second item</li>
        <li class="list-group-item">A third item</li>
    </ul>
    <Card.Body>
        <Card.Link href="#card-demo-link">Card link</Card.Link>
        <Card.Link href="#card-demo-link">Another link</Card.Link>
    </Card.Body>
</Card.Root>`;

    const headerFooterCode = `<Card.Root>
    <Card.Header>Featured</Card.Header>
    <Card.Body>
        <Card.Title>Special title treatment</Card.Title>
        <Card.Text>With supporting text below as a natural lead-in to additional content.</Card.Text>
        <button class="btn btn-primary">Go somewhere</button>
    </Card.Body>
    <Card.Footer class="text-body-secondary">2 days ago</Card.Footer>
</Card.Root>`;

    const imageOverlayCode = `<Card.Root class="text-bg-dark w-18rem">
    <Card.Img src="https://placehold.co/300x180" alt="Card image" />
    <Card.ImgOverlay>
        <Card.Title>Card title</Card.Title>
        <Card.Text>This is a wider card with supporting text below as a natural lead-in to additional content.</Card.Text>
        <Card.Text><small>Last updated 3 mins ago</small></Card.Text>
    </Card.ImgOverlay>
</Card.Root>`;

    const horizontalCardCode = `<Card.Root class="mb-3" style="max-width: 540px;">
    <div class="row g-0">
        <div class="col-md-4">
            <Card.Img src="https://placehold.co/120x180" class="img-fluid rounded-start" alt="Card image" />
        </div>
        <div class="col-md-8">
            <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>This is a wider card with supporting text below as a natural lead-in to additional content.</Card.Text>
                <Card.Text><small class="text-body-secondary">Last updated 3 mins ago</small></Card.Text>
            </Card.Body>
        </div>
    </div>
</Card.Root>`;

    const cardStylesCode = `<Card.Root class="text-bg-primary mb-3" style="max-width: 18rem;">
    <Card.Header>Header</Card.Header>
    <Card.Body>
        <Card.Title>Primary card title</Card.Title>
        <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
    </Card.Body>
</Card.Root>

<Card.Root class="text-bg-secondary mb-3" style="max-width: 18rem;">
    <!-- Content similar to above -->
</Card.Root>

<Card.Root class="text-bg-success mb-3" style="max-width: 18rem;">
    <!-- Content similar to above -->
</Card.Root>

<Card.Root class="text-bg-danger mb-3" style="max-width: 18rem;">
    <!-- Content similar to above -->
</Card.Root>`;

    const borderStylesCode = `<Card.Root class="border-primary mb-3" style="max-width: 18rem;">
    <Card.Header>Header</Card.Header>
    <Card.Body class="text-primary">
        <Card.Title>Primary card title</Card.Title>
        <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
    </Card.Body>
</Card.Root>

<Card.Root class="border-success mb-3" style="max-width: 18rem;">
    <Card.Header>Header</Card.Header>
    <Card.Body class="text-success">
        <Card.Title>Success card title</Card.Title>
        <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
    </Card.Body>
</Card.Root>`;

    const cardGroupCode = `<Card.Group>
    <Card.Root>
        <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
        <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text>This is a wider card with supporting text below as a natural lead-in to additional content.</Card.Text>
            <Card.Text><small class="text-body-secondary">Last updated 3 mins ago</small></Card.Text>
        </Card.Body>
    </Card.Root>
    <Card.Root>
        <!-- Similar content to above -->
    </Card.Root>
    <Card.Root>
        <!-- Similar content to above -->
    </Card.Root>
</Card.Group>`;

    const gridCardsCode = `<div class="row row-cols-1 row-cols-md-3 g-4">
    <div class="col">
        <Card.Root>
            <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
            <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content.</Card.Text>
            </Card.Body>
        </Card.Root>
    </div>
    <div class="col">
        <Card.Root>
            <!-- Similar content to above -->
        </Card.Root>
    </div>
    <div class="col">
        <Card.Root>
            <!-- Similar content to above -->
        </Card.Root>
    </div>
</div>`;
</script>

<div>
    <h1 class="mb-4">Card</h1>
    <span id="card-demo-link" class="visually-hidden">Card demo link target</span>

    <p class="lead">Bootstrap's card component provides a flexible and extensible content container with multiple variants and options.</p>

    <div class="mb-5">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Card component by adjusting the options below:</p>
        <CardPlayground />
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Basic Example</h2>
            <p>Cards are built with as little markup and styles as possible but still manage to deliver a ton of control and customization.</p>

            <div class="wk-card-example p-4 border rounded">
                <Card.Root class="w-18rem">
                    <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                        <button class="btn btn-primary">Go somewhere</button>
                    </Card.Body>
                </Card.Root>
            </div>

            <SyntaxHighlighter code={basicExampleCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Content Types</h2>
            <p>Cards support a wide variety of content, including images, text, list groups, links, and more.</p>

            <h3 class="h4 mt-4">Body</h3>
            <p>The building block of a card is the <code>Card.Body</code>. Use it whenever you need a padded section within a card.</p>

            <div class="wk-card-example p-4 border rounded">
                <Card.Root>
                    <Card.Body>This is some text within a card body.</Card.Body>
                </Card.Root>
            </div>

            <SyntaxHighlighter code={simpleBodyCode} />

            <h3 class="h4 mt-4">Titles, Text, and Links</h3>
            <p>
                Card titles are added with <code>Card.Title</code> component, text with <code>Card.Text</code>, and links with <code>Card.Link</code>.
            </p>

            <div class="wk-card-example p-4 border rounded">
                <Card.Root class="w-18rem">
                    <Card.Body>
                        <Card.Title>Card title</Card.Title>
                        <Card.Subtitle class="mb-2 text-body-secondary">Card subtitle</Card.Subtitle>
                        <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                        <Card.Link href="#card-demo-link">Card link</Card.Link>
                        <Card.Link href="#card-demo-link">Another link</Card.Link>
                    </Card.Body>
                </Card.Root>
            </div>

            <SyntaxHighlighter code={titlesTextLinksCode} />

            <h3 class="h4 mt-4">Images</h3>
            <p>
                <code>Card.Img</code> adds an image to your card. You can position the image at the top, bottom, or with no position (which places it as
                a standard img).
            </p>

            <div class="wk-card-example p-4 border rounded">
                <div class="d-flex gap-3">
                    <Card.Root class="w-18rem">
                        <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
                        <Card.Body>
                            <Card.Title>Top image</Card.Title>
                            <Card.Text>This card has an image at the top.</Card.Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root class="w-18rem">
                        <Card.Body>
                            <Card.Title>Bottom image</Card.Title>
                            <Card.Text>This card has an image at the bottom.</Card.Text>
                        </Card.Body>
                        <Card.Img position="bottom" src="https://placehold.co/300x180" alt="Card image cap" />
                    </Card.Root>
                </div>
            </div>

            <SyntaxHighlighter code={imagesCode} />

            <h3 class="h4 mt-4">List Groups</h3>
            <p>Create lists of content in a card with a list group.</p>

            <div class="wk-card-example p-4 border rounded">
                <Card.Root class="w-18rem">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">An item</li>
                        <li class="list-group-item">A second item</li>
                        <li class="list-group-item">A third item</li>
                    </ul>
                </Card.Root>
            </div>

            <SyntaxHighlighter code={listGroupsCode} />

            <h3 class="h4 mt-4">Kitchen Sink</h3>
            <p>Mix and match multiple content types to create the card you need.</p>

            <div class="wk-card-example p-4 border rounded">
                <Card.Root class="w-18rem">
                    <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
                    <Card.Body>
                        <Card.Title>Card title</Card.Title>
                        <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                    </Card.Body>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">An item</li>
                        <li class="list-group-item">A second item</li>
                        <li class="list-group-item">A third item</li>
                    </ul>
                    <Card.Body>
                        <Card.Link href="#card-demo-link">Card link</Card.Link>
                        <Card.Link href="#card-demo-link">Another link</Card.Link>
                    </Card.Body>
                </Card.Root>
            </div>

            <SyntaxHighlighter code={kitchenSinkCode} />

            <h3 class="h4 mt-4">Header and Footer</h3>
            <p>Add an optional header and footer to your cards using <code>Card.Header</code> and <code>Card.Footer</code>.</p>

            <div class="wk-card-example p-4 border rounded">
                <Card.Root>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                        <Card.Title>Special title treatment</Card.Title>
                        <Card.Text>With supporting text below as a natural lead-in to additional content.</Card.Text>
                        <button class="btn btn-primary">Go somewhere</button>
                    </Card.Body>
                    <Card.Footer class="text-body-secondary">2 days ago</Card.Footer>
                </Card.Root>
            </div>

            <SyntaxHighlighter code={headerFooterCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Image Overlays</h2>
            <p>Turn an image into a card background and overlay your card's text. Use <code>Card.ImgOverlay</code> to contain your text content.</p>

            <div class="wk-card-example p-4 border rounded">
                <Card.Root class="text-bg-dark w-18rem">
                    <Card.Img src="https://placehold.co/300x180/000000/FFF" alt="Card image" />
                    <Card.ImgOverlay>
                        <Card.Title>Card title</Card.Title>
                        <Card.Text>This is a wider card with supporting text below as a natural lead-in to additional content.</Card.Text>
                        <Card.Text><small>Last updated 3 mins ago</small></Card.Text>
                    </Card.ImgOverlay>
                </Card.Root>
            </div>

            <SyntaxHighlighter code={imageOverlayCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Horizontal Cards</h2>
            <p>Using Bootstrap's grid system, you can create horizontal cards by mixing and matching with additional elements.</p>

            <div class="wk-card-example p-4 border rounded">
                <Card.Root class="mb-3" style="max-width: 540px;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <Card.Img src="https://placehold.co/120x180" class="img-fluid rounded-start" alt="Card image" />
                        </div>
                        <div class="col-md-8">
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>This is a wider card with supporting text below as a natural lead-in to additional content.</Card.Text>
                                <Card.Text><small class="text-body-secondary">Last updated 3 mins ago</small></Card.Text>
                            </Card.Body>
                        </div>
                    </div>
                </Card.Root>
            </div>

            <SyntaxHighlighter code={horizontalCardCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Card Styles</h2>
            <p>Cards include various options for customizing their backgrounds, borders, and colors.</p>

            <h3 class="h4 mt-4">Background and Color</h3>
            <p>Use the text and background utilities to change the appearance of a card.</p>

            <div class="wk-card-example p-4 border rounded">
                <div class="d-flex flex-wrap gap-3">
                    <Card.Root class="text-bg-primary mb-3" style="max-width: 18rem;">
                        <Card.Header>Header</Card.Header>
                        <Card.Body>
                            <Card.Title>Primary card title</Card.Title>
                            <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root class="text-bg-secondary mb-3" style="max-width: 18rem;">
                        <Card.Header>Header</Card.Header>
                        <Card.Body>
                            <Card.Title>Secondary card title</Card.Title>
                            <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root class="text-bg-success mb-3" style="max-width: 18rem;">
                        <Card.Header>Header</Card.Header>
                        <Card.Body>
                            <Card.Title>Success card title</Card.Title>
                            <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root class="text-bg-danger mb-3" style="max-width: 18rem;">
                        <Card.Header>Header</Card.Header>
                        <Card.Body>
                            <Card.Title>Danger card title</Card.Title>
                            <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                        </Card.Body>
                    </Card.Root>
                </div>
            </div>

            <SyntaxHighlighter code={cardStylesCode} />

            <h3 class="h4 mt-4">Border</h3>
            <p>Use border utilities to change just the border color of a card.</p>

            <div class="wk-card-example p-4 border rounded">
                <div class="d-flex flex-wrap gap-3">
                    <Card.Root class="border-primary mb-3" style="max-width: 18rem;">
                        <Card.Header>Header</Card.Header>
                        <Card.Body class="text-primary">
                            <Card.Title>Primary card title</Card.Title>
                            <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root class="border-success mb-3" style="max-width: 18rem;">
                        <Card.Header>Header</Card.Header>
                        <Card.Body class="text-success">
                            <Card.Title>Success card title</Card.Title>
                            <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                        </Card.Body>
                    </Card.Root>
                </div>
            </div>

            <SyntaxHighlighter code={borderStylesCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Card Layout</h2>

            <h3 class="h4 mt-4">Card Groups</h3>
            <p>Use <code>Card.Group</code> to render cards as a single, attached element with equal width and height columns.</p>

            <div class="wk-card-example p-4 border rounded">
                <Card.Group>
                    <Card.Root>
                        <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
                        <Card.Body>
                            <Card.Title>Card title</Card.Title>
                            <Card.Text>This is a wider card with supporting text below as a natural lead-in to additional content.</Card.Text>
                            <Card.Text><small class="text-body-secondary">Last updated 3 mins ago</small></Card.Text>
                        </Card.Body>
                    </Card.Root>
                    <Card.Root>
                        <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
                        <Card.Body>
                            <Card.Title>Card title</Card.Title>
                            <Card.Text>This card has supporting text below as a natural lead-in to additional content.</Card.Text>
                            <Card.Text><small class="text-body-secondary">Last updated 3 mins ago</small></Card.Text>
                        </Card.Body>
                    </Card.Root>
                    <Card.Root>
                        <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
                        <Card.Body>
                            <Card.Title>Card title</Card.Title>
                            <Card.Text>This is a wider card with supporting text below as a natural lead-in to additional content.</Card.Text>
                            <Card.Text><small class="text-body-secondary">Last updated 3 mins ago</small></Card.Text>
                        </Card.Body>
                    </Card.Root>
                </Card.Group>
            </div>

            <SyntaxHighlighter code={cardGroupCode} />

            <h3 class="h4 mt-4">Grid Cards</h3>
            <p>Use the Bootstrap grid system and its <code>.row-cols</code> classes to control how many grid columns you show per row.</p>

            <div class="wk-card-example p-4 border rounded">
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    <div class="col">
                        <Card.Root>
                            <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content.</Card.Text>
                            </Card.Body>
                        </Card.Root>
                    </div>
                    <div class="col">
                        <Card.Root>
                            <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content.</Card.Text>
                            </Card.Body>
                        </Card.Root>
                    </div>
                    <div class="col">
                        <Card.Root>
                            <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content.</Card.Text>
                            </Card.Body>
                        </Card.Root>
                    </div>
                </div>
            </div>

            <SyntaxHighlighter code={gridCardsCode} />
        </div>
    </div>

    <!-- API Reference -->
    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link" id="api">API Reference</h2>

            <h3 class="h5 mt-4">Card.Root Props</h3>
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
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td>card-{'{'}uid}</td>
                            <td>Unique identifier for the card element</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Card.Body Props</h3>
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
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>card-body-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Card.Title Props</h3>
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
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>card-title-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                        <tr>
                            <td><code>level</code></td>
                            <td><code>number</code></td>
                            <td><code>5</code></td>
                            <td>Heading level for the title</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Card.Subtitle Props</h3>
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
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>card-subtitle-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                        <tr>
                            <td><code>level</code></td>
                            <td><code>number</code></td>
                            <td><code>5</code></td>
                            <td>Heading level for the title</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Card.Text Props</h3>
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
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>card-text-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Card.Img Props</h3>
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
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>card-img-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                        <tr>
                            <td><code>position</code></td>
                            <td><code>'top' | 'bottom' | undefined</code></td>
                            <td>-</td>
                            <td>Position of the image within the card</td>
                        </tr>
                        <tr>
                            <td><code>src</code></td>
                            <td><code>string</code></td>
                            <td><code>''</code></td>
                            <td>Source URL of the image</td>
                        </tr>
                        <tr>
                            <td><code>alt</code></td>
                            <td><code>string</code></td>
                            <td><code>''</code></td>
                            <td>Alternative text for the image</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Card.ImgOverlay Props</h3>
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
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>card-img-overlay-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Card.Header Props</h3>
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
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>card-header-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Card.Footer Props</h3>
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
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>card-footer-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Card.Link Props</h3>
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
                            <td><code>href</code></td>
                            <td><code>string</code></td>
                            <td><code>#!</code></td>
                            <td>URL for the link</td>
                        </tr>
                        <tr>
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>card-link-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Card.Group Props</h3>
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
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>card-group-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">CSS Classes</h3>
            <p>The component applies Bootstrap's card classes based on the provided props and subcomponents:</p>
            <ul>
                <li><code>card</code> - Applied to Card.Root</li>
                <li><code>card-body</code> - Applied to Card.Body</li>
                <li><code>card-title</code> - Applied to Card.Title</li>
                <li><code>card-subtitle</code> - Applied to Card.Subtitle</li>
                <li><code>card-text</code> - Applied to Card.Text</li>
                <li><code>card-img-top</code> - Applied to Card.Img with position="top"</li>
                <li><code>card-img-bottom</code> - Applied to Card.Img with position="bottom"</li>
                <li><code>card-img</code> - Applied to Card.Img without a position</li>
                <li><code>card-img-overlay</code> - Applied to Card.ImgOverlay</li>
                <li><code>card-header</code> - Applied to Card.Header</li>
                <li><code>card-footer</code> - Applied to Card.Footer</li>
                <li><code>card-link</code> - Applied to Card.Link</li>
                <li><code>card-group</code> - Applied to Card.Group</li>
                <li><code>text-bg-*</code> - Applied to Card.Root for contextual background colors (primary, secondary, etc.)</li>
                <li><code>border-*</code> - Applied to Card.Root for contextual border colors</li>
                <li><code>w-*</code> - Utility width classes can be applied to adjust card width</li>
            </ul>
        </div>
    </div>
</div>

<style>
    .wk-card-example {
        background-color: var(--bs-tertiary-bg);
    }
</style>

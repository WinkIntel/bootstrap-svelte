<script lang="ts">
    import { Badge, ListGroup } from '$lib/index.js';
    import type { ListGroupItemColorVariant } from '$lib/ListGroup/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import ListGroupPlayground from './ListGroupPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<ListGroup.Root>
    <ListGroup.Item>An item</ListGroup.Item>
    <ListGroup.Item>A second item</ListGroup.Item>
    <ListGroup.Item>A third item</ListGroup.Item>
    <ListGroup.Item>A fourth item</ListGroup.Item>
    <ListGroup.Item>And a fifth one</ListGroup.Item>
</ListGroup.Root>`;

    const activeItemsCode = `<ListGroup.Root>
    <ListGroup.Item isActive={true}>Active item</ListGroup.Item>
    <ListGroup.Item>A second item</ListGroup.Item>
    <ListGroup.Item>A third item</ListGroup.Item>
    <ListGroup.Item>A fourth item</ListGroup.Item>
    <ListGroup.Item>And a fifth one</ListGroup.Item>
</ListGroup.Root>`;

    const flushListCode = `<ListGroup.Root isFlush={true}>
    <ListGroup.Item>An item</ListGroup.Item>
    <ListGroup.Item>A second item</ListGroup.Item>
    <ListGroup.Item>A third item</ListGroup.Item>
    <ListGroup.Item>A fourth item</ListGroup.Item>
    <ListGroup.Item>And a fifth one</ListGroup.Item>
</ListGroup.Root>`;

    const horizontalListCode = `<ListGroup.Root horizontalOnBreakpoint="xs">
    <ListGroup.Item>An item</ListGroup.Item>
    <ListGroup.Item>A second item</ListGroup.Item>
    <ListGroup.Item>A third item</ListGroup.Item>
</ListGroup.Root>
<ListGroup.Root horizontalOnBreakpoint="sm">
    <ListGroup.Item>An item</ListGroup.Item>
    <ListGroup.Item>A second item</ListGroup.Item>
    <ListGroup.Item>A third item</ListGroup.Item>
</ListGroup.Root>
<ListGroup.Root horizontalOnBreakpoint="md">
    <ListGroup.Item>An item</ListGroup.Item>
    <ListGroup.Item>A second item</ListGroup.Item>
    <ListGroup.Item>A third item</ListGroup.Item>
</ListGroup.Root>
<ListGroup.Root horizontalOnBreakpoint="lg">
    <ListGroup.Item>An item</ListGroup.Item>
    <ListGroup.Item>A second item</ListGroup.Item>
    <ListGroup.Item>A third item</ListGroup.Item>
</ListGroup.Root>
<ListGroup.Root horizontalOnBreakpoint="xl">
    <ListGroup.Item>An item</ListGroup.Item>
    <ListGroup.Item>A second item</ListGroup.Item>
    <ListGroup.Item>A third item</ListGroup.Item>
</ListGroup.Root>
<ListGroup.Root horizontalOnBreakpoint="xxl">
    <ListGroup.Item>An item</ListGroup.Item>
    <ListGroup.Item>A second item</ListGroup.Item>
    <ListGroup.Item>A third item</ListGroup.Item>
</ListGroup.Root>`;

    const contextualColorsCode = `<ListGroup.Root>
    <ListGroup.Item colorVariant="primary">Primary</ListGroup.Item>
    <ListGroup.Item colorVariant="secondary">Secondary</ListGroup.Item>
    <ListGroup.Item colorVariant="success">Success</ListGroup.Item>
    <ListGroup.Item colorVariant="danger">Danger</ListGroup.Item>
    <ListGroup.Item colorVariant="warning">Warning</ListGroup.Item>
    <ListGroup.Item colorVariant="info">Info</ListGroup.Item>
    <ListGroup.Item colorVariant="light">Light</ListGroup.Item>
    <ListGroup.Item colorVariant="dark">Dark</ListGroup.Item>
</ListGroup.Root>`;

    let currentContextualColor: ListGroupItemColorVariant | undefined = $state(undefined);
    const contextualColorsCode2 = `<script>
    let currentContextualColor: ListGroupItemColorVariant | undefined = $state(undefined);
\u003c/script>
<ListGroup.Root>
    <ListGroup.ItemAction
        href="#!"
        colorVariant="primary"
        isActive={currentContextualColor === 'primary'}
        onclick={() => (currentContextualColor = 'primary')}>Primary</ListGroup.ItemAction>
    <ListGroup.ItemAction
        href="#!"
        colorVariant="secondary"
        isActive={currentContextualColor === 'secondary'}
        onclick={() => (currentContextualColor = 'secondary')}>Secondary</ListGroup.ItemAction>
    <ListGroup.ItemAction
        href="#!"
        colorVariant="success"
        isActive={currentContextualColor === 'success'}
        onclick={() => (currentContextualColor = 'success')}>Success</ListGroup.ItemAction>
    <ListGroup.ItemAction
        href="#!"
        colorVariant="danger"
        isActive={currentContextualColor === 'danger'}
        onclick={() => (currentContextualColor = 'danger')}>Danger</ListGroup.ItemAction>
    <ListGroup.ItemAction
        href="#!"
        colorVariant="warning"
        isActive={currentContextualColor === 'warning'}
        onclick={() => (currentContextualColor = 'warning')}>Warning</ListGroup.ItemAction>
    <ListGroup.ItemAction
        href="#!"
        colorVariant="info"
        isActive={currentContextualColor === 'info'}
        onclick={() => (currentContextualColor = 'info')}>Info</ListGroup.ItemAction>
    <ListGroup.ItemAction
        href="#!"
        colorVariant="light"
        isActive={currentContextualColor === 'light'}
        onclick={() => (currentContextualColor = 'light')}>Light</ListGroup.ItemAction>
    <ListGroup.ItemAction
        href="#!"
        colorVariant="dark"
        isActive={currentContextualColor === 'dark'}
        onclick={() => (currentContextualColor = 'dark')}>Dark</ListGroup.ItemAction>
</ListGroup.Root>`;

    const actionableItemsCode = `<ListGroup.Root>
    <ListGroup.ItemAction href="#!" isActive={true}>The current link item</ListGroup.ItemAction>
    <ListGroup.ItemAction href="#!">A second link item</ListGroup.ItemAction>
    <ListGroup.ItemAction onclick={() => console.log('click')}>A button item</ListGroup.ItemAction>
    <ListGroup.ItemAction onclick={() => console.log('click')}>A second button item</ListGroup.ItemAction>
    <ListGroup.ItemAction href="#!" isDisabled={true}>A disabled link item</ListGroup.ItemAction>
    <ListGroup.ItemAction isDisabled={true}>A disabled button item</ListGroup.ItemAction>
</ListGroup.Root>`;

    const numberedListCode = `<ListGroup.Root isNumbered={true}>
    <ListGroup.Item>First item</ListGroup.Item>
    <ListGroup.Item>Second item</ListGroup.Item>
    <ListGroup.Item>Third item</ListGroup.Item>
    <ListGroup.Item>Fourth item</ListGroup.Item>
    <ListGroup.Item>Fifth item</ListGroup.Item>
</ListGroup.Root>`;

    const withBadgesCode = `<ListGroup.Root>
    <ListGroup.Item class="d-flex justify-content-between align-items-center">
        A list item
        <Badge isPill={true}>14</Badge>
    </ListGroup.Item>
    <ListGroup.Item class="d-flex justify-content-between align-items-center">
        A second list item
        <Badge isPill={true}>2</Badge>
    </ListGroup.Item>
    <ListGroup.Item class="d-flex justify-content-between align-items-center">
        A third list item
        <Badge isPill={true}>1</Badge>
    </ListGroup.Item>
</ListGroup.Root>`;

    const customContentCode = `<ListGroup.Root>
    <ListGroup.ItemAction href="#" isActive={true}>
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">List group item heading</h5>
            <small>3 days ago</small>
        </div>
        <p class="mb-1">Some placeholder content in a paragraph.</p>
        <small>And some small print.</small>
    </ListGroup.ItemAction>
    <ListGroup.ItemAction href="#">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">List group item heading</h5>
            <small class="text-body-secondary">3 days ago</small>
        </div>
        <p class="mb-1">Some placeholder content in a paragraph.</p>
        <small class="text-body-secondary">And some muted small print.</small>
    </ListGroup.ItemAction>
    <ListGroup.ItemAction href="#">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">List group item heading</h5>
            <small class="text-body-secondary">3 days ago</small>
        </div>
        <p class="mb-1">Some placeholder content in a paragraph.</p>
        <small class="text-body-secondary">And some muted small print.</small>
    </ListGroup.ItemAction>
</ListGroup.Root>`;
    const checkBoxesAndRadiosCode = `<ListGroup.Root>
    <ListGroup.Item>
        <input type="checkbox" class="form-check-input me-1" />
        Checkbox item
    </ListGroup.Item>
    <ListGroup.Item>
        <input type="radio" name="options" class="form-check-input me-1" />
        Radio item
    </ListGroup.Item>
</ListGroup.Root>`;
</script>

<div>
    <h1 class="mb-4">List Group</h1>

    <p class="lead">
        List groups are a flexible component for displaying a series of content. Modify and extend them to support just about any content within.
    </p>

    <div class="mb-5">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the List Group component by adjusting the options below:</p>
        <ListGroupPlayground />
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Basic Example</h2>
            <p>The most basic list group is an unordered list with list items:</p>

            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root>
                    <ListGroup.Item>An item</ListGroup.Item>
                    <ListGroup.Item>A second item</ListGroup.Item>
                    <ListGroup.Item>A third item</ListGroup.Item>
                    <ListGroup.Item>A fourth item</ListGroup.Item>
                    <ListGroup.Item>And a fifth one</ListGroup.Item>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={basicExampleCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Active Items</h2>
            <p>Add <code>isActive={true}</code> to a <code>ListGroup.Item</code> to indicate the current active selection.</p>

            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root>
                    <ListGroup.Item isActive={true}>Active item</ListGroup.Item>
                    <ListGroup.Item>A second item</ListGroup.Item>
                    <ListGroup.Item>A third item</ListGroup.Item>
                    <ListGroup.Item>A fourth item</ListGroup.Item>
                    <ListGroup.Item>And a fifth one</ListGroup.Item>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={activeItemsCode} />
        </div>
    </div>

    <!-- Links and buttons -->
    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Links and Buttons</h2>
            <p>
                Use <code>isActionable={true}</code> to make list items clickable with hover effects. This is useful for creating interactive lists.
            </p>

            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root>
                    <ListGroup.ItemAction href="#!" isActive={true}>The current link item</ListGroup.ItemAction>
                    <ListGroup.ItemAction href="#!">A second link item</ListGroup.ItemAction>
                    <ListGroup.ItemAction onclick={() => console.log('click')}>A button item</ListGroup.ItemAction>
                    <ListGroup.ItemAction onclick={() => console.log('click')}>A second button item</ListGroup.ItemAction>
                    <ListGroup.ItemAction href="#!" isDisabled={true}>A disabled link item</ListGroup.ItemAction>
                    <ListGroup.ItemAction isDisabled={true}>A disabled button item</ListGroup.ItemAction>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={actionableItemsCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Flush</h2>
            <p>
                Add <code>isFlush={true}</code> to remove some borders and rounded corners to render list items edge-to-edge in a parent container (e.g.,
                a card).
            </p>

            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root isFlush={true}>
                    <ListGroup.Item>An item</ListGroup.Item>
                    <ListGroup.Item>A second item</ListGroup.Item>
                    <ListGroup.Item>A third item</ListGroup.Item>
                    <ListGroup.Item>A fourth item</ListGroup.Item>
                    <ListGroup.Item>And a fifth one</ListGroup.Item>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={flushListCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Numbered List</h2>
            <p>
                Add <code>isNumbered={true}</code> to your <code>ListGroup.Root</code> to opt into numbered list group items. Numbers are generated via
                CSS.
            </p>

            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root isNumbered={true}>
                    <ListGroup.Item>First item</ListGroup.Item>
                    <ListGroup.Item>Second item</ListGroup.Item>
                    <ListGroup.Item>Third item</ListGroup.Item>
                    <ListGroup.Item>Fourth item</ListGroup.Item>
                    <ListGroup.Item>Fifth item</ListGroup.Item>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={numberedListCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Horizontal</h2>
            <p>
                Add <code>horizontalOnBreakpoint</code> to change the layout of list group items from vertical to horizontal across all breakpoints.
            </p>

            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root horizontalOnBreakpoint="xs">
                    <ListGroup.Item>An item</ListGroup.Item>
                    <ListGroup.Item>A second item</ListGroup.Item>
                    <ListGroup.Item>A third item</ListGroup.Item>
                </ListGroup.Root>
                <ListGroup.Root horizontalOnBreakpoint="sm">
                    <ListGroup.Item>An item</ListGroup.Item>
                    <ListGroup.Item>A second item</ListGroup.Item>
                    <ListGroup.Item>A third item</ListGroup.Item>
                </ListGroup.Root>
                <ListGroup.Root horizontalOnBreakpoint="md">
                    <ListGroup.Item>An item</ListGroup.Item>
                    <ListGroup.Item>A second item</ListGroup.Item>
                    <ListGroup.Item>A third item</ListGroup.Item>
                </ListGroup.Root>
                <ListGroup.Root horizontalOnBreakpoint="lg">
                    <ListGroup.Item>An item</ListGroup.Item>
                    <ListGroup.Item>A second item</ListGroup.Item>
                    <ListGroup.Item>A third item</ListGroup.Item>
                </ListGroup.Root>
                <ListGroup.Root horizontalOnBreakpoint="xl">
                    <ListGroup.Item>An item</ListGroup.Item>
                    <ListGroup.Item>A second item</ListGroup.Item>
                    <ListGroup.Item>A third item</ListGroup.Item>
                </ListGroup.Root>
                <ListGroup.Root horizontalOnBreakpoint="xxl">
                    <ListGroup.Item>An item</ListGroup.Item>
                    <ListGroup.Item>A second item</ListGroup.Item>
                    <ListGroup.Item>A third item</ListGroup.Item>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={horizontalListCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Contextual Colors</h2>
            <p>Use the <code>colorVariant</code> prop to style list items with a contextual color.</p>

            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root>
                    <ListGroup.Item colorVariant="primary">Primary</ListGroup.Item>
                    <ListGroup.Item colorVariant="secondary">Secondary</ListGroup.Item>
                    <ListGroup.Item colorVariant="success">Success</ListGroup.Item>
                    <ListGroup.Item colorVariant="danger">Danger</ListGroup.Item>
                    <ListGroup.Item colorVariant="warning">Warning</ListGroup.Item>
                    <ListGroup.Item colorVariant="info">Info</ListGroup.Item>
                    <ListGroup.Item colorVariant="light">Light</ListGroup.Item>
                    <ListGroup.Item colorVariant="dark">Dark</ListGroup.Item>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={contextualColorsCode} />
        </div>
        <div class="col-lg-8">
            <h2 class="wk-quick-link">For links and buttons</h2>
            <p>
                Use the <code>colorVariant</code> prop to style anchors and buttons within the list group with a contextual color. Note the addition of
                the hover styles here not present in the previous example. Also supported is the .active state; apply it to indicate an active selection
                on a contextual list group item.
            </p>

            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root>
                    <ListGroup.ItemAction
                        href="#!"
                        colorVariant="primary"
                        isActive={currentContextualColor === 'primary'}
                        onclick={() => (currentContextualColor = 'primary')}>Primary</ListGroup.ItemAction>
                    <ListGroup.ItemAction
                        href="#!"
                        colorVariant="secondary"
                        isActive={currentContextualColor === 'secondary'}
                        onclick={() => (currentContextualColor = 'secondary')}>Secondary</ListGroup.ItemAction>
                    <ListGroup.ItemAction
                        href="#!"
                        colorVariant="success"
                        isActive={currentContextualColor === 'success'}
                        onclick={() => (currentContextualColor = 'success')}>Success</ListGroup.ItemAction>
                    <ListGroup.ItemAction
                        href="#!"
                        colorVariant="danger"
                        isActive={currentContextualColor === 'danger'}
                        onclick={() => (currentContextualColor = 'danger')}>Danger</ListGroup.ItemAction>
                    <ListGroup.ItemAction
                        href="#!"
                        colorVariant="warning"
                        isActive={currentContextualColor === 'warning'}
                        onclick={() => (currentContextualColor = 'warning')}>Warning</ListGroup.ItemAction>
                    <ListGroup.ItemAction
                        href="#!"
                        colorVariant="info"
                        isActive={currentContextualColor === 'info'}
                        onclick={() => (currentContextualColor = 'info')}>Info</ListGroup.ItemAction>
                    <ListGroup.ItemAction
                        href="#!"
                        colorVariant="light"
                        isActive={currentContextualColor === 'light'}
                        onclick={() => (currentContextualColor = 'light')}>Light</ListGroup.ItemAction>
                    <ListGroup.ItemAction
                        href="#!"
                        colorVariant="dark"
                        isActive={currentContextualColor === 'dark'}
                        onclick={() => (currentContextualColor = 'dark')}>Dark</ListGroup.ItemAction>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={contextualColorsCode2} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">With badges</h2>
            <p>Add badges to any list group item to show unread counts, activity, and more with the help of some utilities./p></p>
            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root>
                    <ListGroup.Item class="d-flex justify-content-between align-items-center">
                        A list item
                        <Badge isPill={true}>14</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item class="d-flex justify-content-between align-items-center">
                        A second list item
                        <Badge isPill={true}>2</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item class="d-flex justify-content-between align-items-center">
                        A third list item
                        <Badge isPill={true}>1</Badge>
                    </ListGroup.Item>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={withBadgesCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Custom Content</h2>
            <p>List groups can contain any content, including headings, paragraphs, and more.</p>

            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root>
                    <ListGroup.ItemAction href="#" isActive={true}>
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">List group item heading</h5>
                            <small>3 days ago</small>
                        </div>
                        <p class="mb-1">Some placeholder content in a paragraph.</p>
                        <small>And some small print.</small>
                    </ListGroup.ItemAction>
                    <ListGroup.ItemAction href="#">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">List group item heading</h5>
                            <small class="text-body-secondary">3 days ago</small>
                        </div>
                        <p class="mb-1">Some placeholder content in a paragraph.</p>
                        <small class="text-body-secondary">And some muted small print.</small>
                    </ListGroup.ItemAction>
                    <ListGroup.ItemAction href="#">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">List group item heading</h5>
                            <small class="text-body-secondary">3 days ago</small>
                        </div>
                        <p class="mb-1">Some placeholder content in a paragraph.</p>
                        <small class="text-body-secondary">And some muted small print.</small>
                    </ListGroup.ItemAction>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={customContentCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link">Checkboxes and Radios</h2>
            <p>Use checkboxes or radios within list group items to create selectable lists.</p>

            <div class="wk-list-group-example p-4 border rounded">
                <ListGroup.Root>
                    <ListGroup.Item>
                        <input type="checkbox" class="form-check-input me-1" />
                        Checkbox item
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <input type="radio" name="options" class="form-check-input me-1" />
                        Radio item
                    </ListGroup.Item>
                </ListGroup.Root>
            </div>

            <SyntaxHighlighter code={checkBoxesAndRadiosCode} />
        </div>
    </div>

    <!-- API Reference -->
    <div class="row mb-5">
        <div class="col-lg-8">
            <h2 class="wk-quick-link" id="api">API Reference</h2>

            <h3 class="h5 mt-4">ListGroup.Root Props</h3>
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
                            <td><code>list-group-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                        <tr>
                            <td><code>isFlush</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Removes borders and rounded corners to render list items edge-to-edge in a parent container</td>
                        </tr>
                        <tr>
                            <td><code>horizontalOnBreakpoint</code></td>
                            <td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | undefined</code></td>
                            <td>-</td>
                            <td>Changes the layout of list group items from vertical to horizontal at the specified breakpoint</td>
                        </tr>
                        <tr>
                            <td><code>isNumbered</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Renders list items with numbers generated using the OL element</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">ListGroup.Item Props</h3>
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
                            <td><code>list-group-item-{'{'}uid}</code></td>
                            <td>Unique ID for the pagination item element.</td>
                        </tr>
                        <tr>
                            <td><code>isActive</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Indicates the current active selection</td>
                        </tr>
                        <tr>
                            <td><code>isDisabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Makes the item appear disabled</td>
                        </tr>
                        <tr>
                            <td><code>colorVariant</code></td>
                            <td><code>'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | undefined</code></td>
                            <td>-</td>
                            <td>Contextual color variant for the list item</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">ListGroup.ItemAction Props</h3>
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
                            <td><code>colorVariant</code></td>
                            <td><code>'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | undefined</code></td>
                            <td>-</td>
                            <td>Contextual color variant for the action item</td>
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
                            <td>-</td>
                            <td>URL to navigate to when the item is clicked; renders the item as an anchor tag when provided</td>
                        </tr>
                        <tr>
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>list-group-item-action-{'{'}uid}</code></td>
                            <td>Unique ID for the action item element</td>
                        </tr>
                        <tr>
                            <td><code>isActive</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Indicates the current active selection</td>
                        </tr>
                        <tr>
                            <td><code>isDisabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Makes the action item appear disabled</td>
                        </tr>
                        <tr>
                            <td><code>onclick</code></td>
                            <td><code>EventListener</code></td>
                            <td><code>noop</code></td>
                            <td>Click event handler for the action item</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">CSS Classes</h3>
            <p>The component applies Bootstrap's list-group classes based on the provided props:</p>
            <ul>
                <li><code>list-group</code> - Applied to ListGroup.Root</li>
                <li><code>list-group-item</code> - Applied to ListGroup.Item and ListGroup.ItemAction</li>
                <li><code>list-group-flush</code> - Applied when isFlush=true</li>
                <li><code>list-group-horizontal</code> - Applied when horizontalOnBreakpoint='xs'</li>
                <li><code>list-group-horizontal-&#123;breakpoint&#125;</code> - Applied when horizontalOnBreakpoint is set (sm, md, lg, xl, xxl)</li>
                <li><code>list-group-numbered</code> - Applied when isNumbered=true</li>
                <li><code>list-group-item-&#123;colorVariant&#125;</code> - Applied when colorVariant prop is set (primary, secondary, etc.)</li>
                <li><code>list-group-item-action</code> - Applied to ListGroup.ItemAction</li>
                <li><code>active</code> - Applied to ListGroup.Item or ListGroup.ItemAction when isActive=true</li>
                <li><code>disabled</code> - Applied to ListGroup.ItemAction when isDisabled=true</li>
            </ul>
        </div>
    </div>
</div>

<style>
    .wk-list-group-example {
        background-color: white;
    }
</style>

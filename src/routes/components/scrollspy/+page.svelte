<script lang="ts">
    import { ListGroup, Nav, Navbar, scrollspy } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Navbar example state and callback
    let activeNavLinkId: string | null = $state(null);
    const navbarCallback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeNavLinkId = entry.target.id;
            }
        });
    };

    // Nested nav example state and callback
    let activeNestedNavId: string | null = $state(null);
    const nestedNavCallback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeNestedNavId = entry.target.id;
            }
        });
    };

    // List group example state and callback
    let activeListGroupItemId: string | null = $state(null);
    const listGroupCallback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeListGroupItemId = entry.target.id;
            }
        });
    };

    // Simple anchors example state and callback
    let activeSimpleAnchorItemId: string | null = $state(null);
    const simpleAnchorsCallback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeSimpleAnchorItemId = entry.target.id;
            }
        });
    };

    // Code examples for syntax highlighter
    const navbarScrollspyCode = `<script lang="ts">
import { Nav, Navbar, scrollspy } from '$lib/index.js';

// State to track which link should be active
let activeNavLinkId: string | null = $state(null);

// Callback function that will be executed when elements intersect
const callback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            activeNavLinkId = entry.target.id;
        }
    });
};
\u003c/script>

<Navbar.Root id="navbar-example" class="bg-body-tertiary px-3 mb-3">
    <Navbar.Brand href="#scrollspy-demo-link">Navbar</Navbar.Brand>
    <Nav.Root itemStyle="pills">
        <Nav.Item>
            <Nav.Link href="#scrollspyHeading1" isActive={activeNavLinkId === 'scrollspyHeading1'}>First</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#scrollspyHeading2" isActive={activeNavLinkId === 'scrollspyHeading2'}>Second</Nav.Link>
        </Nav.Item>
    </Nav.Root>
</Navbar.Root>

<!-- Element to be scrolled with scrollspy attached -->
<div
    {@attach scrollspy({
        targetSelector: '#navbar-example',
        callback: callback,
        observerOptions: {
            rootMargin: '0px 0px -40%',
            threshold: 0.5
        }
    })}
    class="scrollspy-example bg-body-tertiary p-3 rounded-2"
    tabindex="0"
    role="presentation">
    <h4 id="scrollspyHeading1">First heading</h4>
    <p>Content for first heading...</p>
    <h4 id="scrollspyHeading2">Second heading</h4>
    <p>Content for second heading...</p>
</div>`;

    const nestedNavScrollspyCode = `<script lang="ts">
import { Nav, scrollspy } from '$lib/index.js';

// State to track which link should be active
let activeNestedNavId: string | null = $state(null);

// Callback function for intersection events
const nestedNavCallback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            activeNestedNavId = entry.target.id;
        }
    });
};
\u003c/script>

<div class="row">
    <div class="col-4">
        <Nav.Root id="navbar-example3" verticalBreakpoint="xs" itemStyle="pills">
            <Nav.Link href="#item-1" isActive={activeNestedNavId?.includes('item-1')}>Item 1</Nav.Link>
            <Nav.Root class="ms-3" verticalBreakpoint="xs">
                <Nav.Link href="#item-1-1" isActive={activeNestedNavId === 'item-1-1'}>Item 1-1</Nav.Link>
                <Nav.Link href="#item-1-2" isActive={activeNestedNavId === 'item-1-2'}>Item 1-2</Nav.Link>
            </Nav.Root>
            <Nav.Link href="#item-2" isActive={activeNestedNavId === 'item-2'}>Item 2</Nav.Link>
            <Nav.Link href="#item-3" isActive={activeNestedNavId?.includes('item-3')}>Item 3</Nav.Link>
            <Nav.Root class="ms-3" verticalBreakpoint="xs">
                <Nav.Link href="#item-3-1" isActive={activeNestedNavId === 'item-3-1'}>Item 3-1</Nav.Link>
                <Nav.Link href="#item-3-2" isActive={activeNestedNavId === 'item-3-2'}>Item 3-2</Nav.Link>
            </Nav.Root>
        </Nav.Root>
    </div>
    <div class="col-8">
        <div
            {@attach scrollspy({
                targetSelector: '#navbar-example3',
                callback: nestedNavCallback,
                observerOptions: { threshold: 0.5 }
            })}
            class="scrollspy-example-2"
            tabindex="0"
            role="presentation">
            <!-- Content with IDs matching the Nav.Link href values -->
            <div id="item-1"><h4>Item 1</h4><p>Content for item 1...</p></div>
            <div id="item-1-1"><h5>Item 1-1</h5><p>Content for item 1-1...</p></div>
        </div>
    </div>
</div>`;

    const listGroupScrollspyCode = `<script lang="ts">
import { ListGroup, scrollspy } from '$lib/index.js';

// State to track which list group item should be active
let activeListGroupItemId: string | null = $state(null);

// Callback function for intersection events
const listGroupCallback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            activeListGroupItemId = entry.target.id;
        }
    });
};
\u003c/script>

<div class="row">
    <div class="col-4">
        <ListGroup.Root id="list-example">
            <ListGroup.Item
                href="#list-item-1"
                isAction
                isActive={activeListGroupItemId === 'list-item-1'}>
                Item 1
            </ListGroup.Item>
            <ListGroup.Item
                href="#list-item-2"
                isAction
                isActive={activeListGroupItemId === 'list-item-2'}>
                Item 2
            </ListGroup.Item>
        </ListGroup.Root>
    </div>
    <div class="col-8">
        <div
            {@attach scrollspy({
                targetSelector: '#list-example',
                callback: listGroupCallback,
                observerOptions: { threshold: 0.5 }
            })}
            class="scrollspy-example"
            tabindex="0"
            role="presentation">
            <h4 id="list-item-1">Item 1</h4>
            <p>Content for item 1...</p>
            <h4 id="list-item-2">Item 2</h4>
            <p>Content for item 2...</p>
        </div>
    </div>
</div>`;

    const simpleAnchorsScrollspyCode = `<script lang="ts">
import { scrollspy } from '$lib/index.js';

// State to track which anchor should be active
let activeSimpleAnchorItemId: string | null = $state(null);

// Callback function for intersection events
const simpleAnchorsCallback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            activeSimpleAnchorItemId = entry.target.id;
        }
    });
};
\u003c/script>

<div class="row">
    <div class="col-4">
        <div class="d-flex flex-column gap-2 text-center" id="simple-items">
            <a
                class="p-1 rounded"
                class:active={activeSimpleAnchorItemId === 'simple-item-1'}
                href="#simple-item-1">
                Item 1
            </a>
            <a
                class="p-1 rounded"
                class:active={activeSimpleAnchorItemId === 'simple-item-2'}
                href="#simple-item-2">
                Item 2
            </a>
        </div>
    </div>
    <div class="col-8">
        <div
            {@attach scrollspy({
                targetSelector: '#simple-items',
                callback: simpleAnchorsCallback,
                observerOptions: { offset: 0, threshold: 0.5 }
            })}
            class="scrollspy-example"
            tabindex="0"
            role="presentation">
            <h4 id="simple-item-1">Item 1</h4>
            <p>Content for item 1...</p>
            <h4 id="simple-item-2">Item 2</h4>
            <p>Content for item 2...</p>
        </div>
    </div>
</div>`;

    const apiReferenceCode = `// Type definition for ScrollspyOptions
export type ScrollspyOptions = {
    targetSelector: string;
    callback: IntersectionObserverCallback;
    observerOptions?: IntersectionObserverInit;
};

// Usage example
<div
    {@attach scrollspy({
        targetSelector: '#element-id',     // A CSS selector to the element that contains the anchor targets.
        callback: myCallback,              // Function to call when elements intersect
        observerOptions: {                 // Standard IntersectionObserver options
            rootMargin: '0px 0px -40%',    // Margins around the root
            threshold: 0.5                 // How much of target must be visible to trigger
        }
    })}
    class="scrollspy-container"
    tabindex="0">
    <!-- Content with elements matching targetSelector -->
</div>`;
</script>

<!-- <svelte:head>
    <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO"
        crossorigin="anonymous"></script>
</svelte:head> -->

<div>
    <div class="mb-5">
        <h1>Scrollspy</h1>
        <span id="scrollspy-demo-link" class="visually-hidden">Scrollspy demo link target</span>
        <p class="lead">
            An attachment-based scrollspy component that automatically updates navigation or list group components based on scroll position to
            indicate which section of the page is currently active in the viewport.
        </p>
        <hr />
    </div>

    <section class="mb-5" id="how-it-works">
        <h2 class="wk-quick-link">How It Works</h2>
        <p>
            Scrollspy is implemented as a Svelte attachment using the <code>{`{@attach ...}`}</code> directive. It works by:
        </p>
        <ul>
            <li>Using the IntersectionObserver API to monitor when elements scroll into view</li>
            <li>Calling a callback function when elements intersect with the scrolling container</li>
            <li>Updating the active state of navigation elements based on the currently visible content</li>
        </ul>
        <p>To use Scrollspy, you need:</p>
        <ul>
            <li>A scrollable container element with the <code>{`{@attach scrollspy(...)}`}</code> directive</li>
            <li>A set of navigation elements (such as <code>Nav.Link</code>, <code>ListGroup.Item</code>, or simple anchors)</li>
            <li>
                Since we are using Svelte, it is not necessary to have content elements with IDs that match the <code>href</code> attributes of the navigation
                elements. However, it is a good practice to ensure that the IDs are unique and correspond to the navigation links.
            </li>
            <li>A callback function to update a Svelte state variable to control the active state of navigation elements.</li>
        </ul>
    </section>

    <section class="mb-5" id="navbar-example">
        <h2 class="wk-quick-link">Navbar Example</h2>
        <p>Use Scrollspy with a Bootstrap navbar to highlight the active section as you scroll down the page.</p>
        <div class="card mb-3">
            <div class="card-body">
                <Navbar.Root id="navbar-example2" class="bg-body-tertiary px-3 mb-3">
                    <Navbar.Brand href="#scrollspy-demo-link">Navbar</Navbar.Brand>
                    <Nav.Root itemStyle="pills">
                        <Nav.Item>
                            <Nav.Link href="#scrollspyHeading1" isActive={activeNavLinkId === 'scrollspyHeading1'}>First</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#scrollspyHeading2" isActive={activeNavLinkId === 'scrollspyHeading2'}>Second</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#scrollspyHeading3" isActive={activeNavLinkId === 'scrollspyHeading3'}>Third</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#scrollspyHeading4" isActive={activeNavLinkId === 'scrollspyHeading4'}>Fourth</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#scrollspyHeading5" isActive={activeNavLinkId === 'scrollspyHeading5'}>Fifth</Nav.Link>
                        </Nav.Item>
                    </Nav.Root>
                </Navbar.Root>
                <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                <div
                    {@attach scrollspy({
                        targetSelector: '#navbar-example',
                        callback: navbarCallback,
                        observerOptions: { rootMargin: '0px 0px -40%', threshold: 0.5 }
                    })}
                    class="bg-body-tertiary border mb-3 p-3 rounded-2 scrollspy-example"
                    tabindex="0"
                    role="presentation">
                    <h4 id="scrollspyHeading1">First heading</h4>
                    <p>
                        This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate navigation
                        link is highlighted. It's repeated throughout the component example. We keep adding some more example copy here to emphasize
                        the scrolling and highlighting.
                    </p>
                    <h4 id="scrollspyHeading2">Second heading</h4>
                    <p>
                        This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate navigation
                        link is highlighted. It's repeated throughout the component example. We keep adding some more example copy here to emphasize
                        the scrolling and highlighting.
                    </p>
                    <h4 id="scrollspyHeading3">Third heading</h4>
                    <p>
                        This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate navigation
                        link is highlighted. It's repeated throughout the component example. We keep adding some more example copy here to emphasize
                        the scrolling and highlighting.
                    </p>
                    <h4 id="scrollspyHeading4">Fourth heading</h4>
                    <p>
                        This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate navigation
                        link is highlighted. It's repeated throughout the component example. We keep adding some more example copy here to emphasize
                        the scrolling and highlighting.
                    </p>
                    <h4 id="scrollspyHeading5">Fifth heading</h4>
                    <p>
                        This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate navigation
                        link is highlighted. It's repeated throughout the component example. We keep adding some more example copy here to emphasize
                        the scrolling and highlighting.
                    </p>
                </div>
                <SyntaxHighlighter code={navbarScrollspyCode} />
            </div>
        </div>
    </section>

    <section class="mb-5" id="nested-nav-example">
        <h2 class="wk-quick-link">Nested Nav Example</h2>
        <p>
            Scrollspy also works with nested <code>Nav</code> components. When a nested nav item is active, its parent will also be active.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-4">
                        <Nav.Root
                            id="navbar-example3"
                            verticalBreakpoint="xs"
                            itemStyle="pills"
                            class="h-100 flex-column align-items-stretch pe-4 border-end">
                            <Nav.Link class="my-1" href="#item-1" isActive={activeNestedNavId?.includes('item-1')}>Item 1</Nav.Link>
                            <Nav.Root class="ms-3" verticalBreakpoint="xs" itemStyle="pills">
                                <Nav.Link class="my-1" href="#item-1-1" isActive={activeNestedNavId === 'item-1-1'}>Item 1-1</Nav.Link>
                                <Nav.Link class="my-1" href="#item-1-2" isActive={activeNestedNavId === 'item-1-2'}>Item 1-2</Nav.Link>
                            </Nav.Root>
                            <Nav.Link class="my-1" href="#item-2" isActive={activeNestedNavId === 'item-2'}>Item 2</Nav.Link>
                            <Nav.Link class="my-1" href="#item-3" isActive={activeNestedNavId?.includes('item-3')}>Item 3</Nav.Link>
                            <Nav.Root class="ms-3" verticalBreakpoint="xs" itemStyle="pills">
                                <Nav.Link class="my-1" href="#item-3-1" isActive={activeNestedNavId === 'item-3-1'}>Item 3-1</Nav.Link>
                                <Nav.Link class="my-1" href="#item-3-2" isActive={activeNestedNavId === 'item-3-2'}>Item 3-2</Nav.Link>
                            </Nav.Root>
                        </Nav.Root>
                    </div>
                    <div class="col-8">
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <div
                            {@attach scrollspy({
                                targetSelector: '#navbar-example3',
                                callback: nestedNavCallback,
                                observerOptions: { threshold: 0.5 }
                            })}
                            class="scrollspy-example-2 border rounded-2 p-3"
                            tabindex="0"
                            role="presentation">
                            <div id="item-1">
                                <h4>Item 1</h4>
                                <p>
                                    This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                    navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example
                                    copy here to emphasize the scrolling and highlighting.
                                </p>
                            </div>
                            <div id="item-1-1">
                                <h5>Item 1-1</h5>
                                <p>
                                    This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                    navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example
                                    copy here to emphasize the scrolling and highlighting.
                                </p>
                            </div>
                            <div id="item-1-2">
                                <h5>Item 1-2</h5>
                                <p>
                                    This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                    navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example
                                    copy here to emphasize the scrolling and highlighting.
                                </p>
                            </div>
                            <div id="item-2">
                                <h4>Item 2</h4>
                                <p>
                                    This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                    navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example
                                    copy here to emphasize the scrolling and highlighting.
                                </p>
                            </div>
                            <div id="item-3">
                                <h4>Item 3</h4>
                                <p>
                                    This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                    navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example
                                    copy here to emphasize the scrolling and highlighting.
                                </p>
                            </div>
                            <div id="item-3-1">
                                <h5>Item 3-1</h5>
                                <p>
                                    This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                    navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example
                                    copy here to emphasize the scrolling and highlighting.
                                </p>
                            </div>
                            <div id="item-3-2">
                                <h5>Item 3-2</h5>
                                <p>
                                    This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                    navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example
                                    copy here to emphasize the scrolling and highlighting.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mt-3">
                        <SyntaxHighlighter code={nestedNavScrollspyCode} />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="mb-5" id="list-group-example">
        <h2 class="wk-quick-link">List Group Example</h2>
        <p>
            Scrollspy works seamlessly with Bootstrap list groups. This example shows how to use Scrollspy with a <code>ListGroup</code> component.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-4">
                        <ListGroup.Root id="list-example">
                            <ListGroup.ItemAction
                                href="#list-item-1"
                                isActive={activeListGroupItemId === 'list-item-1'}
                                onclick={() => (activeListGroupItemId = 'list-item-1')}>Item 1</ListGroup.ItemAction>
                            <ListGroup.ItemAction
                                href="#list-item-2"
                                isActive={activeListGroupItemId === 'list-item-2'}
                                onclick={() => (activeListGroupItemId = 'list-item-2')}>Item 2</ListGroup.ItemAction>
                            <ListGroup.ItemAction
                                href="#list-item-3"
                                isActive={activeListGroupItemId === 'list-item-3'}
                                onclick={() => (activeListGroupItemId = 'list-item-3')}>Item 3</ListGroup.ItemAction>
                            <ListGroup.ItemAction
                                href="#list-item-4"
                                isActive={activeListGroupItemId === 'list-item-4'}
                                onclick={() => (activeListGroupItemId = 'list-item-4')}>Item 4</ListGroup.ItemAction>
                        </ListGroup.Root>
                    </div>
                    <div class="col-8">
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <div
                            {@attach scrollspy({
                                targetSelector: '#list-example',
                                callback: listGroupCallback,
                                observerOptions: { threshold: 0.5 }
                            })}
                            class="scrollspy-example border rounded-2 p-3"
                            tabindex="0"
                            role="presentation">
                            <h4 id="list-item-1">Item 1</h4>
                            <p>
                                This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example copy
                                here to emphasize the scrolling and highlighting.
                            </p>
                            <h4 id="list-item-2">Item 2</h4>
                            <p>
                                This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example copy
                                here to emphasize the scrolling and highlighting.
                            </p>
                            <h4 id="list-item-3">Item 3</h4>
                            <p>
                                This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example copy
                                here to emphasize the scrolling and highlighting.
                            </p>
                            <h4 id="list-item-4">Item 4</h4>
                            <p>
                                This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example copy
                                here to emphasize the scrolling and highlighting.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mt-3">
                        <SyntaxHighlighter code={listGroupScrollspyCode} />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="mb-5" id="simple-anchors-example">
        <h2 class="wk-quick-link">Simple Anchors Example</h2>
        <p>
            Scrollspy isn't limited to Nav components and list groups - it works with any anchor elements in the document. This example shows how to
            use Scrollspy with simple anchors.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-4">
                        <div class="d-flex flex-column gap-2 text-center" id="simple-items">
                            <a class="p-1 rounded" class:active={activeSimpleAnchorItemId === 'simple-item-1'} href="#simple-item-1"> Item 1 </a>
                            <a class="p-1 rounded" class:active={activeSimpleAnchorItemId === 'simple-item-2'} href="#simple-item-2"> Item 2 </a>
                            <a class="p-1 rounded" class:active={activeSimpleAnchorItemId === 'simple-item-3'} href="#simple-item-3"> Item 3 </a>
                            <a class="p-1 rounded" class:active={activeSimpleAnchorItemId === 'simple-item-4'} href="#simple-item-4"> Item 4 </a>
                            <a class="p-1 rounded" class:active={activeSimpleAnchorItemId === 'simple-item-5'} href="#simple-item-5"> Item 5 </a>
                        </div>
                    </div>
                    <div class="col-8">
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <div
                            {@attach scrollspy({
                                targetSelector: '#simple-items',
                                callback: simpleAnchorsCallback,
                                observerOptions: { threshold: 0.5 }
                            })}
                            class="scrollspy-example border rounded-2 p-3"
                            tabindex="0"
                            role="presentation">
                            <h4 id="simple-item-1">Item 1</h4>
                            <p>
                                This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example copy
                                here to emphasize the scrolling and highlighting.
                            </p>
                            <h4 id="simple-item-2">Item 2</h4>
                            <p>
                                This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example copy
                                here to emphasize the scrolling and highlighting.
                            </p>
                            <h4 id="simple-item-3">Item 3</h4>
                            <p>
                                This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example copy
                                here to emphasize the scrolling and highlighting.
                            </p>
                            <h4 id="simple-item-4">Item 4</h4>
                            <p>
                                This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example copy
                                here to emphasize the scrolling and highlighting.
                            </p>
                            <h4 id="simple-item-5">Item 5</h4>
                            <p>
                                This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate
                                navigation link is highlighted. It's repeated throughout the component example. We keep adding some more example copy
                                here to emphasize the scrolling and highlighting.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mt-3">
                        <SyntaxHighlighter code={simpleAnchorsScrollspyCode} />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="mb-5" id="api-reference">
        <h2 class="wk-quick-link">API Reference</h2>
        <h3>Scrollspy Attachment</h3>
        <p>
            The <code>scrollspy</code> function creates an attachment that can be applied to an element with the <code>{`{@attach ...}`}</code> directive.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <SyntaxHighlighter code={apiReferenceCode} />
            </div>
        </div>
        <h4>Options</h4>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>targetSelector</code></td>
                        <td><code>string</code></td>
                        <td>Required</td>
                        <td>CSS selector for elements to observe within the scrolling container</td>
                    </tr>
                    <tr>
                        <td><code>callback</code></td>
                        <td><code>IntersectionObserverCallback</code></td>
                        <td>Required</td>
                        <td>Function called when elements intersect with the container</td>
                    </tr>
                    <tr>
                        <td><code>observerOptions</code></td>
                        <td><code>IntersectionObserverInit</code></td>
                        <td
                            ><code
                                >&#123; <br />root:[scrollable container element],<br />rootMargin:'0px 0px -25%',<br />threshold:[0.1, 0.5, 1]<br />&#125;</code
                            ></td>
                        <td>
                            Configuration options for the IntersectionObserver. Can include <code>rootMargin</code>, <code>threshold</code>, etc. See
                            <a
                                href="https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver"
                                target="_blank"
                                rel="noopener noreferrer">MDN Documentation</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h4>Usage Notes</h4>
        <ul>
            <li>The scrollable container must have <code>overflow: auto</code> or <code>overflow: scroll</code> CSS applied</li>
            <li>For accessibility, give the scrollable container a <code>tabindex="0"</code> and a <code>role="presentation"</code></li>
            <li>Each target element must have an ID that corresponds to the <code>href</code> attributes in your navigation</li>
            <li>The callback should update state variables that control the <code>isActive</code> prop on navigation components</li>
        </ul>
    </section>
</div>

<style>
    .scrollspy-example {
        height: 200px;
        overflow: auto;
    }

    .scrollspy-example-2 {
        height: 350px;
        overflow: auto;
    }

    /* Style for active anchors in the simple anchors example */
    .active {
        background-color: #0d6efd;
        color: white;
    }

    a {
        text-decoration: none;
    }

    section {
        margin-bottom: 3rem;
    }

    .card {
        margin-bottom: 1rem;
    }
</style>

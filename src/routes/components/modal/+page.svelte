<script lang="ts">
    import { Button, Modal } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import ModalPlayground from './ModalPlayground.svelte';

    // Toggle states for examples
    let isBasicModalShown = $state(false);
    let isStaticModalShown = $state(false);
    let isLongContentModalShown = $state(false);
    let isLongContentWithScrollableModalShown = $state(false);
    let isVerticallyCenteredModalShown = $state(false);
    let isVerticallyCenteredWithScrollableModalShown = $state(false);
    let isToggleBetweenTwoModals1Shown = $state(false);
    let isToggleBetweenTwoModals2Shown = $state(false);
    let isWithoutFadeModalShown = $state(false);
    let isFullscreenModalShown = $state(false);
    let isGridModalShown = $state(false);

    // Sample code examples for demonstration
    const basicExampleCode = `<script>
    let isModalShown = $state(false);
\u003c/script>

<Button colorVariant="primary" onclick={() => isModalShown = true}>
    Launch demo modal
</Button>

<Modal.Root isShown={isModalShown} onHidden={() => isModalShown = false}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Modal body text goes here.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => isModalShown = false}>Close</Button>
                <Button colorVariant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>`;

    const staticBackdropExampleCode = `<script>
    let isModalShown = $state(false);
\u003c/script>

<Button colorVariant="primary" onclick={() => isModalShown = true}>
    Launch static backdrop modal
</Button>

<Modal.Root useBackdrop="static" isShown={isModalShown} onHidden={() => isModalShown = false}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Static backdrop modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>This modal has a static backdrop, meaning it doesn't close when clicking outside it.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => isModalShown = false}>Close</Button>
                <Button colorVariant="primary">Understood</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>`;

    const scrollingLongContentExampleCode = `<script>
    let isLongContentModalShown = $state(false);
    let isLongContentWithScrollableModalShown = $state(false);
\u003c/script>

<!-- Standard modal with long content -->
<Button colorVariant="primary" onclick={() => isLongContentModalShown = true}>
    Launch long content modal
</Button>

<Modal.Root isShown={isLongContentModalShown} onHidden={() => isLongContentModalShown = false}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Long content modal</Modal.Title>
            </Modal.Header>
            <Modal.Body style="min-height: 100vh">
                <!-- Very long content here -->
                <p>This is some placeholder content to show the scrolling behavior for modals.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => isLongContentModalShown = false}>Close</Button>
                <Button colorVariant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<!-- Scrollable modal -->
<Button colorVariant="primary" onclick={() => isLongContentWithScrollableModalShown = true}>
    Launch scrollable modal
</Button>

<Modal.Root isShown={isLongContentWithScrollableModalShown} onHidden={() => isLongContentWithScrollableModalShown = false}>
    <Modal.Dialog isScrollable={true}>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Scrollable modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <!-- Content that will scroll within the modal -->
                <p>This content will scroll within the modal while the header and footer remain fixed.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => isLongContentWithScrollableModalShown = false}>Close</Button>
                <Button colorVariant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>`;

    const verticallyCenteredExampleCode = `<script>
    let isVerticallyCenteredModalShown = $state(false);
    let isVerticallyCenteredWithScrollableModalShown = $state(false);
\u003c/script>

<!-- Vertically centered modal -->
<Button colorVariant="primary" onclick={() => isVerticallyCenteredModalShown = true}>
    Vertically centered modal
</Button>

<Modal.Root isShown={isVerticallyCenteredModalShown} onHidden={() => isVerticallyCenteredModalShown = false}>
    <Modal.Dialog isVerticallyCentered={true}>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Vertically centered modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>This modal is vertically centered in the viewport.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => isVerticallyCenteredModalShown = false}>Close</Button>
                <Button colorVariant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<!-- Vertically centered scrollable modal -->
<Button colorVariant="primary" onclick={() => isVerticallyCenteredWithScrollableModalShown = true}>
    Vertically centered scrollable modal
</Button>

<Modal.Root isShown={isVerticallyCenteredWithScrollableModalShown} onHidden={() => isVerticallyCenteredWithScrollableModalShown = false}>
    <Modal.Dialog isVerticallyCentered={true} isScrollable={true}>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Vertically centered scrollable modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>This modal is both vertically centered and scrollable.</p>
                <!-- Add more content to demonstrate scrolling -->
            </Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => isVerticallyCenteredWithScrollableModalShown = false}>Close</Button>
                <Button colorVariant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>`;

    const gridExampleCode = `<script>
    let isGridModalShown = $state(false);
\u003c/script>

<Button colorVariant="primary" onclick={() => isGridModalShown = true}>
    Launch modal with grid
</Button>

<Modal.Root isShown={isGridModalShown} onHidden={() => isGridModalShown = false}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Grid in Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4">.col-md-4</div>
                        <div class="col-md-4 ms-auto">.col-md-4 .ms-auto</div>
                    </div>
                    <div class="row">
                        <div class="col-md-3 ms-auto">.col-md-3 .ms-auto</div>
                        <div class="col-md-2 ms-auto">.col-md-2 .ms-auto</div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 ms-auto">.col-md-6 .ms-auto</div>
                    </div>
                    <div class="row">
                        <div class="col-sm-9">
                            Level 1: .col-sm-9
                            <div class="row">
                                <div class="col-8 col-sm-6">Level 2: .col-8 .col-sm-6</div>
                                <div class="col-4 col-sm-6">Level 2: .col-4 .col-sm-6</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => isGridModalShown = false}>Close</Button>
                <Button colorVariant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>`;

    const toggleBetweenModalsExampleCode = `<script>
    let isToggleBetweenTwoModals1Shown = $state(false);
    let isToggleBetweenTwoModals2Shown = $state(false);
\u003c/script>

<Button colorVariant="primary" onclick={() => isToggleBetweenTwoModals1Shown = true}>
    Open first modal
</Button>

<Modal.Root isShown={isToggleBetweenTwoModals1Shown} onHidden={() => isToggleBetweenTwoModals1Shown = false}>
    <Modal.Dialog isVerticallyCentered={true}>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Modal 1</Modal.Title>
            </Modal.Header>
            <Modal.Body>Show a second modal and hide this one with the button below.</Modal.Body>
            <Modal.Footer>
                <Button colorVariant="primary" onclick={() => { isToggleBetweenTwoModals1Shown = false; setTimeout(() => { isToggleBetweenTwoModals2Shown = true; }, 150); }}>
                    Open second modal
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<Modal.Root isShown={isToggleBetweenTwoModals2Shown} onHidden={() => isToggleBetweenTwoModals2Shown = false}>
    <Modal.Dialog isVerticallyCentered={true}>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Modal 2</Modal.Title>
            </Modal.Header>
            <Modal.Body>Hide this modal and show the first with the button below.</Modal.Body>
            <Modal.Footer>
                <Button colorVariant="primary" onclick={() => { isToggleBetweenTwoModals2Shown = false; setTimeout(() => { isToggleBetweenTwoModals1Shown = true; }, 150); }}>
                    Back to first
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>`;

    const withoutFadeExampleCode = `<script>
    let isWithoutFadeModalShown = $state(false);
\u003c/script>

<Button colorVariant="primary" onclick={() => isWithoutFadeModalShown = true}>
    Launch modal without fade
</Button>

<Modal.Root isShown={isWithoutFadeModalShown} useFade={false} onHidden={() => isWithoutFadeModalShown = false}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Modal without fade animation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>This modal appears without a fade animation.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => isWithoutFadeModalShown = false}>Close</Button>
                <Button colorVariant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>`;

    const fullscreenExampleCode = `<script>
    let isFullscreenModalShown = $state(false);
\u003c/script>

<Button colorVariant="primary" onclick={() => isFullscreenModalShown = true}>
    Launch fullscreen modal
</Button>

<Modal.Root isShown={isFullscreenModalShown} onHidden={() => isFullscreenModalShown = false}>
    <Modal.Dialog fullscreenOnBreakpoint="lg">
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={1} class="fs-5">Full screen below lg</Modal.Title>
            </Modal.Header>
            <Modal.Body><p>This modal is fullscreen on viewports smaller than the lg breakpoint.</p></Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => isFullscreenModalShown = false}>Close</Button>
                <Button colorVariant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<!-- Other fullscreen options -->
<!-- fullscreenOnBreakpoint="always" - Always fullscreen on all screens -->
<!-- fullscreenOnBreakpoint="sm" - Fullscreen below sm breakpoint -->
<!-- fullscreenOnBreakpoint="md" - Fullscreen below md breakpoint -->
<!-- fullscreenOnBreakpoint="xl" - Fullscreen below xl breakpoint -->
<!-- fullscreenOnBreakpoint="xxl" - Fullscreen below xxl breakpoint -->`;
</script>

<div class="container-fluid">
    <h1>Modal</h1>
    <p class="lead">Add dialogs to your site for lightboxes, user notifications, or completely custom content.</p>

    <hr class="my-5" />

    <!-- Interactive Playground -->
    <ModalPlayground />

    <hr class="my-5" />

    <section class="mb-5">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            The Modal component creates a dialog box that overlays the current page. It consists of several components that work together:
            <code>Modal.Root</code>, <code>Modal.Dialog</code>, <code>Modal.Content</code>, <code>Modal.Header</code>,
            <code>Modal.Title</code>, <code>Modal.Body</code>, and <code>Modal.Footer</code>.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <Button colorVariant="primary" onclick={() => (isBasicModalShown = true)}>Launch demo modal</Button>

                <Modal.Root isShown={isBasicModalShown} onHidden={() => (isBasicModalShown = false)}>
                    <Modal.Dialog>
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Modal title</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Modal body text goes here.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button colorVariant="secondary" onclick={() => (isBasicModalShown = false)}>Close</Button>
                                <Button colorVariant="primary">Save changes</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>
            </div>
        </div>

        <SyntaxHighlighter code={basicExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Static Backdrop</h2>
        <p>
            When you set <code>useBackdrop="static"</code>, the modal won't close when clicking outside it. This forces the user to interact with the
            modal dialog explicitly.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <Button colorVariant="primary" onclick={() => (isStaticModalShown = true)}>Launch static backdrop modal</Button>

                <Modal.Root isShown={isStaticModalShown} useBackdrop="static" onHidden={() => (isStaticModalShown = false)}>
                    <Modal.Dialog>
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Static modal</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>
                                    This modal has a static backdrop, which means it doesn't close when clicking outside it. You must click the close
                                    button or press escape to dismiss it.
                                </p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button colorVariant="secondary" onclick={() => (isStaticModalShown = false)}>Close</Button>
                                <Button colorVariant="primary">Understood</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>
            </div>
        </div>

        <SyntaxHighlighter code={staticBackdropExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Scrolling Long Content</h2>
        <p>
            When modals become too long for the user's viewport, they scroll independently. You can create scrollable modals by setting <code
                >isScrollable={true}</code> on the Modal.Dialog component.
        </p>

        <div class="card mb-3">
            <div class="card-body d-flex flex-wrap gap-2">
                <Button colorVariant="primary" class="me-2" onclick={() => (isLongContentModalShown = true)}>Long content modal</Button>
                <Button colorVariant="primary" onclick={() => (isLongContentWithScrollableModalShown = true)}>Scrollable modal</Button>

                <Modal.Root isShown={isLongContentModalShown} onHidden={() => (isLongContentModalShown = false)}>
                    <Modal.Dialog>
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Long content modal</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style="min-height: 100vh">
                                <p>
                                    This is some placeholder content to show the scrolling behavior for modals. Instead of repeating the text in the
                                    modal, we use an inline style to set a minimum height, thereby extending the length of the overall modal and
                                    demonstrating the overflow scrolling. When content becomes longer than the height of the viewport, scrolling will
                                    move the modal as needed.
                                </p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button colorVariant="secondary" onclick={() => (isLongContentModalShown = false)}>Close</Button>
                                <Button colorVariant="primary">Save changes</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>

                <Modal.Root isShown={isLongContentWithScrollableModalShown} onHidden={() => (isLongContentWithScrollableModalShown = false)}>
                    <Modal.Dialog isScrollable={true}>
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Long content modal with scrollable</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>
                                    This is some placeholder content to show the scrolling behavior for modals. We use repeated line breaks to
                                    demonstrate how content can exceed minimum inner height, thereby showing inner scrolling. When content becomes
                                    longer than the predefined max-height of modal, content will be cropped and scrollable within the modal.
                                </p>
                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                                <p>This content should appear at the bottom after you scroll.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button colorVariant="secondary" onclick={() => (isLongContentWithScrollableModalShown = false)}>Close</Button>
                                <Button colorVariant="primary">Save changes</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>
            </div>
        </div>

        <SyntaxHighlighter code={scrollingLongContentExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Vertically Centered</h2>
        <p>
            Add <code>isVerticallyCentered={true}</code> to the Modal.Dialog component to vertically center the modal in the viewport.
        </p>

        <div class="card mb-3">
            <div class="card-body d-flex flex-wrap gap-2">
                <Button colorVariant="primary" class="me-2" onclick={() => (isVerticallyCenteredModalShown = true)}>Vertically centered modal</Button>
                <Button colorVariant="primary" onclick={() => (isVerticallyCenteredWithScrollableModalShown = true)}
                    >Vertically centered scrollable</Button>

                <Modal.Root isShown={isVerticallyCenteredModalShown} onHidden={() => (isVerticallyCenteredModalShown = false)}>
                    <Modal.Dialog isVerticallyCentered={true}>
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Vertically centered modal</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>This is a vertically centered modal.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button colorVariant="secondary" onclick={() => (isVerticallyCenteredModalShown = false)}>Close</Button>
                                <Button colorVariant="primary">Save changes</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>

                <Modal.Root
                    isShown={isVerticallyCenteredWithScrollableModalShown}
                    onHidden={() => (isVerticallyCenteredWithScrollableModalShown = false)}>
                    <Modal.Dialog isVerticallyCentered={true} isScrollable={true}>
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Vertically centered scrollable modal</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>
                                    This is some placeholder content to show a vertically centered modal. We've added some extra copy here to show how
                                    vertically centering the modal works when combined with scrollable modals. We also use some repeated line breaks
                                    to quickly extend the height of the content, thereby triggering the scrolling. When content becomes longer than
                                    the predefined max-height of modal, content will be cropped and scrollable within the modal.
                                </p>
                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                                <p>Just like that.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button colorVariant="secondary" onclick={() => (isVerticallyCenteredWithScrollableModalShown = false)}>Close</Button>
                                <Button colorVariant="primary">Save changes</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>
            </div>
        </div>

        <SyntaxHighlighter code={verticallyCenteredExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Using the Grid System</h2>
        <p>
            You can use the Bootstrap grid system within modals by nesting <code>.container-fluid</code> within the <code>Modal.Body</code>. This
            gives you a flexible way to lay out modal content using the same grid system used elsewhere in Bootstrap.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <Button colorVariant="primary" onclick={() => (isGridModalShown = true)}>Launch modal with grid</Button>

                <Modal.Root isShown={isGridModalShown} onHidden={() => (isGridModalShown = false)}>
                    <Modal.Dialog>
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Grid in Modal</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div class="container-fluid bd-example-row">
                                    <div class="row">
                                        <div class="col-md-4">.col-md-4</div>
                                        <div class="col-md-4 ms-auto">.col-md-4 .ms-auto</div>
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col-md-3 ms-auto">.col-md-3 .ms-auto</div>
                                        <div class="col-md-2 ms-auto">.col-md-2 .ms-auto</div>
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col-md-6 ms-auto">.col-md-6 .ms-auto</div>
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col-sm-9">
                                            Level 1: .col-sm-9
                                            <div class="row">
                                                <div class="col-8 col-sm-6">Level 2: .col-8 .col-sm-6</div>
                                                <div class="col-4 col-sm-6">Level 2: .col-4 .col-sm-6</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button colorVariant="secondary" onclick={() => (isGridModalShown = false)}>Close</Button>
                                <Button colorVariant="primary">Save changes</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>
            </div>
        </div>

        <SyntaxHighlighter code={gridExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Toggle Between Modals</h2>
        <p>
            Toggle between multiple modals with some clever JavaScript by stacking them. Make sure to place the modal HTML in your code in the same
            order you'd like it to appear.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <Button colorVariant="primary" onclick={() => (isToggleBetweenTwoModals1Shown = true)}>Open first modal</Button>

                <Modal.Root isShown={isToggleBetweenTwoModals1Shown} onHidden={() => (isToggleBetweenTwoModals1Shown = false)}>
                    <Modal.Dialog isVerticallyCentered={true}>
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Modal 1</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Show a second modal and hide this one with the button below.</Modal.Body>
                            <Modal.Footer>
                                <Button
                                    colorVariant="primary"
                                    onclick={() => {
                                        isToggleBetweenTwoModals1Shown = false;
                                        setTimeout(() => {
                                            isToggleBetweenTwoModals2Shown = true;
                                        }, 350);
                                    }}>Open second modal</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>

                <Modal.Root isShown={isToggleBetweenTwoModals2Shown} onHidden={() => (isToggleBetweenTwoModals2Shown = false)}>
                    <Modal.Dialog isVerticallyCentered={true}>
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Modal 2</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Hide this modal and show the first with the button below.</Modal.Body>
                            <Modal.Footer>
                                <Button
                                    colorVariant="primary"
                                    onclick={() => {
                                        isToggleBetweenTwoModals2Shown = false;
                                        setTimeout(() => {
                                            isToggleBetweenTwoModals1Shown = true;
                                        }, 350);
                                    }}>Back to first</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>
            </div>
        </div>

        <SyntaxHighlighter code={toggleBetweenModalsExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Remove Animation</h2>
        <p>
            For modals that simply appear rather than fade in, set the <code>useFade</code> property to <code>false</code>.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <Button colorVariant="primary" onclick={() => (isWithoutFadeModalShown = true)}>Modal without fade</Button>

                <Modal.Root isShown={isWithoutFadeModalShown} useFade={false} onHidden={() => (isWithoutFadeModalShown = false)}>
                    <Modal.Dialog>
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Modal without fade animation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>This modal appears without a fade animation. Notice how it just appears instantly.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button colorVariant="secondary" onclick={() => (isWithoutFadeModalShown = false)}>Close</Button>
                                <Button colorVariant="primary">Save changes</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>
            </div>
        </div>

        <SyntaxHighlighter code={withoutFadeExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Fullscreen Modal</h2>
        <p>
            Another override is the option to have a modal fullscreen at particular breakpoints with the <code>fullscreenOnBreakpoint</code> property.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <Button colorVariant="primary" onclick={() => (isFullscreenModalShown = true)}>Full screen below lg</Button>

                <Modal.Root isShown={isFullscreenModalShown} onHidden={() => (isFullscreenModalShown = false)}>
                    <Modal.Dialog fullscreenOnBreakpoint="lg">
                        <Modal.Content>
                            <Modal.Header isDismissible={true}>
                                <Modal.Title level={1} class="fs-5">Full screen below lg</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>This modal is fullscreen on viewports narrower than the <code>lg</code> breakpoint.</p>
                                <p>Try resizing your browser window to see the effect. On smaller screens, it will take up the entire viewport.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button colorVariant="secondary" onclick={() => (isFullscreenModalShown = false)}>Close</Button>
                                <Button colorVariant="primary">Save changes</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Dialog>
                </Modal.Root>
            </div>
        </div>

        <p class="mt-3">
            Available <code>fullscreenOnBreakpoint</code> options:
        </p>
        <ul>
            <li><code>"always"</code> - Always fullscreen on all screens</li>
            <li><code>"sm"</code> - Fullscreen below sm breakpoint</li>
            <li><code>"md"</code> - Fullscreen below md breakpoint</li>
            <li><code>"lg"</code> - Fullscreen below lg breakpoint</li>
            <li><code>"xl"</code> - Fullscreen below xl breakpoint</li>
            <li><code>"xxl"</code> - Fullscreen below xxl breakpoint</li>
        </ul>

        <SyntaxHighlighter code={fullscreenExampleCode} />
    </section>

    <hr class="my-5" />

    <!-- API Reference Section -->
    <section class="mb-5">
        <h2 id="api">API Reference</h2>

        <section class="mb-4">
            <h3>Modal.Root Props</h3>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
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
                            <td>Auto-generated</td>
                            <td>Unique identifier for the offcanvas</td>
                        </tr>
                        <tr>
                            <td><code>isFocusable</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Determines if the modal should receive focus when shown.</td>
                        </tr>
                        <tr>
                            <td><code>isKeyboardDismissible</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Determines if the modal can be dismissed using the Escape key.</td>
                        </tr>
                        <tr>
                            <td><code>isShown</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Controls whether the modal is displayed or hidden.</td>
                        </tr>
                        <tr>
                            <td><code>onHide</code></td>
                            <td><code>EventListener</code></td>
                            <td>-</td>
                            <td>Callback function to execute when the modal begins to hide.</td>
                        </tr>
                        <tr>
                            <td><code>onHidePrevented</code></td>
                            <td><code>EventListener</code></td>
                            <td>-</td>
                            <td>Callback function to execute when the modal hide is prevented.</td>
                        </tr>
                        <tr>
                            <td><code>onHidden</code></td>
                            <td><code>EventListener</code></td>
                            <td>-</td>
                            <td>Callback function to execute when the modal has been hidden.</td>
                        </tr>
                        <tr>
                            <td><code>onShow</code></td>
                            <td><code>EventListener</code></td>
                            <td>-</td>
                            <td>Callback function to execute when the modal begins to show.</td>
                        </tr>
                        <tr>
                            <td><code>onShown</code></td>
                            <td><code>EventListener</code></td>
                            <td>-</td>
                            <td>Callback function to execute when the modal has been shown.</td>
                        </tr>
                        <tr>
                            <td><code>useBackdrop</code></td>
                            <td><code>'static' | boolean</code></td>
                            <td><code>true</code></td>
                            <td
                                >Controls the modal backdrop behavior. When set to <code>'static'</code>, the modal won't close when clicking outside
                                it.</td>
                        </tr>
                        <tr>
                            <td><code>useFade</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Controls whether the modal uses a fade animation when opening and closing.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h3>Modal.Content Props</h3>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
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
                            <td>Auto-generated</td>
                            <td>Unique identifier for the offcanvas</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h3>Modal.Dialog Props</h3>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
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
                            <td><code>fullscreenOnBreakpoint</code></td>
                            <td><code>'always' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'</code></td>
                            <td>-</td>
                            <td>Makes the modal fullscreen below the specified breakpoint.</td>
                        </tr>
                        <tr>
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td>Auto-generated</td>
                            <td>Unique identifier for the offcanvas</td>
                        </tr>
                        <tr>
                            <td><code>isScrollable</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>When set to <code>true</code>, the modal body becomes scrollable while the header and footer remain fixed.</td>
                        </tr>
                        <tr>
                            <td><code>isVerticallyCentered</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>When set to <code>true</code>, the modal is vertically centered in the viewport.</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td><code>'sm' | 'lg' | 'xl'</code></td>
                            <td>-</td>
                            <td>Controls the size of the modal. Default is medium size.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h3>Modal.Footer Props</h3>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
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
                            <td>Auto-generated</td>
                            <td>Unique identifier for the offcanvas</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h3>Modal.Header Props</h3>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
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
                            <td>Auto-generated</td>
                            <td>Unique identifier for the offcanvas</td>
                        </tr>
                        <tr>
                            <td><code>isDismissible</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>When set to <code>true</code>, a close button (×) is added to the header that will close the modal.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h3>Modal.Title Props</h3>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
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
                            <td>Auto-generated</td>
                            <td>Unique identifier for the offcanvas</td>
                        </tr>
                        <tr>
                            <td><code>level</code></td>
                            <td><code>1 | 2 | 3 | 4 | 5 | 6</code></td>
                            <td><code>4</code></td>
                            <td>The heading level to use (h1-h6).</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h3>CSS Classes</h3>
            <p>These classes can be used to customize the modal components:</p>

            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Applied to</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>.modal</code></td>
                            <td>Modal.Root</td>
                            <td>Main container for the modal.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-dialog</code></td>
                            <td>Modal.Dialog</td>
                            <td>Container for modal content that positions the modal in the viewport.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-content</code></td>
                            <td>Modal.Content</td>
                            <td>Container for the modal's header, body, and footer.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-header</code></td>
                            <td>Modal.Header</td>
                            <td>Container for the modal title and close button.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-title</code></td>
                            <td>Modal.Title</td>
                            <td>Styles the modal title.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-body</code></td>
                            <td>Modal.Body</td>
                            <td>Container for modal content.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-footer</code></td>
                            <td>Modal.Footer</td>
                            <td>Container for modal actions (usually buttons).</td>
                        </tr>
                        <tr>
                            <td><code>.modal-dialog-scrollable</code></td>
                            <td>Modal.Dialog</td>
                            <td>Makes the modal body scrollable.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-dialog-centered</code></td>
                            <td>Modal.Dialog</td>
                            <td>Vertically centers the modal in the viewport.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-sm</code></td>
                            <td>Modal.Dialog</td>
                            <td>Creates a small modal.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-lg</code></td>
                            <td>Modal.Dialog</td>
                            <td>Creates a large modal.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-xl</code></td>
                            <td>Modal.Dialog</td>
                            <td>Creates an extra-large modal.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-fullscreen</code></td>
                            <td>Modal.Dialog</td>
                            <td>Creates a fullscreen modal.</td>
                        </tr>
                        <tr>
                            <td><code>.modal-fullscreen-[breakpoint]-down</code></td>
                            <td>Modal.Dialog</td>
                            <td>Creates a modal that's fullscreen below a specific breakpoint.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </section>
</div>

<style>
    .bd-example-row [class^='col'] {
        --bd-violet-rgb: 113, 44, 249;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        background-color: rgba(var(--bd-violet-rgb), 0.15);
        border: 1px solid rgba(var(--bd-violet-rgb), 0.3);
    }
    .bd-example-row .row + .row {
        margin-top: 1rem;
    }
</style>

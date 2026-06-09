<script lang="ts">
    import CloseButton from '$lib/CloseButton/close-button.svelte';
    import { Button, Toast } from '$lib/index.js';
    import { onMount } from 'svelte';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import ToastPlayground from './ToastPlayground.svelte';

    // Toggle states for examples
    let isBasicToastShown = $state(false);
    let isStackedToastShown = $state(false);
    let isStackedToast1Shown = $state(false);
    let isStackedToast2Shown = $state(false);
    let isNoFadeToastShown = $state(false);
    let isCustomDelayShown = $state(false);
    let isCustomContentShown = $state(false);
    let isCustomContent1Shown = $state(false);
    let isCustomContent2Shown = $state(false);
    let isColorSchemeShown = $state(false);
    let isColorScheme1Shown = $state(false);
    let isColorScheme2Shown = $state(false);

    let toastDelay = $state(10000);
    let countdownSeconds = $state(10);
    let countdownInterval = $state<number | null>(null);

    // Clear countdown timer
    function clearCountdown() {
        if (countdownInterval !== null) {
            window.clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    // Clean up interval when component is destroyed
    onMount(() => {
        return () => clearCountdown();
    });

    // Stop countdown when toast is hidden
    $effect(() => {
        if (!isCustomDelayShown) {
            clearCountdown();
        }
    });

    // Start countdown timer
    function startCountdown() {
        // Clear any existing interval
        clearCountdown();

        // Set initial countdown value
        countdownSeconds = Math.ceil(toastDelay / 1000);

        // Start new countdown
        countdownInterval = window.setInterval(() => {
            countdownSeconds--;
            if (countdownSeconds <= 0) {
                clearCountdown();
            }
        }, 1000);
    }

    function handleStackedToastClick() {
        isStackedToastShown = !isStackedToastShown;
        isStackedToast1Shown = isStackedToastShown;
        isStackedToast2Shown = isStackedToastShown;
    }

    function handleStackedToast1Hidden() {
        isStackedToast1Shown = false;
        if (!isStackedToast1Shown && !isStackedToast2Shown) {
            isStackedToastShown = false;
        }
    }

    function handleStackedToast2Hidden() {
        isStackedToast2Shown = false;
        if (!isStackedToast1Shown && !isStackedToast2Shown) {
            isStackedToastShown = false;
        }
    }

    function handleCustomContentClick() {
        isCustomContentShown = !isCustomContentShown;
        isCustomContent1Shown = isCustomContentShown;
        isCustomContent2Shown = isCustomContentShown;
    }

    function handleCustomContent1Hidden() {
        isCustomContent1Shown = false;
        if (!isCustomContent1Shown && !isCustomContent2Shown) {
            isCustomContentShown = false;
        }
    }

    function handleCustomContent2Hidden() {
        isCustomContent2Shown = false;
        if (!isCustomContent1Shown && !isCustomContent2Shown) {
            isCustomContentShown = false;
        }
    }

    function handleColorSchemeClick() {
        isColorSchemeShown = !isColorSchemeShown;
        isColorScheme1Shown = isColorSchemeShown;
        isColorScheme2Shown = isColorSchemeShown;
    }

    function handleColorScheme1Hidden() {
        isColorScheme1Shown = false;
        if (!isColorScheme1Shown && !isColorScheme2Shown) {
            isColorSchemeShown = false;
        }
    }

    function handleColorScheme2Hidden() {
        isColorScheme2Shown = false;
        if (!isColorScheme1Shown && !isColorScheme2Shown) {
            isColorSchemeShown = false;
        }
    }

    // Sample code examples for demonstration
    const basicExampleCode = `<Button id="liveToastBtn" colorVariant="primary" onclick={() => isToastShown = true}>
    Show live toast
</Button>

<Toast.Container isFixed placement="bottom-end">
    <Toast.Root isShown={isBasicToastShown} doAutohide={true} delay={5000}>
        <Toast.Header>
            <strong class="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
    </Toast.Root>
</Toast.Container>`;

    const stackingExampleCode = `<Toast.Container position="bottom-end">
    <Toast.Root isShown={true}>
        <Toast.Header>
            <strong class="me-auto">Bootstrap</strong>
            <small class="text-body-secondary">just now</small>
        </Toast.Header>
        <Toast.Body>See? Just like this.</Toast.Body>
    </Toast.Root>

    <Toast.Root isShown={true}>
        <Toast.Header>
            <strong class="me-auto">Bootstrap</strong>
            <small class="text-body-secondary">2 seconds ago</small>
        </Toast.Header>
        <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
    </Toast.Root>
</Toast.Container>`;

    const autohideExampleCode = `<Toast.Root doAutohide={false}>
    <Toast.Header>
        <strong class="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
    </Toast.Header>
    <Toast.Body>This toast won't auto-hide</Toast.Body>
</Toast.Root>`;

    const customDelayExampleCode = `<Toast.Root delay={10000}>
    <Toast.Header>
        <strong class="me-auto">Bootstrap</strong>
        <small>just now</small>
    </Toast.Header>
    <Toast.Body>This toast will hide after 10 seconds</Toast.Body>
</Toast.Root>`;

    const customContentExampleCode = `<!-- Simple, no header example -->
<Toast.Root isShown={isCustomContent1Shown}>
    <div class="d-flex">
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
        <CloseButton class="me-2 m-auto" onclick={() => (isCustomContent1Shown = false)} />
    </div>
</Toast.Root>

<!-- With action buttons -->
<Toast.Root isShown={isCustomContent2Shown}>
    <Toast.Body>
        Hello, world! This is a toast message.
        <div class="mt-2 pt-2 border-top">
            <Button colorVariant="primary" size="sm">Take action</Button>
            <Button colorVariant="secondary" size="sm" class="ms-2" onclick={() => (isCustomContent2Shown = false)}>Close</Button>
        </div>
    </Toast.Body>
</Toast.Root>`;

    const colorSchemeExampleCode = `<Toast.Root isShown={isColorScheme1Shown} class="text-bg-primary border-0">
    <div class="d-flex">
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
        <CloseButton class="btn-close-white me-2 m-auto" onclick={() => (isColorScheme1Shown = false)} />
    </div>
</Toast.Root>

<Toast.Root isShown={isColorScheme2Shown} class="text-bg-success border-0">
    <div class="d-flex">
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
        <CloseButton class="btn-close-white me-2 m-auto" onclick={() => (isColorScheme2Shown = false)} />
    </div>
</Toast.Root>`;

    const placementExampleCode = `<!-- Top left -->
<Toast.Container position="top-start">
    <Toast.Root isShown={true}>...</Toast.Root>
</Toast.Container>

<!-- Top center -->
<Toast.Container position="top-center">
    <Toast.Root isShown={true}>...</Toast.Root>
</Toast.Container>

<!-- Top right -->
<Toast.Container position="top-end">
    <Toast.Root isShown={true}>...</Toast.Root>
</Toast.Container>

<!-- Middle left -->
<Toast.Container position="middle-start">
    <Toast.Root isShown={true}>...</Toast.Root>
</Toast.Container>

<!-- Middle center -->
<Toast.Container position="middle-center">
    <Toast.Root isShown={true}>...</Toast.Root>
</Toast.Container>

<!-- Middle right -->
<Toast.Container position="middle-end">
    <Toast.Root isShown={true}>...</Toast.Root>
</Toast.Container>

<!-- Bottom left -->
<Toast.Container position="bottom-start">
    <Toast.Root isShown={true}>...</Toast.Root>
</Toast.Container>

<!-- Bottom center -->
<Toast.Container position="bottom-center">
    <Toast.Root isShown={true}>...</Toast.Root>
</Toast.Container>

<!-- Bottom right -->
<Toast.Container position="bottom-end">
    <Toast.Root isShown={true}>...</Toast.Root>
</Toast.Container>`;

    const noFadeExampleCode = `<Toast.Root isShown={true} useFade={false}>
    <Toast.Header>
        <strong class="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
    </Toast.Header>
    <Toast.Body>This toast appears without fade transition</Toast.Body>
</Toast.Root>`;

    const _toastImportCode = `import { Toast } from 'bootstrap-svelte';`;
</script>

<div class="container-fluid">
    <h1>Toasts</h1>
    <p class="lead">Push notifications to your visitors with a toast, a lightweight and easily customizable alert message using Svelte components.</p>

    <hr class="my-5" />

    <!-- Interactive Playground -->
    <ToastPlayground />

    <hr class="my-5" />

    <section class="mb-5">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>Toasts are opt-in for performance reasons, so you must activate them yourself.</p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Button id="basic-toast-btn" colorVariant="primary" onclick={() => (isBasicToastShown = true)}>Show toast</Button>

                    <Toast.Container isFixed placement="bottom-end">
                        <Toast.Root isShown={isBasicToastShown} doAutohide={true} delay={5000}>
                            <Toast.Header>
                                <strong class="me-auto">Bootstrap</strong>
                                <small>11 mins ago</small>
                            </Toast.Header>
                            <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
                        </Toast.Root>
                    </Toast.Container>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={basicExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Stacking</h2>
        <p>You can stack multiple toasts by wrapping them in a toast container.</p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Button colorVariant="primary" onclick={handleStackedToastClick}>
                        {isStackedToastShown ? 'Hide' : 'Show'} stacked toasts
                    </Button>

                    {#if isStackedToastShown}
                        <div class="d-flex flex-column gap-3 mt-3">
                            <Toast.Container isFixed={false}>
                                <Toast.Root isShown={isStackedToast1Shown} doAutohide={false} onHidden={handleStackedToast1Hidden}>
                                    <Toast.Header>
                                        <strong class="me-auto">Bootstrap</strong>
                                        <small class="text-body-secondary">just now</small>
                                    </Toast.Header>
                                    <Toast.Body>See? Just like this.</Toast.Body>
                                </Toast.Root>

                                <Toast.Root isShown={isStackedToast2Shown} doAutohide={false} onHidden={handleStackedToast2Hidden}>
                                    <Toast.Header>
                                        <strong class="me-auto">Bootstrap</strong>
                                        <small class="text-body-secondary">2 seconds ago</small>
                                    </Toast.Header>
                                    <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
                                </Toast.Root>
                            </Toast.Container>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={stackingExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Auto-hide behavior</h2>
        <p>Toasts will automatically hide if you do not specify <code>doAutohide={false}</code>. You can also customize the delay.</p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex flex-wrap gap-3">
                    <div class="mb-3">
                        <h6>Auto-hide disabled:</h6>
                        <Toast.Root isShown={true} doAutohide={false}>
                            <Toast.Header>
                                <strong class="me-auto">Bootstrap</strong>
                                <small>11 mins ago</small>
                            </Toast.Header>
                            <Toast.Body>This toast won't auto-hide</Toast.Body>
                        </Toast.Root>
                    </div>

                    <div class="mb-3">
                        <h6>Custom delay (10 seconds):</h6>
                        <Toast.Root isShown={isCustomDelayShown} delay={10000} onHidden={() => (isCustomDelayShown = false)}>
                            <Toast.Header>
                                <strong class="me-auto">Bootstrap</strong>
                                <small
                                    >just now
                                    {#if isCustomDelayShown && countdownSeconds > 0}
                                        <span class="ms-1 text-muted">({countdownSeconds}s)</span>
                                    {/if}
                                </small>
                            </Toast.Header>
                            <Toast.Body>This toast will hide after 10 seconds</Toast.Body>
                        </Toast.Root>
                        {#if !isCustomDelayShown}
                            <Button
                                colorVariant="primary"
                                onclick={() => {
                                    isCustomDelayShown = true;
                                    startCountdown();
                                }}>Start custom delay</Button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <h5>Disable auto-hide</h5>
                <SyntaxHighlighter code={autohideExampleCode} />
            </div>
            <div class="col-md-6">
                <h5>Custom delay</h5>
                <SyntaxHighlighter code={customDelayExampleCode} />
            </div>
        </div>
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Custom Content</h2>
        <p>Customize your toasts by removing sub-components, tweaking them with utilities, or adding your own markup.</p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Button colorVariant="primary" onclick={handleCustomContentClick}>
                        {isCustomContentShown ? 'Hide' : 'Show'} custom content examples
                    </Button>

                    {#if isCustomContentShown}
                        <div class="d-flex flex-column gap-3 mt-3">
                            <Toast.Root isShown={isCustomContent1Shown} onHidden={handleCustomContent1Hidden}>
                                <div class="d-flex">
                                    <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
                                    <CloseButton class="me-2 m-auto" onclick={() => handleCustomContent1Hidden()} />
                                </div>
                            </Toast.Root>

                            <Toast.Root isShown={isCustomContent2Shown} onHidden={handleCustomContent2Hidden}>
                                <Toast.Body>
                                    Hello, world! This is a toast message.
                                    <div class="mt-2 pt-2 border-top">
                                        <Button colorVariant="primary" size="sm">Take action</Button>
                                        <Button colorVariant="secondary" size="sm" class="ms-2" onclick={() => handleCustomContent2Hidden()}
                                            >Close</Button>
                                    </div>
                                </Toast.Body>
                            </Toast.Root>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={customContentExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Color Schemes</h2>
        <p>You can create different toast color schemes with our color and background utilities.</p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-0">
                    <Button class="mb-3" colorVariant="primary" onclick={handleColorSchemeClick}>
                        {isColorSchemeShown ? 'Hide' : 'Show'} color scheme examples
                    </Button>

                    {#if isColorSchemeShown}
                        <div class="d-flex flex-column gap-2">
                            <Toast.Root isShown={isColorScheme1Shown} class="text-bg-primary border-0" onHidden={handleColorScheme1Hidden}>
                                <div class="d-flex">
                                    <Toast.Body>Hello, world! This is a primary toast.</Toast.Body>
                                    <CloseButton class="btn-close-white me-2 m-auto" onclick={() => handleColorScheme1Hidden()} />
                                </div>
                            </Toast.Root>

                            <Toast.Root isShown={isColorScheme2Shown} class="text-bg-success border-0" onHidden={handleColorScheme2Hidden}>
                                <div class="d-flex">
                                    <Toast.Body>Hello, world! This is a success toast.</Toast.Body>
                                    <CloseButton class="btn-close-white me-2 m-auto" onclick={() => handleColorScheme2Hidden()} />
                                </div>
                            </Toast.Root>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={colorSchemeExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">No Fade Effect</h2>
        <p>You can disable the fade transition for toasts.</p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Button id="no-fade-toast-btn" colorVariant="primary" onclick={() => (isNoFadeToastShown = !isNoFadeToastShown)}>
                        {isNoFadeToastShown ? 'Hide' : 'Show'} toast without fade
                    </Button>

                    {#if isNoFadeToastShown}
                        <div class="mt-3">
                            <Toast.Root isShown={true} useFade={false} onHidden={() => (isNoFadeToastShown = false)}>
                                <Toast.Header>
                                    <strong class="me-auto">Bootstrap</strong>
                                    <small>11 mins ago</small>
                                </Toast.Header>
                                <Toast.Body>This toast appears without fade transition</Toast.Body>
                            </Toast.Root>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={noFadeExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Placement</h2>
        <p>
            Place toasts with the <code>Toast.Container</code> component using the <code>position</code> prop. The <code>position</code> prop accepts:
            <code>top-start</code>, <code>top-center</code>, <code>top-end</code>,
            <code>middle-start</code>, <code>middle-center</code>, <code>middle-end</code>, <code>bottom-start</code>,
            <code>bottom-center</code>, or <code>bottom-end</code>.
        </p>

        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <div class="bg-body-secondary position-relative p-3" style="min-height: 350px;">
                        <Toast.Container placement="top-start" isFixed={false}>
                            <Toast.Root isShown={true} doAutohide={false}>
                                <Toast.Header>
                                    <strong class="me-auto">Top Left</strong>
                                </Toast.Header>
                                <Toast.Body>top-start</Toast.Body>
                            </Toast.Root>
                        </Toast.Container>
                        <Toast.Container placement="top-center" isFixed={false}>
                            <Toast.Root isShown={true} doAutohide={false}>
                                <Toast.Header>
                                    <strong class="me-auto">Top Center</strong>
                                </Toast.Header>
                                <Toast.Body>top-center</Toast.Body>
                            </Toast.Root>
                        </Toast.Container>
                        <Toast.Container placement="top-end" isFixed={false}>
                            <Toast.Root isShown={true} doAutohide={false}>
                                <Toast.Header>
                                    <strong class="me-auto">Top Right</strong>
                                </Toast.Header>
                                <Toast.Body>top-end</Toast.Body>
                            </Toast.Root>
                        </Toast.Container>
                        <Toast.Container placement="middle-start" isFixed={false}>
                            <Toast.Root isShown={true} doAutohide={false}>
                                <Toast.Header>
                                    <strong class="me-auto">Middle Left</strong>
                                </Toast.Header>
                                <Toast.Body>middle-start</Toast.Body>
                            </Toast.Root>
                        </Toast.Container>
                        <Toast.Container placement="middle-center" isFixed={false}>
                            <Toast.Root isShown={true} doAutohide={false}>
                                <Toast.Header>
                                    <strong class="me-auto">Middle Center</strong>
                                </Toast.Header>
                                <Toast.Body>middle-center</Toast.Body>
                            </Toast.Root>
                        </Toast.Container>
                        <Toast.Container placement="middle-end" isFixed={false}>
                            <Toast.Root isShown={true} doAutohide={false}>
                                <Toast.Header>
                                    <strong class="me-auto">Middle Right</strong>
                                </Toast.Header>
                                <Toast.Body>middle-end</Toast.Body>
                            </Toast.Root>
                        </Toast.Container>
                        <Toast.Container placement="bottom-start" isFixed={false}>
                            <Toast.Root isShown={true} doAutohide={false}>
                                <Toast.Header>
                                    <strong class="me-auto">Bottom Left</strong>
                                </Toast.Header>
                                <Toast.Body>bottom-start</Toast.Body>
                            </Toast.Root>
                        </Toast.Container>
                        <Toast.Container placement="bottom-center" isFixed={false}>
                            <Toast.Root isShown={true} doAutohide={false}>
                                <Toast.Header>
                                    <strong class="me-auto">Bottom Center</strong>
                                </Toast.Header>
                                <Toast.Body>bottom-center</Toast.Body>
                            </Toast.Root>
                        </Toast.Container>
                        <Toast.Container placement="bottom-end" isFixed={false}>
                            <Toast.Root isShown={true} doAutohide={false}>
                                <Toast.Header>
                                    <strong class="me-auto">Bottom Right</strong>
                                </Toast.Header>
                                <Toast.Body>bottom-end</Toast.Body>
                            </Toast.Root>
                        </Toast.Container>
                    </div>
                </div>
            </div>
        </div>

        <SyntaxHighlighter code={placementExampleCode} />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Accessibility</h2>
        <p>
            Toasts are status messages, not modal dialogs. Render the toast container before updating the toast content so assistive technologies can
            detect the change in a live region.
        </p>

        <p>Match the announcement priority to the content:</p>
        <ul>
            <li>Use <code>role="status"</code> with <code>aria-live="polite"</code> for routine confirmations and background updates.</li>
            <li>Use <code>role="alert"</code> with <code>aria-live="assertive"</code> only for urgent messages that need immediate attention.</li>
            <li>Keep <code>aria-atomic="true"</code> so the whole toast is announced as one message.</li>
        </ul>

        <div class="alert alert-info">
            <strong>Timing:</strong> Avoid auto-hiding important, interactive, or lengthy messages. When a toast does auto-hide, give users enough time
            to read it, pause the timer while the toast is hovered or focused, and provide a visible dismiss control for persistent messages.
        </div>

        <p>
            Do not move focus to a toast just because it appears. Keep keyboard focus where the user is working unless the toast contains an action
            that the user explicitly opened or must complete. If a toast includes buttons or links, make sure it remains visible while focus is inside
            it and can be dismissed without requiring pointer input.
        </p>
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">API Reference</h2>

        <div class="card mb-4">
            <div class="card-header">
                <h3 class="h5 mb-0">Toast.Root Props</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm table-striped mb-0">
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
                                <td><code>children</code></td>
                                <td><code>Snippet</code></td>
                                <td><code>undefined</code></td>
                                <td>Content to display inside the toast</td>
                            </tr>
                            <tr>
                                <td><code>delay</code></td>
                                <td><code>number</code></td>
                                <td><code>5000</code></td>
                                <td>Delay in milliseconds before hiding the toast</td>
                            </tr>
                            <tr>
                                <td><code>doAutohide</code></td>
                                <td><code>boolean</code></td>
                                <td><code>true</code></td>
                                <td>Whether the toast should automatically hide after the delay</td>
                            </tr>
                            <tr>
                                <td><code>elementRef</code></td>
                                <td><code>HTMLElement</code></td>
                                <td><code>null</code></td>
                                <td>Reference to the toast DOM element</td>
                            </tr>
                            <tr>
                                <td><code>id</code></td>
                                <td><code>string</code></td>
                                <td><code>toast-[uid]</code></td>
                                <td>ID for the toast element</td>
                            </tr>
                            <tr>
                                <td><code>isShown</code></td>
                                <td><code>boolean</code></td>
                                <td><code>false</code></td>
                                <td>Controls whether the toast is visible</td>
                            </tr>
                            <tr>
                                <td><code>onHide</code></td>
                                <td><code>Function</code></td>
                                <td><code>noop</code></td>
                                <td>Function called when the toast starts hiding</td>
                            </tr>
                            <tr>
                                <td><code>onHidden</code></td>
                                <td><code>Function</code></td>
                                <td><code>noop</code></td>
                                <td>Function called after the toast is fully hidden</td>
                            </tr>
                            <tr>
                                <td><code>onShow</code></td>
                                <td><code>Function</code></td>
                                <td><code>noop</code></td>
                                <td>Function called when the toast starts showing</td>
                            </tr>
                            <tr>
                                <td><code>onShown</code></td>
                                <td><code>Function</code></td>
                                <td><code>noop</code></td>
                                <td>Function called after the toast is fully shown</td>
                            </tr>
                            <tr>
                                <td><code>useFade</code></td>
                                <td><code>boolean</code></td>
                                <td><code>true</code></td>
                                <td>Whether the toast should use a fade transition</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h3 class="h5 mb-0">Toast.Header Props</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm table-striped mb-0">
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
                                <td><code>children</code></td>
                                <td><code>Snippet</code></td>
                                <td><code>undefined</code></td>
                                <td>Content to display inside the header</td>
                            </tr>
                            <tr>
                                <td><code>elementRef</code></td>
                                <td><code>HTMLElement</code></td>
                                <td><code>null</code></td>
                                <td>Reference to the header DOM element</td>
                            </tr>
                            <tr>
                                <td><code>id</code></td>
                                <td><code>string</code></td>
                                <td><code>toast-header-[uid]</code></td>
                                <td>ID for the header element</td>
                            </tr>
                            <tr>
                                <td><code>isDismissible</code></td>
                                <td><code>boolean</code></td>
                                <td><code>true</code></td>
                                <td>Whether to show a close button</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h3 class="h5 mb-0">Toast.Body Props</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm table-striped mb-0">
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
                                <td><code>children</code></td>
                                <td><code>Snippet</code></td>
                                <td><code>undefined</code></td>
                                <td>Content to display inside the body</td>
                            </tr>
                            <tr>
                                <td><code>elementRef</code></td>
                                <td><code>HTMLElement</code></td>
                                <td><code>null</code></td>
                                <td>Reference to the body DOM element</td>
                            </tr>
                            <tr>
                                <td><code>id</code></td>
                                <td><code>string</code></td>
                                <td><code>toast-body-[uid]</code></td>
                                <td>ID for the body element</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h3 class="h5 mb-0">Toast.Container Props</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm table-striped mb-0">
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
                                <td><code>children</code></td>
                                <td><code>Snippet</code></td>
                                <td><code>undefined</code></td>
                                <td>Toast components to display inside the container</td>
                            </tr>
                            <tr>
                                <td><code>elementRef</code></td>
                                <td><code>HTMLElement</code></td>
                                <td><code>null</code></td>
                                <td>Reference to the container DOM element</td>
                            </tr>
                            <tr>
                                <td><code>id</code></td>
                                <td><code>string</code></td>
                                <td><code>toast-container-[uid]</code></td>
                                <td>ID for the container element</td>
                            </tr>
                            <tr>
                                <td><code>position</code></td>
                                <td><code>string</code></td>
                                <td><code>'bottom-end'</code></td>
                                <td
                                    >Position of the container in the viewport. Options include: 'top-start', 'top-center', 'top-end', 'middle-start',
                                    'middle-center', 'middle-end', 'bottom-start', 'bottom-center', 'bottom-end'</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h3 class="h5 mb-0">CSS Classes</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm table-striped mb-0">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr>
                                <td><code>.toast</code></td>
                                <td>Main container class for the toast</td>
                            </tr>
                            <tr>
                                <td><code>.toast-header</code></td>
                                <td>Styles the header section of the toast</td>
                            </tr>
                            <tr>
                                <td><code>.toast-body</code></td>
                                <td>Styles the body section of the toast</td>
                            </tr>
                            <tr>
                                <td><code>.toast-container</code></td>
                                <td>Used to position and stack multiple toasts</td>
                            </tr>
                            <tr>
                                <td><code>.fade</code></td>
                                <td>Applied to enable the fade transition effect</td>
                            </tr>
                            <tr>
                                <td><code>.show</code></td>
                                <td>Applied when the toast is visible</td>
                            </tr>
                            <tr>
                                <td><code>.text-bg-*</code></td>
                                <td>Color scheme classes (e.g., .text-bg-primary, .text-bg-success) for toast variants</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</div>

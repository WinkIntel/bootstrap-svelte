<script lang="ts">
    import { Button, Toast } from '$lib/index.js';
    import type { ToastPlacement } from '$lib/Toast/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // State for the interactive toast demo
    let isToastShown = $state(false);
    let doAutohide = $state(true);
    let toastDelay = $state(5000);
    let toastPlacement: ToastPlacement = $state('bottom-end');
    let toastUseFade = $state(true);
    let toastText = $state('Hello, world! This is a toast message.');
    let headerText = $state('Bootstrap Toast');
    let subText = $state('just now');
    let isDismissible = $state(true);
    let trackEvents = $state(false);
    let eventLog: string[] = $state([]);

    // Countdown timer state
    // eslint-disable-next-line svelte/prefer-writable-derived -- countdownSeconds is independently mutated by setInterval, not just derived from toastDelay
    let countdownSeconds = $state(5);
    let countdownInterval = $state<number | null>(null);

    // Show the demo toast
    function showToast() {
        isToastShown = true;

        // Initialize countdown timer if autohide is enabled
        if (doAutohide) {
            startCountdown();
        }
    }

    // Reset the demo toast to default values
    function resetToast() {
        doAutohide = true;
        toastDelay = 5000;
        toastPlacement = 'bottom-end';
        toastUseFade = true;
        toastText = 'Hello, world! This is a toast message.';
        headerText = 'Bootstrap Toast';
        subText = 'just now';
        isDismissible = true;
        trackEvents = false;
        eventLog = [];
        countdownSeconds = Math.ceil(toastDelay / 1000);
        clearCountdown();
    }

    // Event logging functions
    function logEvent(event: string) {
        if (trackEvents) {
            const timestamp = new Date().toLocaleTimeString();
            eventLog = [...eventLog, `${timestamp}: ${event}`];

            // Keep log at a reasonable size
            if (eventLog.length > 10) {
                eventLog = eventLog.slice(-10);
            }
        }
    }

    // Function to clear the event log
    function clearEventLog() {
        eventLog = [];
    }

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

    // Clear countdown timer
    function clearCountdown() {
        if (countdownInterval !== null) {
            window.clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    // Update countdown when toast delay changes
    $effect(() => {
        countdownSeconds = Math.ceil(toastDelay / 1000);
    });

    // Clean up interval when component is destroyed
    $effect(() => {
        return () => clearCountdown();
    });

    // Stop countdown when toast is hidden
    $effect(() => {
        if (!isToastShown) {
            clearCountdown();
        }
    });

    // Available positions for the toast container
    const placementOptions = [
        { value: 'top-start', label: 'Top left' },
        { value: 'top-center', label: 'Top center' },
        { value: 'top-end', label: 'Top right' },
        { value: 'middle-start', label: 'Middle left' },
        { value: 'middle-center', label: 'Middle center' },
        { value: 'middle-end', label: 'Middle right' },
        { value: 'bottom-start', label: 'Bottom left' },
        { value: 'bottom-center', label: 'Bottom center' },
        { value: 'bottom-end', label: 'Bottom right' }
    ];

    // Generated code preview based on current configuration
    const generatedCode = $derived(`<Toast.Container placement="${toastPlacement}"${toastPlacement !== 'bottom-end' ? '' : ''}>
    <Toast.Root isShown={true}${!doAutohide ? ' doAutohide={false}' : ''}${toastDelay !== 5000 ? ` delay={${toastDelay}}` : ''}${!toastUseFade ? ' useFade={false}' : ''}${
        trackEvents
            ? `
    onShow={() => console.log('Toast show triggered')}
    onShown={() => console.log('Toast fully visible')}
    onHide={() => console.log('Toast hide triggered')}
    onHidden={() => console.log('Toast hidden completely')}`
            : ''
    }>
        <Toast.Header${!isDismissible ? ' isDismissible={false}' : ''}>
            <strong class="me-auto">${headerText}</strong>${
                subText
                    ? `
            <small>${subText}</small>`
                    : ''
            }
        </Toast.Header>
        <Toast.Body>
            ${toastText}
        </Toast.Body>
    </Toast.Root>
</Toast.Container>`);
</script>

<section class="interactive-playground mb-5">
    <h2 class="wk-quick-link">Toast Playground</h2>
    <p>Use the controls below to configure and display a toast notification.</p>

    <div class="card mb-3">
        <div class="card-header">
            <h3 class="h5 mb-0">Configuration</h3>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="position-relative bg-body-secondary p-3 mb-4 border border-1 rounded" style="min-height: 375px; overflow: hidden;">
                        <p class="text-center position-absolute top-50 start-50 translate-middle text-muted">
                            {isToastShown ? '' : 'Toast will appear here when triggered'}
                        </p>
                        <Toast.Container placement={toastPlacement} isFixed={false}>
                            <Toast.Root
                                isShown={isToastShown}
                                {doAutohide}
                                delay={toastDelay}
                                useFade={toastUseFade}
                                onShow={() => logEvent('Toast show triggered')}
                                onShown={() => logEvent('Toast fully visible')}
                                onHide={() => logEvent('Toast hide triggered')}
                                onHidden={() => {
                                    logEvent('Toast hidden completely');
                                    isToastShown = false;
                                }}>
                                <Toast.Header {isDismissible}>
                                    <strong class="me-auto">{headerText}</strong>
                                    <small>
                                        {subText}
                                        {#if isToastShown && doAutohide && countdownSeconds > 0}
                                            <span class="ms-1 text-muted">({countdownSeconds}s)</span>
                                        {/if}
                                    </small>
                                </Toast.Header>
                                <Toast.Body>{toastText}</Toast.Body>
                            </Toast.Root>
                        </Toast.Container>
                    </div>
                </div>
                <div class="col-md-6">
                    <h4 class="h6">Code</h4>
                    <SyntaxHighlighter code={generatedCode} />
                </div>
            </div>
            <div class="row g-3">
                <!-- Toast content configuration -->
                <div class="col-md-6">
                    <h4 class="h6">Content</h4>
                    <div class="mb-3">
                        <label for="headerText" class="form-label">Header text</label>
                        <input type="text" class="form-control" id="headerText" bind:value={headerText} />
                    </div>

                    <div class="mb-3">
                        <label for="subText" class="form-label">Sub text (e.g. timestamp)</label>
                        <input type="text" class="form-control" id="subText" bind:value={subText} />
                    </div>

                    <div class="mb-3">
                        <label for="toastText" class="form-label">Toast body text</label>
                        <textarea class="form-control" id="toastText" rows="3" bind:value={toastText}></textarea>
                    </div>

                    <div class="d-flex gap-2 mt-3">
                        <Button colorVariant="primary" onclick={showToast}>Show Toast</Button>
                        <Button colorVariant="outline-secondary" onclick={resetToast}>Reset</Button>
                    </div>
                </div>

                <!-- Toast behavior configuration -->
                <div class="col-md-6">
                    <h4 class="h6">Behavior</h4>
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="doAutohide"
                            checked={doAutohide}
                            onchange={() => (doAutohide = !doAutohide)} />
                        <label class="form-check-label" for="doAutohide"> Auto-hide toast </label>
                    </div>

                    <div class="mb-3 mt-3">
                        <label for="toastDelay" class="form-label">Delay (ms): {toastDelay}</label>
                        <input
                            type="range"
                            class="form-range"
                            min="1000"
                            max="10000"
                            step="500"
                            id="toastDelay"
                            bind:value={toastDelay}
                            disabled={!doAutohide} />
                    </div>

                    <div class="mb-3">
                        <label for="toastPosition" class="form-label">Position</label>
                        <select class="form-select" id="toastPosition" bind:value={toastPlacement}>
                            {#each placementOptions as placementOption, placementOptionIndex (`placementOption-${placementOptionIndex}`)}
                                <option value={placementOption.value}>{placementOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="toastUseFade"
                            checked={toastUseFade}
                            onchange={() => (toastUseFade = !toastUseFade)} />
                        <label class="form-check-label" for="toastUseFade"> Use fade effect </label>
                    </div>

                    <div class="form-check mt-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="isDismissible"
                            checked={isDismissible}
                            onchange={() => (isDismissible = !isDismissible)} />
                        <label class="form-check-label" for="isDismissible"> Show dismiss button in header </label>
                    </div>

                    <div class="form-check my-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="trackEvents"
                            checked={trackEvents}
                            onchange={() => (trackEvents = !trackEvents)} />
                        <label class="form-check-label" for="trackEvents"> Enable event tracking </label>
                    </div>

                    {#if trackEvents}
                        <div class="p-3 border rounded mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <h4 class="h6 mb-0">Event Log</h4>
                                <button class="btn btn-sm btn-outline-danger" onclick={clearEventLog}>Clear</button>
                            </div>
                            <div class="mt-2" style="max-height: 150px; overflow-y: auto;">
                                <ul class="list-group">
                                    {#each eventLog as event, eventIndex (`event-${eventIndex}`)}
                                        <li class="list-group-item py-1">{event}</li>
                                    {:else}
                                        <li class="list-group-item py-1">No events logged</li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</section>

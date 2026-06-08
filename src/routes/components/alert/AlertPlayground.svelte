<script lang="ts">
    import type { AlertColorVariant } from '$lib/Alert/types.js';
    import { Alert } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Component props that can be manipulated
    let colorVariant: AlertColorVariant = $state('primary' as AlertColorVariant);
    let isDismissible: boolean = $state(true);
    let isAnimated: boolean = $state(true);
    let alertText: string = $state('This is an alert');

    // Event tracking
    let trackEvents: boolean = $state(true);
    let eventLog: string[] = $state([]);

    // Event handlers
    function handleClose() {
        if (trackEvents) {
            eventLog = [...eventLog, 'close.bs.alert event fired'];
        }
    }

    function handleClosed() {
        if (trackEvents) {
            eventLog = [...eventLog, 'closed.bs.alert event fired'];
        }
    }

    // Available options for select dropdowns
    const colorVariantOptions: string[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<Alert`;

        if (colorVariant !== 'primary') code += `\n  colorVariant="${colorVariant}"`;
        if (isDismissible) code += `\n  isDismissible={true}`;
        if (!isAnimated) code += `\n  isAnimated={false}`;

        code += `>\n`;
        code += `  ${alertText}`;
        code += `\n</Alert>`;

        return code;
    }

    // Track reactivity with a regular function
    // Initialize codeSnippet
    let codeSnippet: string = $derived(getCodeSnippet());

    // For demonstration purposes, we'll have a reset button for the dismissed alerts
    let isOpen = $state(true);

    function resetAlert() {
        isOpen = true;
    }

    function clearEventLog() {
        eventLog = [];
    }
</script>

<div class="playground">
    <div class="card mb-4">
        <div class="card-header">
            <h3 class="h5 mb-0">Interactive Playground</h3>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <h4 class="h6">Controls</h4>
                    <div class="mb-3">
                        <label for="alertText" class="form-label">Text</label>
                        <input type="text" class="form-control" id="alertText" bind:value={alertText} />
                    </div>
                    <div class="mb-3">
                        <label for="colorVariant" class="form-label">Color Variant</label>
                        <select class="form-select" id="colorVariant" bind:value={colorVariant}>
                            {#each colorVariantOptions as colorVariantOption, colorVariantOptionIndex (`colorVariantOption-${colorVariantOptionIndex}`)}
                                <option value={colorVariantOption}>{colorVariantOption}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="dismissible" bind:checked={isDismissible} />
                        <label class="form-check-label" for="dismissible">Dismissible</label>
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="animate" bind:checked={isAnimated} />
                        <label class="form-check-label" for="animate">Animated</label>
                    </div>
                    {#if isDismissible}
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="trackEvents" bind:checked={trackEvents} />
                            <label class="form-check-label" for="trackEvents">Track Events</label>
                        </div>
                    {/if}
                    {#if isDismissible && !isOpen}
                        <button class="btn btn-secondary" onclick={resetAlert}>Reset Alert</button>
                    {/if}
                </div>
                <div class="col-md-6">
                    <h4 class="h6">Preview</h4>
                    <div class="p-4 border rounded bg-light" style="min-height: 100px;">
                        <Alert
                            bind:isOpen
                            onClose={trackEvents ? handleClose : undefined}
                            onClosed={trackEvents ? handleClosed : undefined}
                            {colorVariant}
                            {isDismissible}
                            {isAnimated}>
                            {alertText}
                        </Alert>
                    </div>
                    <div class="mt-3">
                        <h4 class="h6">Code</h4>
                        <SyntaxHighlighter code={codeSnippet} />
                    </div>

                    {#if trackEvents}
                        <div class="mt-3 p-3 border rounded">
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
</div>

<style>
    .playground {
        margin-bottom: 2rem;
    }
</style>

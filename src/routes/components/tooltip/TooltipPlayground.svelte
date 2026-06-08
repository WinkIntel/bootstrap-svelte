<script lang="ts">
    import { Button, Tooltip } from '$lib/index.js';
    import type { TooltipPlacement, TooltipTrigger } from '$lib/Tooltip/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Interactive state with Svelte 5 syntax
    let isShown: boolean = $state(false);
    let placement: TooltipPlacement = $state('top');
    let trigger: TooltipTrigger | string = $state('hover focus');
    let useFade: boolean = $state(true);
    let customContent: boolean = $state(false);
    let trackEvents: boolean = $state(false);
    let eventLog: string[] = $state([]);

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

    // Generate code based on current settings
    let generatedCode = $derived(`${
        trigger === 'manual'
            ? `<script>
    let isShown = $state(false);
    function togglePopover() {
        isShown = !isShown;
    }
\u003c/script>\n\n`
            : ``
    }<Button id="tooltip-target" colorVariant="primary"${trigger === 'manual' ? ` onclick={togglePopover}` : ``}>
    Tooltip Target
</Button>

<Tooltip.Root
    isShown={${isShown}}
    placement="${placement}"
    trigger="${trigger}"
    useFade={${useFade}}
    referenceElementId="tooltip-target"${
        trackEvents
            ? `
    onShow={() => console.log('Tooltip shown')}
    onShown={() => console.log('Tooltip fully visible')}
    onHide={() => console.log('Tooltip hiding')}
    onHidden={() => console.log('Tooltip hidden')}`
            : ''
    }>
    <Tooltip.Inner>
        ${customContent ? '<strong>Custom</strong> <em>formatted</em> content' : 'Simple tooltip content'}
    </Tooltip.Inner>
</Tooltip.Root>`);

    // Function to clear the event log
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
                <!-- Controls Column -->
                <div class="col-md-5">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <label for="tooltip-placement" class="form-label">Placement</label>
                        <select
                            id="tooltip-placement"
                            class="form-select"
                            value={placement}
                            onchange={(e: Event) => (placement = (e.target as HTMLSelectElement).value as TooltipPlacement)}>
                            <option value="top">Top (Default)</option>
                            <option value="right">Right</option>
                            <option value="bottom">Bottom</option>
                            <option value="left">Left</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="tooltip-trigger" class="form-label">Trigger</label>
                        <select
                            id="tooltip-trigger"
                            class="form-select"
                            value={trigger}
                            onchange={(e: Event) => (trigger = (e.target as HTMLSelectElement).value as TooltipTrigger | string)}>
                            <option value="hover focus">Hover & Focus (Default)</option>
                            <option value="click">Click</option>
                            <option value="hover">Hover only</option>
                            <option value="focus">Focus only</option>
                            <option value="manual">Manual</option>
                        </select>
                    </div>

                    <div class="form-check mb-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="tooltip-visible-switch"
                            checked={isShown}
                            onchange={() => (isShown = !isShown)} />
                        <label class="form-check-label" for="tooltip-visible-switch">Is Shown</label>
                    </div>

                    <div class="form-check mb-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="tooltip-fade-switch"
                            checked={useFade}
                            onchange={() => (useFade = !useFade)} />
                        <label class="form-check-label" for="tooltip-fade-switch">Use Fade Animation</label>
                    </div>

                    <div class="form-check mb-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="tooltip-content-switch"
                            checked={customContent}
                            onchange={() => (customContent = !customContent)} />
                        <label class="form-check-label" for="tooltip-content-switch">Custom HTML Content</label>
                    </div>

                    <div class="form-check mb-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="tooltip-events-switch"
                            checked={trackEvents}
                            onchange={() => (trackEvents = !trackEvents)} />
                        <label class="form-check-label" for="tooltip-events-switch">Track Events</label>
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

                <!-- Preview Column -->
                <div class="col-md-7">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light" style="min-height: 200px;">
                        <div class="d-flex justify-content-center">
                            <Button id="tooltip-playground-target" colorVariant="primary">Tooltip Target</Button>

                            <Tooltip.Root
                                {isShown}
                                {placement}
                                {trigger}
                                {useFade}
                                onShow={() => logEvent('Tooltip show triggered')}
                                onShown={() => logEvent('Tooltip shown completely')}
                                onHide={() => logEvent('Tooltip hide triggered')}
                                onHidden={() => logEvent('Tooltip hidden completely')}
                                referenceElementId="tooltip-playground-target">
                                <Tooltip.Inner>
                                    {#if customContent}
                                        <strong>Custom</strong> <em>formatted</em> content
                                    {:else}
                                        Simple tooltip content
                                    {/if}
                                </Tooltip.Inner>
                            </Tooltip.Root>
                        </div>

                        <div class="text-center mt-3" class:d-none={trigger !== 'manual'}>
                            <Button colorVariant="outline-primary" onclick={() => (isShown = !isShown)}>
                                Manually {isShown ? 'Hide' : 'Show'} Tooltip
                            </Button>
                        </div>
                    </div>

                    <div class="mt-3">
                        <h4 class="h6">Code</h4>
                        <SyntaxHighlighter code={generatedCode} />
                    </div>

                    <div class="mt-4">
                        <h4 class="h6">Usage Notes</h4>
                        <ul class="small">
                            <li>Use the <code>placement</code> prop to control tooltip position</li>
                            <li>The <code>trigger</code> prop controls how the tooltip is activated</li>
                            <li>The <code>referenceElementId</code> must match the ID of the target element</li>
                            <li>For disabled elements, wrap them in a container element with <code>tabindex="0"</code></li>
                            <li>Event handlers can be used to track tooltip state changes</li>
                        </ul>
                    </div>
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

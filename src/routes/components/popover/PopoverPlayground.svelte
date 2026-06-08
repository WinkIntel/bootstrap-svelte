<script lang="ts">
    import { Button, Popover, type HeadingLevels } from '$lib/index.js';
    import type { PopoverPlacement, PopoverTrigger } from '$lib/Popover/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Interactive state with Svelte 5 syntax
    let isShown: boolean = $state(false);
    let placement: PopoverPlacement = $state('right');
    let trigger: PopoverTrigger | string = $state('click');
    let useFade: boolean = $state(true);
    let customContent: boolean = $state(false);
    let headerLevel: HeadingLevels = $state(3);
    let showHeader: boolean = $state(true);
    let trackEvents: boolean = $state(false);
    let eventLog: string[] = $state([]);

    // Placement options
    const placementOptions = [
        { value: 'auto', label: 'Auto' },
        { value: 'top', label: 'Top' },
        { value: 'right', label: 'Right (Default)' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'left', label: 'Left' }
    ];

    // Trigger options
    const triggerOptions = [
        { value: 'click', label: 'Click (Default)' },
        { value: 'hover', label: 'Hover' },
        { value: 'focus', label: 'Focus' },
        { value: 'hover focus', label: 'Hover & Focus' },
        { value: 'manual', label: 'Manual' }
    ];

    // Header level options
    const headerLevelOptions = [
        { value: 1, label: 'h1' },
        { value: 2, label: 'h2' },
        { value: 3, label: 'h3 (Default)' },
        { value: 4, label: 'h4' },
        { value: 5, label: 'h5' },
        { value: 6, label: 'h6' }
    ];

    // Toggle popover visibility
    function togglePopover() {
        isShown = !isShown;
    }

    // Clear event log
    function clearEventLog() {
        eventLog = [];
    }

    // Event handlers for tracking
    function handleShow() {
        if (trackEvents) {
            eventLog = [...eventLog, 'onShow fired: Popover is starting to show'];
        }
    }

    function handleShown() {
        if (trackEvents) {
            eventLog = [...eventLog, 'onShown fired: Popover is now visible'];
        }
    }

    function handleHide() {
        if (trackEvents) {
            eventLog = [...eventLog, 'onHide fired: Popover is starting to hide'];
        }
    }

    function handleHidden() {
        if (trackEvents) {
            eventLog = [...eventLog, 'onHidden fired: Popover is now hidden'];
        }
        isShown = false; // Hide the popover when it's hidden
    }

    // Generate dynamic code snippet
    function getCodeSnippet(): string {
        let code = '';

        if (trigger === 'manual') {
            code += '<script>\n';
            code += '  let isShown = $state(false);\n';
            code += '  function togglePopover() {\n';
            code += '    isShown = !isShown;\n';
            code += '  }\n';
            code += '\u003c/script>\n\n';
        }

        code += `<Button id="playground-popover-button" colorVariant="primary"${trigger === 'manual' ? ` onclick={togglePopover}` : ``}">\n`;
        code += '  Toggle Popover\n';
        code += '</Button>\n\n';

        code += '<Popover.Root\n';
        if (trigger === 'manual') {
            code += `  isShown={isShown}\n`;
        }
        code += `  placement="${placement}"\n`;
        code += `  trigger="${trigger}"\n`;

        // Only include useFade if it's set to false
        if (useFade === false) {
            code += `  useFade={false}\n`;
        }

        code += `  referenceElementId="playground-popover-button"`;

        if (trackEvents) {
            code += `\n  onShow={handleShow}\n`;
            code += `  onShown={handleShown}\n`;
            code += `  onHide={handleHide}\n`;
            code += `  onHidden={handleHidden}`;
        }

        code += '>\n';

        if (showHeader) {
            code += `  <Popover.Header level={${headerLevel}}>Popover title</Popover.Header>\n`;
        }

        code += '  <Popover.Body>\n';
        code += '    <p>This is a simple popover content. You can customize this in various ways.</p>\n';

        if (customContent) {
            code += '    <hr />\n';
            code += '    <div class="d-flex justify-content-between">\n';
            code += '      <Button size="sm" colorVariant="outline-secondary">Action</Button>\n';
            code += '      <Button size="sm" colorVariant="outline-danger">Close</Button>\n';
            code += '    </div>\n';
        }

        code += '  </Popover.Body>\n';
        code += '</Popover.Root>\n\n';

        if (trigger === 'manual') {
            code += '<Button colorVariant="outline-primary" onclick={togglePopover}>\n';
            code += "  Manually {isShown ? 'Hide' : 'Show'} Popover\n";
            code += '</Button>';
        }

        return code;
    }

    // Track reactivity with effect
    // Initialize codeSnippet
    let codeSnippet: string = $derived(getCodeSnippet());
</script>

<div class="playground">
    <div class="card mb-4">
        <div class="card-header">
            <h3 class="h5 mb-0">Interactive Playground</h3>
        </div>

        <div class="card-body">
            <div class="row">
                <!-- Controls Column -->
                <div class="col-md-4">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <label for="popover-placement" class="form-label">Placement</label>
                        <select id="popover-placement" class="form-select" bind:value={placement}>
                            {#each placementOptions as placementOption, placementOptionIndex (`placementOption-${placementOptionIndex}`)}
                                <option value={placementOption.value}>{placementOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="popover-trigger" class="form-label">Trigger</label>
                        <select id="popover-trigger" class="form-select" bind:value={trigger}>
                            {#each triggerOptions as triggerOption, triggerOptionIndex (`triggerOption-${triggerOptionIndex}`)}
                                <option value={triggerOption.value}>{triggerOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="popover-show-header" bind:checked={showHeader} />
                        <label class="form-check-label" for="popover-show-header">Show Header</label>
                    </div>

                    {#if showHeader}
                        <div class="mb-3">
                            <label for="popover-header-level" class="form-label">Header Level</label>
                            <select id="popover-header-level" class="form-select" bind:value={headerLevel}>
                                {#each headerLevelOptions as headerLevelOption, headerLevelOptionIndex (`headerLevelOption-${headerLevelOptionIndex}`)}
                                    <option value={headerLevelOption.value}>{headerLevelOption.label}</option>
                                {/each}
                            </select>
                        </div>
                    {/if}

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="popover-fade" bind:checked={useFade} />
                        <label class="form-check-label" for="popover-fade">Use Fade Animation</label>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="popover-custom-content" bind:checked={customContent} />
                        <label class="form-check-label" for="popover-custom-content">Show Custom Content</label>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="popover-track-events" bind:checked={trackEvents} />
                        <label class="form-check-label" for="popover-track-events">Track Events</label>
                    </div>

                    {#if trackEvents}
                        <div class="p-3 border rounded mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <h4 class="h6 mb-0">Event Log</h4>
                                <button class="btn btn-sm btn-outline-danger" onclick={clearEventLog}>Clear</button>
                            </div>
                            <div class="mt-2" style="max-height: 430px; overflow-y: auto;">
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
                <div class="col-md-8">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light" style="min-height: 200px;">
                        <div class="d-flex justify-content-center">
                            <Button id="playground-popover-button" colorVariant="primary">Toggle Popover</Button>

                            <Popover.Root
                                {isShown}
                                {placement}
                                {trigger}
                                {useFade}
                                referenceElementId="playground-popover-button"
                                onShow={handleShow}
                                onShown={handleShown}
                                onHide={handleHide}
                                onHidden={handleHidden}>
                                {#if showHeader}
                                    <Popover.Header level={headerLevel}>Popover title</Popover.Header>
                                {/if}
                                <Popover.Body>
                                    <p class:mb-0={!customContent}>This is a simple popover content. You can customize this in various ways.</p>
                                    {#if customContent}
                                        <hr />
                                        <div class="d-flex justify-content-between">
                                            <Button size="sm" colorVariant="outline-secondary">Action</Button>
                                            <Button size="sm" colorVariant="outline-danger" onclick={togglePopover}>Close</Button>
                                        </div>
                                    {/if}
                                </Popover.Body>
                            </Popover.Root>
                        </div>

                        <div class="text-center mt-3" class:d-none={trigger !== 'manual'}>
                            <Button colorVariant="outline-primary" onclick={togglePopover}>
                                Manually {isShown ? 'Hide' : 'Show'} Popover
                            </Button>
                        </div>
                    </div>

                    <div class="mt-3">
                        <h4 class="h6">Code</h4>
                        <SyntaxHighlighter code={codeSnippet} />
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

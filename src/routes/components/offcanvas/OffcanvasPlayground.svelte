<script lang="ts">
    import { Button, Offcanvas } from '$lib/index.js';
    import type { OffcanvasBreakpoint, OffcanvasPlacement } from '$lib/Offcanvas/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Configurable props
    let isShown: boolean = $state(false);
    let placement: OffcanvasPlacement = $state('start');
    let useBackdrop: boolean | 'static' = $state(true);
    let isBodyScrollable: boolean = $state(false);
    let showOnBreakpoint: OffcanvasBreakpoint | undefined = $state(undefined);
    let isDismissible: boolean = $state(true);
    let useCustomImage: boolean = $state(false);

    // Event tracking
    let eventLog: string[] = $state([]);
    let trackEvents: boolean = $state(true);

    // Available options for dropdowns
    const placementOptions = [
        { value: 'start', label: 'Start (Default)' },
        { value: 'end', label: 'End' },
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' }
    ];

    const backdropOptions = [
        { value: true, label: 'True (Default)' },
        { value: 'static', label: 'Static' },
        { value: false, label: 'False' }
    ];

    const breakpointOptions = [
        { value: undefined, label: 'None (Default)' },
        { value: 'sm', label: 'Show above SM' },
        { value: 'md', label: 'Show above MD' },
        { value: 'lg', label: 'Show above LG' },
        { value: 'xl', label: 'Show above XL' },
        { value: 'xxl', label: 'Show above XXL' }
    ];

    // Toggle visibility
    function toggleOffcanvas() {
        isShown = !isShown;
    }

    // Event handlers
    function handleShow(): void {
        if (trackEvents) {
            eventLog = [...eventLog, 'Offcanvas is showing'];
        }
    }

    function handleShown(): void {
        if (trackEvents) {
            eventLog = [...eventLog, 'Offcanvas is fully shown'];
        }
    }

    function handleHide(): void {
        if (trackEvents) {
            eventLog = [...eventLog, 'Offcanvas is hiding'];
        }
    }

    function handleHidePrevented(): void {
        if (trackEvents) {
            eventLog = [...eventLog, 'Offcanvas hide was prevented'];
        }
    }

    function handleHidden(): void {
        if (trackEvents) {
            eventLog = [...eventLog, 'Offcanvas is fully hidden'];
            isShown = false;
        } else {
            isShown = false;
        }
    }

    function clearEventLog(): void {
        eventLog = [];
    }

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = '<script>\n';
        code += '  let isShown = false;\n';
        code += '  \n';
        code += '  function toggleOffcanvas() {\n';
        code += '    isShown = !isShown;\n';
        code += '  }\n';
        code += '\u003c/script>\n\n';

        code += '<Button onclick={toggleOffcanvas}>\n';
        code += '  Toggle Offcanvas\n';
        code += '</Button>\n\n';

        code += '<Offcanvas.Root';
        code += `\n  placement="${placement}"`;

        if (showOnBreakpoint !== undefined) {
            code += `\n  showOnBreakpoint="${showOnBreakpoint}"`;
        }

        code += `\n  isShown={isShown}`;

        if (useBackdrop !== true) {
            code += `\n  useBackdrop={${typeof useBackdrop === 'string' ? `"${useBackdrop}"` : useBackdrop}}`;
        }

        if (isBodyScrollable) {
            code += `\n  isBodyScrollable={true}`;
        }

        if (trackEvents) {
            code += `\n  onShow={handleShow}`;
            code += `\n  onShown={handleShown}`;
            code += `\n  onHide={handleHide}`;
            code += `\n  onHidePrevented={handleHidePrevented}`;
            code += `\n  onHidden={handleHidden}`;
        } else {
            code += `\n  onHidden={() => isShown = false}`;
        }

        code += '>\n';

        code += '  <Offcanvas.Header';

        if (isDismissible) {
            code += ' isDismissible={true}';
        }

        code += '>\n';
        code += '    <Offcanvas.Title>Offcanvas Title</Offcanvas.Title>\n';
        code += '  </Offcanvas.Header>\n';
        code += '  <Offcanvas.Body>\n';
        code += '    <p>This is the offcanvas body content. You can place any content here, including forms, text, or other components.</p>';

        if (useCustomImage) {
            code += '\n    <img src="https://placehold.co/600x200" class="img-fluid rounded mb-3" alt="Example Image" />';
        }

        code += '\n    <div class="d-grid gap-2">\n';
        code += '      <Button colorVariant="secondary" onclick={() => isShown = false}>Close</Button>\n';
        code += '    </div>\n';
        code += '  </Offcanvas.Body>\n';
        code += '</Offcanvas.Root>';

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
                <div class="col-md-3">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <label for="placement" class="form-label">Placement</label>
                        <select id="placement" class="form-select" bind:value={placement}>
                            {#each placementOptions as placementOption, placementOptionIndex (`placementOption-${placementOptionIndex}`)}
                                <option value={placementOption.value}>{placementOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="backdrop" class="form-label">Backdrop</label>
                        <select id="backdrop" class="form-select" bind:value={useBackdrop}>
                            {#each backdropOptions as backdropOption, backdropOptionIndex (`backdropOption-${backdropOptionIndex}`)}
                                <option value={backdropOption.value}>{backdropOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="showOnBreakpoint" class="form-label">Show on Breakpoint</label>
                        <select id="showOnBreakpoint" class="form-select" bind:value={showOnBreakpoint}>
                            {#each breakpointOptions as breakpointOption, breakpointOptionIndex (`breakpointOption-${breakpointOptionIndex}`)}
                                <option value={breakpointOption.value}>{breakpointOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="scrollable" bind:checked={isBodyScrollable} />
                        <label class="form-check-label" for="scrollable">Allow Body Scrolling</label>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="dismissible" bind:checked={isDismissible} />
                        <label class="form-check-label" for="dismissible">Show Close Button</label>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="customImage" bind:checked={useCustomImage} />
                        <label class="form-check-label" for="customImage">Include Image</label>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="trackEvents" bind:checked={trackEvents} />
                        <label class="form-check-label" for="trackEvents">Track Events</label>
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
                <div class="col-md-9">
                    <h4 class="h6">Preview</h4>

                    <div class="p-2 border rounded bg-light" style="min-height: 200px;">
                        <div class="mb-3">
                            <Button
                                class={[{ [`d-${showOnBreakpoint}-none`]: showOnBreakpoint !== undefined }]}
                                colorVariant="primary"
                                onclick={toggleOffcanvas}>{isShown ? 'Hide' : 'Show'} Offcanvas</Button>
                            {#if showOnBreakpoint}
                                <p class={['d-none', { [`d-${showOnBreakpoint}-block`]: showOnBreakpoint !== undefined }]}>
                                    (Button hidden on screens wider than {showOnBreakpoint.toUpperCase()})
                                </p>
                            {/if}
                        </div>

                        <Offcanvas.Root
                            {placement}
                            {showOnBreakpoint}
                            {isShown}
                            {useBackdrop}
                            {isBodyScrollable}
                            onHide={trackEvents ? handleHide : undefined}
                            onHidePrevented={trackEvents ? handleHidePrevented : undefined}
                            onHidden={trackEvents ? handleHidden : undefined}
                            onShow={trackEvents ? handleShow : undefined}
                            onShown={trackEvents ? handleShown : undefined}>
                            <Offcanvas.Header {isDismissible}>
                                <Offcanvas.Title>Offcanvas Title</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <p>This is the offcanvas body content. You can place any content here, including forms, text, or other components.</p>

                                {#if useCustomImage}
                                    <img src="https://placehold.co/600x200" class="img-fluid rounded mb-3" alt="" />
                                {/if}

                                <div class={['d-grid gap-2', { [`d-${showOnBreakpoint}-none`]: showOnBreakpoint !== undefined }]}>
                                    <Button colorVariant="secondary" onclick={() => (isShown = false)}>Close</Button>
                                </div>
                            </Offcanvas.Body>
                        </Offcanvas.Root>
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

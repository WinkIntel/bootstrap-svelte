<script lang="ts">
    import { Button, Modal } from '$lib/index.js';
    import type { ModalBackdrop, ModalFullscreenBreakpoint, ModalSize } from '$lib/Modal/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Configurable props
    let isShown: boolean = $state(false);
    let size: ModalSize | undefined = $state(undefined);
    let useBackdrop: ModalBackdrop = $state(true);
    let isVerticallyCentered: boolean = $state(false);
    let isScrollable: boolean = $state(false);
    let fullscreenOnBreakpoint: ModalFullscreenBreakpoint | undefined = $state(undefined);
    let isDismissible: boolean = $state(true);
    let useFade: boolean = $state(true);
    let useCustomContent: boolean = $state(false);

    // Event tracking
    let eventLog: string[] = $state([]);
    let trackEvents: boolean = $state(true);

    // Available options for dropdowns
    const sizeOptions = [
        { value: undefined, label: 'Default' },
        { value: 'sm', label: 'Small' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' }
    ];

    const backdropOptions = [
        { value: true, label: 'True (Default)' },
        { value: 'static', label: 'Static' },
        { value: false, label: 'False' }
    ];

    const fullscreenOptions = [
        { value: undefined, label: 'None (Default)' },
        { value: 'always', label: 'Always Fullscreen' },
        { value: 'sm', label: 'Below SM' },
        { value: 'md', label: 'Below MD' },
        { value: 'lg', label: 'Below LG' },
        { value: 'xl', label: 'Below XL' },
        { value: 'xxl', label: 'Below XXL' }
    ];

    // Toggle visibility
    function toggleModal() {
        isShown = !isShown;
    }

    // Event handlers
    function handleShow(): void {
        if (trackEvents) {
            eventLog = [...eventLog, 'Modal is showing'];
        }
    }

    function handleShown(): void {
        if (trackEvents) {
            eventLog = [...eventLog, 'Modal is fully shown'];
        }
    }

    function handleHide(): void {
        if (trackEvents) {
            eventLog = [...eventLog, 'Modal is hiding'];
        }
    }

    function handleHidePrevented(): void {
        if (trackEvents) {
            eventLog = [...eventLog, 'Modal hide was prevented'];
        }
    }

    function handleHidden(): void {
        if (trackEvents) {
            eventLog = [...eventLog, 'Modal is fully hidden'];
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
        code += '  let isShown = $state(false);\n';
        code += '  \n';
        code += '  function toggleModal() {\n';
        code += '    isShown = !isShown;\n';
        code += '  }\n';
        code += '\u003c/script>\n\n';

        code += '<Button onclick={toggleModal} colorVariant="primary">\n';
        code += '  Open Modal\n';
        code += '</Button>\n\n';

        code += '<Modal.Root';
        code += `\n  isShown={isShown}`;

        if (useFade === false) {
            code += `\n  useFade={false}`;
        }

        if (useBackdrop !== true) {
            code += `\n  useBackdrop={${typeof useBackdrop === 'string' ? `"${useBackdrop}"` : useBackdrop}}`;
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
        code += '  <Modal.Dialog';

        if (size) {
            code += `\n    size="${size}"`;
        }

        if (isVerticallyCentered) {
            code += `\n    isVerticallyCentered={true}`;
        }

        if (isScrollable) {
            code += `\n    isScrollable={true}`;
        }

        if (fullscreenOnBreakpoint) {
            code += `\n    fullscreenOnBreakpoint="${fullscreenOnBreakpoint}"`;
        }

        code += '>\n';
        code += '    <Modal.Content>\n';
        code += '      <Modal.Header';

        if (!isDismissible) {
            code += ' isDismissible={false}';
        }

        code += '>\n';
        code += '        <Modal.Title>Modal Title</Modal.Title>\n';
        code += '      </Modal.Header>\n';
        code += '      <Modal.Body>\n';
        code += '        <p>This is the modal body content. You can place any content here, including forms, text, or other components.</p>';

        if (useCustomContent) {
            code += '\n        <div class="container-fluid">\n';
            code += '          <div class="row">\n';
            code += '            <div class="col-md-4">.col-md-4</div>\n';
            code += '            <div class="col-md-4 ms-auto">.col-md-4 .ms-auto</div>\n';
            code += '          </div>\n';
            code += '          <div class="row">\n';
            code += '            <div class="col-md-3 ms-auto">.col-md-3 .ms-auto</div>\n';
            code += '            <div class="col-md-2 ms-auto">.col-md-2 .ms-auto</div>\n';
            code += '          </div>\n';
            code += '        </div>';
        }

        code += '\n      </Modal.Body>\n';
        code += '      <Modal.Footer>\n';
        code += '        <Button colorVariant="secondary" onclick={() => isShown = false}>Close</Button>\n';
        code += '        <Button colorVariant="primary">Save changes</Button>\n';
        code += '      </Modal.Footer>\n';
        code += '    </Modal.Content>\n';
        code += '  </Modal.Dialog>\n';
        code += '</Modal.Root>';

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
                        <label for="size" class="form-label">Size</label>
                        <select id="size" class="form-select" bind:value={size}>
                            {#each sizeOptions as sizeOption, sizeOptionIndex (`sizeOption-${sizeOptionIndex}`)}
                                <option value={sizeOption.value}>{sizeOption.label}</option>
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
                        <label for="fullscreen" class="form-label">Fullscreen</label>
                        <select id="fullscreen" class="form-select" bind:value={fullscreenOnBreakpoint}>
                            {#each fullscreenOptions as fullscreenOption, fullscreenOptionIndex (`fullscreenOption-${fullscreenOptionIndex}`)}
                                <option value={fullscreenOption.value}>{fullscreenOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="centered" bind:checked={isVerticallyCentered} />
                        <label class="form-check-label" for="centered">Vertically Centered</label>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="scrollable" bind:checked={isScrollable} />
                        <label class="form-check-label" for="scrollable">Scrollable</label>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="dismissible" bind:checked={isDismissible} />
                        <label class="form-check-label" for="dismissible">Show Close Button</label>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="fade" bind:checked={useFade} />
                        <label class="form-check-label" for="fade">Use Fade Animation</label>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="customContent" bind:checked={useCustomContent} />
                        <label class="form-check-label" for="customContent">Include Grid Example</label>
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

                    <div class="p-2 border rounded bg-light" style="min-height: 200px;">
                        <div class="mb-3">
                            <Button colorVariant="primary" onclick={toggleModal}>Open Modal</Button>
                        </div>

                        <Modal.Root
                            {isShown}
                            {useBackdrop}
                            {useFade}
                            onHide={trackEvents ? handleHide : undefined}
                            onHidePrevented={trackEvents ? handleHidePrevented : undefined}
                            onHidden={trackEvents ? handleHidden : undefined}
                            onShow={trackEvents ? handleShow : undefined}
                            onShown={trackEvents ? handleShown : undefined}>
                            <Modal.Dialog {size} {isVerticallyCentered} {isScrollable} {fullscreenOnBreakpoint}>
                                <Modal.Content>
                                    <Modal.Header {isDismissible}>
                                        <Modal.Title>Modal Title</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p>
                                            This is the modal body content. You can place any content here, including forms, text, or other
                                            components.
                                        </p>

                                        {#if useCustomContent}
                                            <div class="container-fluid bd-example-row">
                                                <div class="row">
                                                    <div class="col-md-4">.col-md-4</div>
                                                    <div class="col-md-4 ms-auto">.col-md-4 .ms-auto</div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3 ms-auto">.col-md-3 .ms-auto</div>
                                                    <div class="col-md-2 ms-auto">.col-md-2 .ms-auto</div>
                                                </div>
                                            </div>
                                        {/if}

                                        {#if isScrollable}
                                            <div style="margin-top: 20px">
                                                <p>
                                                    When scrollable is enabled and content is long, the modal body becomes scrollable while the header
                                                    and footer remain fixed.
                                                </p>
                                                <div style="height: 600px; background-color: #f8f9fa; padding: 20px;">
                                                    <p>Scroll down to see more content...</p>
                                                    <p>This is scrollable content to demonstrate the scrolling behavior.</p>
                                                    <p>This content continues for a long way down to force scrolling.</p>
                                                </div>
                                                <p>End of scrollable content.</p>
                                            </div>
                                        {/if}
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button colorVariant="secondary" onclick={() => (isShown = false)}>Close</Button>
                                        <Button colorVariant="primary">Save changes</Button>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal.Dialog>
                        </Modal.Root>
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

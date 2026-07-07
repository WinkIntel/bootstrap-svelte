<script lang="ts">
    import type { DropdownAutoClose, DropdownDirection } from '$lib/Dropdown/types.js';
    import { Button, Dropdown, type ButtonColorVariant } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Component props that can be manipulated
    let direction: DropdownDirection = $state('dropdown' as DropdownDirection);
    let colorVariant: ButtonColorVariant = $state('primary');
    let isDark = $state(false);
    let isEnd = $state(false);
    let isSplit = $state(false);
    let isButtonGroup: boolean = $derived.by(() => (isSplit ? true : false));
    let autoClose: DropdownAutoClose = $state(true);
    let buttonText = $state('Dropdown');
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
    function clearEventLog() {
        eventLog = [];
    }

    // Available options for select dropdowns
    const directionOptions: DropdownDirection[] = [
        'dropdown',
        'dropdown-center',
        'dropdown-end',
        'dropup',
        'dropup-center',
        'dropup-end',
        'dropend',
        'dropstart'
    ];
    const colorVariantOptions = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    const autoCloseOptions: DropdownAutoClose[] = [true, false, 'inside', 'outside'];

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<Dropdown.Root`;

        if (direction !== 'dropdown') code += `\n  direction="${direction}"`;
        if (isButtonGroup) code += `\n  isButtonGroup={true}`;
        if (autoClose !== true) code += `\n  autoClose=${typeof autoClose === 'boolean' ? autoClose : `"${autoClose}"`}`;
        if (trackEvents) {
            code += `\n  onShow={() => console.log('Dropdown show triggered')}`;
            code += `\n  onShown={() => console.log('Dropdown shown completely')}`;
            code += `\n  onHide={() => console.log('Dropdown hide triggered')}`;
            code += `\n  onHidden={() => console.log('Dropdown hidden completely')}`;
        }

        code += `>`;

        if (isSplit) {
            code += `\n  <Button colorVariant="${colorVariant}">${buttonText}</Button>`;
            code += `\n  <Dropdown.Toggle colorVariant="${colorVariant}" isSplit={true}></Dropdown.Toggle>`;
        } else {
            code += `\n  <Dropdown.Toggle colorVariant="${colorVariant}">${buttonText}</Dropdown.Toggle>`;
        }

        code += `\n  <Dropdown.Menu`;

        if (isDark) code += ` isDark={true}`;
        if (isEnd) code += ` isEnd={true}`;

        code += `>`;
        code += `\n    <Dropdown.Item>Action</Dropdown.Item>`;
        code += `\n    <Dropdown.Item>Another action</Dropdown.Item>`;
        code += `\n    <Dropdown.Item>Something else here</Dropdown.Item>`;
        code += `\n  </Dropdown.Menu>`;
        code += `\n</Dropdown.Root>`;

        return code;
    }

    // Track reactivity with $effect
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
                        <label for="direction" class="form-label">Direction</label>
                        <select class="form-select" id="direction" bind:value={direction}>
                            {#each directionOptions as directionOption, directionOptionIndex (`directionOption-${directionOptionIndex}`)}
                                <option value={directionOption}>{directionOption}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="colorVariant" class="form-label">Color Variant</label>
                        <select class="form-select" id="colorVariant" bind:value={colorVariant}>
                            {#each colorVariantOptions as colorVariantOption, colorVariantOptionIndex (`colorVariantOption-${colorVariantOptionIndex}`)}
                                <option value={colorVariantOption}>{colorVariantOption}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="autoClose" class="form-label">Auto Close</label>
                        <select class="form-select" id="autoClose" bind:value={autoClose}>
                            {#each autoCloseOptions as autoCloseOption, autoCloseOptionIndex (`autoCloseOption-${autoCloseOptionIndex}`)}
                                <option value={autoCloseOption}>{autoCloseOption.toString()}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="buttonText" class="form-label">Button Text</label>
                        <input type="text" class="form-control" id="buttonText" bind:value={buttonText} />
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isSplit" bind:checked={isSplit} />
                        <label class="form-check-label" for="isSplit">Use Split Button</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isButtonGroup" bind:checked={isButtonGroup} />
                        <label class="form-check-label" for="isButtonGroup">Is Button Group</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isDark" bind:checked={isDark} />
                        <label class="form-check-label" for="isDark">Dark Menu</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isEnd" bind:checked={isEnd} />
                        <label class="form-check-label" for="isEnd">Align End</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="trackEvents" bind:checked={trackEvents} />
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
                <div class="col-md-8">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light d-flex align-items-center justify-content-center" style="min-height: 200px;">
                        <Dropdown.Root
                            {direction}
                            {isButtonGroup}
                            {autoClose}
                            onShow={() => logEvent('Dropdown show triggered')}
                            onShown={() => logEvent('Dropdown shown completely')}
                            onHide={() => logEvent('Dropdown hide triggered')}
                            onHidden={() => logEvent('Dropdown hidden completely')}>
                            {#if isSplit}
                                <Button {colorVariant}>{buttonText}</Button>
                                <Dropdown.Toggle {colorVariant} isSplit={true}></Dropdown.Toggle>
                            {:else}
                                <Dropdown.Toggle {colorVariant}>{buttonText}</Dropdown.Toggle>
                            {/if}
                            <Dropdown.Menu {isDark} {isEnd}>
                                <Dropdown.Item>Action</Dropdown.Item>
                                <Dropdown.Item>Another action</Dropdown.Item>
                                <Dropdown.Item>Something else here</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Root>
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

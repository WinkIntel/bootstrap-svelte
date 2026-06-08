<script lang="ts">
    import { Collapse, collapseAria } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Component props that can be manipulated
    let isExpanded: boolean = $state(false);
    let isHorizontal: boolean = $state(false);
    let collapseContent: string = $state(
        'This is the collapsible content. You can modify this text to see how the component adapts to different content lengths.'
    );
    let customClass: string = $state('');

    // Event tracking
    let eventLog: string[] = $state([]);
    let trackEvents: boolean = $state(true);

    // Event handlers
    function handleCollapse() {
        if (trackEvents) {
            eventLog = [...eventLog, 'hide.bs.collapse event fired'];
        }
    }

    function handleCollapsed() {
        if (trackEvents) {
            eventLog = [...eventLog, 'hidden.bs.collapse event fired'];
        }
    }

    function handleExpand() {
        if (trackEvents) {
            eventLog = [...eventLog, 'show.bs.collapse event fired'];
        }
    }

    function handleExpanded() {
        if (trackEvents) {
            eventLog = [...eventLog, 'shown.bs.collapse event fired'];
        }
    }

    function clearEventLog() {
        eventLog = [];
    }

    // Toggle collapse state
    function toggleCollapse() {
        isExpanded = !isExpanded;
    }

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let buttonCode = `<script>
    import { collapseAria } from '@winkintel/bootstrap-svelte';

    let isExpanded = $state(false);
\u003c/script>

<Button
    {@attach collapseAria({
        ariaControls: 'collapseExample',
        ariaExpanded: isExpanded
    })}
    colorVariant="primary"
    onclick={() => isExpanded = !isExpanded}>
    {isExpanded ? 'Collapse Content' : 'Expand Content'}
</Button>\n\n`;

        let code = `<Collapse`;

        code += `\n  id="collapseExample"`;
        code += `\n  isExpanded={${isExpanded}}`;
        if (isHorizontal) code += `\n  isHorizontal={true}`;
        if (customClass) code += `\n  class="${customClass}"`;
        if (trackEvents) {
            code += `\n  onCollapse={handleCollapse}`;
            code += `\n  onCollapsed={handleCollapsed}`;
            code += `\n  onExpand={handleExpand}`;
            code += `\n  onExpanded={handleExpanded}`;
        }

        code += `>\n  ${collapseContent.length > 30 ? collapseContent.substring(0, 31) + '...' : collapseContent}\n</Collapse>`;

        return buttonCode + code;
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
                <div class="col-md-6">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <label for="collapseContent" class="form-label">Content</label>
                        <textarea class="form-control" id="collapseContent" rows="3" bind:value={collapseContent}></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="customClass" class="form-label">Custom Class</label>
                        <input type="text" class="form-control" id="customClass" bind:value={customClass} />
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isExpanded" bind:checked={isExpanded} />
                        <label class="form-check-label" for="isExpanded">Is Expanded</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isHorizontal" bind:checked={isHorizontal} />
                        <label class="form-check-label" for="isHorizontal">Is Horizontal</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="trackEvents" bind:checked={trackEvents} />
                        <label class="form-check-label" for="trackEvents">Track Events</label>
                    </div>
                </div>

                <!-- Preview Column -->
                <div class="col-md-6">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light" style="min-height: 150px;">
                        <button
                            {@attach collapseAria({
                                ariaControls: 'collapseExample',
                                ariaExpanded: isExpanded
                            })}
                            class="btn btn-primary mb-2"
                            onclick={toggleCollapse}>
                            {isExpanded ? 'Collapse' : 'Expand'} Content
                        </button>
                        <Collapse
                            id="collapseExample"
                            {isExpanded}
                            {isHorizontal}
                            class={customClass}
                            onCollapse={trackEvents ? handleCollapse : undefined}
                            onCollapsed={trackEvents ? handleCollapsed : undefined}
                            onExpand={trackEvents ? handleExpand : undefined}
                            onExpanded={trackEvents ? handleExpanded : undefined}>
                            <div class="p-3 border bg-white" style="width: 300px;">
                                {collapseContent}
                            </div>
                        </Collapse>
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

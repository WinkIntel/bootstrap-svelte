<script lang="ts">
    import { Accordion } from '$lib/index.js';
    import { SvelteSet } from 'svelte/reactivity';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Component props that can be manipulated
    let isMultiple: boolean = $state(false);
    let isFlush: boolean = $state(false);
    let itemCount: number = $state(3);

    // Item expansion tracking
    const expandedItems: SvelteSet<number> = new SvelteSet([0]);

    // Event tracking
    let eventLog: string[] = $state([]);
    let trackEvents: boolean = $state(true);

    // Event handlers
    function handleExpand(itemIndex: number): void {
        if (trackEvents) {
            eventLog = [...eventLog, `Item ${itemIndex + 1} is expanding`];
        }
    }

    function handleExpanded(itemIndex: number): void {
        if (trackEvents) {
            eventLog = [...eventLog, `Item ${itemIndex + 1} is fully expanded`];
        }
        updateExpandedItemsFromEvent(itemIndex, true);
    }

    function handleCollapse(itemIndex: number): void {
        if (trackEvents) {
            eventLog = [...eventLog, `Item ${itemIndex + 1} is collapsing`];
        }
    }

    function handleCollapsed(itemIndex: number): void {
        if (trackEvents) {
            eventLog = [...eventLog, `Item ${itemIndex + 1} is fully collapsed`];
        }
        updateExpandedItemsFromEvent(itemIndex, false);
    }

    function updateExpandedItemsFromEvent(itemIndex: number, isExpanded: boolean): void {
        if (isExpanded) {
            expandedItems.add(itemIndex);
        } else {
            expandedItems.delete(itemIndex);
        }
    }

    function clearEventLog(): void {
        eventLog = [];
    }

    // Function to toggle item expansion
    function toggleItem(index: number): void {
        if (isMultiple) {
            // For multiple items, toggle the specific item in the set
            if (expandedItems.has(index)) {
                expandedItems.delete(index);
            } else {
                expandedItems.add(index);
            }
        } else {
            // For single item mode, clear other items and set only this one
            if (expandedItems.has(index)) {
                expandedItems.clear(); // Collapse all
            } else {
                expandedItems.clear(); // Collapse all
                expandedItems.add(index); // Expand this one
            }
        }
    }

    // Function to generate accordion items
    function generateAccordionItems(count: number): Array<{ title: string; content: string }> {
        const items = [];
        for (let i = 1; i <= count; i++) {
            items.push({
                title: `Accordion Item #${i}`,
                content: `This is the content for item #${i}. You can put any HTML content here.`
            });
        }
        return items;
    }

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<Accordion.Root`;

        if (isMultiple) code += `\n  isMultiple={true}`;
        if (isFlush) code += `\n  isFlush={true}`;
        code += `>`;

        for (let i = 0; i < itemCount; i++) {
            code += `\n  <Accordion.Item${expandedItems.has(i) ? ' isExpanded={true}' : ''}>`;
            code += `\n    <Accordion.Header>`;
            code += `\n      <Accordion.Button>Accordion Item #${i + 1}</Accordion.Button>`;
            code += `\n    </Accordion.Header>`;
            code += `\n    <Accordion.Collapse`;
            if (trackEvents) {
                code += `\n  onCollapse={handleCollapse}`;
                code += `\n  onCollapsed={handleCollapsed}`;
                code += `\n  onExpand={handleExpand}`;
                code += `\n  onExpanded={handleExpanded}`;
            }
            code += `>\n      <Accordion.Body>`;
            code += `\n        This is the content for item #${i + 1}.`;
            code += `\n      </Accordion.Body>`;
            code += `\n    </Accordion.Collapse>`;
            code += `\n  </Accordion.Item>`;
        }

        code += `\n</Accordion.Root>`;
        return code;
    }

    // Track reactivity with $effect
    // Initialize codeSnippet
    let codeSnippet: string = $derived(getCodeSnippet());

    // Derived value for accordion items
    let accordionItems = $derived.by(() => {
        return generateAccordionItems(itemCount);
    });
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
                        <label for="itemCount" class="form-label">Number of Accordion Items: {itemCount}</label>
                        <input
                            type="range"
                            class="form-range"
                            id="itemCount"
                            min="1"
                            max="5"
                            step="1"
                            bind:value={itemCount}
                            onchange={() => clearEventLog()} />
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isMultiple" bind:checked={isMultiple} />
                        <label class="form-check-label" for="isMultiple">Allow Multiple Expanded Items</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isFlush" bind:checked={isFlush} />
                        <label class="form-check-label" for="isFlush">Flush Style</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="trackEvents" bind:checked={trackEvents} />
                        <label class="form-check-label" for="trackEvents">Track Events</label>
                    </div>

                    <div class="mb-3">
                        <span class="form-label">Expanded Items:</span>
                        <div>
                            {#each accordionItems as _accordionItem, accordionItemIndex (`accordionItem-${accordionItemIndex}`)}
                                <div class="form-check form-check-inline">
                                    <input
                                        type="checkbox"
                                        class="form-check-input"
                                        id={`expandItem${accordionItemIndex}`}
                                        checked={expandedItems.has(accordionItemIndex)}
                                        onclick={() => toggleItem(accordionItemIndex)} />
                                    <label class="form-check-label" for={`expandItem${accordionItemIndex}`}>Item {accordionItemIndex + 1}</label>
                                </div>
                            {/each}
                        </div>
                    </div>

                    {#if trackEvents}
                        <div class="p-3 border rounded">
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
                <div class="col-md-6">
                    <h4 class="h6">Preview</h4>

                    <div class="border rounded bg-light p-3" style="min-height: 300px;">
                        <Accordion.Root {isMultiple} {isFlush}>
                            {#each accordionItems as accordionItem2, accordionItem2Index (`accordionItem2-${accordionItem2Index}`)}
                                <Accordion.Item isExpanded={expandedItems.has(accordionItem2Index)}>
                                    <Accordion.Header>
                                        <Accordion.Button>{accordionItem2.title}</Accordion.Button>
                                    </Accordion.Header>
                                    <Accordion.Collapse
                                        onCollapse={trackEvents ? () => handleCollapse(accordionItem2Index) : undefined}
                                        onCollapsed={trackEvents ? () => handleCollapsed(accordionItem2Index) : undefined}
                                        onExpand={trackEvents ? () => handleExpand(accordionItem2Index) : undefined}
                                        onExpanded={trackEvents ? () => handleExpanded(accordionItem2Index) : undefined}>
                                        <Accordion.Body>
                                            {accordionItem2.content}
                                        </Accordion.Body>
                                    </Accordion.Collapse>
                                </Accordion.Item>
                            {/each}
                        </Accordion.Root>
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

<script lang="ts">
    import { ListGroup, type BaseBreakpoint, type BaseColorVariant } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Configurable props for ListGroup.Root
    let isFlush = $state(false);
    let isNumbered = $state(false);
    let horizontalOnBreakpoint: BaseBreakpoint | '' = $state('');
    let itemCount = $state(5);

    // Configurable props for ListGroup.Item
    let itemColorVariant: BaseColorVariant | '' = $state('');
    let hasActiveItem = $state(false);
    let hasDisabledItem = $state(false);
    let useItemAction = $state(false);
    let activeItemIndex = $state(0);
    let disabledItemIndex = $state(2);

    // Available options for variants
    const colorVariantOptions = [
        { value: '', label: 'None' },
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'success', label: 'Success' },
        { value: 'danger', label: 'Danger' },
        { value: 'warning', label: 'Warning' },
        { value: 'info', label: 'Info' },
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' }
    ];

    // Available options for breakpoints
    const breakpointOptions = [
        { value: '', label: 'None (Vertical)' },
        { value: 'xs', label: 'Always Horizontal (xs)' },
        { value: 'sm', label: 'Small (sm)' },
        { value: 'md', label: 'Medium (md)' },
        { value: 'lg', label: 'Large (lg)' },
        { value: 'xl', label: 'Extra Large (xl)' },
        { value: 'xxl', label: 'Extra Extra Large (xxl)' }
    ];

    // Generate list items based on count
    let items: string[] = $derived(Array.from({ length: itemCount }, (_, i) => `List item ${i + 1}`));

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<ListGroup.Root`;

        if (isFlush) code += `\n  isFlush={true}`;
        if (isNumbered) code += `\n  isNumbered={true}`;
        if (horizontalOnBreakpoint) code += `\n  horizontalOnBreakpoint="${horizontalOnBreakpoint}"`;

        code += `>`;

        // Add list items
        items.forEach((label, index) => {
            const isActive = hasActiveItem && index === activeItemIndex;
            const isDisabled = hasDisabledItem && index === disabledItemIndex;

            if (useItemAction) {
                code += `\n  <ListGroup.ItemAction`;

                if (itemColorVariant) code += `\n    colorVariant="${itemColorVariant}"`;
                if (isActive) code += `\n    isActive={true}`;
                if (isDisabled) code += `\n    isDisabled={true}`;
                code += `\n    href="#list-group-demo-link"`;

                code += `>${label}</ListGroup.ItemAction>`;
            } else {
                code += `\n  <ListGroup.Item`;

                if (itemColorVariant) code += `\n    colorVariant="${itemColorVariant}"`;
                if (isActive) code += `\n    isActive={true}`;

                code += `>${label}</ListGroup.Item>`;
            }
        });

        code += `\n</ListGroup.Root>`;

        return code;
    }

    // Track reactivity
    // Initialize codeSnippet
    let codeSnippet: string = $derived(getCodeSnippet());
</script>

<div class="playground">
    <div class="card mb-4">
        <div class="card-header">
            <h3 class="h5 mb-0">List Group Interactive Playground</h3>
        </div>

        <div class="card-body">
            <div class="row">
                <!-- Controls Column -->
                <div class="col-md-6">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <label for="itemCount" class="form-label">Number of Items</label>
                        <input type="range" class="form-range" id="itemCount" min="1" max="10" bind:value={itemCount} />
                        <div class="form-text text-center">{itemCount} item{itemCount > 1 ? 's' : ''}</div>
                    </div>

                    <div class="mb-4">
                        <h5 class="h6">List Group Options</h5>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="flushCheck" bind:checked={isFlush} />
                            <label class="form-check-label" for="flushCheck">Flush (borderless)</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="numberedCheck" bind:checked={isNumbered} />
                            <label class="form-check-label" for="numberedCheck">Numbered</label>
                        </div>
                        <div class="mb-3">
                            <label for="horizontalBreakpoint" class="form-label">Horizontal on Breakpoint</label>
                            <select id="horizontalBreakpoint" class="form-select" bind:value={horizontalOnBreakpoint}>
                                {#each breakpointOptions as breakpointOption, breakpointOptionIndex (`breakpointOption-${breakpointOptionIndex}`)}
                                    <option value={breakpointOption.value}>{breakpointOption.label}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h5 class="h6">List Item Options</h5>
                        <div class="mb-3">
                            <label for="itemColorVariant" class="form-label">Item Color Variant</label>
                            <select id="itemColorVariant" class="form-select" bind:value={itemColorVariant}>
                                {#each colorVariantOptions as colorVariantOption, colorVariantOptionIndex (`colorVariantOption-${colorVariantOptionIndex}`)}
                                    <option value={colorVariantOption.value}>{colorVariantOption.label}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="itemActionCheck" bind:checked={useItemAction} />
                            <label class="form-check-label" for="itemActionCheck">Use ListGroup.ItemAction (clickable items)</label>
                        </div>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="activeCheck" bind:checked={hasActiveItem} />
                            <label class="form-check-label" for="activeCheck">Include Active Item</label>
                        </div>

                        {#if hasActiveItem}
                            <div class="mb-3">
                                <label for="activeItemIndex" class="form-label">Active Item Index</label>
                                <input
                                    type="range"
                                    class="form-range"
                                    id="activeItemIndex"
                                    min="0"
                                    max={itemCount - 1}
                                    bind:value={activeItemIndex} />
                                <div class="form-text text-center">Item {activeItemIndex + 1}</div>
                            </div>
                        {/if}

                        {#if useItemAction}
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="disabledCheck" bind:checked={hasDisabledItem} />
                                <label class="form-check-label" for="disabledCheck">Include Disabled Item</label>
                            </div>

                            {#if hasDisabledItem}
                                <div class="mb-3">
                                    <label for="disabledItemIndex" class="form-label">Disabled Item Index</label>
                                    <input
                                        type="range"
                                        class="form-range"
                                        id="disabledItemIndex"
                                        min="0"
                                        max={itemCount - 1}
                                        bind:value={disabledItemIndex} />
                                    <div class="form-text text-center">Item {disabledItemIndex + 1}</div>
                                </div>
                            {/if}
                        {/if}
                    </div>
                </div>

                <div class="col-md-6">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light" style="min-height: 200px;">
                        <ListGroup.Root {isFlush} {isNumbered} horizontalOnBreakpoint={horizontalOnBreakpoint || undefined}>
                            {#each items as item, itemIndex (`item-${itemIndex}`)}
                                {#if useItemAction}
                                    <ListGroup.ItemAction
                                        colorVariant={itemColorVariant || undefined}
                                        isActive={hasActiveItem && itemIndex === activeItemIndex}
                                        isDisabled={hasDisabledItem && itemIndex === disabledItemIndex}
                                        href="#list-group-demo-link">
                                        {item}
                                    </ListGroup.ItemAction>
                                {:else}
                                    <ListGroup.Item
                                        colorVariant={itemColorVariant || undefined}
                                        isActive={hasActiveItem && itemIndex === activeItemIndex}>
                                        {item}
                                    </ListGroup.Item>
                                {/if}
                            {/each}
                        </ListGroup.Root>
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

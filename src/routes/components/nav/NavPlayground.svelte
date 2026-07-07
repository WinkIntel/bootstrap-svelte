<script lang="ts">
    import { Nav } from '$lib/index.js';
    import type { NavElementType, NavHorizontalAlignment, NavItemLayout, NavItemStyle, NavVerticalBreakpoint } from '$lib/Nav/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Configurable props
    let elementType: NavElementType = $state('ul');
    let itemStyle: NavItemStyle | undefined = $state(undefined);
    let itemLayout: NavItemLayout | undefined = $state(undefined);
    let horizontalAlignment: NavHorizontalAlignment | undefined = $state(undefined);
    let verticalBreakpoint: NavVerticalBreakpoint | undefined = $state(undefined);
    let itemCount = $state(3);
    let activeStateMode = $state('explicit'); // 'explicit' or 'internal'
    let explicitActiveIndex = $state(0);

    // Available options for dropdowns
    const elementTypeOptions = [
        { value: 'ul', label: 'UL Element (Default)' },
        { value: 'ol', label: 'OL Element' },
        { value: 'nav', label: 'Nav Element' }
    ];

    const itemStyleOptions = [
        { value: '', label: 'Default' },
        { value: 'pills', label: 'Pills' },
        { value: 'tabs', label: 'Tabs' },
        { value: 'underline', label: 'Underline' }
    ];

    const itemLayoutOptions = [
        { value: '', label: 'Default' },
        { value: 'fill', label: 'Fill' },
        { value: 'justified', label: 'Justified' }
    ];

    const horizontalAlignmentOptions = [
        { value: '', label: 'Default' },
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' }
    ];

    const verticalBreakpointOptions = [
        { value: '', label: 'None (Horizontal)' },
        { value: 'xs', label: 'Always Vertical' },
        { value: 'sm', label: 'Vertical below SM' },
        { value: 'md', label: 'Vertical below MD' },
        { value: 'lg', label: 'Vertical below LG' },
        { value: 'xl', label: 'Vertical below XL' },
        { value: 'xxl', label: 'Vertical below XXL' }
    ];

    const activeStateModeOptions = [
        { value: 'explicit', label: 'Explicit Control (isActive prop)' },
        { value: 'internal', label: 'Internal Management (no isActive prop)' }
    ];

    // Generate nav items based on count
    let navItems: string[] = $derived(Array.from({ length: itemCount }, (_, i) => `Nav Item ${i + 1}`));

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<Nav.Root`;

        if (elementType !== 'ul') code += `\n  elementType="${elementType}"`;
        if (itemStyle) code += `\n  itemStyle="${itemStyle}"`;
        if (itemLayout) code += `\n  itemLayout="${itemLayout}"`;
        if (horizontalAlignment) code += `\n  horizontalAlignment="${horizontalAlignment}"`;
        if (verticalBreakpoint) code += `\n  verticalBreakpoint="${verticalBreakpoint}"`;

        code += `>`;

        // Add nav items
        navItems.forEach((label, index) => {
            code += `\n  <Nav.Item>`;

            // Handle isActive based on mode
            if (activeStateMode === 'explicit') {
                const isActiveAttr = index === explicitActiveIndex ? ' isActive={true}' : ' isActive={false}';
                code += `\n    <Nav.Link id="playground-nav-link-${index}" href="#playground-nav-link-${index}"${isActiveAttr}>${label}</Nav.Link>`;
            } else {
                // Internal management - no isActive prop
                code += `\n    <Nav.Link id="playground-nav-link-${index}" href="#playground-nav-link-${index}">${label}</Nav.Link>`;
            }

            code += `\n  </Nav.Item>`;
        });

        code += `\n</Nav.Root>`;

        return code;
    }

    // Track reactivity with a regular function
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
                        <label for="itemCount" class="form-label">Number of Nav Items</label>
                        <input type="range" class="form-range" id="itemCount" min="1" max="8" bind:value={itemCount} />
                        <div class="form-text text-center">{itemCount} item{itemCount > 1 ? 's' : ''}</div>
                    </div>

                    <div class="mb-3">
                        <label for="elementType" class="form-label">Element Type</label>
                        <select id="elementType" class="form-select" bind:value={elementType}>
                            {#each elementTypeOptions as elementTypeOption, elementTypeOptionIndex (`elementTypeOption-${elementTypeOptionIndex}`)}
                                <option value={elementTypeOption.value}>{elementTypeOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="itemStyle" class="form-label">Item Style</label>
                        <select id="itemStyle" class="form-select" bind:value={itemStyle}>
                            {#each itemStyleOptions as itemStyleOption, itemStyleOptionIndex (`itemStyleOption-${itemStyleOptionIndex}`)}
                                <option value={itemStyleOption.value}>{itemStyleOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="itemLayout" class="form-label">Item Layout</label>
                        <select id="itemLayout" class="form-select" bind:value={itemLayout}>
                            {#each itemLayoutOptions as itemLayoutOption, itemLayoutOptionIndex (`itemLayoutOption-${itemLayoutOptionIndex}`)}
                                <option value={itemLayoutOption.value}>{itemLayoutOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="horizontalAlignment" class="form-label">Horizontal Alignment</label>
                        <select id="horizontalAlignment" class="form-select" bind:value={horizontalAlignment}>
                            {#each horizontalAlignmentOptions as horizontalAlignmentOption, horizontalAlignmentOptionIndex (`horizontalAlignmentOption-${horizontalAlignmentOptionIndex}`)}
                                <option value={horizontalAlignmentOption.value}>{horizontalAlignmentOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="verticalBreakpoint" class="form-label">Vertical Orientation</label>
                        <select id="verticalBreakpoint" class="form-select" bind:value={verticalBreakpoint}>
                            {#each verticalBreakpointOptions as verticalBreakpointOption, verticalBreakpointOptionIndex (`verticalBreakpointOption-${verticalBreakpointOptionIndex}`)}
                                <option value={verticalBreakpointOption.value}>{verticalBreakpointOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="activeStateMode" class="form-label">Active State Management</label>
                        <select id="activeStateMode" class="form-select" bind:value={activeStateMode}>
                            {#each activeStateModeOptions as activeStateModeOption, activeStateModeOptionIndex (`activeStateModeOption-${activeStateModeOptionIndex}`)}
                                <option value={activeStateModeOption.value}>{activeStateModeOption.label}</option>
                            {/each}
                        </select>
                        <div class="form-text">
                            {#if activeStateMode === 'explicit'}
                                Manual control via isActive prop
                            {:else}
                                Component manages state internally
                            {/if}
                        </div>
                    </div>

                    {#if activeStateMode === 'explicit'}
                        <div class="mb-3">
                            <label for="explicitActiveIndex" class="form-label">Active Item</label>
                            <select id="explicitActiveIndex" class="form-select" bind:value={explicitActiveIndex}>
                                {#each navItems as navItem, navItemIndex (`navItem-${navItemIndex}`)}
                                    <option value={navItemIndex}>{navItem}</option>
                                {/each}
                            </select>
                        </div>
                    {/if}
                </div>

                <!-- Preview Column -->
                <div class="col-md-8">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light d-flex" style="min-height: 150px;">
                        <Nav.Root {elementType} {itemStyle} {itemLayout} {horizontalAlignment} {verticalBreakpoint}>
                            {#each navItems as navItem2, navItem2Index (`navItem2-${navItem2Index}`)}
                                <Nav.Item>
                                    {#if activeStateMode === 'explicit'}
                                        <Nav.Link
                                            href="#playground-nav-link-{navItem2Index}"
                                            id="playground-nav-link-{navItem2Index}"
                                            isActive={navItem2Index === explicitActiveIndex}>{navItem2}</Nav.Link>
                                    {:else}
                                        <Nav.Link href="#playground-nav-link-{navItem2Index}" id="playground-nav-link-{navItem2Index}"
                                            >{navItem2}</Nav.Link>
                                    {/if}
                                </Nav.Item>
                            {/each}
                        </Nav.Root>
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
    :global(.nav-link.active) {
        font-weight: bold;
    }
</style>

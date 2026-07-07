<script lang="ts">
    import { Breadcrumb } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Divider options
    let dividerOptions = [
        { value: undefined, label: 'Default (/)' },
        { value: '>', label: 'Greater Than (>)' },
        { value: '•', label: 'Bullet (•)' },
        { value: '-', label: 'Dash (-)' },
        { value: '|', label: 'Pipe (|)' },
        { value: '→', label: 'Arrow (→)' },
        { value: '', label: 'None (empty string)' },
        {
            value: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'%3E%3Cpath d='M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z'/%3E%3C/svg%3E\")",
            label: 'SVG Chevron (SVG data URL)'
        }
    ];

    // Initial state
    let selectedDivider = $state<string | undefined>(undefined);
    let numItems = $state(3);
    let activeItemIndex = $state(2);

    // Generate items
    let items = $state([
        { label: 'Home', href: '#!' },
        { label: 'Library', href: '#!' },
        { label: 'Data', href: '#!' }
    ]);

    // Update items when numItems changes
    $effect(() => {
        const newItems = [];
        for (let i = 0; i < numItems; i++) {
            if (i === 0) {
                newItems.push({ label: 'Home', href: '#!' });
            } else if (i === numItems - 1) {
                newItems.push({ label: 'Data', href: '#!' });
            } else if (i === 1) {
                newItems.push({ label: 'Library', href: '#!' });
            } else {
                newItems.push({ label: `Level ${i}`, href: '#!' });
            }
        }
        items = newItems;

        // Ensure activeItemIndex is valid
        if (activeItemIndex >= numItems) {
            activeItemIndex = numItems - 1;
        }
    });

    // Generate code snippet from current settings
    function generateCode() {
        let code = '<Breadcrumb.Root';

        if (selectedDivider !== undefined) {
            if (typeof selectedDivider === 'string') {
                if (selectedDivider.startsWith('url')) {
                    code += ` divider="${selectedDivider}"`;
                } else {
                    code += ` divider="${selectedDivider}"`;
                }
            }
        }

        code += '>\n';

        items.forEach((item, index) => {
            code += `  <Breadcrumb.Item`;

            if (index === activeItemIndex) {
                code += ` isActive={true}`;
            } else {
                code += ` href="${item.href}"`;
            }

            code += `>${item.label}</Breadcrumb.Item>\n`;
        });

        code += '</Breadcrumb.Root>';

        return code;
    }

    let codeSnippet = $derived(generateCode());
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
                        <label for="divider" class="form-label">Divider Style</label>
                        <select id="divider" class="form-select" bind:value={selectedDivider}>
                            {#each dividerOptions as dividerOption, dividerOptionIndex (`dividerOption-${dividerOptionIndex}`)}
                                <option value={dividerOption.value}>{dividerOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="numItems" class="form-label">Number of Items</label>
                        <input type="range" class="form-range" id="numItems" min="1" max="6" bind:value={numItems} />
                        <div class="form-text">Count: {numItems}</div>
                    </div>

                    <div class="mb-3">
                        <label for="activeItem" class="form-label">Active Item</label>
                        <select id="activeItem" class="form-select" bind:value={activeItemIndex}>
                            {#each items as item, itemIndex (`item-${itemIndex}`)}
                                <option value={itemIndex}>{item.label}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="col-md-6">
                    <h4 class="h6">Preview</h4>
                    <div class="p-4 border rounded bg-light">
                        <Breadcrumb.Root divider={selectedDivider}>
                            {#each items as item2, item2Index (`item2-${item2Index}`)}
                                {#if item2Index === activeItemIndex}
                                    <Breadcrumb.Item isActive={true}>
                                        {item2.label}
                                    </Breadcrumb.Item>
                                {:else}
                                    <Breadcrumb.Item href={item2.href}>
                                        {item2.label}
                                    </Breadcrumb.Item>
                                {/if}
                            {/each}
                        </Breadcrumb.Root>
                    </div>
                </div>
            </div>

            <hr class="my-4" />

            <h4 class="h6">Code</h4>
            <SyntaxHighlighter code={codeSnippet} />
        </div>
    </div>
</div>

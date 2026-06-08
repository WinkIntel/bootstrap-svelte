<script lang="ts">
    import { Placeholder } from '$lib/index.js';
    import type { PlaceholderAnimationType, PlaceholderItemColorVariant, PlaceholderItemSize } from '$lib/Placeholder/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Initialize state
    let animationType: PlaceholderAnimationType | 'none' = $state('glow');
    let width = $state('col-6');
    let placeholderSize: PlaceholderItemSize | '' = $state('');
    let placeholderColorVariant: PlaceholderItemColorVariant | '' = $state('');
    let placeholderCount = $state(3);

    // Width options
    const widthOptions = [
        { value: 'col-12', label: 'Full width (col-12)' },
        { value: 'col-10', label: '10/12 width (col-10)' },
        { value: 'col-8', label: '8/12 width (col-8)' },
        { value: 'col-6', label: 'Half width (col-6)' },
        { value: 'col-4', label: '4/12 width (col-4)' },
        { value: 'w-75', label: '75% width (w-75)' },
        { value: 'w-50', label: '50% width (w-50)' },
        { value: 'w-25', label: '25% width (w-25)' }
    ];

    // Size options
    const sizeOptions = [
        { value: '', label: 'Default size' },
        { value: 'xs', label: 'Extra small' },
        { value: 'sm', label: 'Small' },
        { value: 'lg', label: 'Large' }
    ];

    // Variant options
    const colorVariantOptions = [
        { value: '', label: 'Default color' },
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'success', label: 'Success' },
        { value: 'danger', label: 'Danger' },
        { value: 'warning', label: 'Warning' },
        { value: 'info', label: 'Info' },
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' }
    ];

    // Function to generate example code based on current options
    function getCodeSnippet(): string {
        let code = animationType === 'none' ? '' : `<Placeholder.Root type="${animationType}">`;
        let indentation = animationType === 'none' ? '\n' : '\n    ';

        Array.from({ length: placeholderCount }, (_, i) => {
            // Create different widths for multiple placeholders
            const itemWidth = i === 0 ? width : ['col-8', 'col-10', 'col-4', 'col-6', 'col-7'][i % 5];

            code += indentation + `<Placeholder.Item class="${itemWidth}"`;
            if (placeholderSize) code += ` size="${placeholderSize}"`;
            if (placeholderColorVariant) code += ` colorVariant="${placeholderColorVariant}"`;
            code += ' />';
            return code;
        });

        code += animationType === 'none' ? '' : '\n</Placeholder.Root>';
        return code;
    }

    // Initialize codeSnippet
    let exampleCode: string = $derived(getCodeSnippet());
</script>

<div class="playground">
    <div class="card mb-4">
        <div class="card-header">
            <h3 class="h5 mb-0">Placeholder Interactive Playground</h3>
        </div>

        <div class="card-body">
            <div class="row">
                <div class="col-md-4">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <div class="form-label">Animation Type</div>
                        <div class="btn-group w-100" role="group" aria-label="Animation Type">
                            <input type="radio" class="btn-check" name="animation" id="animation-glow" bind:group={animationType} value="glow" />
                            <label class="btn btn-outline-primary" for="animation-glow">Glow</label>

                            <input type="radio" class="btn-check" name="animation" id="animation-wave" bind:group={animationType} value="wave" />
                            <label class="btn btn-outline-primary" for="animation-wave">Wave</label>

                            <input type="radio" class="btn-check" name="animation" id="animation-none" bind:group={animationType} value="none" />
                            <label class="btn btn-outline-primary" for="animation-none">None</label>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="width" class="form-label">Width</label>
                        <select class="form-select" id="width" bind:value={width}>
                            {#each widthOptions as widthOption, widthOptionIndex (`widthOption-${widthOptionIndex}`)}
                                <option value={widthOption.value}>{widthOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="size" class="form-label">Size</label>
                        <select class="form-select" id="size" bind:value={placeholderSize}>
                            {#each sizeOptions as sizeOption, sizeOptionIndex (`sizeOption-${sizeOptionIndex}`)}
                                <option value={sizeOption.value}>{sizeOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="colorVariant" class="form-label">Color Variant</label>
                        <select class="form-select" id="colorVariant" bind:value={placeholderColorVariant}>
                            {#each colorVariantOptions as colorVariantOption, colorVariantOptionIndex (`colorVariantOption-${colorVariantOptionIndex}`)}
                                <option value={colorVariantOption.value}>{colorVariantOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="count" class="form-label">Number of Placeholders</label>
                        <input type="range" class="form-range" min="1" max="5" id="count" bind:value={placeholderCount} />
                        <div class="form-text text-center">{placeholderCount} placeholder{placeholderCount !== 1 ? 's' : ''}</div>
                    </div>
                </div>

                <div class="col-md-8">
                    <h4 class="h6">Preview</h4>
                    <div class="p-4 border rounded bg-light" style="min-height: 200px;">
                        {#if animationType === 'none'}
                            {#each Array(placeholderCount) as _placeholderItem, placeholderItemIndex (`placeholderItem-${placeholderItemIndex}`)}
                                <!-- Create different widths for multiple placeholders -->
                                {@const itemWidth =
                                    placeholderItemIndex === 0 ? width : ['col-8', 'col-10', 'col-4', 'col-6', 'col-7'][placeholderItemIndex % 5]}
                                <p>
                                    <Placeholder.Item
                                        class={itemWidth}
                                        size={placeholderSize || undefined}
                                        colorVariant={placeholderColorVariant || undefined} />
                                </p>
                            {/each}
                        {:else}
                            <Placeholder.Root type={animationType}>
                                {#each Array(placeholderCount) as _placeholderItem, placeholderItemIndex (`placeholderItem-${placeholderItemIndex}`)}
                                    <!-- Create different widths for multiple placeholders -->
                                    {@const itemWidth =
                                        placeholderItemIndex === 0 ? width : ['col-8', 'col-10', 'col-4', 'col-6', 'col-7'][placeholderItemIndex % 5]}
                                    <p>
                                        <Placeholder.Item
                                            class={itemWidth}
                                            size={placeholderSize || undefined}
                                            colorVariant={placeholderColorVariant || undefined} />
                                    </p>
                                {/each}
                            </Placeholder.Root>
                        {/if}
                    </div>

                    <div class="mt-3">
                        <h4 class="h6">Code</h4>
                        <SyntaxHighlighter code={exampleCode} />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .playground :global(.placeholder) {
        display: block;
    }
    .playground :global(p) {
        margin-bottom: 0.5rem;
    }
</style>

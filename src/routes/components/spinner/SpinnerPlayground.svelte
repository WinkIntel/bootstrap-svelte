<script lang="ts">
    import type { BaseColorVariant } from '$lib/common/types.js';
    import { Spinner } from '$lib/index.js';
    import type { SpinnerColorVariant, SpinnerSize, SpinnerType } from '$lib/Spinner/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Component props that can be manipulated
    let type: SpinnerType = $state('border' as SpinnerType);
    let size: SpinnerSize = $state('');
    let colorVariant: SpinnerColorVariant = $state('primary' as SpinnerColorVariant);
    let showScreenReaderText: boolean = $state(true);
    let screenReaderText: string = $state('Loading...');

    // Available options for select dropdowns
    const typeOptions: SpinnerType[] = ['border', 'grow'];
    const sizeOptions: SpinnerSize[] = ['', 'sm'];
    const colorVariantOptions: BaseColorVariant[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<Spinner`;

        if (type !== 'border') code += `\n  type="${type}"`;
        if (size) code += `\n  size="${size}"`;
        if (colorVariant !== 'primary') code += `\n  colorVariant="${colorVariant}"`;

        code += `>`;

        if (showScreenReaderText) {
            code += `\n  <span class="visually-hidden">${screenReaderText}</span>`;
        }

        code += `\n</Spinner>`;

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
                        <label for="type" class="form-label">Type</label>
                        <select class="form-select" id="type" bind:value={type}>
                            {#each typeOptions as typeOption, typeOptionIndex (`typeOption-${typeOptionIndex}`)}
                                <option value={typeOption}>{typeOption}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="size" class="form-label">Size</label>
                        <select class="form-select" id="size" bind:value={size}>
                            <option value="">Default</option>
                            {#each sizeOptions.filter((s) => s) as sizeOption, sizeOptionIndex (`sizeOption-${sizeOptionIndex}`)}
                                <option value={sizeOption}>{sizeOption}</option>
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

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="showScreenReaderText" bind:checked={showScreenReaderText} />
                        <label class="form-check-label" for="showScreenReaderText">Include Screen Reader Text</label>
                    </div>

                    {#if showScreenReaderText}
                        <div class="mb-3">
                            <label for="screenReaderText" class="form-label">Screen Reader Text</label>
                            <input type="text" class="form-control" id="screenReaderText" bind:value={screenReaderText} />
                        </div>
                    {/if}
                </div>

                <!-- Preview Column -->
                <div class="col-md-8">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light d-flex align-items-center justify-content-center" style="min-height: 100px;">
                        <Spinner {type} {size} {colorVariant}>
                            {#if showScreenReaderText}
                                <span class="visually-hidden">{screenReaderText}</span>
                            {/if}
                        </Spinner>
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

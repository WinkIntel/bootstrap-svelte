<script lang="ts">
    import { toStyle, type CSSProperties } from '$lib/common/css.js';
    import { ProgressBar } from '$lib/index.js';
    import type { ProgressBackgroundColorVariant } from '$lib/Progress/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Component props that can be manipulated
    let value: number = $state(25);
    let backgroundColorVariant: ProgressBackgroundColorVariant | '' = $state('');
    let isStriped: boolean = $state(false);
    let isAnimated: boolean = $state(false);
    let showLabel: boolean = $state(false);
    let height: string = $state('');

    // Available options for select dropdowns
    const variantOptions: (ProgressBackgroundColorVariant | '')[] = [
        '',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark'
    ];

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<ProgressBar`;
        code += `\n  valueNow={${value}}`;

        if (backgroundColorVariant) {
            code += `\n  backgroundColorVariant="${backgroundColorVariant}"`;
        }

        if (isStriped && !isAnimated) {
            code += `\n  barProps={{ isStriped: true }}`;
        }
        if (isStriped && isAnimated) {
            code += `\n  barProps={{ isStriped: true, isAnimated: true }}`;
        }

        if (height) {
            code += `\n  style="height: ${height};"`;
        }

        code += `>`;

        if (showLabel) {
            code += `\n  ${value}%`;
        }

        code += `\n</ProgressBar>`;

        return code;
    }

    // Derive styles based on height
    const styles = $derived.by(() => {
        if (!height) {
            return undefined;
        }

        let cssProps: CSSProperties = {};
        return toStyle({
            ...cssProps,
            height: height
        });
    });

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
                        <label for="value" class="form-label">Value (%)</label>
                        <input type="range" class="form-range" id="value" min="0" max="100" bind:value />
                        <div class="text-muted small">{value}%</div>
                    </div>

                    <div class="mb-3">
                        <label for="variant" class="form-label">Color Variant</label>
                        <select class="form-select" id="variant" bind:value={backgroundColorVariant}>
                            <option value="">Default</option>
                            {#each variantOptions.filter((v) => v !== '') as variantOption, variantOptionIndex (`variantOption-${variantOptionIndex}`)}
                                <option value={variantOption}>{variantOption}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="height" class="form-label">Height</label>
                        <select class="form-select" id="height" bind:value={height}>
                            <option value="">Default</option>
                            <option value="1px">1px</option>
                            <option value="10px">10px</option>
                            <option value="20px">20px</option>
                            <option value="30px">30px</option>
                        </select>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isStriped" bind:checked={isStriped} />
                        <label class="form-check-label" for="isStriped">Striped</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isAnimated" bind:checked={isAnimated} disabled={!isStriped} />
                        <label class="form-check-label" for="isAnimated">Animated (requires Striped)</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="showLabel" bind:checked={showLabel} />
                        <label class="form-check-label" for="showLabel">Show Label</label>
                    </div>
                </div>

                <!-- Preview Column -->
                <div class="col-md-8">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light">
                        <ProgressBar
                            valueNow={value}
                            backgroundColorVariant={backgroundColorVariant || undefined}
                            style={styles}
                            barProps={{
                                isStriped,
                                isAnimated: isStriped && isAnimated
                            }}>
                            {#if showLabel}
                                {value}%
                            {/if}
                        </ProgressBar>
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

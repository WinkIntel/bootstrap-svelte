<script lang="ts">
    import type { BadgeColorVariant, BadgePosition } from '$lib/Badge/types.js';
    import { Badge } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Component props that can be manipulated
    let colorVariant: BadgeColorVariant = $state('text-bg-primary' as BadgeColorVariant);
    let isPill: boolean = $state(false);
    let position: BadgePosition | undefined = $state(undefined as BadgePosition | undefined);
    let badgeText: string = $state('Badge Text');

    // Available options for select dropdowns
    const variantOptions: string[] = [
        'text-bg-primary',
        'text-bg-secondary',
        'text-bg-success',
        'text-bg-danger',
        'text-bg-warning',
        'text-bg-info',
        'text-bg-light',
        'text-bg-dark',
        'bg-secondary-subtle',
        'bg-success-subtle',
        'bg-danger-subtle',
        'bg-warning-subtle',
        'bg-info-subtle',
        'bg-light-subtle',
        'bg-dark-subtle'
    ] as const;

    const positionOptions: string[] = [
        '',
        'top-start',
        'top-middle',
        'top-end',
        'middle-start',
        'middle-middle',
        'middle-end',
        'bottom-start',
        'bottom-middle',
        'bottom-end'
    ] as const;

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<Badge`;

        if (colorVariant !== 'text-bg-primary') code += `\n  colorVariant="${colorVariant}"`;
        if (isPill) code += `\n  pill={true}`;
        if (position) code += `\n  position="${position}"`;

        code += `>\n`;
        code += `  ${badgeText}`;
        code += `\n</Badge>`;

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
                <div class="col-md-6">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <label for="badgeText" class="form-label">Text</label>
                        <input type="text" class="form-control" id="badgeText" bind:value={badgeText} />
                    </div>

                    <div class="mb-3">
                        <label for="colorVariant" class="form-label">Color Variant</label>
                        <select class="form-select" id="colorVariant" bind:value={colorVariant}>
                            {#each variantOptions as variantOption, variantOptionIndex (`variantOption-${variantOptionIndex}`)}
                                <option value={variantOption}>{variantOption}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="position" class="form-label">Position</label>
                        <select class="form-select" id="position" bind:value={position}>
                            {#each positionOptions as positionOption, positionOptionIndex (`positionOption-${positionOptionIndex}`)}
                                <option value={positionOption}>{positionOption || 'default'}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="pill" bind:checked={isPill} />
                        <label class="form-check-label" for="pill">Pill style</label>
                    </div>
                </div>

                <!-- Preview Column -->
                <div class="col-md-6">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light d-flex align-items-center justify-content-center" style="min-height: 100px;">
                        {#if position}
                            <button type="button" class="btn btn-primary position-relative">
                                Inbox
                                <Badge {colorVariant} {isPill} {position}>{badgeText}</Badge>
                            </button>
                        {:else}
                            <Badge {colorVariant} {isPill} {position}>{badgeText}</Badge>
                        {/if}
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

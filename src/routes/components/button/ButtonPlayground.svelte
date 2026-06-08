<script lang="ts">
    import { Button } from '$lib/index.js';

    // Import the ButtonVariant and ButtonSize types with the correct path
    import type { ButtonColorVariant, ButtonSize } from '$lib/Button/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Define button type type
    type ButtonType = 'button' | 'link' | 'input';

    // Component props that can be manipulated
    let colorVariant: ButtonColorVariant = $state('primary' as ButtonColorVariant);
    let size: ButtonSize = $state('');
    let disabled: boolean = $state(false);
    let buttonText: string = $state('Button Text');
    let buttonType: ButtonType = $state('button');
    let href: string = $state('#');
    let trackClicks: boolean = $state(true);
    let clickCount: number = $state(0);
    let lastClickTime: string = $state('');

    // Available options for select dropdowns
    const colorVariantOptions: string[] = [
        '',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
        'link',
        'outline-primary',
        'outline-secondary',
        'outline-success',
        'outline-danger',
        'outline-warning',
        'outline-info',
        'outline-light',
        'outline-dark'
    ] as const;

    const sizeOptions: string[] = ['', 'sm', 'lg'] as const;
    const buttonTypeOptions: ButtonType[] = ['button', 'link', 'input'];

    // Handle button click
    function handleClick() {
        if (trackClicks) {
            clickCount++;
            lastClickTime = new Date().toLocaleTimeString();
        }
    }

    // Reset click stats
    function resetClickStats() {
        clickCount = 0;
        lastClickTime = '';
    }

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<Button`;

        if (colorVariant) code += `\n  colorVariant="${colorVariant}"`;
        if (size) code += `\n  size="${size}"`;
        if (disabled) code += `\n  disabled={true}`;
        if (buttonType === 'link') code += `\n  href="${href}"`;
        if (buttonType === 'input') code += `\n  type="submit"\n  value="${buttonText}"`;
        if (trackClicks) code += `\n  onclick={handleClick}`;

        code += `>${buttonType !== 'input' ? buttonText : ''}</Button>`;

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
                        <label for="buttonText" class="form-label">Text</label>
                        <input type="text" class="form-control" id="buttonText" bind:value={buttonText} />
                    </div>

                    <div class="mb-3">
                        <label for="colorVariant" class="form-label">Color Variant</label>
                        <select class="form-select" id="colorVariant" bind:value={colorVariant}>
                            {#each colorVariantOptions as colorVariantOption, colorVariantOptionIndex (`colorVariantOption-${colorVariantOptionIndex}`)}
                                <option value={colorVariantOption}>{colorVariantOption || 'default'}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="size" class="form-label">Size</label>
                        <select class="form-select" id="size" bind:value={size}>
                            {#each sizeOptions as sizeOption, sizeOptionIndex (`sizeOption-${sizeOptionIndex}`)}
                                <option value={sizeOption}>{sizeOption || 'default'}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="buttonType" class="form-label">Button Type</label>
                        <div class="d-flex gap-3">
                            {#each buttonTypeOptions as buttonTypeOption, buttonTypeOptionIndex (`buttonTypeOption-${buttonTypeOptionIndex}`)}
                                <div class="form-check">
                                    <input
                                        type="radio"
                                        class="form-check-input"
                                        id={`type-${buttonTypeOption}`}
                                        name="buttonType"
                                        value={buttonTypeOption}
                                        bind:group={buttonType} />
                                    <label class="form-check-label" for={`type-${buttonTypeOption}`}>
                                        {buttonTypeOption.charAt(0).toUpperCase() + buttonTypeOption.slice(1)}
                                    </label>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="disabled" bind:checked={disabled} />
                        <label class="form-check-label" for="disabled">Disabled</label>
                    </div>

                    {#if buttonType === 'link'}
                        <div class="mb-3">
                            <label for="href" class="form-label">href</label>
                            <input type="text" class="form-control" id="href" bind:value={href} />
                        </div>
                    {/if}

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="trackClicks" bind:checked={trackClicks} />
                        <label class="form-check-label" for="trackClicks">Track Click Events</label>
                    </div>
                </div>

                <!-- Preview Column -->
                <div class="col-md-6">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light d-flex align-items-center justify-content-center" style="min-height: 100px;">
                        {#if buttonType === 'link'}
                            <Button {disabled} {href} {size} {colorVariant} onclick={trackClicks ? handleClick : undefined}>{buttonText}</Button>
                        {:else if buttonType === 'input'}
                            <Button {disabled} {size} {colorVariant} value={buttonText} onclick={trackClicks ? handleClick : undefined}></Button>
                        {:else}
                            <Button {disabled} {size} {colorVariant} onclick={trackClicks ? handleClick : undefined}>{buttonText}</Button>
                        {/if}
                    </div>

                    <div class="mt-3">
                        <h4 class="h6">Code</h4>
                        <SyntaxHighlighter code={codeSnippet} />
                    </div>

                    {#if trackClicks}
                        <div class="mt-3 p-3 border rounded">
                            <div class="d-flex justify-content-between align-items-center">
                                <h4 class="h6 mb-0">Click Events</h4>
                                <button class="btn btn-sm btn-outline-secondary" onclick={resetClickStats}>Reset</button>
                            </div>
                            <div class="mt-2">
                                <p class="mb-1"><strong>Click count:</strong> {clickCount}</p>
                                {#if lastClickTime}
                                    <p class="mb-0"><strong>Last clicked:</strong> {lastClickTime}</p>
                                {/if}
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

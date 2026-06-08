<script lang="ts">
    import { Button, ButtonGroup, type ButtonColorVariant, type ButtonGroupSize } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Configurable props
    let vertical = $state(false);
    let size: ButtonGroupSize = $state('');
    let buttonCount = $state(3);
    let buttonVariant: ButtonColorVariant = $state('primary');

    // Available options for dropdowns
    const sizeOptions = [
        { value: '', label: 'Default' },
        { value: 'sm', label: 'Small' },
        { value: 'lg', label: 'Large' }
    ];

    const variantOptions = [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'success', label: 'Success' },
        { value: 'danger', label: 'Danger' },
        { value: 'warning', label: 'Warning' },
        { value: 'info', label: 'Info' },
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'outline-primary', label: 'Outline Primary' },
        { value: 'outline-secondary', label: 'Outline Secondary' }
    ];

    // Generate buttons based on count
    let buttons: string[] = $derived(Array.from({ length: buttonCount }, (_, i) => `Button ${i + 1}`));

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<ButtonGroup`;

        if (vertical) code += `\n  vertical={true}`;
        if (size) code += `\n  size="${size}"`;

        code += `>`;

        // Add buttons
        buttons.forEach((label) => {
            code += `\n  <Button colorVariant="${buttonVariant}">${label}</Button>`;
        });

        code += `\n</ButtonGroup>`;

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
                        <label for="buttonCount" class="form-label">Number of Buttons</label>
                        <input type="range" class="form-range" id="buttonCount" min="1" max="10" bind:value={buttonCount} />
                        <div class="form-text text-center">{buttonCount} button{buttonCount > 1 ? 's' : ''}</div>
                    </div>

                    <div class="mb-3">
                        <label for="buttonVariant" class="form-label">Button Variant</label>
                        <select id="buttonVariant" class="form-select" bind:value={buttonVariant}>
                            {#each variantOptions as variantOption, variantOptionIndex (`variantOption-${variantOptionIndex}`)}
                                <option value={variantOption.value}>{variantOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="buttonSize" class="form-label">Size</label>
                        <select id="buttonSize" class="form-select" bind:value={size}>
                            {#each sizeOptions as sizeOption, sizeOptionIndex (`sizeOption-${sizeOptionIndex}`)}
                                <option value={sizeOption.value}>{sizeOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="verticalCheck" bind:checked={vertical} />
                            <label class="form-check-label" for="verticalCheck"> Vertical Button Group </label>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light d-flex align-items-center justify-content-center" style="min-height: 100px;">
                        <ButtonGroup isVertical={vertical} {size}>
                            {#each buttons as button, buttonIndex (`button-${buttonIndex}`)}
                                <Button colorVariant={buttonVariant}>{button}</Button>
                            {/each}
                        </ButtonGroup>
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

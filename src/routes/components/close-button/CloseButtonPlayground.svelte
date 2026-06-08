<script lang="ts">
    // Import the types
    import { CloseButton } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Component props that can be manipulated
    let isDarkMode: boolean = $state(false);
    let disabled: boolean = $state(false);
    let ariaLabel: string = $state('Close');

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<CloseButton`;

        if (disabled) code += `\n  disabled`;
        if (ariaLabel !== 'Close') code += `\n  ariaLabel="${ariaLabel}"`;

        code += ` />`;

        if (isDarkMode) {
            code = `<div data-bs-theme="dark">\n  ${code}\n</div>`;
        }

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
                <div class="col-md-6">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <label for="ariaLabel" class="form-label">Aria Label</label>
                        <input type="text" class="form-control" id="ariaLabel" bind:value={ariaLabel} />
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="disabled" bind:checked={disabled} />
                        <label class="form-check-label" for="disabled">Disabled</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="darkMode" bind:checked={isDarkMode} />
                        <label class="form-check-label" for="darkMode">Dark mode</label>
                    </div>
                </div>

                <!-- Preview Column -->
                <div class="col-md-6">
                    <h4 class="h6">Preview</h4>

                    <div
                        class="p-4 border rounded d-flex align-items-center justify-content-center"
                        class:bg-dark={isDarkMode}
                        data-bs-theme={isDarkMode ? 'dark' : 'light'}
                        style="min-height: 100px;">
                        <CloseButton {disabled} {ariaLabel} />
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

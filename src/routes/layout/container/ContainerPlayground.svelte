<script lang="ts">
    import type { ContainerBreakpoint, ContainerElementType } from '$lib/Container/types.js';
    import { Container } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Component props that can be manipulated
    let breakpoint: ContainerBreakpoint | undefined = $state(undefined);
    let isFluid: boolean = $state(false);
    let elementType: ContainerElementType = $state('div');

    // Available options for select dropdowns
    const breakpointOptions: Array<ContainerBreakpoint | ''> = ['', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
    const elementTypeOptions: ContainerElementType[] = ['article', 'aside', 'div', 'footer', 'header', 'main', 'section'];

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<Container`;

        if (breakpoint) code += `\n  breakpoint="${breakpoint}"`;
        if (isFluid) code += `\n  isFluid={true}`;
        if (elementType !== 'div') code += `\n  elementType="${elementType}"`;

        code += `>\n`;
        code += `  <!-- Content goes here -->`;
        code += `\n</Container>`;

        return code;
    }

    // Track reactivity for code snippet
    let codeSnippet: string = $derived(getCodeSnippet());
</script>

<div class="playground">
    <div class="card mb-4">
        <div class="card-header">
            <h3 class="h5 mb-0">Interactive Playground</h3>
        </div>

        <div class="card-body">
            <div class="row">
                <div class="col">
                    <h4 class="h6">Preview</h4>

                    <div class="p-0 border rounded bg-light" style="min-height: 300px; position: relative; overflow: hidden;">
                        <div class="bg-secondary bg-opacity-10 p-2 text-muted small border-bottom">
                            Container Preview (colored to show boundaries)
                        </div>

                        <!-- This is just to simulate the page context -->
                        <div class="p-2" style="background-color: #f8f9fa;">
                            <!-- Actual container component -->
                            <Container
                                {breakpoint}
                                {isFluid}
                                {elementType}
                                class="p-3 border border-primary border-opacity-25 bg-primary bg-opacity-10">
                                <div class="p-2 text-center">
                                    <h5>
                                        {#if isFluid}
                                            Fluid Container
                                        {:else if breakpoint}
                                            Container-{breakpoint}
                                        {:else}
                                            Default Container
                                        {/if}
                                        <small class="d-block text-muted mt-1">({elementType} element)</small>
                                    </h5>
                                    <p class="mb-0 small">Resize the browser window to see how the container responds.</p>
                                </div>
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mt-3">
                        <h4 class="h6">Controls</h4>
                    </div>

                    <div class="mb-3">
                        <label for="elementType" class="form-label">Element Type</label>
                        <select class="form-select" id="elementType" bind:value={elementType}>
                            {#each elementTypeOptions as elementTypeOption, elementTypeOptionIndex (`elementTypeOption-${elementTypeOptionIndex}`)}
                                <option value={elementTypeOption}>{elementTypeOption}</option>
                            {/each}
                        </select>
                        <div class="form-text">Select the HTML element to use for the container.</div>
                    </div>

                    <div class="mb-3">
                        <label for="breakpoint" class="form-label">Breakpoint</label>
                        <select class="form-select" id="breakpoint" bind:value={breakpoint}>
                            {#each breakpointOptions as breakpointOption, breakpointOptionIndex (`breakpointOption-${breakpointOptionIndex}`)}
                                <option value={breakpointOption}>{breakpointOption || 'default'}</option>
                            {/each}
                        </select>
                        <div class="form-text">Select a breakpoint for the container, or leave empty for default container.</div>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isFluid" bind:checked={isFluid} />
                        <label class="form-check-label" for="isFluid">Fluid container</label>
                        <div class="form-text">Makes the container full-width across all viewport sizes.</div>
                    </div>
                </div>

                <div class="col-md-6">
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

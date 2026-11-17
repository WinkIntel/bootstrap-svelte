<script lang="ts">
    import { Pagination } from '$lib/index.js';
    import type { PaginationAlignment, PaginationSize } from '$lib/Pagination/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Configurable props
    let alignment: PaginationAlignment | undefined = $state(undefined);
    let size: PaginationSize | undefined = $state(undefined);
    let isDisabled: boolean = $state(false);
    let hasDisabledItem = $state(false);
    let disabledItemIndex = $state(1);
    let pageCount = $state(5);

    // Available options for dropdowns
    const alignmentOptions = [
        { value: undefined, label: 'Default (Start)' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' }
    ];

    const sizeOptions = [
        { value: undefined, label: 'Default' },
        { value: 'sm', label: 'Small' },
        { value: 'lg', label: 'Large' }
    ];

    // Generate pagination items based on count
    let pageNumbers: number[] = $derived(Array.from({ length: pageCount }, (_, i) => i + 1));
    let activePage = $state(1);

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = `<script>
    import { Pagination } from '@winkintel/bootstrap-svelte';
    let activePage = $state(${activePage});
\u003c/script>

<Pagination.Root isStateful={false}`;

        if (size) code += `\n  size="${size}"`;
        if (alignment) code += `\n  alignment="${alignment}"`;
        code += `>`;

        // Add Previous button
        code += `\n  <Pagination.Item isControl isDisabled={${isDisabled ? 'true' : 'activePage === 1'}}>`;
        code += `\n    <Pagination.Link href="#!" aria-label="Previous" onclick={() => activePage = Math.max(1, activePage - 1)}>`;
        code += `\n      <span aria-hidden="true">&laquo;</span>`;
        code += `\n    </Pagination.Link>`;
        code += `\n  </Pagination.Item>`;

        // Add page items
        pageNumbers.forEach((num) => {
            code += `\n  <Pagination.Item isActive={activePage === ${num}}${isDisabled || (hasDisabledItem && disabledItemIndex + 1 === num) ? ' isDisabled={true}' : ''}>`;
            code += `\n    <Pagination.Link href="#!" onclick={() => activePage = ${num}}>${num}</Pagination.Link>`;
            code += `\n  </Pagination.Item>`;
        });

        // Add Next button
        code += `\n  <Pagination.Item isControl isDisabled={${isDisabled ? 'true' : `activePage === ${pageCount}`}}>`;
        code += `\n    <Pagination.Link href="#!" aria-label="Next" onclick={() => activePage = Math.min(${pageCount}, activePage + 1)}>`;
        code += `\n      <span aria-hidden="true">&raquo;</span>`;
        code += `\n    </Pagination.Link>`;
        code += `\n  </Pagination.Item>`;

        code += `\n</Pagination.Root>`;

        return code;
    }

    function handlePageClick(pageNum: number) {
        if (pageNum >= 1 && pageNum <= pageCount && !isDisabled) {
            activePage = pageNum;
        }
    }

    function handlePrevious() {
        if (activePage > 1 && !isDisabled) {
            activePage--;
        }
    }

    function handleNext() {
        if (activePage < pageCount && !isDisabled) {
            activePage++;
        }
    }

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
                        <label for="alignment" class="form-label">Alignment</label>
                        <select id="alignment" class="form-select" bind:value={alignment}>
                            {#each alignmentOptions as alignmentOption, alignmentOptionIndex (`alignmentOption-${alignmentOptionIndex}`)}
                                <option value={alignmentOption.value}>{alignmentOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="size" class="form-label">Size</label>
                        <select id="size" class="form-select" bind:value={size}>
                            {#each sizeOptions as sizeOption, sizeOptionIndex (`sizeOption-${sizeOptionIndex}`)}
                                <option value={sizeOption.value}>{sizeOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="pageCount" class="form-label">Number of Pages</label>
                        <input type="range" class="form-range" id="pageCount" min="1" max="10" bind:value={pageCount} />
                        <div class="form-text">Count: {pageCount}</div>
                    </div>

                    <div class="mb-3 form-check">
                        <input class="form-check-input" type="checkbox" id="disabledCheck" bind:checked={hasDisabledItem} />
                        <label class="form-check-label" for="disabledCheck">Include Disabled Item</label>
                    </div>

                    {#if hasDisabledItem}
                        <div class="mb-3">
                            <label for="disabledItemIndex" class="form-label">Disabled Item Index</label>
                            <input
                                type="range"
                                class="form-range"
                                id="disabledItemIndex"
                                min="0"
                                max={pageCount - 1}
                                bind:value={disabledItemIndex} />
                            <div class="form-text text-center">Item {disabledItemIndex + 1}</div>
                        </div>
                    {/if}
                </div>

                <!-- Preview Column -->
                <div class="col-md-8">
                    <h4 class="h6">Preview</h4>

                    <div class="p-4 border rounded bg-light">
                        <Pagination.Root {alignment} {size} isStateful={false}>
                            <Pagination.Item isControl isDisabled={isDisabled || activePage === 1}>
                                <Pagination.Link href="#!" aria-label="Previous" onclick={handlePrevious}>
                                    <span aria-hidden="true">&laquo;</span>
                                </Pagination.Link>
                            </Pagination.Item>

                            {#each pageNumbers as pageNum, pageNumIndex (`pageNum-${pageNumIndex}`)}
                                <Pagination.Item
                                    isActive={activePage === pageNum}
                                    isDisabled={isDisabled || (hasDisabledItem && disabledItemIndex + 1 === pageNum)}>
                                    <Pagination.Link href="#!" onclick={() => handlePageClick(pageNum)}>
                                        {pageNum}
                                    </Pagination.Link>
                                </Pagination.Item>
                            {/each}

                            <Pagination.Item isControl isDisabled={isDisabled || activePage === pageCount}>
                                <Pagination.Link href="#!" aria-label="Next" onclick={handleNext}>
                                    <span aria-hidden="true">&raquo;</span>
                                </Pagination.Link>
                            </Pagination.Item>
                        </Pagination.Root>
                    </div>
                </div>
            </div>

            <hr class="my-4" />

            <h4 class="h6">Code</h4>
            <SyntaxHighlighter code={codeSnippet} />
        </div>
    </div>
</div>

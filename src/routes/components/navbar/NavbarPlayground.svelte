<script lang="ts">
    import { Container, Nav, Navbar } from '$lib/index.js';
    import type { NavbarColorVariant, NavbarExpandBreakpoint, NavbarPlacement } from '$lib/Navbar/types.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Configurable props
    let expandOnBreakpoint: NavbarExpandBreakpoint = $state('lg');
    let useContainer: boolean = $state(true);
    let isContainerFluid: boolean = $state(true);
    let hasForm: boolean = $state(false);
    let hasText: boolean = $state(false);
    let hasBrand: boolean = $state(true);
    let placement: NavbarPlacement | undefined = $state(undefined);
    let colorVariant: NavbarColorVariant | undefined = $state(undefined);
    let searchButtonClass = $derived.by(() => {
        if (
            colorVariant === 'dark' ||
            colorVariant === 'primary' ||
            colorVariant === 'secondary' ||
            colorVariant === 'success' ||
            colorVariant === 'danger'
        ) {
            return 'btn-outline-light';
        }
        return 'btn-outline-dark';
    });

    // Available options for dropdowns
    const expandBreakpointOptions = [
        { value: 'xs', label: 'Always Expanded' },
        { value: 'sm', label: 'Expand at SM' },
        { value: 'md', label: 'Expand at MD' },
        { value: 'lg', label: 'Expand at LG (Default)' },
        { value: 'xl', label: 'Expand at XL' },
        { value: 'xxl', label: 'Expand at XXL' }
    ];

    const placementOptions = [
        { value: '', label: 'Default (none)' },
        { value: 'fixed-top', label: 'Fixed Top' },
        { value: 'fixed-bottom', label: 'Fixed Bottom' },
        { value: 'sticky-top', label: 'Sticky Top' },
        { value: 'sticky-bottom', label: 'Sticky Bottom' }
    ];

    const colorVariantOptions = [
        { value: '', label: 'None' },
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'success', label: 'Success' },
        { value: 'danger', label: 'Danger' },
        { value: 'warning', label: 'Warning' },
        { value: 'info', label: 'Info' },
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' }
    ];

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let code = '<Navbar.Root';

        code += `\n  expandOnBreakpoint="${expandOnBreakpoint}"`;
        if (placement) code += `\n  placement="${placement}"`;
        if (colorVariant) code += `\n  colorVariant="${colorVariant}"`;

        code += '>\n';

        if (useContainer) {
            code += `  <Container${isContainerFluid ? ' isFluid={true}' : ''}>\n`;
        }

        if (hasBrand) {
            code += '    <Navbar.Brand href="#!">Navbar</Navbar.Brand>\n';
        }

        code += '    <Navbar.Toggler ariaLabel="Toggle navigation">\n';
        code += '      <Navbar.TogglerIcon />\n';
        code += '    </Navbar.Toggler>\n';
        code += '    <Navbar.Collapse id="navbarContent">\n';
        code += '      <Navbar.Nav class="me-auto mb-2 mb-lg-0">\n';
        code += '        <Nav.Item>\n';
        code += '          <Nav.Link isActive={true} href="#!">Home</Nav.Link>\n';
        code += '        </Nav.Item>\n';
        code += '        <Nav.Item>\n';
        code += '          <Nav.Link href="#!">Features</Nav.Link>\n';
        code += '        </Nav.Item>\n';
        code += '        <Nav.Item>\n';
        code += '          <Nav.Link href="#!">Pricing</Nav.Link>\n';
        code += '        </Nav.Item>\n';
        code += '        <Nav.Item>\n';
        code += '          <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>\n';
        code += '        </Nav.Item>\n';
        code += '      </Navbar.Nav>\n';

        if (hasText) {
            code += '      <Navbar.Text class="me-2">Signed in as: User</Navbar.Text>\n';
        }

        if (hasForm) {
            code += '      <form class="d-flex" role="search">\n';
            code += '        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />\n';
            code += `        <button class="btn ${searchButtonClass}" type="submit">Search</button>\n`;
            code += '      </form>\n';
        }

        code += '    </Navbar.Collapse>\n';

        if (useContainer) {
            code += '  </Container>\n';
        }

        code += '</Navbar.Root>';

        return code;
    }

    // Track reactivity with effect
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
                <div class="col-md-3">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <label for="expandOnBreakpoint" class="form-label">Expand On Breakpoint</label>
                        <select id="expandOnBreakpoint" class="form-select" bind:value={expandOnBreakpoint}>
                            {#each expandBreakpointOptions as expandBreakpointOption, expandBreakpointOptionIndex (`expandBreakpointOption-${expandBreakpointOptionIndex}`)}
                                <option value={expandBreakpointOption.value}>{expandBreakpointOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="placement" class="form-label">Placement</label>
                        <select id="placement" class="form-select" bind:value={placement}>
                            {#each placementOptions as placementOption, placementOptionIndex (`placementOption-${placementOptionIndex}`)}
                                <option value={placementOption.value}>{placementOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="colorVariant" class="form-label">Color Variant</label>
                        <select id="colorVariant" class="form-select" bind:value={colorVariant}>
                            {#each colorVariantOptions as colorVariantOption, colorVariantOptionIndex (`colorVariantOption-${colorVariantOptionIndex}`)}
                                <option value={colorVariantOption.value}>{colorVariantOption.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="useContainer" bind:checked={useContainer} />
                        <label class="form-check-label" for="useContainer">Use Container</label>
                    </div>

                    {#if useContainer}
                        <div class="mb-3 form-check ms-4">
                            <input type="checkbox" class="form-check-input" id="isContainerFluid" bind:checked={isContainerFluid} />
                            <label class="form-check-label" for="isContainerFluid">Fluid Container</label>
                        </div>
                    {/if}

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="hasForm" bind:checked={hasForm} />
                        <label class="form-check-label" for="hasForm">Include Search Form</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="hasText" bind:checked={hasText} />
                        <label class="form-check-label" for="hasText">Include Navbar Text</label>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="hasBrand" bind:checked={hasBrand} />
                        <label class="form-check-label" for="hasBrand">Include Navbar Brand</label>
                    </div>
                </div>

                <!-- Preview Column -->
                <div class="col-md-9">
                    <h4 class="h6">Preview</h4>

                    <div class="p-2 border rounded bg-light overflow-y-scroll" style="height: 200px;">
                        <!-- Example Content to test Sticky Bottom Start-->
                        <div style="min-height: 400px; border: 2px solid red" class:d-none={placement !== 'sticky-bottom'}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
                            dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen
                            book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                            unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more
                            recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </div>
                        <!-- Example Content End -->

                        <Navbar.Root {expandOnBreakpoint} {placement} {colorVariant}>
                            {#if useContainer}
                                <Container isFluid={isContainerFluid}>
                                    {#if hasBrand}
                                        <Navbar.Brand href="#!">Navbar</Navbar.Brand>
                                    {/if}
                                    <Navbar.Toggler ariaLabel="Toggle navigation">
                                        <Navbar.TogglerIcon />
                                    </Navbar.Toggler>
                                    <Navbar.Collapse id="navbarPlaygroundContent">
                                        <Navbar.Nav class="me-auto mb-2 mb-lg-0">
                                            <Nav.Item>
                                                <Nav.Link isActive={true} href="#!">Home</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link href="#!">Features</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link href="#!">Pricing</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
                                            </Nav.Item>
                                        </Navbar.Nav>

                                        {#if hasText}
                                            <Navbar.Text class="me-2">Signed in as: User</Navbar.Text>
                                        {/if}

                                        {#if hasForm}
                                            <form class="d-flex" role="search">
                                                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                                <button class={`btn ${searchButtonClass}`} type="submit">Search</button>
                                            </form>
                                        {/if}
                                    </Navbar.Collapse>
                                </Container>
                            {:else}
                                {#if hasBrand}
                                    <Navbar.Brand href="#!">Navbar</Navbar.Brand>
                                {/if}
                                <Navbar.Toggler ariaLabel="Toggle navigation">
                                    <Navbar.TogglerIcon />
                                </Navbar.Toggler>
                                <Navbar.Collapse id="navbarPlaygroundContent">
                                    <Navbar.Nav class="me-auto mb-2 mb-lg-0">
                                        <Nav.Item>
                                            <Nav.Link isActive={true} href="#!">Home</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#!">Features</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#!">Pricing</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
                                        </Nav.Item>
                                    </Navbar.Nav>

                                    {#if hasText}
                                        <Navbar.Text class="me-2">Signed in as: User</Navbar.Text>
                                    {/if}

                                    {#if hasForm}
                                        <form class="d-flex" role="search">
                                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                            <button class="btn btn-outline-success" type="submit">Search</button>
                                        </form>
                                    {/if}
                                </Navbar.Collapse>
                            {/if}
                        </Navbar.Root>
                        <!-- Example Content to test Sticky Top Start-->
                        <div style="min-height: 400px; border: 2px solid red" class:d-none={placement !== 'sticky-top'}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
                            dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen
                            book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                            unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more
                            recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </div>
                        <!-- Example Content End -->
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

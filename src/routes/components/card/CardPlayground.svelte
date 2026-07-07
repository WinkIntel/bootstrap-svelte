<script lang="ts">
    import { Card, type BaseColorVariant, type HeadingLevels } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Configurable props for Card.Root
    let cardClass = $state('');
    let hasHeader = $state(true);
    let hasFooter = $state(true);
    let hasImage = $state(true);
    let imagePosition = $state<'top' | 'bottom' | ''>('top');
    let hasImageOverlay = $state(false);
    let cardWidth = $state(18); // rem
    let cardBgColor: BaseColorVariant | '' = $state('');

    // Configurable props for Card content
    let titleText = $state('Card Title');
    let subtitleText = $state('Card Subtitle');
    let bodyText = $state("Some quick example text to build on the card title and make up the bulk of the card's content.");
    let headerText = $state('Featured');
    let footerText = $state('Last updated 3 mins ago');
    let includeTitleSubtitle = $state(true);
    let includeBodyText = $state(true);
    let includeLinks = $state(true);
    let titleHeadingLevel = $state<HeadingLevels>(5);
    let subtitleHeadingLevel = $state<HeadingLevels>(6);

    // Available options for color variants
    const colorOptions = [
        { value: '', label: 'Default' },
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'success', label: 'Success' },
        { value: 'danger', label: 'Danger' },
        { value: 'warning', label: 'Warning' },
        { value: 'info', label: 'Info' },
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' }
    ];

    // Available options for image positions
    const imagePositionOptions = [
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
        { value: '', label: 'Default (no position)' }
    ];

    // Available options for heading levels
    const headingLevelOptions = [
        { value: 1, label: 'H1' },
        { value: 2, label: 'H2' },
        { value: 3, label: 'H3' },
        { value: 4, label: 'H4' },
        { value: 5, label: 'H5' },
        { value: 6, label: 'H6' }
    ];

    // Generate code snippet based on current props
    function getCodeSnippet(): string {
        let bgColorClass = cardBgColor ? ` text-bg-${cardBgColor}` : '';
        let customClass = cardClass ? ` ${cardClass}` : '';

        let code = `<Card.Root class="w-${cardWidth}rem${bgColorClass}${customClass}">`;

        // Add image if enabled and position is top
        if (hasImage && imagePosition === 'top') {
            code += `\n  <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />`;
        }

        // Add header if enabled
        if (hasHeader) {
            code += `\n  <Card.Header>${headerText}</Card.Header>`;
        }

        if (hasImageOverlay) {
            code += `\n  <Card.Img src="https://placehold.co/300x180/000000/FFFFFF" alt="Card with overlay" />`;
            code += `\n  <Card.ImgOverlay>`;

            if (includeTitleSubtitle) {
                code += `\n    <Card.Title level={${titleHeadingLevel}}>${titleText}</Card.Title>`;
                code += `\n    <Card.Subtitle level={${subtitleHeadingLevel}}>${subtitleText}</Card.Subtitle>`;
            }

            if (includeBodyText) {
                code += `\n    <Card.Text>${bodyText}</Card.Text>`;
            }

            if (includeLinks) {
                code += `\n    <Card.Link href="#card-demo-link">Card Link</Card.Link>`;
                code += `\n    <Card.Link href="#card-demo-link">Another Link</Card.Link>`;
            }

            code += `\n  </Card.ImgOverlay>`;
        } else {
            code += `\n  <Card.Body>`;

            if (includeTitleSubtitle) {
                code += `\n    <Card.Title level={${titleHeadingLevel}}>${titleText}</Card.Title>`;
                code += `\n    <Card.Subtitle level={${subtitleHeadingLevel}}>${subtitleText}</Card.Subtitle>`;
            }

            if (includeBodyText) {
                code += `\n    <Card.Text>${bodyText}</Card.Text>`;
            }

            if (includeLinks) {
                code += `\n    <Card.Link href="#card-demo-link">Card Link</Card.Link>`;
                code += `\n    <Card.Link href="#card-demo-link">Another Link</Card.Link>`;
            }

            code += `\n  </Card.Body>`;
        }

        // Add image if enabled and position is bottom
        if (hasImage && imagePosition === 'bottom') {
            code += `\n  <Card.Img position="bottom" src="https://placehold.co/300x180" alt="Card image cap" />`;
        }

        // Add footer if enabled
        if (hasFooter) {
            code += `\n  <Card.Footer>${footerText}</Card.Footer>`;
        }

        code += `\n</Card.Root>`;

        return code;
    }

    // Track reactivity
    // Initialize codeSnippet
    let codeSnippet: string = $derived(getCodeSnippet());
</script>

<div class="playground">
    <div class="card mb-4">
        <div class="card-header">
            <h3 class="h5 mb-0">Card Interactive Playground</h3>
        </div>
        <div class="card-body">
            <div class="row">
                <!-- Controls Column -->
                <div class="col-md-6">
                    <h4 class="h6">Controls</h4>

                    <div class="mb-3">
                        <label for="cardWidth" class="form-label">Card Width (rem)</label>
                        <input type="range" class="form-range" id="cardWidth" min="10" max="36" bind:value={cardWidth} />
                        <div class="form-text text-center">{cardWidth}rem</div>
                    </div>

                    <div class="mb-4">
                        <h5 class="h6">Card Structure</h5>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="headerCheck" bind:checked={hasHeader} />
                            <label class="form-check-label" for="headerCheck">Include Header</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="footerCheck" bind:checked={hasFooter} />
                            <label class="form-check-label" for="footerCheck">Include Footer</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="imageCheck" bind:checked={hasImage} />
                            <label class="form-check-label" for="imageCheck">Include Image</label>
                        </div>

                        {#if hasImage}
                            <div class="mb-3 ms-4">
                                <label for="imagePosition" class="form-label">Image Position</label>
                                <select id="imagePosition" class="form-select" bind:value={imagePosition}>
                                    {#each imagePositionOptions as imagePositionOption, imagePositionOptionIndex (`imagePositionOption-${imagePositionOptionIndex}`)}
                                        <option value={imagePositionOption.value}>{imagePositionOption.label}</option>
                                    {/each}
                                </select>
                            </div>
                        {/if}

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="overlayCheck" bind:checked={hasImageOverlay} />
                            <label class="form-check-label" for="overlayCheck">Use Image Overlay</label>
                        </div>

                        <div class="mb-3">
                            <label for="cardBgColor" class="form-label">Background Color</label>
                            <select id="cardBgColor" class="form-select" bind:value={cardBgColor}>
                                {#each colorOptions as colorOption, colorOptionIndex (`colorOption-${colorOptionIndex}`)}
                                    <option value={colorOption.value}>{colorOption.label}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="cardClass" class="form-label">Additional CSS Classes</label>
                            <input type="text" class="form-control" id="cardClass" placeholder="border-0 shadow" bind:value={cardClass} />
                        </div>
                    </div>

                    <div class="mb-4">
                        <h5 class="h6">Card Content</h5>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="titleCheck" bind:checked={includeTitleSubtitle} />
                            <label class="form-check-label" for="titleCheck">Include Title & Subtitle</label>
                        </div>

                        {#if includeTitleSubtitle}
                            <div class="mb-3 ms-4">
                                <label for="titleText" class="form-label">Title Text</label>
                                <input type="text" class="form-control" id="titleText" bind:value={titleText} />
                            </div>
                            <div class="mb-3 ms-4">
                                <label for="titleLevel" class="form-label">Title Heading Level</label>
                                <select id="titleLevel" class="form-select" bind:value={titleHeadingLevel}>
                                    {#each headingLevelOptions as headingLevelOption, headingLevelOptionIndex (`headingLevelOption-${headingLevelOptionIndex}`)}
                                        <option value={headingLevelOption.value}>{headingLevelOption.label}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="mb-3 ms-4">
                                <label for="subtitleText" class="form-label">Subtitle Text</label>
                                <input type="text" class="form-control" id="subtitleText" bind:value={subtitleText} />
                            </div>
                            <div class="mb-3 ms-4">
                                <label for="subtitleLevel" class="form-label">Subtitle Heading Level</label>
                                <select id="subtitleLevel" class="form-select" bind:value={subtitleHeadingLevel}>
                                    {#each headingLevelOptions as headingLevelOption2, headingLevelOption2Index (`headingLevelOption2-${headingLevelOption2Index}`)}
                                        <option value={headingLevelOption2.value}>{headingLevelOption2.label}</option>
                                    {/each}
                                </select>
                            </div>
                        {/if}

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="bodyTextCheck" bind:checked={includeBodyText} />
                            <label class="form-check-label" for="bodyTextCheck">Include Body Text</label>
                        </div>

                        {#if includeBodyText}
                            <div class="mb-3">
                                <label for="bodyText" class="form-label">Body Text</label>
                                <textarea class="form-control" id="bodyText" rows="2" bind:value={bodyText}></textarea>
                            </div>
                        {/if}

                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" id="linksCheck" bind:checked={includeLinks} />
                            <label class="form-check-label" for="linksCheck">Include Links</label>
                        </div>

                        {#if hasHeader}
                            <div class="mb-3">
                                <label for="headerText" class="form-label">Header Text</label>
                                <input type="text" class="form-control" id="headerText" bind:value={headerText} />
                            </div>
                        {/if}

                        {#if hasFooter}
                            <div class="mb-3">
                                <label for="footerText" class="form-label">Footer Text</label>
                                <input type="text" class="form-control" id="footerText" bind:value={footerText} />
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Preview Column -->
                <div class="col-md-6">
                    <h4 class="h6">Preview</h4>
                    <div class="p-4 border rounded bg-light">
                        <Card.Root class="w-{cardWidth}rem{cardBgColor ? ` text-bg-${cardBgColor}` : ''} {cardClass}">
                            {#if hasImage && imagePosition === 'top'}
                                <Card.Img position="top" src="https://placehold.co/300x180" alt="Card image cap" />
                            {/if}

                            {#if hasHeader}
                                <Card.Header>{headerText}</Card.Header>
                            {/if}

                            {#if hasImageOverlay}
                                <Card.Img src="https://placehold.co/300x180/000000/FFFFFF" alt="Card with overlay" />
                                <Card.ImgOverlay>
                                    {#if includeTitleSubtitle}
                                        <Card.Title level={titleHeadingLevel}>{titleText}</Card.Title>
                                        <Card.Subtitle level={subtitleHeadingLevel}>{subtitleText}</Card.Subtitle>
                                    {/if}
                                    <Card.Text>{bodyText}</Card.Text>
                                    {#if includeLinks}
                                        <Card.Link href="#card-demo-link">Card Link</Card.Link>
                                        <Card.Link href="#card-demo-link">Another Link</Card.Link>
                                    {/if}
                                </Card.ImgOverlay>
                            {:else}
                                <Card.Body>
                                    {#if includeTitleSubtitle}
                                        <Card.Title level={titleHeadingLevel}>{titleText}</Card.Title>
                                        <Card.Subtitle level={subtitleHeadingLevel} class="mb-2 text-body-secondary">{subtitleText}</Card.Subtitle>
                                    {/if}
                                    <Card.Text>{bodyText}</Card.Text>
                                    {#if includeLinks}
                                        <Card.Link href="#card-demo-link">Card Link</Card.Link>
                                        <Card.Link href="#card-demo-link">Another Link</Card.Link>
                                    {/if}
                                </Card.Body>
                            {/if}

                            {#if hasImage && imagePosition === 'bottom'}
                                <Card.Img position="bottom" src="https://placehold.co/300x180" alt="Card image cap" />
                            {/if}

                            {#if hasFooter}
                                <Card.Footer>{footerText}</Card.Footer>
                            {/if}
                        </Card.Root>
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

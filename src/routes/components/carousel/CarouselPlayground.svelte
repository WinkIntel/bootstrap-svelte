<script lang="ts">
    import { CarouselRootState } from '$lib/Carousel/carousel.svelte.js';
    import type { CarouselAnimation, CarouselPause, CarouselRide } from '$lib/Carousel/types.js';
    import { Carousel } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    // Interactive state with Svelte 5 syntax
    let animation: CarouselAnimation = $state(CarouselRootState.ANIMATION_DEFAULT);
    let interval: number = $state(CarouselRootState.INTERNAL_DEFAULT);
    let ride: CarouselRide = $state(CarouselRootState.RIDE_DEFAULT);
    let pause: CarouselPause = $state(CarouselRootState.PAUSE_DEFAULT);
    let transitionDuration: number = $state(CarouselRootState.TRANSITION_DURATION_DEFAULT);
    let showControls: boolean = $state(true);
    let showIndicators: boolean = $state(true);
    let showCaptions: boolean = $state(false);
    let trackEvents: boolean = $state(false);
    let eventLog: string[] = $state([]);

    // Event logging functions
    function logEvent(event: string) {
        if (trackEvents) {
            const timestamp = new Date().toLocaleTimeString();
            eventLog = [...eventLog, `${timestamp}: ${event}`];

            // Keep log at a reasonable size
            if (eventLog.length > 10) {
                eventLog = eventLog.slice(-10);
            }
        }
    }

    // Generate code based on current settings
    let generatedCode = $derived(`<Carousel.Root
    animation="${animation}"
    interval={${interval}}
    ride={${ride === 'carousel' ? `"carousel"` : ride}}
    pause={${pause === 'hover' ? `"hover"` : false}}
    transitionDuration={${transitionDuration}}>
    ${
        showIndicators
            ? `<Carousel.Indicators>
        <Carousel.IndicatorButton ariaLabel="Slide 1" />
        <Carousel.IndicatorButton ariaLabel="Slide 2" />
        <Carousel.IndicatorButton ariaLabel="Slide 3" />
    </Carousel.Indicators>`
            : ''
    }
    <Carousel.Inner>
        <Carousel.Item isActive={true}${trackEvents ? ` onSlide={() => console.log('Slide 1 changing')} onSlid={() => console.log('Slide 1 changed')}` : ''}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1">${
                showCaptions
                    ? `
            <Carousel.Caption>
                <h5>First slide label</h5>
                <p>Some representative placeholder content for the first slide.</p>
            </Carousel.Caption>`
                    : ''
            }
        </Carousel.Item>
        <Carousel.Item${trackEvents ? ` onSlide={() => console.log('Slide 2 changing')} onSlid={() => console.log('Slide 2 changed')}` : ''}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2">${
                showCaptions
                    ? `
            <Carousel.Caption>
                <h5>Second slide label</h5>
                <p>Some representative placeholder content for the second slide.</p>
            </Carousel.Caption>`
                    : ''
            }
        </Carousel.Item>
        <Carousel.Item${trackEvents ? ` onSlide={() => console.log('Slide 3 changing')} onSlid={() => console.log('Slide 3 changed')}` : ''}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3">${
                showCaptions
                    ? `
            <Carousel.Caption>
                <h5>Third slide label</h5>
                <p>Some representative placeholder content for the third slide.</p>
            </Carousel.Caption>`
                    : ''
            }
        </Carousel.Item>
    </Carousel.Inner>
    ${
        showControls
            ? `<Carousel.ControlPrev />
    <Carousel.ControlNext />`
            : ''
    }
</Carousel.Root>`);

    // Function to clear the event log
    function clearEventLog() {
        eventLog = [];
    }
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

                    <div class="border rounded bg-light" style="overflow: hidden;">
                        <Carousel.Root id="carousel-playground" {animation} {interval} {ride} {pause} {transitionDuration}>
                            {#if showIndicators}
                                <Carousel.Indicators>
                                    <Carousel.IndicatorButton ariaLabel="Slide 1" />
                                    <Carousel.IndicatorButton ariaLabel="Slide 2" />
                                    <Carousel.IndicatorButton ariaLabel="Slide 3" />
                                </Carousel.Indicators>
                            {/if}
                            <Carousel.Inner>
                                <Carousel.Item
                                    isActive={true}
                                    onSlide={() => logEvent('Slide 1 is going to slide')}
                                    onSlid={() => logEvent('Slide 1 has slid')}>
                                    <img
                                        src="https://placehold.co/800x400/777/555?text=Slide+1"
                                        class="d-block w-100"
                                        alt="Slide 1"
                                        fetchpriority="high" />
                                    {#if showCaptions}
                                        <Carousel.Caption>
                                            <h5>First slide label</h5>
                                            <p>Some representative placeholder content for the first slide.</p>
                                        </Carousel.Caption>
                                    {/if}
                                </Carousel.Item>
                                <Carousel.Item onSlide={() => logEvent('Slide 2 is going to slide')} onSlid={() => logEvent('Slide 2 has slid')}>
                                    <img
                                        src="https://placehold.co/800x400/777/555?text=Slide+2"
                                        class="d-block w-100"
                                        alt="Slide 2"
                                        fetchpriority="high" />
                                    {#if showCaptions}
                                        <Carousel.Caption>
                                            <h5>Second slide label</h5>
                                            <p>Some representative placeholder content for the second slide.</p>
                                        </Carousel.Caption>
                                    {/if}
                                </Carousel.Item>
                                <Carousel.Item onSlide={() => logEvent('Slide 3 is going to slide')} onSlid={() => logEvent('Slide 3 has slid')}>
                                    <img
                                        src="https://placehold.co/800x400/777/555?text=Slide+3"
                                        class="d-block w-100"
                                        alt="Slide 3"
                                        fetchpriority="high" />
                                    {#if showCaptions}
                                        <Carousel.Caption>
                                            <h5>Third slide label</h5>
                                            <p>Some representative placeholder content for the third slide.</p>
                                        </Carousel.Caption>
                                    {/if}
                                </Carousel.Item>
                            </Carousel.Inner>
                            {#if showControls}
                                <Carousel.ControlPrev />
                                <Carousel.ControlNext />
                            {/if}
                        </Carousel.Root>
                    </div>
                </div>
            </div>
            <div class="row">
                <!-- Controls Column -->
                <div class="col-md-4">
                    <div class="mt-3">
                        <h4 class="h6">Controls</h4>
                    </div>

                    <div class="mb-3">
                        <label for="carousel-animation" class="form-label">Animation</label>
                        <select
                            id="carousel-animation"
                            class="form-select"
                            value={animation}
                            onchange={(e: Event) => (animation = (e.target as HTMLSelectElement).value as CarouselAnimation)}>
                            <option value="slide">Slide</option>
                            <option value="fade">Fade</option>
                            <option value="crossfade">Crossfade</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="carousel-interval" class="form-label">Interval (ms)</label>
                        <input
                            type="number"
                            id="carousel-interval"
                            class="form-control"
                            value={interval}
                            onchange={(e: Event) => (interval = parseInt((e.target as HTMLInputElement).value))} />
                    </div>

                    <div class="mb-3">
                        <label for="carousel-ride" class="form-label">Ride Mode</label>
                        <select
                            id="carousel-ride"
                            class="form-select"
                            onchange={(e: Event) => {
                                const val = (e.target as HTMLSelectElement).value;
                                ride = val === 'true' ? true : val === 'false' ? false : 'carousel';
                            }}>
                            <option value="true" selected={ride === true}>true</option>
                            <option value="carousel" selected={ride === 'carousel'}>carousel</option>
                            <option value="false" selected={ride === false}>false</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="carousel-pause" class="form-label">Pause on Hover</label>
                        <select
                            id="carousel-pause"
                            class="form-select"
                            onchange={(e: Event) => {
                                const val = (e.target as HTMLSelectElement).value;
                                pause = val === 'hover' ? 'hover' : false;
                            }}>
                            <option value="hover" selected={pause === 'hover'}>hover</option>
                            <option value="false" selected={pause === false}>false</option>
                        </select>
                        <div class="form-text">Controls whether carousel pauses when mouse hovers over it.</div>
                    </div>

                    <div class="mb-3">
                        <label for="carousel-transition" class="form-label">Transition Duration (ms)</label>
                        <input
                            type="number"
                            id="carousel-transition"
                            class="form-control"
                            value={transitionDuration}
                            onchange={(e: Event) => (transitionDuration = parseInt((e.target as HTMLInputElement).value))} />
                    </div>

                    <div class="form-check mb-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="carousel-controls-switch"
                            checked={showControls}
                            onchange={() => (showControls = !showControls)} />
                        <label class="form-check-label" for="carousel-controls-switch">Show Controls</label>
                    </div>

                    <div class="form-check mb-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="carousel-indicators-switch"
                            checked={showIndicators}
                            onchange={() => (showIndicators = !showIndicators)} />
                        <label class="form-check-label" for="carousel-indicators-switch">Show Indicators</label>
                    </div>

                    <div class="form-check mb-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="carousel-captions-switch"
                            checked={showCaptions}
                            onchange={() => (showCaptions = !showCaptions)} />
                        <label class="form-check-label" for="carousel-captions-switch">Show Captions</label>
                    </div>

                    <div class="form-check mb-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="carousel-events-switch"
                            checked={trackEvents}
                            onchange={() => (trackEvents = !trackEvents)} />
                        <label class="form-check-label" for="carousel-events-switch">Track Events</label>
                    </div>

                    {#if trackEvents}
                        <div class="p-3 border rounded mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <h4 class="h6 mb-0">Event Log</h4>
                                <button class="btn btn-sm btn-outline-danger" onclick={clearEventLog}>Clear</button>
                            </div>
                            <div class="mt-2" style="max-height: 150px; overflow-y: auto;">
                                <ul class="list-group">
                                    {#each eventLog as event, eventIndex (`event-${eventIndex}`)}
                                        <li class="list-group-item py-1">{event}</li>
                                    {:else}
                                        <li class="list-group-item py-1">No events logged</li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Preview Column -->
                <div class="col-md-8">
                    <div class="mt-3">
                        <h4 class="h6">Code</h4>
                        <SyntaxHighlighter code={generatedCode} />
                    </div>

                    <div class="mt-4">
                        <h4 class="h6">Usage Notes</h4>
                        <ul class="small">
                            <li>Use the <code>animation</code> prop to control transition type</li>
                            <li>The <code>interval</code> prop controls autoplay timing in milliseconds</li>
                            <li>Set <code>ride="carousel"</code> to start cycling on page load</li>
                            <li>Set <code>pause="hover"</code> to pause cycling when the mouse hovers over the carousel</li>
                            <li>Control navigation elements with <code>Carousel.ControlPrev</code> and <code>Carousel.ControlNext</code></li>
                            <li>Add slide indicators with <code>Carousel.Indicators</code> and <code>Carousel.IndicatorButton</code></li>
                            <li>Use <code>Carousel.Caption</code> for overlay text on slides</li>
                            <li>Event handlers can be used to track carousel state changes</li>
                            <li>The carousel automatically pauses when the browser tab is inactive (Page Visibility API)</li>
                        </ul>
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

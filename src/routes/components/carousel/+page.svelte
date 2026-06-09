<script lang="ts">
    import { Carousel } from '$lib/index.js';
    import { onMount } from 'svelte';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import CarouselPlayground from './CarouselPlayground.svelte';

    let carouselItemDelay = $state(10000);
    let countdownSeconds = $state(10);
    let countdownInterval = $state<number | null>(null);

    // Clear countdown timer
    function clearCountdown() {
        if (countdownInterval !== null) {
            window.clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    // Clean up interval when component is destroyed
    onMount(() => {
        return () => clearCountdown();
    });

    // Start countdown timer
    function startCountdown() {
        // Clear any existing interval
        clearCountdown();

        // Set initial countdown value
        countdownSeconds = Math.ceil(carouselItemDelay / 1000);

        // Start new countdown
        countdownInterval = window.setInterval(() => {
            countdownSeconds--;
            if (countdownSeconds <= 0) {
                clearCountdown();
            }
        }, 1000);
    }

    // Sample code examples for demonstration
    const basicExampleCode = `<Carousel.Root animation="none">
    <Carousel.Inner>
        <Carousel.Item isActive={true}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>`;

    const withControlsCode = `<Carousel.Root animation="slide">
    <Carousel.Inner>
        <Carousel.Item isActive={true}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>`;

    const withIndicatorsCode = `<Carousel.Root animation="slide">
    <Carousel.Indicators>
        <Carousel.IndicatorButton ariaLabel="Slide 1" />
        <Carousel.IndicatorButton ariaLabel="Slide 2" />
        <Carousel.IndicatorButton ariaLabel="Slide 3" />
    </Carousel.Indicators>
    <Carousel.Inner>
        <Carousel.Item isActive={true}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>`;

    const withCaptionsCode = `<Carousel.Root animation="slide">
    <Carousel.Indicators>
        <Carousel.IndicatorButton ariaLabel="Slide 1" />
        <Carousel.IndicatorButton ariaLabel="Slide 2" />
        <Carousel.IndicatorButton ariaLabel="Slide 3" />
    </Carousel.Indicators>
    <Carousel.Inner>
        <Carousel.Item isActive={true}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
            <Carousel.Caption>
                <h5>First slide label</h5>
                <p>Some representative placeholder content for the first slide.</p>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
            <Carousel.Caption>
                <h5>Second slide label</h5>
                <p>Some representative placeholder content for the second slide.</p>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
            <Carousel.Caption>
                <h5>Third slide label</h5>
                <p>Some representative placeholder content for the third slide.</p>
            </Carousel.Caption>
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>`;

    const fadeTransitionCode = `<Carousel.Root animation="fade">
    <Carousel.Inner>
        <Carousel.Item isActive={true}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>`;

    const crossfadeTransitionCode = `<Carousel.Root animation="crossfade">
    <Carousel.Inner>
        <Carousel.Item isActive={true}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>`;

    const autoPlayCode = `<Carousel.Root ride="carousel" animation="slide" transitionDuration={1000}>
    <Carousel.Inner>
        <Carousel.Item isActive={true}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>`;

    const autoPlayAfterInteractionCode = `<Carousel.Root ride={true} animation="slide" transitionDuration={1000}>
    <Carousel.Inner>
        <Carousel.Item isActive={true}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>`;

    const intervalCode = `<Carousel.Root animation="slide" ride="carousel">
    <Carousel.Inner>
        <Carousel.Item
            isActive={true}
            interval={10000}
            onSlide={() => { carouselItemDelay = 10000; startCountdown(); }}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
            <Carousel.Caption>
                <h5>First slide label</h5>
                <p>This slide stays for 10 seconds.</p>
                <span>(Cycling in {countdownSeconds}s)</span>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item
            interval={2000}
            onSlide={() => { carouselItemDelay = 2000; startCountdown(); }}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
            <Carousel.Caption>
                <h5>Second slide label</h5>
                <p>This slide stays for 2 seconds.</p>
                <span>(Cycling in {countdownSeconds}s)</span>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item onSlide={() => { carouselItemDelay = 5000; startCountdown(); }}>
            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
            <Carousel.Caption>
                <h5>Third slide label</h5>
                <p>This slide uses the default interval of 5 seconds.</p>
                <span>(Cycling in {countdownSeconds}s)</span>
            </Carousel.Caption>
        </Carousel.Item>
    </Carousel.Inner>
    <Carousel.ControlPrev />
    <Carousel.ControlNext />
</Carousel.Root>`;

    const darkVariantCode = `<div data-bs-theme="dark">
    <Carousel.Root animation="slide">
        <Carousel.Indicators>
            <Carousel.IndicatorButton ariaLabel="Slide 1" />
            <Carousel.IndicatorButton ariaLabel="Slide 2" />
            <Carousel.IndicatorButton ariaLabel="Slide 3" />
        </Carousel.Indicators>
        <Carousel.Inner>
            <Carousel.Item isActive={true}>
                <img src="https://placehold.co/800x400/f5f5f5/aaa?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                <Carousel.Caption>
                    <h5>First slide label</h5>
                    <p>Some representative placeholder content for the first slide.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img src="https://placehold.co/800x400/f5f5f5/aaa?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                <Carousel.Caption>
                    <h5>Second slide label</h5>
                    <p>Some representative placeholder content for the second slide.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img src="https://placehold.co/800x400/f5f5f5/aaa?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                <Carousel.Caption>
                    <h5>Third slide label</h5>
                    <p>Some representative placeholder content for the third slide.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel.Inner>
        <Carousel.ControlPrev />
        <Carousel.ControlNext />
    </Carousel.Root>
</div>`;
</script>

<div>
    <h1 class="mb-4">Carousel</h1>

    <p class="lead">A slideshow component for cycling through elements—images or slides of text—like a carousel.</p>

    <CarouselPlayground />

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Basic Example</h2>
            <p>Here's a basic carousel with slides only.</p>

            <div class="wk-carousel-example p-4 border rounded">
                <Carousel.Root animation="none">
                    <Carousel.Inner>
                        <Carousel.Item isActive={true}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                        </Carousel.Item>
                    </Carousel.Inner>
                    <Carousel.ControlPrev />
                    <Carousel.ControlNext />
                </Carousel.Root>
            </div>

            <SyntaxHighlighter code={basicExampleCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">With Controls</h2>
            <p>Adding previous and next controls with Carousel.ControlPrev and Carousel.ControlNext components.</p>

            <div class="wk-carousel-example p-4 border rounded">
                <Carousel.Root animation="slide">
                    <Carousel.Inner>
                        <Carousel.Item isActive={true}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                        </Carousel.Item>
                    </Carousel.Inner>
                    <Carousel.ControlPrev />
                    <Carousel.ControlNext />
                </Carousel.Root>
            </div>

            <SyntaxHighlighter code={withControlsCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">With Indicators</h2>
            <p>You can also add the indicators to the carousel with Carousel.Indicators and Carousel.IndicatorButton components.</p>

            <div class="wk-carousel-example p-4 border rounded">
                <Carousel.Root animation="slide">
                    <Carousel.Indicators>
                        <Carousel.IndicatorButton ariaLabel="Slide 1" />
                        <Carousel.IndicatorButton ariaLabel="Slide 2" />
                        <Carousel.IndicatorButton ariaLabel="Slide 3" />
                    </Carousel.Indicators>
                    <Carousel.Inner>
                        <Carousel.Item isActive={true}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                        </Carousel.Item>
                    </Carousel.Inner>
                    <Carousel.ControlPrev />
                    <Carousel.ControlNext />
                </Carousel.Root>
            </div>

            <SyntaxHighlighter code={withIndicatorsCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">With Captions</h2>
            <p>Add captions to your slides with the Carousel.Caption component.</p>

            <div class="wk-carousel-example p-4 border rounded">
                <Carousel.Root animation="slide">
                    <Carousel.Indicators>
                        <Carousel.IndicatorButton ariaLabel="Slide 1" />
                        <Carousel.IndicatorButton ariaLabel="Slide 2" />
                        <Carousel.IndicatorButton ariaLabel="Slide 3" />
                    </Carousel.Indicators>
                    <Carousel.Inner>
                        <Carousel.Item isActive={true}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                            <Carousel.Caption>
                                <h5>First slide label</h5>
                                <p>Some representative placeholder content for the first slide.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                            <Carousel.Caption>
                                <h5>Second slide label</h5>
                                <p>Some representative placeholder content for the second slide.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                            <Carousel.Caption>
                                <h5>Third slide label</h5>
                                <p>Some representative placeholder content for the third slide.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel.Inner>
                    <Carousel.ControlPrev />
                    <Carousel.ControlNext />
                </Carousel.Root>
            </div>

            <SyntaxHighlighter code={withCaptionsCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Fade</h2>
            <p>
                Add <code>animation="fade"</code> to your carousel to animate slides with a fade transition where the old slide will fade out before the
                new one fades in.
            </p>

            <div class="wk-carousel-example p-4 border rounded">
                <Carousel.Root animation="fade">
                    <Carousel.Inner>
                        <Carousel.Item isActive={true}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                        </Carousel.Item>
                    </Carousel.Inner>
                    <Carousel.ControlPrev />
                    <Carousel.ControlNext />
                </Carousel.Root>
            </div>

            <SyntaxHighlighter code={fadeTransitionCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Crossfade</h2>
            <p>Add <code>animation="crossfade"</code> to your carousel to animate slides with a fade transition instead of a slide.</p>

            <div class="wk-carousel-example p-4 border rounded">
                <Carousel.Root animation="crossfade">
                    <Carousel.Inner>
                        <Carousel.Item isActive={true}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                        </Carousel.Item>
                    </Carousel.Inner>
                    <Carousel.ControlPrev />
                    <Carousel.ControlNext />
                </Carousel.Root>
            </div>

            <SyntaxHighlighter code={crossfadeTransitionCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Auto-playing Carousel</h2>
            <p>
                To make the carousel auto-play, set <code>ride="carousel"</code> on the root component. This will start the carousel automatically when
                the page loads.
            </p>

            <div class="wk-carousel-example p-4 border rounded">
                <Carousel.Root ride="carousel" animation="slide" transitionDuration={1000}>
                    <Carousel.Inner>
                        <Carousel.Item isActive={true}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                        </Carousel.Item>
                    </Carousel.Inner>
                    <Carousel.ControlPrev />
                    <Carousel.ControlNext />
                </Carousel.Root>
            </div>

            <SyntaxHighlighter code={autoPlayCode} />
            <p>
                To make the carousel auto-play after the first interaction, set <code>ride="true"</code> on the root component. It will not start the cycling
                of the slide until the user interacts with the carousel.
            </p>

            <div class="wk-carousel-example p-4 border rounded">
                <Carousel.Root ride={true} animation="slide" transitionDuration={1000}>
                    <Carousel.Inner>
                        <Carousel.Item isActive={true}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                        </Carousel.Item>
                    </Carousel.Inner>
                    <Carousel.ControlPrev />
                    <Carousel.ControlNext />
                </Carousel.Root>
            </div>

            <SyntaxHighlighter code={autoPlayAfterInteractionCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Individual Interval</h2>
            <p>You can specify different intervals for each slide using the <code>interval</code> prop on Carousel.Item.</p>

            <div class="wk-carousel-example p-4 border rounded">
                <Carousel.Root animation="slide" ride="carousel">
                    <Carousel.Inner>
                        <Carousel.Item
                            isActive={true}
                            interval={10000}
                            onSlide={() => {
                                carouselItemDelay = 10000;
                                startCountdown();
                            }}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                            <Carousel.Caption>
                                <h5>First slide label</h5>
                                <p>This slide stays for 10 seconds.</p>
                                <span>(Cycling in {countdownSeconds}s)</span>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item
                            interval={2000}
                            onSlide={() => {
                                carouselItemDelay = 2000;
                                startCountdown();
                            }}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                            <Carousel.Caption>
                                <h5>Second slide label</h5>
                                <p>This slide stays for 2 seconds.</p>
                                <span>(Cycling in {countdownSeconds}s)</span>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item
                            onSlide={() => {
                                carouselItemDelay = 5000;
                                startCountdown();
                            }}>
                            <img src="https://placehold.co/800x400/777/555?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                            <Carousel.Caption>
                                <h5>Third slide label</h5>
                                <p>This slide uses the default interval of 5 seconds.</p>
                                <span>(Cycling in {countdownSeconds}s)</span>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel.Inner>
                    <Carousel.ControlPrev />
                    <Carousel.ControlNext />
                </Carousel.Root>
            </div>

            <SyntaxHighlighter code={intervalCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="wk-quick-link">Dark Variant</h2>
            <p>
                Instead of adding <code>.carousel-dark</code>, set <code>data-bs-theme="dark"</code> on the root element, a parent wrapper, or the component
                itself.
            </p>

            <div class="wk-carousel-example p-4 border rounded" data-bs-theme="dark">
                <Carousel.Root animation="slide">
                    <Carousel.Indicators>
                        <Carousel.IndicatorButton ariaLabel="Slide 1" />
                        <Carousel.IndicatorButton ariaLabel="Slide 2" />
                        <Carousel.IndicatorButton ariaLabel="Slide 3" />
                    </Carousel.Indicators>
                    <Carousel.Inner>
                        <Carousel.Item isActive={true}>
                            <img src="https://placehold.co/800x400/f5f5f5/aaa?text=Slide+1" class="d-block w-100" alt="Slide 1" />
                            <Carousel.Caption>
                                <h5>First slide label</h5>
                                <p>Some representative placeholder content for the first slide.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/f5f5f5/aaa?text=Slide+2" class="d-block w-100" alt="Slide 2" />
                            <Carousel.Caption>
                                <h5>Second slide label</h5>
                                <p>Some representative placeholder content for the second slide.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src="https://placehold.co/800x400/f5f5f5/aaa?text=Slide+3" class="d-block w-100" alt="Slide 3" />
                            <Carousel.Caption>
                                <h5>Third slide label</h5>
                                <p>Some representative placeholder content for the third slide.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel.Inner>
                    <Carousel.ControlPrev />
                    <Carousel.ControlNext />
                </Carousel.Root>
            </div>

            <SyntaxHighlighter code={darkVariantCode} />
        </div>
    </div>

    <div class="row mb-5">
        <div class="col">
            <h2 class="h3" id="api">API Reference</h2>

            <h3 class="h5 mt-4">Carousel.Root Props</h3>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr>
                            <td><code>animation</code></td>
                            <td><code>'none' | 'slide' | 'fade' | 'crossfade'</code></td>
                            <td><code>'none'</code></td>
                            <td>Adds the 'slide' class for slide animations</td>
                        </tr>
                        <tr>
                            <td><code>class</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Additional CSS classes to apply to the component</td>
                        </tr>
                        <tr>
                            <td><code>elementRef</code></td>
                            <td><code>HTMLElement | null</code></td>
                            <td><code>null</code></td>
                            <td>Reference to the DOM element</td>
                        </tr>
                        <tr>
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td>Auto-generated</td>
                            <td>ID for the carousel element</td>
                        </tr>
                        <tr>
                            <td><code>interval</code></td>
                            <td><code>number</code></td>
                            <td><code>5000</code></td>
                            <td>Time in milliseconds to show each slide before advancing</td>
                        </tr>
                        <tr>
                            <td><code>pause</code></td>
                            <td><code>false | 'hover'</code></td>
                            <td><code>'hover'</code></td>
                            <td>Sets whether to pause the carousel on hover or not</td>
                        </tr>
                        <tr>
                            <td><code>ride</code></td>
                            <td><code>boolean | 'carousel'</code></td>
                            <td><code>false</code></td>
                            <td>Sets autoplay behavior. 'carousel' auto-plays on page load, 'true' auto-plays after user interaction</td>
                        </tr>
                        <tr>
                            <td><code>style</code></td>
                            <td><code>string</code></td>
                            <td><code>undefined</code></td>
                            <td>Additional inline styles to apply to the component</td>
                        </tr>
                        <tr>
                            <td><code>transitionDuration</code></td>
                            <td><code>number</code></td>
                            <td><code>600</code></td>
                            <td>Duration of the transition effect in milliseconds</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Carousel.Item Props</h3>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr>
                            <td><code>class</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Additional CSS classes to apply to the component</td>
                        </tr>
                        <tr>
                            <td><code>elementRef</code></td>
                            <td><code>HTMLElement | null</code></td>
                            <td><code>null</code></td>
                            <td>Reference to the DOM element</td>
                        </tr>
                        <tr>
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td>Auto-generated</td>
                            <td>ID for the carousel element</td>
                        </tr>
                        <tr>
                            <td><code>isActive</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Makes this item the active slide</td>
                        </tr>
                        <tr>
                            <td><code>interval</code></td>
                            <td><code>number</code></td>
                            <td><code>5000</code></td>
                            <td>Time in milliseconds to show this slide before advancing</td>
                        </tr>
                        <tr>
                            <td><code>onSlide</code></td>
                            <td><code>EventListener</code></td>
                            <td>-</td>
                            <td>Callback function triggered when the item begins to slide</td>
                        </tr>
                        <tr>
                            <td><code>onSlid</code></td>
                            <td><code>EventListener</code></td>
                            <td>-</td>
                            <td>Callback function triggered after the item has slid</td>
                        </tr>
                        <tr>
                            <td><code>style</code></td>
                            <td><code>string</code></td>
                            <td><code>undefined</code></td>
                            <td>Additional inline styles to apply to the component</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Carousel.IndicatorButton Props</h3>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr>
                            <td><code>ariaLabel</code></td>
                            <td><code>string</code></td>
                            <td><code>'Slide #'</code></td>
                            <td>Screen reader text for accessibility</td>
                        </tr>
                        <tr>
                            <td><code>class</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Additional CSS classes to apply to the component</td>
                        </tr>
                        <tr>
                            <td><code>elementRef</code></td>
                            <td><code>HTMLElement | null</code></td>
                            <td><code>null</code></td>
                            <td>Reference to the DOM element</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">Carousel.ControlPrev/ControlNext Props</h3>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr>
                            <td><code>class</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Additional CSS classes to apply to the component</td>
                        </tr>
                        <tr>
                            <td><code>elementRef</code></td>
                            <td><code>HTMLElement | null</code></td>
                            <td><code>null</code></td>
                            <td>Reference to the DOM element</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="h5 mt-4">CSS Classes</h3>
            <p>The component applies Bootstrap's carousel classes based on the provided props and sub-components:</p>
            <ul>
                <li><code>carousel</code> - Applied to Carousel.Root</li>
                <li><code>slide</code> - Applied to Carousel.Root when isSlide is true</li>
                <li><code>carousel-fade</code> - Applied to Carousel.Root when isFade is true</li>
                <li><code>carousel-dark</code> - Applied to Carousel.Root when isDark is true</li>
                <li><code>carousel-inner</code> - Applied to Carousel.Inner</li>
                <li><code>carousel-item</code> - Applied to Carousel.Item</li>
                <li><code>active</code> - Applied to Carousel.Item when isActive is true</li>
                <li><code>carousel-caption</code> - Applied to Carousel.Caption</li>
                <li><code>carousel-indicators</code> - Applied to Carousel.Indicators</li>
                <li><code>carousel-control-prev</code> - Applied to Carousel.ControlPrev</li>
                <li><code>carousel-control-next</code> - Applied to Carousel.ControlNext</li>
            </ul>
        </div>
    </div>
</div>

<style>
    .wk-carousel-example {
        background-color: white;
    }
</style>

import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Carousel } from '../index.js';
import CarouselAutoplayTest from './carousel-autoplay-test.svelte';
import CarouselBasicTest from './carousel-basic-test.svelte';
import CarouselTimerTest from './carousel-timer-test.svelte';

describe('Carousel Component', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render basic carousel with inner, controls, and indicators', () => {
        render(CarouselBasicTest);

        // Check if carousel root component is rendered
        const carousel = screen.getByTestId('carousel');
        expect(carousel).toHaveClass('carousel');
        expect(carousel).toHaveAttribute('id', 'test-carousel');

        // Check if carousel inner is rendered
        const inner = screen.getByTestId('carousel-inner');
        expect(inner).toHaveClass('carousel-inner');

        // Check if carousel items are rendered
        const item1 = screen.getByTestId('carousel-item-1');
        expect(item1).toHaveClass('carousel-item');
        expect(item1).toHaveClass('active'); // First item should be active
        expect(() => screen.getByTestId('carousel-item-2')).toThrow(); // Subsequent items should not be in the DOM
        expect(() => screen.getByTestId('carousel-item-3')).toThrow(); // Subsequent items should not be in the DOM

        // Check content of the first item
        const item1Content = screen.getByTestId('carousel-item-1-content');
        expect(item1Content).toHaveTextContent('First slide');

        // Check if carousel caption is rendered
        const caption = screen.getByTestId('carousel-caption-1');
        expect(caption).toHaveClass('carousel-caption');
        const captionTitle = screen.getByTestId('carousel-caption-1-title');
        expect(captionTitle).toHaveTextContent('First slide label');
        const captionText = screen.getByTestId('carousel-caption-1-text');
        expect(captionText).toHaveTextContent('This is the caption for the first slide.');

        // Check if carousel controls are rendered
        const prevControl = screen.getByTestId('carousel-control-prev');
        expect(prevControl).toHaveClass('carousel-control-prev');
        const prevControlIcon = prevControl.querySelector('.carousel-control-prev-icon');
        expect(prevControlIcon).not.toBeNull();

        const nextControl = screen.getByTestId('carousel-control-next');
        expect(nextControl).toHaveClass('carousel-control-next');
        const nextControlIcon = nextControl.querySelector('.carousel-control-next-icon');
        expect(nextControlIcon).not.toBeNull();

        // Check if carousel indicators are rendered
        const indicators = screen.getByTestId('carousel-indicators');
        expect(indicators).toHaveClass('carousel-indicators');

        const indicator1 = screen.getByTestId('carousel-indicator-1');
        expect(indicator1).toHaveClass('active');
        expect(indicator1).toHaveAttribute('data-bs-target', 'true');

        const indicator2 = screen.getByTestId('carousel-indicator-2');
        expect(indicator2).not.toHaveClass('active');
        expect(indicator2).toHaveAttribute('data-bs-target', 'true');

        const indicator3 = screen.getByTestId('carousel-indicator-3');
        expect(indicator3).not.toHaveClass('active');
        expect(indicator3).toHaveAttribute('data-bs-target', 'true');
    });

    it('should render carousel with slide animation', () => {
        render(CarouselBasicTest);

        const slideCarousel = screen.getByTestId('slide-carousel');
        expect(slideCarousel).toHaveClass('carousel');
        expect(slideCarousel).toHaveClass('slide');
        expect(slideCarousel).not.toHaveClass('carousel-fade');
    });

    it('should render carousel with fade animation', () => {
        render(CarouselBasicTest);

        const fadeCarousel = screen.getByTestId('fade-carousel');
        expect(fadeCarousel).toHaveClass('carousel');
        expect(fadeCarousel).not.toHaveClass('slide');
        expect(fadeCarousel).toHaveClass('carousel-fade');
    });

    it('should render carousel with crossfade animation', () => {
        render(CarouselBasicTest);

        const crossfadeCarousel = screen.getByTestId('crossfade-carousel');
        expect(crossfadeCarousel).toHaveClass('carousel');
        expect(crossfadeCarousel).toHaveClass('slide');
        expect(crossfadeCarousel).toHaveClass('carousel-fade');
    });

    it('should render carousel with custom interval', () => {
        render(CarouselBasicTest);

        const intervalCarousel = screen.getByTestId('interval-carousel');
        expect(intervalCarousel).toHaveClass('carousel');

        // The interval property is not directly visible in the DOM, but we can check
        // that the carousel was rendered correctly
        const intervalCarouselItem = screen.getByTestId('interval-carousel-item-1');
        expect(intervalCarouselItem).toHaveClass('active');
    });

    it('should render carousel with custom transition duration', () => {
        render(CarouselBasicTest);

        const durationCarousel = screen.getByTestId('duration-carousel');
        expect(durationCarousel).toHaveClass('carousel');

        // The transitionDuration property is not directly visible in the DOM, but we can check
        // that the carousel was rendered correctly
        const durationCarouselItem = screen.getByTestId('duration-carousel-item-1');
        expect(durationCarouselItem).toHaveClass('active');
    });

    it('should render carousel with ride enabled', () => {
        render(CarouselBasicTest);

        const rideCarousel = screen.getByTestId('ride-carousel');
        expect(rideCarousel).toHaveClass('carousel');

        // The ride property is not directly visible in the DOM, but we can check
        // that the carousel was rendered correctly
        const rideCarouselItem = screen.getByTestId('ride-carousel-item-1');
        expect(rideCarouselItem).toHaveClass('active');
    });

    it('should render carousel autoplay without a reactive update loop', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        try {
            render(CarouselAutoplayTest);

            const autoplayCarousel = screen.getByTestId('autoplay-carousel');
            expect(autoplayCarousel).toHaveClass('carousel');

            const runtimeErrors = errorSpy.mock.calls.flat().map((message) => String(message));
            expect(runtimeErrors.some((message) => message.includes('effect_update_depth_exceeded'))).toBe(false);
            expect(runtimeErrors.some((message) => message.includes('infinite_loop_guard'))).toBe(false);
        } finally {
            errorSpy.mockRestore();
        }
    });

    // Test for component API existence

    it('should create a Root component with expected properties', () => {
        expect(Carousel.Root).toBeDefined();
    });

    it('should create an Inner component with expected properties', () => {
        expect(Carousel.Inner).toBeDefined();
    });

    it('should create an Item component with expected properties', () => {
        expect(Carousel.Item).toBeDefined();
    });

    it('should create a Caption component with expected properties', () => {
        expect(Carousel.Caption).toBeDefined();
    });

    it('should create a ControlPrev component with expected properties', () => {
        expect(Carousel.ControlPrev).toBeDefined();
    });

    it('should create a ControlNext component with expected properties', () => {
        expect(Carousel.ControlNext).toBeDefined();
    });

    it('should create an Indicators component with expected properties', () => {
        expect(Carousel.Indicators).toBeDefined();
    });

    it('should create an IndicatorButton component with expected properties', () => {
        expect(Carousel.IndicatorButton).toBeDefined();
    });
});

describe('Carousel Timer Cleanup On Dispose', () => {
    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it('should cancel pending transition/resume timers on unmount so they cannot re-arm autoplay', () => {
        vi.useFakeTimers();

        const { unmount } = render(CarouselTimerTest);

        // No timers should be pending before any interaction (this carousel does not
        // autoplay immediately since ride={true} without 'carousel' only starts cycling
        // after the first user interaction).
        const baselineTimerCount = vi.getTimerCount();

        const nextControl = screen.getByTestId('timer-carousel-control-next');
        fireEvent.click(nextControl);

        // Clicking next starts a slide transition (an untracked setTimeout pre-fix) and,
        // because ride={true} + user interaction, immediately arms the autoplay timer too.
        expect(vi.getTimerCount()).toBeGreaterThan(baselineTimerCount);

        // Unmount mid-transition, before the transition-commit timeout has fired.
        unmount();

        // Advancing time must not throw (no orphaned callback touching disposed state)
        // and must not leave any timer armed -- pre-fix, the orphaned transition-commit
        // callback mutated state and called cycle(), re-arming autoplay on a destroyed
        // instance forever.
        expect(() => vi.advanceTimersByTime(60_000)).not.toThrow();
        expect(vi.getTimerCount()).toBe(0);
    });
});

describe('Carousel navigation and autoplay', () => {
    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it('should activate the next item and deactivate the current one after clicking next', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselBasicTest);

        await fireEvent.click(screen.getByTestId('carousel-control-next'));

        // The default (animation="none") carousel commits activeItemIndex on a
        // microtask once its internal tick() resolves; advanceTimersByTimeAsync
        // flushes that microtask queue as it processes due timers.
        await vi.advanceTimersByTimeAsync(700);

        expect(screen.getByTestId('carousel-item-2')).toHaveClass('active');
        expect(screen.queryByTestId('carousel-item-1')).not.toBeInTheDocument();
    });

    it('should wrap to the last item when clicking prev from the first item', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselBasicTest);

        await fireEvent.click(screen.getByTestId('carousel-control-prev'));

        await vi.advanceTimersByTimeAsync(700);

        expect(screen.getByTestId('carousel-item-3')).toHaveClass('active');
        expect(screen.queryByTestId('carousel-item-1')).not.toBeInTheDocument();
    });

    it('should advance the active slide on its own once the autoplay interval elapses', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselAutoplayTest);

        expect(screen.getByTestId('autoplay-carousel-item-1')).toHaveClass('active');

        // Default interval is 5000ms; the 'none' animation commits on a microtask
        // once its setTimeout fires, which advanceTimersByTimeAsync flushes too.
        await vi.advanceTimersByTimeAsync(5100);

        expect(screen.getByTestId('autoplay-carousel-item-2')).toHaveClass('active');
        expect(screen.queryByTestId('autoplay-carousel-item-1')).not.toBeInTheDocument();
    });

    it('should ignore a second next click received while a transition is animating', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselBasicTest);

        const nextControl = screen.getByTestId('carousel-control-next');

        // Two synchronous clicks with no await in between: next() sets
        // isAnimating=true synchronously before its commit microtask ever runs,
        // so the second call must observe it still true and be a no-op.
        fireEvent.click(nextControl);
        fireEvent.click(nextControl);

        await vi.advanceTimersByTimeAsync(700);

        // Exactly one slide advanced: item 2 is active, item 3 was never touched.
        expect(screen.getByTestId('carousel-item-2')).toHaveClass('active');
        expect(screen.queryByTestId('carousel-item-3')).not.toBeInTheDocument();
        expect(screen.queryByTestId('carousel-item-1')).not.toBeInTheDocument();
    });
});

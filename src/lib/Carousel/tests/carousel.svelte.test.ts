import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CarouselAutoplayTest from './carousel-autoplay-test.svelte';
import CarouselAdversarialTest from './carousel-adversarial-test.svelte';
import CarouselAsyncAutoplayTest from './carousel-async-autoplay-test.svelte';
import CarouselBasicTest from './carousel-basic-test.svelte';
import CarouselIntervalTest from './carousel-interval-test.svelte';
import CarouselRegressionTest from './carousel-regression-test.svelte';
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

    it('starts ride=carousel autoplay when asynchronous item registration reaches two slides', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselAsyncAutoplayTest);

        await vi.advanceTimersByTimeAsync(10);
        expect(screen.getByTestId('async-autoplay-item-1')).toHaveClass('active');

        await vi.advanceTimersByTimeAsync(19);
        expect(screen.getByTestId('async-autoplay-item-1')).toHaveClass('active');

        await vi.advanceTimersByTimeAsync(1);
        expect(screen.getByTestId('async-autoplay-item-2')).toHaveClass('active');
        expect(screen.queryByTestId('async-autoplay-item-1')).not.toBeInTheDocument();
    });

    it('uses the root interval for consecutive cycles when items have no override', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselIntervalTest);

        await vi.advanceTimersByTimeAsync(20);
        expect(screen.getByTestId('root-interval-item-2')).toHaveClass('active');
        await vi.advanceTimersByTimeAsync(20);
        expect(screen.getByTestId('root-interval-item-3')).toHaveClass('active');
    });

    it('uses an active item interval on the first ride=carousel cycle', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselIntervalTest);

        await vi.advanceTimersByTimeAsync(20);
        expect(screen.getByTestId('item-interval-item-2')).toHaveClass('active');
    });

    it('starts ride=true autoplay after an indicator navigation', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselAdversarialTest);

        await fireEvent.click(screen.getByTestId('indicator-2'));
        await vi.advanceTimersByTimeAsync(0);
        expect(screen.getByTestId('indicator-item-2')).toHaveClass('active');
        await vi.advanceTimersByTimeAsync(20);
        expect(screen.getByTestId('indicator-item-3')).toHaveClass('active');
    });

    it('does not resume touch cycling after ride is disabled', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselAdversarialTest);
        const carousel = screen.getByTestId('touch-carousel');

        fireEvent.pointerDown(carousel, { clientX: 100, isPrimary: true, pointerType: 'touch' });
        fireEvent.pointerUp(carousel, { clientX: 100, isPrimary: true, pointerType: 'touch' });
        await fireEvent.click(screen.getByTestId('disable-touch-ride'));
        await vi.advanceTimersByTimeAsync(1000);

        expect(vi.getTimerCount()).toBe(0);
        expect(screen.getByTestId('touch-item-1')).toHaveClass('active');
    });

    it('composes root pointer and item hover callbacks with carousel handlers', () => {
        render(CarouselAdversarialTest);
        const carousel = screen.getByTestId('touch-carousel');
        const item = screen.getByTestId('touch-item-1');

        fireEvent.pointerDown(carousel, { clientX: 10, isPrimary: true, pointerType: 'touch' });
        fireEvent.pointerCancel(carousel, { clientX: 10, isPrimary: true, pointerType: 'touch' });
        fireEvent.mouseEnter(item);
        fireEvent.mouseLeave(item);
        expect(screen.getByTestId('callback-counts')).toHaveTextContent('2:2');
    });

    it('keeps fade transitions locked through their full duration', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselAdversarialTest);
        const next = screen.getByTestId('fade-boundary-next');

        fireEvent.click(next);
        await vi.advanceTimersByTimeAsync(501);
        fireEvent.click(next);
        await vi.advanceTimersByTimeAsync(499);

        expect(screen.getByTestId('fade-boundary-item-2')).toHaveClass('active');
        expect(screen.queryByTestId('fade-boundary-item-3')).not.toBeInTheDocument();
    });

    it('reconciles a removed middle item before navigating', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselAdversarialTest);
        await fireEvent.click(screen.getByTestId('remove-middle'));
        await fireEvent.click(screen.getByTestId('removal-next'));
        await vi.advanceTimersByTimeAsync(0);

        const inner = screen.getByTestId('removal-inner');
        expect(screen.getByTestId('removal-item-3')).toHaveClass('active');
        expect(inner.querySelectorAll('.carousel-item.active')).toHaveLength(1);
    });

    it.each([
        ['first', 'one', 'two', 'Slide 1'],
        ['middle', 'two', 'three', 'Slide 2']
    ] as const)('reactively pairs the remaining item and indicator after removing the active %s item', async (_, removed, active, label) => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselRegressionTest);

        if (removed === 'two') {
            await fireEvent.click(screen.getByTestId('indicator-two'));
            await vi.advanceTimersByTimeAsync(0);
        }

        await fireEvent.click(screen.getByTestId(`remove-${removed}`));

        const item = screen.getByTestId(`item-${active}`);
        const indicator = screen.getByTestId(`indicator-${active}`);
        expect(item).toHaveClass('active');
        expect(screen.getByTestId('regression-inner').querySelectorAll('.carousel-item.active')).toHaveLength(1);
        expect(indicator).toHaveClass('active');
        expect(indicator).toHaveAttribute('aria-current', 'true');
        expect(indicator).toHaveAttribute('aria-label', label);
        expect(screen.getByTestId('regression-indicators').querySelectorAll('.active')).toHaveLength(1);
    });

    it.each([
        ['slide', 'from', 'one', 'two'],
        ['slide', 'to', 'two', 'one'],
        ['fade', 'from', 'one', 'two'],
        ['fade', 'to', 'two', 'three'],
        ['none', 'to', 'two', 'one']
    ] as const)('invalidates a pending %s transition when its %s item is removed', async (animation, _, removed, active) => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselRegressionTest, { props: { animation, transitionDuration: 100 } });

        fireEvent.click(screen.getByTestId('regression-next'));
        fireEvent.click(screen.getByTestId(`remove-${removed}`));
        await vi.advanceTimersByTimeAsync(200);

        expect(screen.getByTestId(`item-${active}`)).toHaveClass('active');
        expect(screen.getByTestId(`indicator-${active}`)).toHaveAttribute('aria-current', 'true');
        expect(screen.getByTestId('regression-inner').querySelectorAll('.carousel-item.active')).toHaveLength(1);
        expect(screen.getByTestId('regression-indicators').querySelectorAll('.active')).toHaveLength(1);

        await vi.advanceTimersByTimeAsync(1_000);
        expect(screen.getByTestId(`item-${active}`)).toHaveClass('active');
        expect(screen.getByTestId('regression-inner').querySelectorAll('.carousel-item.active')).toHaveLength(1);
    });

    it('resumes ride=true autoplay after an unexpected terminal pointer event', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselRegressionTest, { props: { interval: 20, ride: true } });
        const carousel = screen.getByTestId('regression-carousel');

        fireEvent.pointerDown(carousel, { clientX: 100, isPrimary: true, pointerType: 'touch' });
        fireEvent.pointerUp(carousel, { clientX: 100, isPrimary: false, pointerType: 'mouse' });

        await vi.advanceTimersByTimeAsync(1_019);
        expect(screen.getByTestId('item-one')).toHaveClass('active');
        await vi.advanceTimersByTimeAsync(1);
        expect(screen.getByTestId('item-two')).toHaveClass('active');
    });

    it('holds ride=true autoplay for a full second after a swipe before applying the item interval', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselRegressionTest, { props: { interval: 20, ride: true } });
        const carousel = screen.getByTestId('regression-carousel');

        fireEvent.pointerDown(carousel, { clientX: 100, isPrimary: true, pointerType: 'touch' });
        fireEvent.pointerUp(carousel, { clientX: 0, isPrimary: true, pointerType: 'touch' });
        await vi.advanceTimersByTimeAsync(0);
        expect(screen.getByTestId('item-two')).toHaveClass('active');

        await vi.advanceTimersByTimeAsync(1_019);
        expect(screen.getByTestId('item-two')).toHaveClass('active');
        await vi.advanceTimersByTimeAsync(1);
        expect(screen.getByTestId('item-three')).toHaveClass('active');
    });

    it.each([Number.NaN, -1, 0])('falls back to the configured root interval for invalid item interval %s', async (itemInterval) => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselRegressionTest, { props: { interval: 40, itemInterval, ride: 'carousel' } });

        await vi.advanceTimersByTimeAsync(39);
        expect(screen.getByTestId('item-one')).toHaveClass('active');
        await vi.advanceTimersByTimeAsync(1);
        expect(screen.getByTestId('item-two')).toHaveClass('active');
    });

    it.each([Number.NaN, -1, 0])('normalizes invalid root interval %s to 5000ms', async (interval) => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselRegressionTest, { props: { interval, ride: 'carousel' } });

        await vi.advanceTimersByTimeAsync(4_999);
        expect(screen.getByTestId('item-one')).toHaveClass('active');
        await vi.advanceTimersByTimeAsync(1);
        expect(screen.getByTestId('item-two')).toHaveClass('active');
    });

    it.each(['slide', 'fade'] as const)('honors a zero-duration %s transition', async (animation) => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselRegressionTest, { props: { animation, transitionDuration: 0 } });

        expect(screen.getByTestId('item-one').getAttribute('style')).toContain('transition: transform 0s');
        fireEvent.click(screen.getByTestId('regression-next'));
        await vi.advanceTimersByTimeAsync(0);
        expect(screen.getByTestId('item-two')).toHaveClass('active');

        fireEvent.click(screen.getByTestId('regression-next'));
        await vi.advanceTimersByTimeAsync(0);
        expect(screen.getByTestId('item-three')).toHaveClass('active');
    });

    it.each([
        ['slide', -1],
        ['slide', Number.NaN],
        ['fade', -1],
        ['fade', Number.NaN]
    ] as const)('normalizes invalid %s transition duration %s to 600ms', async (animation, transitionDuration) => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselRegressionTest, { props: { animation, transitionDuration } });
        const next = screen.getByTestId('regression-next');

        expect(screen.getByTestId('item-one').getAttribute('style')).toContain('transition: transform 0.6s');
        fireEvent.click(next);
        await vi.advanceTimersByTimeAsync(599);
        fireEvent.click(next);
        await vi.advanceTimersByTimeAsync(1);
        expect(screen.getByTestId('item-two')).toHaveClass('active');

        fireEvent.click(next);
        await vi.advanceTimersByTimeAsync(animation === 'slide' ? 600 : 0);
        expect(screen.getByTestId('item-three')).toHaveClass('active');
    });

    it('clears a cancelled touch gesture without navigating', async () => {
        render(CarouselAdversarialTest);
        const carousel = screen.getByTestId('cancel-carousel');

        fireEvent.pointerDown(carousel, { clientX: 100, isPrimary: true, pointerType: 'touch' });
        fireEvent.pointerCancel(carousel, { clientX: 0, isPrimary: false, pointerType: 'mouse' });
        fireEvent.pointerUp(carousel, { clientX: 0, isPrimary: true, pointerType: 'touch' });

        expect(screen.getByTestId('cancel-item-1')).toHaveClass('active');
        expect(screen.queryByTestId('cancel-item-2')).not.toBeInTheDocument();
    });

    it('should atomically swap the active class between items when the slide transition commits', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselBasicTest);

        await fireEvent.click(screen.getByTestId('slide-carousel-control-next'));

        // Mid-transition (Bootstrap contract): the outgoing item still owns 'active'
        // plus its directional class; the incoming item is positioned via
        // carousel-item-next/-start but must NOT be 'active' yet.
        const outgoing = screen.getByTestId('slide-carousel-item-1');
        const incoming = screen.getByTestId('slide-carousel-item-2');
        expect(outgoing).toHaveClass('active');
        expect(outgoing).toHaveClass('carousel-item-start');
        expect(incoming).not.toHaveClass('active');
        expect(incoming).toHaveClass('carousel-item-next');
        expect(incoming).toHaveClass('carousel-item-start');

        // Advance past the default 600ms transition so the commit callback fires.
        await vi.advanceTimersByTimeAsync(700);

        // The incoming item now owns 'active' with no leftover directional classes...
        expect(incoming).toHaveClass('active');
        expect(incoming).not.toHaveClass('carousel-item-next');
        expect(incoming).not.toHaveClass('carousel-item-start');

        // ...and the outgoing item left the DOM at the same moment (Bootstrap hides it
        // synchronously at transition end). Pre-fix it lingered through a no-op exit
        // transition with a frozen 'carousel-item active carousel-item-start' class list,
        // leaving TWO simultaneously-active items.
        expect(screen.queryByTestId('slide-carousel-item-1')).not.toBeInTheDocument();
        expect(screen.getByTestId('slide-carousel-inner').querySelectorAll('.carousel-item.active')).toHaveLength(1);
    });

    it('should atomically swap the active class between items when the crossfade transition commits', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        render(CarouselBasicTest);

        await fireEvent.click(screen.getByTestId('crossfade-carousel-control-next'));

        await vi.advanceTimersByTimeAsync(700);

        const incoming = screen.getByTestId('crossfade-carousel-item-2');
        expect(incoming).toHaveClass('active');
        expect(incoming).not.toHaveClass('carousel-item-next');
        expect(incoming).not.toHaveClass('carousel-item-start');
        expect(screen.queryByTestId('crossfade-carousel-item-1')).not.toBeInTheDocument();
        expect(screen.getByTestId('crossfade-carousel-inner').querySelectorAll('.carousel-item.active')).toHaveLength(1);
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

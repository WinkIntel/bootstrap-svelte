import { Context } from '$lib/common/index.js';
import { tick } from 'svelte';
import type { Carousel } from './index.js';
import type { CarouselAnimation, CarouselItemDirection, CarouselItemOrder, CarouselPause, CarouselRide } from './types.js';

/**
 * Manages the state for the Carousel root component.
 * Handles the tracking of active slide, autoplay behavior, and transition control.
 */
export class CarouselRootState {
    // Public static constants...
    static readonly ANIMATION_DEFAULT: CarouselAnimation = 'none';
    static readonly INTERNAL_DEFAULT: number = 5000;
    static readonly PAUSE_DEFAULT: CarouselPause = 'hover';
    static readonly RIDE_DEFAULT: CarouselRide = false;
    static readonly TRANSITION_DURATION_DEFAULT: number = 600;

    // Private state properties...
    #activeItemIndex: number = $state(0); // Zero-based index for active item
    #animation: CarouselAnimation = $state(CarouselRootState.ANIMATION_DEFAULT);
    #hasUserInteraction: boolean = $state(false); // Used to delay autoplay until user interacts when ride=true
    #indicators: CarouselIndicatorButtonState[] = [];
    #interval: number = $state(0);
    #timeoutId: number | null = $state(null);
    #isAnimating: boolean = $state(false);
    #isHovered: boolean = $state(false);
    #isPaused: boolean = $state(true);
    #isPointerDown: boolean = $state(false);
    #items: CarouselItemState[] = [];
    #nextActiveItemIndex: number = $state(-1); // Tracks the index of the slide that will become active (-1 when no transition is pending)
    #pauseInteraction: CarouselPause = $state(CarouselRootState.PAUSE_DEFAULT);
    #pointerStartX: number = $state(0);
    #ride: CarouselRide = $state(false);
    #transitionDuration: number = $state(CarouselRootState.TRANSITION_DURATION_DEFAULT);
    #visibilityListener: (() => void) | null = null;

    // Public readonly properties...
    readonly isSlideAnimation = $derived.by(() => this.animation === 'slide');
    readonly isFadeAnimation = $derived.by(() => this.animation === 'fade');
    readonly isCrossfadeAnimation = $derived.by(() => this.animation === 'crossfade');
    readonly isNoneAnimation = $derived.by(() => this.animation === 'none');

    constructor(readonly props: Carousel.RootProps) {
        this.#animation = this.props.animation || CarouselRootState.ANIMATION_DEFAULT;
        this.#interval = this.props.interval || CarouselRootState.INTERNAL_DEFAULT;
        this.#pauseInteraction = this.props.pause !== undefined ? this.props.pause : CarouselRootState.PAUSE_DEFAULT;
        this.#ride = this.props.ride || CarouselRootState.RIDE_DEFAULT;
        this.#transitionDuration = this.props.transitionDuration || CarouselRootState.TRANSITION_DURATION_DEFAULT;

        this.registerItem = this.registerItem.bind(this);
        this.isItemActive = this.isItemActive.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.pause = this.pause.bind(this);
        this.cycle = this.cycle.bind(this);
        this.to = this.to.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);

        // Setup Page Visibility API listener
        if (typeof document !== 'undefined' && 'hidden' in document) {
            this.#visibilityListener = () => {
                if (document.hidden) {
                    this.pause();
                } else if (this.shouldCycle() && !this.#isHovered) {
                    this.cycle();
                }
            };
            document.addEventListener('visibilitychange', this.#visibilityListener);
        }

        // Start autoplay immediately in the browser if ride='carousel', otherwise wait for user interaction.
        // During static prerendering there is no browser timer API, so autoplay starts during hydration instead.
        if (typeof window !== 'undefined' && this.#ride === 'carousel' && !this.#timeoutId) {
            this.cycle();
        }
    }

    // Determines the appropriate interval duration, prioritizing the active item's specific interval
    private getCurrentItemInterval(): number {
        if (this.#items.length === 0) {
            return this.#interval;
        }

        const activeItem = this.#items[this.#activeItemIndex];
        if (activeItem && activeItem.interval) {
            return activeItem.interval;
        }

        return this.#interval;
    }

    // Determines if the carousel should auto-cycle based on configuration and user interaction state
    private shouldCycle(): boolean {
        return this.#ride === 'carousel' || (this.#ride === true && this.#hasUserInteraction);
    }

    get animation(): CarouselAnimation {
        return this.#animation;
    }

    set animation(animation: CarouselAnimation) {
        this.#animation = animation;
    }

    get pauseInteraction(): CarouselPause {
        return this.#pauseInteraction;
    }

    set pauseInteraction(value: CarouselPause) {
        this.#pauseInteraction = value;
    }

    get interval(): number {
        return this.#interval;
    }

    set interval(interval: number) {
        this.#interval = interval;
        if (this.shouldCycle()) {
            this.cycle();
        }
    }

    get ride(): CarouselRide {
        return this.#ride;
    }

    set ride(ride: CarouselRide) {
        this.#ride = ride;
        if (this.shouldCycle()) {
            this.cycle();
        } else {
            this.pause();
        }
    }

    get transitionDuration(): number {
        return this.#transitionDuration;
    }

    set transitionDuration(duration: number) {
        this.#transitionDuration = duration;
    }

    get isAnimating(): boolean {
        return this.#isAnimating;
    }

    registerItem(item: CarouselItemState): void {
        this.#items.push(item);
        // Activate the first item by default if none is active
        if (item.props.isActive && !this.#isAnimating) {
            this.#activeItemIndex = item.index;
        }
    }

    registerIndicator(indicator: CarouselIndicatorButtonState): void {
        this.#indicators.push(indicator);
    }

    isItemActive(index: number): boolean {
        return this.#activeItemIndex === index;
    }

    getActiveIndex(): number {
        return this.#activeItemIndex;
    }

    isNextItemActive(index: number): boolean {
        return this.#nextActiveItemIndex === index;
    }

    getNextActiveIndex(): number {
        return this.#nextActiveItemIndex;
    }

    getItemCount(): number {
        return this.#items.length;
    }

    getIndicatorCount(): number {
        return this.#indicators.length;
    }

    next(): void {
        if (this.#isAnimating) {
            return;
        }

        const nextIndex = (this.#activeItemIndex + 1) % this.#items.length;
        this.to(nextIndex, 'next');

        // Mark that user interaction has occurred
        this.#hasUserInteraction = true;

        // Start cycling if ride is true and this is first interaction
        if (this.#ride === true && !this.#timeoutId) {
            this.cycle();
        }
    }

    prev(): void {
        if (this.#isAnimating) {
            return;
        }

        const prevIndex = (this.#activeItemIndex - 1 + this.#items.length) % this.#items.length;
        this.to(prevIndex, 'prev');

        // Mark that user interaction has occurred
        this.#hasUserInteraction = true;

        // Start cycling if ride is true and this is first interaction
        if (this.#ride === true && !this.#timeoutId) {
            this.cycle();
        }
    }

    /**
     * Navigates to the slide at the specified index with the given transition direction.
     * Handles animation states and timing for different animation types.
     */
    to(index: number, transitionDirection: CarouselItemOrder): void {
        if (index === this.#activeItemIndex || this.#isAnimating) {
            console.warn(`[Carousel] Already on item ${this.#activeItemIndex}, ignoring to(${index})`);
            return;
        }
        if (this.#animation !== 'slide' && this.#animation !== 'fade' && this.#animation !== 'crossfade' && this.#animation !== 'none') {
            console.warn(`[Carousel] Unsupported animation type: ${this.#animation}`);
            return;
        }

        const isNext = transitionDirection === 'next';
        const isPrev = transitionDirection === 'prev';
        const toItem = this.#items[index];
        const fromItem = this.#items[this.#activeItemIndex];

        if (toItem === fromItem) {
            console.warn(`[Carousel] Attempting to transition to the same item ${index}, ignoring.`);
            return;
        }
        if (!toItem) {
            console.warn(`[Carousel] Item ${index} does not exist, ignoring transition.`);
            return;
        }
        if (!fromItem) {
            console.warn(`[Carousel] Active item ${this.#activeItemIndex} does not exist, ignoring transition.`);
            return;
        }

        this.#isAnimating = true;
        this.#nextActiveItemIndex = index;

        // For slide and crossfade animations, we set directional classes and clean up after transition
        if (this.#animation === 'slide' || this.#animation === 'crossfade') {
            if (isNext) {
                fromItem.direction = 'start';
                toItem.direction = 'start';
                toItem.order = 'next';
            }
            if (isPrev) {
                fromItem.direction = 'end';
                toItem.direction = 'end';
                toItem.order = 'prev';
            }
            setTimeout(() => {
                fromItem.order = undefined;
                fromItem.direction = undefined;
                toItem.order = undefined;
                toItem.direction = undefined;
                this.#activeItemIndex = index;
                this.#nextActiveItemIndex = -1;
                this.#isAnimating = false;

                // Restart cycle with new slide's interval if cycling
                if (this.shouldCycle() && !this.#isPaused) {
                    this.cycle();
                }
            }, this.#transitionDuration);
        }
        // For fade animation, we immediately change the active index but clean up classes after transition
        if (this.#animation === 'fade') {
            if (isNext) {
                toItem.order = 'next';
            }
            if (isPrev) {
                toItem.order = 'prev';
            }

            setTimeout(() => {
                toItem.order = undefined;
                this.#isAnimating = false;
            }, this.#transitionDuration / 2);

            this.#activeItemIndex = index;
            this.#nextActiveItemIndex = -1;

            // Restart cycle with new slide's interval if cycling
            if (this.shouldCycle() && !this.#isPaused) {
                this.cycle();
            }
        }
        // For no animation, we simply update the active index on the next tick
        if (this.#animation === 'none') {
            tick().then(() => {
                this.#activeItemIndex = index;
                this.#nextActiveItemIndex = -1;
                this.#isAnimating = false;

                // Restart cycle with new slide's interval if cycling
                if (this.shouldCycle() && !this.#isPaused) {
                    this.cycle();
                }
            });
        }
    }

    /**
     * Starts or restarts the autoplay cycle with the appropriate interval.
     * Uses the active slide's specific interval if available.
     */
    cycle(): void {
        if (typeof window === 'undefined') {
            return;
        }

        // Don't start cycling if we're hovered and pause='hover'
        if (this.#pauseInteraction === 'hover' && this.#isHovered) {
            return;
        }

        // Don't start cycling if the document is hidden
        if (typeof document !== 'undefined' && 'hidden' in document && document.hidden) {
            return;
        }

        // Clear any existing timeout
        this.pause();

        this.#isPaused = false;

        // Use the current active slide's interval or the default
        const currentInterval = this.getCurrentItemInterval();

        // Schedule the next slide using setTimeout
        this.#timeoutId = window.setTimeout(() => {
            if (!this.#isPaused && !this.#isAnimating) {
                this.next();
            } else if (!this.#isPaused) {
                // If we're animating, try again after a short delay
                this.cycle();
            }
        }, currentInterval);
    }

    pause(): void {
        if (typeof window === 'undefined') {
            return;
        }

        if (this.#timeoutId) {
            window.clearTimeout(this.#timeoutId);
            this.#timeoutId = null;
        }

        this.#isPaused = true;
    }

    handleMouseEnter(): void {
        this.#isHovered = true;
        if (this.#pauseInteraction === 'hover' && this.shouldCycle()) {
            this.pause();
        }
    }

    handleMouseLeave(): void {
        this.#isHovered = false;
        if (this.shouldCycle() && this.#pauseInteraction === 'hover') {
            this.cycle();
        }
    }

    handlePointerDown(pointerEvent: PointerEvent): void {
        // Only track primary touch pointer
        if (pointerEvent.pointerType === 'touch' && pointerEvent.isPrimary) {
            this.#isPointerDown = true;
            this.#pointerStartX = pointerEvent.clientX;

            // Pause autoplay during touch interaction
            if (this.shouldCycle()) {
                this.pause();
            }

            // Mark that user interaction has occurred
            this.#hasUserInteraction = true;
        }
    }

    handlePointerMove(pointerEvent: PointerEvent): void {
        // Skip if not tracking a touch
        if (!this.#isPointerDown || pointerEvent.pointerType !== 'touch' || !pointerEvent.isPrimary) {
            return;
        }

        // No need to do anything here, just track in pointerup
    }

    /**
     * Handles touch swipe gestures for mobile carousel navigation.
     * Determines swipe direction based on horizontal movement distance.
     */
    handlePointerUp(pointerEvent: PointerEvent): void {
        if (!this.#isPointerDown || pointerEvent.pointerType !== 'touch' || !pointerEvent.isPrimary) {
            return;
        }

        const deltaX = pointerEvent.clientX - this.#pointerStartX;

        // Consider it a swipe if movement exceeds threshold (50px)
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                this.prev(); // Swipe right means go to previous
            } else {
                this.next(); // Swipe left means go to next
            }
        }

        this.#isPointerDown = false;

        // Resume cycling after touch with a delay to prevent immediate transition
        if (this.shouldCycle()) {
            setTimeout(() => {
                this.cycle();
            }, 1000);
        }
    }

    dispose(): void {
        if (this.#timeoutId) {
            window.clearTimeout(this.#timeoutId);
            this.#timeoutId = null;
        }

        // Remove visibility change listener
        if (typeof document !== 'undefined' && this.#visibilityListener) {
            document.removeEventListener('visibilitychange', this.#visibilityListener);
            this.#visibilityListener = null;
        }
    }
}

/**
 * Manages the state for an individual Carousel item.
 * Tracks active state and provides methods to handle transitions.
 */
export class CarouselItemState {
    #order: CarouselItemOrder | undefined = $state(undefined);
    #direction: CarouselItemDirection | undefined = $state(undefined);

    readonly index: number;
    readonly interval: number;
    readonly isActive = $derived.by(() => this.root.isItemActive(this.index));
    readonly isNext = $derived(this.#order === 'next');
    readonly isPrev = $derived(this.#order === 'prev');
    // Used to determine whether this item should be in the DOM (active or transitioning)
    readonly isActiveOrWillBeActive = $derived.by(() => this.isActive || this.isNext || this.isPrev);
    readonly isEnd = $derived(this.#direction === 'end');
    readonly isStart = $derived(this.#direction === 'start');
    readonly isSlideAnimation = $derived.by(() => this.root.animation === 'slide');
    readonly isFadeAnimation = $derived.by(() => this.root.animation === 'fade');
    readonly isCrossfadeAnimation = $derived.by(() => this.root.animation === 'crossfade');
    readonly isNoneAnimation = $derived.by(() => this.root.animation === 'none');
    // These derived values determine which animation classes/behavior to apply
    readonly doSlideItem = $derived.by(() => this.isSlideAnimation && this.isActiveOrWillBeActive);
    readonly doFadeItem = $derived.by(() => this.isFadeAnimation && this.isActiveOrWillBeActive);
    readonly doCrossfadeItem = $derived.by(() => this.isCrossfadeAnimation && this.isActiveOrWillBeActive);
    readonly doShowImmediatelyItem = $derived.by(() => this.isNoneAnimation && this.isActiveOrWillBeActive);

    constructor(
        readonly props: Carousel.ItemProps,
        readonly root: CarouselRootState
    ) {
        this.index = this.root.getItemCount();
        this.interval = this.props.interval || 5000;
    }

    get order(): CarouselItemOrder | undefined {
        return this.#order;
    }
    set order(order: CarouselItemOrder | undefined) {
        this.#order = order;
    }
    get direction(): CarouselItemDirection | undefined {
        return this.#direction;
    }
    set direction(direction: CarouselItemDirection | undefined) {
        this.#direction = direction;
    }
}

/**
 * Manages the state for Carousel controls.
 * Handles previous actions and target identification.
 */
export class CarouselControlPrevState {
    constructor(
        readonly props: Carousel.ControlProps,
        readonly root: CarouselRootState
    ) {
        this.onclick = this.onclick.bind(this);
    }

    onclick(event: Event): void {
        event.preventDefault();
        this.root.prev();
    }
}

/**
 * Manages the state for Carousel controls.
 * Handles next actions and target identification.
 */
export class CarouselControlNextState {
    constructor(
        readonly props: Carousel.ControlProps,
        readonly root: CarouselRootState
    ) {
        this.onclick = this.onclick.bind(this);
    }

    onclick(event: Event): void {
        event.preventDefault();
        this.root.next();
    }
}

/**
 * Manages the state for Carousel indicator buttons.
 * Tracks active state and provides methods to handle clicks.
 */
export class CarouselIndicatorButtonState {
    isActive = $derived.by(() => this.root.isItemActive(this.index) && !this.root.isAnimating);
    isNextActive = $derived.by(() => this.root.isNextItemActive(this.index));

    readonly index: number;

    constructor(
        readonly props: Carousel.IndicatorButtonProps,
        readonly root: CarouselRootState
    ) {
        this.index = this.root.getIndicatorCount();
        this.onclick = this.onclick.bind(this);
    }

    onclick(event: Event): void {
        event.preventDefault();
        const order = this.index > this.root.getActiveIndex() ? 'next' : 'prev';
        this.root.to(this.index, order);
    }
}

const CarouselRootContext = new Context<CarouselRootState>('carousel-root');

/**
 * Creates and initializes the Carousel root state.
 * This function is used to set up the context for the Carousel component.
 * @param props - The props for the Carousel root component.
 * @returns The created CarouselRootState instance.
 */
export function initCarouselRootState(props: Carousel.RootProps): CarouselRootState {
    const rootState = new CarouselRootState(props);
    return CarouselRootContext.set(rootState);
}

/**
 * Creates and initializes the Carousel item state.
 * This function is used to set up the state for a Carousel item.
 * @param props - The props for the Carousel item.
 * @param index - The index of the item in the carousel.
 * @returns The created CarouselItemState instance.
 */
export function initCarouselItemState(props: Carousel.ItemProps): CarouselItemState {
    if (!CarouselRootContext.exists()) {
        throw new Error('Carousel.Item requires Carousel.Root context. Please ensure Carousel.Root is initialized before Carousel.Item.');
    }
    const rootState = CarouselRootContext.get();
    const itemState = new CarouselItemState(props, rootState);
    rootState.registerItem(itemState);
    return itemState;
}

/**
 * Creates and initializes the Carousel control state.
 * This function is used to set up the state for a Carousel control button.
 * @param props - The props for the Carousel control.
 * @returns The created CarouselControlState instance.
 */
export function initCarouselControlPrevState(props: Carousel.ControlProps): CarouselControlPrevState {
    if (!CarouselRootContext.exists()) {
        throw new Error('Carousel.Control requires Carousel.Root context. Please ensure Carousel.Root is initialized before Carousel.Control.');
    }
    const rootState = CarouselRootContext.get();
    return new CarouselControlPrevState(props, rootState);
}
export function initCarouselControlNextState(props: Carousel.ControlProps): CarouselControlNextState {
    if (!CarouselRootContext.exists()) {
        throw new Error('Carousel.Control requires Carousel.Root context. Please ensure Carousel.Root is initialized before Carousel.Control.');
    }
    const rootState = CarouselRootContext.get();
    return new CarouselControlNextState(props, rootState);
}

/**
 * Creates and initializes the Carousel indicator button state.
 * This function is used to set up the state for a Carousel indicator button.
 * @param props - The props for the Carousel indicator button.
 * @returns The created CarouselIndicatorButtonState instance.
 */
export function initCarouselIndicatorButtonState(props: Carousel.IndicatorButtonProps): CarouselIndicatorButtonState {
    if (!CarouselRootContext.exists()) {
        throw new Error(
            'Carousel.IndicatorButton requires Carousel.Root context. Please ensure Carousel.Root is initialized before Carousel.IndicatorButton.'
        );
    }
    const rootState = CarouselRootContext.get();
    const indicatorState = new CarouselIndicatorButtonState(props, rootState);
    rootState.registerIndicator(indicatorState);
    return indicatorState;
}

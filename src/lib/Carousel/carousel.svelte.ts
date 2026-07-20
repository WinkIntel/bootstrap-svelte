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

    static normalizeInterval(value: unknown): number {
        return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : CarouselRootState.INTERNAL_DEFAULT;
    }

    static normalizeTransitionDuration(value: unknown): number {
        return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : CarouselRootState.TRANSITION_DURATION_DEFAULT;
    }

    // Private state properties...
    #activeItemIndex: number = $state(0); // Zero-based index for active item
    #animation: CarouselAnimation = $state(CarouselRootState.ANIMATION_DEFAULT);
    #hasUserInteraction: boolean = $state(false); // Used to delay autoplay until user interacts when ride=true
    #indicators: CarouselIndicatorButtonState[] = $state([]);
    #hasStarted = false;
    #interval: number = $state(0);
    #timeoutId: number | null = $state(null);
    #pendingTimeoutIds: number[] = [];
    #isDisposed = false;
    #isAnimating: boolean = $state(false);
    #isHovered: boolean = $state(false);
    #isPaused: boolean = $state(true);
    #isPointerDown: boolean = $state(false);
    #isTouchGesture = false;
    #items: CarouselItemState[] = $state([]);
    #nextActiveItemIndex: number = $state(-1); // Tracks the index of the slide that will become active (-1 when no transition is pending)
    #pauseInteraction: CarouselPause = $state(CarouselRootState.PAUSE_DEFAULT);
    #pointerStartX: number = $state(0);
    #resumeTimeoutId: number | null = null;
    #ride: CarouselRide = $state(false);
    #transitionDuration: number = $state(CarouselRootState.TRANSITION_DURATION_DEFAULT);
    #transitionGeneration = 0;
    #transitionTimeoutId: number | null = null;
    #visibilityListener: (() => void) | null = null;

    // Public readonly properties...
    readonly isSlideAnimation = $derived.by(() => this.animation === 'slide');
    readonly isFadeAnimation = $derived.by(() => this.animation === 'fade');
    readonly isCrossfadeAnimation = $derived.by(() => this.animation === 'crossfade');
    readonly isNoneAnimation = $derived.by(() => this.animation === 'none');

    constructor(readonly props: Carousel.RootProps) {
        this.#animation = this.props.animation || CarouselRootState.ANIMATION_DEFAULT;
        this.#interval = CarouselRootState.normalizeInterval(this.props.interval);
        this.#pauseInteraction = this.props.pause !== undefined ? this.props.pause : CarouselRootState.PAUSE_DEFAULT;
        this.#ride = this.props.ride || CarouselRootState.RIDE_DEFAULT;
        this.#transitionDuration = CarouselRootState.normalizeTransitionDuration(this.props.transitionDuration);

        this.registerItem = this.registerItem.bind(this);
        this.unregisterItem = this.unregisterItem.bind(this);
        this.unregisterIndicator = this.unregisterIndicator.bind(this);
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
        this.handlePointerCancel = this.handlePointerCancel.bind(this);

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
    }

    // Determines the appropriate interval duration, prioritizing the active item's specific interval
    private getCurrentItemInterval(): number {
        if (this.#items.length === 0) {
            return this.#interval;
        }

        const activeItem = this.#items[this.#activeItemIndex];
        if (activeItem?.interval !== undefined) {
            return typeof activeItem.interval === 'number' && Number.isFinite(activeItem.interval) && activeItem.interval > 0
                ? activeItem.interval
                : this.#interval;
        }

        return this.#interval;
    }

    // Determines if the carousel should auto-cycle based on configuration and user interaction state
    private shouldCycle(): boolean {
        return this.#ride === 'carousel' || (this.#ride === true && this.#hasUserInteraction);
    }

    // Schedules a setTimeout whose id is tracked so dispose() can cancel it if the
    // instance is torn down before the callback fires. The id de-registers itself
    // once the callback runs, keeping #pendingTimeoutIds from growing unbounded.
    #schedule(callback: () => void, delay: number): number {
        const timeoutId = window.setTimeout(() => {
            this.#pendingTimeoutIds = this.#pendingTimeoutIds.filter((id) => id !== timeoutId);
            callback();
        }, delay);
        this.#pendingTimeoutIds.push(timeoutId);
        return timeoutId;
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
        this.#interval = CarouselRootState.normalizeInterval(interval);
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
        this.#transitionDuration = CarouselRootState.normalizeTransitionDuration(duration);
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
        if (this.#hasStarted && this.#items.length === 2 && this.shouldCycle()) {
            this.cycle();
        }
    }

    unregisterItem(item: CarouselItemState): void {
        const removedIndex = this.#items.indexOf(item);
        if (removedIndex === -1) {
            return;
        }

        this.#invalidateTransition();
        this.#items.splice(removedIndex, 1);
        if (this.#items.length === 0) {
            this.#activeItemIndex = 0;
            this.#nextActiveItemIndex = -1;
            this.#isAnimating = false;
            this.pause();
            return;
        }

        if (removedIndex < this.#activeItemIndex) {
            this.#activeItemIndex--;
        } else if (removedIndex === this.#activeItemIndex) {
            this.#activeItemIndex = Math.min(removedIndex, this.#items.length - 1);
        }

        if (removedIndex < this.#nextActiveItemIndex) {
            this.#nextActiveItemIndex--;
        } else if (removedIndex === this.#nextActiveItemIndex) {
            this.#nextActiveItemIndex = -1;
        }
    }

    registerIndicator(indicator: CarouselIndicatorButtonState): void {
        this.#indicators.push(indicator);
    }

    unregisterIndicator(indicator: CarouselIndicatorButtonState): void {
        const index = this.#indicators.indexOf(indicator);
        if (index !== -1) {
            this.#indicators.splice(index, 1);
        }
    }

    getItemIndex(item: CarouselItemState): number {
        return this.#items.indexOf(item);
    }

    getIndicatorIndex(indicator: CarouselIndicatorButtonState): number {
        return this.#indicators.indexOf(indicator);
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

    registerUserInteraction(): void {
        this.#hasUserInteraction = true;
        if (!this.#isTouchGesture && this.#ride === true && !this.#timeoutId) {
            this.cycle();
        }
    }

    next(): void {
        if (this.#isAnimating || this.#items.length < 2) {
            return;
        }

        const nextIndex = (this.#activeItemIndex + 1) % this.#items.length;
        this.to(nextIndex, 'next');

        // Mark that user interaction has occurred
        this.registerUserInteraction();
    }

    prev(): void {
        if (this.#isAnimating || this.#items.length < 2) {
            return;
        }

        const prevIndex = (this.#activeItemIndex - 1 + this.#items.length) % this.#items.length;
        this.to(prevIndex, 'prev');

        // Mark that user interaction has occurred
        this.registerUserInteraction();
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
        const generation = ++this.#transitionGeneration;

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
            this.#transitionTimeoutId = this.#schedule(() => {
                this.#transitionTimeoutId = null;
                if (generation !== this.#transitionGeneration || !this.#items.includes(fromItem) || !this.#items.includes(toItem)) {
                    return;
                }
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

            this.#transitionTimeoutId = this.#schedule(() => {
                this.#transitionTimeoutId = null;
                if (generation !== this.#transitionGeneration || !this.#items.includes(toItem)) {
                    return;
                }
                toItem.order = undefined;
                this.#isAnimating = false;
            }, this.#transitionDuration);

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
                if (generation !== this.#transitionGeneration || !this.#items.includes(fromItem) || !this.#items.includes(toItem)) {
                    return;
                }
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
        if (this.#isDisposed || !this.shouldCycle() || this.#items.length < 2) {
            return;
        }

        // A mount/start or reactive ride update can race with an in-progress touch.
        // Keep the carousel paused until the single delayed touch resume fires.
        if (this.#isPointerDown || this.#resumeTimeoutId !== null) {
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
            this.#timeoutId = null;
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
            this.#cancelTouchResume();
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
        if (!this.#isPointerDown) {
            return;
        }

        this.#isPointerDown = false;
        if (pointerEvent.pointerType !== 'touch' || !pointerEvent.isPrimary) {
            this.#scheduleTouchResume();
            return;
        }

        const deltaX = pointerEvent.clientX - this.#pointerStartX;

        // Consider it a swipe if movement exceeds threshold (50px)
        if (Math.abs(deltaX) > 50) {
            this.#isTouchGesture = true;
            if (deltaX > 0) {
                this.prev(); // Swipe right means go to previous
            } else {
                this.next(); // Swipe left means go to next
            }
            this.#isTouchGesture = false;
        }

        // Resume cycling after touch with a delay to prevent immediate transition
        this.#scheduleTouchResume();
    }

    handlePointerCancel(): void {
        if (!this.#isPointerDown) {
            return;
        }
        this.#isPointerDown = false;
        this.#scheduleTouchResume();
    }

    #invalidateTransition(): void {
        this.#transitionGeneration++;
        if (this.#transitionTimeoutId !== null) {
            window.clearTimeout(this.#transitionTimeoutId);
            this.#pendingTimeoutIds = this.#pendingTimeoutIds.filter((id) => id !== this.#transitionTimeoutId);
            this.#transitionTimeoutId = null;
        }
        for (const item of this.#items) {
            item.order = undefined;
            item.direction = undefined;
        }
        this.#nextActiveItemIndex = -1;
        this.#isAnimating = false;
    }

    #cancelTouchResume(): void {
        if (this.#resumeTimeoutId === null) {
            return;
        }
        window.clearTimeout(this.#resumeTimeoutId);
        this.#pendingTimeoutIds = this.#pendingTimeoutIds.filter((id) => id !== this.#resumeTimeoutId);
        this.#resumeTimeoutId = null;
    }

    #scheduleTouchResume(): void {
        this.#cancelTouchResume();
        if (!this.shouldCycle() || this.#isDisposed) {
            return;
        }
        this.#schedule(() => {
            this.#resumeTimeoutId = null;
            if (!this.#isDisposed && this.shouldCycle()) {
                this.cycle();
            }
        }, 1000);
        this.#resumeTimeoutId = this.#pendingTimeoutIds.at(-1) ?? null;
    }

    start(): void {
        this.#hasStarted = true;
        if (this.shouldCycle()) {
            this.cycle();
        }
    }

    dispose(): void {
        this.#isDisposed = true;
        this.#invalidateTransition();
        this.#cancelTouchResume();

        if (this.#timeoutId) {
            window.clearTimeout(this.#timeoutId);
            this.#timeoutId = null;
        }

        for (const id of this.#pendingTimeoutIds) {
            window.clearTimeout(id);
        }
        this.#pendingTimeoutIds = [];

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

    get index(): number {
        return this.root.getItemIndex(this);
    }
    get interval(): number | undefined {
        return this.props.interval;
    }
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
    ) {}

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

    get index(): number {
        return this.root.getIndicatorIndex(this);
    }

    constructor(
        readonly props: Carousel.IndicatorButtonProps,
        readonly root: CarouselRootState
    ) {
        this.onclick = this.onclick.bind(this);
    }

    onclick(event: Event): void {
        event.preventDefault();
        this.root.registerUserInteraction();
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

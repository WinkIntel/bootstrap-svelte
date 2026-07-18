import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, vi } from 'vitest';

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    enumerable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    }))
});

// Timer-clear thunks for animations whose auto-finish timer is still pending.
// A timer that outlives its test file fires after the jsdom environment is
// torn down, where `Event` resolves to a different realm and dispatchEvent
// throws — Vitest reports that as an unhandled error and fails the run.
const pendingAnimationTimers = new Set<() => void>();

afterEach(() => {
    for (const clearTimer of pendingAnimationTimers) {
        clearTimer();
    }
    pendingAnimationTimers.clear();
});

// add more mocks here if you need them
beforeAll(() => {
    // Pin the realm's Event constructor so a late finish()/cancel() always
    // dispatches an Event from the same realm as this class's EventTarget.
    const RealmEvent = Event;
    const runningAnimations = new WeakMap<Element, Set<Animation>>();

    class MockAnimation extends EventTarget {
        playState: AnimationPlayState = 'running';
        currentTime: number | null = 0;
        onfinish: ((ev: AnimationPlaybackEvent) => void) | null = null;
        oncancel: ((ev: AnimationPlaybackEvent) => void) | null = null;
        effect: AnimationEffect;
        finished: Promise<Animation>;

        #resolveFinished!: (a: Animation) => void;
        #duration: number;
        #timer: ReturnType<typeof setTimeout> | null = null;
        #element: Element;
        #clearTimer = () => {
            if (this.#timer !== null) {
                clearTimeout(this.#timer);
                this.#timer = null;
            }
        };

        constructor(element: Element, keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: number | KeyframeEffectOptions) {
            super();
            this.#element = element;
            this.#duration = typeof options === 'number' ? options : Number(options?.duration ?? 0);
            this.finished = new Promise((resolve) => (this.#resolveFinished = resolve));
            this.effect = {
                getComputedTiming: () => ({
                    duration: this.#duration,
                    activeDuration: this.#duration,
                    endTime: this.#duration,
                    progress: this.playState === 'finished' ? 1 : 0
                }),
                getKeyframes: () => (Array.isArray(keyframes) ? keyframes : []),
                getTiming: () => ({ duration: this.#duration })
            } as unknown as AnimationEffect;
            // Auto-finish after the declared duration so both real and fake
            // timers drive animations to completion.
            this.#timer = setTimeout(() => this.finish(), this.#duration);
            pendingAnimationTimers.add(this.#clearTimer);
        }

        play() {
            this.playState = 'running';
        }
        pause() {
            this.playState = 'paused';
        }

        finish() {
            if (this.playState === 'finished') return;
            this.#clear();
            this.playState = 'finished';
            this.currentTime = this.#duration;
            const event = new RealmEvent('finish') as AnimationPlaybackEvent;
            this.onfinish?.(event);
            this.dispatchEvent(event);
            this.#resolveFinished(this as unknown as Animation);
        }

        cancel() {
            if (this.playState === 'finished' || this.playState === 'idle') return;
            this.#clear();
            this.playState = 'idle';
            this.currentTime = null;
            const event = new RealmEvent('cancel') as AnimationPlaybackEvent;
            this.oncancel?.(event);
            this.dispatchEvent(event);
            // Resolve (not reject) to avoid unhandled rejections in code that
            // awaits `finished` without a catch.
            this.#resolveFinished(this as unknown as Animation);
        }

        #clear() {
            this.#clearTimer();
            pendingAnimationTimers.delete(this.#clearTimer);
            runningAnimations.get(this.#element)?.delete(this as unknown as Animation);
        }
    }

    Element.prototype.animate = function (keyframes, options) {
        const animation = new MockAnimation(this, keyframes as Keyframe[], options as KeyframeEffectOptions) as unknown as Animation;
        let set = runningAnimations.get(this);
        if (!set) {
            set = new Set();
            runningAnimations.set(this, set);
        }
        set.add(animation);
        return animation;
    };
    Element.prototype.getAnimations = function () {
        return Array.from(runningAnimations.get(this) ?? []);
    };
});
